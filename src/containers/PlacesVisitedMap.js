import React, { Component } from 'react';

import { fetchRemotePlaceMap, fetchRemotePlaces } from '../apiRouters';
import { calculateStatsForPlaces } from '../utils';
import EditablePlacesVisitedMap from './EditablePlacesVisitedMap';
import StaticPlacesVisitedMap from '../components/StaticPlacesVisitedMap';


// TODO: Move stat caculations when we decide state
class PlacesVisitedMap extends Component {
  constructor(props) {
    super(props);

    this.state = {
      placesLoaded: false,
      placemapLoaded: false
    };

    this.places = [];
    this.placesByRegion = {};
    this.placemap = null;
    this.statsTotal = {};
  }

  // TODO - redirect if no user at attempted url
  componentDidMount() {
    // Set PlaceMap from url param if present
    if (this.props.match.params.userSlug) {
      this.setPlaceMapForUserSlug(this.props.match.params.userSlug);
    }

    // Set component level vars based on Places, which are unchanging
    fetchRemotePlaces()
      .then(result => {
        this.places = result.data;
        this.placesByRegion = createOrderedPlacesByRegionObj(this.places);
        this.statsTotal = calculateStatsForPlaces(this.places);
      })
      .then(() => this.setState({ placesLoaded: true }))
      .catch(error => this.setState({ error }));
  }

  componentDidUpdate(prevProps) {
    // If the user is editing their own map...
    if (!this.props.match.params.userSlug) {

      // If an active user has just been loaded, load their map
      if (this.props.user.slug &&
          this.props.user.slug !== prevProps.user.slug) {
        this.setPlaceMapForUserSlug(this.props.user.slug);
      }
      // If an active user has just been removed, reset the map
      if (!this.props.user.slug && prevProps.user.slug) {
        this.unsetPlaceMap();
      }
    }
  }

  fetchPlaceMapByUserSlug(userSlug) {
    // TODO - handle errors
    return fetchRemotePlaceMap(userSlug)
      .then(result => {
        return {
          placesVisited: result.data.places,
          owner: {
            name: result.data.user.name,
            slug: userSlug
          }
        }
      })
      .catch(error => console.log(error));
  }

  setPlaceMapForUserSlug(userSlug) {
    this.fetchPlaceMapByUserSlug(userSlug)
      .then(placemap => {
        this.placemap = placemap;
        this.setState({ placemapLoaded: true });
      });
  }

  unsetPlaceMap() {
    this.placemap = null;
    this.setState({ placemapLoaded: false })
  }

  render() {
    const { placesLoaded, placemapLoaded } = this.state;
    const { user, setUser } = this.props;
    const { places, placesByRegion, statsTotal, placemap } = this;

    return (
      <div className="traveler-map">
        {this.props.match.params.userSlug && placemapLoaded && placesLoaded &&
          <StaticPlacesVisitedMap
            placemap={placemap}
            places={places}
            placesByRegion={placesByRegion}
            statsTotal={statsTotal}
            user={user}
          />
        }
        {!this.props.match.params.userSlug && placesLoaded &&
          <EditablePlacesVisitedMap
            placemap={placemap}
            places={places}
            placesByRegion={placesByRegion}
            statsTotal={statsTotal}
            user={user}
            setUser={setUser}
          />
        }
      </div>
    );
  }
}

const createOrderedPlacesByRegionObj = places => {
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

export default PlacesVisitedMap;
