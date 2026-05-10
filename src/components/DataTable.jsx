import { Button } from './ui.jsx'

export function DataTable({ columns, rows, page, pageSize, total, onPageChange, empty }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  return (
    <div className="table-card">
      <div className="table-scroll">
        <table>
          <thead><tr>{columns.map((column) => <th key={column.key || column.header}>{column.header}</th>)}</tr></thead>
          <tbody>
            {rows.length ? rows.map((row) => (
              <tr key={row.id}>{columns.map((column) => <td key={column.key || column.header}>{column.cell ? column.cell(row) : row[column.key]}</td>)}</tr>
            )) : <tr><td colSpan={columns.length}>{empty}</td></tr>}
          </tbody>
        </table>
      </div>
      <div className="pagination"><span>Page {page} of {totalPages}</span><div><Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>Previous</Button><Button variant="secondary" size="sm" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>Next</Button></div></div>
    </div>
  )
}
