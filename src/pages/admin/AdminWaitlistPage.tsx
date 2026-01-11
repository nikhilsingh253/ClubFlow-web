import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Search,
  Clock,
  User,
  Calendar,
  Phone,
  CheckCircle,
  XCircle,
  Bell,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { getWaitlistEntries, promoteFromWaitlist, removeFromWaitlist } from '@/api/admin'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { cn } from '@/lib/utils'

export default function AdminWaitlistPage() {
  const [search, setSearch] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const queryClient = useQueryClient()

  const { data: waitlistData, isLoading } = useQuery({
    queryKey: ['admin', 'waitlist', { date: dateFilter }],
    queryFn: () => getWaitlistEntries(),
  })

  // Filter locally by search since API doesn't support it
  const waitlist = waitlistData?.results?.filter((entry) =>
    search ? entry.customer.name.toLowerCase().includes(search.toLowerCase()) : true
  )

  const processMutation = useMutation({
    mutationFn: promoteFromWaitlist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'waitlist'] })
      toast.success('Customer has been booked into the class')
    },
    onError: () => {
      toast.error('Failed to process waitlist entry')
    },
  })

  const removeMutation = useMutation({
    mutationFn: removeFromWaitlist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'waitlist'] })
      toast.success('Removed from waitlist')
    },
    onError: () => {
      toast.error('Failed to remove from waitlist')
    },
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'waiting':
        return 'bg-amber-100 text-amber-700'
      case 'notified':
        return 'bg-blue-100 text-blue-700'
      case 'booked':
        return 'bg-emerald-100 text-emerald-700'
      case 'expired':
        return 'bg-gray-100 text-gray-600'
      case 'cancelled':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-semibold text-gray-900">Waitlist</h1>
          <p className="text-gray-500 mt-1">Manage class waitlist entries</p>
        </div>
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
                placeholder="Search by member name..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blush-400 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-gray-400" />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blush-400"
            />
          </div>
        </div>
      </div>

      {/* Waitlist Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner />
          </div>
        ) : !waitlist?.length ? (
          <div className="text-center py-12">
            <Clock className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No waitlist entries</h3>
            <p className="text-gray-500">All clear! No one is waiting for classes.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Position</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Member</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Class</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">
                    Date & Time
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Status</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">
                    Joined At
                  </th>
                  <th className="text-right px-4 py-3 text-sm font-medium text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {waitlist.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div className="w-8 h-8 rounded-full bg-blush-100 flex items-center justify-center">
                        <span className="font-semibold text-blush-600">#{entry.position}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                          <User className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{entry.customer.name}</div>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Phone className="h-3 w-3" />
                            {entry.customer.phone}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-medium text-gray-900">
                        {entry.classSchedule.classType}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        {new Date(entry.classSchedule.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                        <Clock className="h-4 w-4 text-gray-400" />
                        {entry.classSchedule.startTime}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={cn(
                          'inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium capitalize',
                          getStatusBadge(entry.status)
                        )}
                      >
                        {entry.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      {new Date(entry.joinedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {entry.status === 'waiting' && (
                          <>
                            <button
                              onClick={() => processMutation.mutate(entry.id)}
                              disabled={processMutation.isPending}
                              className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                            >
                              <CheckCircle className="h-4 w-4" />
                              Book In
                            </button>
                            <button className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                              <Bell className="h-4 w-4" />
                              Notify
                            </button>
                          </>
                        )}
                        {(entry.status === 'waiting' || entry.status === 'notified') && (
                          <button
                            onClick={() => removeMutation.mutate(entry.id)}
                            disabled={removeMutation.isPending}
                            className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <XCircle className="h-4 w-4" />
                            Remove
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 rounded-xl p-4">
        <h3 className="font-medium text-blue-900 mb-2">How Waitlist Works</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>
            • When a spot opens up in a class, use "Book In" to automatically book the next person
            in line
          </li>
          <li>• Use "Notify" to send an email/SMS letting them know a spot is available</li>
          <li>• Waitlist entries expire 2 hours after notification if not confirmed</li>
          <li>• Members can also be removed manually if they no longer want the spot</li>
        </ul>
      </div>
    </div>
  )
}
