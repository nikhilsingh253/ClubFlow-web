import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { User, Mail, Phone, Bell, Calendar, UserPlus, Check, Clock, Lock, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuthStore } from '@/store/authStore'
import { updateProfile, changePassword } from '@/api/auth'
import { getCustomerProfile, updateCustomerProfile, getNotificationSettings, updateNotificationSettings, type NotificationSettings } from '@/api/customer'
import LoadingSpinner from '@/components/common/LoadingSpinner'

const REMINDER_TIMING_OPTIONS = [
  { value: '1h', label: '1 hour before' },
  { value: '2h', label: '2 hours before' },
  { value: '24h', label: '24 hours before' },
  { value: '48h', label: '48 hours before' },
] as const

export default function ProfilePage() {
  const queryClient = useQueryClient()
  const { user, updateUser } = useAuthStore()

  // Form state for user fields
  const [firstName, setFirstName] = useState(user?.firstName || '')
  const [lastName, setLastName] = useState(user?.lastName || '')
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '')

  // Form state for customer fields
  const [emergencyContactName, setEmergencyContactName] = useState('')
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')

  // Track if form has changes
  const [hasUserChanges, setHasUserChanges] = useState(false)
  const [hasCustomerChanges, setHasCustomerChanges] = useState(false)

  // Fetch customer profile
  const { data: customer, isLoading: isLoadingCustomer } = useQuery({
    queryKey: ['customerProfile'],
    queryFn: getCustomerProfile,
  })

  // Fetch notification settings
  const { data: notificationSettings, isLoading: isLoadingNotifications } = useQuery({
    queryKey: ['notificationSettings'],
    queryFn: getNotificationSettings,
  })

  // Populate customer fields when data loads
  useEffect(() => {
    if (customer) {
      setEmergencyContactName(customer.emergencyContactName || '')
      setEmergencyContactPhone(customer.emergencyContactPhone || '')
      setDateOfBirth(customer.dateOfBirth || '')
    }
  }, [customer])

  // Update user profile mutation
  const updateUserMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (updatedUser) => {
      updateUser(updatedUser)
      setHasUserChanges(false)
      toast.success('Profile updated successfully')
    },
    onError: () => {
      toast.error('Failed to update profile')
    },
  })

  // Update customer profile mutation
  const updateCustomerMutation = useMutation({
    mutationFn: updateCustomerProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customerProfile'] })
      setHasCustomerChanges(false)
      toast.success('Emergency contact updated')
    },
    onError: () => {
      toast.error('Failed to update emergency contact')
    },
  })

  // Update notification settings mutation
  const updateNotificationsMutation = useMutation({
    mutationFn: updateNotificationSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notificationSettings'] })
      toast.success('Notification preferences updated')
    },
    onError: () => {
      toast.error('Failed to update notification preferences')
    },
  })

  // Handle user form changes
  const handleUserChange = (field: string, value: string) => {
    switch (field) {
      case 'firstName':
        setFirstName(value)
        break
      case 'lastName':
        setLastName(value)
        break
      case 'phoneNumber':
        setPhoneNumber(value)
        break
    }
    setHasUserChanges(true)
  }

  // Handle customer form changes
  const handleCustomerChange = (field: string, value: string) => {
    switch (field) {
      case 'emergencyContactName':
        setEmergencyContactName(value)
        break
      case 'emergencyContactPhone':
        setEmergencyContactPhone(value)
        break
      case 'dateOfBirth':
        setDateOfBirth(value)
        break
    }
    setHasCustomerChanges(true)
  }

  // Handle notification toggle
  const handleNotificationToggle = (key: keyof NotificationSettings, value: boolean | string) => {
    if (notificationSettings) {
      updateNotificationsMutation.mutate({ [key]: value })
    }
  }

  // Handle user profile submit
  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateUserMutation.mutate({
      firstName: firstName || undefined,
      lastName: lastName || undefined,
      phoneNumber: phoneNumber || undefined,
    })
  }

  // Handle customer profile submit
  const handleCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateCustomerMutation.mutate({
      emergencyContactName: emergencyContactName || undefined,
      emergencyContactPhone: emergencyContactPhone || null,
      dateOfBirth: dateOfBirth || null,
    })
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-semibold text-foreground">
          My Profile
        </h1>
        <p className="mt-2 text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Profile Info */}
      <div className="p-6 bg-white rounded-xl border border-border">
        <div className="flex items-center gap-6 mb-6">
          {user?.profilePhotoUrl ? (
            <img
              src={user.profilePhotoUrl}
              alt={user.fullName}
              className="h-20 w-20 rounded-full object-cover"
            />
          ) : (
            <div className="h-20 w-20 rounded-full bg-blush-100 flex items-center justify-center">
              <User className="h-10 w-10 text-blush-400" />
            </div>
          )}
          <div>
            <h2 className="font-display text-xl font-semibold text-foreground">
              {user?.fullName || 'User'}
            </h2>
            <p className="text-muted-foreground">{user?.email}</p>
          </div>
        </div>

        <form onSubmit={handleUserSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                First Name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => handleUserChange('firstName', e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-blush-400 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Last Name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => handleUserChange('lastName', e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-blush-400 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              <Mail className="h-4 w-4 inline mr-2" />
              Email
            </label>
            <input
              type="email"
              defaultValue={user?.email}
              disabled
              className="w-full px-4 py-3 rounded-lg border border-border bg-taupe-50 text-muted-foreground cursor-not-allowed"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Email cannot be changed
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              <Phone className="h-4 w-4 inline mr-2" />
              Phone Number
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => handleUserChange('phoneNumber', e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-blush-400 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            disabled={!hasUserChanges || updateUserMutation.isPending}
            className="btn-elegant-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {updateUserMutation.isPending ? (
              <>
                <LoadingSpinner size="sm" />
                Saving...
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                Save Changes
              </>
            )}
          </button>
        </form>
      </div>

      {/* Emergency Contact */}
      <div className="p-6 bg-white rounded-xl border border-border">
        <h2 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <UserPlus className="h-5 w-5 text-blush-600" />
          Emergency Contact
        </h2>

        {isLoadingCustomer ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : (
          <form onSubmit={handleCustomerSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Contact Name
                </label>
                <input
                  type="text"
                  value={emergencyContactName}
                  onChange={(e) => handleCustomerChange('emergencyContactName', e.target.value)}
                  placeholder="Emergency contact name"
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-blush-400 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  value={emergencyContactPhone}
                  onChange={(e) => handleCustomerChange('emergencyContactPhone', e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-blush-400 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                <Calendar className="h-4 w-4 inline mr-2" />
                Date of Birth
              </label>
              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => handleCustomerChange('dateOfBirth', e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-blush-400 focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              disabled={!hasCustomerChanges || updateCustomerMutation.isPending}
              className="btn-elegant-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {updateCustomerMutation.isPending ? (
                <>
                  <LoadingSpinner size="sm" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  Save Emergency Contact
                </>
              )}
            </button>
          </form>
        )}
      </div>

      {/* Change Password */}
      <ChangePasswordSection />

      {/* Notification Preferences */}
      <div className="p-6 bg-white rounded-xl border border-border">
        <h2 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Bell className="h-5 w-5 text-blush-600" />
          Notification Preferences
        </h2>

        {isLoadingNotifications ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : notificationSettings ? (
          <div className="space-y-6">
            {/* Reminder Timing */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Reminder Timing
              </label>
              <select
                value={notificationSettings.reminderTiming}
                onChange={(e) => handleNotificationToggle('reminderTiming', e.target.value as NotificationSettings['reminderTiming'])}
                disabled={updateNotificationsMutation.isPending}
                className="w-full md:w-64 px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-blush-400 focus:border-transparent"
              >
                {REMINDER_TIMING_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            {/* Email Notifications */}
            <div>
              <h3 className="text-sm font-medium text-foreground mb-3">Email Notifications</h3>
              <div className="space-y-3">
                <NotificationToggle
                  label="Class Reminders"
                  description="Get reminded about upcoming classes"
                  checked={notificationSettings.emailReminders}
                  onChange={(v) => handleNotificationToggle('emailReminders', v)}
                  disabled={updateNotificationsMutation.isPending}
                />
                <NotificationToggle
                  label="Booking Confirmations"
                  description="Receive email when you book a class"
                  checked={notificationSettings.emailBookingConfirmations}
                  onChange={(v) => handleNotificationToggle('emailBookingConfirmations', v)}
                  disabled={updateNotificationsMutation.isPending}
                />
                <NotificationToggle
                  label="Membership Updates"
                  description="Updates about your membership status"
                  checked={notificationSettings.emailMembershipUpdates}
                  onChange={(v) => handleNotificationToggle('emailMembershipUpdates', v)}
                  disabled={updateNotificationsMutation.isPending}
                />
                <NotificationToggle
                  label="Waitlist Notifications"
                  description="Get notified when a spot opens up"
                  checked={notificationSettings.emailWaitlistNotifications}
                  onChange={(v) => handleNotificationToggle('emailWaitlistNotifications', v)}
                  disabled={updateNotificationsMutation.isPending}
                />
                <NotificationToggle
                  label="Marketing & Promotions"
                  description="Receive news and special offers"
                  checked={notificationSettings.emailMarketing}
                  onChange={(v) => handleNotificationToggle('emailMarketing', v)}
                  disabled={updateNotificationsMutation.isPending}
                />
              </div>
            </div>

            {/* SMS Notifications */}
            <div>
              <h3 className="text-sm font-medium text-foreground mb-3">SMS Notifications</h3>
              <div className="space-y-3">
                <NotificationToggle
                  label="Class Reminders"
                  description="Receive SMS reminders for classes"
                  checked={notificationSettings.smsReminders}
                  onChange={(v) => handleNotificationToggle('smsReminders', v)}
                  disabled={updateNotificationsMutation.isPending}
                />
                <NotificationToggle
                  label="Marketing Messages"
                  description="Receive promotional SMS"
                  checked={notificationSettings.smsMarketing}
                  onChange={(v) => handleNotificationToggle('smsMarketing', v)}
                  disabled={updateNotificationsMutation.isPending}
                />
              </div>
            </div>

            {/* Push Notifications */}
            <div>
              <h3 className="text-sm font-medium text-foreground mb-3">Push Notifications</h3>
              <div className="space-y-3">
                <NotificationToggle
                  label="Class Reminders"
                  description="Push notifications for upcoming classes"
                  checked={notificationSettings.pushReminders}
                  onChange={(v) => handleNotificationToggle('pushReminders', v)}
                  disabled={updateNotificationsMutation.isPending}
                />
                <NotificationToggle
                  label="General Updates"
                  description="Studio news and updates"
                  checked={notificationSettings.pushUpdates}
                  onChange={(v) => handleNotificationToggle('pushUpdates', v)}
                  disabled={updateNotificationsMutation.isPending}
                />
              </div>
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground">Unable to load notification preferences.</p>
        )}
      </div>
    </div>
  )
}

// Change Password Section Component
function ChangePasswordSection() {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const changePasswordMutation = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      setNewPassword('')
      setConfirmPassword('')
      toast.success('Password changed successfully')
    },
    onError: (error: Error & { response?: { data?: { new_password2?: string[]; non_field_errors?: string[] } } }) => {
      const errorData = error.response?.data
      if (errorData?.new_password2) {
        toast.error(errorData.new_password2[0])
      } else if (errorData?.non_field_errors) {
        toast.error(errorData.non_field_errors[0])
      } else {
        toast.error('Failed to change password')
      }
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    changePasswordMutation.mutate({
      newPassword1: newPassword,
      newPassword2: confirmPassword,
    })
  }

  const isFormValid = newPassword.length >= 8 && newPassword === confirmPassword

  return (
    <div className="p-6 bg-white rounded-xl border border-border">
      <h2 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <Lock className="h-5 w-5 text-blush-600" />
        Change Password
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            New Password
          </label>
          <div className="relative">
            <input
              type={showNewPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full px-4 py-3 pr-12 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-blush-400 focus:border-transparent"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Must be at least 8 characters
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Confirm New Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="w-full px-4 py-3 pr-12 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-blush-400 focus:border-transparent"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {confirmPassword && newPassword !== confirmPassword && (
            <p className="text-xs text-red-500 mt-1">
              Passwords do not match
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={!isFormValid || changePasswordMutation.isPending}
          className="btn-elegant-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {changePasswordMutation.isPending ? (
            <>
              <LoadingSpinner size="sm" />
              Changing Password...
            </>
          ) : (
            <>
              <Lock className="h-4 w-4" />
              Change Password
            </>
          )}
        </button>
      </form>
    </div>
  )
}

// Toggle component for notification settings
function NotificationToggle({
  label,
  description,
  checked,
  onChange,
  disabled,
}: {
  label: string
  description: string
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
}) {
  return (
    <label className="flex items-center justify-between cursor-pointer">
      <div>
        <p className="font-medium text-foreground">{label}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blush-400 focus:ring-offset-2 disabled:opacity-50 ${
          checked ? 'bg-blush-500' : 'bg-taupe-200'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </label>
  )
}
