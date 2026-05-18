import { apiClient } from './client'
import type { ClaimParams } from '../../types'

export interface Claim {
  id: string
  status: string
  type: string
  clientId: string
  decisionNote?: string
  [key: string]: unknown
}

export async function getClaims(params: ClaimParams = {}): Promise<Claim[]> {
  const q = new URLSearchParams()
  if (params.page) q.append('page', String(params.page))
  if (params.limit) q.append('limit', String(params.limit))
  if (params.status) q.append('status', params.status)
  if (params.type) q.append('type', params.type)
  if (params.clientId) q.append('clientId', params.clientId)
  const qs = q.toString()
  return apiClient.get(`/claims${qs ? `?${qs}` : ''}`)
}

export async function getClaim(id: string): Promise<Claim> {
  return apiClient.get(`/claims/${id}`)
}

export async function createClaim(input: Omit<Claim, 'id'>): Promise<Claim> {
  return apiClient.post('/claims', input)
}

export async function updateClaim(id: string, input: Partial<Claim>): Promise<Claim> {
  return apiClient.put(`/claims/${id}`, input)
}

export async function claimDecision(
  id: string,
  status: string,
  decisionNote: string,
): Promise<Claim> {
  return apiClient.put(`/claims/${id}/decision`, { status, decisionNote })
}

export async function deleteClaim(id: string): Promise<void> {
  return apiClient.delete(`/claims/${id}`)
}

export async function attachClaimDocument(id: string, documentData: unknown): Promise<unknown> {
  return apiClient.post(`/claims/${id}/documents`, documentData)
}

export async function getClaimDocuments(id: string): Promise<unknown[]> {
  return apiClient.get(`/claims/${id}/documents`)
}
