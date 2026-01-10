import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/lib/constants'
import LoadingSpinner from '@/components/common/LoadingSpinner'

export default function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    // Handle OAuth callback if needed
    // For now, redirect to portal
    navigate(ROUTES.PORTAL, { replace: true })
  }, [navigate])

  return (
    <div className="flex flex-col items-center justify-center py-16">
      <LoadingSpinner size="lg" />
      <p className="mt-4 text-muted-foreground">Completing sign in...</p>
    </div>
  )
}
