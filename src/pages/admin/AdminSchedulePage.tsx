import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Plus,
  Clock,
  MapPin,
  User,
  Users,
} from 'lucide-react'
import { getSchedules } from '@/api/admin'
import { useAuthStore } from '@/store/authStore'
import type { AdminSchedule } from '@/types/admin'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { cn } from '@/lib/utils'

type ViewMode = 'week' | 'day'

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const HOURS = Array.from({ length: 14 }, (_, i) => i + 6) // 6 AM to 7 PM

export default function AdminSchedulePage() {
  const [viewMode, setViewMode] = useState<ViewMode>('week')
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedSchedule, setSelectedSchedule] = useState<AdminSchedule | null>(null)

  // Use selector to get user and compute role checks (avoids re-render issues)
  const user = useAuthStore((state) => state.user)
  const isOwner = ['manager', 'admin'].includes(user?.userType || '')
  const isTrainerOnly = user?.isTrainer === true && !isOwner

  // Calculate week range
  const weekStart = useMemo(() => {
    const date = new Date(currentDate)
    const day = date.getDay()
    date.setDate(date.getDate() - day)
    date.setHours(0, 0, 0, 0)
    return date
  }, [currentDate])

  const weekEnd = useMemo(() => {
    const date = new Date(weekStart)
    date.setDate(date.getDate() + 6)
    return date
  }, [weekStart])

  const weekDates = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(weekStart)
      date.setDate(date.getDate() + i)
      return date
    })
  }, [weekStart])

  const { data: schedulesData, isLoading } = useQuery({
    queryKey: ['admin', 'schedules', weekStart.toISOString(), weekEnd.toISOString()],
    queryFn: () =>
      getSchedules({
        fromDate: weekStart.toISOString().split('T')[0],
        toDate: weekEnd.toISOString().split('T')[0],
      }),
  })

  const schedules = schedulesData?.results

  const navigateWeek = (direction: number) => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() + direction * 7)
    setCurrentDate(newDate)
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const formatDateRange = () => {
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' }
    const startStr = weekStart.toLocaleDateString('en-US', options)
    const endStr = weekEnd.toLocaleDateString('en-US', {
      ...options,
      year: 'numeric',
    })
    return `${startStr} - ${endStr}`
  }

  const getSchedulesByDateAndHour = (date: Date, hour: number) => {
    if (!schedules) return []
    const dateStr = date.toISOString().split('T')[0]
    return schedules.filter((s) => {
      const scheduleHour = parseInt(s.startTime.split(':')[0])
      return s.date === dateStr && scheduleHour === hour
    })
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-semibold text-gray-900">
            {isTrainerOnly ? 'My Schedule' : 'Class Schedule'}
          </h1>
          <p className="text-gray-500 mt-1">
            {isTrainerOnly ? 'View your assigned classes' : 'Manage and view class schedule'}
          </p>
        </div>
        {/* Hide Add Class button for trainers */}
        {!isTrainerOnly && (
          <button className="flex items-center gap-2 px-4 py-2 bg-blush-600 text-white font-medium rounded-lg hover:bg-blush-700 transition-colors">
            <Plus className="h-4 w-4" />
            Add Class
          </button>
        )}
      </div>

      {/* Navigation Controls */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <button
                onClick={() => navigateWeek(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="h-5 w-5 text-gray-600" />
              </button>
              <button
                onClick={() => navigateWeek(1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight className="h-5 w-5 text-gray-600" />
              </button>
            </div>
            <button
              onClick={goToToday}
              className="px-3 py-1.5 text-sm font-medium text-blush-600 hover:bg-blush-50 rounded-lg transition-colors"
            >
              Today
            </button>
            <h2 className="text-lg font-semibold text-gray-900">{formatDateRange()}</h2>
          </div>
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('week')}
              className={cn(
                'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
                viewMode === 'week'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              )}
            >
              Week
            </button>
            <button
              onClick={() => setViewMode('day')}
              className={cn(
                'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
                viewMode === 'day'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              )}
            >
              Day
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-96">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Header Row */}
              <div className="grid grid-cols-8 border-b border-gray-200">
                <div className="p-3 text-center text-sm font-medium text-gray-500 bg-gray-50">
                  <CalendarIcon className="h-4 w-4 mx-auto" />
                </div>
                {weekDates.map((date, i) => (
                  <div
                    key={i}
                    className={cn(
                      'p-3 text-center border-l border-gray-200',
                      isToday(date) ? 'bg-blush-50' : 'bg-gray-50'
                    )}
                  >
                    <div className="text-xs font-medium text-gray-500">{DAYS_OF_WEEK[i]}</div>
                    <div
                      className={cn(
                        'text-lg font-semibold mt-1',
                        isToday(date) ? 'text-blush-600' : 'text-gray-900'
                      )}
                    >
                      {date.getDate()}
                    </div>
                  </div>
                ))}
              </div>

              {/* Time Grid */}
              {HOURS.map((hour) => (
                <div key={hour} className="grid grid-cols-8 border-b border-gray-100 min-h-[80px]">
                  <div className="p-2 text-right text-xs text-gray-500 bg-gray-50 border-r border-gray-100">
                    {hour.toString().padStart(2, '0')}:00
                  </div>
                  {weekDates.map((date, dayIndex) => {
                    const daySchedules = getSchedulesByDateAndHour(date, hour)
                    return (
                      <div
                        key={dayIndex}
                        className={cn(
                          'p-1 border-l border-gray-100 relative',
                          isToday(date) ? 'bg-blush-50/30' : ''
                        )}
                      >
                        {daySchedules.map((schedule) => (
                          <button
                            key={schedule.id}
                            onClick={() => setSelectedSchedule(schedule)}
                            className={cn(
                              'w-full text-left p-2 rounded-lg text-xs mb-1 transition-colors',
                              schedule.status === 'cancelled'
                                ? 'bg-gray-100 text-gray-500 line-through'
                                : 'hover:opacity-80'
                            )}
                            style={{
                              backgroundColor:
                                schedule.status !== 'cancelled'
                                  ? `${schedule.classType.color}20`
                                  : undefined,
                              borderLeft:
                                schedule.status !== 'cancelled'
                                  ? `3px solid ${schedule.classType.color}`
                                  : undefined,
                            }}
                          >
                            <div className="font-semibold truncate">{schedule.classType.name}</div>
                            <div className="text-gray-500 truncate">
                              {schedule.startTime} - {schedule.endTime}
                            </div>
                            <div className="text-gray-500 truncate">{schedule.trainer.name}</div>
                            <div className="text-gray-500">
                              {schedule.bookedCount}/{schedule.maxCapacity}
                            </div>
                          </button>
                        ))}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Schedule Detail Modal */}
      {selectedSchedule && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setSelectedSchedule(null)}
        >
          <div
            className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="h-2 rounded-t-xl"
              style={{ backgroundColor: selectedSchedule.classType.color }}
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900">
                {selectedSchedule.classType.name}
              </h3>
              <p className="text-sm text-gray-500 mt-1">{selectedSchedule.classType.level}</p>

              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-3 text-gray-600">
                  <CalendarIcon className="h-5 w-5 text-gray-400" />
                  <span>{new Date(selectedSchedule.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <span>
                    {selectedSchedule.startTime} - {selectedSchedule.endTime}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <User className="h-5 w-5 text-gray-400" />
                  <span>{selectedSchedule.trainer.name}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <span>{selectedSchedule.location}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Users className="h-5 w-5 text-gray-400" />
                  <span>
                    {selectedSchedule.bookedCount} / {selectedSchedule.maxCapacity} booked
                    {selectedSchedule.waitlistCount > 0 && (
                      <span className="text-amber-600 ml-2">
                        ({selectedSchedule.waitlistCount} waitlisted)
                      </span>
                    )}
                  </span>
                </div>
              </div>

              {selectedSchedule.notes && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
                  {selectedSchedule.notes}
                </div>
              )}

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setSelectedSchedule(null)}
                  className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button className="flex-1 px-4 py-2 bg-blush-600 text-white font-medium rounded-lg hover:bg-blush-700 transition-colors">
                  View Attendance
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
