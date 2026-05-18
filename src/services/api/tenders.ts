import { apiClient } from './client'
import type { ListParams } from '../../types'

export interface Tender {
  id: string
  [key: string]: unknown
}

export async function getTenders(params: ListParams = {}): Promise<Tender[]> {
  const q = new URLSearchParams()
  if (params.page) q.append('page', String(params.page))
  if (params.limit) q.append('limit', String(params.limit))
  const qs = q.toString()
  return apiClient.get(`/tenders${qs ? `?${qs}` : ''}`)
}

export async function getTender(id: string): Promise<Tender> {
  return apiClient.get(`/tenders/${id}`)
}

export async function createTender(input: Omit<Tender, 'id'>): Promise<Tender> {
  return apiClient.post('/tenders', input)
}

export async function updateTender(id: string, input: Partial<Tender>): Promise<Tender> {
  return apiClient.put(`/tenders/${id}`, input)
}

export async function deleteTender(id: string): Promise<void> {
  return apiClient.delete(`/tenders/${id}`)
}

export async function uploadTenderDocument(id: string, documentData: unknown): Promise<unknown> {
  return apiClient.post(`/tenders/${id}/documents`, documentData)
}

export async function getTenderDocuments(id: string): Promise<unknown[]> {
  return apiClient.get(`/tenders/${id}/documents`)
}

export async function deleteTenderDocument(id: string, docId: string): Promise<void> {
  return apiClient.delete(`/tenders/${id}/documents/${docId}`)
}
