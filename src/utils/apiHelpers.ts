import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

/**
 * Creates a configured axios instance with base URL and default headers
 */
export const createApiClient = (baseURL?: string): AxiosInstance => {
  const client = axios.create({
    baseURL: baseURL || import.meta.env.VITE_BASE_URL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  // Request interceptor for adding auth token
  client.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('abtestinghub-access-token')
      if (token) {
        config.headers.Authorization = `Token ${token}`
      }
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  // Response interceptor for error handling
  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem('abtestinghub-access-token')
        window.location.href = '/home'
      }
      return Promise.reject(error)
    }
  )

  return client
}

/**
 * Generic GET request helper
 */
export const apiGet = async <T = any>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> => {
  const client = createApiClient()
  const response: AxiosResponse<T> = await client.get(url, config)
  return response.data
}

/**
 * Generic POST request helper
 */
export const apiPost = async <T = any>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> => {
  const client = createApiClient()
  const response: AxiosResponse<T> = await client.post(url, data, config)
  return response.data
}

/**
 * Generic PUT request helper
 */
export const apiPut = async <T = any>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> => {
  const client = createApiClient()
  const response: AxiosResponse<T> = await client.put(url, data, config)
  return response.data
}

/**
 * Generic PATCH request helper
 */
export const apiPatch = async <T = any>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> => {
  const client = createApiClient()
  const response: AxiosResponse<T> = await client.patch(url, data, config)
  return response.data
}

/**
 * Generic DELETE request helper
 */
export const apiDelete = async <T = any>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> => {
  const client = createApiClient()
  const response: AxiosResponse<T> = await client.delete(url, config)
  return response.data
}

/**
 * Batch request helper for multiple API calls
 */
export const batchRequest = async <T = any>(
  requests: Array<() => Promise<T>>
): Promise<T[]> => {
  return Promise.all(requests.map((request) => request()))
}

/**
 * Retry helper for failed requests
 */
export const retryRequest = async <T = any>(
  requestFn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: Error | null = null

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await requestFn()
    } catch (error) {
      lastError = error as Error
      if (i < maxRetries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay * (i + 1)))
      }
    }
  }

  throw lastError || new Error('Request failed after retries')
}

/**
 * Cache helper for API responses
 */
const responseCache = new Map<string, { data: any; timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export const cachedApiGet = async <T = any>(
  url: string,
  useCache: boolean = true,
  config?: AxiosRequestConfig
): Promise<T> => {
  if (useCache) {
    const cached = responseCache.get(url)
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data as T
    }
  }

  const data = await apiGet<T>(url, config)
  
  if (useCache) {
    responseCache.set(url, { data, timestamp: Date.now() })
  }

  return data
}

/**
 * Clear API cache
 */
export const clearApiCache = (url?: string): void => {
  if (url) {
    responseCache.delete(url)
  } else {
    responseCache.clear()
  }
}

/**
 * Upload file helper
 */
export const uploadFile = async (
  url: string,
  file: File,
  onProgress?: (progress: number) => void
): Promise<any> => {
  const formData = new FormData()
  formData.append('file', file)

  const client = createApiClient()
  const response = await client.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        )
        onProgress(percentCompleted)
      }
    },
  })

  return response.data
}

/**
 * Download file helper
 */
export const downloadFile = async (
  url: string,
  filename?: string
): Promise<void> => {
  const client = createApiClient()
  const response = await client.get(url, {
    responseType: 'blob',
  })

  const blob = new Blob([response.data])
  const downloadUrl = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = downloadUrl
  link.download = filename || 'download'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(downloadUrl)
}

