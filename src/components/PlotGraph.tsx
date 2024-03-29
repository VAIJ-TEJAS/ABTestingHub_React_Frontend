/* eslint-disable @typescript-eslint/no-explicit-any */
import Plot from 'react-plotly.js';

interface PlotGraphProps {
  data: any;
  layout: any;
}


const PlotGraph: React.FC<PlotGraphProps> = ({data, layout}) => {
  return (
    <Plot
      data={data}
      layout={layout}
      
    />
  );
};

export default PlotGraph;
