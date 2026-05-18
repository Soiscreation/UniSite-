import { useEffect, useMemo, useState } from 'react'
import { AuthProvider, useAuth } from './hooks/useAuth'
import { ToastProvider } from './hooks/useToast'
import { AppLayout } from './layouts/AppLayout'
import { Login } from './pages/Login'
import { Dashboard } from './pages/Dashboard'
import { Clients } from './pages/Clients'
import { ClientDetails } from './pages/ClientDetails'
import { Policies } from './pages/Policies'
import { ManagementPage } from './pages/ManagementPage'
import type { ComponentType } from 'react'

interface PageProps {
  path: string
  navigate: (path: string) => void
}

const routes: Record<string, ComponentType<PageProps>> = {
  '/': Dashboard,
  '/dashboard': Dashboard,
  '/clients': Clients,
  '/policies': Policies,
  '/employees': () => (
    <ManagementPage
      title="Employees"
      description="Manage brokerage staff, role assignments, and branch access."
      columns={['Name', 'Role', 'Region', 'Status']}
      rows={[
        ['Amina Shah', 'Admin', 'Nairobi', 'Active'],
        ['Brian Otieno', 'Agent', 'Mombasa', 'Active'],
        ['Carol Njeri', 'Staff', 'Kisumu', 'On leave'],
      ]}
      actions={['Add staff', 'Assign role', 'Deactivate']}
    />
  ),
  '/claims': () => (
    <ManagementPage
      title="Claims"
      description="Review claim submissions, documents, and approval decisions."
      columns={['Claim', 'Client', 'Type', 'Decision']}
      rows={[
        ['CLM-1108', 'Mwananchi Foods', 'Fire', 'Pending'],
        ['CLM-1097', 'Orbit Logistics', 'Motor', 'Approved'],
        ['CLM-1052', 'Safeguard Homes', 'Property', 'Rejected'],
      ]}
      actions={['Upload document', 'Approve', 'Reject']}
    />
  ),
  '/tenders': () => (
    <ManagementPage
      title="Tenders"
      description="Upload, review, and download tender documentation."
      columns={['Tender', 'Issuer', 'Due date', 'Files']}
      rows={[
        ['Medical Cover 2026', 'County Health Board', 'May 12, 2026', '4 docs'],
        ['Fleet Insurance', 'Metro Transit', 'May 20, 2026', '2 docs'],
      ]}
      actions={['Upload tender', 'View', 'Download']}
    />
  ),
  '/documents': () => (
    <ManagementPage
      title="Documents"
      description="A file-manager view for client, policy, claim, and tender records."
      columns={['File', 'Folder', 'Owner', 'Modified']}
      rows={[
        ['policy-schedule.pdf', 'Policies', 'Amina Shah', 'Today'],
        ['claim-photos.zip', 'Claims', 'Brian Otieno', 'Yesterday'],
        ['client-kyc.pdf', 'Clients', 'Carol Njeri', 'Apr 22, 2026'],
      ]}
      actions={['Upload', 'Preview', 'Delete']}
      fileManager
    />
  ),
  '/reports': () => (
    <ManagementPage
      title="Reports"
      description="Export production, claims, renewals, and revenue reports."
      columns={['Report', 'Period', 'Format', 'Status']}
      rows={[
        ['Revenue Summary', 'Q2 2026', 'PDF', 'Ready'],
        ['Renewal Pipeline', 'May 2026', 'CSV', 'Ready'],
        ['Claims Ratio', 'YTD', 'PDF', 'Generating'],
      ]}
      actions={['Download PDF', 'Download CSV', 'Schedule']}
      report
    />
  ),
  '/settings': () => (
    <ManagementPage
      title="Settings"
      description="Configure roles, notification preferences, and system defaults."
      columns={['Setting', 'Value', 'Owner', 'Status']}
      rows={[
        ['Default role', 'Staff', 'Admin', 'Enabled'],
        ['Two-step review', 'Required for claims', 'Operations', 'Enabled'],
        ['Renewal alerts', '30 days before expiry', 'System', 'Enabled'],
      ]}
      actions={['Save settings', 'Manage roles', 'Reset']}
    />
  ),
}

function useHashPath(): [string, (path: string) => void] {
  const [path, setPath] = useState(() => window.location.hash.replace('#', '') || '/dashboard')

  useEffect(() => {
    const onHashChange = () => setPath(window.location.hash.replace('#', '') || '/dashboard')
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const navigate = (nextPath: string) => { window.location.hash = nextPath }

  return [path, navigate]
}

function Router() {
  const [path, navigate] = useHashPath()
  const { isAuthenticated } = useAuth()
  const normalizedPath = path === '/' ? '/dashboard' : path

  useEffect(() => {
    if (!isAuthenticated && normalizedPath !== '/login') window.location.hash = '/login'
    if (isAuthenticated && normalizedPath === '/login') window.location.hash = '/dashboard'
  }, [isAuthenticated, normalizedPath])

  const Page = useMemo(() => {
    if (normalizedPath.startsWith('/clients/')) return ClientDetails
    return routes[normalizedPath] ?? Dashboard
  }, [normalizedPath])

  if (!isAuthenticated) return <Login />

  return (
    <AppLayout path={normalizedPath} navigate={navigate}>
      <Page path={normalizedPath} navigate={navigate} />
    </AppLayout>
  )
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Router />
      </AuthProvider>
    </ToastProvider>
  )
}
