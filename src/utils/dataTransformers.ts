/**
 * Comprehensive data transformation utilities
 * Provides functions for transforming, filtering, sorting, and manipulating data
 */

export interface SortOptions {
  key: string;
  order?: 'asc' | 'desc';
  type?: 'string' | 'number' | 'date';
}

export interface FilterOptions {
  key: string;
  value: any;
  operator?: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'greaterThan' | 'lessThan' | 'between';
}

export interface GroupByOptions {
  key: string;
  transform?: (group: any[]) => any;
}

/**
 * Sorts an array of objects by a specified key
 */
export const sortArray = <T extends Record<string, any>>(
  array: T[],
  options: SortOptions | SortOptions[]
): T[] => {
  if (!Array.isArray(array) || array.length === 0) {
    return array;
  }

  const sortOptions = Array.isArray(options) ? options : [options];

  return [...array].sort((a, b) => {
    for (const option of sortOptions) {
      const { key, order = 'asc', type = 'string' } = option;
      const aValue = a[key];
      const bValue = b[key];

      let comparison = 0;

      if (type === 'number') {
        comparison = (aValue || 0) - (bValue || 0);
      } else if (type === 'date') {
        const aDate = new Date(aValue || 0).getTime();
        const bDate = new Date(bValue || 0).getTime();
        comparison = aDate - bDate;
      } else {
        const aStr = String(aValue || '').toLowerCase();
        const bStr = String(bValue || '').toLowerCase();
        comparison = aStr.localeCompare(bStr);
      }

      if (comparison !== 0) {
        return order === 'desc' ? -comparison : comparison;
      }
    }

    return 0;
  });
};

/**
 * Filters an array based on criteria
 */
export const filterArray = <T extends Record<string, any>>(
  array: T[],
  options: FilterOptions | FilterOptions[]
): T[] => {
  if (!Array.isArray(array)) {
    return [];
  }

  const filterOptions = Array.isArray(options) ? options : [options];

  return array.filter((item) => {
    return filterOptions.every((option) => {
      const { key, value, operator = 'equals' } = option;
      const itemValue = item[key];

      switch (operator) {
        case 'equals':
          return itemValue === value;
        case 'contains':
          return String(itemValue).toLowerCase().includes(String(value).toLowerCase());
        case 'startsWith':
          return String(itemValue).toLowerCase().startsWith(String(value).toLowerCase());
        case 'endsWith':
          return String(itemValue).toLowerCase().endsWith(String(value).toLowerCase());
        case 'greaterThan':
          return Number(itemValue) > Number(value);
        case 'lessThan':
          return Number(itemValue) < Number(value);
        case 'between':
          const [min, max] = Array.isArray(value) ? value : [value, value];
          return Number(itemValue) >= Number(min) && Number(itemValue) <= Number(max);
        default:
          return true;
      }
    });
  });
};

/**
 * Groups array items by a key
 */
export const groupBy = <T extends Record<string, any>>(
  array: T[],
  options: GroupByOptions | string
): Record<string, T[]> => {
  if (!Array.isArray(array)) {
    return {};
  }

  const key = typeof options === 'string' ? options : options.key;
  const transform = typeof options === 'object' ? options.transform : undefined;

  const grouped = array.reduce((acc, item) => {
    const groupKey = String(item[key] || 'undefined');
    if (!acc[groupKey]) {
      acc[groupKey] = [];
    }
    acc[groupKey].push(item);
    return acc;
  }, {} as Record<string, T[]>);

  if (transform) {
    return Object.keys(grouped).reduce((acc, key) => {
      acc[key] = transform(grouped[key]);
      return acc;
    }, {} as Record<string, any>);
  }

  return grouped;
};

/**
 * Paginates an array
 */
export const paginate = <T>(
  array: T[],
  page: number,
  pageSize: number
): { data: T[]; total: number; page: number; pageSize: number; totalPages: number } => {
  if (!Array.isArray(array)) {
    return {
      data: [],
      total: 0,
      page: 1,
      pageSize,
      totalPages: 0,
    };
  }

  const total = array.length;
  const totalPages = Math.ceil(total / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const data = array.slice(startIndex, endIndex);

  return {
    data,
    total,
    page,
    pageSize,
    totalPages,
  };
};

/**
 * Removes duplicates from array
 */
export const removeDuplicates = <T>(
  array: T[],
  key?: (item: T) => any
): T[] => {
  if (!Array.isArray(array)) {
    return [];
  }

  if (key) {
    const seen = new Set();
    return array.filter((item) => {
      const keyValue = key(item);
      if (seen.has(keyValue)) {
        return false;
      }
      seen.add(keyValue);
      return true;
    });
  }

  return Array.from(new Set(array));
};

/**
 * Flattens nested array
 */
export const flatten = <T>(array: (T | T[])[]): T[] => {
  if (!Array.isArray(array)) {
    return [];
  }

  return array.reduce((acc, item) => {
    if (Array.isArray(item)) {
      acc.push(...flatten(item));
    } else {
      acc.push(item);
    }
    return acc;
  }, [] as T[]);
};

/**
 * Chunks array into smaller arrays
 */
export const chunk = <T>(array: T[], size: number): T[][] => {
  if (!Array.isArray(array) || size <= 0) {
    return [];
  }

  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

/**
 * Calculates statistics for numeric array
 */
export const calculateStats = (numbers: number[]): {
  sum: number;
  average: number;
  min: number;
  max: number;
  median: number;
  mode: number | null;
  standardDeviation: number;
} => {
  if (!Array.isArray(numbers) || numbers.length === 0) {
    return {
      sum: 0,
      average: 0,
      min: 0,
      max: 0,
      median: 0,
      mode: null,
      standardDeviation: 0,
    };
  }

  const sorted = [...numbers].sort((a, b) => a - b);
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  const average = sum / numbers.length;
  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  const median = sorted.length % 2 === 0
    ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
    : sorted[Math.floor(sorted.length / 2)];

  // Calculate mode
  const frequency: Record<number, number> = {};
  numbers.forEach((num) => {
    frequency[num] = (frequency[num] || 0) + 1;
  });
  const maxFreq = Math.max(...Object.values(frequency));
  const mode = maxFreq > 1
    ? Number(Object.keys(frequency).find((key) => frequency[Number(key)] === maxFreq) || null)
    : null;

  // Calculate standard deviation
  const variance = numbers.reduce((acc, num) => acc + Math.pow(num - average, 2), 0) / numbers.length;
  const standardDeviation = Math.sqrt(variance);

  return {
    sum,
    average,
    min,
    max,
    median,
    mode,
    standardDeviation,
  };
};

/**
 * Transforms object keys
 */
export const transformKeys = <T extends Record<string, any>>(
  obj: T,
  transformer: (key: string) => string
): Record<string, any> => {
  if (!obj || typeof obj !== 'object') {
    return {};
  }

  return Object.keys(obj).reduce((acc, key) => {
    acc[transformer(key)] = obj[key];
    return acc;
  }, {} as Record<string, any>);
};

/**
 * Deep clones an object
 */
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as any;
  }

  if (obj instanceof Array) {
    return obj.map((item) => deepClone(item)) as any;
  }

  if (typeof obj === 'object') {
    const cloned = {} as T;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = deepClone(obj[key]);
      }
    }
    return cloned;
  }

  return obj;
};

/**
 * Merges multiple objects deeply
 */
export const deepMerge = <T extends Record<string, any>>(
  target: T,
  ...sources: Partial<T>[]
): T => {
  if (!sources.length) {
    return target;
  }

  const result = deepClone(target);

  sources.forEach((source) => {
    if (source && typeof source === 'object') {
      Object.keys(source).forEach((key) => {
        const sourceValue = source[key];
        const targetValue = result[key];

        if (
          sourceValue &&
          typeof sourceValue === 'object' &&
          !Array.isArray(sourceValue) &&
          targetValue &&
          typeof targetValue === 'object' &&
          !Array.isArray(targetValue)
        ) {
          result[key] = deepMerge(targetValue, sourceValue);
        } else {
          result[key] = sourceValue;
        }
      });
    }
  });

  return result;
};

/**
 * Converts array to object using key function
 */
export const arrayToObject = <T>(
  array: T[],
  keyFn: (item: T) => string
): Record<string, T> => {
  if (!Array.isArray(array)) {
    return {};
  }

  return array.reduce((acc, item) => {
    acc[keyFn(item)] = item;
    return acc;
  }, {} as Record<string, T>);
};

/**
 * Converts object to array
 */
export const objectToArray = <T>(
  obj: Record<string, T>
): T[] => {
  if (!obj || typeof obj !== 'object') {
    return [];
  }

  return Object.values(obj);
};

/**
 * Debounce function
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean = false;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
};

/**
 * Formats number with commas
 */
export const formatNumber = (num: number, decimals: number = 0): string => {
  if (isNaN(num)) {
    return '0';
  }

  return num.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * Formats bytes to human readable format
 */
export const formatBytes = (bytes: number, decimals: number = 2): string => {
  if (bytes === 0) {
    return '0 Bytes';
  }

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

/**
 * Generates unique ID
 */
export const generateId = (prefix: string = ''): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 9);
  return prefix ? `${prefix}-${timestamp}-${random}` : `${timestamp}-${random}`;
};

