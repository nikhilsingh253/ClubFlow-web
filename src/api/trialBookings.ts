import apiClient from './client'

export interface TrialBookingRequest {
  full_name: string
  email: string
  phone: string
  preferred_time: 'morning' | 'afternoon' | 'evening' | 'flexible' | ''
  notes?: string
}

export interface TrialBookingResponse {
  id: string
  full_name: string
  email: string
  phone: string
  preferred_time: string
  notes: string
  status: 'pending' | 'contacted' | 'scheduled' | 'completed' | 'cancelled'
  created_at: string
}

/**
 * Submit a trial booking request (public endpoint)
 */
export const submitTrialBooking = async (
  data: TrialBookingRequest
): Promise<TrialBookingResponse> => {
  const response = await apiClient.post<TrialBookingResponse>(
    '/customers/trial-bookings/',
    data
  )
  return response.data
}
