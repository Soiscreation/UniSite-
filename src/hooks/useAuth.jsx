/* eslint-disable react-refresh/only-export-components */
import { create } from 'zustand'

const STORAGE_KEY = 'broker_admin_auth'
const demoUser = { id: 'usr_001', name: 'Amina Shah', email: 'admin@brokerage.test', role: 'Admin' }

function readSession() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

const useAuthStore = create((set, get) => ({
  session: readSession(),
  get user() {
    return get().session?.user || null
  },
  get token() {
    return get().session?.token || null
  },
  get isAuthenticated() {
    return Boolean(get().session?.token)
  },
  login: async ({ email, password }) => {
    await new Promise((resolve) => setTimeout(resolve, 450))
    if (!email || !password || password.length < 6) {
      throw new Error('Enter a valid email and a password with at least 6 characters.')
    }
    const session = { user: { ...demoUser, email }, token: `mock.jwt.${btoa(`${email}:${Date.now()}`)}` }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
    set({ session })
    return session
  },
  logout: () => {
    localStorage.removeItem(STORAGE_KEY)
    set({ session: null })
    window.location.hash = '/login'
  },
}))

export function AuthProvider({ children }) {
  return children
}

export function useAuth() {
  const session = useAuthStore((state) => state.session)
  const login = useAuthStore((state) => state.login)
  const logout = useAuthStore((state) => state.logout)
  return { user: session?.user || null, token: session?.token || null, isAuthenticated: Boolean(session?.token), login, logout }
}
