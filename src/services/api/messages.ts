import { apiClient } from './client'
import type { ListParams } from '../../types'

export interface MessageThread {
  id: string
  assignedTo?: string
  [key: string]: unknown
}

export async function getAllMessageThreads(params: ListParams = {}): Promise<MessageThread[]> {
  const q = new URLSearchParams()
  if (params.page) q.append('page', String(params.page))
  if (params.limit) q.append('limit', String(params.limit))
  const qs = q.toString()
  return apiClient.get(`/admin/messages${qs ? `?${qs}` : ''}`)
}

export async function assignThreadToAgent(id: string, assignedTo: string): Promise<MessageThread> {
  return apiClient.put(`/admin/messages/${id}/assign`, { assignedTo })
}

export async function replyToThread(id: string, body: string): Promise<MessageThread> {
  return apiClient.post(`/admin/messages/${id}/reply`, { body })
}
