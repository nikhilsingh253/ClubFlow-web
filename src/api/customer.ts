import apiClient from './client'

// Backend customer response type
interface BackendCustomer {
  id: string
  user: string
  membership_number: string
  emergency_contact_name: string
  emergency_contact_phone: string | null
  date_of_birth: string | null
  notes: string
  created_at: string
  updated_at: string
}

// Frontend customer type
export interface Customer {
  id: string
  membershipNumber: string
  emergencyContactName: string
  emergencyContactPhone: string | null
  dateOfBirth: string | null
}

const transformCustomer = (data: BackendCustomer): Customer => ({
  id: data.id,
  membershipNumber: data.membership_number,
  emergencyContactName: data.emergency_contact_name,
  emergencyContactPhone: data.emergency_contact_phone,
  dateOfBirth: data.date_of_birth,
})

/**
 * Get current customer profile
 */
export const getCustomerProfile = async (): Promise<Customer> => {
  const response = await apiClient.get<BackendCustomer>('/customers/me/')
  return transformCustomer(response.data)
}

/**
 * Update customer profile (emergency contact, DOB)
 */
export const updateCustomerProfile = async (data: {
  emergencyContactName?: string
  emergencyContactPhone?: string | null
  dateOfBirth?: string | null
}): Promise<Customer> => {
  const response = await apiClient.patch<BackendCustomer>('/customers/me/', {
    emergency_contact_name: data.emergencyContactName,
    emergency_contact_phone: data.emergencyContactPhone,
    date_of_birth: data.dateOfBirth,
  })
  return transformCustomer(response.data)
}

// Notification settings types
interface BackendNotificationSettings {
  email_marketing: boolean
  email_reminders: boolean
  email_booking_confirmations: boolean
  email_membership_updates: boolean
  email_waitlist_notifications: boolean
  sms_reminders: boolean
  sms_marketing: boolean
  push_reminders: boolean
  push_updates: boolean
  reminder_timing: '1h' | '2h' | '24h' | '48h'
}

export interface NotificationSettings {
  emailMarketing: boolean
  emailReminders: boolean
  emailBookingConfirmations: boolean
  emailMembershipUpdates: boolean
  emailWaitlistNotifications: boolean
  smsReminders: boolean
  smsMarketing: boolean
  pushReminders: boolean
  pushUpdates: boolean
  reminderTiming: '1h' | '2h' | '24h' | '48h'
}

const transformNotificationSettings = (data: BackendNotificationSettings): NotificationSettings => ({
  emailMarketing: data.email_marketing,
  emailReminders: data.email_reminders,
  emailBookingConfirmations: data.email_booking_confirmations,
  emailMembershipUpdates: data.email_membership_updates,
  emailWaitlistNotifications: data.email_waitlist_notifications,
  smsReminders: data.sms_reminders,
  smsMarketing: data.sms_marketing,
  pushReminders: data.push_reminders,
  pushUpdates: data.push_updates,
  reminderTiming: data.reminder_timing,
})

/**
 * Get notification settings
 */
export const getNotificationSettings = async (): Promise<NotificationSettings> => {
  const response = await apiClient.get<BackendNotificationSettings>('/customers/me/notification-settings/')
  return transformNotificationSettings(response.data)
}

/**
 * Update notification settings
 */
export const updateNotificationSettings = async (data: Partial<NotificationSettings>): Promise<NotificationSettings> => {
  const response = await apiClient.patch<BackendNotificationSettings>('/customers/me/notification-settings/', {
    email_marketing: data.emailMarketing,
    email_reminders: data.emailReminders,
    email_booking_confirmations: data.emailBookingConfirmations,
    email_membership_updates: data.emailMembershipUpdates,
    email_waitlist_notifications: data.emailWaitlistNotifications,
    sms_reminders: data.smsReminders,
    sms_marketing: data.smsMarketing,
    push_reminders: data.pushReminders,
    push_updates: data.pushUpdates,
    reminder_timing: data.reminderTiming,
  })
  return transformNotificationSettings(response.data)
}
