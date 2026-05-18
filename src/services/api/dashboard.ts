import { apiClient } from './client'
import type { DashboardData, DashboardMetrics, RevenueSeries, ActivityItem } from '../../types'

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  return apiClient.get('/dashboard/metrics')
}

export async function getRevenueSeries(months = 6): Promise<RevenueSeries[]> {
  return apiClient.get(`/dashboard/revenue-series?months=${months}`)
}

export async function getPortfolioStatus(): Promise<unknown> {
  return apiClient.get('/dashboard/portfolio-status')
}

export async function getActivityFeed(limit = 10): Promise<ActivityItem[]> {
  return apiClient.get(`/dashboard/activity?limit=${limit}`)
}

export async function getRenewalPipeline(days = 30): Promise<unknown> {
  return apiClient.get(`/dashboard/renewal-pipeline?days=${days}`)
}

export async function getDashboard(): Promise<DashboardData> {
  const [metrics, revenueSeries, portfolioStatus, activity, renewalPipeline] = await Promise.all([
    getDashboardMetrics(),
    getRevenueSeries(),
    getPortfolioStatus(),
    getActivityFeed(),
    getRenewalPipeline(),
  ])
  return { metrics, revenueSeries, portfolioStatus, activity, renewalPipeline }
}
