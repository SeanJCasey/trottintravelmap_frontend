import React from 'react';

import { calculateStatsForPlacesByIDs } from '../utils';

import FilterablePlaces from '../containers/FilterablePlaces';
import PlaceMapBlock from './PlaceMapBlock';
import StatBlocksRow from './StatBlocksRow';


const StaticPlacesVisitedMap = ({ placemap, places, placesByRegion, statsTotal, user }) =>

  <div className="static-traveler-map">
    <PlaceMapBlock
      places={places}
      visitedPlaces={placemap.placesVisited}
    />
    <div className="main-content-wrapper">
      <div className="container">
        <h1>{placemap.owner.name}'s Travel Map</h1>
        <StatBlocksRow
          statsTotal={statsTotal}
          statsVisited={calculateStatsForPlacesByIDs(placemap.placesVisited, places)}
        />
        <FilterablePlaces
          editable={false}
          placesByRegion={placesByRegion}
          visitedPlaces={placemap.placesVisited}
        />
      </div>
    </div>
  </div>

export default StaticPlacesVisitedMap;
