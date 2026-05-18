import { apiClient } from './client'
import type { ListParams } from '../../types'

export interface Report {
  id: string
  [key: string]: unknown
}

export async function getReports(params: ListParams = {}): Promise<Report[]> {
  const q = new URLSearchParams()
  if (params.page) q.append('page', String(params.page))
  if (params.limit) q.append('limit', String(params.limit))
  const qs = q.toString()
  return apiClient.get(`/reports${qs ? `?${qs}` : ''}`)
}

export async function generateReport(input: unknown): Promise<Report> {
  return apiClient.post('/reports/generate', input)
}

export async function getReport(id: string): Promise<Report> {
  return apiClient.get(`/reports/${id}`)
}

export async function downloadReport(id: string): Promise<unknown> {
  return apiClient.get(`/reports/${id}/download`)
}

export async function deleteReport(id: string): Promise<void> {
  return apiClient.delete(`/reports/${id}`)
}
