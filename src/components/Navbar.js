import React from 'react';
import { Link } from "react-router-dom";


const Navbar = ({ user, onUserLogout }) =>
  <div className="navbar">
    <div className="container">
      <Link to={'/'} className="btn btn-default">TripPlot</Link>
      {!user.id &&
        <Link
          to={'/login'}
          className="btn btn-outline-secondary btn-sm"
        >
        Sign In
        </Link>
      }
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
