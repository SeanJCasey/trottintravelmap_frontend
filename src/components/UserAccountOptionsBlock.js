import React from 'react';


const UserAccountOptionsBlock = ({ userName, onUserLogout }) =>
  <div className="user-account-options">
    <div className="container">
      <h1>{ userName }'s Travel Map</h1>
      <div className="logout">
        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={onUserLogout}
        >
        Logout
        </button>
      </div>
      <div>SocialSharingBar placeholder</div>
    </div>
  </div>

export default UserAccountOptionsBlock;
