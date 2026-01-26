import { Modal, Button, Space, Typography, Divider, Alert } from 'antd';
import { ExclamationCircleOutlined, WarningOutlined, InfoCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { ReactNode } from 'react';

const { Text, Paragraph } = Typography;

export interface ConfirmationOptions {
  title?: string;
  message: string;
  type?: 'info' | 'warning' | 'error' | 'success';
  okText?: string;
  cancelText?: string;
  okType?: 'primary' | 'danger' | 'default';
  width?: number;
  showCancel?: boolean;
  icon?: ReactNode;
  description?: string;
  footer?: ReactNode;
  onOk?: () => void | Promise<void>;
  onCancel?: () => void;
  autoClose?: number; // Auto-close after seconds
  closable?: boolean;
  maskClosable?: boolean;
  centered?: boolean;
  zIndex?: number;
}

const getIconByType = (type: ConfirmationOptions['type']) => {
  switch (type) {
    case 'warning':
      return <WarningOutlined style={{ color: '#faad14' }} />;
    case 'error':
      return <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />;
    case 'success':
      return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
    case 'info':
    default:
      return <InfoCircleOutlined style={{ color: '#1890ff' }} />;
  }
};

const getAlertType = (type: ConfirmationOptions['type']) => {
  switch (type) {
    case 'warning':
      return 'warning';
    case 'error':
      return 'error';
    case 'success':
      return 'success';
    case 'info':
    default:
      return 'info';
  }
};

export const confirmation = (messageOrOptions: string | ConfirmationOptions): Promise<boolean> => {
  const options: ConfirmationOptions = typeof messageOrOptions === 'string'
    ? { message: messageOrOptions }
    : messageOrOptions;

  const {
    title = 'Confirmation',
    message,
    type = 'info',
    okText = 'Yes',
    cancelText = 'Cancel',
    okType = 'primary',
    width = 520,
    showCancel = true,
    icon,
    description,
    footer,
    onOk,
    onCancel,
    autoClose,
    closable = true,
    maskClosable = true,
    centered = true,
    zIndex = 1000,
  } = options;

  return new Promise((resolve) => {
    let autoCloseTimer: NodeJS.Timeout | null = null;
    let countdown: number = autoClose || 0;

    const handleConfirm = async () => {
      if (autoCloseTimer) {
        clearTimeout(autoCloseTimer);
      }
      
      if (onOk) {
        try {
          await onOk();
        } catch (error) {
          console.error('Confirmation onOk error:', error);
        }
      }
      
      resolve(true);
      modal.destroy();
    };

    const handleCancel = () => {
      if (autoCloseTimer) {
        clearTimeout(autoCloseTimer);
      }
      
      if (onCancel) {
        onCancel();
      }
      
      resolve(false);
      modal.destroy();
    };

    const handleAutoClose = () => {
      if (countdown > 0) {
        countdown--;
        // Update modal content if needed
        if (countdown === 0) {
          handleConfirm();
        } else {
          autoCloseTimer = setTimeout(handleAutoClose, 1000);
        }
      }
    };

    const modalContent = (
      <div>
        {description && (
          <Alert
            message={description}
            type={getAlertType(type)}
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}
        <Paragraph style={{ marginBottom: 0 }}>
          {message}
        </Paragraph>
        {autoClose && autoClose > 0 && (
          <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginTop: 8 }}>
            Auto-confirming in {countdown} seconds...
          </Text>
        )}
      </div>
    );

    const modal = Modal.confirm({
      title: (
        <Space>
          {icon || getIconByType(type)}
          <Text strong>{title}</Text>
        </Space>
      ),
      content: modalContent,
      onOk: handleConfirm,
      onCancel: showCancel ? handleCancel : undefined,
      okButtonProps: {
        type: okType,
        className: okType === 'danger' ? '' : 'bg-primary',
        danger: okType === 'danger',
      },
      cancelButtonProps: showCancel ? {} : undefined,
      okText,
      cancelText: showCancel ? cancelText : undefined,
      width,
      closable,
      maskClosable,
      centered,
      zIndex,
      footer: footer || undefined,
      icon: null, // We're using custom icon in title
    });

    // Start auto-close timer if specified
    if (autoClose && autoClose > 0) {
      autoCloseTimer = setTimeout(handleAutoClose, 1000);
    }
  });
};

/**
 * Convenience function for warning confirmation
 */
export const confirmWarning = (message: string, options?: Omit<ConfirmationOptions, 'message' | 'type'>): Promise<boolean> => {
  return confirmation({
    ...options,
    message,
    type: 'warning',
    okType: 'danger',
  });
};

/**
 * Convenience function for error confirmation
 */
export const confirmError = (message: string, options?: Omit<ConfirmationOptions, 'message' | 'type'>): Promise<boolean> => {
  return confirmation({
    ...options,
    message,
    type: 'error',
    okType: 'danger',
  });
};

/**
 * Convenience function for success confirmation
 */
export const confirmSuccess = (message: string, options?: Omit<ConfirmationOptions, 'message' | 'type'>): Promise<boolean> => {
  return confirmation({
    ...options,
    message,
    type: 'success',
  });
};

/**
 * Convenience function for info confirmation
 */
export const confirmInfo = (message: string, options?: Omit<ConfirmationOptions, 'message' | 'type'>): Promise<boolean> => {
  return confirmation({
    ...options,
    message,
    type: 'info',
  });
};