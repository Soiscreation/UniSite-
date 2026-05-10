import { activity, claims, clients, policies, revenueSeries } from './mockData'

const wait = (ms = 450) => new Promise((resolve) => setTimeout(resolve, ms))

export async function getDashboard() {
  await wait()
  return {
    metrics: {
      totalClients: clients.length,
      activePolicies: policies.filter((policy) => policy.status === 'Active').length,
      pendingClaims: claims.filter((claim) => claim.status === 'Pending').length,
      revenue: policies.reduce((sum, policy) => sum + Number(policy.premium || 0), 0),
    },
    revenueSeries,
    claims,
    activity,
  }
}
