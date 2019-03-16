import React from 'react';

const PlaceVisitedInputRow = ({ place, visited, onChange }) =>
  <li className="place">
    <label>
      <input
        name="places"
        type="checkbox"
        value={place.id}
        checked={visited ? 'checked' : ''}
        onChange={onChange}
      />
      {place.name}
    </label>
  </li>

export default PlaceVisitedInputRow
