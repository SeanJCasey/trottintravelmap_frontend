import React, { Component } from 'react';
import axios from 'axios';
import decode from 'jwt-decode';
import CircularProgressbar from 'react-circular-progressbar';

import Worldmap from './Worldmap';
import 'react-circular-progressbar/dist/styles.css';
import './App.scss';

// URLs
const PATH_BASE = 'http://127.0.0.1:8000';
const PATH_API = '/api';
const PATH_PLACES = '/places';
const PATH_PLACEMAPS = '/placemaps';
const PATH_USERS = '/users';
const PATH_LOGIN = '/api-token-auth';

const URL_PLACES = `${PATH_BASE}${PATH_API}${PATH_PLACES}`;
const URL_PLACEMAPS = `${PATH_BASE}${PATH_API}${PATH_PLACEMAPS}`;
const URL_USERS = `${PATH_BASE}${PATH_API}${PATH_USERS}`;

const URL_LOGIN = `${PATH_BASE}${PATH_LOGIN}`;
const URL_REGISTER = URL_USERS;


const PlaceRow = ({ place, visited, onChange }) =>
  <li className="place">
    <div >
      <label>
        <input name="places"
               type="checkbox"
               value={place.id}
               checked={visited ? 'checked' : ''}
               onChange={onChange}
        />
        {place.name}
      </label>
    </div>
  </li>


const PlacesList = ({ placesByRegion, visitedPlaces, onPlaceRowChange, filters }) =>
  <div className="place-list">

    {Object.keys(placesByRegion).map((region, i) =>
      <div className="region"
           id={slugifyString(region)}
           key={i}
           style={{ display: filters.region !== slugifyString(region) ? 'none' : 'block' }}>
        <h4>{region}</h4>

        <ul className="list-unstyled">
          {placesByRegion[region].map(place =>
            // TODO: Need logic for non logged-in users to view somebody else's map.
            <PlaceRow place={place}
                      visited={visitedPlaces.includes(place.id) ? true : false}
                      key={place.id}
                      onChange={onPlaceRowChange}
            />
          )}
        </ul>
      </div>
    )}

  </div>


const RegionRow = ({ regionName, visitedCount, totalCount, isActive, onClick }) =>
  <li className="nav-item">
    <a className={`nav-link ${isActive && 'active'}`}
       href={`#${slugifyString(regionName)}`}
       onClick={onClick}
    >
      {regionName}
      <span className="float-right badge badge-secondary">{visitedCount} / {totalCount}</span>
    </a>
  </li>


const RegionsFilter = ({ placesByRegion, visitedPlaces, filters, onRegionRowClick }) =>
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
            isActive={filters.region === slugifyString(region) ? true : false}
            onClick={onRegionRowClick}
          />
        );
      })}
    </ul>
  </div>


class FilterablePlaces extends Component {
  constructor(props) {
    super(props);
    this.state = {
      'filters': {
        'region': 'africa'
      }
    }
    this.handleRegionRowClick = this.handleRegionRowClick.bind(this);
  }

  handleRegionRowClick(event) {
    const regionLinkTarget = event.target.getAttribute('href');
    this.setState({
      'filters': {
        'region': regionLinkTarget.replace('#', '')
      }
    })
    event.preventDefault();
  }

  render() {
    return (
      <div className="filterable-places container">
        <div className="row">
          <div className="col-sm-5 col-md-4">
            <RegionsFilter
              placesByRegion={this.props.placesByRegion}
              visitedPlaces={this.props.visitedPlaces}
              filters={this.state.filters}
              onRegionRowClick={(e) => this.handleRegionRowClick(e)}
            />
          </div>
          <div className="col-sm-7 col-md-8">
            <form className="places-form">
              <PlacesList
                placesByRegion={this.props.placesByRegion}
                visitedPlaces={this.props.visitedPlaces}
                onPlaceRowChange={this.props.onPlaceRowChange}
                filters={this.state.filters}
              />
            </form>
          </div>
        </div>
      </div>
    );
  }
}


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


const PlacesVisitedMap = ({ places, visitedPlaces }) =>
  <div className="worldmap">
    <div className="container">
      <div className="worldmap-wrapper">
        <Worldmap
          places={places}
          visitedPlaces={visitedPlaces}
        />
      </div>
    </div>
  </div>


const UserRegistrationForm = ({ onInputChange, onSubmit }) =>
  <form className="user-login-form" onSubmit={onSubmit}>
    <div className="form-group">
      <input
        name="email"
        type="email"
        className="form-control"
        id="loginInputEmail"
        placeholder="Email address"
        onChange={onInputChange}
      />
    </div>
    <div className="form-group">
      <input
        name="password"
        type="password"
        className="form-control"
        id="loginInputPassword"
        placeholder="Password"
        onChange={onInputChange}
      />
    </div>
    <button type="submit" className="btn btn-primary" id="userRegisterButton">Save Map</button>
  </form>


const UserAccountOptionsBlock = ({ userName, onUserLogout }) =>
  <div className="user-account-options">
    <div className="container">
      <h1>{ userName }'s Travel Map</h1>
      <div className="logout">
        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={onUserLogout}
        >
        Logout
        </button>
      </div>
      <div>SocialSharingBar placeholder</div>
    </div>
  </div>


class UserLoginBlock extends Component {
  constructor(props) {
    super(props);

    this.state = {
      'email': '',
      'password': '',
      // 'messages': {
      //   'errors': {},
      //   'successes': []
      // },
    }
    // this.handleAPIError = this.handleAPIError.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  // handleAPIError(result) {
  //   // Get and copy current errors
  //   const { errors } = this.state.messages;
  //   let newErrors = {...errors};
  //   console.log(result.response);
  //   Object.keys(result.response.data).forEach(category => {
  //     const errorMessages = result.response.data[category];
  //     if (!(category in newErrors)) {
  //       newErrors[category] = [];
  //     }
  //     newErrors[category] = [...newErrors[category], errorMessages];
  //   });
  //   this.setState({ messages: { errors: newErrors } });
  // }

  handleSubmit(event) {
    event.preventDefault();

    // this.setState({ messages: { errors: {} } });

    const email = this.state.email;
    const password = this.state.password;

    // Register the user, then retrieve a JWT for the user
    axios.post(URL_REGISTER, {email, password})
      .then(result => {
        axios.post(URL_LOGIN, {email, password})
          .then(result => {
            // Grab JWT
            localStorage.setItem('jwtToken', result.data.token);
            this.props.toggleUserLoggedIn();
            // this.setState({
            //   'messages': {
            //     'successes': [
            //       ...this.state.messages.successes,
            //       "User saved!"
            //     ]
            //   }
            // });
          })
          .catch(error => console.log(error.response));
      })
      .catch(error => console.log(error.response));
  }

  render() {

    let messageAlerts = []
    // const { errors } = this.state.messages;
    // let errorAlerts = []
    // Object.keys(errors).forEach((category, index1) => {
    //   errors[category].forEach((message, index2) =>
    //     errorAlerts.push(
    //       <div
    //         className="alert alert-danger"
    //         key={`${index1}-${index2}`}
    //       >
    //         {category}: {message}
    //       </div>
    //     )
    //   )
    // });
    // messageAlerts = [
    //   ...errorAlerts,
    // ];

    return (
      <div className="user-login">
        <div className="container">
          <h1>Create Your Travel Map</h1>
          <div className="messages">
            {messageAlerts}
          </div>
          <UserRegistrationForm
            onSubmit={this.handleSubmit}
            onInputChange={this.handleInputChange}
          />
        </div>
      </div>
    );
  }

}


// TODO: Move stat caculations when we decide state
class EditablePlacesVisitedMap extends Component {
  constructor(props) {
    super(props);

    this.state = this.constructInitialState();

    // this.fetchAllPlaces = this.fetchAllPlaces.bind(this);
    this.calculateVisitedStats = this.calculateVisitedStats.bind(this);
    this.handlePlaceRowChange = this.handlePlaceRowChange.bind(this);
    // this.handleLocalStorageUpdated = this.handleLocalStorageUpdated.bind(this);
    this.fetchPlaceMapByID = this.fetchPlaceMapByID.bind(this);
    this.fetchUserByID = this.fetchUserByID.bind(this);
    this.handleUserLogout = this.handleUserLogout.bind(this);
    this.setUserFromStorageToken = this.setUserFromStorageToken.bind(this);
    this.toggleUserLoggedIn = this.toggleUserLoggedIn.bind(this);
    this.updateRemotePlacesVisited = this.updateRemotePlacesVisited.bind(this);
  }

  constructInitialState() {
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
    if (localStorage.getItem('jwtToken') && !this.state.user.id) {
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
    const url = `${URL_PLACEMAPS}`;
    const body = { user: userID, places: placesVisited };
    // TODO - handle errors
    return axios.post(url, body)
      .then(result => {
        this.setState({
          placemap: {
            id: result.response.data.id,
            // placesVisited: result.response.data.places
          }
        });
        return result.data;
      })
      .catch(error => console.log(error.response));
  }

  fetchPlaceMapByID(placemapID) {
    const url = `${URL_PLACEMAPS}/${placemapID}`;
    // TODO - handle errors
    return axios.get(url)
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
    const url = `${URL_USERS}/${userID}`;
    // TODO - handle errors
    return axios.get(url)
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
    const url = `${URL_PLACEMAPS}/${this.state.placemap.id}`;
    const body = { places: placesVisited };
    // TODO - handle errors
    axios.patch(url, body)
      .catch(error => console.log(error.response));
  }

  render() {
    const { placesVisited } = this.state.placemap;
    const visitedStats = this.calculateVisitedStats(placesVisited, this.props.places);
    let stats = {...this.props.totalStats, ...visitedStats};

    return (
      <div className="traveler-map">
        <PlacesVisitedMap
          places={this.props.places}
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
        <FilterablePlaces placesByRegion={this.props.placesByRegion}
                          visitedPlaces={placesVisited}
                          onPlaceRowChange={(e) => this.handlePlaceRowChange(e)}
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

function slugifyString(string) {
  return string.replace(/\s+/g, '-').toLowerCase();
}

export default App;
