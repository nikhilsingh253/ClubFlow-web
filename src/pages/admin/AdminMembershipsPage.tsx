import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Search,
  Filter,
  Plus,
  CreditCard,
  Calendar,
  User,
  AlertTriangle,
  Clock,
} from 'lucide-react'
import { getMemberships } from '@/api/admin'
import type { AdminMembershipStatus } from '@/types/admin'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { cn } from '@/lib/utils'

const STATUS_OPTIONS: { value: AdminMembershipStatus | ''; label: string }[] = [
  { value: '', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'expired', label: 'Expired' },
  { value: 'frozen', label: 'Frozen' },
  { value: 'cancelled', label: 'Cancelled' },
]

export default function AdminMembershipsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<AdminMembershipStatus | ''>('')
  const [expiringFilter, setExpiringFilter] = useState(false)
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'memberships', { search, status: statusFilter, expiring: expiringFilter, page }],
    queryFn: () =>
      getMemberships({
        search: search || undefined,
        status: statusFilter || undefined,
        expiringWithinDays: expiringFilter ? 7 : undefined,
        page,
        pageSize: 20,
      }),
  })

  const getStatusBadge = (status: AdminMembershipStatus) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-100 text-emerald-700'
      case 'expired':
        return 'bg-red-100 text-red-700'
      case 'frozen':
        return 'bg-blue-100 text-blue-700'
      case 'cancelled':
        return 'bg-gray-100 text-gray-600'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate)
    const today = new Date()
    const diff = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return diff
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-semibold text-gray-900">Memberships</h1>
          <p className="text-gray-500 mt-1">Manage customer memberships</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blush-600 text-white font-medium rounded-lg hover:bg-blush-700 transition-colors">
          <Plus className="h-4 w-4" />
          Assign Membership
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
              <CreditCard className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900">{statusFilter === 'active' ? data?.count || 0 : '-'}</p>
              <p className="text-sm text-gray-500">Active</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900">{expiringFilter ? data?.count || 0 : '-'}</p>
              <p className="text-sm text-gray-500">Expiring Soon</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900">{statusFilter === 'frozen' ? data?.count || 0 : '-'}</p>
              <p className="text-sm text-gray-500">Frozen</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
              <CreditCard className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900">{statusFilter === 'expired' ? data?.count || 0 : '-'}</p>
              <p className="text-sm text-gray-500">Expired</p>
            </div>
          </div>
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
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as AdminMembershipStatus | '')}
              className="px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blush-400"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <button
              onClick={() => setExpiringFilter(!expiringFilter)}
              className={cn(
                'px-3 py-2 rounded-lg border transition-colors',
                expiringFilter
                  ? 'bg-amber-50 border-amber-200 text-amber-700'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              )}
            >
              <AlertTriangle className="h-4 w-4 inline mr-1" />
              Expiring Soon
            </button>
          </div>
        </div>
      </div>

      {/* Memberships Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner />
          </div>
        ) : !data?.results?.length ? (
          <div className="text-center py-12">
            <CreditCard className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No memberships found</h3>
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
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Plan</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">
                      Status
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">
                      Valid Until
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">
                      Classes
                    </th>
                    <th className="text-right px-4 py-3 text-sm font-medium text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.results.map((membership) => {
                    const daysRemaining = getDaysRemaining(membership.endDate)
                    const isExpiringSoon = daysRemaining > 0 && daysRemaining <= 7

                    return (
                      <tr key={membership.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blush-100 flex items-center justify-center">
                              <User className="h-5 w-5 text-blush-600" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">
                                {membership.customer?.name || 'Unknown'}
                              </div>
                              <div className="text-sm text-gray-500">
                                {membership.customer?.phone}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="font-medium text-gray-900">{membership.plan.name}</div>
                          {membership.plan.price && (
                            <div className="text-sm text-gray-500">
                              ₹{membership.plan.price.toLocaleString()}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={cn(
                              'inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium capitalize',
                              getStatusBadge(membership.status)
                            )}
                          >
                            {membership.status}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-900">
                              {new Date(membership.endDate).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </span>
                          </div>
                          {isExpiringSoon && (
                            <div className="flex items-center gap-1 text-amber-600 text-sm mt-1">
                              <AlertTriangle className="h-3 w-3" />
                              {daysRemaining} days left
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          {membership.classesRemaining !== null ? (
                            <div>
                              <span className="font-medium text-gray-900">
                                {membership.classesRemaining}
                              </span>
                              <span className="text-gray-500">
                                {' '}
                                / {membership.classesTotal}
                              </span>
                            </div>
                          ) : (
                            <span className="text-gray-500">Unlimited</span>
                          )}
                        </td>
                        <td className="px-4 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button className="px-3 py-1.5 text-sm font-medium text-blush-600 hover:bg-blush-50 rounded-lg transition-colors">
                              Extend
                            </button>
                            {membership.status === 'active' && (
                              <button className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                Freeze
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {data.count > 20 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  Showing {data.results.length} of {data.count} memberships
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
    </div>
  )
}
