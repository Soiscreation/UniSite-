import { apiClient } from './client'
import type { LoginResponse, User } from '../../types'

export async function login(email: string, password: string): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>('/auth/login', { email, password })
  if (response.token) localStorage.setItem('adminToken', response.token)
  if (response.refreshToken) localStorage.setItem('refreshToken', response.refreshToken)
  if (response.user) localStorage.setItem('adminUser', JSON.stringify(response.user))
  return response
}

export async function logout(refreshToken: string): Promise<void> {
  await apiClient.post<void>('/auth/logout', { refreshToken })
  localStorage.removeItem('adminToken')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('adminUser')
}

export async function refreshToken(token: string): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>('/auth/refresh', { refreshToken: token })
  if (response.token) localStorage.setItem('adminToken', response.token)
  if (response.refreshToken) localStorage.setItem('refreshToken', response.refreshToken)
  if (response.user) localStorage.setItem('adminUser', JSON.stringify(response.user))
  return response
}

export async function requestPasswordReset(email: string): Promise<void> {
  return apiClient.post('/auth/password/reset-request', { email })
}

export async function resetPassword(token: string, newPassword: string): Promise<void> {
  return apiClient.post('/auth/password/reset', { token, newPassword })
}

export async function getMe(): Promise<User> {
  return apiClient.get('/auth/me')
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
  return apiClient.post('/auth/change-password', { currentPassword, newPassword })
}
