import React from 'react';
import { slugifyString } from '../utils';

import PlaceVisitedRow from './PlaceVisitedRow';

const PlacesList = ({ placesByRegion, visitedPlaces, filters }) =>
  <div className="places-list">

    {Object.keys(placesByRegion).map((region, i) =>
      <div className="region"
           id={slugifyString(region)}
           key={i}
           style={{ display: filters.region !== slugifyString(region) ? 'none' : 'block' }}>
        <h4>{region}</h4>

        <ul className="list-unstyled">
          {placesByRegion[region].map(place =>
            // TODO: Need logic for non logged-in users to view somebody else's map.
            <PlaceVisitedRow
              place={place}
              visited={visitedPlaces.includes(place.id) ? true : false}
              key={place.id}
            />
          )}
        </ul>
      </div>
    )}

  </div>

export default PlacesList;
