import { useState } from 'react'
import { z } from 'zod'
import { Badge, Button, Input, Modal, Skeleton } from '../components/ui'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../hooks/useToast'
import { changePassword } from '../services/api/auth'

const passwordSchema = z.object({
  currentPassword: z.string().min(6, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Please confirm your new password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

export function Profile() {
  const { user } = useAuth()
  const { notify } = useToast()
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [passwordValues, setPasswordValues] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({})
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  if (!user) return <Skeleton rows={4} />

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    const parsed = passwordSchema.safeParse(passwordValues)
    if (!parsed.success) {
      const errors: Record<string, string> = {}
      parsed.error.issues.forEach((issue) => {
        errors[issue.path[0] as string] = issue.message
      })
      setPasswordErrors(errors)
      return
    }

    setIsChangingPassword(true)
    setPasswordErrors({})
    try {
      await changePassword(passwordValues.currentPassword, passwordValues.newPassword)
      notify('Password changed successfully')
      setShowPasswordModal(false)
      setPasswordValues({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (error) {
      setPasswordErrors({ form: error instanceof Error ? error.message : 'Failed to change password' })
    } finally {
      setIsChangingPassword(false)
    }
  }

  return (
    <div className="page-stack">
      <section className="page-hero">
        <div>
          <h2>Profile</h2>
          <p>Manage your account settings and security</p>
        </div>
        <Button onClick={() => setShowPasswordModal(true)}>Change Password</Button>
      </section>

      <section className="panel">
        <h2>Account Details</h2>
        <div className="detail-grid">
          <div>
            <label>Name</label>
            <p>{user.name}</p>
          </div>
          <div>
            <label>Email</label>
            <p>{user.email}</p>
          </div>
          <div>
            <label>Role</label>
            <Badge tone="info">{user.role}</Badge>
          </div>
          {user.region && (
            <div>
              <label>Region</label>
              <p>{user.region}</p>
            </div>
          )}
          {user.status && (
            <div>
              <label>Status</label>
              <Badge tone={user.status === 'active' ? 'success' : 'neutral'}>{user.status}</Badge>
            </div>
          )}
          <div>
            <label>User ID</label>
            <p className="text-sm">{user.id}</p>
          </div>
        </div>
      </section>

      <Modal
        title="Change Password"
        open={showPasswordModal}
        onClose={() => {
          setShowPasswordModal(false)
          setPasswordValues({ currentPassword: '', newPassword: '', confirmPassword: '' })
          setPasswordErrors({})
        }}
      >
        <form className="form-grid" onSubmit={handlePasswordChange}>
          <Input
            label="Current Password"
            type="password"
            value={passwordValues.currentPassword}
            error={passwordErrors.currentPassword}
            onChange={(e) => setPasswordValues({ ...passwordValues, currentPassword: e.target.value })}
          />
          <Input
            label="New Password"
            type="password"
            value={passwordValues.newPassword}
            error={passwordErrors.newPassword}
            onChange={(e) => setPasswordValues({ ...passwordValues, newPassword: e.target.value })}
          />
          <Input
            label="Confirm New Password"
            type="password"
            value={passwordValues.confirmPassword}
            error={passwordErrors.confirmPassword}
            onChange={(e) => setPasswordValues({ ...passwordValues, confirmPassword: e.target.value })}
          />
          {passwordErrors.form && <p className="field-error">{passwordErrors.form}</p>}
          <div className="form-actions">
            <Button variant="secondary" type="button" onClick={() => setShowPasswordModal(false)}>
              Cancel
            </Button>
            <Button disabled={isChangingPassword}>{isChangingPassword ? 'Changing...' : 'Change Password'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
