import { apiClient } from './client'
import type { Policy, PolicyInput, PolicyParams } from '../../types'

export async function getPolicies(params: PolicyParams = {}): Promise<Policy[]> {
  const q = new URLSearchParams()
  if (params.page) q.append('page', String(params.page))
  if (params.limit) q.append('limit', String(params.limit))
  if (params.search) q.append('search', params.search)
  if (params.status) q.append('status', params.status)
  if (params.product) q.append('product', params.product)
  if (params.clientId) q.append('clientId', params.clientId)
  const qs = q.toString()
  return apiClient.get(`/policies${qs ? `?${qs}` : ''}`)
}

export async function getExpiringPolicies(days = 30): Promise<Policy[]> {
  return apiClient.get(`/policies/expiring?days=${days}`)
}

export async function getPolicy(id: string): Promise<Policy> {
  return apiClient.get(`/policies/${id}`)
}

export async function createPolicy(input: PolicyInput): Promise<Policy> {
  return apiClient.post('/policies', input)
}

export async function updatePolicy(id: string, input: Partial<PolicyInput>): Promise<Policy> {
  return apiClient.put(`/policies/${id}`, input)
}

export async function deletePolicy(id: string): Promise<void> {
  return apiClient.delete(`/policies/${id}`)
}
