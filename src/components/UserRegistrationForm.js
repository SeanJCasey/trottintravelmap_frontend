import React from 'react';


const UserRegistrationForm = ({ onInputChange, onSubmit }) =>
  <form className="user-login-form" onSubmit={onSubmit}>
    <div className="form-group">
      <input
        name="email"
        type="email"
        className="form-control"
        id="loginInputEmail"
        placeholder="Email address"
        onChange={onInputChange}
      />
    </div>
    <div className="form-group">
      <input
        name="password"
        type="password"
        className="form-control"
        id="loginInputPassword"
        placeholder="Password"
        onChange={onInputChange}
      />
    </div>
    <button type="submit" className="btn btn-primary" id="userRegisterButton">Save Map</button>
  </form>

export default UserRegistrationForm;
