import { Outlet, Link } from 'react-router-dom'
import { APP_NAME } from '@/lib/constants'

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-taupe-50">
      {/* Simple header with logo */}
      <header className="p-6">
        <Link
          to="/"
          className="font-display text-2xl font-semibold text-foreground"
        >
          <span className="text-blush-500">{APP_NAME}</span>
        </Link>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <Outlet />
      </main>

      {/* Simple footer */}
      <footer className="p-6 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.
      </footer>
    </div>
  )
}
