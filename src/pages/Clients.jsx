import { useEffect, useMemo, useState } from 'react'
import { z } from 'zod'
import { DataTable } from '../components/DataTable.jsx'
import { Badge, Button, EmptyState, Input, Modal, Select, Skeleton } from '../components/ui.jsx'
import { useMockQuery } from '../hooks/useMockQuery'
import { useToast } from '../hooks/useToast.jsx'
import { createClient, deleteClient, getClients, updateClient } from '../services/api/clients'
import { formatCurrency, paginate } from '../utils/format'

const schema = z.object({ name: z.string().min(2), email: z.string().email(), phone: z.string().min(7), contact: z.string().min(2), type: z.string().min(1), region: z.string().min(2), status: z.string().min(1), premium: z.coerce.number().min(0) })
const blank = { name: '', email: '', phone: '', contact: '', type: 'Corporate', region: 'Nairobi', status: 'Active', premium: 0 }

export function Clients({ navigate }) {
  const { data, loading, refetch } = useMockQuery(getClients, [])
  const { notify } = useToast()
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('All')
  const [page, setPage] = useState(1)
  const [editing, setEditing] = useState(null)
  const filtered = useMemo(() => (data || []).filter((client) => [client.name, client.email, client.region, client.contact].join(' ').toLowerCase().includes(query.toLowerCase()) && (status === 'All' || client.status === status)), [data, query, status])
  const rows = paginate(filtered, page, 5)
  async function remove(client) { await deleteClient(client.id); notify(`${client.name} deleted`); refetch() }
  const columns = [
    { header: 'Client', cell: (row) => <button className="link-button" onClick={() => navigate(`/clients/${row.id}`)}><strong>{row.name}</strong><small>{row.email}</small></button> },
    { header: 'Contact', cell: (row) => <span>{row.contact}<small>{row.phone}</small></span> },
    { header: 'Region', key: 'region' },
    { header: 'Status', cell: (row) => <Badge tone={row.status === 'Active' ? 'success' : row.status === 'Review' ? 'warning' : 'neutral'}>{row.status}</Badge> },
    { header: 'Premium', cell: (row) => formatCurrency(row.premium) },
    { header: 'Actions', cell: (row) => <div className="row-actions"><Button size="sm" variant="secondary" onClick={() => setEditing(row)}>Edit</Button><Button size="sm" variant="danger" onClick={() => remove(row)}>Delete</Button></div> },
  ]
  if (loading) return <Skeleton rows={6} />
  return <div className="page-stack"><section className="page-toolbar"><Input label="Search clients" value={query} onChange={(event) => { setQuery(event.target.value); setPage(1) }} /><Select label="Status" value={status} onChange={(event) => { setStatus(event.target.value); setPage(1) }}><option>All</option><option>Active</option><option>Review</option><option>Inactive</option></Select><Button onClick={() => setEditing(blank)}>Add client</Button></section><DataTable columns={columns} rows={rows} page={page} pageSize={5} total={filtered.length} onPageChange={setPage} empty={<EmptyState title="No clients found" description="Try changing the search or status filter." />} /><ClientModal open={Boolean(editing)} client={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); notify('Client saved'); refetch() }} /></div>
}

function ClientModal({ open, client, onClose, onSaved }) {
  const [values, setValues] = useState(client || blank)
  const [errors, setErrors] = useState({})
  useEffect(() => { setValues(client || blank); setErrors({}) }, [client])
  async function submit(event) {
    event.preventDefault()
    const parsed = schema.safeParse(values)
    if (!parsed.success) return setErrors(Object.fromEntries(parsed.error.issues.map((issue) => [issue.path[0], issue.message])))
    if (client?.id) await updateClient(client.id, parsed.data)
    else await createClient(parsed.data)
    onSaved()
  }
  return <Modal title={client?.id ? 'Edit client' : 'Add client'} open={open} onClose={onClose}><form className="form-grid" onSubmit={submit}><Input label="Client name" value={values.name} error={errors.name} onChange={(e) => setValues({ ...values, name: e.target.value })} /><Input label="Email" value={values.email} error={errors.email} onChange={(e) => setValues({ ...values, email: e.target.value })} /><Input label="Phone" value={values.phone} error={errors.phone} onChange={(e) => setValues({ ...values, phone: e.target.value })} /><Input label="Primary contact" value={values.contact} error={errors.contact} onChange={(e) => setValues({ ...values, contact: e.target.value })} /><Select label="Type" value={values.type} onChange={(e) => setValues({ ...values, type: e.target.value })}><option>Corporate</option><option>SME</option><option>Institution</option><option>Healthcare</option></Select><Input label="Region" value={values.region} error={errors.region} onChange={(e) => setValues({ ...values, region: e.target.value })} /><Select label="Status" value={values.status} onChange={(e) => setValues({ ...values, status: e.target.value })}><option>Active</option><option>Review</option><option>Inactive</option></Select><Input label="Premium" type="number" value={values.premium} error={errors.premium} onChange={(e) => setValues({ ...values, premium: e.target.value })} /><div className="form-actions"><Button variant="secondary" type="button" onClick={onClose}>Cancel</Button><Button>Save client</Button></div></form></Modal>
}
