/* eslint-disable @typescript-eslint/no-explicit-any */
import Plot from 'react-plotly.js';
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Button, Space, Select, Switch, Tooltip } from 'antd';
import { DownloadOutlined, FullscreenOutlined, ReloadOutlined, SettingOutlined } from '@ant-design/icons';

interface PlotGraphProps {
  data: any;
  layout: any;
  title?: string;
  showControls?: boolean;
  onDataPointClick?: (point: any) => void;
  exportEnabled?: boolean;
  theme?: 'light' | 'dark';
  responsive?: boolean;
}

const PlotGraph: React.FC<PlotGraphProps> = ({
  data,
  layout,
  title,
  showControls = true,
  onDataPointClick,
  exportEnabled = true,
  theme = 'light',
  responsive = true,
}) => {
  const [plotLayout, setPlotLayout] = useState(layout);
  const [plotData, setPlotData] = useState(data);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [chartType, setChartType] = useState<string>('auto');
  const [showLegend, setShowLegend] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const plotRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPlotData(data);
  }, [data]);

  useEffect(() => {
    setPlotLayout(layout);
  }, [layout]);

  const adjustedLayout = useMemo(() => {
    const baseLayout = {
      ...plotLayout,
      autosize: responsive,
      showlegend: showLegend,
      paper_bgcolor: theme === 'dark' ? '#1f1f1f' : '#fff',
      plot_bgcolor: theme === 'dark' ? '#2d2d2d' : '#fff',
      font: {
        color: theme === 'dark' ? '#fff' : '#000',
      },
      xaxis: {
        ...plotLayout?.xaxis,
        showgrid: showGrid,
        gridcolor: theme === 'dark' ? '#444' : '#e0e0e0',
      },
      yaxis: {
        ...plotLayout?.yaxis,
        showgrid: showGrid,
        gridcolor: theme === 'dark' ? '#444' : '#e0e0e0',
      },
    };

    if (title) {
      baseLayout.title = title;
    }

    return baseLayout;
  }, [plotLayout, theme, showLegend, showGrid, title, responsive]);

  const handleFullscreen = useCallback(() => {
    if (!containerRef.current) return;

    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const handleExport = useCallback((format: 'png' | 'svg' | 'jpeg' = 'png') => {
    if (!plotRef.current) return;

    const plotly = (window as any).Plotly;
    if (plotly) {
      plotly.downloadImage(plotRef.current, {
        format,
        width: 1200,
        height: 800,
        filename: title || 'plot',
      });
    }
  }, [title]);

  const handleReload = useCallback(() => {
    setPlotData([...data]);
    setPlotLayout({ ...layout });
  }, [data, layout]);

  const handleChartTypeChange = useCallback((type: string) => {
    setChartType(type);
    if (type !== 'auto' && plotData && plotData.length > 0) {
      const newData = plotData.map((trace: any) => ({
        ...trace,
        type: type === 'bar' ? 'bar' : type === 'line' ? 'scatter' : trace.type,
        mode: type === 'line' ? 'lines+markers' : trace.mode,
      }));
      setPlotData(newData);
    }
  }, [plotData]);

  const handleClick = useCallback((event: any) => {
    if (onDataPointClick && event?.points && event.points.length > 0) {
      onDataPointClick(event.points[0]);
    }
  }, [onDataPointClick]);

  const chartTypeOptions = [
    { label: 'Auto', value: 'auto' },
    { label: 'Line', value: 'line' },
    { label: 'Bar', value: 'bar' },
    { label: 'Scatter', value: 'scatter' },
  ];

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'relative' }}>
      {showControls && (
        <div style={{ 
          position: 'absolute', 
          top: 10, 
          right: 10, 
          zIndex: 1000,
          background: 'rgba(255, 255, 255, 0.9)',
          padding: '8px',
          borderRadius: '4px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        }}>
          <Space direction="vertical" size="small">
            <Space>
              <Select
                value={chartType}
                onChange={handleChartTypeChange}
                options={chartTypeOptions}
                style={{ width: 100 }}
                size="small"
              />
              <Tooltip title="Toggle Legend">
                <Switch
                  checked={showLegend}
                  onChange={setShowLegend}
                  size="small"
                />
              </Tooltip>
              <Tooltip title="Toggle Grid">
                <Switch
                  checked={showGrid}
                  onChange={setShowGrid}
                  size="small"
                />
              </Tooltip>
            </Space>
            <Space>
              {exportEnabled && (
                <>
                  <Tooltip title="Download PNG">
                    <Button
                      icon={<DownloadOutlined />}
                      size="small"
                      onClick={() => handleExport('png')}
                    />
                  </Tooltip>
                  <Tooltip title="Download SVG">
                    <Button
                      icon={<DownloadOutlined />}
                      size="small"
                      onClick={() => handleExport('svg')}
                    />
                  </Tooltip>
                </>
              )}
              <Tooltip title="Fullscreen">
                <Button
                  icon={<FullscreenOutlined />}
                  size="small"
                  onClick={handleFullscreen}
                />
              </Tooltip>
              <Tooltip title="Reload">
                <Button
                  icon={<ReloadOutlined />}
                  size="small"
                  onClick={handleReload}
                />
              </Tooltip>
            </Space>
          </Space>
        </div>
      )}
      <Plot
        ref={plotRef}
        data={plotData}
        layout={adjustedLayout}
        useResizeHandler={responsive}
        style={{ width: "100%", height: "100%" }}
        onRelayout={(update: any) => {
          setPlotLayout((prev: any) => ({ ...prev, ...update }));
        }}
        onClick={handleClick}
        config={{
          displayModeBar: showControls,
          displaylogo: false,
          responsive: responsive,
          toImageButtonOptions: {
            format: 'png',
            filename: title || 'plot',
            height: 800,
            width: 1200,
            scale: 1,
          },
        }}
      />
    </div>
  );
};

export default PlotGraph;
