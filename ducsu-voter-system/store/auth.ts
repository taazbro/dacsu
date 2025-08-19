import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, AuthState } from '@/types'

const users = {
  admin: {
    password: 'Subscribe@vezran',
    user: {
      id: 'admin',
      username: 'admin',
      name: 'Administrator',
      role: 'admin' as const,
      permissions: ['read', 'write', 'delete', 'export', 'admin']
    }
  },
  user: {
    password: 'follow@vezranai',
    user: {
      id: 'user',
      username: 'user',
      name: 'Standard User',
      role: 'viewer' as const,
      permissions: ['read', 'export']
    }
  }
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      
      login: async (username: string, password: string) => {
        const userConfig = users[username as keyof typeof users]
        
        if (userConfig && userConfig.password === password) {
          set({
            user: userConfig.user,
            isAuthenticated: true
          })
          return true
        }
        return false
      },
      
      logout: () => {
        set({
          user: null,
          isAuthenticated: false
        })
      }
    }),
    {
      name: 'auth-storage',
    }
  )
)