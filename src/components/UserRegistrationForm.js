import React from 'react';


const UserRegistrationForm = ({ onInputChange, onSubmit }) =>
  <div className="user-registration-wrapper">
    <div className="help">Your map selections will be saved!</div>
    <form className="user-registration-form" onSubmit={onSubmit}>
      <div className="form-group">
        <input
          name="name"
          type="name"
          className="form-control"
          id="registrationInputName"
          placeholder="Your Name"
          onChange={onInputChange}
        />
      </div>
      <div className="form-group">
        <input
          name="email"
          type="email"
          className="form-control"
          id="registrationInputEmail"
          placeholder="Email address"
          onChange={onInputChange}
        />
      </div>
      <div className="form-group">
        <input
          name="password"
          type="password"
          className="form-control"
          id="registrationInputPassword"
          placeholder="Password"
          onChange={onInputChange}
        />
      </div>
      <button type="submit" className="btn btn-primary" id="userRegistrationSubmitButton">Register</button>
    </form>
  </div>

export default UserRegistrationForm;
