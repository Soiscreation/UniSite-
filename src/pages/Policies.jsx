import { useEffect, useMemo, useState } from 'react'
import { z } from 'zod'
import { DataTable } from '../components/DataTable.jsx'
import { Badge, Button, EmptyState, Input, Modal, Select, Skeleton } from '../components/ui.jsx'
import { useMockQuery } from '../hooks/useMockQuery'
import { useToast } from '../hooks/useToast.jsx'
import { getClients } from '../services/api/clients'
import { createPolicy, getPolicies, updatePolicy } from '../services/api/policies'
import { formatCurrency, formatDate, paginate } from '../utils/format'

const schema = z.object({ number: z.string().min(4), clientId: z.string().min(1), product: z.string().min(2), insurer: z.string().min(2), status: z.string().min(1), premium: z.coerce.number().min(0), startDate: z.string().min(8), endDate: z.string().min(8) })
const blank = { number: '', clientId: '', product: 'Group Medical', insurer: 'Jubilee Health', status: 'Pending', premium: 0, startDate: '2026-05-01', endDate: '2027-04-30' }

export function Policies() {
  const { data, loading, refetch } = useMockQuery(getPolicies, [])
  const { data: clients } = useMockQuery(getClients, [])
  const { notify } = useToast()
  const [status, setStatus] = useState('All')
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [editing, setEditing] = useState(null)
  const filtered = useMemo(() => (data || []).filter((policy) => [policy.number, policy.clientName, policy.product, policy.insurer].join(' ').toLowerCase().includes(query.toLowerCase()) && (status === 'All' || policy.status === status)), [data, query, status])
  const rows = paginate(filtered, page, 5)
  const columns = [
    { header: 'Policy', cell: (row) => <span><strong>{row.number}</strong><small>{row.product}</small></span> },
    { header: 'Client', key: 'clientName' },
    { header: 'Insurer', key: 'insurer' },
    { header: 'Status', cell: (row) => <Badge tone={row.status === 'Active' ? 'success' : row.status === 'Pending' ? 'warning' : 'danger'}>{row.status}</Badge> },
    { header: 'Term', cell: (row) => `${formatDate(row.startDate)} - ${formatDate(row.endDate)}` },
    { header: 'Premium', cell: (row) => formatCurrency(row.premium) },
    { header: 'Actions', cell: (row) => <Button size="sm" variant="secondary" onClick={() => setEditing(row)}>Edit</Button> },
  ]
  if (loading) return <Skeleton rows={6} />
  return <div className="page-stack"><section className="page-toolbar"><Input label="Search policies" value={query} onChange={(event) => { setQuery(event.target.value); setPage(1) }} /><Select label="Status" value={status} onChange={(event) => { setStatus(event.target.value); setPage(1) }}><option>All</option><option>Active</option><option>Pending</option><option>Expired</option></Select><Button onClick={() => setEditing({ ...blank, clientId: clients?.[0]?.id || '' })}>Create policy</Button></section><DataTable columns={columns} rows={rows} page={page} pageSize={5} total={filtered.length} onPageChange={setPage} empty={<EmptyState title="No policies found" description="Try changing the search or status filter." />} /><PolicyModal open={Boolean(editing)} policy={editing} clients={clients || []} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); notify('Policy saved'); refetch() }} /></div>
}

function PolicyModal({ open, policy, clients, onClose, onSaved }) {
  const [values, setValues] = useState(policy || blank)
  const [errors, setErrors] = useState({})
  useEffect(() => { setValues(policy || blank); setErrors({}) }, [policy])
  async function submit(event) {
    event.preventDefault()
    const parsed = schema.safeParse(values)
    if (!parsed.success) return setErrors(Object.fromEntries(parsed.error.issues.map((issue) => [issue.path[0], issue.message])))
    if (policy?.id) await updatePolicy(policy.id, parsed.data)
    else await createPolicy(parsed.data)
    onSaved()
  }
  return <Modal title={policy?.id ? 'Edit policy' : 'Create policy'} open={open} onClose={onClose}><form className="form-grid" onSubmit={submit}><Input label="Policy number" value={values.number} error={errors.number} onChange={(e) => setValues({ ...values, number: e.target.value })} /><Select label="Client" value={values.clientId} error={errors.clientId} onChange={(e) => setValues({ ...values, clientId: e.target.value })}>{clients.map((client) => <option key={client.id} value={client.id}>{client.name}</option>)}</Select><Input label="Product" value={values.product} error={errors.product} onChange={(e) => setValues({ ...values, product: e.target.value })} /><Input label="Insurer" value={values.insurer} error={errors.insurer} onChange={(e) => setValues({ ...values, insurer: e.target.value })} /><Select label="Status" value={values.status} onChange={(e) => setValues({ ...values, status: e.target.value })}><option>Active</option><option>Pending</option><option>Expired</option></Select><Input label="Premium" type="number" value={values.premium} error={errors.premium} onChange={(e) => setValues({ ...values, premium: e.target.value })} /><Input label="Start date" type="date" value={values.startDate} error={errors.startDate} onChange={(e) => setValues({ ...values, startDate: e.target.value })} /><Input label="End date" type="date" value={values.endDate} error={errors.endDate} onChange={(e) => setValues({ ...values, endDate: e.target.value })} /><div className="form-actions"><Button variant="secondary" type="button" onClick={onClose}>Cancel</Button><Button>Save policy</Button></div></form></Modal>
}
