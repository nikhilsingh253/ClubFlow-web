import { Link } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'
import { ROUTES } from '@/lib/constants'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="font-display text-8xl font-bold text-blush-300">404</h1>
        <h2 className="font-display text-2xl font-semibold text-foreground mt-4">
          Page Not Found
        </h2>
        <p className="text-muted-foreground mt-4">
          Sorry, we couldn't find the page you're looking for. It might have been
          moved or doesn't exist.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link
            to={ROUTES.HOME}
            className="btn-elegant-primary inline-flex items-center justify-center gap-2"
          >
            <Home className="h-4 w-4" />
            Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="btn-elegant-secondary inline-flex items-center justify-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  )
}
