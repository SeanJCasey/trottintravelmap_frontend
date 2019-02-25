import React from 'react';
import { slugifyString } from '../utils';

import PlaceRow from './PlaceRow';

const PlacesList = ({ placesByRegion, visitedPlaces, onPlaceRowChange, filters }) =>
  <div className="place-list">

    {Object.keys(placesByRegion).map((region, i) =>
      <div className="region"
           id={slugifyString(region)}
           key={i}
           style={{ display: filters.region !== slugifyString(region) ? 'none' : 'block' }}>
        <h4>{region}</h4>

        <ul className="list-unstyled">
          {placesByRegion[region].map(place =>
            // TODO: Need logic for non logged-in users to view somebody else's map.
            <PlaceRow place={place}
                      visited={visitedPlaces.includes(place.id) ? true : false}
                      key={place.id}
                      onChange={onPlaceRowChange}
            />
          )}
        </ul>
      </div>
    )}

  </div>

export default PlacesList;
