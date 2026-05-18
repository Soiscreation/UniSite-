import { useEffect, useMemo, useState } from 'react'
import { z } from 'zod'
import { DataTable } from '../components/DataTable'
import { Badge, Button, EmptyState, Input, Modal, Select, Skeleton } from '../components/ui'
import { useMockQuery } from '../hooks/useMockQuery'
import { useToast } from '../hooks/useToast'
import { createClient, deleteClient, getClients, updateClient } from '../services/api/clients'
import { formatCurrency, paginate } from '../utils/format'
import type { Client, ClientInput } from '../types'
import type { Column } from '../components/DataTable'

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  contact: z.string().min(2),
  type: z.string().min(1),
  region: z.string().min(2),
  status: z.enum(['Active', 'Review', 'Inactive']),
  premium: z.coerce.number().min(0),
})

const blank: ClientInput = {
  name: '', email: '', phone: '', contact: '',
  type: 'Corporate', region: 'Nairobi', status: 'Active', premium: 0,
}

interface ClientsProps {
  navigate: (path: string) => void
}

export function Clients({ navigate }: ClientsProps) {
  const { data, loading, refetch } = useMockQuery<Client[]>(getClients, [])
  const { notify } = useToast()
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('All')
  const [page, setPage] = useState(1)
  const [editing, setEditing] = useState<Client | ClientInput | null>(null)

  const filtered = useMemo(
    () =>
      (data ?? []).filter(
        (c) =>
          [c.name, c.email, c.region, c.contact].join(' ').toLowerCase().includes(query.toLowerCase()) &&
          (status === 'All' || c.status === status),
      ),
    [data, query, status],
  )

  const rows = paginate(filtered, page, 5)

  async function remove(client: Client) {
    await deleteClient(client.id)
    notify(`${client.name} deleted`)
    refetch()
  }

  const columns: Column<Client>[] = [
    {
      header: 'Client',
      cell: (row) => (
        <button className="link-button" onClick={() => navigate(`/clients/${row.id}`)}>
          <strong>{row.name}</strong><small>{row.email}</small>
        </button>
      ),
    },
    { header: 'Contact', cell: (row) => <span>{row.contact}<small>{row.phone}</small></span> },
    { header: 'Region', key: 'region' },
    {
      header: 'Status',
      cell: (row) => (
        <Badge tone={row.status === 'Active' ? 'success' : row.status === 'Review' ? 'warning' : 'neutral'}>
          {row.status}
        </Badge>
      ),
    },
    { header: 'Premium', cell: (row) => formatCurrency(row.premium) },
    {
      header: 'Actions',
      cell: (row) => (
        <div className="row-actions">
          <Button size="sm" variant="secondary" onClick={() => setEditing(row)}>Edit</Button>
          <Button size="sm" variant="danger" onClick={() => remove(row)}>Delete</Button>
        </div>
      ),
    },
  ]

  if (loading) return <Skeleton rows={6} />

  return (
    <div className="page-stack">
      <section className="page-toolbar">
        <Input label="Search clients" value={query} onChange={(e) => { setQuery(e.target.value); setPage(1) }} />
        <Select label="Status" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1) }}>
          <option>All</option><option>Active</option><option>Review</option><option>Inactive</option>
        </Select>
        <Button onClick={() => setEditing(blank)}>Add client</Button>
      </section>
      <DataTable
        columns={columns}
        rows={rows}
        page={page}
        pageSize={5}
        total={filtered.length}
        onPageChange={setPage}
        empty={<EmptyState title="No clients found" description="Try changing the search or status filter." />}
      />
      <ClientModal
        open={Boolean(editing)}
        client={editing}
        onClose={() => setEditing(null)}
        onSaved={() => { setEditing(null); notify('Client saved'); refetch() }}
      />
    </div>
  )
}

interface ClientModalProps {
  open: boolean
  client: Client | ClientInput | null
  onClose: () => void
  onSaved: () => void
}

function ClientModal({ open, client, onClose, onSaved }: ClientModalProps) {
  const [values, setValues] = useState<ClientInput>(client as ClientInput ?? blank)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => { setValues((client as ClientInput) ?? blank); setErrors({}) }, [client])

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    const parsed = schema.safeParse(values)
    if (!parsed.success) {
      setErrors(Object.fromEntries(parsed.error.issues.map((i) => [i.path[0], i.message])))
      return
    }
    const id = (client as Client)?.id
    if (id) await updateClient(id, parsed.data)
    else await createClient(parsed.data)
    onSaved()
  }

  const set = (field: keyof ClientInput) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setValues((v) => ({ ...v, [field]: e.target.value }))

  return (
    <Modal title={(client as Client)?.id ? 'Edit client' : 'Add client'} open={open} onClose={onClose}>
      <form className="form-grid" onSubmit={submit}>
        <Input label="Client name" value={values.name} error={errors.name} onChange={set('name')} />
        <Input label="Email" value={values.email} error={errors.email} onChange={set('email')} />
        <Input label="Phone" value={values.phone} error={errors.phone} onChange={set('phone')} />
        <Input label="Primary contact" value={values.contact} error={errors.contact} onChange={set('contact')} />
        <Select label="Type" value={values.type} onChange={set('type')}>
          <option>Corporate</option><option>SME</option><option>Institution</option><option>Healthcare</option>
        </Select>
        <Input label="Region" value={values.region} error={errors.region} onChange={set('region')} />
        <Select label="Status" value={values.status} onChange={set('status')}>
          <option>Active</option><option>Review</option><option>Inactive</option>
        </Select>
        <Input label="Premium" type="number" value={values.premium} error={errors.premium} onChange={set('premium')} />
        <div className="form-actions">
          <Button variant="secondary" type="button" onClick={onClose}>Cancel</Button>
          <Button>Save client</Button>
        </div>
      </form>
    </Modal>
  )
}
