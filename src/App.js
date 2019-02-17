import React, { Component } from 'react';
import CircularProgressbar from 'react-circular-progressbar';

import 'react-circular-progressbar/dist/styles.css';
import './App.scss';


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


const StatBlock = ({ title, data, dataMax, statText, substatText }) =>
  <div className="stat-wrapper">
    <h4 className="stat-title">{title}</h4>
    <CircularProgressbar
      percentage={Math.round(data / dataMax * 100)}
      text={data}
      strokeWidth="15"
      initialAnimation={true}
    />
    <div className="stat-text">{statText}</div>
    <div className="substat-text">{substatText}</div>
  </div>


// https://github.com/joshjg/react-canvas-knob
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
  calculateTotalStats() {
    let stats = {};
    // Calculate Total stats
    const countryIdSet = new Set();
    const continentIdSet = new Set();
    const regionSet = new Set();
    stats['areaTotal'] = 0;
    for (const place of this.props.places) {
      // If visitedCountry hasn't been added, add its area to the tally
      if (!countryIdSet.has(place.country.id)) {
        stats['areaTotal'] += place.country.area;
        countryIdSet.add(place.country.id);
      }

      // Add country, continent, and regions to sets to track unique items
      continentIdSet.add(place.continent);
      regionSet.add(place.region);
    }
    stats['placeCountTotal'] = this.props.places.length;
    stats['countryCountTotal'] = countryIdSet.size;
    stats['continentCountTotal'] = continentIdSet.size;
    stats['regionCountTotal'] = regionSet.size;

    return stats;
  }

  calculateVisitedStats() {
    let stats = {};
    // Calculated Visited stats
    const visitedCountryIdSet = new Set();
    const visitedContinentIdSet = new Set();
    const visitedRegionSet = new Set();
    stats['areaVisited'] = 0;
    for (const placeId of this.props.placemap.places) {
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
    stats['placeCountVisited'] = this.props.placemap.places.length;
    stats['countryCountVisited'] = visitedCountryIdSet.size;
    stats['continentCountVisited'] = visitedContinentIdSet.size;
    stats['regionCountVisited'] = visitedRegionSet.size;

    return stats;
  }

  render() {
    const totalStats = this.calculateTotalStats();
    const visitedStats = this.calculateVisitedStats();
    let stats = {...totalStats, ...visitedStats};

    return (
      <div className="traveler-map">
        <PlacesVisitedMap />
        <div className="title-block container">
          <h1>Title Placeholder</h1>
          <div>SocialSharingBar placeholder</div>
        </div>
        <StatBlocksRow stats={stats} />
        <FilterablePlaces placesByRegion={this.props.placesByRegion}
                          visitedPlaces={this.props.placemap.places}
        />
      </div>
    );
  }
}

function slugifyString(string) {
  return string.replace(/\s+/g, '-').toLowerCase();
}

const placesJSON = [
    {
        "id": 311,
        "country": {
            "id": 65,
            "area": 1919440.0
        },
        "name": "Sulawesi (Celebes, Indonesia)",
        "code": "sulawesi",
        "region": "Asia",
        "area": 0.0,
        "continent": 6
    },
    {
        "id": 312,
        "country": {
            "id": 65,
            "area": 1919440.0
        },
        "name": "Sumatra (Indonesia)",
        "code": "sumatra",
        "region": "Asia",
        "area": 0.0,
        "continent": 6
    },
    {
        "id": 307,
        "country": {
            "id": 86,
            "area": 17075200.0
        },
        "name": "Siberia (Russia in Asia)",
        "code": "siberia",
        "region": "Africa",
        "area": 0.0,
        "continent": 6
    }
];

const placemapJSON = {
  "id": 1,
  "user": 1,
  "places": [
      311,
      312
  ],
  "continent_count": 1,
  "place_count": 2,
  "place_percent": 2,
  "region_count": 1,
  "un_country_count": 2,
  "un_country_area_percent": 2
}

class App extends Component {

  render() {
    // Create an object with places grouped by region for ease later
    // Organize places by region here so only do it once
    let placesByRegion = {};
    for (const place of placesJSON) {
      if (!(place.region in placesByRegion)) {
        placesByRegion[place.region] = [];
      }
      placesByRegion[place.region].push(place);
    }

    return (
      <EditablePlacesVisitedMap
        places={placesJSON}
        placesByRegion={placesByRegion}
        placemap={placemapJSON}
      />
    );
  }
}

export default App;
