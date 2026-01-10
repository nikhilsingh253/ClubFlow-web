/**
 * Application constants
 */

// Brand
export const APP_NAME = 'FitRit'
export const APP_TAGLINE = 'Transform Your Body, Elevate Your Mind'
export const SYSTEM_NAME = 'ClubFlow' // Internal CRM name

// API
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1'

// Auth
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''
export const TOKEN_KEY = 'fitrit_access_token'
export const REFRESH_TOKEN_KEY = 'fitrit_refresh_token'

// Routes
export const ROUTES = {
  // Public
  HOME: '/',
  ABOUT: '/about',
  CLASSES: '/classes',
  SCHEDULE: '/schedule',
  INSTRUCTORS: '/instructors',
  PRICING: '/pricing',
  CONTACT: '/contact',
  TRIAL: '/trial',
  FAQ: '/faq',

  // Auth
  LOGIN: '/login',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  AUTH_CALLBACK: '/auth/callback',

  // Portal (authenticated)
  PORTAL: '/portal',
  PORTAL_BOOKINGS: '/portal/bookings',
  PORTAL_SCHEDULE: '/portal/schedule',
  PORTAL_MEMBERSHIP: '/portal/membership',
  PORTAL_INVOICES: '/portal/invoices',
  PORTAL_PROFILE: '/portal/profile',
} as const

// Class levels
export const CLASS_LEVELS = [
  { value: 'intro', label: 'Intro', description: 'Perfect for beginners' },
  { value: 'foundation', label: 'Foundation', description: 'Build your base' },
  { value: 'intermediate', label: 'Intermediate', description: 'Challenge yourself' },
  { value: 'advanced', label: 'Advanced', description: 'Master your practice' },
] as const

// Membership status
export const MEMBERSHIP_STATUS = {
  ACTIVE: 'active',
  EXPIRED: 'expired',
  FROZEN: 'frozen',
  CANCELLED: 'cancelled',
  PENDING: 'pending',
} as const

// Booking status
export const BOOKING_STATUS = {
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
  NO_SHOW: 'no_show',
  WAITLISTED: 'waitlisted',
} as const

// Invoice status
export const INVOICE_STATUS = {
  DRAFT: 'draft',
  SENT: 'sent',
  PAID: 'paid',
  OVERDUE: 'overdue',
  CANCELLED: 'cancelled',
} as const

// Contact info (placeholder)
export const CONTACT = {
  ADDRESS: '123 Wellness Street, Gurgaon, Haryana 122001',
  PHONE: '+91 98765 43210',
  EMAIL: 'hello@fitrit.in',
  HOURS: {
    weekdays: '6:00 AM - 9:00 PM',
    saturday: '7:00 AM - 6:00 PM',
    sunday: '8:00 AM - 2:00 PM',
  },
}

// Social links (placeholder)
export const SOCIAL_LINKS = {
  INSTAGRAM: 'https://instagram.com/fitrit.in',
  FACEBOOK: 'https://facebook.com/fitrit.in',
  YOUTUBE: 'https://youtube.com/@fitrit',
}

// Navigation items
export const NAV_ITEMS = [
  { label: 'Home', href: ROUTES.HOME },
  { label: 'About', href: ROUTES.ABOUT },
  { label: 'Classes', href: ROUTES.CLASSES },
  { label: 'Schedule', href: ROUTES.SCHEDULE },
  { label: 'Instructors', href: ROUTES.INSTRUCTORS },
  { label: 'Pricing', href: ROUTES.PRICING },
  { label: 'Contact', href: ROUTES.CONTACT },
] as const

// Portal navigation items
export const PORTAL_NAV_ITEMS = [
  { label: 'Dashboard', href: ROUTES.PORTAL, icon: 'LayoutDashboard' },
  { label: 'Book a Class', href: ROUTES.PORTAL_SCHEDULE, icon: 'Calendar' },
  { label: 'My Bookings', href: ROUTES.PORTAL_BOOKINGS, icon: 'CalendarCheck' },
  { label: 'Membership', href: ROUTES.PORTAL_MEMBERSHIP, icon: 'CreditCard' },
  { label: 'Invoices', href: ROUTES.PORTAL_INVOICES, icon: 'Receipt' },
  { label: 'Profile', href: ROUTES.PORTAL_PROFILE, icon: 'User' },
] as const
