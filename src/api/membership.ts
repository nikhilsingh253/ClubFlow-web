import apiClient from './client'

// Backend response type
interface BackendMembership {
  id: string
  plan_name: string
  status: string
  start_date: string
  end_date: string
  classes_per_month: number
  classes_used: number
  classes_remaining: number
  auto_renew: boolean
  card_number: string
}

// Frontend type
export interface CustomerMembership {
  id: string
  planName: string
  status: 'active' | 'expired' | 'frozen' | 'cancelled'
  startDate: string
  endDate: string
  classesPerMonth: number
  classesUsed: number
  classesRemaining: number
  autoRenew: boolean
  cardNumber: string
}

const transformMembership = (data: BackendMembership): CustomerMembership => ({
  id: data.id,
  planName: data.plan_name,
  status: data.status as CustomerMembership['status'],
  startDate: data.start_date,
  endDate: data.end_date,
  classesPerMonth: data.classes_per_month,
  classesUsed: data.classes_used,
  classesRemaining: data.classes_remaining,
  autoRenew: data.auto_renew,
  cardNumber: data.card_number,
})

/**
 * Get current user's membership
 */
export const getCurrentMembership = async (): Promise<CustomerMembership | null> => {
  try {
    const response = await apiClient.get<BackendMembership>('/customers/me/membership/')
    return transformMembership(response.data)
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null // No active membership
    }
    throw error
  }
}

// Membership request types
interface BackendMembershipRequest {
  id: string
  request_type: 'freeze' | 'cancel'
  reason: string
  freeze_start_date?: string
  freeze_end_date?: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  admin_notes?: string
}

export interface MembershipRequest {
  id: string
  requestType: 'freeze' | 'cancel'
  reason: string
  freezeStartDate?: string
  freezeEndDate?: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
  adminNotes?: string
}

const transformMembershipRequest = (data: BackendMembershipRequest): MembershipRequest => ({
  id: data.id,
  requestType: data.request_type,
  reason: data.reason,
  freezeStartDate: data.freeze_start_date,
  freezeEndDate: data.freeze_end_date,
  status: data.status,
  createdAt: data.created_at,
  adminNotes: data.admin_notes,
})

/**
 * Get user's membership requests
 */
export const getMembershipRequests = async (): Promise<MembershipRequest[]> => {
  const response = await apiClient.get<{ results: BackendMembershipRequest[] }>('/membership/my-requests/')
  return response.data.results.map(transformMembershipRequest)
}

/**
 * Submit a freeze request
 */
export const submitFreezeRequest = async (data: {
  reason: string
  freezeStartDate?: string
  freezeEndDate?: string
}): Promise<MembershipRequest> => {
  const response = await apiClient.post<BackendMembershipRequest>('/membership/freeze-request/', {
    reason: data.reason,
    freeze_start_date: data.freezeStartDate,
    freeze_end_date: data.freezeEndDate,
  })
  return transformMembershipRequest(response.data)
}

/**
 * Submit a cancellation request
 */
export const submitCancelRequest = async (data: {
  reason: string
}): Promise<MembershipRequest> => {
  const response = await apiClient.post<BackendMembershipRequest>('/membership/cancel-request/', {
    reason: data.reason,
  })
  return transformMembershipRequest(response.data)
}
