import React from 'react';
import { slugifyString } from '../utils';

import RegionRow from './RegionRow';

const RegionsFilter = ({ placesByRegion, visitedPlaces, filters, onRegionRowClick }) =>
  <div className="region-list">
    <ul className="nav nav-pills flex-column">
      {Object.keys(placesByRegion).map((region, i) => {
        let visitedCount = 0;

        for (const place of placesByRegion[region]) {
          visitedPlaces.includes(place.id) && visitedCount++;
        }

        return (
          <RegionRow
            key={i}
            regionName={region}
            visitedCount={visitedCount}
            totalCount={placesByRegion[region].length}
            isActive={filters.region === slugifyString(region) ? true : false}
            onClick={onRegionRowClick}
          />
        );
      })}
    </ul>
  </div>

export default RegionsFilter;
