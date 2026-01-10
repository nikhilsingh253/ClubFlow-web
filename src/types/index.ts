/**
 * Core type definitions for the FitRit application
 */

// ============================================
// User & Authentication Types
// ============================================

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  fullName: string
  phoneNumber?: string
  profilePhotoUrl?: string
  userType: UserType
  dateJoined: string
  lastLogin?: string
}

export type UserType = 'customer' | 'staff' | 'trainer' | 'manager' | 'admin'

export interface AuthTokens {
  access: string
  refresh: string
}

export interface LoginResponse {
  access: string
  refresh: string
  user: User
}

// ============================================
// Membership Types
// ============================================

export interface MembershipPlan {
  id: string
  name: string
  description: string
  price: number
  currency: string
  durationMonths: number
  features: string[]
  classesPerMonth: number | null // null = unlimited
  isPopular?: boolean
  isActive: boolean
}

export interface Membership {
  id: string
  plan: MembershipPlan
  status: MembershipStatus
  startDate: string
  endDate: string
  autoRenew: boolean
  classesRemaining: number | null
  card?: MembershipCard
  freezeStartDate?: string
  freezeEndDate?: string
}

export type MembershipStatus = 'active' | 'expired' | 'frozen' | 'cancelled' | 'pending'

export interface MembershipCard {
  id: string
  cardNumber: string
  isActive: boolean
  issuedAt: string
}

// ============================================
// Class Types
// ============================================

export interface ClassType {
  id: string
  name: string
  description: string
  durationMinutes: number
  level: ClassLevel
  colorCode: string
  icon?: string
  maxCapacity: number
}

export type ClassLevel = 'intro' | 'foundation' | 'intermediate' | 'advanced'

export interface Instructor {
  id: string
  firstName: string
  lastName: string
  fullName: string
  bio: string
  photoUrl?: string
  specializations: string[]
  certifications: string[]
}

export interface ClassSchedule {
  id: string
  classType: ClassType
  instructor: Instructor
  date: string
  startTime: string
  endTime: string
  room?: string
  maxCapacity: number
  bookedCount: number
  waitlistCount: number
  status: ClassScheduleStatus
}

export type ClassScheduleStatus = 'scheduled' | 'cancelled' | 'completed'

// ============================================
// Booking Types
// ============================================

export interface Booking {
  id: string
  classSchedule: ClassSchedule
  status: BookingStatus
  bookedAt: string
  checkedInAt?: string
  cancelledAt?: string
  cancellationReason?: string
}

export type BookingStatus = 'confirmed' | 'cancelled' | 'completed' | 'no_show' | 'waitlisted'

export interface WaitlistEntry {
  id: string
  classSchedule: ClassSchedule
  position: number
  joinedAt: string
}

// ============================================
// Billing Types
// ============================================

export interface Invoice {
  id: string
  invoiceNumber: string
  status: InvoiceStatus
  subtotal: number
  taxAmount: number
  cgst: number
  sgst: number
  total: number
  currency: string
  issuedDate: string
  dueDate: string
  paidDate?: string
  lineItems: InvoiceLineItem[]
  downloadUrl?: string
}

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'

export interface InvoiceLineItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  total: number
}

export interface Payment {
  id: string
  invoice?: Invoice
  amount: number
  currency: string
  status: PaymentStatus
  method: PaymentMethod
  transactionId?: string
  paidAt: string
}

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded'
export type PaymentMethod = 'upi' | 'card' | 'netbanking' | 'wallet' | 'cash' | 'bank_transfer'

// ============================================
// API Response Types
// ============================================

export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export interface ApiError {
  code: string
  message: string
  field?: string
  details?: Record<string, string[]>
}

// ============================================
// Form Types
// ============================================

export interface ContactFormData {
  name: string
  email: string
  phone?: string
  message: string
}

export interface ProfileFormData {
  firstName: string
  lastName: string
  phoneNumber?: string
}

// ============================================
// UI Types
// ============================================

export interface NavItem {
  label: string
  href: string
  icon?: string
}

export interface Testimonial {
  id: string
  name: string
  role?: string
  content: string
  photoUrl?: string
  rating: number
}
