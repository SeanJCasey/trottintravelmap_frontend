import React from 'react';


const UserRegistrationForm = ({ onInputChange, onSubmit, buttonText = null, formErrors = null }) =>
  <form className="user-registration-form" onSubmit={onSubmit}>
    {formErrors && formErrors.non_field_errors && formErrors.non_field_errors.map((formError, i) => 
      <div
        className='alert-danger'
        key={i}
      >
      {formError}
      </div>
    )}
    <div className="form-group">
      <input
        name="name"
        type="name"
        className={`form-control required ${formErrors && formErrors.name ? 'is-invalid' : ''}`}
        id="registrationInputName"
        placeholder="Your Name"
        onChange={onInputChange}
      />
      {formErrors && formErrors.name && formErrors.name.map((formError, i) =>
        <div className="invalid-feedback" key={i}>
          {formError}
        </div>
      )}
    </div>
    <div className="form-group">
      <input
        name="email"
        type="email"
        className={`form-control required ${formErrors && formErrors.email ? 'is-invalid' : ''}`}
        id="registrationInputEmail"
        placeholder="Email address"
        onChange={onInputChange}
      />
      {formErrors && formErrors.email && formErrors.email.map((formError, i) =>
        <div className="invalid-feedback" key={i}>
          {formError}
        </div>
      )}
    </div>
    <div className="form-group">
      <input
        name="password"
        type="password"
        className={`form-control required ${formErrors && formErrors.password ? 'is-invalid' : ''}`}
        id="registrationInputPassword"
        placeholder="Password"
        onChange={onInputChange}
      />
      {formErrors && formErrors.password && formErrors.password.map((formError, i) =>
        <div className="invalid-feedback" key={i}>
          {formError}
        </div>
      )}
    </div>
    <button
      type="submit"
      className="btn btn-success"
      id="userRegistrationSubmitButton"
    >
      {buttonText ? buttonText : 'Register'}
    </button>
  </form>

export default UserRegistrationForm;
