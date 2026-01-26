import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  sortArray,
  filterArray,
  groupBy,
  paginate,
  removeDuplicates,
  flatten,
  chunk,
  calculateStats,
  transformKeys,
  deepClone,
  deepMerge,
  arrayToObject,
  objectToArray,
  debounce,
  throttle,
  formatNumber,
  formatBytes,
  generateId,
  type SortOptions,
  type FilterOptions,
  type GroupByOptions,
} from '../dataTransformers'

describe('dataTransformers', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('sortArray', () => {
    it('sorts array by string key ascending', () => {
      const data = [
        { name: 'Charlie', age: 30 },
        { name: 'Alice', age: 25 },
        { name: 'Bob', age: 35 },
      ]
      const result = sortArray(data, { key: 'name', order: 'asc' })
      expect(result[0].name).toBe('Alice')
      expect(result[2].name).toBe('Charlie')
    })

    it('sorts array by string key descending', () => {
      const data = [
        { name: 'Alice', age: 25 },
        { name: 'Bob', age: 35 },
        { name: 'Charlie', age: 30 },
      ]
      const result = sortArray(data, { key: 'name', order: 'desc' })
      expect(result[0].name).toBe('Charlie')
      expect(result[2].name).toBe('Alice')
    })

    it('sorts array by number key', () => {
      const data = [
        { name: 'Alice', age: 30 },
        { name: 'Bob', age: 25 },
        { name: 'Charlie', age: 35 },
      ]
      const result = sortArray(data, { key: 'age', type: 'number' })
      expect(result[0].age).toBe(25)
      expect(result[2].age).toBe(35)
    })

    it('sorts array by date key', () => {
      const data = [
        { name: 'Alice', date: new Date('2024-01-01') },
        { name: 'Bob', date: new Date('2024-03-01') },
        { name: 'Charlie', date: new Date('2024-02-01') },
      ]
      const result = sortArray(data, { key: 'date', type: 'date' })
      expect(result[0].name).toBe('Alice')
      expect(result[2].name).toBe('Bob')
    })

    it('handles empty array', () => {
      const result = sortArray([], { key: 'name' })
      expect(result).toEqual([])
    })

    it('handles array with null values', () => {
      const data = [
        { name: 'Alice', age: null },
        { name: 'Bob', age: 25 },
      ]
      const result = sortArray(data, { key: 'age', type: 'number' })
      expect(result).toBeDefined()
    })

    it('sorts with multiple criteria', () => {
      const data = [
        { name: 'Alice', age: 30, score: 80 },
        { name: 'Bob', age: 30, score: 90 },
        { name: 'Charlie', age: 25, score: 85 },
      ]
      const result = sortArray(data, [
        { key: 'age', type: 'number' },
        { key: 'score', type: 'number', order: 'desc' },
      ])
      expect(result[0].name).toBe('Charlie')
      expect(result[1].name).toBe('Bob')
    })
  })

  describe('filterArray', () => {
    it('filters by equals operator', () => {
      const data = [
        { name: 'Alice', age: 25 },
        { name: 'Bob', age: 30 },
        { name: 'Charlie', age: 25 },
      ]
      const result = filterArray(data, { key: 'age', value: 25, operator: 'equals' })
      expect(result).toHaveLength(2)
      expect(result.every(item => item.age === 25)).toBe(true)
    })

    it('filters by contains operator', () => {
      const data = [
        { name: 'Alice', email: 'alice@example.com' },
        { name: 'Bob', email: 'bob@test.com' },
        { name: 'Charlie', email: 'charlie@example.com' },
      ]
      const result = filterArray(data, { key: 'email', value: 'example', operator: 'contains' })
      expect(result).toHaveLength(2)
    })

    it('filters by startsWith operator', () => {
      const data = [
        { name: 'Alice', email: 'alice@example.com' },
        { name: 'Bob', email: 'bob@test.com' },
      ]
      const result = filterArray(data, { key: 'email', value: 'alice', operator: 'startsWith' })
      expect(result).toHaveLength(1)
    })

    it('filters by greaterThan operator', () => {
      const data = [
        { name: 'Alice', age: 25 },
        { name: 'Bob', age: 30 },
        { name: 'Charlie', age: 35 },
      ]
      const result = filterArray(data, { key: 'age', value: 30, operator: 'greaterThan' })
      expect(result).toHaveLength(1)
    })

    it('filters by between operator', () => {
      const data = [
        { name: 'Alice', age: 25 },
        { name: 'Bob', age: 30 },
        { name: 'Charlie', age: 35 },
      ]
      const result = filterArray(data, { key: 'age', value: [25, 30], operator: 'between' })
      expect(result).toHaveLength(2)
    })

    it('handles multiple filters', () => {
      const data = [
        { name: 'Alice', age: 25, active: true },
        { name: 'Bob', age: 30, active: true },
        { name: 'Charlie', age: 25, active: false },
      ]
      const result = filterArray(data, [
        { key: 'age', value: 25, operator: 'equals' },
        { key: 'active', value: true, operator: 'equals' },
      ])
      expect(result).toHaveLength(1)
    })

    it('handles empty array', () => {
      const result = filterArray([], { key: 'name', value: 'test' })
      expect(result).toEqual([])
    })
  })

  describe('groupBy', () => {
    it('groups array by key', () => {
      const data = [
        { category: 'A', value: 1 },
        { category: 'B', value: 2 },
        { category: 'A', value: 3 },
      ]
      const result = groupBy(data, 'category')
      expect(Object.keys(result)).toHaveLength(2)
      expect(result['A']).toHaveLength(2)
      expect(result['B']).toHaveLength(1)
    })

    it('groups with transform function', () => {
      const data = [
        { category: 'A', value: 1 },
        { category: 'A', value: 3 },
      ]
      const result = groupBy(data, {
        key: 'category',
        transform: (group) => group.map(item => item.value),
      })
      expect(result['A']).toEqual([1, 3])
    })

    it('handles empty array', () => {
      const result = groupBy([], 'category')
      expect(result).toEqual({})
    })

    it('handles undefined values', () => {
      const data = [
        { category: 'A', value: 1 },
        { category: undefined, value: 2 },
      ]
      const result = groupBy(data, 'category')
      expect(result['undefined']).toBeDefined()
    })
  })

  describe('paginate', () => {
    it('paginates array correctly', () => {
      const data = Array.from({ length: 25 }, (_, i) => ({ id: i }))
      const result = paginate(data, 1, 10)
      expect(result.data).toHaveLength(10)
      expect(result.total).toBe(25)
      expect(result.totalPages).toBe(3)
    })

    it('handles last page', () => {
      const data = Array.from({ length: 25 }, (_, i) => ({ id: i }))
      const result = paginate(data, 3, 10)
      expect(result.data).toHaveLength(5)
    })

    it('handles empty array', () => {
      const result = paginate([], 1, 10)
      expect(result.data).toEqual([])
      expect(result.total).toBe(0)
    })

    it('handles page beyond range', () => {
      const data = Array.from({ length: 10 }, (_, i) => ({ id: i }))
      const result = paginate(data, 5, 10)
      expect(result.data).toEqual([])
    })
  })

  describe('removeDuplicates', () => {
    it('removes duplicate primitives', () => {
      const data = [1, 2, 2, 3, 3, 3]
      const result = removeDuplicates(data)
      expect(result).toEqual([1, 2, 3])
    })

    it('removes duplicates by key function', () => {
      const data = [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
        { id: 1, name: 'Alice' },
      ]
      const result = removeDuplicates(data, (item) => item.id)
      expect(result).toHaveLength(2)
    })

    it('handles empty array', () => {
      const result = removeDuplicates([])
      expect(result).toEqual([])
    })
  })

  describe('flatten', () => {
    it('flattens nested arrays', () => {
      const data = [[1, 2], [3, 4], [5]]
      const result = flatten(data)
      expect(result).toEqual([1, 2, 3, 4, 5])
    })

    it('flattens deeply nested arrays', () => {
      const data = [[[1, 2]], [[3, 4]]]
      const result = flatten(data)
      expect(result).toEqual([1, 2, 3, 4])
    })

    it('handles empty array', () => {
      const result = flatten([])
      expect(result).toEqual([])
    })
  })

  describe('chunk', () => {
    it('chunks array into smaller arrays', () => {
      const data = [1, 2, 3, 4, 5, 6, 7]
      const result = chunk(data, 3)
      expect(result).toHaveLength(3)
      expect(result[0]).toEqual([1, 2, 3])
      expect(result[2]).toEqual([7])
    })

    it('handles empty array', () => {
      const result = chunk([], 3)
      expect(result).toEqual([])
    })

    it('handles invalid size', () => {
      const result = chunk([1, 2, 3], 0)
      expect(result).toEqual([])
    })
  })

  describe('calculateStats', () => {
    it('calculates statistics correctly', () => {
      const numbers = [10, 20, 30, 40, 50]
      const result = calculateStats(numbers)
      expect(result.sum).toBe(150)
      expect(result.average).toBe(30)
      expect(result.min).toBe(10)
      expect(result.max).toBe(50)
      expect(result.median).toBe(30)
    })

    it('calculates mode', () => {
      const numbers = [1, 2, 2, 3, 3, 3, 4]
      const result = calculateStats(numbers)
      expect(result.mode).toBe(3)
    })

    it('calculates standard deviation', () => {
      const numbers = [2, 4, 4, 4, 5, 5, 7, 9]
      const result = calculateStats(numbers)
      expect(result.standardDeviation).toBeGreaterThan(0)
    })

    it('handles empty array', () => {
      const result = calculateStats([])
      expect(result.sum).toBe(0)
      expect(result.average).toBe(0)
    })

    it('handles single value', () => {
      const result = calculateStats([42])
      expect(result.sum).toBe(42)
      expect(result.median).toBe(42)
    })
  })

  describe('transformKeys', () => {
    it('transforms object keys', () => {
      const obj = { firstName: 'John', lastName: 'Doe' }
      const result = transformKeys(obj, (key) => key.toUpperCase())
      expect(result.FIRSTNAME).toBe('John')
      expect(result.LASTNAME).toBe('Doe')
    })

    it('handles empty object', () => {
      const result = transformKeys({}, (key) => key)
      expect(result).toEqual({})
    })
  })

  describe('deepClone', () => {
    it('deep clones object', () => {
      const original = { a: 1, b: { c: 2 } }
      const cloned = deepClone(original)
      cloned.b.c = 3
      expect(original.b.c).toBe(2)
    })

    it('deep clones arrays', () => {
      const original = [[1, 2], [3, 4]]
      const cloned = deepClone(original)
      cloned[0][0] = 99
      expect(original[0][0]).toBe(1)
    })

    it('clones dates', () => {
      const date = new Date('2024-01-01')
      const cloned = deepClone(date)
      expect(cloned.getTime()).toBe(date.getTime())
      expect(cloned).not.toBe(date)
    })

    it('handles null and primitives', () => {
      expect(deepClone(null)).toBe(null)
      expect(deepClone(42)).toBe(42)
      expect(deepClone('string')).toBe('string')
    })
  })

  describe('deepMerge', () => {
    it('merges objects deeply', () => {
      const target = { a: 1, b: { c: 2 } }
      const source = { b: { d: 3 }, e: 4 }
      const result = deepMerge(target, source)
      expect(result.b.c).toBe(2)
      expect(result.b.d).toBe(3)
      expect(result.e).toBe(4)
    })

    it('merges multiple sources', () => {
      const target = { a: 1 }
      const result = deepMerge(target, { b: 2 }, { c: 3 })
      expect(result).toEqual({ a: 1, b: 2, c: 3 })
    })
  })

  describe('arrayToObject', () => {
    it('converts array to object', () => {
      const array = [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
      ]
      const result = arrayToObject(array, (item) => String(item.id))
      expect(result['1'].name).toBe('Alice')
      expect(result['2'].name).toBe('Bob')
    })

    it('handles empty array', () => {
      const result = arrayToObject([], (item) => String(item.id))
      expect(result).toEqual({})
    })
  })

  describe('objectToArray', () => {
    it('converts object to array', () => {
      const obj = { a: 1, b: 2, c: 3 }
      const result = objectToArray(obj)
      expect(result).toHaveLength(3)
      expect(result).toContain(1)
    })

    it('handles empty object', () => {
      const result = objectToArray({})
      expect(result).toEqual([])
    })
  })

  describe('debounce', () => {
    it('debounces function calls', async () => {
      const fn = vi.fn()
      const debounced = debounce(fn, 100)
      
      debounced()
      debounced()
      debounced()
      
      await new Promise(resolve => setTimeout(resolve, 150))
      expect(fn).toHaveBeenCalledTimes(1)
    })
  })

  describe('throttle', () => {
    it('throttles function calls', async () => {
      const fn = vi.fn()
      const throttled = throttle(fn, 100)
      
      throttled()
      throttled()
      throttled()
      
      await new Promise(resolve => setTimeout(resolve, 50))
      expect(fn).toHaveBeenCalledTimes(1)
    })
  })

  describe('formatNumber', () => {
    it('formats number with commas', () => {
      expect(formatNumber(1000)).toBe('1,000')
      expect(formatNumber(1000000)).toBe('1,000,000')
    })

    it('formats with decimals', () => {
      expect(formatNumber(1234.56, 2)).toBe('1,234.56')
    })

    it('handles NaN', () => {
      expect(formatNumber(NaN)).toBe('0')
    })
  })

  describe('formatBytes', () => {
    it('formats bytes correctly', () => {
      expect(formatBytes(1024)).toBe('1 KB')
      expect(formatBytes(1048576)).toBe('1 MB')
    })

    it('handles zero', () => {
      expect(formatBytes(0)).toBe('0 Bytes')
    })

    it('formats with custom decimals', () => {
      expect(formatBytes(1536, 1)).toBe('1.5 KB')
    })
  })

  describe('generateId', () => {
    it('generates unique IDs', () => {
      const id1 = generateId()
      const id2 = generateId()
      expect(id1).not.toBe(id2)
    })

    it('generates IDs with prefix', () => {
      const id = generateId('test')
      expect(id).toContain('test-')
    })
  })
})

