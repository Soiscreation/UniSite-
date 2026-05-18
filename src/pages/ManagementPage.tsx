import { BarChart } from '../components/Charts'
import { Badge, Button } from '../components/ui'

const chartData = [
  { label: 'Q1', revenue: 4200000 },
  { label: 'Q2', revenue: 6900000 },
  { label: 'Q3', revenue: 5100000 },
  { label: 'Q4', revenue: 7600000 },
]

interface ManagementPageProps {
  title: string
  description: string
  columns: string[]
  rows: string[][]
  actions: string[]
  fileManager?: boolean
  report?: boolean
}

export function ManagementPage({
  title,
  description,
  columns,
  rows,
  actions,
  fileManager,
  report,
}: ManagementPageProps) {
  return (
    <div className="page-stack">
      <section className="page-hero">
        <div>
          <Badge tone="info">Ready for API integration</Badge>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        <div className="action-row">
          {actions.map((action) => (
            <Button
              key={action}
              variant={action.includes('Delete') || action.includes('Reject') ? 'danger' : 'secondary'}
            >
              {action}
            </Button>
          ))}
        </div>
      </section>
      {report ? (
        <section className="panel">
          <div className="panel-head"><h2>Report snapshot</h2><Badge tone="success">Exportable</Badge></div>
          <BarChart data={chartData} />
        </section>
      ) : null}
      {fileManager ? (
        <section className="file-grid">
          {rows.map((row) => (
            <article className="file-tile" key={row[0]}>
              <b>{row[0].slice(0, 2).toUpperCase()}</b>
              <h3>{row[0]}</h3>
              <p>{row[1]} | {row[3]}</p>
            </article>
          ))}
        </section>
      ) : null}
      <section className="table-card">
        <div className="table-scroll">
          <table>
            <thead><tr>{columns.map((col) => <th key={col}>{col}</th>)}</tr></thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.join('-')}>
                  {row.map((cell) => <td key={cell}>{cell}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
