import React from 'react';

import Worldmap from './Worldmap';


const PlacesVisitedMap = ({ places, visitedPlaces }) =>
  <div className="worldmap">
    <div className="container">
      <div className="worldmap-wrapper">
        <Worldmap
          places={places}
          visitedPlaces={visitedPlaces}
        />
      </div>
    </div>
  </div>

export default PlacesVisitedMap;
