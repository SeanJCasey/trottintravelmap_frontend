import React, { Component } from 'react';

import { createRemoteUser, fetchRemoteUserAuthToken } from '../apiRouters';
import UserRegistrationForm from '../components/UserRegistrationForm';


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
    createRemoteUser(email, password)
      .then(result => {
        fetchRemoteUserAuthToken(email, password)
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

export default UserLoginBlock;
