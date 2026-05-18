/* eslint-disable react-refresh/only-export-components */
import { create } from 'zustand'
import { login as apiLogin, logout as apiLogout, getMe } from '../services/api/auth'
import type { Session, User } from '../types'

function readSession(): Session | null {
  try {
    const token = localStorage.getItem('adminToken')
    const userStr = localStorage.getItem('adminUser')
    const refreshToken = localStorage.getItem('refreshToken')
    if (token && userStr) {
      return {
        token,
        user: JSON.parse(userStr) as User,
        refreshToken: refreshToken || undefined,
      }
    }
    return null
  } catch {
    return null
  }
}

interface AuthStore {
  session: Session | null
  login: (credentials: { email: string; password: string }) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const useAuthStore = create<AuthStore>((set, get) => ({
  session: readSession(),
  login: async ({ email, password }) => {
    const response = await apiLogin(email, password)
    const session: Session = {
      token: response.token,
      user: response.user,
      refreshToken: response.refreshToken,
    }
    set({ session })
  },
  logout: async () => {
    const refreshToken = localStorage.getItem('refreshToken')
    if (refreshToken) {
      try {
        await apiLogout(refreshToken)
      } catch (error) {
        console.error('Logout error:', error)
      }
    }
    set({ session: null })
    window.location.hash = '/login'
  },
  refreshUser: async () => {
    try {
      const user = await getMe()
      const session = get().session
      if (session) {
        localStorage.setItem('adminUser', JSON.stringify(user))
        set({ session: { ...session, user } })
      }
    } catch (error) {
      console.error('Failed to refresh user:', error)
    }
  },
}))

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

export function useAuth() {
  const session = useAuthStore((state) => state.session)
  const login = useAuthStore((state) => state.login)
  const logout = useAuthStore((state) => state.logout)
  const refreshUser = useAuthStore((state) => state.refreshUser)
  return {
    user: session?.user ?? null,
    token: session?.token ?? null,
    refreshToken: session?.refreshToken,
    isAuthenticated: Boolean(session?.token),
    login,
    logout,
    refreshUser,
  }
}
