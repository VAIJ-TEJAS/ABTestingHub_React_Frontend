/* eslint-disable @typescript-eslint/no-explicit-any */
import Plot from 'react-plotly.js';

interface PlotGraphProps {
  data: any;
  layout: any;
}


const PlotGraph: React.FC<PlotGraphProps> = ({data, layout}) => {
  const adjustedLayout = {
    ...layout,
    autosize: true,
  };

  return (
    <Plot
      data={data}
      layout={adjustedLayout}
      useResizeHandler={true} // Ensures the plot resizes correctly with the parent component
      style={{ width: "100%", height: "100%" }} // Set the width and height to 100%
    />
  );
};

export default PlotGraph;
