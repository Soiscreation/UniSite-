import { useState } from 'react'
import { z } from 'zod'
import { Button, Input } from '../components/ui.jsx'
import { useAuth } from '../hooks/useAuth.jsx'

const schema = z.object({ email: z.string().email(), password: z.string().min(6) })

export function Login() {
  const { login } = useAuth()
  const [values, setValues] = useState({ email: 'admin@brokerage.test', password: 'admin123' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  async function submit(event) {
    event.preventDefault()
    const parsed = schema.safeParse(values)
    if (!parsed.success) {
      setErrors(Object.fromEntries(parsed.error.issues.map((issue) => [issue.path[0], issue.message])))
      return
    }
    setLoading(true)
    setErrors({})
    try {
      await login(values)
      window.location.hash = '/dashboard'
    } catch (error) {
      setErrors({ form: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="login-page">
      <section className="login-panel">
        <div className="login-copy"><span className="brand-mark">IB</span><h1>Insurance brokerage command center</h1><p>Secure access for brokerage administrators, policy teams, and claims operations.</p></div>
        <form className="auth-card" onSubmit={submit}>
          <h2>Admin login</h2>
          <Input label="Email" value={values.email} error={errors.email} onChange={(event) => setValues({ ...values, email: event.target.value })} />
          <Input label="Password" type="password" value={values.password} error={errors.password} onChange={(event) => setValues({ ...values, password: event.target.value })} />
          {errors.form ? <p className="field-error">{errors.form}</p> : null}
          <Button disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</Button>
          <small>Demo password: admin123</small>
        </form>
      </section>
    </main>
  )
}
