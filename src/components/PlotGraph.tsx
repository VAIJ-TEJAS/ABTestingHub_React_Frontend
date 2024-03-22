import React from 'react';
import Plot from 'react-plotly.js';

const PlotGraph = ({data, layout}) => {
  return (
    <Plot
      data={data}
      layout={layout}
    />
  );
};

export default PlotGraph;
