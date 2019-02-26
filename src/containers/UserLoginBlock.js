import React, { Component } from 'react';

import { createRemoteUser, fetchRemoteUserAuthToken } from '../apiRouters';
import UserLoginForm from '../components/UserLoginForm';
import UserRegistrationForm from '../components/UserRegistrationForm';


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
      }
      // 'messages': {
      //   'errors': {},
      //   'successes': []
      // },
    }
    // this.handleAPIError = this.handleAPIError.bind(this);
    this.handleLoginInputChange = this.handleLoginInputChange.bind(this);
    this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
    this.handleRegistrationInputChange = this.handleRegistrationInputChange.bind(this);
    this.handleRegistrationSubmit = this.handleRegistrationSubmit.bind(this);
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
    this.loginUser(email, password);
  }

  handleRegistrationInputChange(event) {
    this.setState({
      registrationInputs: {
        ...this.state.registrationInputs,
        [event.target.name]: event.target.value
      }
    });
  }

  handleRegistrationSubmit(event) {
    event.preventDefault();

    // this.setState({ messages: { errors: {} } });

    const {email, name, password} = this.state.registrationInputs;

    // Register the user, then log them in
    createRemoteUser(email, name, password)
      .then(result => this.loginUser(email, password))
      .catch(error => console.log(error.response));
  }

  loginUser(email, password) {
    // Retrieve and set a JWT for the user
    fetchRemoteUserAuthToken(email, password)
      .then(result => {
        // Set JWT in localStorage
        localStorage.setItem('jwtToken', result.data.token);
        // Signal to parent component that user has logged in
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
            onSubmit={this.handleRegistrationSubmit}
            onInputChange={this.handleRegistrationInputChange}
          />
          <UserLoginForm
            onSubmit={this.handleLoginSubmit}
            onInputChange={this.handleLoginInputChange}
          />
        </div>
      </div>
    );
  }

}

export default UserLoginBlock;
