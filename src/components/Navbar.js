import React from 'react';
import { Link } from "react-router-dom";


const Navbar = ({ user, onUserLogout }) =>
  <div className="navbar">
    <div className="container">
      <Link to={'/'} className="btn btn-default">TripPlot</Link>
      {!user.id &&
        <div className="user-links logged-out">
          <Link
            to={'/login'}
            className="btn btn-outline-secondary btn-sm"
          >
          Sign In
          </Link>
        </div>
      }
      {user.id &&
        <div className="user-links logged-in">
          <div className="account-info">
            <Link
              to={'/'}
            >
            {user.email}
            </Link>
          </div>
          <button
            className="btn btn-outline-secondary btn-sm logout"
            onClick={onUserLogout}
          >
          Logout
          </button>
        </div>
      }
    </div>
  </div>

export default Navbar;
