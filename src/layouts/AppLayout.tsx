import { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { Button } from '../components/ui'
import type { ReactNode } from 'react'

const nav: [string, string, string][] = [
  ['Dashboard', '/dashboard', 'D'],
  ['Clients', '/clients', 'C'],
  ['Employees', '/employees', 'E'],
  ['Policies', '/policies', 'P'],
  ['Claims', '/claims', 'K'],
  ['Tenders', '/tenders', 'T'],
  ['Documents', '/documents', 'F'],
  ['Reports', '/reports', 'R'],
  ['Settings', '/settings', 'S'],
]

interface AppLayoutProps {
  children: ReactNode
  path: string
  navigate: (path: string) => void
}

export function AppLayout({ children, path, navigate }: AppLayoutProps) {
  const { user, logout } = useAuth()
  const [collapsed, setCollapsed] = useState(false)
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark')

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  return (
    <div className={`app-shell ${collapsed ? 'is-collapsed' : ''}`}>
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">IB</span>
          <div><strong>InsureBridge</strong><small>Broker Admin</small></div>
        </div>
        <nav className="side-nav">
          {nav.map(([label, href, icon]) => (
            <button
              className={path === href || path.startsWith(`${href}/`) ? 'active' : ''}
              key={href}
              onClick={() => navigate(href)}
            >
              <span>{icon}</span><b>{label}</b>
            </button>
          ))}
        </nav>
        <Button variant="ghost" onClick={() => setCollapsed((v) => !v)}>
          {collapsed ? 'Expand' : 'Collapse'}
        </Button>
      </aside>
      <div className="main-area">
        <header className="topbar">
          <div>
            <p>Operations Portal</p>
            <h1>{nav.find((item) => path.startsWith(item[1]))?.[0] ?? 'Dashboard'}</h1>
          </div>
          <div className="top-actions">
            <Button variant="secondary" size="icon" aria-label="Notifications">!</Button>
            <Button variant="secondary" onClick={() => setDark((v) => !v)}>{dark ? 'Light' : 'Dark'}</Button>
            <div className="profile">
              <span>{user?.name?.slice(0, 1)}</span>
              <div><strong>{user?.name}</strong><small>{user?.role}</small></div>
            </div>
            <Button variant="ghost" onClick={logout}>Logout</Button>
          </div>
        </header>
        <main>{children}</main>
      </div>
    </div>
  )
}
