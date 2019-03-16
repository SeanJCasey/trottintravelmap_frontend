import React from 'react';
import { slugifyString } from '../utils';

import PlaceVisitedInputRow from './PlaceVisitedInputRow';

const PlacesForm = ({ placesByRegion, visitedPlaces, onPlaceRowChange, filters }) =>
  <form className="places-form">
    {Object.keys(placesByRegion).map((region, i) =>
      <div className="region"
           id={slugifyString(region)}
           key={i}
           style={{ display: filters.region !== slugifyString(region) ? 'none' : 'block' }}>
        <h4>{region}</h4>

        <ul className="list-unstyled">
          {placesByRegion[region].map(place =>
            // TODO: Need logic for non logged-in users to view somebody else's map.
            <PlaceVisitedInputRow
              place={place}
              visited={visitedPlaces.includes(place.id) ? true : false}
              key={place.id}
              onChange={onPlaceRowChange}
            />
          )}
        </ul>
      </div>
    )}
  </form>

export default PlacesForm;
