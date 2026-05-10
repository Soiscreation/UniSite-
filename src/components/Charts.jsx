import { formatCurrency } from '../utils/format'

export function BarChart({ data }) {
  const max = Math.max(...data.map((item) => item.revenue))
  return <div className="chart" aria-label="Revenue chart">{data.map((item) => <div className="bar-group" key={item.label}><div className="bar-track"><div className="bar" style={{ height: `${(item.revenue / max) * 100}%` }} title={formatCurrency(item.revenue)} /></div><span>{item.label}</span></div>)}</div>
}

export function DonutChart({ active, pending, expired }) {
  const total = Math.max(active + pending + expired, 1)
  const activeDeg = (active / total) * 360
  const pendingDeg = activeDeg + (pending / total) * 360
  return <div className="donut-wrap"><div className="donut" style={{ background: `conic-gradient(var(--success) 0deg ${activeDeg}deg, var(--warning) ${activeDeg}deg ${pendingDeg}deg, var(--danger) ${pendingDeg}deg 360deg)` }}><span>{total}</span></div><div className="legend"><span><i className="dot success" /> Active</span><span><i className="dot warning" /> Pending</span><span><i className="dot danger" /> Expired</span></div></div>
}
