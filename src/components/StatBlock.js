import React from 'react';
import CircularProgressbar from 'react-circular-progressbar';

// See https://www.npmjs.com/package/react-circular-progressbar
const StatBlock = ({ title, data, dataMax, statText, substatText }) =>
  <div className="stat-wrapper">
    <h4 className="stat-title">{title}</h4>
    <CircularProgressbar
      percentage={Math.round(data / dataMax * 100)}
      text={`${data}`}
      strokeWidth="15"
      initialAnimation={true}
    />
    <div className="stat-text">{statText}</div>
    <div className="substat-text">{substatText}</div>
  </div>

export default StatBlock;
