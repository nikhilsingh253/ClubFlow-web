import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Calendar,
  CalendarCheck,
  CreditCard,
  Receipt,
  User,
  LogOut,
  Menu,
  ChevronLeft,
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useUIStore } from '@/store/uiStore'
import { cn } from '@/lib/utils'
import { APP_NAME, ROUTES, PORTAL_NAV_ITEMS } from '@/lib/constants'
import { logout as logoutApi } from '@/api/auth'

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard,
  Calendar,
  CalendarCheck,
  CreditCard,
  Receipt,
  User,
}

export default function PortalLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const { isSidebarOpen, toggleSidebar } = useUIStore()

  const handleLogout = async () => {
    await logoutApi()
    logout()
    navigate(ROUTES.HOME)
  }

  const isActive = (href: string) => {
    if (href === ROUTES.PORTAL) {
      return location.pathname === ROUTES.PORTAL
    }
    return location.pathname.startsWith(href)
  }

  return (
    <div className="min-h-screen bg-taupe-50">
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-screen bg-white border-r border-border transition-all duration-300',
          isSidebarOpen ? 'w-64' : 'w-20'
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-border">
          <Link
            to={ROUTES.HOME}
            className={cn(
              'font-display text-xl font-semibold text-blush-500 transition-opacity',
              !isSidebarOpen && 'opacity-0'
            )}
          >
            {APP_NAME}
          </Link>
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg text-muted-foreground hover:bg-taupe-50 transition-colors"
            aria-label={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {isSidebarOpen ? (
              <ChevronLeft className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {PORTAL_NAV_ITEMS.map((item) => {
            const Icon = iconMap[item.icon] || LayoutDashboard
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isActive(item.href)
                    ? 'bg-blush-50 text-blush-700'
                    : 'text-muted-foreground hover:bg-taupe-50 hover:text-foreground'
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span
                  className={cn(
                    'transition-opacity',
                    !isSidebarOpen && 'opacity-0 w-0 overflow-hidden'
                  )}
                >
                  {item.label}
                </span>
              </Link>
            )
          })}
        </nav>

        {/* User & Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
          {/* User info */}
          <div
            className={cn(
              'flex items-center gap-3 mb-4 transition-opacity',
              !isSidebarOpen && 'justify-center'
            )}
          >
            {user?.profilePhotoUrl ? (
              <img
                src={user.profilePhotoUrl}
                alt={user.fullName}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-blush-100 flex items-center justify-center">
                <User className="h-5 w-5 text-blush-600" />
              </div>
            )}
            {isSidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {user?.fullName || 'User'}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email}
                </p>
              </div>
            )}
          </div>

          {/* Logout button */}
          <button
            onClick={handleLogout}
            className={cn(
              'flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-colors',
              !isSidebarOpen && 'justify-center'
            )}
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            <span
              className={cn(
                'transition-opacity',
                !isSidebarOpen && 'opacity-0 w-0 overflow-hidden'
              )}
            >
              Sign Out
            </span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main
        className={cn(
          'transition-all duration-300',
          isSidebarOpen ? 'ml-64' : 'ml-20'
        )}
      >
        <div className="p-6 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
