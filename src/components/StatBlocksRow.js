import React from 'react';

import StatBlock from './StatBlock';


const StatBlocksRow = ({ statsTotal, statsVisited }) =>
  <div className="stats-wrapper">
    {statsTotal && statsVisited &&
      <div className="container">
        <div className="row">
          <div className="col-sm-4">
            <StatBlock
              title="Countries Visited"
              data={statsVisited.placeCount}
              dataMax={statsTotal.placeCount}
              statText={`Visited ${statsVisited.placeCount} of ${statsTotal.placeCount} places`}
              substatText={`UN Countries: ${statsVisited.countryCount}`}
            />
          </div>
          <div className="col-sm-4">
            <StatBlock
              title="Percent Visited"
              data={Math.round(statsVisited.area / statsTotal.area * 100)}
              dataMax="100"
              statText={`Visited ${Math.round(statsVisited.area / statsTotal.area * 100)}% of the world by landmass`}
              substatText={`Percent by number of countries: ${Math.round(statsVisited.placeCount / statsTotal.placeCount * 100)}%`}
            />
          </div>
          <div className="col-sm-4">
            <StatBlock
              title="Regions Visited"
              data={statsVisited.regionCount}
              dataMax={statsTotal.regionCount}
              statText={`Visited ${statsVisited.regionCount} of the ${statsTotal.regionCount} world regions`}
              substatText={`Continents: ${statsVisited.continentCount} of ${statsTotal.continentCount}`}
            />
          </div>
        </div>
      </div>
    }
  </div>

export default StatBlocksRow;
