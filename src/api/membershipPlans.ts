import apiClient from './client'

// Backend response type
interface BackendMembershipPlan {
  id: string
  name: string
  description: string
  price: number // in paise
  duration_months: number
  classes_per_month: number | null
  features: string[]
  is_popular: boolean
  is_active: boolean
}

// Frontend type
export interface MembershipPlan {
  id: string
  name: string
  description: string
  price: number // in rupees
  durationMonths: number
  classesPerMonth: number | null
  features: string[]
  isPopular: boolean
  isActive: boolean
}

interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

const transformMembershipPlan = (data: BackendMembershipPlan): MembershipPlan => ({
  id: data.id,
  name: data.name,
  description: data.description,
  price: data.price / 100, // Convert paise to rupees
  durationMonths: data.duration_months,
  classesPerMonth: data.classes_per_month,
  features: data.features,
  isPopular: data.is_popular,
  isActive: data.is_active,
})

/**
 * Get all membership plans (public endpoint)
 */
export const getMembershipPlans = async (): Promise<MembershipPlan[]> => {
  const response = await apiClient.get<PaginatedResponse<BackendMembershipPlan>>('/membership-plans/')
  return response.data.results.map(transformMembershipPlan)
}
