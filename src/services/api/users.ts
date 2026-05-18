import { apiClient } from './client'
import type { User, UserParams } from '../../types'

export async function getUsers(params: UserParams = {}): Promise<User[]> {
  const q = new URLSearchParams()
  if (params.page) q.append('page', String(params.page))
  if (params.limit) q.append('limit', String(params.limit))
  if (params.search) q.append('search', params.search)
  if (params.role) q.append('role', params.role)
  if (params.region) q.append('region', params.region)
  if (params.status) q.append('status', params.status)
  const qs = q.toString()
  return apiClient.get(`/users${qs ? `?${qs}` : ''}`)
}

export async function getUser(id: string): Promise<User> {
  return apiClient.get(`/users/${id}`)
}

export async function createUser(input: Omit<User, 'id'>): Promise<User> {
  return apiClient.post('/users', input)
}

export async function updateUser(id: string, input: Partial<User>): Promise<User> {
  return apiClient.put(`/users/${id}`, input)
}

export async function updateUserStatus(id: string, status: string): Promise<User> {
  return apiClient.put(`/users/${id}/status`, { status })
}

export async function deleteUser(id: string): Promise<void> {
  return apiClient.delete(`/users/${id}`)
}
