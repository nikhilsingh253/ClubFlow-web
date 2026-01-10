import apiClient from './client'

// Backend response type
interface BackendBooking {
  id: string
  class_name: string
  instructor_name: string
  date: string
  start_time: string
  end_time: string
  location: string
  status: string
  booked_at: string
}

// Frontend type
export interface Booking {
  id: string
  className: string
  instructorName: string
  date: string
  startTime: string
  endTime: string
  location: string
  status: 'confirmed' | 'cancelled' | 'completed' | 'no_show'
  bookedAt: string
}

interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

const transformBooking = (data: BackendBooking): Booking => ({
  id: data.id,
  className: data.class_name,
  instructorName: data.instructor_name,
  date: data.date,
  startTime: data.start_time,
  endTime: data.end_time,
  location: data.location,
  status: data.status as Booking['status'],
  bookedAt: data.booked_at,
})

/**
 * Get user's bookings
 */
export const getBookings = async (params?: {
  status?: string
  upcoming?: boolean
}): Promise<Booking[]> => {
  const response = await apiClient.get<PaginatedResponse<BackendBooking>>('/bookings/', { params })
  return response.data.results.map(transformBooking)
}

/**
 * Book a class
 */
export const bookClass = async (classScheduleId: string): Promise<Booking> => {
  const response = await apiClient.post<BackendBooking>('/bookings/', {
    class_schedule_id: classScheduleId,
  })
  return transformBooking(response.data)
}

/**
 * Cancel a booking
 */
export const cancelBooking = async (bookingId: string): Promise<void> => {
  await apiClient.delete(`/bookings/${bookingId}/`)
}

/**
 * Request reschedule for a booking
 */
export const requestReschedule = async (bookingId: string): Promise<void> => {
  await apiClient.post(`/bookings/${bookingId}/request-reschedule/`)
}
