import { BarChart, DonutChart } from '../components/Charts.jsx'
import { Badge, Skeleton } from '../components/ui.jsx'
import { useMockQuery } from '../hooks/useMockQuery'
import { getDashboard } from '../services/api/dashboard'
import { formatCurrency } from '../utils/format'

export function Dashboard() {
  const { data, loading, error } = useMockQuery(getDashboard, [])
  if (loading) return <Skeleton rows={6} />
  if (error) return <p className="error-box">Dashboard failed to load.</p>
  const active = data.metrics.activePolicies
  const pending = data.claims.filter((claim) => claim.status === 'Pending').length

  return (
    <div className="page-stack">
      <section className="metric-grid">
        <Metric title="Total Clients" value={data.metrics.totalClients} trend="+8.2%" />
        <Metric title="Active Policies" value={data.metrics.activePolicies} trend="+4 this month" />
        <Metric title="Pending Claims" value={data.metrics.pendingClaims} trend="Needs review" />
        <Metric title="Revenue" value={formatCurrency(data.metrics.revenue)} trend="+12.5%" />
      </section>
      <section className="grid-two">
        <article className="panel"><div className="panel-head"><h2>Revenue trend</h2><Badge tone="info">6 months</Badge></div><BarChart data={data.revenueSeries} /></article>
        <article className="panel"><div className="panel-head"><h2>Portfolio status</h2><Badge tone="success">Live</Badge></div><DonutChart active={active} pending={pending} expired={1} /></article>
      </section>
      <section className="panel"><div className="panel-head"><h2>Recent activity</h2><Badge>Today</Badge></div><div className="activity-list">{data.activity.map((item) => <div key={item.id}><span /><div><strong>{item.title}</strong><p>{item.detail}</p></div><small>{item.time}</small></div>)}</div></section>
    </div>
  )
}

function Metric({ title, value, trend }) {
  return <article className="metric-card"><p>{title}</p><h2>{value}</h2><span>{trend}</span></article>
}
