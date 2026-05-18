// Auth
export interface User {
  id: string
  name: string
  email: string
  role: string
  region?: string
  status?: string
}

export interface Session {
  user: User
  token: string
  refreshToken?: string
}

export interface LoginResponse {
  token: string
  refreshToken: string
  user: User
}

// Client
export interface Client {
  id: string
  name: string
  email: string
  phone: string
  contact: string
  type: string
  region: string
  status: 'Active' | 'Review' | 'Inactive'
  premium: number
  joinedAt: string
}

export type ClientInput = Omit<Client, 'id' | 'joinedAt'>

// Policy
export interface Policy {
  id: string
  number: string
  clientId: string
  clientName: string
  product: string
  insurer: string
  status: 'Active' | 'Pending' | 'Expired'
  premium: number
  startDate: string
  endDate: string
}

export type PolicyInput = Omit<Policy, 'id' | 'clientName'>

// Dashboard
export interface DashboardMetrics {
  totalClients: number
  activePolicies: number
  pendingClaims: number
  revenue: number
}

export interface RevenueSeries {
  label: string
  revenue: number
}

export interface ActivityItem {
  id: string
  title: string
  detail: string
  time: string
}

export interface DashboardData {
  metrics: DashboardMetrics
  revenueSeries: RevenueSeries[]
  portfolioStatus: unknown
  activity: ActivityItem[]
  renewalPipeline: unknown
}

// API list params
export interface ListParams {
  page?: number
  limit?: number
}

export interface ClientParams extends ListParams {
  search?: string
  status?: string
  type?: string
  region?: string
}

export interface PolicyParams extends ListParams {
  search?: string
  status?: string
  product?: string
  clientId?: string
}

export interface UserParams extends ListParams {
  search?: string
  role?: string
  region?: string
  status?: string
}

export interface ClaimParams extends ListParams {
  status?: string
  type?: string
  clientId?: string
}

export interface DocumentParams extends ListParams {
  folder?: string
  owner?: string
  type?: string
}
