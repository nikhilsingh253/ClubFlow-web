import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import {
  Phone,
  Mail,
  Clock,
  Calendar,
  CheckCircle,
  XCircle,
  MessageSquare,
  ChevronRight,
  User,
  Filter,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { getTrialBookings, updateTrialBooking, markTrialLost } from '@/api/admin'
import type { AdminTrialBooking, TrialBookingStatus, TrialLostReason } from '@/types/admin'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { cn } from '@/lib/utils'

const STATUS_OPTIONS: { value: TrialBookingStatus | ''; label: string }[] = [
  { value: '', label: 'All Status' },
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'completed', label: 'Completed' },
  { value: 'converted', label: 'Converted' },
  { value: 'lost', label: 'Lost' },
]

const LOST_REASONS: { value: TrialLostReason; label: string }[] = [
  { value: 'price_concern', label: 'Price concern' },
  { value: 'timing_issue', label: 'Timing issue' },
  { value: 'not_interested', label: 'Not interested' },
  { value: 'competitor', label: 'Went to competitor' },
  { value: 'no_response', label: 'No response' },
  { value: 'other', label: 'Other' },
]

export default function AdminTrialsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedTrial, setSelectedTrial] = useState<AdminTrialBooking | null>(null)
  const [showLostModal, setShowLostModal] = useState(false)
  const [lostReason, setLostReason] = useState<TrialLostReason>('no_response')
  const queryClient = useQueryClient()

  const status = (searchParams.get('status') as TrialBookingStatus) || ''

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'trials', { status }],
    queryFn: () => getTrialBookings({ status: status || undefined }),
  })

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: TrialBookingStatus }) =>
      updateTrialBooking(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'trials'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] })
      toast.success('Status updated')
    },
    onError: () => {
      toast.error('Failed to update status')
    },
  })

  const markLostMutation = useMutation({
    mutationFn: ({ id, reason }: { id: number; reason: TrialLostReason }) =>
      markTrialLost(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'trials'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] })
      setShowLostModal(false)
      setSelectedTrial(null)
      toast.success('Marked as lost')
    },
    onError: () => {
      toast.error('Failed to update status')
    },
  })

  const handleStatusFilter = (newStatus: string) => {
    setSearchParams((prev) => {
      if (newStatus) {
        prev.set('status', newStatus)
      } else {
        prev.delete('status')
      }
      return prev
    })
  }

  const getStatusBadge = (status: TrialBookingStatus) => {
    switch (status) {
      case 'new':
        return 'bg-amber-100 text-amber-700'
      case 'contacted':
        return 'bg-blue-100 text-blue-700'
      case 'scheduled':
        return 'bg-violet-100 text-violet-700'
      case 'completed':
        return 'bg-emerald-100 text-emerald-700'
      case 'converted':
        return 'bg-green-100 text-green-700'
      case 'lost':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  const getNextStatus = (current: TrialBookingStatus): TrialBookingStatus | null => {
    switch (current) {
      case 'new':
        return 'contacted'
      case 'contacted':
        return 'scheduled'
      case 'scheduled':
        return 'completed'
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-semibold text-gray-900">Trial Bookings</h1>
          <p className="text-gray-500 mt-1">Manage trial class requests</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-gray-400" />
          <select
            value={status}
            onChange={(e) => handleStatusFilter(e.target.value)}
            className="px-3 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blush-400 bg-white"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* List */}
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="space-y-4">
          {data?.results.map((trial) => (
            <div
              key={trial.id}
              className="bg-white rounded-xl border border-gray-200 p-5 hover:border-gray-300 transition-colors"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* Customer info */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-blush-100 flex items-center justify-center flex-shrink-0">
                    <User className="h-6 w-6 text-blush-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{trial.name}</h3>
                    <div className="flex flex-wrap items-center gap-4 mt-1 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        {trial.phone}
                      </span>
                      <span className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        {trial.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {trial.preferredTime}
                      </span>
                    </div>
                    {trial.notes && (
                      <p className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
                        <MessageSquare className="h-4 w-4 inline mr-1" />
                        {trial.notes}
                      </p>
                    )}
                    {trial.scheduledClass && (
                      <p className="mt-2 text-sm text-violet-600 bg-violet-50 p-2 rounded-lg">
                        <Calendar className="h-4 w-4 inline mr-1" />
                        Scheduled: {trial.scheduledClass.classType} on{' '}
                        {new Date(trial.scheduledClass.date).toLocaleDateString('en-IN', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })}{' '}
                        at {trial.scheduledClass.startTime}
                      </p>
                    )}
                  </div>
                </div>

                {/* Status and actions */}
                <div className="flex flex-col items-end gap-3">
                  <span
                    className={cn(
                      'px-3 py-1 text-sm font-medium rounded-full capitalize',
                      getStatusBadge(trial.status)
                    )}
                  >
                    {trial.status.replace('_', ' ')}
                  </span>

                  <div className="flex items-center gap-2">
                    {/* Next status button */}
                    {getNextStatus(trial.status) && (
                      <button
                        onClick={() =>
                          updateStatusMutation.mutate({
                            id: trial.id,
                            status: getNextStatus(trial.status)!,
                          })
                        }
                        disabled={updateStatusMutation.isPending}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blush-600 hover:bg-blush-50 rounded-lg transition-colors"
                      >
                        Mark {getNextStatus(trial.status)}
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    )}

                    {/* Convert or Lost for completed */}
                    {trial.status === 'completed' && (
                      <>
                        <button
                          onClick={() => {
                            // Navigate to convert flow
                            toast.success('Convert to member flow - coming soon')
                          }}
                          className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        >
                          <CheckCircle className="h-4 w-4" />
                          Convert
                        </button>
                        <button
                          onClick={() => {
                            setSelectedTrial(trial)
                            setShowLostModal(true)
                          }}
                          className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <XCircle className="h-4 w-4" />
                          Lost
                        </button>
                      </>
                    )}
                  </div>

                  <span className="text-xs text-gray-400">
                    Submitted{' '}
                    {new Date(trial.createdAt).toLocaleDateString('en-IN', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {data?.results.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 bg-white rounded-xl border border-gray-200">
              <User className="h-12 w-12 text-gray-300 mb-4" />
              <p className="text-gray-500">No trial bookings found</p>
            </div>
          )}
        </div>
      )}

      {/* Lost Modal */}
      {showLostModal && selectedTrial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowLostModal(false)} />
          <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Mark as Lost</h2>
            <p className="text-sm text-gray-500 mb-4">
              Why did {selectedTrial.name} not convert to a member?
            </p>
            <select
              value={lostReason}
              onChange={(e) => setLostReason(e.target.value as TrialLostReason)}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blush-400 mb-4"
            >
              {LOST_REASONS.map((reason) => (
                <option key={reason.value} value={reason.value}>
                  {reason.label}
                </option>
              ))}
            </select>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowLostModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  markLostMutation.mutate({ id: selectedTrial.id, reason: lostReason })
                }
                disabled={markLostMutation.isPending}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg disabled:opacity-50"
              >
                {markLostMutation.isPending ? 'Saving...' : 'Mark as Lost'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
