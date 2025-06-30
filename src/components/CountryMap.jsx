import React, { useState } from 'react';
import Plot from 'react-plotly.js';

const CountryMap = () => {
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, country: '', percentage: 0 });

  const handleHover = (event) => {
    if (event.points.length > 0) {
      const pointData = event.points[0];
      const country = pointData.location;
      const percentage = pointData.marker ? pointData.marker.color : 0;

      setTooltip({
        visible: true,
        x: event.event.clientX,
        y: event.event.clientY,
        country,
        percentage
      });
    }
  };

  const handleUnhover = () => {
    setTooltip({ ...tooltip, visible: false });
  };

  const data = [{
    type: 'scattergeo',
    mode: 'markers',
    locations: ['FRA', 'DEU', 'RUS', 'ESP'],
    marker: {
      size: [20, 30, 15, 50],
      color: [10, 20, 40, 30], 
      cmin: 0,
      cmax: 50,
      colorscale: 'Blues',
      showscale: false,
    },
    name: 'world data',
    hoverinfo: 'none', 
  }];

  const layout = {
    geo: {
      scope: 'world',
      resolution: 50,
      showland: true,
      landcolor: '#DEE7F4',
      subunitcolor: 'white',
      countrycolor: 'white',
      coastlinecolor: 'white',
      showcountries: true,
      showframe: false,
     scrollZoom: false
    },
    margin: {
      l: 0,
      r: 0,
      t: 20,
      b: 80
    },
    width: 688, 
    height: 400, 
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '105%', height: '100%',
        borderTopLeftRadius: '15px',
        borderBottomLeftRadius: '15px',
        overflow: 'hidden',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
      }}
    >
      <Plot
        data={data}
        layout={layout}
        style={{ width: '105%', height: '100%' }}
        onHover={handleHover}
        onUnhover={handleUnhover}
      />

      {tooltip.visible && (
        <div
          style={{
            position: 'fixed',
            top: tooltip.y - 40,
            left: tooltip.x + 10,
            backgroundColor: 'rgba(50, 50, 50, 0.9)',
            color: 'white',
            padding: '5px 10px',
            borderRadius: '5px',
            pointerEvents: 'none',
            transform: 'translate(-50%, -100%)',
            fontSize: '12px',
            whiteSpace: 'nowrap'
          }}
        >
          <strong>{tooltip.country}</strong>: {tooltip.percentage}%
        </div>
      )}
    </div>
  );
};

export default CountryMap;
