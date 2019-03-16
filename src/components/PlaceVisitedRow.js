import React from 'react';

const PlaceVisitedRow = ({ place, visited }) =>
  <li className={`place ${visited ? 'visited' : 'not-visited'}`}>
    <i className={`fa ${visited ? 'fa-check' : 'fa-times'}`}></i>
    <span className='name'>&nbsp; { place.name }</span>
  </li>

export default PlaceVisitedRow
