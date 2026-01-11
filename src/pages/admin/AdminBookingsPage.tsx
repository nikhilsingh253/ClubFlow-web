import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Search,
  Filter,
  Plus,
  Calendar,
  Clock,
  User,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { getBookings, cancelBooking } from '@/api/admin'
import type { AdminBookingListItem, AdminBookingStatus } from '@/types/admin'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { cn } from '@/lib/utils'

const STATUS_OPTIONS: { value: AdminBookingStatus | ''; label: string }[] = [
  { value: '', label: 'All Status' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'attended', label: 'Attended' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'no_show', label: 'No Show' },
]

export default function AdminBookingsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<AdminBookingStatus | ''>('')
  const [dateFilter, setDateFilter] = useState('')
  const [page, setPage] = useState(1)
  const [selectedBooking, setSelectedBooking] = useState<AdminBookingListItem | null>(null)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'bookings', { search, status: statusFilter, date: dateFilter, page }],
    queryFn: () =>
      getBookings({
        search: search || undefined,
        status: statusFilter || undefined,
        date: dateFilter || undefined,
        page,
        pageSize: 20,
      }),
  })

  const cancelMutation = useMutation({
    mutationFn: (id: number) => cancelBooking(id, { reason: 'Cancelled by staff', restoreCredit: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'bookings'] })
      toast.success('Booking cancelled')
      setShowCancelModal(false)
      setSelectedBooking(null)
    },
    onError: () => {
      toast.error('Failed to cancel booking')
    },
  })

  const getStatusBadge = (status: AdminBookingStatus) => {
    switch (status) {
      case 'confirmed':
        return 'bg-blue-100 text-blue-700'
      case 'attended':
        return 'bg-emerald-100 text-emerald-700'
      case 'cancelled':
        return 'bg-gray-100 text-gray-600'
      case 'no_show':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  const getStatusIcon = (status: AdminBookingStatus) => {
    switch (status) {
      case 'confirmed':
        return <Calendar className="h-4 w-4" />
      case 'attended':
        return <CheckCircle className="h-4 w-4" />
      case 'cancelled':
        return <XCircle className="h-4 w-4" />
      case 'no_show':
        return <AlertCircle className="h-4 w-4" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-semibold text-gray-900">Bookings</h1>
          <p className="text-gray-500 mt-1">Manage class bookings</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blush-600 text-white font-medium rounded-lg hover:bg-blush-700 transition-colors">
          <Plus className="h-4 w-4" />
          New Booking
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by member name or phone..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blush-400 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as AdminBookingStatus | '')}
              className="px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blush-400"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blush-400"
            />
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner />
          </div>
        ) : !data?.results?.length ? (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No bookings found</h3>
            <p className="text-gray-500">Try adjusting your filters</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">
                      Member
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Class</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">
                      Date & Time
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">
                      Status
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Type</th>
                    <th className="text-right px-4 py-3 text-sm font-medium text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.results.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blush-100 flex items-center justify-center">
                            <User className="h-5 w-5 text-blush-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {booking.customer.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {booking.customer.cardNumber}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-medium text-gray-900">
                          {booking.classSchedule.classType}
                        </div>
                        <div className="text-sm text-gray-500">{booking.classSchedule.trainer}</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2 text-gray-900">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          {new Date(booking.classSchedule.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                          <Clock className="h-4 w-4 text-gray-400" />
                          {booking.classSchedule.startTime}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={cn(
                            'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-medium capitalize',
                            getStatusBadge(booking.status)
                          )}
                        >
                          {getStatusIcon(booking.status)}
                          {booking.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          {booking.isTrial && (
                            <span className="px-2 py-0.5 text-xs font-medium bg-violet-100 text-violet-700 rounded-full">
                              Trial
                            </span>
                          )}
                          {booking.isComp && (
                            <span className="px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-700 rounded-full">
                              Comp
                            </span>
                          )}
                          {!booking.isTrial && !booking.isComp && (
                            <span className="text-gray-400 text-sm">Regular</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <button
                          onClick={() => setSelectedBooking(booking)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <MoreHorizontal className="h-5 w-5 text-gray-400" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {data.count > 20 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  Showing {data.results.length} of {data.count} bookings
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={!data.previous}
                    className="px-3 py-1 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage((p) => p + 1)}
                    disabled={!data.next}
                    className="px-3 py-1 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Booking Actions Modal */}
      {selectedBooking && !showCancelModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setSelectedBooking(null)}
        >
          <div
            className="bg-white rounded-xl shadow-xl max-w-sm w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Booking Actions</h3>
              <p className="text-sm text-gray-500 mt-1">
                {selectedBooking.customer.name} - {selectedBooking.classSchedule.classType}
              </p>
            </div>
            <div className="p-2">
              <button className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
                <span className="font-medium text-gray-900">Mark as Attended</span>
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                <AlertCircle className="h-5 w-5 text-amber-600" />
                <span className="font-medium text-gray-900">Mark as No Show</span>
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                <Calendar className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-gray-900">Move to Different Class</span>
              </button>
              {selectedBooking.status === 'confirmed' && (
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-red-50 rounded-lg transition-colors"
                >
                  <XCircle className="h-5 w-5 text-red-600" />
                  <span className="font-medium text-red-600">Cancel Booking</span>
                </button>
              )}
            </div>
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={() => setSelectedBooking(null)}
                className="w-full px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {showCancelModal && selectedBooking && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => {
            setShowCancelModal(false)
            setSelectedBooking(null)
          }}
        >
          <div
            className="bg-white rounded-xl shadow-xl max-w-sm w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 text-center">Cancel Booking?</h3>
              <p className="text-gray-500 text-center mt-2">
                This will cancel the booking for {selectedBooking.customer.name} and restore their
                class credit.
              </p>
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => {
                    setShowCancelModal(false)
                    setSelectedBooking(null)
                  }}
                  className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Keep Booking
                </button>
                <button
                  onClick={() => cancelMutation.mutate(selectedBooking.id)}
                  disabled={cancelMutation.isPending}
                  className="flex-1 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {cancelMutation.isPending ? 'Cancelling...' : 'Cancel Booking'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
