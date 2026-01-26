import CountUp from "react-countup";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Tooltip, Badge, Space, Typography, Progress, Popover, Alert, Spin, Switch } from "antd";
import { InfoCircleOutlined, ReloadOutlined, EyeOutlined, DownloadOutlined, ShareAltOutlined, SettingOutlined, BarChartOutlined, BellOutlined } from "@ant-design/icons";
import { formatNumber, formatCurrency, capitalizeFirstLetter } from "../utils/dataTransformers";
import { performanceMonitor } from "../utils/performanceMonitor";
import { defaultCache } from "../utils/cacheManager";

const { Text, Paragraph } = Typography;

interface StatisticCardProps {
  amount: number;
  icon: string;
  bgColor: string;
  title: string;
  prefix?: string;
  suffix?: string;
  onClick?: () => void;
  tooltip?: string;
  loading?: boolean;
  animated?: boolean;
  maxValue?: number;
  showProgress?: boolean;
  progressColor?: string;
  onRefresh?: () => void;
  refreshable?: boolean;
  clickable?: boolean;
  badge?: number | string;
  badgeColor?: string;
  description?: string;
  trend?: number;
  format?: 'number' | 'percentage' | 'currency';
  decimals?: number;
  cacheKey?: string;
  enableCache?: boolean;
  enableAnalytics?: boolean;
  showDetails?: boolean;
  exportable?: boolean;
  shareable?: boolean;
  customizable?: boolean;
  alertThreshold?: { min?: number; max?: number };
  onThresholdAlert?: (type: 'min' | 'max') => void;
  animationDuration?: number;
  refreshInterval?: number;
  autoRefresh?: boolean;
  onDataChange?: (newAmount: number, oldAmount: number) => void;
  dataSource?: () => Promise<number>;
  errorHandler?: (error: Error) => void;
  successHandler?: (data: number) => void;
  enableNotifications?: boolean;
  notificationThreshold?: number;
  historicalData?: Array<{ date: string; value: number }>;
  comparisonData?: Array<{ label: string; value: number }>;
  enableComparison?: boolean;
}

export const StatisticCard = ({
  amount,
  icon,
  bgColor,
  title,
  prefix,
  suffix,
  onClick,
  tooltip,
  loading = false,
  animated = true,
  maxValue,
  showProgress = false,
  progressColor,
  onRefresh,
  refreshable = false,
  clickable = true,
  badge,
  badgeColor = '#1890ff',
  description,
  trend,
  format = 'number',
  decimals = 0,
  cacheKey,
  enableCache = false,
  enableAnalytics = false,
  showDetails = false,
  exportable = false,
  shareable = false,
  customizable = false,
  alertThreshold,
  onThresholdAlert,
  animationDuration = 0.8,
  refreshInterval,
  autoRefresh = false,
  onDataChange,
  dataSource,
  errorHandler,
  successHandler,
  enableNotifications = false,
  notificationThreshold,
  historicalData = [],
  comparisonData = [],
  enableComparison = false,
}: StatisticCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [displayAmount, setDisplayAmount] = useState(0);
  const [previousDisplayAmount, setPreviousDisplayAmount] = useState(0);
  const [error, setError] = useState<Error | null>(null);
  const [showDetailsPanel, setShowDetailsPanel] = useState(false);
  const [alertTriggered, setAlertTriggered] = useState(false);
  const [notificationSent, setNotificationSent] = useState(false);
  const [customSettings, setCustomSettings] = useState({
    showProgress: true,
    showTrend: true,
    showDescription: true,
  });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const mountTimeRef = useRef(Date.now());
  const renderCountRef = useRef(0);
  const previousAmountRef = useRef(amount);

  // Performance monitoring
  useEffect(() => {
    renderCountRef.current++;
    performanceMonitor.startTimer(`statistic-card-render-${title}`);
    return () => {
      performanceMonitor.endTimer(`statistic-card-render-${title}`, {
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
        if (onDataChange && previousAmountRef.current !== amount) {
          onDataChange(amount, previousAmountRef.current);
          previousAmountRef.current = amount;
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
        if (onDataChange && previousAmountRef.current !== amount) {
          onDataChange(amount, previousAmountRef.current);
          previousAmountRef.current = amount;
        }
      }
    }
  }, [amount, animated, enableCache, cacheKey, displayAmount, onDataChange]);

  // Threshold alert monitoring
  useEffect(() => {
    if (alertThreshold) {
      if (alertThreshold.min !== undefined && amount < alertThreshold.min) {
        if (!alertTriggered) {
          setAlertTriggered(true);
          if (onThresholdAlert) {
            onThresholdAlert('min');
          }
          if (enableNotifications && !notificationSent) {
            sendNotification('Minimum threshold exceeded');
            setNotificationSent(true);
          }
        }
      } else if (alertThreshold.max !== undefined && amount > alertThreshold.max) {
        if (!alertTriggered) {
          setAlertTriggered(true);
          if (onThresholdAlert) {
            onThresholdAlert('max');
          }
          if (enableNotifications && !notificationSent) {
            sendNotification('Maximum threshold exceeded');
            setNotificationSent(true);
          }
        }
      } else {
        setAlertTriggered(false);
        setNotificationSent(false);
      }
    }
  }, [amount, alertThreshold, alertTriggered, onThresholdAlert, enableNotifications, notificationSent]);

  // Notification threshold monitoring
  useEffect(() => {
    if (enableNotifications && notificationThreshold !== undefined) {
      if (amount >= notificationThreshold && !notificationSent) {
        sendNotification(`${title} has reached ${formatNumber(amount, decimals)}`);
        setNotificationSent(true);
      } else if (amount < notificationThreshold) {
        setNotificationSent(false);
      }
    }
  }, [amount, enableNotifications, notificationThreshold, notificationSent, title, decimals]);

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
      performanceMonitor.measureSync('statistic-card-analytics', () => {
        const analytics = {
          component: 'StatisticCard',
          title,
          amount,
          timeOnPage,
          renderCount: renderCountRef.current,
          hovered: isHovered,
          progress: showProgress ? progressPercentage : null,
        };
        defaultCache.set(`analytics:${title}`, analytics);
      });
    }
  }, [enableAnalytics, title, amount, isHovered, showProgress, progressPercentage]);

  const sendNotification = useCallback((message: string) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`${title} Alert`, {
        body: message,
        icon: icon,
      });
    } else if ('Notification' in window && Notification.permission !== 'denied') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          new Notification(`${title} Alert`, {
            body: message,
            icon: icon,
          });
        }
      });
    }
  }, [title, icon]);

  const handleRefresh = useCallback(async () => {
    if (onRefresh && !isRefreshing) {
      setIsRefreshing(true);
      performanceMonitor.startTimer(`statistic-card-refresh-${title}`);
      try {
        await performanceMonitor.measureAsync(`statistic-card-refresh-${title}`, async () => {
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
      trend,
      format,
      timestamp: new Date().toISOString(),
      historicalData,
      comparisonData,
      progress: showProgress ? progressPercentage : null,
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
  }, [title, amount, trend, format, historicalData, comparisonData, showProgress, progressPercentage]);

  const handleShare = useCallback(async () => {
    const shareData = {
      title: `${title}: ${formattedAmount}`,
      text: `Check out this ${title} statistic!`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // User cancelled or error occurred
      }
    } else {
      navigator.clipboard.writeText(shareData.title);
    }
  }, [title, formattedAmount]);

  const analyticsData = useMemo(() => {
    if (!enableAnalytics) return null;
    return defaultCache.get(`analytics:${title}`);
  }, [enableAnalytics, title]);

  const detailsContent = (
    <div style={{ minWidth: 300 }}>
      <Paragraph strong>Details</Paragraph>
      <Space direction="vertical" style={{ width: '100%' }}>
        <div>
          <Text type="secondary">Current Value: </Text>
          <Text strong>{formattedAmount}</Text>
        </div>
        {trend !== undefined && (
          <div>
            <Text type="secondary">Trend: </Text>
            <Text type={trend >= 0 ? 'success' : 'danger'}>
              {trend >= 0 ? '+' : ''}{trend.toFixed(1)}%
            </Text>
          </div>
        )}
        {showProgress && maxValue && (
          <div>
            <Text type="secondary">Progress: </Text>
            <Text>{progressPercentage.toFixed(1)}%</Text>
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
        {comparisonData.length > 0 && (
          <div>
            <Text type="secondary">Comparisons: </Text>
            <Text>{comparisonData.length}</Text>
          </div>
        )}
      </Space>
    </div>
  );

  const progressPercentage = useMemo(() => {
    if (!showProgress || !maxValue || maxValue === 0) return 0;
    return Math.min((amount / maxValue) * 100, 100);
  }, [showProgress, maxValue, amount]);

  const formattedAmount = useMemo(() => {
    if (format === 'percentage') {
      return `${formatNumber(displayAmount, decimals)}%`;
    }
    if (format === 'currency') {
      return `${prefix || '$'}${formatNumber(displayAmount, decimals)}`;
    }
    return formatNumber(displayAmount, decimals);
  }, [displayAmount, format, decimals, prefix]);

  const cardContent = (
    <div
      className="mt-4 border-2 border-secondary rounded p-4 w-64 h-60 transition-all duration-300 relative"
      style={{
        boxShadow: isHovered
          ? "0px 4px 30px 0px #00000060"
          : "0px 2px 25px 0px #00000040",
        transform: isHovered ? 'translateY(-2px) scale(1.02)' : 'translateY(0) scale(1)',
        cursor: (onClick && clickable) ? 'pointer' : 'default',
        background: bgColor ? `linear-gradient(135deg, ${bgColor}15 0%, ${bgColor}05 100%)` : undefined,
        borderColor: alertTriggered ? '#ff4d4f' : isHovered ? '#F9A828' : undefined,
        borderWidth: alertTriggered ? 3 : 2,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick && clickable ? onClick : undefined}
    >
      {alertTriggered && (
        <Alert
          message={amount < (alertThreshold?.min || 0) ? 'Below Minimum' : 'Above Maximum'}
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
      {badge !== undefined && (
        <Badge
          count={badge}
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            backgroundColor: badgeColor,
            zIndex: 5,
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
                filter: isHovered ? 'brightness(1.1)' : 'brightness(1)',
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
                      fontSize: '14px',
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
                    fontSize: '14px',
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
                    fontSize: '14px',
                    opacity: isHovered ? 1 : 0.6,
                  }}
                />
              </Tooltip>
            )}
            {enableNotifications && (
              <Tooltip title="Notifications">
                <BellOutlined
                  style={{
                    color: notificationSent ? '#ff4d4f' : '#999',
                    fontSize: '14px',
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
                      <Switch
                        checked={customSettings.showProgress}
                        onChange={(checked) =>
                          setCustomSettings({ ...customSettings, showProgress: checked })
                        }
                      />
                      Show Progress
                    </label>
                    <label>
                      <Switch
                        checked={customSettings.showTrend}
                        onChange={(checked) =>
                          setCustomSettings({ ...customSettings, showTrend: checked })
                        }
                      />
                      Show Trend
                    </label>
                    <label>
                      <Switch
                        checked={customSettings.showDescription}
                        onChange={(checked) =>
                          setCustomSettings({ ...customSettings, showDescription: checked })
                        }
                      />
                      Show Description
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
                      fontSize: '14px',
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
                    fontSize: '14px',
                    opacity: isHovered ? 1 : 0.6,
                    transition: 'opacity 0.3s',
                  }}
                />
              </Tooltip>
            )}
            {tooltip && (
              <Tooltip title={tooltip}>
                <InfoCircleOutlined
                  style={{
                    color: '#999',
                    fontSize: '14px',
                    opacity: isHovered ? 1 : 0.6,
                  }}
                />
              </Tooltip>
            )}
          </Space>
        </div>
        
        <div className="flex flex-col gap-2">
          <div className="flex items-end justify-between gap-2">
            <div className="flex flex-col">
              <div className="text-secondary uppercase text-left text-lg font-semibold">
                {title}
              </div>
              {customSettings.showDescription && description && (
                <Text type="secondary" style={{ fontSize: '11px', marginTop: 2 }}>
                  {description}
                </Text>
              )}
              {customSettings.showTrend && trend !== undefined && trend !== null && (
                <Text
                  type={trend >= 0 ? 'success' : 'danger'}
                  style={{ fontSize: '12px', marginTop: 2 }}
                >
                  {trend >= 0 ? '+' : ''}{trend.toFixed(1)}%
                </Text>
              )}
            </div>
            <div className="text-4xl font-medium text-primary">
              {loading ? (
                <Text type="secondary">...</Text>
              ) : (
                <Space size={2}>
                  {prefix && <Text style={{ fontSize: '20px' }}>{prefix}</Text>}
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
                  {suffix && <Text style={{ fontSize: '20px' }}>{suffix}</Text>}
                </Space>
              )}
            </div>
          </div>
          
          {showProgress && maxValue && (
            <Progress
              percent={progressPercentage}
              showInfo={false}
              strokeColor={progressColor || bgColor || '#F9A828'}
              size="small"
              style={{ marginTop: 8 }}
            />
          )}
        </div>
      </div>
    </div>
  );

  return cardContent;
};
