import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import {
  getAttendanceReport,
  getRevenueReport,
  getMembershipReport,
  getTrialConversionReport,
  getReportExportUrl,
} from '@/api/admin'
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  CreditCard,
  Calendar,
  Download,
  Target,
  UserPlus,
  UserMinus,
} from 'lucide-react'

type ReportTab = 'attendance' | 'revenue' | 'memberships' | 'trials'

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value)
}

function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`
}

function getDateRangeForPeriod(period: 'week' | 'month' | '3months'): { fromDate: string; toDate: string } {
  const to = new Date()
  const from = new Date()

  switch (period) {
    case 'week':
      from.setDate(from.getDate() - 7)
      break
    case 'month':
      from.setMonth(from.getMonth() - 1)
      break
    case '3months':
      from.setMonth(from.getMonth() - 3)
      break
  }

  return {
    fromDate: from.toISOString().split('T')[0],
    toDate: to.toISOString().split('T')[0],
  }
}

export default function AdminReportsPage() {
  const [activeTab, setActiveTab] = useState<ReportTab>('attendance')
  const [period, setPeriod] = useState<'week' | 'month' | '3months'>('month')
  const dateRange = getDateRangeForPeriod(period)

  const { data: attendanceData, isLoading: attendanceLoading } = useQuery({
    queryKey: ['admin', 'reports', 'attendance', dateRange],
    queryFn: () => getAttendanceReport(dateRange),
    enabled: activeTab === 'attendance',
  })

  const { data: revenueData, isLoading: revenueLoading } = useQuery({
    queryKey: ['admin', 'reports', 'revenue', dateRange],
    queryFn: () => getRevenueReport(dateRange),
    enabled: activeTab === 'revenue',
  })

  const { data: membershipData, isLoading: membershipLoading } = useQuery({
    queryKey: ['admin', 'reports', 'memberships'],
    queryFn: () => getMembershipReport(),
    enabled: activeTab === 'memberships',
  })

  const { data: trialsData, isLoading: trialsLoading } = useQuery({
    queryKey: ['admin', 'reports', 'trials', dateRange],
    queryFn: () => getTrialConversionReport(dateRange),
    enabled: activeTab === 'trials',
  })

  const handleExport = () => {
    const url = getReportExportUrl(activeTab, dateRange)
    window.open(url, '_blank')
  }

  const tabs = [
    { id: 'attendance', label: 'Attendance', icon: Calendar },
    { id: 'revenue', label: 'Revenue', icon: CreditCard },
    { id: 'memberships', label: 'Memberships', icon: Users },
    { id: 'trials', label: 'Trial Conversions', icon: Target },
  ] as const

  const isLoading =
    (activeTab === 'attendance' && attendanceLoading) ||
    (activeTab === 'revenue' && revenueLoading) ||
    (activeTab === 'memberships' && membershipLoading) ||
    (activeTab === 'trials' && trialsLoading)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-semibold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-500 mt-1">Track your studio's performance</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Period Selector */}
          <div className="flex items-center bg-white border border-gray-200 rounded-lg p-1">
            {(['week', 'month', '3months'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={cn(
                  'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
                  period === p ? 'bg-blush-100 text-blush-700' : 'text-gray-600 hover:bg-gray-50'
                )}
              >
                {p === 'week' ? '7 Days' : p === 'month' ? '30 Days' : '3 Months'}
              </button>
            ))}
          </div>

          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-600 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex px-4 -mb-px">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors',
                  activeTab === tab.id
                    ? 'border-blush-500 text-blush-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                )}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <LoadingSpinner />
            </div>
          ) : (
            <>
              {/* Attendance Tab */}
              {activeTab === 'attendance' && attendanceData && (
                <div className="space-y-6">
                  {/* Summary Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm text-gray-500">Total Classes</p>
                      <p className="text-2xl font-semibold text-gray-900">
                        {attendanceData.summary.totalClasses}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm text-gray-500">Total Bookings</p>
                      <p className="text-2xl font-semibold text-gray-900">
                        {attendanceData.summary.totalBookings}
                      </p>
                    </div>
                    <div className="bg-emerald-50 rounded-xl p-4">
                      <p className="text-sm text-emerald-600">Attendance Rate</p>
                      <p className="text-2xl font-semibold text-emerald-700">
                        {formatPercent(attendanceData.summary.attendanceRate)}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm text-gray-500">Avg Class Size</p>
                      <p className="text-2xl font-semibold text-gray-900">
                        {attendanceData.summary.avgClassSize.toFixed(1)}
                      </p>
                    </div>
                  </div>

                  {/* Stats Row */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white border border-gray-200 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                          <TrendingUp className="h-4 w-4 text-emerald-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-900">Attended</span>
                      </div>
                      <p className="text-2xl font-semibold text-gray-900">
                        {attendanceData.summary.totalAttended}
                      </p>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                          <TrendingDown className="h-4 w-4 text-red-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-900">No Shows</span>
                      </div>
                      <p className="text-2xl font-semibold text-gray-900">
                        {attendanceData.summary.totalNoShows}
                      </p>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                          <Calendar className="h-4 w-4 text-gray-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-900">Cancelled</span>
                      </div>
                      <p className="text-2xl font-semibold text-gray-900">
                        {attendanceData.summary.totalCancelled}
                      </p>
                    </div>
                  </div>

                  {/* Breakdown Table */}
                  {attendanceData.breakdown && attendanceData.breakdown.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-3">Daily Breakdown</h3>
                      <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                              <th className="text-left px-4 py-2 text-sm font-medium text-gray-500">Date</th>
                              <th className="text-right px-4 py-2 text-sm font-medium text-gray-500">Classes</th>
                              <th className="text-right px-4 py-2 text-sm font-medium text-gray-500">Bookings</th>
                              <th className="text-right px-4 py-2 text-sm font-medium text-gray-500">Attended</th>
                              <th className="text-right px-4 py-2 text-sm font-medium text-gray-500">No Shows</th>
                              <th className="text-right px-4 py-2 text-sm font-medium text-gray-500">Rate</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {attendanceData.breakdown.slice(0, 10).map((row) => (
                              <tr key={row.date}>
                                <td className="px-4 py-2 text-sm text-gray-900">
                                  {new Date(row.date).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                  })}
                                </td>
                                <td className="px-4 py-2 text-sm text-gray-600 text-right">{row.classes}</td>
                                <td className="px-4 py-2 text-sm text-gray-600 text-right">{row.bookings}</td>
                                <td className="px-4 py-2 text-sm text-gray-600 text-right">{row.attended}</td>
                                <td className="px-4 py-2 text-sm text-gray-600 text-right">{row.noShows}</td>
                                <td className="px-4 py-2 text-sm font-medium text-right">
                                  <span
                                    className={cn(
                                      row.attendanceRate >= 85 ? 'text-emerald-600' : 'text-amber-600'
                                    )}
                                  >
                                    {formatPercent(row.attendanceRate)}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Revenue Tab */}
              {activeTab === 'revenue' && revenueData && (
                <div className="space-y-6">
                  {/* Summary Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-emerald-50 rounded-xl p-4">
                      <p className="text-sm text-emerald-600">Total Collected</p>
                      <p className="text-2xl font-semibold text-emerald-700">
                        {formatCurrency(revenueData.summary.totalCollected)}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm text-gray-500">Total Invoiced</p>
                      <p className="text-2xl font-semibold text-gray-900">
                        {formatCurrency(revenueData.summary.totalInvoiced)}
                      </p>
                    </div>
                    <div className="bg-amber-50 rounded-xl p-4">
                      <p className="text-sm text-amber-600">Outstanding</p>
                      <p className="text-2xl font-semibold text-amber-700">
                        {formatCurrency(revenueData.summary.outstanding)}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm text-gray-500">Avg Invoice</p>
                      <p className="text-2xl font-semibold text-gray-900">
                        {formatCurrency(revenueData.summary.avgInvoiceValue)}
                      </p>
                    </div>
                  </div>

                  {/* Revenue by Plan */}
                  {revenueData.byPlan && revenueData.byPlan.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-3">Revenue by Plan</h3>
                      <div className="space-y-3">
                        {revenueData.byPlan.map((plan) => (
                          <div
                            key={plan.plan}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                          >
                            <div>
                              <p className="font-medium text-gray-900">{plan.plan}</p>
                              <p className="text-sm text-gray-500">{plan.count} memberships sold</p>
                            </div>
                            <p className="text-lg font-semibold text-gray-900">
                              {formatCurrency(plan.revenue)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Breakdown Table */}
                  {revenueData.breakdown && revenueData.breakdown.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-3">Daily Breakdown</h3>
                      <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                              <th className="text-left px-4 py-2 text-sm font-medium text-gray-500">Date</th>
                              <th className="text-right px-4 py-2 text-sm font-medium text-gray-500">Invoiced</th>
                              <th className="text-right px-4 py-2 text-sm font-medium text-gray-500">Collected</th>
                              <th className="text-right px-4 py-2 text-sm font-medium text-gray-500">Invoices</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {revenueData.breakdown.slice(0, 10).map((row) => (
                              <tr key={row.date}>
                                <td className="px-4 py-2 text-sm text-gray-900">
                                  {new Date(row.date).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                  })}
                                </td>
                                <td className="px-4 py-2 text-sm text-gray-600 text-right">
                                  {formatCurrency(row.invoiced)}
                                </td>
                                <td className="px-4 py-2 text-sm text-emerald-600 text-right font-medium">
                                  {formatCurrency(row.collected)}
                                </td>
                                <td className="px-4 py-2 text-sm text-gray-600 text-right">
                                  {row.invoiceCount}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Memberships Tab */}
              {activeTab === 'memberships' && membershipData && (
                <div className="space-y-6">
                  {/* Current Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-emerald-50 rounded-xl p-4">
                      <p className="text-sm text-emerald-600">Active Members</p>
                      <p className="text-2xl font-semibold text-emerald-700">
                        {membershipData.current.totalActive}
                      </p>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <UserPlus className="h-4 w-4 text-blue-600" />
                        <p className="text-sm text-blue-600">New This Month</p>
                      </div>
                      <p className="text-2xl font-semibold text-blue-700">
                        {membershipData.trends.newThisMonth}
                      </p>
                    </div>
                    <div className="bg-red-50 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <UserMinus className="h-4 w-4 text-red-600" />
                        <p className="text-sm text-red-600">Churned</p>
                      </div>
                      <p className="text-2xl font-semibold text-red-700">
                        {membershipData.trends.churnedThisMonth}
                      </p>
                    </div>
                    <div
                      className={cn(
                        'rounded-xl p-4',
                        membershipData.trends.netGrowth >= 0 ? 'bg-emerald-50' : 'bg-red-50'
                      )}
                    >
                      <p
                        className={cn(
                          'text-sm',
                          membershipData.trends.netGrowth >= 0 ? 'text-emerald-600' : 'text-red-600'
                        )}
                      >
                        Net Growth
                      </p>
                      <p
                        className={cn(
                          'text-2xl font-semibold',
                          membershipData.trends.netGrowth >= 0 ? 'text-emerald-700' : 'text-red-700'
                        )}
                      >
                        {membershipData.trends.netGrowth >= 0 ? '+' : ''}
                        {membershipData.trends.netGrowth}
                      </p>
                    </div>
                  </div>

                  {/* Expiring Alert */}
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <h3 className="font-medium text-amber-900 mb-3">Expiring Memberships</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-2xl font-semibold text-amber-700">
                          {membershipData.expiring.next7Days}
                        </p>
                        <p className="text-sm text-amber-600">Next 7 days</p>
                      </div>
                      <div>
                        <p className="text-2xl font-semibold text-amber-700">
                          {membershipData.expiring.next14Days}
                        </p>
                        <p className="text-sm text-amber-600">Next 14 days</p>
                      </div>
                      <div>
                        <p className="text-2xl font-semibold text-amber-700">
                          {membershipData.expiring.next30Days}
                        </p>
                        <p className="text-sm text-amber-600">Next 30 days</p>
                      </div>
                    </div>
                  </div>

                  {/* By Plan */}
                  {membershipData.current.byPlan && membershipData.current.byPlan.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-3">Members by Plan</h3>
                      <div className="space-y-3">
                        {membershipData.current.byPlan.map((plan) => {
                          const percentage = (plan.count / membershipData.current.totalActive) * 100
                          return (
                            <div key={plan.plan}>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium text-gray-900">{plan.plan}</span>
                                <span className="text-sm text-gray-500">
                                  {plan.count} ({formatPercent(percentage)})
                                </span>
                              </div>
                              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-blush-500 rounded-full"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Trials Tab */}
              {activeTab === 'trials' && trialsData && (
                <div className="space-y-6">
                  {/* Summary Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm text-gray-500">Total Trials</p>
                      <p className="text-2xl font-semibold text-gray-900">
                        {trialsData.summary.totalTrials}
                      </p>
                    </div>
                    <div className="bg-emerald-50 rounded-xl p-4">
                      <p className="text-sm text-emerald-600">Converted</p>
                      <p className="text-2xl font-semibold text-emerald-700">
                        {trialsData.summary.converted}
                      </p>
                    </div>
                    <div className="bg-red-50 rounded-xl p-4">
                      <p className="text-sm text-red-600">Lost</p>
                      <p className="text-2xl font-semibold text-red-700">
                        {trialsData.summary.lost}
                      </p>
                    </div>
                    <div className="bg-amber-50 rounded-xl p-4">
                      <p className="text-sm text-amber-600">Pending</p>
                      <p className="text-2xl font-semibold text-amber-700">
                        {trialsData.summary.pending}
                      </p>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-4">
                      <p className="text-sm text-blue-600">Conversion Rate</p>
                      <p className="text-2xl font-semibold text-blue-700">
                        {formatPercent(trialsData.summary.conversionRate)}
                      </p>
                    </div>
                  </div>

                  {/* By Source */}
                  {trialsData.bySource && trialsData.bySource.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-3">Trials by Source</h3>
                      <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                              <th className="text-left px-4 py-2 text-sm font-medium text-gray-500">Source</th>
                              <th className="text-right px-4 py-2 text-sm font-medium text-gray-500">Trials</th>
                              <th className="text-right px-4 py-2 text-sm font-medium text-gray-500">Converted</th>
                              <th className="text-right px-4 py-2 text-sm font-medium text-gray-500">Rate</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {trialsData.bySource.map((row) => (
                              <tr key={row.source}>
                                <td className="px-4 py-2 text-sm text-gray-900 capitalize">
                                  {row.source.replace('_', ' ')}
                                </td>
                                <td className="px-4 py-2 text-sm text-gray-600 text-right">{row.trials}</td>
                                <td className="px-4 py-2 text-sm text-emerald-600 text-right font-medium">
                                  {row.converted}
                                </td>
                                <td className="px-4 py-2 text-sm text-right">
                                  {formatPercent(row.trials > 0 ? (row.converted / row.trials) * 100 : 0)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Lost Reasons */}
                  {trialsData.lostReasons && trialsData.lostReasons.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-3">Why Trials Were Lost</h3>
                      <div className="space-y-3">
                        {trialsData.lostReasons.map((reason) => {
                          const percentage =
                            trialsData.summary.lost > 0
                              ? (reason.count / trialsData.summary.lost) * 100
                              : 0
                          return (
                            <div key={reason.reason}>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium text-gray-900 capitalize">
                                  {reason.reason.replace('_', ' ')}
                                </span>
                                <span className="text-sm text-gray-500">
                                  {reason.count} ({formatPercent(percentage)})
                                </span>
                              </div>
                              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-red-400 rounded-full"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Empty State for missing data */}
              {!isLoading &&
                ((activeTab === 'attendance' && !attendanceData) ||
                  (activeTab === 'revenue' && !revenueData) ||
                  (activeTab === 'memberships' && !membershipData) ||
                  (activeTab === 'trials' && !trialsData)) && (
                <div className="text-center py-12">
                  <BarChart3 className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No data available</h3>
                  <p className="text-gray-500">
                    There's no data for this report in the selected period.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
