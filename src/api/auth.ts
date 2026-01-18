import apiClient from './client'
import type { User, LoginResponse, UserType } from '@/types'
import { TOKEN_KEY, REFRESH_TOKEN_KEY } from '@/lib/constants'

/**
 * Authentication API services
 */

// Backend user response type (snake_case)
interface BackendUser {
  id: string
  email: string
  first_name: string
  last_name: string
  full_name: string
  phone_number?: string
  profile_photo_url?: string
  user_type: string
  date_joined: string
  last_login?: string
}

// Admin user response from /admin/me/
interface AdminMeResponse {
  id: string
  email: string
  name: string
  role: 'owner' | 'staff' | 'manager'
  is_trainer: boolean
  trainer_id: string | null
  last_login: string | null
}

// Transform backend user (snake_case) to frontend user (camelCase)
const transformUser = (backendUser: BackendUser): User => ({
  id: backendUser.id,
  email: backendUser.email,
  firstName: backendUser.first_name,
  lastName: backendUser.last_name,
  fullName: backendUser.full_name,
  phoneNumber: backendUser.phone_number,
  profilePhotoUrl: backendUser.profile_photo_url,
  userType: (backendUser.user_type || 'customer') as User['userType'],
  dateJoined: backendUser.date_joined,
  lastLogin: backendUser.last_login,
})

/**
 * Fetch admin role from /admin/me/ endpoint
 * Returns user type and trainer info, or defaults to 'customer' if not authorized
 */
export const fetchAdminRole = async (): Promise<{
  userType: UserType
  isTrainer: boolean
  trainerId: string | null
}> => {
  try {
    const response = await apiClient.get<AdminMeResponse>('/admin/me/')
    // Map backend role to frontend userType
    const roleToUserType: Record<string, UserType> = {
      owner: 'admin',
      manager: 'manager',
      staff: 'staff',
    }
    return {
      userType: roleToUserType[response.data.role] || 'staff',
      isTrainer: response.data.is_trainer,
      trainerId: response.data.trainer_id,
    }
  } catch {
    // If 403/404, user is not staff - they're a customer
    return {
      userType: 'customer',
      isTrainer: false,
      trainerId: null,
    }
  }
}

/**
 * Enhance user with admin role info
 */
const enhanceUserWithRole = async (user: User): Promise<User> => {
  const roleInfo = await fetchAdminRole()
  return {
    ...user,
    userType: roleInfo.userType,
    isTrainer: roleInfo.isTrainer,
    trainerId: roleInfo.trainerId || undefined,
  }
}

/**
 * Login with Google OAuth token
 * @param credential - The JWT credential (id_token) from Google Sign-In
 */
export const googleLogin = async (credential: string): Promise<LoginResponse> => {
  // Google Sign-In returns a JWT credential (id_token)
  // Send as id_token for dj-rest-auth/allauth SocialLoginView
  const response = await apiClient.post<{ access: string; refresh: string; user: BackendUser }>('/auth/google/', {
    id_token: credential,
  })

  // Store tokens temporarily so enhanceUserWithRole can make authenticated request
  localStorage.setItem(TOKEN_KEY, response.data.access)
  localStorage.setItem(REFRESH_TOKEN_KEY, response.data.refresh)

  // Fetch admin role to determine user type
  const baseUser = transformUser(response.data.user)
  const enhancedUser = await enhanceUserWithRole(baseUser)

  return {
    access: response.data.access,
    refresh: response.data.refresh,
    user: enhancedUser,
  }
}

/**
 * Get current authenticated user
 */
export const getCurrentUser = async (): Promise<User> => {
  const response = await apiClient.get<BackendUser>('/auth/me/')
  return transformUser(response.data)
}

/**
 * Update current user profile
 */
export const updateProfile = async (data: {
  firstName?: string
  lastName?: string
  phoneNumber?: string
}): Promise<User> => {
  const response = await apiClient.patch<BackendUser>('/auth/me/', {
    first_name: data.firstName,
    last_name: data.lastName,
    phone_number: data.phoneNumber,
  })
  return transformUser(response.data)
}

/**
 * Logout - invalidate tokens on the server
 */
export const logout = async (): Promise<void> => {
  try {
    await apiClient.post('/auth/logout/')
  } catch {
    // Ignore errors during logout
  }
}

/**
 * Check authentication status
 */
export const checkAuthStatus = async (): Promise<{
  isAuthenticated: boolean
  user?: User
}> => {
  const response = await apiClient.get<{
    is_authenticated: boolean
    user?: BackendUser
  }>('/auth/status/')
  return {
    isAuthenticated: response.data.is_authenticated,
    user: response.data.user ? transformUser(response.data.user) : undefined,
  }
}

/**
 * Refresh access token
 */
export const refreshAccessToken = async (refreshToken: string): Promise<string> => {
  const response = await apiClient.post<{ access: string }>('/auth/token/refresh/', {
    refresh: refreshToken,
  })
  return response.data.access
}

/**
 * Login with email and password
 */
export const emailLogin = async (email: string, password: string): Promise<LoginResponse> => {
  const response = await apiClient.post<{ access: string; refresh: string; user: BackendUser }>('/auth/login/', {
    email,
    password,
  })

  // Store tokens temporarily so enhanceUserWithRole can make authenticated request
  localStorage.setItem(TOKEN_KEY, response.data.access)
  localStorage.setItem(REFRESH_TOKEN_KEY, response.data.refresh)

  // Fetch admin role to determine user type
  const baseUser = transformUser(response.data.user)
  const enhancedUser = await enhanceUserWithRole(baseUser)

  return {
    access: response.data.access,
    refresh: response.data.refresh,
    user: enhancedUser,
  }
}

/**
 * Request password reset - sends email with reset link
 */
export const requestPasswordReset = async (email: string): Promise<void> => {
  await apiClient.post('/auth/password/reset/', { email })
}

/**
 * Confirm password reset with token
 */
export const confirmPasswordReset = async (data: {
  uid: string
  token: string
  newPassword1: string
  newPassword2: string
}): Promise<void> => {
  await apiClient.post('/auth/password/reset/confirm/', {
    uid: data.uid,
    token: data.token,
    new_password1: data.newPassword1,
    new_password2: data.newPassword2,
  })
}

/**
 * Change password for authenticated user
 * Note: This endpoint doesn't require the old password when using JWT auth
 */
export const changePassword = async (data: {
  newPassword1: string
  newPassword2: string
}): Promise<void> => {
  await apiClient.post('/auth/password/change/', {
    new_password1: data.newPassword1,
    new_password2: data.newPassword2,
  })
}
