import React from 'react';
import { Link } from "react-router-dom";


const Navbar = ({ user, onUserLogout }) =>
  <div className="navbar">
    <div className="container">
      <Link to={'/'} className="btn btn-default">TripPlot</Link>
      {user.id &&
        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={onUserLogout}
        >
        Logout
        </button>
      }
    </div>
  </div>

export default Navbar;
