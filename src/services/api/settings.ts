import { apiClient } from './client'

export interface Setting {
  key: string
  value: string
  enabled: boolean
  [key: string]: unknown
}

export async function getAllSettings(): Promise<Setting[]> {
  return apiClient.get('/settings')
}

export async function updateSetting(key: string, value: string, enabled: boolean): Promise<Setting> {
  return apiClient.put(`/settings/${key}`, { value, enabled })
}
