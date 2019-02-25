import React from 'react';


const UserLoginForm = ({ onInputChange, onSubmit }) =>
  <div className="user-login-wrapper">
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
      <button type="submit" className="btn btn-primary" id="userLoginSubmitButton">Login</button>
    </form>
  </div>

export default UserLoginForm;
