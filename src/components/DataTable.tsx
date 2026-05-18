import type { ReactNode } from 'react'
import { Button } from './ui'

export interface Column<T extends object = Record<string, unknown>> {
  header: string
  key?: string
  cell?: (row: T) => ReactNode
}

interface DataTableProps<T extends object> {
  columns: Column<T>[]
  rows: T[]
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
  empty: ReactNode
}

export function DataTable<T extends object>({
  columns,
  rows,
  page,
  pageSize,
  total,
  onPageChange,
  empty,
}: DataTableProps<T>) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  return (
    <div className="table-card">
      <div className="table-scroll">
        <table>
          <thead>
            <tr>{columns.map((col) => <th key={col.key ?? col.header}>{col.header}</th>)}</tr>
          </thead>
          <tbody>
            {rows.length ? (
              rows.map((row, i) => (
                <tr key={(row as Record<string, unknown>).id as string ?? i}>
                  {columns.map((col) => (
                    <td key={col.key ?? col.header}>
                      {col.cell
                        ? col.cell(row)
                        : col.key
                          ? String((row as Record<string, unknown>)[col.key] ?? '')
                          : null}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr><td colSpan={columns.length}>{empty}</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="pagination">
        <span>Page {page} of {totalPages}</span>
        <div>
          <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>Previous</Button>
          <Button variant="secondary" size="sm" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>Next</Button>
        </div>
      </div>
    </div>
  )
}
