import apiClient from './client'

export interface PublicClassSchedule {
  id: string
  className: string
  level: 'intro' | 'foundation' | 'intermediate' | 'advanced'
  instructorName: string
  date: string
  startTime: string
  endTime: string
  spotsAvailable: number
  maxCapacity: number
  location: string
  isCancelled: boolean
}

// Backend response type
interface BackendPublicSchedule {
  id: string
  class_name: string
  level: string
  instructor_name: string
  date: string
  start_time: string
  end_time: string
  spots_available: number
  max_capacity: number
  location: string
  is_cancelled: boolean
}

interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

const transformSchedule = (data: BackendPublicSchedule): PublicClassSchedule => ({
  id: data.id,
  className: data.class_name,
  level: data.level as PublicClassSchedule['level'],
  instructorName: data.instructor_name,
  date: data.date,
  startTime: data.start_time,
  endTime: data.end_time,
  spotsAvailable: data.spots_available,
  maxCapacity: data.max_capacity,
  location: data.location,
  isCancelled: data.is_cancelled,
})

export interface PublicScheduleFilters {
  dateFrom?: string
  dateTo?: string
  classType?: string
}

/**
 * Get public class schedule (no auth required)
 */
export const getPublicSchedule = async (
  filters?: PublicScheduleFilters
): Promise<PublicClassSchedule[]> => {
  const params = new URLSearchParams()

  if (filters?.dateFrom) {
    params.append('date_from', filters.dateFrom)
  }
  if (filters?.dateTo) {
    params.append('date_to', filters.dateTo)
  }
  if (filters?.classType) {
    params.append('class_type', filters.classType)
  }

  const queryString = params.toString()
  const url = queryString ? `/public/schedule/?${queryString}` : '/public/schedule/'

  const response = await apiClient.get<PaginatedResponse<BackendPublicSchedule>>(url)
  return response.data.results.map(transformSchedule)
}
