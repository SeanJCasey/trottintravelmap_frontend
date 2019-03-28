import React, { Component } from 'react';
// import { Redirect } from "react-router-dom";

import { fetchRemoteUserAuthToken } from '../apiRouters';
import UserLoginForm from '../components/UserLoginForm';

// const PATH_MAPS = '/travel-maps';


class UserLoginPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      'loginInputs': {
        'email': '',
        'password': '',
      },
    }

    this.handleLoginInputChange = this.handleLoginInputChange.bind(this);
    this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
  }

  handleLoginInputChange(event) {
    this.setState({
      loginInputs: {
        ...this.state.loginInputs,
        [event.target.name]: event.target.value
      }
    });
  }

  handleLoginSubmit(event) {
    event.preventDefault();

    const {email, password} = this.state.loginInputs;
    fetchRemoteUserAuthToken(email, password)
      .then(result => {
        // Set JWT in localStorage
        localStorage.setItem('jwtToken', result.data.token);
        window.location = '/';
      })

      .catch(error => console.log(error));
  }

  render() {
    return (
      <div className="user-login-wrapper">
        <div className="container">
          <h1>Sign In</h1>
          <UserLoginForm
            onSubmit={this.handleLoginSubmit}
            onInputChange={this.handleLoginInputChange}
          />
        </div>
      </div>
    );
  }

}

export default UserLoginPage;
