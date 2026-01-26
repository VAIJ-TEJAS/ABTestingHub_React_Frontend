import CountUp from "react-countup";
import { useState, useEffect, useCallback, useMemo } from "react";
import { Tooltip, Badge, Space, Typography, Progress } from "antd";
import { InfoCircleOutlined, ReloadOutlined, EyeOutlined } from "@ant-design/icons";
import { formatNumber } from "../utils/dataTransformers";

const { Text } = Typography;

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
}: StatisticCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [displayAmount, setDisplayAmount] = useState(0);

  useEffect(() => {
    if (animated) {
      setDisplayAmount(0);
      const timer = setTimeout(() => {
        setDisplayAmount(amount);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setDisplayAmount(amount);
    }
  }, [amount, animated]);

  const handleRefresh = useCallback(async () => {
    if (onRefresh && !isRefreshing) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setTimeout(() => setIsRefreshing(false), 500);
      }
    }
  }, [onRefresh, isRefreshing]);

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
        borderColor: isHovered ? '#F9A828' : undefined,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick && clickable ? onClick : undefined}
    >
      {badge !== undefined && (
        <Badge
          count={badge}
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            backgroundColor: badgeColor,
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
              {description && (
                <Text type="secondary" style={{ fontSize: '11px', marginTop: 2 }}>
                  {description}
                </Text>
              )}
              {trend !== undefined && trend !== null && (
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
                    start={animated ? 0 : displayAmount}
                    end={displayAmount}
                    duration={animated ? 0.8 : 0}
                    separator=","
                    decimals={decimals}
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
