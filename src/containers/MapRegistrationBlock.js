import React, { Component } from 'react';
import axios from 'axios';

import { createRemotePlaceMap, createRemoteUser,
         fetchRemoteUserAuthToken } from '../apiRouters';
import UserRegistrationForm from '../components/UserRegistrationForm';


class MapRegistrationBlock extends Component {
  constructor(props) {
    super(props);

    this.state = {
      'registrationInputs': {
        'email': '',
        'name': '',
        'password': '',
      },
      'formErrors': {}
    }

    this.handleFormErrors = this.handleFormErrors.bind(this);
    this.handleMapRegistrationSubmit = this.handleMapRegistrationSubmit.bind(this);
    this.handleRegistrationInputChange = this.handleRegistrationInputChange.bind(this);
  }

  handleFormErrors(data) {
    // Get and copy current errors
    const formErrors = {};
    Object.keys(data).forEach(field => {
      console.log(field);
      const errorMessages = data[field];

      formErrors[field] = errorMessages;
    });
    this.setState({ formErrors });
  }


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
      .catch(error => {
        console.log(error);
        console.log(error.response);

        // if there is form error data
        if (error.response.data) {
          this.handleFormErrors(error.response.data);
        }
      })
      .then(result => {
        // Go ahead and break promise if no result returned.
        if (!result) return;

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

  handleRegistrationInputChange(event) {
    this.setState({
      registrationInputs: {
        ...this.state.registrationInputs,
        [event.target.name]: event.target.value
      }
    });
  }

  render() {
    const { formErrors } = this.state;

    return (
      <div className="user-login-wrapper">
        <div className="container">
          <h1>Save this Map</h1>
          <UserRegistrationForm
            onSubmit={this.handleMapRegistrationSubmit}
            onInputChange={this.handleRegistrationInputChange}
            buttonText='Save Map'
            formErrors={formErrors}
          />
        </div>
      </div>
    );
  }

}

export default MapRegistrationBlock;
