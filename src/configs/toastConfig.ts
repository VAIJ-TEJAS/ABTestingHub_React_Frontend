import { Bounce, Slide, Zoom, Flip, ToastOptions, Id } from "react-toastify";
import { ReactNode } from "react";

export interface ExtendedToastOptions extends ToastOptions {
  icon?: ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  persistent?: boolean;
  priority?: 'low' | 'medium' | 'high';
  category?: string;
  metadata?: Record<string, any>;
}

export const toastConfig: ToastOptions = {
  position: "top-center",
  autoClose: 1000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "light",
  transition: Bounce,
};

/**
 * Creates a custom toast configuration
 */
export const createToastConfig = (options: Partial<ExtendedToastOptions>): ExtendedToastOptions => {
  return {
    ...toastConfig,
    ...options,
  };
};

/**
 * Success toast configuration
 */
export const successToastConfig: ExtendedToastOptions = {
  ...toastConfig,
  type: 'success',
  autoClose: 3000,
  icon: '✅',
  position: 'top-right',
};

/**
 * Error toast configuration
 */
export const errorToastConfig: ExtendedToastOptions = {
  ...toastConfig,
  type: 'error',
  autoClose: 5000,
  icon: '❌',
  position: 'top-right',
  persistent: true,
  priority: 'high',
};

/**
 * Warning toast configuration
 */
export const warningToastConfig: ExtendedToastOptions = {
  ...toastConfig,
  type: 'warning',
  autoClose: 4000,
  icon: '⚠️',
  position: 'top-right',
};

/**
 * Info toast configuration
 */
export const infoToastConfig: ExtendedToastOptions = {
  ...toastConfig,
  type: 'info',
  autoClose: 3000,
  icon: 'ℹ️',
  position: 'top-right',
};

/**
 * Default toast configurations by type
 */
export const toastConfigsByType: Record<string, ExtendedToastOptions> = {
  success: successToastConfig,
  error: errorToastConfig,
  warning: warningToastConfig,
  info: infoToastConfig,
};

/**
 * Gets toast configuration by type
 */
export const getToastConfigByType = (type: 'success' | 'error' | 'warning' | 'info'): ExtendedToastOptions => {
  return toastConfigsByType[type] || toastConfig;
};

/**
 * Creates a persistent toast configuration
 */
export const createPersistentToast = (message: string, options?: Partial<ExtendedToastOptions>): ExtendedToastOptions => {
  return {
    ...toastConfig,
    ...options,
    autoClose: false,
    closeOnClick: false,
    draggable: true,
    persistent: true,
  };
};

/**
 * Creates a quick toast configuration (auto-closes quickly)
 */
export const createQuickToast = (message: string, options?: Partial<ExtendedToastOptions>): ExtendedToastOptions => {
  return {
    ...toastConfig,
    ...options,
    autoClose: 1500,
    hideProgressBar: true,
  };
};

/**
 * Creates a toast with action button
 */
export const createActionToast = (
  message: string,
  actionLabel: string,
  actionHandler: () => void,
  options?: Partial<ExtendedToastOptions>
): ExtendedToastOptions => {
  return {
    ...toastConfig,
    ...options,
    autoClose: 10000,
    action: {
      label: actionLabel,
      onClick: actionHandler,
    },
  };
};

/**
 * Creates a priority toast configuration
 */
export const createPriorityToast = (
  priority: 'low' | 'medium' | 'high',
  options?: Partial<ExtendedToastOptions>
): ExtendedToastOptions => {
  const priorityConfigs = {
    low: {
      position: 'bottom-right' as const,
      autoClose: 2000,
    },
    medium: {
      position: 'top-right' as const,
      autoClose: 3000,
    },
    high: {
      position: 'top-center' as const,
      autoClose: 5000,
      persistent: true,
    },
  };

  return {
    ...toastConfig,
    ...priorityConfigs[priority],
    ...options,
    priority,
  };
};

/**
 * Creates a categorized toast configuration
 */
export const createCategorizedToast = (
  category: string,
  options?: Partial<ExtendedToastOptions>
): ExtendedToastOptions => {
  const categoryColors: Record<string, string> = {
    'api': '#1890ff',
    'auth': '#52c41a',
    'error': '#ff4d4f',
    'warning': '#faad14',
    'info': '#1890ff',
  };

  return {
    ...toastConfig,
    ...options,
    category,
    style: {
      borderLeft: `4px solid ${categoryColors[category] || '#1890ff'}`,
    },
  };
};

/**
 * Toast position configurations
 */
export const toastPositions = {
  topLeft: { ...toastConfig, position: 'top-left' as const },
  topCenter: { ...toastConfig, position: 'top-center' as const },
  topRight: { ...toastConfig, position: 'top-right' as const },
  bottomLeft: { ...toastConfig, position: 'bottom-left' as const },
  bottomCenter: { ...toastConfig, position: 'bottom-center' as const },
  bottomRight: { ...toastConfig, position: 'bottom-right' as const },
};

/**
 * Toast transition configurations
 */
export const toastTransitions = {
  bounce: { ...toastConfig, transition: Bounce },
  slide: { ...toastConfig, transition: Slide },
  zoom: { ...toastConfig, transition: Zoom },
  flip: { ...toastConfig, transition: Flip },
};

/**
 * Default export
 */
export default toastConfig;
