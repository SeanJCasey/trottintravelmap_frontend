import React from 'react';


const UserAccountOptionsBlock = ({ mapUrl, userName, onUserLogout }) =>
  <div className="user-account-options">
    <div className="share-options">
      <div className="share-link form-group">
        Shareable link: <input type="text" name="mapUrl" value={mapUrl} id="mapUrlInput" className="form-control form-control-sm" readOnly />
        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={() => {
            const mapUrlElement = document.getElementById("mapUrlInput");
            mapUrlElement.select();
            document.execCommand("copy");
          }}
        >
        Copy
        </button>
      </div>
      <button
        className="btn btn-outline-secondary btn-sm"
        onClick={onUserLogout}
      >
      Logout
      </button>
    </div>
    <div>SocialSharingBar placeholder</div>
  </div>

export default UserAccountOptionsBlock;
