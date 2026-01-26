/**
 * Performance monitoring and optimization utilities
 * Provides functions for measuring, tracking, and optimizing performance
 */

export interface PerformanceMetric {
  name: string;
  duration: number;
  timestamp: number;
  metadata?: Record<string, any>;
}

export interface PerformanceReport {
  metrics: PerformanceMetric[];
  totalDuration: number;
  averageDuration: number;
  minDuration: number;
  maxDuration: number;
  count: number;
}

class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetric[]> = new Map();
  private activeTimers: Map<string, number> = new Map();
  private observers: Map<string, PerformanceObserver> = new Map();

  /**
   * Starts a performance timer
   */
  startTimer(name: string): void {
    if (typeof performance !== 'undefined' && performance.now) {
      this.activeTimers.set(name, performance.now());
    } else {
      this.activeTimers.set(name, Date.now());
    }
  }

  /**
   * Ends a performance timer and records the metric
   */
  endTimer(name: string, metadata?: Record<string, any>): number {
    const startTime = this.activeTimers.get(name);
    if (!startTime) {
      console.warn(`Timer "${name}" was not started`);
      return 0;
    }

    const endTime = typeof performance !== 'undefined' && performance.now
      ? performance.now()
      : Date.now();
    
    const duration = endTime - startTime;

    const metric: PerformanceMetric = {
      name,
      duration,
      timestamp: Date.now(),
      metadata,
    };

    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    this.metrics.get(name)!.push(metric);

    this.activeTimers.delete(name);
    return duration;
  }

  /**
   * Measures async function execution time
   */
  async measureAsync<T>(
    name: string,
    fn: () => Promise<T>,
    metadata?: Record<string, any>
  ): Promise<T> {
    this.startTimer(name);
    try {
      const result = await fn();
      this.endTimer(name, { ...metadata, success: true });
      return result;
    } catch (error) {
      this.endTimer(name, { ...metadata, success: false, error: String(error) });
      throw error;
    }
  }

  /**
   * Measures sync function execution time
   */
  measureSync<T>(
    name: string,
    fn: () => T,
    metadata?: Record<string, any>
  ): T {
    this.startTimer(name);
    try {
      const result = fn();
      this.endTimer(name, { ...metadata, success: true });
      return result;
    } catch (error) {
      this.endTimer(name, { ...metadata, success: false, error: String(error) });
      throw error;
    }
  }

  /**
   * Gets performance report for a metric
   */
  getReport(name: string): PerformanceReport | null {
    const metrics = this.metrics.get(name);
    if (!metrics || metrics.length === 0) {
      return null;
    }

    const durations = metrics.map(m => m.duration);
    const totalDuration = durations.reduce((sum, d) => sum + d, 0);
    const averageDuration = totalDuration / durations.length;
    const minDuration = Math.min(...durations);
    const maxDuration = Math.max(...durations);

    return {
      metrics,
      totalDuration,
      averageDuration,
      minDuration,
      maxDuration,
      count: metrics.length,
    };
  }

  /**
   * Gets all performance reports
   */
  getAllReports(): Record<string, PerformanceReport> {
    const reports: Record<string, PerformanceReport> = {};
    this.metrics.forEach((_, name) => {
      const report = this.getReport(name);
      if (report) {
        reports[name] = report;
      }
    });
    return reports;
  }

  /**
   * Clears metrics for a specific name
   */
  clearMetrics(name?: string): void {
    if (name) {
      this.metrics.delete(name);
    } else {
      this.metrics.clear();
    }
  }

  /**
   * Observes long tasks
   */
  observeLongTasks(callback: (entries: PerformanceEntry[]) => void): () => void {
    if (typeof PerformanceObserver === 'undefined') {
      return () => {};
    }

    try {
      const observer = new PerformanceObserver((list) => {
        callback(list.getEntries());
      });
      observer.observe({ entryTypes: ['longtask'] });
      this.observers.set('longtask', observer);

      return () => {
        observer.disconnect();
        this.observers.delete('longtask');
      };
    } catch (error) {
      console.warn('Long task observation not supported:', error);
      return () => {};
    }
  }

  /**
   * Observes paint metrics
   */
  observePaint(callback: (entries: PerformanceEntry[]) => void): () => void {
    if (typeof PerformanceObserver === 'undefined') {
      return () => {};
    }

    try {
      const observer = new PerformanceObserver((list) => {
        callback(list.getEntries());
      });
      observer.observe({ entryTypes: ['paint'] });
      this.observers.set('paint', observer);

      return () => {
        observer.disconnect();
        this.observers.delete('paint');
      };
    } catch (error) {
      console.warn('Paint observation not supported:', error);
      return () => {};
    }
  }

  /**
   * Observes navigation timing
   */
  observeNavigation(callback: (entry: PerformanceNavigationTiming) => void): () => void {
    if (typeof performance === 'undefined' || !performance.getEntriesByType) {
      return () => {};
    }

    try {
      const entries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
      if (entries.length > 0) {
        callback(entries[0]);
      }
      return () => {};
    } catch (error) {
      console.warn('Navigation timing not supported:', error);
      return () => {};
    }
  }

  /**
   * Gets memory usage (if available)
   */
  getMemoryUsage(): {
    usedJSHeapSize?: number;
    totalJSHeapSize?: number;
    jsHeapSizeLimit?: number;
  } | null {
    if (typeof performance !== 'undefined' && (performance as any).memory) {
      const memory = (performance as any).memory;
      return {
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        jsHeapSizeLimit: memory.jsHeapSizeLimit,
      };
    }
    return null;
  }

  /**
   * Measures render time for React components
   */
  measureRender<T>(
    componentName: string,
    renderFn: () => T
  ): T {
    return this.measureSync(`render:${componentName}`, renderFn, {
      type: 'render',
      component: componentName,
    });
  }

  /**
   * Measures API call performance
   */
  async measureAPI<T>(
    endpoint: string,
    apiCall: () => Promise<T>
  ): Promise<T> {
    return this.measureAsync(`api:${endpoint}`, apiCall, {
      type: 'api',
      endpoint,
    });
  }

  /**
   * Measures database query performance
   */
  async measureQuery<T>(
    queryName: string,
    queryFn: () => Promise<T>
  ): Promise<T> {
    return this.measureAsync(`query:${queryName}`, queryFn, {
      type: 'query',
      query: queryName,
    });
  }

  /**
   * Exports metrics as JSON
   */
  exportMetrics(): string {
    const allReports = this.getAllReports();
    return JSON.stringify(allReports, null, 2);
  }

  /**
   * Imports metrics from JSON
   */
  importMetrics(json: string): void {
    try {
      const reports = JSON.parse(json);
      Object.keys(reports).forEach((name) => {
        const report = reports[name];
        if (report.metrics && Array.isArray(report.metrics)) {
          this.metrics.set(name, report.metrics);
        }
      });
    } catch (error) {
      console.error('Failed to import metrics:', error);
    }
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor();

/**
 * Decorator for measuring function performance
 */
export function measurePerformance(name?: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    const metricName = name || `${target.constructor.name}.${propertyKey}`;

    if (originalMethod.constructor.name === 'AsyncFunction') {
      descriptor.value = async function (...args: any[]) {
        return performanceMonitor.measureAsync(
          metricName,
          () => originalMethod.apply(this, args)
        );
      };
    } else {
      descriptor.value = function (...args: any[]) {
        return performanceMonitor.measureSync(
          metricName,
          () => originalMethod.apply(this, args)
        );
      };
    }

    return descriptor;
  };
}

/**
 * Throttles function calls based on performance
 */
export function performanceThrottle<T extends (...args: any[]) => any>(
  fn: T,
  minInterval: number = 16
): T {
  let lastCall = 0;
  let timeoutId: NodeJS.Timeout | null = null;

  return ((...args: Parameters<T>) => {
    const now = Date.now();
    const timeSinceLastCall = now - lastCall;

    if (timeSinceLastCall >= minInterval) {
      lastCall = now;
      return fn(...args);
    } else {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        lastCall = Date.now();
        fn(...args);
      }, minInterval - timeSinceLastCall);
    }
  }) as T;
}

/**
 * Debounces function calls with performance tracking
 */
export function performanceDebounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number,
  metricName?: string
): T {
  let timeoutId: NodeJS.Timeout | null = null;

  return ((...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      if (metricName) {
        performanceMonitor.measureSync(metricName, () => fn(...args));
      } else {
        fn(...args);
      }
    }, delay);
  }) as T;
}

/**
 * Measures time to interactive
 */
export function measureTimeToInteractive(callback: (tti: number) => void): () => void {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const startTime = performance.now();
  let tti: number | null = null;

  const checkInteractive = () => {
    if (document.readyState === 'complete') {
      const loadTime = performance.now() - startTime;
      if (tti === null) {
        tti = loadTime;
        callback(tti);
      }
    }
  };

  if (document.readyState === 'complete') {
    checkInteractive();
  } else {
    window.addEventListener('load', checkInteractive);
  }

  return () => {
    window.removeEventListener('load', checkInteractive);
  };
}

/**
 * Measures first contentful paint
 */
export function measureFirstContentfulPaint(callback: (fcp: number) => void): () => void {
  if (typeof PerformanceObserver === 'undefined') {
    return () => {};
  }

  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.name === 'first-contentful-paint') {
          callback(entry.startTime);
          observer.disconnect();
        }
      });
    });

    observer.observe({ entryTypes: ['paint'] });

    return () => {
      observer.disconnect();
    };
  } catch (error) {
    console.warn('FCP measurement not supported:', error);
    return () => {};
  }
}

/**
 * Measures largest contentful paint
 */
export function measureLargestContentfulPaint(callback: (lcp: number) => void): () => void {
  if (typeof PerformanceObserver === 'undefined') {
    return () => {};
  }

  try {
    let lcpValue = 0;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1] as any;
      if (lastEntry && lastEntry.renderTime) {
        lcpValue = lastEntry.renderTime;
        callback(lcpValue);
      }
    });

    observer.observe({ entryTypes: ['largest-contentful-paint'] });

    return () => {
      observer.disconnect();
    };
  } catch (error) {
    console.warn('LCP measurement not supported:', error);
    return () => {};
  }
}

/**
 * Measures cumulative layout shift
 */
export function measureCumulativeLayoutShift(callback: (cls: number) => void): () => void {
  if (typeof PerformanceObserver === 'undefined') {
    return () => {};
  }

  try {
    let clsValue = 0;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries() as any[];
      entries.forEach((entry) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
          callback(clsValue);
        }
      });
    });

    observer.observe({ entryTypes: ['layout-shift'] });

    return () => {
      observer.disconnect();
    };
  } catch (error) {
    console.warn('CLS measurement not supported:', error);
    return () => {};
  }
}

/**
 * Gets Web Vitals metrics
 */
export function getWebVitals(): Promise<{
  fcp?: number;
  lcp?: number;
  cls?: number;
  tti?: number;
}> {
  return new Promise((resolve) => {
    const vitals: any = {};

    const cleanupFCP = measureFirstContentfulPaint((fcp) => {
      vitals.fcp = fcp;
      checkComplete();
    });

    const cleanupLCP = measureLargestContentfulPaint((lcp) => {
      vitals.lcp = lcp;
      checkComplete();
    });

    const cleanupCLS = measureCumulativeLayoutShift((cls) => {
      vitals.cls = cls;
      checkComplete();
    });

    const cleanupTTI = measureTimeToInteractive((tti) => {
      vitals.tti = tti;
      checkComplete();
    });

    const checkComplete = () => {
      if (Object.keys(vitals).length >= 4) {
        cleanupFCP();
        cleanupLCP();
        cleanupCLS();
        cleanupTTI();
        resolve(vitals);
      }
    };

    // Timeout after 10 seconds
    setTimeout(() => {
      cleanupFCP();
      cleanupLCP();
      cleanupCLS();
      cleanupTTI();
      resolve(vitals);
    }, 10000);
  });
}

