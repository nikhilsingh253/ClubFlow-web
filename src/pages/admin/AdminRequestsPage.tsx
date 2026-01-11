import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Filter,
  FileText,
  User,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Snowflake,
  Ban,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { getMembershipRequests, approveMembershipRequest, denyMembershipRequest } from '@/api/admin'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { cn } from '@/lib/utils'

type RequestStatus = 'pending' | 'approved' | 'denied'

const STATUS_OPTIONS: { value: RequestStatus | ''; label: string }[] = [
  { value: '', label: 'All Status' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'denied', label: 'Denied' },
]

export default function AdminRequestsPage() {
  const [statusFilter, setStatusFilter] = useState<RequestStatus | ''>('')
  const [selectedRequest, setSelectedRequest] = useState<number | null>(null)
  const [denyReason, setDenyReason] = useState('')
  const [showDenyModal, setShowDenyModal] = useState(false)
  const queryClient = useQueryClient()

  const { data: requests, isLoading } = useQuery({
    queryKey: ['admin', 'membership-requests', { status: statusFilter }],
    queryFn: () =>
      getMembershipRequests({
        status: statusFilter || undefined,
      }),
  })

  const approveMutation = useMutation({
    mutationFn: approveMembershipRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'membership-requests'] })
      toast.success('Request approved')
      setSelectedRequest(null)
    },
    onError: () => {
      toast.error('Failed to approve request')
    },
  })

  const denyMutation = useMutation({
    mutationFn: ({ id, reason }: { id: number; reason: string }) =>
      denyMembershipRequest(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'membership-requests'] })
      toast.success('Request denied')
      setShowDenyModal(false)
      setSelectedRequest(null)
      setDenyReason('')
    },
    onError: () => {
      toast.error('Failed to deny request')
    },
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-100 text-amber-700'
      case 'approved':
        return 'bg-emerald-100 text-emerald-700'
      case 'denied':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  const getRequestTypeIcon = (type: string) => {
    switch (type) {
      case 'freeze':
        return <Snowflake className="h-5 w-5 text-blue-600" />
      case 'cancel':
        return <Ban className="h-5 w-5 text-red-600" />
      default:
        return <FileText className="h-5 w-5 text-gray-600" />
    }
  }

  const pendingCount = requests?.results?.filter((r) => r.status === 'pending').length || 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-semibold text-gray-900">Membership Requests</h1>
          <p className="text-gray-500 mt-1">Review freeze and cancellation requests</p>
        </div>
        {pendingCount > 0 && (
          <div className="px-4 py-2 bg-amber-100 text-amber-700 rounded-lg font-medium">
            {pendingCount} pending request{pendingCount !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <Filter className="h-5 w-5 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as RequestStatus | '')}
            className="px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blush-400"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Requests List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner />
          </div>
        ) : !requests?.results?.length ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No requests found</h3>
            <p className="text-gray-500">
              {statusFilter ? 'Try adjusting your filter' : 'All caught up!'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {requests.results.map((request) => (
              <div
                key={request.id}
                className={cn(
                  'p-6 hover:bg-gray-50 transition-colors',
                  request.status === 'pending' && 'bg-amber-50/30'
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                      {getRequestTypeIcon(request.requestType)}
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-gray-900 capitalize">
                          {request.requestType} Request
                        </h3>
                        <span
                          className={cn(
                            'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize',
                            getStatusBadge(request.status)
                          )}
                        >
                          {request.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                        <User className="h-4 w-4" />
                        <span>{request.customer.name}</span>
                        <span>•</span>
                        <span>{request.membership.plan}</span>
                      </div>
                      {request.reason && (
                        <p className="mt-2 text-gray-600 text-sm">
                          <span className="font-medium">Reason:</span> {request.reason}
                        </p>
                      )}
                      {request.requestType === 'freeze' && request.freezeStart && (
                        <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>
                              From:{' '}
                              {new Date(request.freezeStart).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                              })}
                            </span>
                          </div>
                          {request.freezeEnd && (
                            <div className="flex items-center gap-1">
                              <span>
                                To:{' '}
                                {new Date(request.freezeEnd).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                })}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                      <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                        <Clock className="h-3 w-3" />
                        Submitted{' '}
                        {new Date(request.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                  </div>

                  {request.status === 'pending' && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => approveMutation.mutate(request.id)}
                        disabled={approveMutation.isPending}
                        className="flex items-center gap-1 px-4 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Approve
                      </button>
                      <button
                        onClick={() => {
                          setSelectedRequest(request.id)
                          setShowDenyModal(true)
                        }}
                        className="flex items-center gap-1 px-4 py-2 border border-red-200 text-red-600 font-medium rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <XCircle className="h-4 w-4" />
                        Deny
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Deny Modal */}
      {showDenyModal && selectedRequest && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => {
            setShowDenyModal(false)
            setSelectedRequest(null)
            setDenyReason('')
          }}
        >
          <div
            className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 text-center">Deny Request?</h3>
              <p className="text-gray-500 text-center mt-2 mb-4">
                Please provide a reason for denying this request.
              </p>
              <textarea
                value={denyReason}
                onChange={(e) => setDenyReason(e.target.value)}
                placeholder="Enter reason..."
                rows={3}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blush-400 mb-4"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDenyModal(false)
                    setSelectedRequest(null)
                    setDenyReason('')
                  }}
                  className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() =>
                    denyMutation.mutate({ id: selectedRequest, reason: denyReason.trim() })
                  }
                  disabled={!denyReason.trim() || denyMutation.isPending}
                  className="flex-1 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {denyMutation.isPending ? 'Denying...' : 'Deny Request'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
