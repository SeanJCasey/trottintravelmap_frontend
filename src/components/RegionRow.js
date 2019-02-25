import React from 'react';
import { slugifyString } from '../utils';

const RegionRow = ({ regionName, visitedCount, totalCount, isActive, onClick }) =>
  <li className="nav-item">
    <a className={`nav-link ${isActive && 'active'}`}
       href={`#${slugifyString(regionName)}`}
       onClick={onClick}
    >
      {regionName}
      <span className="float-right badge badge-secondary">{visitedCount} / {totalCount}</span>
    </a>
  </li>

export default RegionRow;
