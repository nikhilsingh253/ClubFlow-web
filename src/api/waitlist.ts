import apiClient from './client'

// Backend response type
interface BackendWaitlistEntry {
  id: string
  class_schedule_id: string
  class_name: string
  instructor_name: string
  date: string
  start_time: string
  position: number
  joined_at: string
}

// Frontend type
export interface WaitlistEntry {
  id: string
  classScheduleId: string
  className: string
  instructorName: string
  date: string
  startTime: string
  position: number
  joinedAt: string
}

interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

const transformWaitlistEntry = (data: BackendWaitlistEntry): WaitlistEntry => ({
  id: data.id,
  classScheduleId: data.class_schedule_id,
  className: data.class_name,
  instructorName: data.instructor_name,
  date: data.date,
  startTime: data.start_time,
  position: data.position,
  joinedAt: data.joined_at,
})

/**
 * Get user's waitlist entries
 */
export const getWaitlistEntries = async (): Promise<WaitlistEntry[]> => {
  const response = await apiClient.get<PaginatedResponse<BackendWaitlistEntry>>('/waitlist/')
  return response.data.results.map(transformWaitlistEntry)
}

/**
 * Join waitlist for a full class
 */
export const joinWaitlist = async (classScheduleId: string): Promise<WaitlistEntry> => {
  const response = await apiClient.post<BackendWaitlistEntry>('/waitlist/', {
    class_schedule_id: classScheduleId,
  })
  return transformWaitlistEntry(response.data)
}

/**
 * Leave waitlist
 */
export const leaveWaitlist = async (waitlistId: string): Promise<void> => {
  await apiClient.delete(`/waitlist/${waitlistId}/`)
}
