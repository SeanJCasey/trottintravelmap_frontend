import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import axios from 'axios';
import decode from 'jwt-decode';

import { fetchRemoteUser } from '../apiRouters';
import EditablePlacesVisitedMap from './EditablePlacesVisitedMap';


class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      ...this.constructInitialUserState()
    };

    this.fetchUserByID = this.fetchUserByID.bind(this);
    this.handleLogoutUser = this.handleLogoutUser.bind(this);
    this.setUser = this.setUser.bind(this);
    this.unsetUser = this.unsetUser.bind(this);
  }

  constructInitialUserState() {
    return {
      user: {
        id: null,
        name: null,
        email: null,
        slug: null
      }
    };
  }

  componentDidMount() {
    this.setUser();
  }

  fetchUserByID(userID) {
    // TODO - handle errors
    return fetchRemoteUser(userID)
      .then(result => {
        this.setState({
          user: {
            id: result.data.id,
            email: result.data.email,
            name: result.data.name,
            slug: result.data.slug
          }
        })
        return result.data;
      });
  }

  // handleLoginUser() {
  //   this.setUser()
  //     .then(this.setState({ redirectUserHome: true }))
  //     .catch(error => console.log(error));
  // }

  handleLogoutUser() {
    this.unsetUser();
  }

  setUser() {
    if (localStorage.getItem('jwtToken')) {
      const jwtToken = localStorage.getItem('jwtToken');

      // Set default Auth token for all requests
      axios.defaults.headers.common["Authorization"] = `JWT ${jwtToken}`;

      // Set user info in state
      // TODO - if Auth error, unset user
      const decoded = decode(jwtToken);
      return this.fetchUserByID(decoded.user_id)
        .catch(error => console.log(error));
    }
  }

  unsetUser() {
    // Remove JWT from local storage
    localStorage.removeItem('jwtToken');

    // Remove JWT from axios header
    delete axios.defaults.headers.common["Authorization"];

    // Reset state to initial conditions
    this.setState(this.constructInitialUserState());
  }

  render() {
    const { user } = this.state;

    return (
      <Router>
        <div className="app-wrapper">
          <Route
            path='/'
            exact
            // component={EditablePlacesVisitedMap}
            render={(props) =>
              <EditablePlacesVisitedMap
                {...props}
                user={user}
                setUser={this.setUser}
                logoutUser={this.handleLogoutUser}
                unsetUser={this.unsetUser}
              />}
          />
          <Route
            path='/travel-maps/:userSlug'
            // component={EditablePlacesVisitedMap}
            render={(props) =>
              <EditablePlacesVisitedMap
                {...props}
                user={user}
                setUser={this.setUser}
                logoutUser={this.handleLogoutUser}
                unsetUser={this.unsetUser}
              />}
          />
        </div>
      </Router>
    );
  }
}

export default App;
