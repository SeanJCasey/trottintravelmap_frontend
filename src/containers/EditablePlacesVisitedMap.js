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
    this.totalStats = {};

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

  calculateVisitedStats(placesVisted, places) {
    let stats = {
      areaVisited: 0,
      placeCountVisited: 0,
      countryCountVisited: 0,
      continentCountVisited: 0,
      regionCountVisited: 0
    };
    if (placesVisted.length && places.length) {
      // Calculated Visited stats
      const visitedCountryIdSet = new Set();
      const visitedContinentIdSet = new Set();
      const visitedRegionSet = new Set();
      stats['areaVisited'] = 0;
      for (const placeID of placesVisted) {
        const place = places.find(place => place.id === placeID);
        // If visitedCountry hasn't been added, add its area to the tally
        if (!visitedCountryIdSet.has(place.country.id)) {
          stats['areaVisited'] += place.country.area;
        }

        // Add country, continent, and regions to sets to track unique items
        visitedCountryIdSet.add(place.country.id);
        visitedContinentIdSet.add(place.continent);
        visitedRegionSet.add(place.region);
      }
      stats['placeCountVisited'] = placesVisted.length;
      stats['countryCountVisited'] = visitedCountryIdSet.size;
      stats['continentCountVisited'] = visitedContinentIdSet.size;
      stats['regionCountVisited'] = visitedRegionSet.size;
    }

    return stats;
  }

  componentDidMount() {
    // Set component level vars based on Places, which are unchanging
    fetchRemotePlaces()
      .then(result => {
        this.places = result.data;
        this.placesByRegion = createOrderedPlacesByRegionObj(this.places);
        this.totalStats = calculateTotalStats(this.places);
      })
      .then(() => this.setState({ placesLoaded: true }))
      .catch(error => this.setState({ error }));

    // If there is a JWT Token in storage, set user and their placemap
    if (localStorage.getItem('jwtToken')) {
      this.setUserFromStorageToken();
    }
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

  createPlaceMapForUserID(userID) {
    const { placesVisited } = this.state.placemap;

    // TODO - handle errors
    return createRemotePlaceMap(userID, placesVisited)
      .then(result => {
        this.setState({
          placemap: {
            id: result.response.data.id,
            // placesVisited: result.response.data.places
          }
        });
        return result.response.data;
      })
      .catch(error => console.log(error.response));
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
            name: result.data.email
          }
        })
        return result.data;
      });
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
    this.setState(this.constructInitialState());
  }

  updateRemotePlacesVisited(placesVisited) {
    // TODO - handle errors
    return updateRemotePlaceMap(this.state.placemap.id, placesVisited)
      .catch(error => console.log(error.response));
  }

  render() {
    const { placesVisited } = this.state.placemap;
    const visitedStats = this.calculateVisitedStats(placesVisited, this.places);
    let stats = {...this.totalStats, ...visitedStats};

    return (
      <div className="traveler-map">
        <PlacesVisitedMap
          places={this.places}
          visitedPlaces={placesVisited}
        />
        {this.state.user.id ?
          <UserAccountOptionsBlock
            userName={this.state.user.name}
            onUserLogout={this.handleUserLogout}
          /> :
          <UserLoginBlock
            toggleUserLoggedIn={this.toggleUserLoggedIn}
          />}
        <StatBlocksRow stats={stats} />
        <FilterablePlaces placesByRegion={this.placesByRegion}
                          visitedPlaces={placesVisited}
                          onPlaceRowChange={(e) => this.handlePlaceRowChange(e)}
        />
      </div>
    );
  }
}

function calculateTotalStats(places) {
  let stats = {
    'areaTotal': 0,
    'placeCountTotal': 0,
    'countryCountTotal': 0,
    'continentCountTotal': 0,
    'regionCountTotal': 0
  };
  if (places) {
    const countryIdSet = new Set();
    const continentIdSet = new Set();
    const regionSet = new Set();
    for (const place of places) {
      // If visitedCountry hasn't been added, add its area to the tally
      if (!countryIdSet.has(place.country.id)) {
        stats['areaTotal'] += place.country.area;
        countryIdSet.add(place.country.id);
      }

      // Add country, continent, and regions to sets to track unique items
      continentIdSet.add(place.continent);
      regionSet.add(place.region);
    }
    stats['placeCountTotal'] = places.length;
    stats['countryCountTotal'] = countryIdSet.size;
    stats['continentCountTotal'] = continentIdSet.size;
    stats['regionCountTotal'] = regionSet.size;
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
