import { useState, useRef, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  QrCode,
  Search,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  CreditCard,
  Camera,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { checkInLookup, confirmCheckIn } from '@/api/admin'
import type { CheckInLookupResult } from '@/types/admin'
import { cn } from '@/lib/utils'

export default function AdminCheckInPage() {
  const [searchInput, setSearchInput] = useState('')
  const [lookupResult, setLookupResult] = useState<CheckInLookupResult | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [showScanner, setShowScanner] = useState(false)
  const queryClient = useQueryClient()
  const inputRef = useRef<HTMLInputElement>(null)

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchInput.trim()) return

    setIsSearching(true)
    try {
      const result = await checkInLookup(searchInput.trim())
      setLookupResult(result)
    } catch {
      toast.error('Customer not found')
      setLookupResult(null)
    } finally {
      setIsSearching(false)
    }
  }

  const checkInMutation = useMutation({
    mutationFn: confirmCheckIn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] })
      toast.success('Check-in successful!')
      setLookupResult(null)
      setSearchInput('')
      inputRef.current?.focus()
    },
    onError: () => {
      toast.error('Failed to check in')
    },
  })

  const handleReset = () => {
    setLookupResult(null)
    setSearchInput('')
    inputRef.current?.focus()
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'check_in':
        return <CheckCircle className="h-8 w-8 text-emerald-600" />
      case 'already_checked_in':
        return <CheckCircle className="h-8 w-8 text-blue-600" />
      case 'no_booking':
        return <Calendar className="h-8 w-8 text-amber-600" />
      case 'membership_expired':
        return <AlertCircle className="h-8 w-8 text-red-600" />
      case 'not_found':
        return <XCircle className="h-8 w-8 text-gray-600" />
      default:
        return <User className="h-8 w-8 text-gray-600" />
    }
  }

  const getActionMessage = (action: string) => {
    switch (action) {
      case 'check_in':
        return { text: 'Ready to check in', color: 'text-emerald-600' }
      case 'already_checked_in':
        return { text: 'Already checked in', color: 'text-blue-600' }
      case 'no_booking':
        return { text: 'No booking for today', color: 'text-amber-600' }
      case 'membership_expired':
        return { text: 'Membership expired', color: 'text-red-600' }
      case 'not_found':
        return { text: 'Customer not found', color: 'text-gray-600' }
      default:
        return { text: 'Unknown status', color: 'text-gray-600' }
    }
  }

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

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-display font-semibold text-gray-900">Member Check-in</h1>
        <p className="text-gray-500 mt-1">Scan QR code or search by name/phone</p>
      </div>

      {/* Search Input */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Enter card number, phone, or email..."
              className="w-full pl-12 pr-4 py-4 text-lg rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blush-400 focus:border-transparent"
            />
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isSearching || !searchInput.trim()}
              className="flex-1 py-3 px-4 bg-blush-600 text-white font-medium rounded-xl hover:bg-blush-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSearching ? 'Searching...' : 'Search'}
            </button>
            <button
              type="button"
              onClick={() => setShowScanner(!showScanner)}
              className="px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <Camera className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </form>

        {/* QR Scanner placeholder */}
        {showScanner && (
          <div className="mt-4 p-8 bg-gray-50 rounded-xl text-center">
            <QrCode className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">QR Scanner coming soon</p>
            <p className="text-sm text-gray-400 mt-1">For now, use manual search</p>
          </div>
        )}
      </div>

      {/* Lookup Result */}
      {lookupResult && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {/* Customer Header */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-blush-100 flex items-center justify-center">
                {lookupResult.customer.photoUrl ? (
                  <img
                    src={lookupResult.customer.photoUrl}
                    alt={lookupResult.customer.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <User className="h-8 w-8 text-blush-600" />
                )}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {lookupResult.customer.name}
                </h2>
                <p className="text-sm text-gray-500">{lookupResult.customer.cardNumber}</p>
              </div>
            </div>
          </div>

          {/* Membership Status */}
          <div className="p-6 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-gray-400" />
                <span className="font-medium text-gray-900">
                  {lookupResult.membership.plan || 'No membership'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    'px-3 py-1 text-sm font-medium rounded-full capitalize',
                    getMembershipBadge(lookupResult.membership.status)
                  )}
                >
                  {lookupResult.membership.status}
                </span>
                {lookupResult.membership.classesRemaining !== null && (
                  <span className="text-sm text-gray-500">
                    {lookupResult.membership.classesRemaining} classes left
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Today's Booking */}
          {lookupResult.todayBooking && (
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-3 text-gray-900">
                <Calendar className="h-5 w-5 text-violet-600" />
                <div>
                  <p className="font-medium">
                    {lookupResult.todayBooking.classSchedule.classType}
                  </p>
                  <p className="text-sm text-gray-500">
                    {lookupResult.todayBooking.classSchedule.startTime}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Status */}
          <div className="p-6">
            <div className="flex items-center gap-4 mb-6">
              {getActionIcon(lookupResult.actionAvailable)}
              <span className={cn('text-lg font-medium', getActionMessage(lookupResult.actionAvailable).color)}>
                {getActionMessage(lookupResult.actionAvailable).text}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              {lookupResult.actionAvailable === 'check_in' && lookupResult.todayBooking && (
                <button
                  onClick={() => checkInMutation.mutate(lookupResult.todayBooking!.id)}
                  disabled={checkInMutation.isPending}
                  className="flex-1 py-3 px-4 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50"
                >
                  {checkInMutation.isPending ? 'Checking in...' : 'Check In'}
                </button>
              )}

              {lookupResult.actionAvailable === 'no_booking' && (
                <div className="flex-1">
                  <p className="text-sm text-gray-500 mb-3">
                    This member doesn't have a booking for today. Would you like to create a walk-in
                    booking?
                  </p>
                  <button
                    onClick={() => toast.success('Walk-in booking flow - coming soon')}
                    className="w-full py-3 px-4 bg-amber-600 text-white font-medium rounded-xl hover:bg-amber-700 transition-colors"
                  >
                    Create Walk-in Booking
                  </button>
                </div>
              )}

              {lookupResult.actionAvailable === 'membership_expired' && (
                <div className="flex-1">
                  <p className="text-sm text-red-600 mb-3">
                    This member's membership has expired. Please renew before booking.
                  </p>
                  <button
                    onClick={() => toast.success('Navigate to membership renewal - coming soon')}
                    className="w-full py-3 px-4 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-colors"
                  >
                    Renew Membership
                  </button>
                </div>
              )}

              {lookupResult.actionAvailable === 'already_checked_in' && (
                <div className="flex-1 text-center">
                  <p className="text-blue-600">
                    This member has already checked in for their class today.
                  </p>
                </div>
              )}

              <button
                onClick={handleReset}
                className="px-4 py-3 border border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-colors"
              >
                New Search
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Tips */}
      {!lookupResult && !isSearching && (
        <div className="bg-blue-50 rounded-xl p-4">
          <h3 className="font-medium text-blue-900 mb-2">Quick Tips</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Enter card number (e.g., CF-0001) for fastest lookup</li>
            <li>• You can also search by phone number or email</li>
            <li>• Use the camera icon to scan a member's QR code</li>
          </ul>
        </div>
      )}
    </div>
  )
}
