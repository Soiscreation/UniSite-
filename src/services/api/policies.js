import { clients, nextId, policies } from './mockData'

const wait = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms))

function hydrate(policy) {
  const client = clients.find((item) => item.id === policy.clientId)
  return { ...policy, clientName: client?.name || 'Unassigned' }
}

export async function getPolicies() {
  await wait()
  return policies.map(hydrate)
}

export async function createPolicy(input) {
  await wait()
  const policy = { ...input, id: nextId('pol'), premium: Number(input.premium || 0) }
  policies.unshift(policy)
  return hydrate(policy)
}

export async function updatePolicy(id, input) {
  await wait()
  const index = policies.findIndex((policy) => policy.id === id)
  policies[index] = { ...policies[index], ...input, premium: Number(input.premium || 0) }
  return hydrate(policies[index])
}
