import apiClient from './client'

// Backend response type
interface BackendClassSchedule {
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

// Frontend type
export interface ClassSchedule {
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

interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

const transformClassSchedule = (data: BackendClassSchedule): ClassSchedule => ({
  id: data.id,
  className: data.class_name,
  level: data.level as ClassSchedule['level'],
  instructorName: data.instructor_name,
  date: data.date,
  startTime: data.start_time,
  endTime: data.end_time,
  spotsAvailable: data.spots_available,
  maxCapacity: data.max_capacity,
  location: data.location,
  isCancelled: data.is_cancelled,
})

/**
 * Get class schedules
 */
export const getClassSchedules = async (params?: {
  date?: string
  from_date?: string
  to_date?: string
}): Promise<ClassSchedule[]> => {
  const response = await apiClient.get<PaginatedResponse<BackendClassSchedule>>('/class-schedules/', { params })
  return response.data.results.map(transformClassSchedule)
}
