import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  performanceMonitor,
  measurePerformance,
  performanceThrottle,
  performanceDebounce,
  measureTimeToInteractive,
  measureFirstContentfulPaint,
  measureLargestContentfulPaint,
  measureCumulativeLayoutShift,
  getWebVitals,
} from '../performanceMonitor'

describe('performanceMonitor', () => {
  beforeEach(() => {
    performanceMonitor.clearMetrics()
    vi.clearAllMocks()
  })

  afterEach(() => {
    performanceMonitor.clearMetrics()
  })

  describe('Timer Management', () => {
    it('starts and ends timer correctly', () => {
      performanceMonitor.startTimer('test-timer')
      const duration = performanceMonitor.endTimer('test-timer')
      expect(duration).toBeGreaterThanOrEqual(0)
    })

    it('returns 0 if timer was not started', () => {
      const duration = performanceMonitor.endTimer('non-existent-timer')
      expect(duration).toBe(0)
    })

    it('handles multiple timers', () => {
      performanceMonitor.startTimer('timer1')
      performanceMonitor.startTimer('timer2')
      const duration1 = performanceMonitor.endTimer('timer1')
      const duration2 = performanceMonitor.endTimer('timer2')
      expect(duration1).toBeGreaterThanOrEqual(0)
      expect(duration2).toBeGreaterThanOrEqual(0)
    })

    it('records metrics with metadata', () => {
      performanceMonitor.startTimer('test')
      performanceMonitor.endTimer('test', { key: 'value' })
      const report = performanceMonitor.getReport('test')
      expect(report).not.toBeNull()
      expect(report?.metrics[0].metadata?.key).toBe('value')
    })
  })

  describe('Async Function Measurement', () => {
    it('measures async function execution', async () => {
      const asyncFn = async () => {
        await new Promise(resolve => setTimeout(resolve, 10))
        return 'result'
      }
      const result = await performanceMonitor.measureAsync('async-test', asyncFn)
      expect(result).toBe('result')
      const report = performanceMonitor.getReport('async-test')
      expect(report).not.toBeNull()
    })

    it('handles async function errors', async () => {
      const asyncFn = async () => {
        throw new Error('Test error')
      }
      await expect(
        performanceMonitor.measureAsync('async-error', asyncFn)
      ).rejects.toThrow('Test error')
      const report = performanceMonitor.getReport('async-error')
      expect(report?.metrics[0].metadata?.success).toBe(false)
    })

    it('records success metadata for async functions', async () => {
      const asyncFn = async () => 'success'
      await performanceMonitor.measureAsync('async-success', asyncFn, { custom: 'data' })
      const report = performanceMonitor.getReport('async-success')
      expect(report?.metrics[0].metadata?.success).toBe(true)
      expect(report?.metrics[0].metadata?.custom).toBe('data')
    })
  })

  describe('Sync Function Measurement', () => {
    it('measures sync function execution', () => {
      const syncFn = () => 'result'
      const result = performanceMonitor.measureSync('sync-test', syncFn)
      expect(result).toBe('result')
      const report = performanceMonitor.getReport('sync-test')
      expect(report).not.toBeNull()
    })

    it('handles sync function errors', () => {
      const syncFn = () => {
        throw new Error('Test error')
      }
      expect(() => {
        performanceMonitor.measureSync('sync-error', syncFn)
      }).toThrow('Test error')
      const report = performanceMonitor.getReport('sync-error')
      expect(report?.metrics[0].metadata?.success).toBe(false)
    })
  })

  describe('Performance Reports', () => {
    it('generates report with statistics', () => {
      performanceMonitor.startTimer('stats-test')
      performanceMonitor.endTimer('stats-test')
      performanceMonitor.startTimer('stats-test')
      performanceMonitor.endTimer('stats-test')
      
      const report = performanceMonitor.getReport('stats-test')
      expect(report).not.toBeNull()
      expect(report?.count).toBe(2)
      expect(report?.averageDuration).toBeGreaterThanOrEqual(0)
      expect(report?.minDuration).toBeGreaterThanOrEqual(0)
      expect(report?.maxDuration).toBeGreaterThanOrEqual(0)
    })

    it('returns null for non-existent metric', () => {
      const report = performanceMonitor.getReport('non-existent')
      expect(report).toBeNull()
    })

    it('gets all reports', () => {
      performanceMonitor.startTimer('report1')
      performanceMonitor.endTimer('report1')
      performanceMonitor.startTimer('report2')
      performanceMonitor.endTimer('report2')
      
      const reports = performanceMonitor.getAllReports()
      expect(Object.keys(reports)).toContain('report1')
      expect(Object.keys(reports)).toContain('report2')
    })

    it('clears specific metrics', () => {
      performanceMonitor.startTimer('clear-test')
      performanceMonitor.endTimer('clear-test')
      performanceMonitor.clearMetrics('clear-test')
      const report = performanceMonitor.getReport('clear-test')
      expect(report).toBeNull()
    })

    it('clears all metrics', () => {
      performanceMonitor.startTimer('clear1')
      performanceMonitor.endTimer('clear1')
      performanceMonitor.startTimer('clear2')
      performanceMonitor.endTimer('clear2')
      performanceMonitor.clearMetrics()
      const reports = performanceMonitor.getAllReports()
      expect(Object.keys(reports)).toHaveLength(0)
    })
  })

  describe('Memory Usage', () => {
    it('gets memory usage if available', () => {
      const memory = performanceMonitor.getMemoryUsage()
      // May be null if not available
      if (memory) {
        expect(memory).toHaveProperty('usedJSHeapSize')
      }
    })
  })

  describe('Export and Import', () => {
    it('exports metrics as JSON', () => {
      performanceMonitor.startTimer('export-test')
      performanceMonitor.endTimer('export-test')
      const json = performanceMonitor.exportMetrics()
      expect(json).toBeTruthy()
      expect(() => JSON.parse(json)).not.toThrow()
    })

    it('imports metrics from JSON', () => {
      const testData = {
        'import-test': {
          metrics: [
            {
              name: 'import-test',
              duration: 100,
              timestamp: Date.now(),
            },
          ],
        },
      }
      performanceMonitor.importMetrics(JSON.stringify(testData))
      const report = performanceMonitor.getReport('import-test')
      expect(report).not.toBeNull()
    })
  })

  describe('Performance Throttle', () => {
    it('throttles function calls', async () => {
      const fn = vi.fn()
      const throttled = performanceThrottle(fn, 100)
      
      throttled()
      throttled()
      throttled()
      
      expect(fn).toHaveBeenCalledTimes(1)
      
      await new Promise(resolve => setTimeout(resolve, 150))
      throttled()
      expect(fn).toHaveBeenCalledTimes(2)
    })
  })

  describe('Performance Debounce', () => {
    it('debounces function calls', async () => {
      const fn = vi.fn()
      const debounced = performanceDebounce(fn, 100, 'debounce-test')
      
      debounced()
      debounced()
      debounced()
      
      await new Promise(resolve => setTimeout(resolve, 150))
      expect(fn).toHaveBeenCalledTimes(1)
    })
  })

  describe('Web Vitals', () => {
    it('measures time to interactive', (done) => {
      const cleanup = measureTimeToInteractive((tti) => {
        expect(tti).toBeGreaterThanOrEqual(0)
        cleanup()
        done()
      })
    })

    it('measures first contentful paint', (done) => {
      const cleanup = measureFirstContentfulPaint((fcp) => {
        expect(fcp).toBeGreaterThanOrEqual(0)
        cleanup()
        done()
      })
      // Cleanup after timeout
      setTimeout(() => {
        cleanup()
        if (!done) done()
      }, 100)
    })

    it('measures largest contentful paint', (done) => {
      const cleanup = measureLargestContentfulPaint((lcp) => {
        expect(lcp).toBeGreaterThanOrEqual(0)
        cleanup()
        done()
      })
      setTimeout(() => {
        cleanup()
        if (!done) done()
      }, 100)
    })

    it('measures cumulative layout shift', (done) => {
      const cleanup = measureCumulativeLayoutShift((cls) => {
        expect(cls).toBeGreaterThanOrEqual(0)
        cleanup()
        done()
      })
      setTimeout(() => {
        cleanup()
        if (!done) done()
      }, 100)
    })

    it('gets web vitals metrics', async () => {
      const vitals = await getWebVitals()
      expect(vitals).toBeDefined()
      expect(typeof vitals).toBe('object')
    })
  })

  describe('Specialized Measurements', () => {
    it('measures render performance', () => {
      const result = performanceMonitor.measureRender('TestComponent', () => {
        return 'rendered'
      })
      expect(result).toBe('rendered')
      const report = performanceMonitor.getReport('render:TestComponent')
      expect(report).not.toBeNull()
    })

    it('measures API call performance', async () => {
      const apiCall = async () => {
        await new Promise(resolve => setTimeout(resolve, 10))
        return { data: 'test' }
      }
      const result = await performanceMonitor.measureAPI('/test-endpoint', apiCall)
      expect(result.data).toBe('test')
      const report = performanceMonitor.getReport('api:/test-endpoint')
      expect(report).not.toBeNull()
    })

    it('measures query performance', async () => {
      const queryFn = async () => {
        return [{ id: 1, name: 'test' }]
      }
      const result = await performanceMonitor.measureQuery('getUsers', queryFn)
      expect(result).toHaveLength(1)
      const report = performanceMonitor.getReport('query:getUsers')
      expect(report).not.toBeNull()
    })
  })
})

