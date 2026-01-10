import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Calendar, CalendarCheck, CreditCard, AlertCircle, Receipt } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { useAuthStore } from '@/store/authStore'
import { ROUTES, APP_NAME } from '@/lib/constants'
import { getCurrentMembership } from '@/api/membership'
import { getBookings } from '@/api/bookings'
import { formatDate } from '@/lib/utils'
import LoadingSpinner from '@/components/common/LoadingSpinner'

export default function DashboardPage() {
  const { user } = useAuthStore()

  // Fetch membership data
  const { data: membership, isLoading: membershipLoading } = useQuery({
    queryKey: ['membership'],
    queryFn: getCurrentMembership,
  })

  // Fetch upcoming bookings
  const { data: bookings, isLoading: bookingsLoading } = useQuery({
    queryKey: ['bookings', 'upcoming'],
    queryFn: () => getBookings({ upcoming: true }),
  })

  const upcomingBookings = bookings?.filter(b => b.status === 'confirmed').slice(0, 3) || []

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-semibold text-foreground">
          Welcome back, {user?.firstName || 'Member'}!
        </h1>
        <p className="mt-2 text-muted-foreground">
          Here's what's happening with your {APP_NAME} membership.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-xl border border-border">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blush-100 rounded-lg">
              <CreditCard className="h-6 w-6 text-blush-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Membership</p>
              {membershipLoading ? (
                <LoadingSpinner size="sm" />
              ) : membership ? (
                <p className="font-semibold text-foreground">{membership.planName}</p>
              ) : (
                <p className="text-sm text-muted-foreground">No active plan</p>
              )}
            </div>
          </div>
        </div>
        <div className="p-6 bg-white rounded-xl border border-border">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-sage-100 rounded-lg">
              <CalendarCheck className="h-6 w-6 text-sage-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Classes This Month</p>
              {membershipLoading ? (
                <LoadingSpinner size="sm" />
              ) : membership ? (
                <p className="font-semibold text-foreground">
                  {membership.classesUsed} / {membership.classesPerMonth}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">-</p>
              )}
            </div>
          </div>
        </div>
        <div className="p-6 bg-white rounded-xl border border-border">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-taupe-100 rounded-lg">
              <Calendar className="h-6 w-6 text-taupe-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Next Class</p>
              {bookingsLoading ? (
                <LoadingSpinner size="sm" />
              ) : upcomingBookings.length > 0 ? (
                <p className="font-semibold text-foreground">
                  {formatDate(upcomingBookings[0].date)}, {upcomingBookings[0].startTime.slice(0, 5)}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">No upcoming classes</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions & Membership Card */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="p-6 bg-white rounded-xl border border-border">
          <h2 className="font-display text-lg font-semibold text-foreground mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <Link
              to={ROUTES.PORTAL_SCHEDULE}
              className="p-4 rounded-lg bg-blush-50 hover:bg-blush-100 transition-colors text-center"
            >
              <Calendar className="h-6 w-6 text-blush-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-foreground">Book a Class</span>
            </Link>
            <Link
              to={ROUTES.PORTAL_BOOKINGS}
              className="p-4 rounded-lg bg-sage-50 hover:bg-sage-100 transition-colors text-center"
            >
              <CalendarCheck className="h-6 w-6 text-sage-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-foreground">My Bookings</span>
            </Link>
            <Link
              to={ROUTES.PORTAL_MEMBERSHIP}
              className="p-4 rounded-lg bg-taupe-50 hover:bg-taupe-100 transition-colors text-center"
            >
              <CreditCard className="h-6 w-6 text-taupe-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-foreground">Membership</span>
            </Link>
            <Link
              to={ROUTES.PORTAL_INVOICES}
              className="p-4 rounded-lg bg-blush-50 hover:bg-blush-100 transition-colors text-center"
            >
              <Receipt className="h-6 w-6 text-blush-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-foreground">Invoices</span>
            </Link>
          </div>
        </div>

        {/* Membership Card Preview */}
        {membershipLoading ? (
          <div className="p-6 bg-gradient-to-br from-blush-400 to-rosegold rounded-xl flex items-center justify-center">
            <LoadingSpinner size="lg" className="text-white" />
          </div>
        ) : membership ? (
          <div className="p-6 bg-gradient-to-br from-blush-400 to-rosegold rounded-xl text-white">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-sm opacity-90">Member</p>
                <p className="font-display text-xl font-semibold">
                  {user?.fullName || 'Member'}
                </p>
              </div>
              <div className="p-2 bg-white rounded-lg">
                <QRCodeSVG
                  value={membership.cardNumber}
                  size={72}
                  level="H"
                  includeMargin={false}
                />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm opacity-90">{membership.planName} Membership</p>
              <p className="text-xs opacity-75">Valid until {formatDate(membership.endDate)}</p>
              <p className="text-xs opacity-75 font-mono">{membership.cardNumber}</p>
            </div>
            <p className="mt-4 text-xs opacity-75">
              Show this QR code at check-in
            </p>
          </div>
        ) : (
          <div className="p-6 bg-taupe-100 rounded-xl flex flex-col items-center justify-center text-center">
            <AlertCircle className="h-10 w-10 text-taupe-400 mb-4" />
            <p className="font-medium text-foreground">No Active Membership</p>
            <p className="text-sm text-muted-foreground mt-1">
              Contact us to discuss membership options
            </p>
            <Link
              to={ROUTES.CONTACT}
              className="mt-4 btn-elegant-primary text-sm"
            >
              Contact Us
            </Link>
          </div>
        )}
      </div>

      {/* Upcoming Classes */}
      <div className="p-6 bg-white rounded-xl border border-border">
        <h2 className="font-display text-lg font-semibold text-foreground mb-4">
          Upcoming Classes
        </h2>
        {bookingsLoading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner size="lg" />
          </div>
        ) : upcomingBookings.length > 0 ? (
          <div className="space-y-4">
            {upcomingBookings.map((booking) => (
              <div
                key={booking.id}
                className="flex items-center justify-between p-4 rounded-lg bg-taupe-50"
              >
                <div>
                  <p className="font-medium text-foreground">{booking.className}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(booking.date)}, {booking.startTime.slice(0, 5)} - {booking.instructorName}
                  </p>
                </div>
                <Link
                  to={ROUTES.PORTAL_BOOKINGS}
                  className="text-sm text-blush-600 hover:underline"
                >
                  View
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No upcoming classes</p>
            <Link
              to={ROUTES.PORTAL_SCHEDULE}
              className="mt-4 inline-block text-sm text-blush-600 hover:underline"
            >
              Book a class →
            </Link>
          </div>
        )}
        {upcomingBookings.length > 0 && (
          <Link
            to={ROUTES.PORTAL_BOOKINGS}
            className="mt-4 inline-block text-sm text-blush-600 hover:underline"
          >
            View all bookings →
          </Link>
        )}
      </div>
    </div>
  )
}
