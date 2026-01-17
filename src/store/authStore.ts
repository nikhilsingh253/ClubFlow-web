import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/types'
import { TOKEN_KEY, REFRESH_TOKEN_KEY } from '@/lib/constants'

interface AuthState {
  // State
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean

  // Actions
  setUser: (user: User) => void
  setTokens: (accessToken: string, refreshToken: string) => void
  login: (user: User, accessToken: string, refreshToken: string) => void
  logout: () => void
  setLoading: (loading: boolean) => void
  updateUser: (updates: Partial<User>) => void

  // Computed helpers
  isTrainer: () => boolean
  isStaffOrAbove: () => boolean
  isManagerOrAbove: () => boolean
  getTrainerId: () => string | null
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: true,

      // Actions
      setUser: (user) => set({ user }),

      setTokens: (accessToken, refreshToken) => {
        // Also store in localStorage for API client access
        localStorage.setItem(TOKEN_KEY, accessToken)
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
        set({ accessToken, refreshToken })
      },

      login: (user, accessToken, refreshToken) => {
        localStorage.setItem(TOKEN_KEY, accessToken)
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
        set({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
          isLoading: false,
        })
      },

      logout: () => {
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(REFRESH_TOKEN_KEY)
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
        })
      },

      setLoading: (isLoading) => set({ isLoading }),

      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),

      // Computed helpers - check if user is a trainer (has trainer profile linked)
      isTrainer: () => get().user?.isTrainer === true,

      // Check if user is staff or higher (staff, trainer, manager, admin)
      isStaffOrAbove: () => ['staff', 'trainer', 'manager', 'admin'].includes(get().user?.userType || ''),

      // Check if user is manager or admin (owner-level access)
      isManagerOrAbove: () => ['manager', 'admin'].includes(get().user?.userType || ''),

      // Get trainer ID if user is a trainer
      getTrainerId: () => get().user?.trainerId || null,
    }),
    {
      name: 'fitrit-auth',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        // Set loading to false once hydration is complete
        // This prevents race conditions where isLoading becomes false
        // before isAuthenticated is restored from localStorage
        if (state) {
          state.setLoading(false)
        }
      },
    }
  )
)
