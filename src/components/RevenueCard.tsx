import CountUp from "react-countup";
import { useState, useEffect, useCallback, useMemo } from "react";
import { Tooltip, Badge, Space, Typography } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined, InfoCircleOutlined, ReloadOutlined } from "@ant-design/icons";
import { formatNumber } from "../utils/dataTransformers";

const { Text } = Typography;

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
}: RevenueCardProps) => {
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
      try {
        await onRefresh();
      } finally {
        setTimeout(() => setIsRefreshing(false), 500);
      }
    }
  }, [onRefresh, isRefreshing]);

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

  const cardContent = (
    <div
      className="mt-4 border-2 border-secondary rounded p-4 flex-1 h-60 transition-all duration-300"
      style={{
        boxShadow: isHovered
          ? "0px 4px 30px 0px #00000060"
          : "0px 2px 25px 0px #00000040",
        transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
        cursor: onClick ? 'pointer' : 'default',
        background: bgColor ? `linear-gradient(135deg, ${bgColor}15 0%, ${bgColor}05 100%)` : undefined,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div className="flex flex-col justify-between w-full h-full">
        <div className="flex justify-between items-start">
          <div className="flex justify-center flex-1">
            <img src={icon} alt={title} style={{ maxHeight: '60px', objectFit: 'contain' }} />
          </div>
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
                    start={animated ? 0 : displayAmount}
                    end={displayAmount}
                    duration={animated ? 0.8 : 0}
                    separator=","
                    decimals={decimals}
                  />
                </Space>
              )}
            </div>
            {previousAmount !== undefined && previousAmount !== null && (
              <Text type="secondary" style={{ fontSize: '12px' }}>
                Previous: {formatNumber(previousAmount, decimals)}
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
