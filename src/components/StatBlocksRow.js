import React from 'react';

import StatBlock from './StatBlock';


const StatBlocksRow = ({ stats }) =>
  <div className="stats container">
    <div className="row">
      <div className="col-sm-4">
        <StatBlock
          title="Countries Visited"
          data={stats.placeCountVisited}
          dataMax={stats.placeCountTotal}
          statText={`Visited ${stats.placeCountVisited} of ${stats.placeCountTotal} places`}
          substatText={`UN Countries: ${stats.countryCountVisited}`}
        />
      </div>
      <div className="col-sm-4">
        <StatBlock
          title="Percent Visited"
          data={Math.round(stats.areaVisited / stats.areaTotal * 100)}
          dataMax="100"
          statText={`Visited ${Math.round(stats.areaVisited / stats.areaTotal * 100)}% of the world by landmass`}
          substatText={`Percent by number of countries: ${Math.round(stats.placeCountVisited / stats.placeCountTotal * 100)}%`}
        />
      </div>
      <div className="col-sm-4">
        <StatBlock
          title="Regions Visited"
          data={stats.regionCountVisited}
          dataMax={stats.regionCountTotal}
          statText={`Visited ${stats.regionCountVisited} of the ${stats.regionCountTotal} world regions`}
          substatText={`Continents: ${stats.continentCountVisited} of ${stats.continentCountTotal}`}
        />
      </div>
    </div>
  </div>

export default StatBlocksRow;
