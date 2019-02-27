import React, { Component } from 'react';
import axios from 'axios';
import decode from 'jwt-decode';

import { createRemotePlaceMap, fetchRemotePlaceMap, fetchRemotePlaces,
         fetchRemoteUser, updateRemotePlaceMap } from '../apiRouters';
import FilterablePlaces from './FilterablePlaces';
import PlacesVisitedMap from '../components/PlacesVisitedMap';
import StatBlocksRow from '../components/StatBlocksRow';
import UserAccountOptionsBlock from '../components/UserAccountOptionsBlock';
import UserLoginBlock from './UserLoginBlock';


// TODO: Move stat caculations when we decide state
class EditablePlacesVisitedMap extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ...this.constructInitialUserState(),
      placesLoaded: false
    };

    this.places = [];
    this.placesByRegion = {};
    this.statsTotal = {};

    this.handlePlaceRowChange = this.handlePlaceRowChange.bind(this);
    this.fetchPlaceMapByID = this.fetchPlaceMapByID.bind(this);
    this.fetchUserByID = this.fetchUserByID.bind(this);
    this.handleUserLogout = this.handleUserLogout.bind(this);
    this.setUserFromStorageToken = this.setUserFromStorageToken.bind(this);
    this.toggleUserLoggedIn = this.toggleUserLoggedIn.bind(this);
    this.updateRemotePlacesVisited = this.updateRemotePlacesVisited.bind(this);
  }

  constructInitialUserState() {
    return {
      placemap: {
        id: null,
        placesVisited: []
      },
      user: {
        id: null,
        name: null,
        email: null
      }
    };
  }

  componentDidMount() {
    // Set component level vars based on Places, which are unchanging
    fetchRemotePlaces()
      .then(result => {
        this.places = result.data;
        this.placesByRegion = createOrderedPlacesByRegionObj(this.places);
        this.statsTotal = calculateStatsForPlaces(this.places);
      })
      .then(() => this.setState({ placesLoaded: true }))
      .catch(error => this.setState({ error }));

    // If there is a JWT Token in storage, set user and their placemap
    if (localStorage.getItem('jwtToken')) {
      this.setUserFromStorageToken();
    }
  }

  createPlaceMapForUserID(userID) {
    const placemap = this.state.placemap;

    // TODO - handle errors
    return createRemotePlaceMap(userID, placemap.placesVisited)
      .then(result => {
        this.setState({
          placemap: {
            ...placemap,
            id: result.data.id,
          }
        });
        return result.data;
      })
      .catch(error => console.log(error));
  }

  fetchPlaceMapByID(placemapID) {
    // TODO - handle errors
    return fetchRemotePlaceMap(placemapID)
      .then(result => {
        this.setState({
          placemap: {
            id: result.data.id,  // prob redundant, but might as well set
            placesVisited: result.data.places
          }
        });
        return result.data;
      });
  }

  fetchUserByID(userID) {
    // TODO - handle errors
    return fetchRemoteUser(userID)
      .then(result => {
        this.setState({
          user: {
            id: result.data.id,
            email: result.data.email,
            name: result.data.name
          }
        })
        return result.data;
      });
  }

  handlePlaceRowChange(event) {
    const { placemap } = this.state;
    const placeID = Number(event.target.value);
    let placesVisited = placemap.placesVisited.slice();
    if (placesVisited.includes(placeID)) {
      placesVisited = placesVisited.filter(item => item !== placeID);
    }
    else {
      placesVisited.push(placeID);
    }

    // Update state with new placesVisited and also update the remote db
    this.setState({
      placemap: {
        ...this.state.placemap,
        placesVisited: placesVisited
      }
    });
    if (placemap.id) {
      this.updateRemotePlacesVisited(placesVisited);
    }
  }

  handleUserLogout() {
    this.unsetUser();
  }

  setUserFromStorageToken() {
    if (localStorage.getItem('jwtToken')) {
      const jwtToken = localStorage.getItem('jwtToken');

      // Set default Auth token for all requests
      axios.defaults.headers.common["Authorization"] = `JWT ${jwtToken}`;

      // Set user and placemap states
      const decoded = decode(jwtToken);
      // Fetch User data first to ensure JWT validity and get fields
      this.fetchUserByID(decoded.user_id)
        .then(user => {
          if (user.placemap) {
            this.fetchPlaceMapByID(user.placemap);
          }
          else {
            this.createPlaceMapForUserID(user.id);
          }
        })
        .catch(error => console.log(error));
    }
  }

  toggleUserLoggedIn() {
    this.setUserFromStorageToken()
  }

  unsetUser() {
    // Remove JWT from local storage
    localStorage.removeItem('jwtToken');

    // Remove JWT from axios header
    delete axios.defaults.headers.common["Authorization"];

    // Reset state to initial conditions
    this.setState(this.constructInitialUserState());
  }

  updateRemotePlacesVisited(placesVisited) {
    // TODO - handle errors
    return updateRemotePlaceMap(this.state.placemap.id, placesVisited)
      .catch(error => console.log(error.response));
  }

  render() {
    const { placemap, user } = this.state;
    const { places, placesByRegion, statsTotal } = this;

    // Associate placesVisited IDs with their places for stat calcs
    // TODO - Re-do check to make sure places is not empty array
    let placesVisitedObjects = []
    if (places.length) {
      placesVisitedObjects = placemap.placesVisited.map(placeID =>
        places.find(place => place.id === placeID)
      );
    }
    const statsVisited = calculateStatsForPlaces(placesVisitedObjects);

    return (
      <div className="traveler-map">
        <PlacesVisitedMap
          places={places}
          visitedPlaces={placemap.placesVisited}
        />
        <div className="main-content-wrapper">
          <div className="container">
            {user.id ?
              <h1>{user.name}'s Travel Map</h1> :
              <h1>Fill In Your Travel Map</h1>
            }
            {user.id &&
              <UserAccountOptionsBlock
                userName={user.name}
                onUserLogout={this.handleUserLogout}
              />}
            <StatBlocksRow
              statsTotal={statsTotal}
              statsVisited={statsVisited}
            />
            <FilterablePlaces placesByRegion={placesByRegion}
                              visitedPlaces={placemap.placesVisited}
                              onPlaceRowChange={(e) => this.handlePlaceRowChange(e)}
            />
          </div>
        </div>
        {!user.id &&
          <UserLoginBlock
            toggleUserLoggedIn={this.toggleUserLoggedIn}
          />
        }
      </div>
    );
  }
}

function calculateStatsForPlaces(places) {
  let stats = {
    'area': 0,
    'placeCount': 0,
    'countryCount': 0,
    'continentCount': 0,
    'regionCount': 0
  };
  if (places.length) {
    const countryIdSet = new Set();
    const continentIdSet = new Set();
    const regionSet = new Set();
    for (const place of places) {
      // If country hasn't been added, add its area to the tally
      if (!countryIdSet.has(place.country.id)) {
        stats['area'] += place.country.area;
        countryIdSet.add(place.country.id);
      }

      // Add country, continent, and regions to sets to track unique items
      continentIdSet.add(place.continent);
      regionSet.add(place.region);
    }
    stats['placeCount'] = places.length;
    stats['countryCount'] = countryIdSet.size;
    stats['continentCount'] = continentIdSet.size;
    stats['regionCount'] = regionSet.size;
  }
  return stats;
}

function createOrderedPlacesByRegionObj(places) {
  // Create unordered places by region obj
  let placesByRegion = {};
  for (const place of places) {
    if (!(place.region in placesByRegion)) {
      placesByRegion[place.region] = [];
    }
    placesByRegion[place.region].push(place);
  }

  // Order regions and places alphabetically
  let orderedPlacesByRegion = {};
  Object.keys(placesByRegion).sort()
    .forEach(key => orderedPlacesByRegion[key] = placesByRegion[key].sort(
      (a, b) => a.name.localeCompare(b.name))
    );

  return orderedPlacesByRegion;
}

export default EditablePlacesVisitedMap;
