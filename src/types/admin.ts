/**
 * Admin Dashboard Type Definitions
 * Based on ADMIN_API_SPECIFICATION.md
 */

// ============================================
// Admin User & Roles
// ============================================

export type AdminRole = 'owner' | 'staff'

export interface AdminUser {
  id: number
  email: string
  name: string
  role: AdminRole
  lastLogin: string | null
  permissions?: string[]
}

// ============================================
// Dashboard Types
// ============================================

export interface DashboardStats {
  today: {
    date: string
    classesCount: number
    totalBookings: number
    checkedIn: number
    expectedRemaining: number
  }
  alerts: {
    newTrialBookings: number
    newContactMessages: number
    pendingMembershipRequests: number
    expiringMemberships7Days: number
  }
  quickStats: {
    activeMembers: number
    newMembersThisMonth: number
    revenueThisMonth: number
  }
}

export interface TodayClass {
  id: number
  classType: {
    id: number
    name: string
    color: string
  }
  trainer: {
    id: number
    name: string
  }
  startTime: string
  endTime: string
  location: string
  booked: number
  capacity: number
  checkedIn: number
  status: 'upcoming' | 'in_progress' | 'completed' | 'cancelled'
}

// ============================================
// Customer Types
// ============================================

export interface AdminCustomerListItem {
  id: number
  cardNumber: string
  name: string
  email: string
  phone: string
  membershipStatus: 'active' | 'expired' | 'frozen' | 'none'
  membershipPlan: string | null
  classesRemaining: number | null
  lastVisit: string | null
  createdAt: string
}

export interface AdminCustomerDetail {
  id: number
  cardNumber: string
  name: string
  email: string
  phone: string
  dateOfBirth: string | null
  emergencyContactName: string | null
  emergencyContactPhone: string | null
  healthNotes: string | null
  source: CustomerSource | null
  createdAt: string
  user: {
    id: number
    email: string
    isActive: boolean
  } | null
  currentMembership: AdminMembership | null
  stats: {
    totalClassesAttended: number
    classesThisMonth: number
    noShows: number
    memberSinceDays: number
  }
}

export type CustomerSource = 'walk_in' | 'website' | 'referral' | 'instagram' | 'facebook' | 'google' | 'other'

export interface AdminCustomerNote {
  id: number
  note: string
  createdBy: {
    id: number
    name: string
  }
  createdAt: string
}

// ============================================
// Membership Types
// ============================================

export interface AdminMembership {
  id: number
  customer?: {
    id: number
    name: string
    email: string
    phone: string
  }
  plan: {
    id: number
    name: string
    price?: number
  }
  status: AdminMembershipStatus
  startDate: string
  endDate: string
  classesTotal: number | null
  classesUsed: number
  classesRemaining: number | null
  daysRemaining?: number
  autoRenew: boolean
  freezeStart?: string
  freezeEnd?: string
}

export type AdminMembershipStatus = 'active' | 'expired' | 'frozen' | 'cancelled'

// ============================================
// Class Schedule Types
// ============================================

export interface AdminSchedule {
  id: number
  classType: {
    id: number
    name: string
    color: string
    level: string
  }
  trainer: {
    id: number
    name: string
  }
  date: string
  startTime: string
  endTime: string
  location: string
  maxCapacity: number
  bookedCount: number
  attendedCount: number
  waitlistCount: number
  status: 'scheduled' | 'cancelled'
  notes: string
}

export interface AdminScheduleDetail extends AdminSchedule {
  bookings: AdminBookingListItem[]
  waitlist: AdminWaitlistEntry[]
}

// ============================================
// Booking Types
// ============================================

export interface AdminBookingListItem {
  id: number
  customer: {
    id: number
    name: string
    cardNumber: string
    phone?: string
  }
  classSchedule: {
    id: number
    classType: string
    date: string
    startTime: string
    trainer: string
  }
  status: AdminBookingStatus
  bookedAt: string
  isTrial: boolean
  isComp: boolean
  checkedInAt?: string
}

export type AdminBookingStatus = 'confirmed' | 'attended' | 'cancelled' | 'no_show'

// ============================================
// Attendance Types
// ============================================

export interface CheckInLookupResult {
  customer: {
    id: number
    name: string
    cardNumber: string
    photoUrl: string | null
  }
  membership: {
    status: AdminMembershipStatus | 'none'
    plan: string | null
    classesRemaining: number | null
  }
  todayBooking: {
    id: number
    classSchedule: {
      id: number
      classType: string
      startTime: string
    }
    status: AdminBookingStatus
  } | null
  actionAvailable: 'check_in' | 'already_checked_in' | 'no_booking' | 'membership_expired' | 'not_found'
}

export interface ClassAttendance {
  schedule: {
    id: number
    classType: string
    date: string
    startTime: string
  }
  summary: {
    totalBooked: number
    attended: number
    noShow: number
    pending: number
  }
  bookings: Array<{
    id: number
    customer: {
      id: number
      name: string
      cardNumber: string
    }
    status: AdminBookingStatus
    checkedInAt: string | null
  }>
}

// ============================================
// Trial Booking Types
// ============================================

export interface AdminTrialBooking {
  id: number
  name: string
  email: string
  phone: string
  preferredTime: string
  notes: string | null
  staffNotes: string | null
  status: TrialBookingStatus
  scheduledClass: {
    id: number
    classType: string
    date: string
    startTime: string
  } | null
  createdAt: string
}

export type TrialBookingStatus = 'new' | 'contacted' | 'scheduled' | 'completed' | 'converted' | 'lost'

export type TrialLostReason = 'price_concern' | 'timing_issue' | 'not_interested' | 'competitor' | 'no_response' | 'other'

// ============================================
// Contact Message Types
// ============================================

export interface AdminContactMessage {
  id: number
  name: string
  email: string
  phone: string | null
  message: string
  staffNotes: string | null
  status: ContactMessageStatus
  createdAt: string
}

export type ContactMessageStatus = 'new' | 'in_progress' | 'resolved'

// ============================================
// Invoice Types
// ============================================

export interface AdminInvoice {
  id: number
  invoiceNumber: string
  customer: {
    id: number
    name: string
    email?: string
    phone?: string
    address?: string
  }
  lineItems: AdminInvoiceLineItem[]
  subtotal: number
  cgstRate: number
  cgst: number
  sgstRate: number
  sgst: number
  total: number
  status: AdminInvoiceStatus
  dueDate: string
  payment: {
    method: PaymentMethod
    reference: string
    paidDate: string
    paidAmount: number
  } | null
  notes: string
  createdAt: string
}

export interface AdminInvoiceLineItem {
  description: string
  hsnSac?: string
  quantity: number
  unitPrice: number
  amount: number
}

export type AdminInvoiceStatus = 'pending' | 'paid' | 'overdue' | 'cancelled'

export type PaymentMethod = 'cash' | 'upi' | 'card' | 'bank_transfer' | 'cheque'

// ============================================
// Waitlist Types
// ============================================

export interface AdminWaitlistEntry {
  id: number
  customer: {
    id: number
    name: string
    phone: string
  }
  classSchedule: {
    id: number
    classType: string
    date: string
    startTime: string
  }
  position: number
  status: 'waiting' | 'notified' | 'expired' | 'booked' | 'cancelled'
  joinedAt: string
}

// ============================================
// Membership Request Types
// ============================================

export interface AdminMembershipRequest {
  id: number
  customer: {
    id: number
    name: string
  }
  membership: {
    id: number
    plan: string
  }
  requestType: 'freeze' | 'cancel'
  reason: string
  freezeStart?: string
  freezeEnd?: string
  status: 'pending' | 'approved' | 'denied'
  createdAt: string
}

// ============================================
// Owner-Only: Configuration Types
// ============================================

export interface AdminClassType {
  id: number
  name: string
  slug: string
  description: string
  level: 'beginner' | 'intermediate' | 'advanced' | 'all_levels'
  durationMinutes: number
  maxCapacity: number
  color: string
  imageUrl: string | null
  isActive: boolean
  displayOrder: number
}

export interface AdminMembershipPlan {
  id: number
  name: string
  slug: string
  description: string
  price: number
  classesPerMonth: number | null
  durationDays: number
  features: string[]
  isPopular: boolean
  isActive: boolean
  displayOrder: number
}

export interface AdminTrainer {
  id: number
  name: string
  email: string
  phone: string
  bio: string
  yearsExperience: number
  specializations: string[]
  certifications: string[]
  photoUrl: string | null
  isActive: boolean
  displayOrder: number
}

export interface AdminStaffMember {
  id: number
  name: string
  email: string
  role: AdminRole
  isActive: boolean
  lastLogin: string | null
  createdAt: string
}

export interface StudioConfig {
  name: string
  addressLine1: string
  addressLine2: string
  city: string
  state: string
  pincode: string
  phone: string
  email: string
  website: string
  logoUrl: string | null
  socialLinks: {
    instagram: string
    facebook: string
  }
  operatingHours: {
    [key: string]: {
      open: string | null
      close: string | null
    }
  }
  gstin: string
  hsnSacCode: string
  invoicePrefix: string
  policies: {
    advanceBookingDays: number
    cancellationHours: number
    lateCancelPenalty: boolean
    noShowPenalty: boolean
    waitlistEnabled: boolean
    autoBookFromWaitlist: boolean
  }
}

// ============================================
// Report Types
// ============================================

export interface AttendanceReport {
  period: { from: string; to: string }
  summary: {
    totalClasses: number
    totalBookings: number
    totalAttended: number
    totalNoShows: number
    totalCancelled: number
    attendanceRate: number
    avgClassSize: number
  }
  breakdown: Array<{
    date: string
    classes: number
    bookings: number
    attended: number
    noShows: number
    attendanceRate: number
  }>
}

export interface RevenueReport {
  period: { from: string; to: string }
  summary: {
    totalInvoiced: number
    totalCollected: number
    outstanding: number
    avgInvoiceValue: number
  }
  breakdown: Array<{
    date: string
    invoiced: number
    collected: number
    invoiceCount: number
  }>
  byPlan: Array<{
    plan: string
    count: number
    revenue: number
  }>
}

export interface MembershipReport {
  current: {
    totalActive: number
    byPlan: Array<{ plan: string; count: number }>
  }
  expiring: {
    next7Days: number
    next14Days: number
    next30Days: number
  }
  trends: {
    newThisMonth: number
    churnedThisMonth: number
    netGrowth: number
  }
}

export interface TrialConversionReport {
  period: { from: string; to: string }
  summary: {
    totalTrials: number
    converted: number
    lost: number
    pending: number
    conversionRate: number
  }
  bySource: Array<{
    source: string
    trials: number
    converted: number
  }>
  lostReasons: Array<{
    reason: string
    count: number
  }>
}
