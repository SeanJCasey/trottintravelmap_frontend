import React, { Component } from 'react';
import { BrowserRouter as Redirect } from "react-router-dom";

import { createRemoteUser, fetchRemoteUserAuthToken } from '../apiRouters';
import UserLoginForm from '../components/UserLoginForm';
import UserRegistrationForm from '../components/UserRegistrationForm';

const PATH_MAPS = '/travel-maps';


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
      redirectUserHome: false,
      // 'messages': {
      //   'errors': {},
      //   'successes': []
      // }
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
      .then(result => {
        this.props.addSystemMessage(
          `Your user account for ${email} has been saved!`,
          'success'
        );
        this.loginUser(email, password);
      })
      .catch(error => console.log(error.response));
  }

  loginUser(email, password) {
    // Retrieve and set a JWT for the user
    fetchRemoteUserAuthToken(email, password)
      .then(result => {
        // Set JWT in localStorage
        localStorage.setItem('jwtToken', result.data.token);
      })
      .then(() => this.props.setUser())
      .then(() => this.setState({ redirectUserHome: true }))
      .catch(error => console.log(error));
  }

  render() {
    const { redirectUserHome } = this.state;
    const { user } = this.props;

    // Redirect the user home if they have just logged in.
    if (redirectUserHome && user.slug) {
      const redirectPath = `${PATH_MAPS}/${user.slug}`;
      console.log(redirectPath);
      return <Redirect to={redirectPath} />;
    }
    // Don't render anything if the user is logged in.
    if (user.id) return null;

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
      <div className="user-login-wrapper">
        <div className="container">
          <div className="messages">
            {messageAlerts}
          </div>
          <div className="row">
            <div className="col-sm-8">
              <h2>Save this Map</h2>
              <UserRegistrationForm
                onSubmit={this.handleRegistrationSubmit}
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
