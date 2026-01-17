import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Calendar,
  CalendarCheck,
  QrCode,
  Users,
  CreditCard,
  UserPlus,
  MessageSquare,
  Receipt,
  Clock,
  FileText,
  Dumbbell,
  Package,
  UserCheck,
  Shield,
  Settings,
  BarChart3,
  LogOut,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { logout as logoutApi } from '@/api/auth'
import { ROUTES, ADMIN_NAV_ITEMS, ADMIN_TRAINER_NAV_ITEMS, ADMIN_OWNER_NAV_ITEMS, APP_NAME } from '@/lib/constants'
import { cn } from '@/lib/utils'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  Calendar,
  CalendarCheck,
  QrCode,
  Users,
  CreditCard,
  UserPlus,
  MessageSquare,
  Receipt,
  Clock,
  FileText,
  Dumbbell,
  Package,
  UserCheck,
  Shield,
  Settings,
  BarChart3,
}

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [configExpanded, setConfigExpanded] = useState(false)
  const navigate = useNavigate()

  // Use selectors to avoid re-render issues from calling functions during render
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)

  // Compute role checks from user data
  const isOwner = ['manager', 'admin'].includes(user?.userType || '')
  const isTrainerOnly = user?.isTrainer === true && !isOwner

  // Select navigation items based on user role
  const navItems = isTrainerOnly ? ADMIN_TRAINER_NAV_ITEMS : ADMIN_NAV_ITEMS

  const handleLogout = async () => {
    await logoutApi()
    logout()
    navigate(ROUTES.HOME)
  }

  const NavItem = ({
    item,
    onClick,
  }: {
    item: { label: string; href: string; icon: string }
    onClick?: () => void
  }) => {
    const Icon = iconMap[item.icon] || LayoutDashboard

    return (
      <NavLink
        to={item.href}
        end={item.href === ROUTES.ADMIN}
        onClick={onClick}
        className={({ isActive }) =>
          cn(
            'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
            isActive
              ? 'bg-blush-100 text-blush-700'
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          )
        }
      >
        <Icon className="h-5 w-5 flex-shrink-0" />
        <span>{item.label}</span>
      </NavLink>
    )
  }

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={cn('flex flex-col h-full', mobile ? 'w-64' : 'w-64')}>
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 py-5 border-b border-gray-200">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blush-500 to-blush-600 flex items-center justify-center">
          <span className="text-white font-bold text-sm">{isTrainerOnly ? 'T' : 'A'}</span>
        </div>
        <div>
          <h1 className="font-display font-semibold text-gray-900">{APP_NAME}</h1>
          <p className="text-xs text-gray-500">{isTrainerOnly ? 'Trainer Portal' : 'Admin Dashboard'}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <NavItem
            key={item.href}
            item={item}
            onClick={mobile ? () => setSidebarOpen(false) : undefined}
          />
        ))}

        {/* Owner-only section */}
        {isOwner && (
          <>
            <div className="pt-4 pb-2">
              <button
                onClick={() => setConfigExpanded(!configExpanded)}
                className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-700"
              >
                <span>Configuration</span>
                {configExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
            </div>
            {configExpanded &&
              ADMIN_OWNER_NAV_ITEMS.map((item) => (
                <NavItem
                  key={item.href}
                  item={item}
                  onClick={mobile ? () => setSidebarOpen(false) : undefined}
                />
              ))}
          </>
        )}
      </nav>

      {/* User section */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-blush-100 flex items-center justify-center">
            <span className="text-blush-600 font-medium">
              {user?.firstName?.charAt(0) || user?.email?.charAt(0)?.toUpperCase() || 'A'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.fullName || user?.email}
            </p>
            <p className="text-xs text-gray-500 capitalize">
              {user?.userType || 'Staff'}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign out</span>
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 bg-white transform transition-transform duration-300 ease-in-out lg:hidden',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700"
        >
          <X className="h-5 w-5" />
        </button>
        <Sidebar mobile />
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col border-r border-gray-200 bg-white">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top header (mobile) */}
        <header className="sticky top-0 z-30 flex items-center gap-4 bg-white border-b border-gray-200 px-4 py-3 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ml-2 text-gray-500 hover:text-gray-700"
          >
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="font-display font-semibold text-gray-900">
            {APP_NAME} {isTrainerOnly ? 'Trainer' : 'Admin'}
          </h1>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
