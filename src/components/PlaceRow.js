import React from 'react';

const PlaceRow = ({ place, visited, onChange }) =>
  <li className="place">
    <div >
      <label>
        <input name="places"
               type="checkbox"
               value={place.id}
               checked={visited ? 'checked' : ''}
               onChange={onChange}
        />
        {place.name}
      </label>
    </div>
  </li>

export default PlaceRow
