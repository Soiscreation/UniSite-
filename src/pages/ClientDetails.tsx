import { useMemo } from 'react'
import { Badge, Button, Skeleton } from '../components/ui'
import { useMockQuery } from '../hooks/useMockQuery'
import { getClient } from '../services/api/clients'
import { getPolicies } from '../services/api/policies'
import { formatCurrency, formatDate } from '../utils/format'
import type { Client, Policy } from '../types'

interface ClientDetailsProps {
  path: string
  navigate: (path: string) => void
}

export function ClientDetails({ path, navigate }: ClientDetailsProps) {
  const id = path.split('/').pop() ?? ''
  const { data: client, loading } = useMockQuery<Client>(() => getClient(id), [id])
  const { data: policies } = useMockQuery<Policy[]>(getPolicies, [])
  const related = useMemo(
    () => (policies ?? []).filter((p) => p.clientId === id),
    [policies, id],
  )

  if (loading) return <Skeleton rows={5} />
  if (!client) return <p className="error-box">Client not found.</p>

  return (
    <div className="page-stack">
      <Button variant="ghost" onClick={() => navigate('/clients')}>Back to clients</Button>
      <section className="page-hero">
        <div>
          <Badge tone="success">{client.status}</Badge>
          <h2>{client.name}</h2>
          <p>{client.contact} | {client.email} | {client.phone}</p>
        </div>
        <strong>{formatCurrency(client.premium)}</strong>
      </section>
      <section className="grid-two">
        <article className="panel">
          <h2>Profile</h2>
          <dl>
            <dt>Type</dt><dd>{client.type}</dd>
            <dt>Region</dt><dd>{client.region}</dd>
            <dt>Joined</dt><dd>{formatDate(client.joinedAt)}</dd>
          </dl>
        </article>
        <article className="panel">
          <h2>Assigned policies</h2>
          {related.map((policy) => (
            <div className="detail-row" key={policy.id}>
              <span>{policy.number}</span>
              <Badge tone={policy.status === 'Active' ? 'success' : 'warning'}>{policy.status}</Badge>
            </div>
          ))}
        </article>
      </section>
    </div>
  )
}
