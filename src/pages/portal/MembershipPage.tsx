import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { CreditCard, Check, Calendar, AlertCircle, Pause, XCircle, X, Clock } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import toast from 'react-hot-toast'
import { useAuthStore } from '@/store/authStore'
import { getCurrentMembership, getMembershipRequests, submitFreezeRequest, submitCancelRequest } from '@/api/membership'
import { formatDate } from '@/lib/utils'
import { ROUTES } from '@/lib/constants'
import LoadingSpinner from '@/components/common/LoadingSpinner'

type ModalType = 'freeze' | 'cancel' | null

export default function MembershipPage() {
  const queryClient = useQueryClient()
  const { user } = useAuthStore()
  const [modalType, setModalType] = useState<ModalType>(null)
  const [reason, setReason] = useState('')
  const [freezeStartDate, setFreezeStartDate] = useState('')
  const [freezeEndDate, setFreezeEndDate] = useState('')

  const { data: membership, isLoading } = useQuery({
    queryKey: ['membership'],
    queryFn: getCurrentMembership,
  })

  const { data: requests } = useQuery({
    queryKey: ['membershipRequests'],
    queryFn: getMembershipRequests,
    enabled: !!membership,
  })

  const freezeMutation = useMutation({
    mutationFn: submitFreezeRequest,
    onSuccess: () => {
      toast.success('Freeze request submitted. We\'ll review it shortly.')
      setModalType(null)
      setReason('')
      setFreezeStartDate('')
      setFreezeEndDate('')
      queryClient.invalidateQueries({ queryKey: ['membershipRequests'] })
    },
    onError: (error: Error & { response?: { data?: { detail?: string } } }) => {
      const message = error.response?.data?.detail || 'Failed to submit freeze request'
      toast.error(message)
    },
  })

  const cancelMutation = useMutation({
    mutationFn: submitCancelRequest,
    onSuccess: () => {
      toast.success('Cancellation request submitted. We\'ll contact you shortly.')
      setModalType(null)
      setReason('')
      queryClient.invalidateQueries({ queryKey: ['membershipRequests'] })
    },
    onError: (error: Error & { response?: { data?: { detail?: string } } }) => {
      const message = error.response?.data?.detail || 'Failed to submit cancellation request'
      toast.error(message)
    },
  })

  const handleSubmitRequest = () => {
    if (!reason.trim()) {
      toast.error('Please provide a reason')
      return
    }

    if (modalType === 'freeze') {
      freezeMutation.mutate({
        reason,
        freezeStartDate: freezeStartDate || undefined,
        freezeEndDate: freezeEndDate || undefined,
      })
    } else if (modalType === 'cancel') {
      cancelMutation.mutate({ reason })
    }
  }

  const pendingRequests = requests?.filter(r => r.status === 'pending') || []
  const hasPendingFreeze = pendingRequests.some(r => r.requestType === 'freeze')
  const hasPendingCancel = pendingRequests.some(r => r.requestType === 'cancel')

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!membership) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-semibold text-foreground">
            My Membership
          </h1>
          <p className="mt-2 text-muted-foreground">
            View and manage your membership details
          </p>
        </div>

        <div className="p-12 bg-white rounded-xl border border-border text-center">
          <AlertCircle className="h-16 w-16 text-taupe-300 mx-auto mb-4" />
          <h2 className="font-display text-xl font-semibold text-foreground">
            No Active Membership
          </h2>
          <p className="mt-2 text-muted-foreground max-w-md mx-auto">
            You don't have an active membership yet. Contact us to discuss membership options
            or visit our studio to sign up.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Link to={ROUTES.CONTACT} className="btn-elegant-primary">
              Contact Us
            </Link>
            <Link to={ROUTES.PRICING} className="btn-elegant-outline">
              View Plans
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-semibold text-foreground">
          My Membership
        </h1>
        <p className="mt-2 text-muted-foreground">
          View and manage your membership details
        </p>
      </div>

      {/* Pending Requests Banner */}
      {pendingRequests.length > 0 && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-amber-800">Pending Requests</p>
              <ul className="mt-1 text-sm text-amber-700 space-y-1">
                {pendingRequests.map(req => (
                  <li key={req.id}>
                    {req.requestType === 'freeze' ? 'Freeze' : 'Cancellation'} request submitted on {formatDate(req.createdAt)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Membership Card with QR Code */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Card */}
        <div className="lg:col-span-2 p-8 bg-gradient-to-br from-blush-400 to-rosegold rounded-2xl text-white">
          <div className="flex justify-between items-start mb-8">
            <div>
              <p className="text-sm opacity-90">{membership.planName} Member</p>
              <p className="font-display text-2xl font-semibold mt-1">
                {user?.fullName || 'Member'}
              </p>
            </div>
            <div className="p-2 bg-white rounded-lg">
              <QRCodeSVG
                value={membership.cardNumber}
                size={64}
                level="H"
                includeMargin={false}
              />
            </div>
          </div>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-sm opacity-75">Member ID</p>
              <p className="font-mono text-lg">{membership.cardNumber}</p>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-75">Valid Until</p>
              <p className="font-semibold">{formatDate(membership.endDate)}</p>
            </div>
          </div>
        </div>

        {/* QR Code Card */}
        <div className="p-6 bg-white rounded-2xl border border-border flex flex-col items-center justify-center text-center">
          <p className="text-sm font-medium text-foreground mb-4">Scan at Check-in</p>
          <div className="p-4 bg-taupe-50 rounded-xl">
            <QRCodeSVG
              value={membership.cardNumber}
              size={160}
              level="H"
              includeMargin={true}
            />
          </div>
          <p className="mt-4 text-xs text-muted-foreground font-mono">
            {membership.cardNumber}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Show this QR code at the studio front desk
          </p>
        </div>
      </div>

      {/* Membership Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white rounded-xl border border-border">
          <h2 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-blush-600" />
            Plan Details
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Plan</span>
              <span className="font-medium">{membership.planName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Classes/Month</span>
              <span className="font-medium">{membership.classesPerMonth} classes</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status</span>
              <span className={`px-2 py-1 text-xs rounded capitalize ${
                membership.status === 'active'
                  ? 'bg-sage-100 text-sage-700'
                  : membership.status === 'frozen'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-red-100 text-red-700'
              }`}>
                {membership.status}
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white rounded-xl border border-border">
          <h2 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-sage-600" />
            Usage This Month
          </h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Classes Used</span>
                <span className="font-medium">{membership.classesUsed} / {membership.classesPerMonth}</span>
              </div>
              <div className="h-2 bg-taupe-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blush-400 rounded-full transition-all"
                  style={{ width: `${(membership.classesUsed / membership.classesPerMonth) * 100}%` }}
                />
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Classes Remaining</span>
              <span className="font-medium text-sage-600">{membership.classesRemaining}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Auto-Renew</span>
              <span className={`font-medium ${membership.autoRenew ? 'text-sage-600' : 'text-muted-foreground'}`}>
                {membership.autoRenew ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Plan Features */}
      <div className="p-6 bg-white rounded-xl border border-border">
        <h2 className="font-display text-lg font-semibold text-foreground mb-4">
          Your Plan Includes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            `${membership.classesPerMonth} classes per month`,
            'Access to all class levels',
            'Priority booking',
            'Free guest pass (1/month)',
            'Locker included',
            '10% off retail',
          ].map((feature, index) => (
            <div key={index} className="flex items-center gap-3">
              <Check className="h-5 w-5 text-sage-500" />
              <span className="text-muted-foreground">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Membership Actions */}
      {membership.status === 'active' && (
        <div className="p-6 bg-white rounded-xl border border-border">
          <h2 className="font-display text-lg font-semibold text-foreground mb-4">
            Membership Actions
          </h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setModalType('freeze')}
              disabled={hasPendingFreeze}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Pause className="h-4 w-4" />
              {hasPendingFreeze ? 'Freeze Request Pending' : 'Request Freeze'}
            </button>
            <button
              onClick={() => setModalType('cancel')}
              disabled={hasPendingCancel}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <XCircle className="h-4 w-4" />
              {hasPendingCancel ? 'Cancel Request Pending' : 'Request Cancellation'}
            </button>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Freeze or cancellation requests are reviewed by our team and typically processed within 24-48 hours.
          </p>
        </div>
      )}

      {/* Request Modal */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setModalType(null)}
          />
          <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <button
              onClick={() => setModalType(null)}
              className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground hover:bg-taupe-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mb-6">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
                modalType === 'freeze' ? 'bg-blue-100' : 'bg-red-100'
              }`}>
                {modalType === 'freeze' ? (
                  <Pause className="h-6 w-6 text-blue-600" />
                ) : (
                  <XCircle className="h-6 w-6 text-red-600" />
                )}
              </div>
              <h2 className="font-display text-xl font-semibold text-foreground">
                {modalType === 'freeze' ? 'Request Membership Freeze' : 'Request Cancellation'}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {modalType === 'freeze'
                  ? 'Temporarily pause your membership. Your remaining classes will be preserved.'
                  : 'Request to cancel your membership. Our team will review your request.'}
              </p>
            </div>

            <div className="space-y-4">
              {modalType === 'freeze' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Start Date (optional)
                    </label>
                    <input
                      type="date"
                      value={freezeStartDate}
                      onChange={(e) => setFreezeStartDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-blush-400 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      End Date (optional)
                    </label>
                    <input
                      type="date"
                      value={freezeEndDate}
                      onChange={(e) => setFreezeEndDate(e.target.value)}
                      min={freezeStartDate || new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-blush-400 focus:border-transparent"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Reason <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-blush-400 focus:border-transparent resize-none"
                  placeholder={modalType === 'freeze'
                    ? 'e.g., Traveling for work, medical reasons, etc.'
                    : 'Please let us know why you\'re cancelling...'}
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setModalType(null)}
                className="flex-1 px-4 py-2 text-sm font-medium text-foreground bg-taupe-100 hover:bg-taupe-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitRequest}
                disabled={freezeMutation.isPending || cancelMutation.isPending}
                className={`flex-1 px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors disabled:opacity-50 ${
                  modalType === 'freeze'
                    ? 'bg-blue-500 hover:bg-blue-600'
                    : 'bg-red-500 hover:bg-red-600'
                }`}
              >
                {freezeMutation.isPending || cancelMutation.isPending
                  ? 'Submitting...'
                  : 'Submit Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
