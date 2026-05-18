import { useEffect, useMemo, useState } from 'react'
import { z } from 'zod'
import { DataTable } from '../components/DataTable'
import { Badge, Button, EmptyState, Input, Modal, Select, Skeleton } from '../components/ui'
import { useMockQuery } from '../hooks/useMockQuery'
import { useToast } from '../hooks/useToast'
import { getClients } from '../services/api/clients'
import { createPolicy, getPolicies, updatePolicy } from '../services/api/policies'
import { formatCurrency, formatDate, paginate } from '../utils/format'
import type { Client, Policy, PolicyInput } from '../types'
import type { Column } from '../components/DataTable'

const schema = z.object({
  number: z.string().min(4),
  clientId: z.string().min(1),
  product: z.string().min(2),
  insurer: z.string().min(2),
  status: z.enum(['Active', 'Pending', 'Expired']),
  premium: z.coerce.number().min(0),
  startDate: z.string().min(8),
  endDate: z.string().min(8),
})

const blank: PolicyInput = {
  number: '', clientId: '', product: 'Group Medical', insurer: 'Jubilee Health',
  status: 'Pending', premium: 0, startDate: '2026-05-01', endDate: '2027-04-30',
}

export function Policies() {
  const { data, loading, refetch } = useMockQuery<Policy[]>(getPolicies, [])
  const { data: clients } = useMockQuery<Client[]>(getClients, [])
  const { notify } = useToast()
  const [status, setStatus] = useState('All')
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [editing, setEditing] = useState<Policy | PolicyInput | null>(null)

  const filtered = useMemo(
    () =>
      (data ?? []).filter(
        (p) =>
          [p.number, p.clientName, p.product, p.insurer].join(' ').toLowerCase().includes(query.toLowerCase()) &&
          (status === 'All' || p.status === status),
      ),
    [data, query, status],
  )

  const rows = paginate(filtered, page, 5)

  const columns: Column<Policy>[] = [
    { header: 'Policy', cell: (row) => <span><strong>{row.number}</strong><small>{row.product}</small></span> },
    { header: 'Client', key: 'clientName' },
    { header: 'Insurer', key: 'insurer' },
    {
      header: 'Status',
      cell: (row) => (
        <Badge tone={row.status === 'Active' ? 'success' : row.status === 'Pending' ? 'warning' : 'danger'}>
          {row.status}
        </Badge>
      ),
    },
    { header: 'Term', cell: (row) => `${formatDate(row.startDate)} - ${formatDate(row.endDate)}` },
    { header: 'Premium', cell: (row) => formatCurrency(row.premium) },
    { header: 'Actions', cell: (row) => <Button size="sm" variant="secondary" onClick={() => setEditing(row)}>Edit</Button> },
  ]

  if (loading) return <Skeleton rows={6} />

  return (
    <div className="page-stack">
      <section className="page-toolbar">
        <Input label="Search policies" value={query} onChange={(e) => { setQuery(e.target.value); setPage(1) }} />
        <Select label="Status" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1) }}>
          <option>All</option><option>Active</option><option>Pending</option><option>Expired</option>
        </Select>
        <Button onClick={() => setEditing({ ...blank, clientId: clients?.[0]?.id ?? '' })}>Create policy</Button>
      </section>
      <DataTable
        columns={columns}
        rows={rows}
        page={page}
        pageSize={5}
        total={filtered.length}
        onPageChange={setPage}
        empty={<EmptyState title="No policies found" description="Try changing the search or status filter." />}
      />
      <PolicyModal
        open={Boolean(editing)}
        policy={editing}
        clients={clients ?? []}
        onClose={() => setEditing(null)}
        onSaved={() => { setEditing(null); notify('Policy saved'); refetch() }}
      />
    </div>
  )
}

interface PolicyModalProps {
  open: boolean
  policy: Policy | PolicyInput | null
  clients: Client[]
  onClose: () => void
  onSaved: () => void
}

function PolicyModal({ open, policy, clients, onClose, onSaved }: PolicyModalProps) {
  const [values, setValues] = useState<PolicyInput>((policy as PolicyInput) ?? blank)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => { setValues((policy as PolicyInput) ?? blank); setErrors({}) }, [policy])

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    const parsed = schema.safeParse(values)
    if (!parsed.success) {
      setErrors(Object.fromEntries(parsed.error.issues.map((i) => [i.path[0], i.message])))
      return
    }
    const id = (policy as Policy)?.id
    if (id) await updatePolicy(id, parsed.data)
    else await createPolicy(parsed.data)
    onSaved()
  }

  const set = (field: keyof PolicyInput) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setValues((v) => ({ ...v, [field]: e.target.value }))

  return (
    <Modal title={(policy as Policy)?.id ? 'Edit policy' : 'Create policy'} open={open} onClose={onClose}>
      <form className="form-grid" onSubmit={submit}>
        <Input label="Policy number" value={values.number} error={errors.number} onChange={set('number')} />
        <Select label="Client" value={values.clientId} error={errors.clientId} onChange={set('clientId')}>
          {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </Select>
        <Input label="Product" value={values.product} error={errors.product} onChange={set('product')} />
        <Input label="Insurer" value={values.insurer} error={errors.insurer} onChange={set('insurer')} />
        <Select label="Status" value={values.status} onChange={set('status')}>
          <option>Active</option><option>Pending</option><option>Expired</option>
        </Select>
        <Input label="Premium" type="number" value={values.premium} error={errors.premium} onChange={set('premium')} />
        <Input label="Start date" type="date" value={values.startDate} error={errors.startDate} onChange={set('startDate')} />
        <Input label="End date" type="date" value={values.endDate} error={errors.endDate} onChange={set('endDate')} />
        <div className="form-actions">
          <Button variant="secondary" type="button" onClick={onClose}>Cancel</Button>
          <Button>Save policy</Button>
        </div>
      </form>
    </Modal>
  )
}
