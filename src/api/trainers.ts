import apiClient from './client'

// Backend response type
interface BackendTrainer {
  id: string
  first_name: string
  last_name: string
  full_name: string
  bio: string
  photo_url: string | null
  specializations: string[]
  certifications: string[]
}

// Frontend type
export interface Trainer {
  id: string
  firstName: string
  lastName: string
  fullName: string
  bio: string
  photoUrl: string | null
  specializations: string[]
  certifications: string[]
}

interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

const transformTrainer = (data: BackendTrainer): Trainer => ({
  id: data.id,
  firstName: data.first_name,
  lastName: data.last_name,
  fullName: data.full_name,
  bio: data.bio,
  photoUrl: data.photo_url,
  specializations: data.specializations,
  certifications: data.certifications,
})

/**
 * Get all trainers (public endpoint)
 */
export const getTrainers = async (): Promise<Trainer[]> => {
  const response = await apiClient.get<PaginatedResponse<BackendTrainer>>('/trainers/')
  return response.data.results.map(transformTrainer)
}
