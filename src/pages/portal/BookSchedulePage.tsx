import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Calendar, Clock, User, MapPin, Users } from 'lucide-react'
import toast from 'react-hot-toast'
import { getClassSchedules } from '@/api/classes'
import { bookClass } from '@/api/bookings'
import { getWaitlistEntries, joinWaitlist, leaveWaitlist } from '@/api/waitlist'
import { formatDate } from '@/lib/utils'
import LoadingSpinner from '@/components/common/LoadingSpinner'

export default function BookSchedulePage() {
  const queryClient = useQueryClient()
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  })

  const { data: classes, isLoading } = useQuery({
    queryKey: ['class-schedules', selectedDate],
    queryFn: () => getClassSchedules({ date: selectedDate }),
  })

  const { data: waitlistEntries } = useQuery({
    queryKey: ['waitlist'],
    queryFn: getWaitlistEntries,
  })

  const bookMutation = useMutation({
    mutationFn: bookClass,
    onSuccess: (data) => {
      toast.success(`Booked: ${data.className}`)
      queryClient.invalidateQueries({ queryKey: ['class-schedules'] })
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
    },
    onError: (error: Error & { response?: { data?: { detail?: string } } }) => {
      const message = error.response?.data?.detail || 'Failed to book class. Please try again.'
      toast.error(message)
    },
  })

  const joinWaitlistMutation = useMutation({
    mutationFn: joinWaitlist,
    onSuccess: (data) => {
      toast.success(`Added to waitlist for ${data.className} (Position: ${data.position})`)
      queryClient.invalidateQueries({ queryKey: ['waitlist'] })
    },
    onError: (error: Error & { response?: { data?: { detail?: string } } }) => {
      const message = error.response?.data?.detail || 'Failed to join waitlist.'
      toast.error(message)
    },
  })

  const leaveWaitlistMutation = useMutation({
    mutationFn: leaveWaitlist,
    onSuccess: () => {
      toast.success('Removed from waitlist')
      queryClient.invalidateQueries({ queryKey: ['waitlist'] })
    },
    onError: () => {
      toast.error('Failed to leave waitlist')
    },
  })

  const handleBook = (classId: string, className: string) => {
    if (confirm(`Book ${className}?`)) {
      bookMutation.mutate(classId)
    }
  }

  const handleJoinWaitlist = (classId: string, className: string) => {
    if (confirm(`Join waitlist for ${className}? You'll be notified if a spot opens up.`)) {
      joinWaitlistMutation.mutate(classId)
    }
  }

  const handleLeaveWaitlist = (waitlistId: string, className: string) => {
    if (confirm(`Leave waitlist for ${className}?`)) {
      leaveWaitlistMutation.mutate(waitlistId)
    }
  }

  // Check if user is on waitlist for a specific class
  const getWaitlistEntry = (classScheduleId: string) => {
    return waitlistEntries?.find(w => w.classScheduleId === classScheduleId)
  }

  // Generate next 7 days for date selection
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() + i)
    return {
      value: date.toISOString().split('T')[0],
      label: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' }),
    }
  })

  // Show all classes except cancelled ones
  const activeClasses = classes?.filter(c => !c.isCancelled) || []

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-semibold text-foreground">
          Book a Class
        </h1>
        <p className="mt-2 text-muted-foreground">
          Browse available classes and book your spot
        </p>
      </div>

      {/* Date Selection */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {dates.map((date) => (
          <button
            key={date.value}
            onClick={() => setSelectedDate(date.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              selectedDate === date.value
                ? 'bg-blush-500 text-white'
                : 'bg-white border border-border text-foreground hover:bg-taupe-50'
            }`}
          >
            {date.label}
          </button>
        ))}
      </div>

      {/* Date Header */}
      <div className="flex items-center gap-3 p-4 bg-blush-50 rounded-xl">
        <Calendar className="h-5 w-5 text-blush-600" />
        <span className="font-medium text-foreground">{formatDate(selectedDate)}</span>
      </div>

      {/* Schedule Grid */}
      {isLoading ? (
        <div className="flex justify-center py-16">
          <LoadingSpinner size="lg" />
        </div>
      ) : activeClasses.length > 0 ? (
        <div className="space-y-4">
          {activeClasses.map((classItem) => {
            const isFull = classItem.spotsAvailable === 0
            const waitlistEntry = getWaitlistEntry(classItem.id)
            const isOnWaitlist = !!waitlistEntry

            return (
              <div
                key={classItem.id}
                className={`flex flex-col md:flex-row md:items-center justify-between p-6 bg-white rounded-xl border border-border hover:shadow-soft transition-shadow ${
                  isFull && !isOnWaitlist ? 'opacity-75' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span className="font-medium">{classItem.startTime.slice(0, 5)}</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">{classItem.className}</h3>
                    <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {classItem.instructorName}
                      </span>
                      {classItem.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {classItem.location}
                        </span>
                      )}
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        classItem.level === 'intro' ? 'bg-sage-100 text-sage-700' :
                        classItem.level === 'foundation' ? 'bg-blue-100 text-blue-700' :
                        classItem.level === 'intermediate' ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {classItem.level}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-4 md:mt-0">
                  {isFull ? (
                    <>
                      <span className="text-sm text-red-600 flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        Class Full
                      </span>
                      {isOnWaitlist ? (
                        <button
                          onClick={() => handleLeaveWaitlist(waitlistEntry.id, classItem.className)}
                          disabled={leaveWaitlistMutation.isPending}
                          className="btn-elegant-outline text-sm py-2 px-4 disabled:opacity-50"
                        >
                          {leaveWaitlistMutation.isPending ? 'Leaving...' : `Waitlist #${waitlistEntry.position}`}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleJoinWaitlist(classItem.id, classItem.className)}
                          disabled={joinWaitlistMutation.isPending}
                          className="text-sm py-2 px-4 bg-amber-100 text-amber-700 hover:bg-amber-200 rounded-lg transition-colors disabled:opacity-50"
                        >
                          {joinWaitlistMutation.isPending ? 'Joining...' : 'Join Waitlist'}
                        </button>
                      )}
                    </>
                  ) : (
                    <>
                      <span className="text-sm text-sage-600">
                        {classItem.spotsAvailable} spots left
                      </span>
                      <button
                        onClick={() => handleBook(classItem.id, classItem.className)}
                        disabled={bookMutation.isPending}
                        className="btn-elegant-primary text-sm py-2 px-4 disabled:opacity-50"
                      >
                        {bookMutation.isPending ? 'Booking...' : 'Book Now'}
                      </button>
                    </>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl border border-border">
          <Calendar className="h-12 w-12 text-taupe-300 mx-auto mb-4" />
          <p className="text-muted-foreground">No classes available for this date</p>
          <p className="text-sm text-muted-foreground mt-1">Try selecting a different date</p>
        </div>
      )}
    </div>
  )
}
