import axios, { type AxiosInstance, type InternalAxiosRequestConfig, type AxiosResponse } from 'axios'

/** Create the shared Axios instance */
const request: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
})

// ---------- Request interceptor ----------
request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Trace ID for debugging
    const traceId = crypto.randomUUID()
    config.headers['X-Request-Id'] = traceId

    return config
  },
  (error) => Promise.reject(error),
)

// ---------- Response interceptor ----------
let isRefreshing = false
let pendingRequests: Array<(token: string) => void> = []

request.interceptors.response.use(
  (response: AxiosResponse) => {
    const { code, msg } = response.data
    if (code !== undefined && code !== 200) {
      return Promise.reject(new Error(msg || '请求失败'))
    }
    return response.data
  },
  async (error) => {
    const originalRequest = error.config

    // Handle 401 — attempt token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          pendingRequests.push((newToken: string) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`
            resolve(request(originalRequest))
          })
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const refreshToken = localStorage.getItem('refreshToken')
        if (!refreshToken) throw new Error('No refresh token')

        const { data } = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL || '/api'}/v1/auth/refresh`,
          { refreshToken },
        )

        const newToken = data.token
        localStorage.setItem('token', newToken)
        localStorage.setItem('refreshToken', data.refreshToken)

        // Retry pending requests
        pendingRequests.forEach((cb) => cb(newToken))
        pendingRequests = []

        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return request(originalRequest)
      } catch {
        // Refresh failed — force logout
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        window.location.href = '/login'
        return Promise.reject(error)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  },
)

export default request
