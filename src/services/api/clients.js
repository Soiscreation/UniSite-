import { clients, nextId } from './mockData'

const wait = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms))

export async function getClients() {
  await wait()
  return [...clients]
}

export async function getClient(id) {
  await wait()
  return clients.find((client) => client.id === id)
}

export async function createClient(input) {
  await wait()
  const client = { ...input, id: nextId('cl'), premium: Number(input.premium || 0), joinedAt: new Date().toISOString() }
  clients.unshift(client)
  return client
}

export async function updateClient(id, input) {
  await wait()
  const index = clients.findIndex((client) => client.id === id)
  clients[index] = { ...clients[index], ...input, premium: Number(input.premium || 0) }
  return clients[index]
}

export async function deleteClient(id) {
  await wait()
  const index = clients.findIndex((client) => client.id === id)
  if (index >= 0) clients.splice(index, 1)
  return { ok: true }
}
