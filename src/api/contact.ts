import apiClient from './client'

export interface ContactFormRequest {
  name: string
  email: string
  phone?: string
  message: string
}

export interface ContactFormResponse {
  success: boolean
  message: string
}

/**
 * Submit a contact form message (public endpoint)
 */
export const submitContactForm = async (
  data: ContactFormRequest
): Promise<ContactFormResponse> => {
  const response = await apiClient.post<ContactFormResponse>('/contact/', data)
  return response.data
}
