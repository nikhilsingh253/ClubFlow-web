import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import {
  Users,
  Calendar,
  UserPlus,
  MessageSquare,
  FileText,
  CreditCard,
  QrCode,
  CalendarPlus,
  Clock,
  CheckCircle,
  TrendingUp,
  Award,
  Mail,
} from 'lucide-react'
import { getDashboardStats, getTodayClasses, getMyTrainerProfile } from '@/api/admin'
import { useAuthStore } from '@/store/authStore'
import { ROUTES } from '@/lib/constants'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { cn } from '@/lib/utils'

export default function AdminDashboardPage() {
  // Use selector to get user and compute role checks (avoids re-render issues)
  const user = useAuthStore((state) => state.user)
  const isTrainerUser = user?.isTrainer === true
  const isManagerOrAboveUser = ['manager', 'admin'].includes(user?.userType || '')

  // Check if user is a trainer-only (not a manager who happens to also be a trainer)
  const isTrainerOnly = isTrainerUser && !isManagerOrAboveUser

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['admin', 'dashboard', 'stats'],
    queryFn: getDashboardStats,
  })

  const { data: todayClasses, isLoading: classesLoading } = useQuery({
    queryKey: ['admin', 'dashboard', 'today-classes'],
    queryFn: getTodayClasses,
  })

  // Fetch trainer profile if user is a trainer
  const { data: trainerProfile } = useQuery({
    queryKey: ['admin', 'me', 'trainer'],
    queryFn: getMyTrainerProfile,
    enabled: isTrainerUser,
  })

  if (statsLoading || classesLoading) {
    return <LoadingSpinner fullScreen />
  }

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const hour12 = hour % 12 || 12
    return `${hour12}:${minutes} ${ampm}`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-700'
      case 'in_progress':
        return 'bg-green-100 text-green-700'
      case 'completed':
        return 'bg-gray-100 text-gray-600'
      case 'cancelled':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-display font-semibold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">
          {new Date().toLocaleDateString('en-IN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>

      {/* Quick Actions - Different for trainers vs staff/managers */}
      <div className={cn('grid gap-4', isTrainerOnly ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-4')}>
        <Link
          to={ROUTES.ADMIN_CHECKIN}
          className="flex flex-col items-center justify-center p-4 bg-blush-50 rounded-xl border border-blush-100 hover:bg-blush-100 transition-colors"
        >
          <QrCode className="h-8 w-8 text-blush-600 mb-2" />
          <span className="text-sm font-medium text-blush-700">Check-in Member</span>
        </Link>
        <Link
          to={ROUTES.ADMIN_SCHEDULE}
          className="flex flex-col items-center justify-center p-4 bg-amber-50 rounded-xl border border-amber-100 hover:bg-amber-100 transition-colors"
        >
          <Calendar className="h-8 w-8 text-amber-600 mb-2" />
          <span className="text-sm font-medium text-amber-700">{isTrainerOnly ? 'My Schedule' : 'View Schedule'}</span>
        </Link>
        {!isTrainerOnly && (
          <>
            <Link
              to={ROUTES.ADMIN_BOOKINGS}
              className="flex flex-col items-center justify-center p-4 bg-emerald-50 rounded-xl border border-emerald-100 hover:bg-emerald-100 transition-colors"
            >
              <CalendarPlus className="h-8 w-8 text-emerald-600 mb-2" />
              <span className="text-sm font-medium text-emerald-700">New Booking</span>
            </Link>
            <Link
              to={ROUTES.ADMIN_CUSTOMER_NEW}
              className="flex flex-col items-center justify-center p-4 bg-violet-50 rounded-xl border border-violet-100 hover:bg-violet-100 transition-colors"
            >
              <UserPlus className="h-8 w-8 text-violet-600 mb-2" />
              <span className="text-sm font-medium text-violet-700">New Customer</span>
            </Link>
          </>
        )}
      </div>

      {/* Stats Grid */}
      <div className={cn('grid gap-4', isTrainerOnly ? 'grid-cols-3' : 'grid-cols-2 lg:grid-cols-4')}>
        {/* Today's Overview */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-gray-600">{isTrainerOnly ? 'My Classes' : 'Classes Today'}</span>
          </div>
          <p className="text-3xl font-semibold text-gray-900">{stats?.today.classesCount || 0}</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <Users className="h-5 w-5 text-emerald-600" />
            </div>
            <span className="text-sm font-medium text-gray-600">{isTrainerOnly ? 'My Bookings' : 'Bookings Today'}</span>
          </div>
          <p className="text-3xl font-semibold text-gray-900">{stats?.today.totalBookings || 0}</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-violet-100 rounded-lg">
              <CheckCircle className="h-5 w-5 text-violet-600" />
            </div>
            <span className="text-sm font-medium text-gray-600">Checked In</span>
          </div>
          <p className="text-3xl font-semibold text-gray-900">
            {stats?.today.checkedIn || 0}
            <span className="text-lg text-gray-400 ml-1">/ {stats?.today.totalBookings || 0}</span>
          </p>
        </div>

        {/* Hide Active Members stat for trainers */}
        {!isTrainerOnly && (
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-amber-600" />
              </div>
              <span className="text-sm font-medium text-gray-600">Active Members</span>
            </div>
            <p className="text-3xl font-semibold text-gray-900">
              {stats?.quickStats.activeMembers || 0}
            </p>
          </div>
        )}
      </div>

      {/* Alerts/Profile & Today's Classes */}
      <div className={cn('grid gap-6', isTrainerOnly ? '' : 'lg:grid-cols-3')}>
        {/* Show Trainer Profile for trainers, Alerts for staff/managers */}
        {isTrainerOnly ? (
          /* Trainer Profile Card */
          trainerProfile && (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="font-display font-semibold text-gray-900 mb-4">My Profile</h2>
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blush-400 to-blush-600 flex items-center justify-center flex-shrink-0">
                  {trainerProfile.photoUrl ? (
                    <img
                      src={trainerProfile.photoUrl}
                      alt={trainerProfile.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-white text-xl font-semibold">
                      {trainerProfile.name.charAt(0)}
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{trainerProfile.name}</h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                    <Mail className="h-4 w-4" />
                    {trainerProfile.email}
                  </p>
                  {trainerProfile.specializations.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs text-gray-500 mb-1.5 flex items-center gap-1">
                        <Award className="h-3.5 w-3.5" />
                        Specializations
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {trainerProfile.specializations.map((spec) => (
                          <span
                            key={spec}
                            className="px-2 py-0.5 bg-blush-100 text-blush-700 text-xs rounded-full"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        ) : (
          /* Alerts for staff/managers */
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="font-display font-semibold text-gray-900 mb-4">Alerts & Notifications</h2>
            <div className="space-y-3">
              {stats?.alerts.newTrialBookings ? (
                <Link
                  to={ROUTES.ADMIN_TRIALS}
                  className="flex items-center justify-between p-3 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <UserPlus className="h-5 w-5 text-amber-600" />
                    <span className="text-sm text-amber-800">New trial bookings</span>
                  </div>
                  <span className="px-2 py-1 bg-amber-200 text-amber-800 text-xs font-medium rounded-full">
                    {stats.alerts.newTrialBookings}
                  </span>
                </Link>
              ) : null}

              {stats?.alerts.newContactMessages ? (
                <Link
                  to={ROUTES.ADMIN_MESSAGES}
                  className="flex items-center justify-between p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <MessageSquare className="h-5 w-5 text-blue-600" />
                    <span className="text-sm text-blue-800">New messages</span>
                  </div>
                  <span className="px-2 py-1 bg-blue-200 text-blue-800 text-xs font-medium rounded-full">
                    {stats.alerts.newContactMessages}
                  </span>
                </Link>
              ) : null}

              {stats?.alerts.pendingMembershipRequests ? (
                <Link
                  to={ROUTES.ADMIN_REQUESTS}
                  className="flex items-center justify-between p-3 bg-violet-50 rounded-lg hover:bg-violet-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-violet-600" />
                    <span className="text-sm text-violet-800">Pending requests</span>
                  </div>
                  <span className="px-2 py-1 bg-violet-200 text-violet-800 text-xs font-medium rounded-full">
                    {stats.alerts.pendingMembershipRequests}
                  </span>
                </Link>
              ) : null}

              {stats?.alerts.expiringMemberships7Days ? (
                <Link
                  to={ROUTES.ADMIN_MEMBERSHIPS}
                  className="flex items-center justify-between p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-red-600" />
                    <span className="text-sm text-red-800">Expiring this week</span>
                  </div>
                  <span className="px-2 py-1 bg-red-200 text-red-800 text-xs font-medium rounded-full">
                    {stats.alerts.expiringMemberships7Days}
                  </span>
                </Link>
              ) : null}

              {!stats?.alerts.newTrialBookings &&
                !stats?.alerts.newContactMessages &&
                !stats?.alerts.pendingMembershipRequests &&
                !stats?.alerts.expiringMemberships7Days && (
                  <div className="flex items-center justify-center p-6 text-gray-500">
                    <div className="text-center">
                      <CheckCircle className="h-8 w-8 mx-auto mb-2 text-emerald-500" />
                      <p className="text-sm">All caught up!</p>
                    </div>
                  </div>
                )}
            </div>
          </div>
        )}

        {/* Today's Classes */}
        <div className={cn('bg-white rounded-xl border border-gray-200 p-5', !isTrainerOnly && 'lg:col-span-2')}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-gray-900">{isTrainerOnly ? "My Classes Today" : "Today's Classes"}</h2>
            <Link
              to={ROUTES.ADMIN_SCHEDULE}
              className="text-sm text-blush-600 hover:text-blush-700 font-medium"
            >
              View all
            </Link>
          </div>

          {todayClasses && todayClasses.length > 0 ? (
            <div className="space-y-3">
              {todayClasses.map((cls) => (
                <div
                  key={cls.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-1 h-12 rounded-full"
                      style={{ backgroundColor: cls.classType.color }}
                    />
                    <div>
                      <p className="font-medium text-gray-900">{cls.classType.name}</p>
                      <p className="text-sm text-gray-500">
                        {formatTime(cls.startTime)} - {formatTime(cls.endTime)} &middot;{' '}
                        {cls.trainer.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {cls.booked}/{cls.capacity}
                      </p>
                      <p className="text-xs text-gray-500">booked</p>
                    </div>
                    <span
                      className={cn(
                        'px-2 py-1 text-xs font-medium rounded-full capitalize',
                        getStatusColor(cls.status)
                      )}
                    >
                      {cls.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center p-8 text-gray-500">
              <div className="text-center">
                <Calendar className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm">No classes scheduled today</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats (hidden for trainers - they don't need to see revenue/member stats) */}
      {!isTrainerOnly && (
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blush-500 to-blush-600 rounded-xl p-5 text-white">
            <div className="flex items-center gap-3 mb-3">
              <Users className="h-5 w-5 opacity-80" />
              <span className="text-sm font-medium opacity-80">New Members This Month</span>
            </div>
            <p className="text-3xl font-semibold">{stats?.quickStats.newMembersThisMonth || 0}</p>
          </div>

          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-5 text-white">
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp className="h-5 w-5 opacity-80" />
              <span className="text-sm font-medium opacity-80">Revenue This Month</span>
            </div>
            <p className="text-3xl font-semibold">
              {new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
                maximumFractionDigits: 0,
              }).format(stats?.quickStats.revenueThisMonth || 0)}
            </p>
          </div>

          <div className="bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl p-5 text-white">
            <div className="flex items-center gap-3 mb-3">
              <Clock className="h-5 w-5 opacity-80" />
              <span className="text-sm font-medium opacity-80">Expected Remaining</span>
            </div>
            <p className="text-3xl font-semibold">
              {stats?.today.expectedRemaining || 0}
              <span className="text-lg opacity-80 ml-1">members</span>
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
