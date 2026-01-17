import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Search,
  Filter,
  Plus,
  Receipt,
  Calendar,
  Download,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
} from 'lucide-react'
import { getInvoices } from '@/api/admin'
import type { AdminInvoiceStatus } from '@/types/admin'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { cn } from '@/lib/utils'

const STATUS_OPTIONS: { value: AdminInvoiceStatus | ''; label: string }[] = [
  { value: '', label: 'All Status' },
  { value: 'pending', label: 'Pending' },
  { value: 'paid', label: 'Paid' },
  { value: 'overdue', label: 'Overdue' },
  { value: 'cancelled', label: 'Cancelled' },
]

export default function AdminInvoicesPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<AdminInvoiceStatus | ''>('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'invoices', { search, status: statusFilter, fromDate: dateFrom, toDate: dateTo, page }],
    queryFn: () =>
      getInvoices({
        search: search || undefined,
        status: statusFilter || undefined,
        fromDate: dateFrom || undefined,
        toDate: dateTo || undefined,
        page,
        pageSize: 20,
      }),
  })

  const getStatusBadge = (status: AdminInvoiceStatus) => {
    switch (status) {
      case 'paid':
        return 'bg-emerald-100 text-emerald-700'
      case 'pending':
        return 'bg-amber-100 text-amber-700'
      case 'overdue':
        return 'bg-red-100 text-red-700'
      case 'cancelled':
        return 'bg-gray-100 text-gray-600'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  const getStatusIcon = (status: AdminInvoiceStatus) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="h-4 w-4" />
      case 'pending':
        return <Clock className="h-4 w-4" />
      case 'overdue':
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
          <h1 className="text-2xl font-display font-semibold text-gray-900">Invoices</h1>
          <p className="text-gray-500 mt-1">Manage billing and payments</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blush-600 text-white font-medium rounded-lg hover:bg-blush-700 transition-colors">
          <Plus className="h-4 w-4" />
          Create Invoice
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
              <Receipt className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900">-</p>
              <p className="text-sm text-gray-500">Collected</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900">-</p>
              <p className="text-sm text-gray-500">Outstanding</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900">-</p>
              <p className="text-sm text-gray-500">Overdue</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Receipt className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900">{data?.count || 0}</p>
              <p className="text-sm text-gray-500">Total Invoices</p>
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
                placeholder="Search by invoice # or customer..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blush-400 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as AdminInvoiceStatus | '')}
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
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              placeholder="From"
              className="px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blush-400"
            />
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              placeholder="To"
              className="px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blush-400"
            />
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner />
          </div>
        ) : !data?.results?.length ? (
          <div className="text-center py-12">
            <Receipt className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No invoices found</h3>
            <p className="text-gray-500">Try adjusting your filters</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">
                      Invoice #
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">
                      Customer
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Date</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">
                      Amount
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">
                      Status
                    </th>
                    <th className="text-right px-4 py-3 text-sm font-medium text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.results.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <span className="font-mono font-medium text-gray-900">
                          {invoice.invoiceNumber}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-medium text-gray-900">{invoice.customer.name}</div>
                        {invoice.customer.email && (
                          <div className="text-sm text-gray-500">{invoice.customer.email}</div>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          {new Date(invoice.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </div>
                        {invoice.dueDate && (
                          <div className="text-sm text-gray-500 mt-1">
                            Due:{' '}
                            {new Date(invoice.dueDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-medium text-gray-900">
                          ₹{invoice.total.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          incl. GST ₹{(invoice.cgst + invoice.sgst).toLocaleString()}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={cn(
                            'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-medium capitalize',
                            getStatusBadge(invoice.status)
                          )}
                        >
                          {getStatusIcon(invoice.status)}
                          {invoice.status}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <Eye className="h-4 w-4 text-gray-500" />
                          </button>
                          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <Download className="h-4 w-4 text-gray-500" />
                          </button>
                          {invoice.status === 'pending' && (
                            <button className="px-3 py-1.5 text-sm font-medium text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                              Record Payment
                            </button>
                          )}
                        </div>
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
                  Showing {data.results.length} of {data.count} invoices
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
