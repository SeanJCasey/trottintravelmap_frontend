import React, { Component } from 'react';
import axios from 'axios';
import CircularProgressbar from 'react-circular-progressbar';

import 'react-circular-progressbar/dist/styles.css';
import './App.scss';


// URLs
const PATH_BASE = 'http://127.0.0.1:8000/api';
const PATH_PLACES = '/places';
const PATH_PLACEMAPS = '/placemaps';

const URL_PLACES = `${PATH_BASE}${PATH_PLACES}`;
const URL_PLACEMAPS = `${PATH_BASE}${PATH_PLACEMAPS}`;

const PlaceRow = ({ place, visited }) =>
  <li className="place">
    <div >
      <label>
        <input name="places"
               type="checkbox"
               value={ place.id }
               checked={ visited ? 'checked' : '' }
        />
        {place.name}
      </label>
    </div>
  </li>


const PlacesList = ({ placesByRegion, visitedPlaces }) =>
  <div className="place-list">

    {Object.keys(placesByRegion).map((region, i) =>
      <div className="region" id={slugifyString(region)} key={i}>
        <h4>{region}</h4>

        <ul className="list-unstyled">
          {placesByRegion[region].map(place =>
            // TODO: Need logic for non logged-in users to view somebody else's map.
            <PlaceRow place={place}
                      visited={visitedPlaces.includes(place.id) ? true : false}
                      key={place.id}
            />
          )}
        </ul>
      </div>
    )}

  </div>


const RegionRow = ({ regionName, visitedCount, totalCount, isActive }) =>
  <li className="nav-item">
    <a className={`nav-link ${isActive && 'active'}`} href={`#${slugifyString(regionName)}`}>
      {regionName}
      <span className="float-right badge badge-secondary">{visitedCount} / {totalCount}</span>
    </a>
  </li>


const RegionsFilter = ({ placesByRegion, visitedPlaces }) =>
  <div className="region-list">
    <ul className="nav nav-pills flex-column">
      {Object.keys(placesByRegion).map((region, i) => {
        let visitedCount = 0;

        for (const place of placesByRegion[region]) {
          visitedPlaces.includes(place.id) && visitedCount++;
        }

        return (
          <RegionRow
            key={i}
            regionName={region}
            visitedCount={visitedCount}
            totalCount={placesByRegion[region].length}
            isActive={i === 0 ? true : false}
          />
        );
      })}
    </ul>
  </div>


const FilterablePlaces = ({ placesByRegion, visitedPlaces }) =>
  <div className="filterable-places container">
    <div className="row">
      <div className="col-sm-5 col-md-4">
        <RegionsFilter
          placesByRegion={placesByRegion}
          visitedPlaces={visitedPlaces}
        />
      </div>
      <div className="col-sm-7 col-md-8">
        <form className="places-form">
          <PlacesList
            placesByRegion={placesByRegion}
            visitedPlaces={visitedPlaces}
          />
        </form>
      </div>
    </div>
  </div>


// See https://www.npmjs.com/package/react-circular-progressbar
const StatBlock = ({ title, data, dataMax, statText, substatText }) =>
  <div className="stat-wrapper">
    <h4 className="stat-title">{title}</h4>
    <CircularProgressbar
      percentage={Math.round(data / dataMax * 100)}
      text={`${data}`}
      strokeWidth="15"
      initialAnimation={true}
    />
    <div className="stat-text">{statText}</div>
    <div className="substat-text">{substatText}</div>
  </div>


const StatBlocksRow = ({ stats }) =>
  <div className="stats container">
    <div className="row">
      <div className="col-sm-4">
        <StatBlock
          title="Countries Visited"
          data={stats.placeCountVisited}
          dataMax={stats.placeCountTotal}
          statText={`Visited ${stats.placeCountVisited} of ${stats.placeCountTotal} places`}
          substatText={`UN Countries: ${stats.countryCountVisited}`}
        />
      </div>
      <div className="col-sm-4">
        <StatBlock
          title="Percent Visited"
          data={Math.round(stats.areaVisited / stats.areaTotal * 100)}
          dataMax="100"
          statText={`Visited ${Math.round(stats.areaVisited / stats.areaTotal * 100)}% of the world by landmass`}
          substatText={`Percent by number of countries: ${Math.round(stats.placeCountVisited / stats.placeCountTotal * 100)}%`}
        />
      </div>
      <div className="col-sm-4">
        <StatBlock
          title="Regions Visited"
          data={stats.regionCountVisited}
          dataMax={stats.regionCountTotal}
          statText={`Visited ${stats.regionCountVisited} of the ${stats.regionCountTotal} world regions`}
          substatText={`Continents: ${stats.continentCountVisited} of ${stats.continentCountTotal}`}
        />
      </div>
    </div>
  </div>


const PlacesVisitedMap = ({ }) =>
  <div className="worldmap container">PlacesVisitedMap Placeholder</div>


// TODO: Move stat caculations when we decide state
class EditablePlacesVisitedMap extends Component {
  constructor(props) {
    super(props);

    this.state = {
      placemap: {
        placesVisited: []
      },
      error: null
    };

    // this.fetchAllPlaces = this.fetchAllPlaces.bind(this);
  }

  calculateVisitedStats(placesVisted) {
    let stats = {};
    // Calculated Visited stats
    const visitedCountryIdSet = new Set();
    const visitedContinentIdSet = new Set();
    const visitedRegionSet = new Set();
    stats['areaVisited'] = 0;
    for (const placeId of placesVisted) {
      const place = this.props.places.find(place => place.id === placeId);

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

    return stats;
  }

  render() {
    const { placesVisited } = this.state.placemap;
    const visitedStats = this.calculateVisitedStats(placesVisited);
    let stats = {...this.props.totalStats, ...visitedStats};

    return (
      <div className="traveler-map">
        <PlacesVisitedMap />
        <div className="title-block container">
          <h1>Title Placeholder</h1>
          <div>SocialSharingBar placeholder</div>
        </div>
        <StatBlocksRow stats={stats} />
        <FilterablePlaces placesByRegion={this.props.placesByRegion}
                          visitedPlaces={placesVisited}
        />
      </div>
    );
  }
}

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      places: [],
      error: null
    };

    // this.fetchAllPlaces = this.fetchAllPlaces.bind(this);
  }

  // Calculate Total stats based on places only once, when app loads
  calculateTotalStats() {
    const { places } = this.state;
    let stats = {};

    const countryIdSet = new Set();
    const continentIdSet = new Set();
    const regionSet = new Set();
    stats['areaTotal'] = 0;
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

    return stats;
  }

  fetchAllPlaces() {
    return axios(URL_PLACES)
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
    this.fetchAllPlaces();
  }

  render() {
    const { places } = this.state;

    // Create an object with places grouped by region for ease later
    // Organize places by region here so only do it once
    const placesByRegion = this.createOrderedPlacesByRegionObj(places);

    return (
      <EditablePlacesVisitedMap
        places={places}
        placesByRegion={placesByRegion}
        totalStats={this.calculateTotalStats()}
      />
    );
  }
}

function slugifyString(string) {
  return string.replace(/\s+/g, '-').toLowerCase();
}

export default App;
