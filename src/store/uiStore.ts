import { create } from 'zustand'

interface UIState {
  // Mobile navigation
  isMobileNavOpen: boolean
  setMobileNavOpen: (open: boolean) => void
  toggleMobileNav: () => void

  // Portal sidebar (for authenticated users)
  isSidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void

  // Modal state
  activeModal: string | null
  openModal: (modalId: string) => void
  closeModal: () => void

  // Toast notifications handled by react-hot-toast
}

export const useUIStore = create<UIState>((set) => ({
  // Mobile navigation
  isMobileNavOpen: false,
  setMobileNavOpen: (isMobileNavOpen) => set({ isMobileNavOpen }),
  toggleMobileNav: () => set((state) => ({ isMobileNavOpen: !state.isMobileNavOpen })),

  // Portal sidebar
  isSidebarOpen: true,
  setSidebarOpen: (isSidebarOpen) => set({ isSidebarOpen }),
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

  // Modals
  activeModal: null,
  openModal: (activeModal) => set({ activeModal }),
  closeModal: () => set({ activeModal: null }),
}))
