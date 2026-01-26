import CountUp from "react-countup";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Tooltip, Badge, Space, Typography, Popover, Spin, Alert } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined, InfoCircleOutlined, ReloadOutlined, DownloadOutlined, ShareAltOutlined, SettingOutlined, BarChartOutlined } from "@ant-design/icons";
import { formatNumber, formatCurrency, capitalizeFirstLetter } from "../utils/dataTransformers";
import { performanceMonitor } from "../utils/performanceMonitor";
import { defaultCache } from "../utils/cacheManager";

const { Text, Paragraph } = Typography;

interface RevenueCardProps {
  amount: number;
  icon: string;
  bgColor: string;
  title: string;
  prefix?: string;
  previousAmount?: number;
  trend?: 'up' | 'down' | 'neutral';
  trendPercentage?: number;
  onClick?: () => void;
  tooltip?: string;
  loading?: boolean;
  animated?: boolean;
  showTrend?: boolean;
  currency?: string;
  decimals?: number;
  onRefresh?: () => void;
  refreshable?: boolean;
  cacheKey?: string;
  enableCache?: boolean;
  enableAnalytics?: boolean;
  comparisonPeriod?: 'day' | 'week' | 'month' | 'year';
  historicalData?: Array<{ date: string; value: number }>;
  showDetails?: boolean;
  exportable?: boolean;
  shareable?: boolean;
  customizable?: boolean;
  alertThreshold?: { min?: number; max?: number };
  onThresholdAlert?: (type: 'min' | 'max') => void;
  animationDuration?: number;
  enableSound?: boolean;
  soundOnThreshold?: boolean;
  refreshInterval?: number;
  autoRefresh?: boolean;
  onDataChange?: (newAmount: number, oldAmount: number) => void;
  dataSource?: () => Promise<number>;
  errorHandler?: (error: Error) => void;
  successHandler?: (data: number) => void;
}

export const RevenueCard = ({
  amount,
  icon,
  bgColor,
  title,
  prefix,
  previousAmount,
  trend,
  trendPercentage,
  onClick,
  tooltip,
  loading = false,
  animated = true,
  showTrend = true,
  currency,
  decimals = 0,
  onRefresh,
  refreshable = false,
  cacheKey,
  enableCache = false,
  enableAnalytics = false,
  comparisonPeriod = 'month',
  historicalData = [],
  showDetails = false,
  exportable = false,
  shareable = false,
  customizable = false,
  alertThreshold,
  onThresholdAlert,
  animationDuration = 0.8,
  enableSound = false,
  soundOnThreshold = false,
  refreshInterval,
  autoRefresh = false,
  onDataChange,
  dataSource,
  errorHandler,
  successHandler,
}: RevenueCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [displayAmount, setDisplayAmount] = useState(0);
  const [previousDisplayAmount, setPreviousDisplayAmount] = useState(0);
  const [error, setError] = useState<Error | null>(null);
  const [showDetailsPanel, setShowDetailsPanel] = useState(false);
  const [customSettings, setCustomSettings] = useState({
    showPrevious: true,
    showTrend: true,
    showCurrency: true,
  });
  const [alertTriggered, setAlertTriggered] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mountTimeRef = useRef(Date.now());
  const renderCountRef = useRef(0);

  // Performance monitoring
  useEffect(() => {
    renderCountRef.current++;
    performanceMonitor.startTimer(`revenue-card-render-${title}`);
    return () => {
      performanceMonitor.endTimer(`revenue-card-render-${title}`, {
        renderCount: renderCountRef.current,
      });
    };
  }, [title]);

  // Cache management
  useEffect(() => {
    if (enableCache && cacheKey) {
      const cached = defaultCache.get<number>(cacheKey);
      if (cached !== null && cached !== amount) {
        setPreviousDisplayAmount(displayAmount);
        setDisplayAmount(cached);
      }
    }
  }, [enableCache, cacheKey, amount, displayAmount]);

  // Data fetching with cache
  useEffect(() => {
    if (dataSource && enableCache && cacheKey) {
      const cached = defaultCache.get<number>(cacheKey);
      if (cached === null) {
        dataSource()
          .then((data) => {
            defaultCache.set(cacheKey, data);
            if (onDataChange && data !== amount) {
              onDataChange(data, amount);
            }
            if (successHandler) {
              successHandler(data);
            }
          })
          .catch((err) => {
            setError(err);
            if (errorHandler) {
              errorHandler(err);
            }
          });
      }
    }
  }, [dataSource, enableCache, cacheKey, amount, onDataChange, successHandler, errorHandler]);

  // Amount animation with complex logic
  useEffect(() => {
    if (animated) {
      setPreviousDisplayAmount(displayAmount);
      setDisplayAmount(0);
      const timer = setTimeout(() => {
        setDisplayAmount(amount);
        if (enableCache && cacheKey) {
          defaultCache.set(cacheKey, amount);
        }
      }, 100);
      return () => clearTimeout(timer);
    } else {
      if (displayAmount !== amount) {
        setPreviousDisplayAmount(displayAmount);
        setDisplayAmount(amount);
        if (enableCache && cacheKey) {
          defaultCache.set(cacheKey, amount);
        }
      }
    }
  }, [amount, animated, enableCache, cacheKey, displayAmount]);

  // Threshold alert monitoring
  useEffect(() => {
    if (alertThreshold) {
      if (alertThreshold.min !== undefined && amount < alertThreshold.min) {
        if (!alertTriggered) {
          setAlertTriggered(true);
          if (onThresholdAlert) {
            onThresholdAlert('min');
          }
          if (enableSound && soundOnThreshold) {
            playAlertSound();
          }
        }
      } else if (alertThreshold.max !== undefined && amount > alertThreshold.max) {
        if (!alertTriggered) {
          setAlertTriggered(true);
          if (onThresholdAlert) {
            onThresholdAlert('max');
          }
          if (enableSound && soundOnThreshold) {
            playAlertSound();
          }
        }
      } else {
        setAlertTriggered(false);
      }
    }
  }, [amount, alertThreshold, alertTriggered, onThresholdAlert, enableSound, soundOnThreshold]);

  // Auto-refresh functionality
  useEffect(() => {
    if (autoRefresh && refreshInterval && onRefresh) {
      intervalRef.current = setInterval(() => {
        handleRefresh();
      }, refreshInterval);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [autoRefresh, refreshInterval, onRefresh]);

  // Analytics tracking
  useEffect(() => {
    if (enableAnalytics) {
      const timeOnPage = Date.now() - mountTimeRef.current;
      performanceMonitor.measureSync('revenue-card-analytics', () => {
        // Track analytics
        const analytics = {
          component: 'RevenueCard',
          title,
          amount,
          timeOnPage,
          renderCount: renderCountRef.current,
          hovered: isHovered,
        };
        defaultCache.set(`analytics:${title}`, analytics);
      });
    }
  }, [enableAnalytics, title, amount, isHovered]);

  const playAlertSound = useCallback(() => {
    if (typeof Audio !== 'undefined') {
      try {
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZijcIGWi77+efTRAMUKfj8LZjHAY4kdfyzHksBSR3x/DdkEAKFF606euoVRQKRp/g8r5sIQUrgc7y2Yo3CBlou+/nn00QDFCn4/C2YxwGOJHX8sx5LAUkd8fw3ZBAC');
        audio.volume = 0.3;
        audio.play().catch(() => {
          // Ignore audio play errors
        });
        audioRef.current = audio;
      } catch (e) {
        // Ignore audio errors
      }
    }
  }, []);

  const calculatedTrend = useMemo(() => {
    if (trend) return trend;
    if (previousAmount !== undefined && previousAmount !== null) {
      if (amount > previousAmount) return 'up';
      if (amount < previousAmount) return 'down';
      return 'neutral';
    }
    return null;
  }, [amount, previousAmount, trend]);

  const calculatedTrendPercentage = useMemo(() => {
    if (trendPercentage !== undefined) return trendPercentage;
    if (previousAmount !== undefined && previousAmount !== null && previousAmount !== 0) {
      return ((amount - previousAmount) / previousAmount) * 100;
    }
    return null;
  }, [amount, previousAmount, trendPercentage]);

  const handleRefresh = useCallback(async () => {
    if (onRefresh && !isRefreshing) {
      setIsRefreshing(true);
      performanceMonitor.startTimer(`revenue-card-refresh-${title}`);
      try {
        await performanceMonitor.measureAsync(`revenue-card-refresh-${title}`, async () => {
          await onRefresh();
          if (enableCache && cacheKey) {
            defaultCache.delete(cacheKey);
          }
        });
      } catch (error) {
        setError(error as Error);
        if (errorHandler) {
          errorHandler(error as Error);
        }
      } finally {
        setTimeout(() => setIsRefreshing(false), 500);
      }
    }
  }, [onRefresh, isRefreshing, title, enableCache, cacheKey, errorHandler]);

  const handleExport = useCallback(() => {
    const data = {
      title,
      amount,
      previousAmount,
      trend: calculatedTrend,
      trendPercentage: calculatedTrendPercentage,
      timestamp: new Date().toISOString(),
      historicalData,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [title, amount, previousAmount, calculatedTrend, calculatedTrendPercentage, historicalData]);

  const handleShare = useCallback(async () => {
    const shareData = {
      title: `${title}: ${formatCurrency(displayAmount, currency || prefix || '$', decimals)}`,
      text: `Check out this ${title} metric!`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // User cancelled or error occurred
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareData.title);
    }
  }, [title, displayAmount, currency, prefix, decimals]);

  const trendColor = useMemo(() => {
    if (calculatedTrend === 'up') return '#52c41a';
    if (calculatedTrend === 'down') return '#ff4d4f';
    return '#faad14';
  }, [calculatedTrend]);

  const TrendIndicator = () => {
    if (!showTrend || !calculatedTrend || calculatedTrendPercentage === null) {
      return null;
    }

    const Icon = calculatedTrend === 'up' ? ArrowUpOutlined : ArrowDownOutlined;
    const formattedPercentage = Math.abs(calculatedTrendPercentage).toFixed(1);

    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
        <Icon style={{ color: trendColor, fontSize: '14px' }} />
        <Text style={{ color: trendColor, fontSize: '12px', fontWeight: 500 }}>
          {formattedPercentage}%
        </Text>
      </div>
    );
  };

  const formattedAmount = useMemo(() => {
    return formatNumber(displayAmount, decimals);
  }, [displayAmount, decimals]);

  const analyticsData = useMemo(() => {
    if (!enableAnalytics) return null;
    return defaultCache.get(`analytics:${title}`);
  }, [enableAnalytics, title]);

  const historicalChartData = useMemo(() => {
    if (historicalData.length === 0) return null;
    return historicalData.map((item, index) => ({
      x: item.date,
      y: item.value,
      label: formatCurrency(item.value, currency || prefix || '$', decimals),
    }));
  }, [historicalData, currency, prefix, decimals]);

  const comparisonText = useMemo(() => {
    if (!previousAmount) return null;
    const diff = amount - previousAmount;
    const diffPercent = ((diff / previousAmount) * 100).toFixed(1);
    return `vs ${comparisonPeriod}: ${diff >= 0 ? '+' : ''}${formatCurrency(diff, currency || prefix || '$', decimals)} (${diffPercent}%)`;
  }, [amount, previousAmount, comparisonPeriod, currency, prefix, decimals]);

  const detailsContent = (
    <div style={{ minWidth: 300 }}>
      <Paragraph strong>Details</Paragraph>
      <Space direction="vertical" style={{ width: '100%' }}>
        <div>
          <Text type="secondary">Current Value: </Text>
          <Text strong>{formatCurrency(displayAmount, currency || prefix || '$', decimals)}</Text>
        </div>
        {previousAmount !== undefined && (
          <div>
            <Text type="secondary">Previous Value: </Text>
            <Text>{formatCurrency(previousAmount, currency || prefix || '$', decimals)}</Text>
          </div>
        )}
        {comparisonText && (
          <div>
            <Text type="secondary">{comparisonText}</Text>
          </div>
        )}
        {calculatedTrendPercentage !== null && (
          <div>
            <Text type="secondary">Trend: </Text>
            <Text type={calculatedTrend === 'up' ? 'success' : calculatedTrend === 'down' ? 'danger' : 'warning'}>
              {calculatedTrendPercentage >= 0 ? '+' : ''}{calculatedTrendPercentage.toFixed(1)}%
            </Text>
          </div>
        )}
        {analyticsData && (
          <div>
            <Text type="secondary">Render Count: </Text>
            <Text>{analyticsData.renderCount}</Text>
          </div>
        )}
        {historicalData.length > 0 && (
          <div>
            <Text type="secondary">Historical Data Points: </Text>
            <Text>{historicalData.length}</Text>
          </div>
        )}
      </Space>
    </div>
  );

  const cardContent = (
    <div
      className="mt-4 border-2 border-secondary rounded p-4 flex-1 h-60 transition-all duration-300 relative"
      style={{
        boxShadow: isHovered
          ? "0px 4px 30px 0px #00000060"
          : "0px 2px 25px 0px #00000040",
        transform: isHovered ? 'translateY(-2px) scale(1.01)' : 'translateY(0) scale(1)',
        cursor: onClick ? 'pointer' : 'default',
        background: bgColor ? `linear-gradient(135deg, ${bgColor}15 0%, ${bgColor}05 100%)` : undefined,
        borderColor: alertTriggered ? '#ff4d4f' : undefined,
        borderWidth: alertTriggered ? 3 : 2,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {alertTriggered && (
        <Alert
          message={amount < (alertThreshold?.min || 0) ? 'Below Minimum Threshold' : 'Above Maximum Threshold'}
          type="warning"
          showIcon
          closable
          onClose={() => setAlertTriggered(false)}
          style={{
            position: 'absolute',
            top: 8,
            left: 8,
            right: 8,
            zIndex: 10,
          }}
        />
      )}
      {error && (
        <Alert
          message="Error loading data"
          description={error.message}
          type="error"
          showIcon
          closable
          onClose={() => setError(null)}
          style={{
            position: 'absolute',
            top: 8,
            left: 8,
            right: 8,
            zIndex: 10,
          }}
        />
      )}
      <div className="flex flex-col justify-between w-full h-full">
        <div className="flex justify-between items-start">
          <div className="flex justify-center flex-1">
            <img 
              src={icon} 
              alt={title} 
              style={{ 
                maxHeight: '60px', 
                objectFit: 'contain',
                filter: isHovered ? 'brightness(1.2) drop-shadow(0 0 8px rgba(0,0,0,0.3))' : 'brightness(1)',
                transition: 'filter 0.3s',
              }} 
            />
          </div>
          <Space>
            {showDetails && (
              <Popover content={detailsContent} title="Card Details" trigger="click">
                <Tooltip title="View Details">
                  <BarChartOutlined
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDetailsPanel(!showDetailsPanel);
                    }}
                    style={{
                      cursor: 'pointer',
                      color: '#1890ff',
                      fontSize: '16px',
                      opacity: isHovered ? 1 : 0.6,
                    }}
                  />
                </Tooltip>
              </Popover>
            )}
            {exportable && (
              <Tooltip title="Export Data">
                <DownloadOutlined
                  onClick={(e) => {
                    e.stopPropagation();
                    handleExport();
                  }}
                  style={{
                    cursor: 'pointer',
                    color: '#52c41a',
                    fontSize: '16px',
                    opacity: isHovered ? 1 : 0.6,
                  }}
                />
              </Tooltip>
            )}
            {shareable && (
              <Tooltip title="Share">
                <ShareAltOutlined
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShare();
                  }}
                  style={{
                    cursor: 'pointer',
                    color: '#722ed1',
                    fontSize: '16px',
                    opacity: isHovered ? 1 : 0.6,
                  }}
                />
              </Tooltip>
            )}
            {customizable && (
              <Popover
                content={
                  <Space direction="vertical">
                    <label>
                      <input
                        type="checkbox"
                        checked={customSettings.showPrevious}
                        onChange={(e) =>
                          setCustomSettings({ ...customSettings, showPrevious: e.target.checked })
                        }
                      />
                      Show Previous
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        checked={customSettings.showTrend}
                        onChange={(e) =>
                          setCustomSettings({ ...customSettings, showTrend: e.target.checked })
                        }
                      />
                      Show Trend
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        checked={customSettings.showCurrency}
                        onChange={(e) =>
                          setCustomSettings({ ...customSettings, showCurrency: e.target.checked })
                        }
                      />
                      Show Currency
                    </label>
                  </Space>
                }
                title="Customize"
                trigger="click"
              >
                <Tooltip title="Customize">
                  <SettingOutlined
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      cursor: 'pointer',
                      color: '#faad14',
                      fontSize: '16px',
                      opacity: isHovered ? 1 : 0.6,
                    }}
                  />
                </Tooltip>
              </Popover>
            )}
            {refreshable && (
              <Tooltip title="Refresh">
                <ReloadOutlined
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRefresh();
                  }}
                  spin={isRefreshing}
                  style={{
                    cursor: 'pointer',
                    color: '#1890ff',
                    fontSize: '16px',
                    opacity: isHovered ? 1 : 0.6,
                    transition: 'opacity 0.3s',
                  }}
                />
              </Tooltip>
            )}
          </Space>
        </div>
        <div className="flex items-end justify-between gap-2">
          <div className="flex flex-col">
            <div className="text-secondary uppercase text-left text-lg font-semibold">
              {title}
            </div>
            <TrendIndicator />
          </div>
          <div className="flex flex-col items-end">
            <div className="text-5xl font-medium" style={{ color: trendColor }}>
              {loading ? (
                <Text type="secondary">Loading...</Text>
              ) : (
                <Space>
                  {currency && <Text style={{ fontSize: '24px' }}>{currency}</Text>}
                  {prefix && <Text style={{ fontSize: '24px' }}>{prefix}</Text>}
                  <CountUp
                    start={animated ? previousDisplayAmount : displayAmount}
                    end={displayAmount}
                    duration={animated ? animationDuration : 0}
                    separator=","
                    decimals={decimals}
                    onEnd={() => {
                      if (enableAnalytics) {
                        performanceMonitor.measureSync('countup-animation-end', () => {});
                      }
                    }}
                  />
                </Space>
              )}
            </div>
            {customSettings.showPrevious && previousAmount !== undefined && previousAmount !== null && (
              <Text type="secondary" style={{ fontSize: '12px' }}>
                Previous: {formatNumber(previousAmount, decimals)}
              </Text>
            )}
            {comparisonText && customSettings.showPrevious && (
              <Text type="secondary" style={{ fontSize: '11px', display: 'block', marginTop: 2 }}>
                {comparisonText}
              </Text>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  if (tooltip) {
    return (
      <Tooltip title={tooltip} placement="top">
        {cardContent}
      </Tooltip>
    );
  }

  return cardContent;
};
