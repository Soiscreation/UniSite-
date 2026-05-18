const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/v1'

interface ErrorResponse {
  error?: { message?: string }
}

class ApiClient {
  private baseUrl: string

  constructor() {
    this.baseUrl = BASE_URL
  }

  private getAuthHeader(): Record<string, string> {
    const token = localStorage.getItem('adminToken')
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...this.getAuthHeader(),
      ...(options.headers as Record<string, string>),
    }

    const config: RequestInit = { ...options, headers }

    try {
      const response = await fetch(url, config)

      if (!response.ok) {
        const error = await response
          .json()
          .catch(() => ({ error: { message: 'An error occurred' } })) as ErrorResponse
        throw new Error(error.error?.message ?? `HTTP ${response.status}: ${response.statusText}`)
      }

      const contentType = response.headers.get('content-type')
      if (contentType?.includes('application/json')) {
        return await response.json() as T
      }

      return response as unknown as T
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  get<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' })
  }

  post<T>(endpoint: string, data: unknown, options: RequestInit = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'POST', body: JSON.stringify(data) })
  }

  put<T>(endpoint: string, data: unknown, options: RequestInit = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'PUT', body: JSON.stringify(data) })
  }

  delete<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' })
  }

  upload<T>(endpoint: string, formData: FormData, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    const headers: Record<string, string> = {
      ...this.getAuthHeader(),
      ...(options.headers as Record<string, string>),
    }

    return fetch(url, { ...options, method: 'POST', headers, body: formData }).then(
      async (response) => {
        if (!response.ok) {
          const error = await response
            .json()
            .catch(() => ({ error: { message: 'Upload failed' } })) as ErrorResponse
          throw new Error(error.error?.message ?? `HTTP ${response.status}: ${response.statusText}`)
        }
        return response.json() as Promise<T>
      },
    )
  }
}

export const apiClient = new ApiClient()
