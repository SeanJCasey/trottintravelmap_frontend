import React, { Component } from 'react';

import EditablePlacesVisitedMap from './containers/EditablePlacesVisitedMap';

import { fetchRemotePlaces } from './apiRouters';

import 'react-circular-progressbar/dist/styles.css';
import './App.scss';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      places: [],
      error: null
    };
  }

  // Calculate Total stats based on places only once, when app loads
  calculateTotalStats(places) {
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

  loadAllPlaces() {
    fetchRemotePlaces()
      .then(result => {
        this.setState({ places: result.data })
      })
      .catch(error => this.setState({ error }));
  }

  createOrderedPlacesByRegionObj(places) {
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

  componentDidMount() {
    this.loadAllPlaces();
  }

  render() {
    const { places } = this.state;

    // Create an object with places grouped by region for ease later
    // Organize places by region here so only do it once
    const placesByRegion = this.createOrderedPlacesByRegionObj(places);

    return (
      <div className="app-wrapper">
      {places.length ?
        <EditablePlacesVisitedMap
          places={places}
          placesByRegion={placesByRegion}
          totalStats={this.calculateTotalStats(places)}
        /> :
        'Waiting'}
      </div>
    );
  }
}

export default App;
