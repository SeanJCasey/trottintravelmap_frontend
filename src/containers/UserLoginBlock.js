import React, { Component } from 'react';
// import { Redirect } from "react-router-dom";
import axios from 'axios';

import { createRemotePlaceMap, createRemoteUser,
         fetchRemoteUserAuthToken } from '../apiRouters';
import UserLoginForm from '../components/UserLoginForm';
import UserRegistrationForm from '../components/UserRegistrationForm';

// const PATH_MAPS = '/travel-maps';


class UserLoginBlock extends Component {
  constructor(props) {
    super(props);

    this.state = {
      'registrationInputs': {
        'email': '',
        'name': '',
        'password': '',
      },
      'loginInputs': {
        'email': '',
        'password': '',
      },
    }

    // this.handleAPIError = this.handleAPIError.bind(this);
    this.handleLoginInputChange = this.handleLoginInputChange.bind(this);
    this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
    this.handleMapRegistrationSubmit = this.handleMapRegistrationSubmit.bind(this);
    this.handleRegistrationInputChange = this.handleRegistrationInputChange.bind(this);
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


  // Map Registration pipeline:
  // 1. Create Remote User
  // 2. Get JWT from Remote (log in)
  // 3. Set JWT in browser
  // 4. Set JWT in axios headers
  // 5. Create Remote PlaceMap
  // 6. Update App user state
  handleMapRegistrationSubmit(event) {
    event.preventDefault();

    // this.setState({ messages: { errors: {} } });

    const { email, name, password } = this.state.registrationInputs;
    const { placesVisited } = this.props;

    // Register the user, log them in, and create their placemap
    createRemoteUser(email, name, password)
      .then(result => {
        const user = result.data;
        this.props.addSystemMessage(
          `Your user account for ${email} has been saved!`,
          'success'
        );
        // Get JWT from API
        fetchRemoteUserAuthToken(email, password)
          .then(result => {
            const jwtToken = result.data.token;
            // Set JWT in localStorage
            localStorage.setItem('jwtToken', jwtToken);
            // Set default Auth token for all requests
            axios.defaults.headers.common["Authorization"] = `JWT ${jwtToken}`;
            // Create Remote PlaceMap
            createRemotePlaceMap(user.id, placesVisited)
              // Update App state with local storage user
              .then(() => {
                this.props.addSystemMessage(
                  `Your map has been saved!`,
                  'success'
                );
                this.props.setUser();
              });
          })

          // Display special error if pipeline breaks
          .catch(error => {
            console.log(error);
            this.props.addSystemMessage(
              `Could not save map. Please contact an admin.`,
              'error'
            );
          });
      })
      .catch(error => console.log(error));
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

    // this.setState({ messages: { errors: {} } });

    const {email, password} = this.state.loginInputs;
    fetchRemoteUserAuthToken(email, password)
      .then(result => {
        // Set JWT in localStorage
        localStorage.setItem('jwtToken', result.data.token);
      })
      .then(() => this.props.setUser())
      .catch(error => console.log(error));
  }

  handleRegistrationInputChange(event) {
    this.setState({
      registrationInputs: {
        ...this.state.registrationInputs,
        [event.target.name]: event.target.value
      }
    });
  }

  render() {
    return (
      <div className="user-login-wrapper">
        <div className="container">
          <div className="row">
            <div className="col-sm-8">
              <h2>Save this Map</h2>
              <UserRegistrationForm
                onSubmit={this.handleMapRegistrationSubmit}
                onInputChange={this.handleRegistrationInputChange}
              />
            </div>
            <div className="col-sm-4">
              <h2>Login</h2>
              <UserLoginForm
                onSubmit={this.handleLoginSubmit}
                onInputChange={this.handleLoginInputChange}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

}

export default UserLoginBlock;
