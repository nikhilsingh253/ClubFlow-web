import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  Calendar,
  CreditCard,
  AlertCircle,
  Edit2,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { getCustomerDetail, getCustomerBookings, getCustomerNotes, addCustomerNote } from '@/api/admin'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { cn } from '@/lib/utils'
import { ROUTES } from '@/lib/constants'

type TabType = 'overview' | 'bookings' | 'payments' | 'notes'

export default function AdminCustomerDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const [newNote, setNewNote] = useState('')

  const customerId = parseInt(id || '0')

  const { data: customer, isLoading } = useQuery({
    queryKey: ['admin', 'customer', customerId],
    queryFn: () => getCustomerDetail(customerId),
    enabled: !!customerId,
  })

  const { data: bookings } = useQuery({
    queryKey: ['admin', 'customer', customerId, 'bookings'],
    queryFn: () => getCustomerBookings(customerId),
    enabled: activeTab === 'bookings' && !!customerId,
  })

  const { data: notes } = useQuery({
    queryKey: ['admin', 'customer', customerId, 'notes'],
    queryFn: () => getCustomerNotes(customerId),
    enabled: activeTab === 'notes' && !!customerId,
  })

  const addNoteMutation = useMutation({
    mutationFn: (note: string) => addCustomerNote(customerId, note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'customer', customerId, 'notes'] })
      toast.success('Note added')
      setNewNote('')
    },
    onError: () => {
      toast.error('Failed to add note')
    },
  })

  const getMembershipBadge = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-100 text-emerald-700'
      case 'expired':
        return 'bg-red-100 text-red-700'
      case 'frozen':
        return 'bg-blue-100 text-blue-700'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  const getBookingStatusBadge = (status: string) => {
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    )
  }

  if (!customer) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-1">Customer not found</h3>
        <button
          onClick={() => navigate(ROUTES.ADMIN_CUSTOMERS)}
          className="text-blush-600 hover:text-blush-700 font-medium mt-2"
        >
          Go back to customers
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(ROUTES.ADMIN_CUSTOMERS)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-display font-semibold text-gray-900">{customer.name}</h1>
          <p className="text-gray-500">{customer.cardNumber}</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-600 font-medium rounded-lg hover:bg-gray-50 transition-colors">
          <Edit2 className="h-4 w-4" />
          Edit
        </button>
      </div>

      {/* Customer Header Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-start gap-6">
          <div className="w-20 h-20 rounded-full bg-blush-100 flex items-center justify-center">
            <User className="h-10 w-10 text-blush-600" />
          </div>
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                <Phone className="h-4 w-4" />
                Phone
              </div>
              <p className="font-medium text-gray-900">{customer.phone}</p>
            </div>
            <div>
              <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                <Mail className="h-4 w-4" />
                Email
              </div>
              <p className="font-medium text-gray-900">{customer.email}</p>
            </div>
            <div>
              <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                <Calendar className="h-4 w-4" />
                Member Since
              </div>
              <p className="font-medium text-gray-900">
                {new Date(customer.createdAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100">
          <div className="text-center">
            <p className="text-2xl font-semibold text-gray-900">{customer.stats.totalClassesAttended}</p>
            <p className="text-sm text-gray-500">Total Classes</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-semibold text-gray-900">{customer.stats.classesThisMonth}</p>
            <p className="text-sm text-gray-500">This Month</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-semibold text-red-600">{customer.stats.noShows}</p>
            <p className="text-sm text-gray-500">No Shows</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-semibold text-gray-900">{customer.stats.memberSinceDays}</p>
            <p className="text-sm text-gray-500">Days as Member</p>
          </div>
        </div>
      </div>

      {/* Membership Card */}
      {customer.currentMembership && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-gray-400" />
              <h2 className="text-lg font-semibold text-gray-900">Current Membership</h2>
            </div>
            <span
              className={cn(
                'px-3 py-1 text-sm font-medium rounded-full capitalize',
                getMembershipBadge(customer.currentMembership.status)
              )}
            >
              {customer.currentMembership.status}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-gray-500">Plan</p>
              <p className="font-medium text-gray-900">{customer.currentMembership.plan.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Valid Until</p>
              <p className="font-medium text-gray-900">
                {new Date(customer.currentMembership.endDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Classes Remaining</p>
              <p className="font-medium text-gray-900">
                {customer.currentMembership.classesRemaining !== null
                  ? `${customer.currentMembership.classesRemaining} of ${customer.currentMembership.classesTotal}`
                  : 'Unlimited'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Days Remaining</p>
              <p className="font-medium text-gray-900">
                {customer.currentMembership.daysRemaining} days
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          {customer.currentMembership.classesTotal && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-500">Classes Used</span>
                <span className="font-medium text-gray-900">
                  {customer.currentMembership.classesUsed} / {customer.currentMembership.classesTotal}
                </span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blush-500 rounded-full"
                  style={{
                    width: `${(customer.currentMembership.classesUsed / customer.currentMembership.classesTotal) * 100}%`,
                  }}
                />
              </div>
            </div>
          )}

          <div className="flex gap-3 mt-6">
            <button className="px-4 py-2 bg-blush-600 text-white font-medium rounded-lg hover:bg-blush-700 transition-colors">
              Extend Membership
            </button>
            <button className="px-4 py-2 border border-gray-200 text-gray-600 font-medium rounded-lg hover:bg-gray-50 transition-colors">
              Freeze
            </button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex px-4 -mb-px">
            {(['overview', 'bookings', 'payments', 'notes'] as TabType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'px-4 py-3 text-sm font-medium border-b-2 transition-colors capitalize',
                  activeTab === tab
                    ? 'border-blush-500 text-blush-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                )}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Personal Information</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-500">Date of Birth:</span>
                      <span className="ml-2 text-gray-900">
                        {customer.dateOfBirth
                          ? new Date(customer.dateOfBirth).toLocaleDateString()
                          : 'Not set'}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Source:</span>
                      <span className="ml-2 text-gray-900 capitalize">
                        {customer.source?.replace('_', ' ') || 'Unknown'}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Emergency Contact</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-500">Name:</span>
                      <span className="ml-2 text-gray-900">
                        {customer.emergencyContactName || 'Not set'}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Phone:</span>
                      <span className="ml-2 text-gray-900">
                        {customer.emergencyContactPhone || 'Not set'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              {customer.healthNotes && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Health Notes</h3>
                  <p className="text-gray-900 bg-amber-50 p-3 rounded-lg text-sm">
                    <AlertCircle className="h-4 w-4 inline-block text-amber-600 mr-2" />
                    {customer.healthNotes}
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'bookings' && (
            <div>
              {bookings?.results?.length ? (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left pb-3 text-sm font-medium text-gray-500">Class</th>
                      <th className="text-left pb-3 text-sm font-medium text-gray-500">Date</th>
                      <th className="text-left pb-3 text-sm font-medium text-gray-500">Time</th>
                      <th className="text-left pb-3 text-sm font-medium text-gray-500">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {bookings.results.map((booking) => (
                      <tr key={booking.id}>
                        <td className="py-3">
                          <div className="font-medium text-gray-900">
                            {booking.classSchedule.classType}
                          </div>
                          <div className="text-sm text-gray-500">{booking.classSchedule.trainer}</div>
                        </td>
                        <td className="py-3 text-gray-600">
                          {new Date(booking.classSchedule.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </td>
                        <td className="py-3 text-gray-600">{booking.classSchedule.startTime}</td>
                        <td className="py-3">
                          <span
                            className={cn(
                              'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium capitalize',
                              getBookingStatusBadge(booking.status)
                            )}
                          >
                            {booking.status === 'attended' && <CheckCircle className="h-3 w-3" />}
                            {booking.status === 'no_show' && <XCircle className="h-3 w-3" />}
                            {booking.status === 'confirmed' && <Clock className="h-3 w-3" />}
                            {booking.status.replace('_', ' ')}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-500 text-center py-8">No booking history</p>
              )}
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="text-gray-500 text-center py-8">
              <CreditCard className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <p>Payment history will be available soon</p>
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="space-y-4">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add a note..."
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blush-400"
                />
                <button
                  onClick={() => newNote.trim() && addNoteMutation.mutate(newNote.trim())}
                  disabled={!newNote.trim() || addNoteMutation.isPending}
                  className="flex items-center gap-2 px-4 py-2 bg-blush-600 text-white font-medium rounded-lg hover:bg-blush-700 transition-colors disabled:opacity-50"
                >
                  <Plus className="h-4 w-4" />
                  Add Note
                </button>
              </div>

              <div className="space-y-3">
                {notes?.results?.length ? (
                  notes.results.map((note) => (
                    <div key={note.id} className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-900">{note.note}</p>
                      <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                        <span>{note.createdBy.name}</span>
                        <span>•</span>
                        <span>
                          {new Date(note.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No notes yet</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
