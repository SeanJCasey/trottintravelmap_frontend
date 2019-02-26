import React from 'react';


const UserRegistrationForm = ({ onInputChange, onSubmit }) =>
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
    <button type="submit" className="btn btn-success" id="userRegistrationSubmitButton">Save Map</button>
  </form>

export default UserRegistrationForm;
