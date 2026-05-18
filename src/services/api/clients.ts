import { apiClient } from './client'
import type { Client, ClientInput, ClientParams } from '../../types'

export async function getClients(params: ClientParams = {}): Promise<Client[]> {
  const q = new URLSearchParams()
  if (params.page) q.append('page', String(params.page))
  if (params.limit) q.append('limit', String(params.limit))
  if (params.search) q.append('search', params.search)
  if (params.status) q.append('status', params.status)
  if (params.type) q.append('type', params.type)
  if (params.region) q.append('region', params.region)
  const qs = q.toString()
  return apiClient.get(`/clients${qs ? `?${qs}` : ''}`)
}

export async function getClient(id: string): Promise<Client> {
  return apiClient.get(`/clients/${id}`)
}

export async function createClient(input: ClientInput): Promise<Client> {
  return apiClient.post('/clients', input)
}

export async function updateClient(id: string, input: Partial<ClientInput>): Promise<Client> {
  return apiClient.put(`/clients/${id}`, input)
}

export async function deleteClient(id: string): Promise<void> {
  return apiClient.delete(`/clients/${id}`)
}

export async function getClientPolicies(id: string): Promise<unknown> {
  return apiClient.get(`/clients/${id}/policies`)
}

export async function getClientSummary(id: string): Promise<unknown> {
  return apiClient.get(`/clients/${id}/summary`)
}
