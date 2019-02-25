import axios from 'axios';

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


export function fetchRemotePlaceMap(placemapID) {
  const url = `${URL_PLACEMAPS}/${placemapID}`;

  return axios.get(url);
}

export function fetchRemotePlaces() {
  return axios.get(URL_PLACES);
}

export function fetchRemoteUser(userID) {
  const url = `${URL_USERS}/${userID}`;

  return axios.get(url);
}

export function fetchRemoteUserAuthToken(email, password) {
  return axios.post(URL_LOGIN, {email, password})
}

export function createRemotePlaceMap(userID, placesVisited) {
  const url = `${URL_PLACEMAPS}`;
  const body = { user: userID, places: placesVisited };

  return axios.post(url, body);
}

export function createRemoteUser(email, password) {
  return axios.post(URL_REGISTER, {email, password});
}

export function updateRemotePlaceMap(placemapID, placesVisited) {
  const url = `${URL_PLACEMAPS}/${placemapID}`;
  const body = { places: placesVisited };

  return axios.patch(url, body);
}
