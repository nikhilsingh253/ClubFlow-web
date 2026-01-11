import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { ROUTES } from '@/lib/constants'
import LoadingSpinner from '@/components/common/LoadingSpinner'

interface AdminProtectedRouteProps {
  children: React.ReactNode
  requireOwner?: boolean
}

export default function AdminProtectedRoute({ children, requireOwner = false }: AdminProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuthStore()
  const location = useLocation()

  if (isLoading) {
    return <LoadingSpinner fullScreen />
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />
  }

  // Check if user has admin access (staff, manager, or admin)
  const hasAdminAccess = ['staff', 'trainer', 'manager', 'admin'].includes(user?.userType || '')

  if (!hasAdminAccess) {
    // Redirect regular customers to their portal
    return <Navigate to={ROUTES.PORTAL} replace />
  }

  // Check if owner access is required
  if (requireOwner) {
    const isOwner = ['manager', 'admin'].includes(user?.userType || '')
    if (!isOwner) {
      // Redirect staff to admin dashboard (not owner-only pages)
      return <Navigate to={ROUTES.ADMIN} replace />
    }
  }

  return <>{children}</>
}
