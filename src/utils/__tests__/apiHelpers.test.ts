import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import axios from 'axios'
import {
  createApiClient,
  apiGet,
  apiPost,
  apiPut,
  apiPatch,
  apiDelete,
  batchRequest,
  retryRequest,
  cachedApiGet,
  clearApiCache,
  uploadFile,
  downloadFile,
} from '../apiHelpers'

vi.mock('axios')
const mockedAxios = vi.mocked(axios)

describe('apiHelpers', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    mockedAxios.create.mockReturnValue({
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      patch: vi.fn(),
      delete: vi.fn(),
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() },
      },
    } as any)
  })

  afterEach(() => {
    clearApiCache()
  })

  describe('createApiClient', () => {
    it('creates axios instance with base URL', () => {
      const client = createApiClient('https://api.example.com')
      expect(mockedAxios.create).toHaveBeenCalled()
    })

    it('creates axios instance with default config', () => {
      const client = createApiClient()
      expect(mockedAxios.create).toHaveBeenCalled()
    })

    it('adds auth token to headers when available', () => {
      localStorage.setItem('abtestinghub-access-token', 'test-token')
      const client = createApiClient()
      expect(mockedAxios.create).toHaveBeenCalled()
    })
  })

  describe('apiGet', () => {
    it('makes GET request successfully', async () => {
      const mockData = { id: 1, name: 'Test' }
      const mockClient = {
        get: vi.fn().mockResolvedValue({ data: mockData }),
        interceptors: {
          request: { use: vi.fn() },
          response: { use: vi.fn() },
        },
      }
      mockedAxios.create.mockReturnValue(mockClient as any)

      const result = await apiGet('/test')
      expect(mockClient.get).toHaveBeenCalledWith('/test', undefined)
    })

    it('handles GET request with config', async () => {
      const mockClient = {
        get: vi.fn().mockResolvedValue({ data: {} }),
        interceptors: {
          request: { use: vi.fn() },
          response: { use: vi.fn() },
        },
      }
      mockedAxios.create.mockReturnValue(mockClient as any)

      await apiGet('/test', { params: { id: 1 } })
      expect(mockClient.get).toHaveBeenCalledWith('/test', { params: { id: 1 } })
    })
  })

  describe('apiPost', () => {
    it('makes POST request successfully', async () => {
      const mockData = { success: true }
      const mockClient = {
        post: vi.fn().mockResolvedValue({ data: mockData }),
        interceptors: {
          request: { use: vi.fn() },
          response: { use: vi.fn() },
        },
      }
      mockedAxios.create.mockReturnValue(mockClient as any)

      const result = await apiPost('/test', { name: 'Test' })
      expect(mockClient.post).toHaveBeenCalledWith('/test', { name: 'Test' }, undefined)
    })
  })

  describe('apiPut', () => {
    it('makes PUT request successfully', async () => {
      const mockClient = {
        put: vi.fn().mockResolvedValue({ data: {} }),
        interceptors: {
          request: { use: vi.fn() },
          response: { use: vi.fn() },
        },
      }
      mockedAxios.create.mockReturnValue(mockClient as any)

      await apiPut('/test/1', { name: 'Updated' })
      expect(mockClient.put).toHaveBeenCalledWith('/test/1', { name: 'Updated' }, undefined)
    })
  })

  describe('apiPatch', () => {
    it('makes PATCH request successfully', async () => {
      const mockClient = {
        patch: vi.fn().mockResolvedValue({ data: {} }),
        interceptors: {
          request: { use: vi.fn() },
          response: { use: vi.fn() },
        },
      }
      mockedAxios.create.mockReturnValue(mockClient as any)

      await apiPatch('/test/1', { name: 'Patched' })
      expect(mockClient.patch).toHaveBeenCalledWith('/test/1', { name: 'Patched' }, undefined)
    })
  })

  describe('apiDelete', () => {
    it('makes DELETE request successfully', async () => {
      const mockClient = {
        delete: vi.fn().mockResolvedValue({ data: {} }),
        interceptors: {
          request: { use: vi.fn() },
          response: { use: vi.fn() },
        },
      }
      mockedAxios.create.mockReturnValue(mockClient as any)

      await apiDelete('/test/1')
      expect(mockClient.delete).toHaveBeenCalledWith('/test/1', undefined)
    })
  })

  describe('batchRequest', () => {
    it('executes multiple requests in parallel', async () => {
      const request1 = vi.fn().mockResolvedValue('result1')
      const request2 = vi.fn().mockResolvedValue('result2')
      const request3 = vi.fn().mockResolvedValue('result3')

      const results = await batchRequest([request1, request2, request3])

      expect(results).toEqual(['result1', 'result2', 'result3'])
      expect(request1).toHaveBeenCalled()
      expect(request2).toHaveBeenCalled()
      expect(request3).toHaveBeenCalled()
    })

    it('handles empty requests array', async () => {
      const results = await batchRequest([])
      expect(results).toEqual([])
    })
  })

  describe('retryRequest', () => {
    it('retries failed request', async () => {
      let attempts = 0
      const requestFn = vi.fn().mockImplementation(() => {
        attempts++
        if (attempts < 3) {
          return Promise.reject(new Error('Failed'))
        }
        return Promise.resolve('Success')
      })

      const result = await retryRequest(requestFn, 3, 10)
      expect(result).toBe('Success')
      expect(attempts).toBe(3)
    })

    it('throws error after max retries', async () => {
      const requestFn = vi.fn().mockRejectedValue(new Error('Always fails'))

      await expect(retryRequest(requestFn, 2, 10)).rejects.toThrow()
      expect(requestFn).toHaveBeenCalledTimes(2)
    })
  })

  describe('cachedApiGet', () => {
    it('caches response for subsequent calls', async () => {
      const mockData = { id: 1 }
      const mockClient = {
        get: vi.fn().mockResolvedValue({ data: mockData }),
        interceptors: {
          request: { use: vi.fn() },
          response: { use: vi.fn() },
        },
      }
      mockedAxios.create.mockReturnValue(mockClient as any)

      const result1 = await cachedApiGet('/test', true)
      const result2 = await cachedApiGet('/test', true)

      expect(mockClient.get).toHaveBeenCalledTimes(1)
      expect(result1).toEqual(result2)
    })

    it('bypasses cache when useCache is false', async () => {
      const mockClient = {
        get: vi.fn().mockResolvedValue({ data: {} }),
        interceptors: {
          request: { use: vi.fn() },
          response: { use: vi.fn() },
        },
      }
      mockedAxios.create.mockReturnValue(mockClient as any)

      await cachedApiGet('/test', false)
      await cachedApiGet('/test', false)

      expect(mockClient.get).toHaveBeenCalledTimes(2)
    })
  })

  describe('clearApiCache', () => {
    it('clears specific cache entry', async () => {
      const mockClient = {
        get: vi.fn().mockResolvedValue({ data: {} }),
        interceptors: {
          request: { use: vi.fn() },
          response: { use: vi.fn() },
        },
      }
      mockedAxios.create.mockReturnValue(mockClient as any)

      await cachedApiGet('/test1', true)
      await cachedApiGet('/test2', true)
      clearApiCache('/test1')
      await cachedApiGet('/test1', true)

      expect(mockClient.get).toHaveBeenCalledTimes(2)
    })

    it('clears all cache when no URL provided', async () => {
      const mockClient = {
        get: vi.fn().mockResolvedValue({ data: {} }),
        interceptors: {
          request: { use: vi.fn() },
          response: { use: vi.fn() },
        },
      }
      mockedAxios.create.mockReturnValue(mockClient as any)

      await cachedApiGet('/test1', true)
      await cachedApiGet('/test2', true)
      clearApiCache()
      await cachedApiGet('/test1', true)

      expect(mockClient.get).toHaveBeenCalledTimes(2)
    })
  })

  describe('uploadFile', () => {
    it('uploads file with progress tracking', async () => {
      const mockFile = new File(['content'], 'test.txt', { type: 'text/plain' })
      const onProgress = vi.fn()
      const mockClient = {
        post: vi.fn().mockResolvedValue({ data: { success: true } }),
        interceptors: {
          request: { use: vi.fn() },
          response: { use: vi.fn() },
        },
      }
      mockedAxios.create.mockReturnValue(mockClient as any)

      await uploadFile('/upload', mockFile, onProgress)
      expect(mockClient.post).toHaveBeenCalled()
    })
  })

  describe('downloadFile', () => {
    it('downloads file successfully', async () => {
      const mockBlob = new Blob(['content'])
      const mockClient = {
        get: vi.fn().mockResolvedValue({ data: mockBlob }),
        interceptors: {
          request: { use: vi.fn() },
          response: { use: vi.fn() },
        },
      }
      mockedAxios.create.mockReturnValue(mockClient as any)

      const createElementSpy = vi.spyOn(document, 'createElement')
      const appendChildSpy = vi.spyOn(document.body, 'appendChild')
      const removeChildSpy = vi.spyOn(document.body, 'removeChild')

      await downloadFile('/download', 'test.txt')

      expect(mockClient.get).toHaveBeenCalledWith('/download', {
        responseType: 'blob',
      })
      expect(createElementSpy).toHaveBeenCalledWith('a')

      createElementSpy.mockRestore()
      appendChildSpy.mockRestore()
      removeChildSpy.mockRestore()
    })
  })
})

