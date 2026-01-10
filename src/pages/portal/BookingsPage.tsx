import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { CalendarCheck, Clock, User, MapPin, RefreshCw, X, Users } from 'lucide-react'
import toast from 'react-hot-toast'
import { getBookings, cancelBooking, requestReschedule } from '@/api/bookings'
import { getWaitlistEntries, leaveWaitlist } from '@/api/waitlist'
import { formatDate } from '@/lib/utils'
import LoadingSpinner from '@/components/common/LoadingSpinner'

export default function BookingsPage() {
  const queryClient = useQueryClient()
  const [rescheduleBookingId, setRescheduleBookingId] = useState<string | null>(null)

  const { data: bookings, isLoading } = useQuery({
    queryKey: ['bookings'],
    queryFn: () => getBookings(),
  })

  const { data: waitlistEntries } = useQuery({
    queryKey: ['waitlist'],
    queryFn: getWaitlistEntries,
  })

  const cancelMutation = useMutation({
    mutationFn: cancelBooking,
    onSuccess: () => {
      toast.success('Booking cancelled successfully')
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
    },
    onError: () => {
      toast.error('Failed to cancel booking')
    },
  })

  const rescheduleMutation = useMutation({
    mutationFn: requestReschedule,
    onSuccess: () => {
      toast.success('Reschedule request submitted! Our team will contact you shortly.')
      setRescheduleBookingId(null)
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
    },
    onError: () => {
      toast.error('Failed to submit reschedule request')
    },
  })

  const leaveWaitlistMutation = useMutation({
    mutationFn: leaveWaitlist,
    onSuccess: () => {
      toast.success('Removed from waitlist')
      queryClient.invalidateQueries({ queryKey: ['waitlist'] })
    },
    onError: () => {
      toast.error('Failed to leave waitlist')
    },
  })

  const handleCancel = (bookingId: string, className: string) => {
    if (confirm(`Are you sure you want to cancel your booking for ${className}?`)) {
      cancelMutation.mutate(bookingId)
    }
  }

  const handleRescheduleRequest = () => {
    if (rescheduleBookingId) {
      rescheduleMutation.mutate(rescheduleBookingId)
    }
  }

  const handleLeaveWaitlist = (waitlistId: string, className: string) => {
    if (confirm(`Leave waitlist for ${className}?`)) {
      leaveWaitlistMutation.mutate(waitlistId)
    }
  }

  const upcomingBookings = bookings?.filter(b => b.status === 'confirmed') || []
  const pastBookings = bookings?.filter(b => b.status === 'completed' || b.status === 'cancelled') || []

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-semibold text-foreground">
          My Bookings
        </h1>
        <p className="mt-2 text-muted-foreground">
          Manage your upcoming and past class bookings
        </p>
      </div>

      {/* Upcoming Bookings */}
      <div className="p-6 bg-white rounded-xl border border-border">
        <h2 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <CalendarCheck className="h-5 w-5 text-sage-600" />
          Upcoming Classes
        </h2>
        {upcomingBookings.length > 0 ? (
          <div className="space-y-4">
            {upcomingBookings.map((booking) => (
              <div
                key={booking.id}
                className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg bg-taupe-50"
              >
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center gap-1 text-center min-w-[60px]">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{booking.startTime.slice(0, 5)}</span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{booking.className}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(booking.date)}
                    </p>
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {booking.instructorName}
                      </span>
                      {booking.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {booking.location}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4 md:mt-0">
                  <button
                    onClick={() => setRescheduleBookingId(booking.id)}
                    disabled={rescheduleMutation.isPending}
                    className="px-4 py-2 text-sm text-blush-600 hover:bg-blush-50 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-1"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Reschedule
                  </button>
                  <button
                    onClick={() => handleCancel(booking.id, booking.className)}
                    disabled={cancelMutation.isPending}
                    className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center py-8 text-muted-foreground">
            No upcoming bookings
          </p>
        )}
      </div>

      {/* Waitlist */}
      {(waitlistEntries && waitlistEntries.length > 0) && (
        <div className="p-6 bg-white rounded-xl border border-border">
          <h2 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Users className="h-5 w-5 text-amber-600" />
            Waitlist
          </h2>
          <div className="space-y-4">
            {waitlistEntries.map((entry) => (
              <div
                key={entry.id}
                className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg bg-amber-50"
              >
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center gap-1 text-center min-w-[60px]">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{entry.startTime.slice(0, 5)}</span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{entry.className}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(entry.date)}
                    </p>
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {entry.instructorName}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-4 md:mt-0">
                  <span className="px-3 py-1 text-xs rounded-full bg-amber-100 text-amber-700">
                    Position #{entry.position}
                  </span>
                  <button
                    onClick={() => handleLeaveWaitlist(entry.id, entry.className)}
                    disabled={leaveWaitlistMutation.isPending}
                    className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  >
                    Leave Waitlist
                  </button>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            You'll be automatically booked and notified when a spot opens up.
          </p>
        </div>
      )}

      {/* Past Bookings */}
      <div className="p-6 bg-white rounded-xl border border-border">
        <h2 className="font-display text-lg font-semibold text-foreground mb-4">
          Past Classes
        </h2>
        {pastBookings.length > 0 ? (
          <div className="space-y-4">
            {pastBookings.map((booking) => (
              <div
                key={booking.id}
                className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg bg-taupe-50/50"
              >
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center gap-1 text-center min-w-[60px]">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{booking.startTime.slice(0, 5)}</span>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">{booking.className}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(booking.date)} - {booking.instructorName}
                    </p>
                  </div>
                </div>
                <span className={`mt-4 md:mt-0 px-3 py-1 text-xs rounded-full ${
                  booking.status === 'completed'
                    ? 'bg-sage-100 text-sage-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {booking.status === 'completed' ? 'Completed' : 'Cancelled'}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center py-8 text-muted-foreground">
            No past bookings
          </p>
        )}
      </div>

      {/* Reschedule Confirmation Modal */}
      {rescheduleBookingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setRescheduleBookingId(null)}
          />
          <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <button
              onClick={() => setRescheduleBookingId(null)}
              className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground hover:bg-taupe-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="text-center mb-6">
              <div className="w-12 h-12 mx-auto bg-blush-100 rounded-full flex items-center justify-center mb-4">
                <RefreshCw className="h-6 w-6 text-blush-600" />
              </div>
              <h2 className="font-display text-xl font-semibold text-foreground">
                Request Reschedule
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Submit a reschedule request and our team will contact you to arrange a new time for your class.
              </p>
            </div>

            {(() => {
              const booking = upcomingBookings.find(b => b.id === rescheduleBookingId)
              if (!booking) return null
              return (
                <div className="p-4 bg-taupe-50 rounded-lg mb-6">
                  <p className="font-medium text-foreground">{booking.className}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {formatDate(booking.date)} at {booking.startTime.slice(0, 5)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    with {booking.instructorName}
                  </p>
                </div>
              )
            })()}

            <div className="flex gap-3">
              <button
                onClick={() => setRescheduleBookingId(null)}
                className="flex-1 px-4 py-2 text-sm font-medium text-foreground bg-taupe-100 hover:bg-taupe-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRescheduleRequest}
                disabled={rescheduleMutation.isPending}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blush-500 hover:bg-blush-600 rounded-lg transition-colors disabled:opacity-50"
              >
                {rescheduleMutation.isPending ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
