import { apiClient } from './client'
import type { DocumentParams } from '../../types'

export interface Document {
  id: string
  [key: string]: unknown
}

export async function getDocuments(params: DocumentParams = {}): Promise<Document[]> {
  const q = new URLSearchParams()
  if (params.page) q.append('page', String(params.page))
  if (params.limit) q.append('limit', String(params.limit))
  if (params.folder) q.append('folder', params.folder)
  if (params.owner) q.append('owner', params.owner)
  if (params.type) q.append('type', params.type)
  const qs = q.toString()
  return apiClient.get(`/documents${qs ? `?${qs}` : ''}`)
}

export async function uploadDocument(formData: FormData): Promise<Document> {
  return apiClient.upload('/documents/upload', formData)
}

export async function getDocument(id: string): Promise<Document> {
  return apiClient.get(`/documents/${id}`)
}

export async function downloadDocument(id: string): Promise<unknown> {
  return apiClient.get(`/documents/${id}/download`)
}

export async function updateDocument(id: string, input: Partial<Document>): Promise<Document> {
  return apiClient.put(`/documents/${id}`, input)
}

export async function deleteDocument(id: string): Promise<void> {
  return apiClient.delete(`/documents/${id}`)
}
