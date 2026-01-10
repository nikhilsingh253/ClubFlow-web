import { Link, useLocation } from 'react-router-dom'
import { Menu, X, User } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useUIStore } from '@/store/uiStore'
import { cn } from '@/lib/utils'
import { APP_NAME, NAV_ITEMS, ROUTES } from '@/lib/constants'

export default function Header() {
  const location = useLocation()
  const { isAuthenticated, user } = useAuthStore()
  const { isMobileNavOpen, toggleMobileNav, setMobileNavOpen } = useUIStore()

  const isActive = (href: string) => {
    if (href === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(href)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container-wide">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 font-display text-xl font-semibold text-foreground"
          >
            <span className="text-blush-500">{APP_NAME}</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-blush-500',
                  isActive(item.href)
                    ? 'text-blush-500'
                    : 'text-muted-foreground'
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Auth Buttons / User Menu */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <Link
                to={ROUTES.PORTAL}
                className="flex items-center gap-2 rounded-full bg-blush-50 px-4 py-2 text-sm font-medium text-blush-700 hover:bg-blush-100 transition-colors"
              >
                {user?.profilePhotoUrl ? (
                  <img
                    src={user.profilePhotoUrl}
                    alt={user.fullName}
                    className="h-6 w-6 rounded-full object-cover"
                  />
                ) : (
                  <User className="h-5 w-5" />
                )}
                <span>My Account</span>
              </Link>
            ) : (
              <>
                <Link
                  to={ROUTES.LOGIN}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to={ROUTES.TRIAL}
                  className="btn-elegant-primary text-sm"
                >
                  Book a Trial
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 -mr-2 text-muted-foreground hover:text-foreground"
            onClick={toggleMobileNav}
            aria-label="Toggle menu"
          >
            {isMobileNavOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileNavOpen && (
          <div className="md:hidden border-t border-border py-4 animate-fade-in">
            <nav className="flex flex-col gap-4">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setMobileNavOpen(false)}
                  className={cn(
                    'px-2 py-2 text-base font-medium transition-colors',
                    isActive(item.href)
                      ? 'text-blush-500'
                      : 'text-muted-foreground'
                  )}
                >
                  {item.label}
                </Link>
              ))}
              <div className="border-t border-border pt-4 mt-2 flex flex-col gap-3">
                {isAuthenticated ? (
                  <Link
                    to={ROUTES.PORTAL}
                    onClick={() => setMobileNavOpen(false)}
                    className="btn-elegant-primary text-center"
                  >
                    My Account
                  </Link>
                ) : (
                  <>
                    <Link
                      to={ROUTES.LOGIN}
                      onClick={() => setMobileNavOpen(false)}
                      className="px-2 py-2 text-base font-medium text-muted-foreground"
                    >
                      Sign In
                    </Link>
                    <Link
                      to={ROUTES.TRIAL}
                      onClick={() => setMobileNavOpen(false)}
                      className="btn-elegant-primary text-center"
                    >
                      Book a Trial
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
