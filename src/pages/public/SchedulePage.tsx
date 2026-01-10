import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Calendar, Clock, User, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react'
import { ROUTES } from '@/lib/constants'
import { getPublicSchedule } from '@/api/publicSchedule'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { cn } from '@/lib/utils'

// Helper to format time from "09:00:00" to "09:00 AM"
const formatTime = (time: string) => {
  const [hours, minutes] = time.split(':')
  const hour = parseInt(hours, 10)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const hour12 = hour % 12 || 12
  return `${hour12}:${minutes} ${ampm}`
}

// Helper to get dates for the week
const getWeekDates = (startDate: Date) => {
  const dates: Date[] = []
  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + i)
    dates.push(date)
  }
  return dates
}

// Helper to format date as YYYY-MM-DD
const formatDateForApi = (date: Date) => {
  return date.toISOString().split('T')[0]
}

// Level badge colors
const levelColors: Record<string, string> = {
  intro: 'bg-blush-100 text-blush-700',
  foundation: 'bg-sage-100 text-sage-700',
  intermediate: 'bg-amber-100 text-amber-700',
  advanced: 'bg-purple-100 text-purple-700',
}

export default function SchedulePage() {
  const [weekStartDate, setWeekStartDate] = useState(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return today
  })
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return today
  })

  const weekDates = getWeekDates(weekStartDate)

  // Navigate weeks
  const goToPreviousWeek = () => {
    const newStart = new Date(weekStartDate)
    newStart.setDate(weekStartDate.getDate() - 7)
    // Don't allow going to past dates
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (newStart >= today) {
      setWeekStartDate(newStart)
      setSelectedDate(newStart)
    } else if (weekStartDate > today) {
      setWeekStartDate(today)
      setSelectedDate(today)
    }
  }

  const goToNextWeek = () => {
    const newStart = new Date(weekStartDate)
    newStart.setDate(weekStartDate.getDate() + 7)
    setWeekStartDate(newStart)
    setSelectedDate(newStart)
  }

  // Fetch schedule for the selected date
  const { data: classes = [], isLoading, error } = useQuery({
    queryKey: ['publicSchedule', formatDateForApi(selectedDate)],
    queryFn: () => getPublicSchedule({
      dateFrom: formatDateForApi(selectedDate),
      dateTo: formatDateForApi(selectedDate),
    }),
  })

  // Group classes by time
  const sortedClasses = [...classes].sort((a, b) =>
    a.startTime.localeCompare(b.startTime)
  )

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const canGoPrevious = weekStartDate > today

  return (
    <div className="section container-wide">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="font-display text-display-md md:text-display-lg text-foreground">
          Class Schedule
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Find the perfect class for your schedule
        </p>
      </div>

      {/* Week Navigation */}
      <div className="flex items-center justify-between mb-6 max-w-3xl mx-auto">
        <button
          onClick={goToPreviousWeek}
          disabled={!canGoPrevious}
          className={cn(
            'p-2 rounded-lg transition-colors',
            canGoPrevious
              ? 'hover:bg-taupe-100 text-foreground'
              : 'text-muted-foreground/30 cursor-not-allowed'
          )}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <span className="font-medium text-foreground">
          {weekDates[0].toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
        </span>
        <button
          onClick={goToNextWeek}
          className="p-2 rounded-lg hover:bg-taupe-100 text-foreground transition-colors"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Date Selector */}
      <div className="flex gap-2 justify-center mb-8 overflow-x-auto pb-2">
        {weekDates.map((date) => {
          const isSelected = date.toDateString() === selectedDate.toDateString()
          const isToday = date.toDateString() === today.toDateString()
          const isPast = date < today

          return (
            <button
              key={date.toISOString()}
              onClick={() => !isPast && setSelectedDate(date)}
              disabled={isPast}
              className={cn(
                'flex flex-col items-center min-w-[60px] p-3 rounded-xl transition-colors',
                isSelected
                  ? 'bg-blush-500 text-white'
                  : isPast
                    ? 'bg-taupe-50 text-muted-foreground/50 cursor-not-allowed'
                    : 'bg-taupe-50 hover:bg-taupe-100 text-foreground'
              )}
            >
              <span className="text-xs uppercase">
                {date.toLocaleDateString('en-IN', { weekday: 'short' })}
              </span>
              <span className="text-lg font-semibold">
                {date.getDate()}
              </span>
              {isToday && (
                <span className={cn(
                  'text-xs',
                  isSelected ? 'text-white/80' : 'text-blush-500'
                )}>
                  Today
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Selected Date Display */}
      <div className="flex items-center justify-center gap-3 mb-8 p-4 bg-blush-50 rounded-xl">
        <Calendar className="h-5 w-5 text-blush-600" />
        <span className="font-medium text-foreground">
          {selectedDate.toLocaleDateString('en-IN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </span>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <LoadingSpinner />
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <p className="text-muted-foreground">
            Unable to load schedule. Please try again later.
          </p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && sortedClasses.length === 0 && (
        <div className="text-center py-12 bg-taupe-50 rounded-2xl">
          <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            No classes scheduled for this day.
          </p>
        </div>
      )}

      {/* Schedule Grid */}
      {!isLoading && !error && sortedClasses.length > 0 && (
        <div className="space-y-4">
          {sortedClasses.map((classItem) => (
            <div
              key={classItem.id}
              className={cn(
                'flex flex-col md:flex-row md:items-center justify-between p-6 bg-white rounded-xl border border-border hover:shadow-soft transition-shadow',
                classItem.isCancelled && 'opacity-60'
              )}
            >
              <div className="flex items-start gap-4">
                <div className="flex items-center gap-2 text-muted-foreground min-w-[100px]">
                  <Clock className="h-4 w-4" />
                  <span className="font-medium">{formatTime(classItem.startTime)}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-foreground">
                      {classItem.className}
                    </h3>
                    {classItem.isCancelled && (
                      <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded-full">
                        Cancelled
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <User className="h-3 w-3" />
                      <span>{classItem.instructorName}</span>
                    </div>
                    <span className={cn(
                      'text-xs px-2 py-0.5 rounded-full capitalize',
                      levelColors[classItem.level] || 'bg-gray-100 text-gray-700'
                    )}>
                      {classItem.level}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-4 md:mt-0">
                {!classItem.isCancelled && (
                  <span className={cn(
                    'text-sm px-3 py-1 rounded-full',
                    classItem.spotsAvailable > 3
                      ? 'bg-sage-100 text-sage-700'
                      : classItem.spotsAvailable > 0
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-red-100 text-red-700'
                  )}>
                    {classItem.spotsAvailable > 0
                      ? `${classItem.spotsAvailable} spots available`
                      : 'Class Full'}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CTA Section */}
      <div className="mt-12 p-6 bg-blush-50 rounded-2xl text-center max-w-2xl mx-auto">
        <h3 className="font-display text-lg font-semibold text-foreground mb-2">
          Want to join a class?
        </h3>
        <p className="text-muted-foreground mb-4">
          Book a trial class to experience our studio, or sign in if you're already a member.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to={ROUTES.TRIAL} className="btn-elegant-primary">
            Book a Trial Class
          </Link>
          <Link to={ROUTES.LOGIN} className="btn-elegant-outline">
            Member Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}
