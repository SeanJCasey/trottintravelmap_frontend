import axios from 'axios';

// URLs
const API_URL = process.env.REACT_APP_API_URL;

const API_PATH_BASE = '/api';
const API_PATH_PLACES = '/places';
const API_PATH_PLACEMAPS = '/placemaps';
const API_PATH_USERS = '/users';
const API_PATH_LOGIN = '/api-token-auth';

const API_URL_PLACES = `${API_URL}${API_PATH_BASE}${API_PATH_PLACES}`;
const API_URL_PLACEMAPS = `${API_URL}${API_PATH_BASE}${API_PATH_PLACEMAPS}`;
const API_URL_USERS = `${API_URL}${API_PATH_BASE}${API_PATH_USERS}`;

const API_URL_LOGIN = `${API_URL}${API_PATH_LOGIN}`;
const API_URL_REGISTER = API_URL_USERS;


// function handleTokenAuthError(error) {
//   console.log(error);
// }

export function fetchRemotePlaceMap(userSlug) {
  const url = `${API_URL_PLACEMAPS}/${userSlug}`;

  return axios.get(url)
    .catch(error => console.log(error.response));
}

export function fetchRemotePlaces() {
  return axios.get(API_URL_PLACES)
    .catch(error => console.log(error.response));
}

export function fetchRemoteUser(userID) {
  const url = `${API_URL_USERS}/${userID}`;

  return axios.get(url)
    // .catch(error => console.log(error.response));
}

export function fetchRemoteUserAuthToken(email, password) {
  return axios.post(API_URL_LOGIN, {email, password})
    .catch(error => console.log(error.response));
}

export function createRemotePlaceMap(userID, placesVisited) {
  const url = `${API_URL_PLACEMAPS}`;
  const body = { user_id: userID, places: placesVisited };

  return axios.post(url, body)
    .catch(error => console.log(error.response));
}

export function createRemoteUser(email, name, password) {
  return axios.post(API_URL_REGISTER, {email, name, password});
    // .catch(error => console.log(error.response));
}

export function updateRemotePlaceMap(userSlug, placesVisited) {
  const url = `${API_URL_PLACEMAPS}/${userSlug}`;
  const body = { places: placesVisited };

  return axios.patch(url, body)
    .catch(error => console.log(error.response));
}
