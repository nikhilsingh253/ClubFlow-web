/**
 * Admin API Functions
 * Based on ADMIN_API_SPECIFICATION.md
 */

import apiClient from '../client'
import type {
  AdminUser,
  DashboardStats,
  TodayClass,
  AdminCustomerListItem,
  AdminCustomerDetail,
  AdminCustomerNote,
  AdminMembership,
  AdminSchedule,
  AdminScheduleDetail,
  AdminBookingListItem,
  CheckInLookupResult,
  ClassAttendance,
  AdminTrialBooking,
  AdminContactMessage,
  AdminInvoice,
  AdminWaitlistEntry,
  AdminMembershipRequest,
  AdminClassType,
  AdminMembershipPlan,
  AdminTrainer,
  AdminStaffMember,
  StudioConfig,
  CustomerSource,
  TrialBookingStatus,
  TrialLostReason,
  ContactMessageStatus,
  PaymentMethod,
  AdminBookingStatus,
} from '@/types/admin'
import type { PaginatedResponse } from '@/types'

// ============================================
// Helper: Transform snake_case to camelCase
// ============================================

function toCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
}

function transformKeys<T>(obj: unknown): T {
  if (Array.isArray(obj)) {
    return obj.map((item) => transformKeys(item)) as T
  }
  if (obj !== null && typeof obj === 'object') {
    return Object.entries(obj as Record<string, unknown>).reduce(
      (acc, [key, value]) => {
        acc[toCamelCase(key)] = transformKeys(value)
        return acc
      },
      {} as Record<string, unknown>
    ) as T
  }
  return obj as T
}

// ============================================
// Dashboard
// ============================================

export async function getDashboardStats(): Promise<DashboardStats> {
  const response = await apiClient.get('/admin/dashboard/stats/')
  return transformKeys<DashboardStats>(response.data)
}

export async function getTodayClasses(): Promise<TodayClass[]> {
  const response = await apiClient.get('/admin/dashboard/today-classes/')
  return transformKeys<{ classes: TodayClass[] }>(response.data).classes
}

// ============================================
// Admin User
// ============================================

export async function getAdminMe(): Promise<AdminUser> {
  const response = await apiClient.get('/admin/me/')
  return transformKeys<AdminUser>(response.data)
}

// ============================================
// Customers
// ============================================

interface CustomerListParams {
  page?: number
  pageSize?: number
  search?: string
  membershipStatus?: 'active' | 'expired' | 'none'
  membershipPlan?: number
  joinedAfter?: string
  joinedBefore?: string
  ordering?: string
}

export async function getCustomers(
  params: CustomerListParams = {}
): Promise<PaginatedResponse<AdminCustomerListItem>> {
  const response = await apiClient.get('/admin/customers/', {
    params: {
      page: params.page,
      page_size: params.pageSize,
      search: params.search,
      membership_status: params.membershipStatus,
      membership_plan: params.membershipPlan,
      joined_after: params.joinedAfter,
      joined_before: params.joinedBefore,
      ordering: params.ordering,
    },
  })
  return transformKeys<PaginatedResponse<AdminCustomerListItem>>(response.data)
}

export async function getCustomerDetail(id: number): Promise<AdminCustomerDetail> {
  const response = await apiClient.get(`/admin/customers/${id}/`)
  return transformKeys<AdminCustomerDetail>(response.data)
}

export async function createCustomer(data: {
  name: string
  email: string
  phone: string
  dateOfBirth?: string
  emergencyContactName?: string
  emergencyContactPhone?: string
  healthNotes?: string
  source?: CustomerSource
}): Promise<AdminCustomerDetail> {
  const response = await apiClient.post('/admin/customers/', {
    name: data.name,
    email: data.email,
    phone: data.phone,
    date_of_birth: data.dateOfBirth,
    emergency_contact_name: data.emergencyContactName,
    emergency_contact_phone: data.emergencyContactPhone,
    health_notes: data.healthNotes,
    source: data.source,
  })
  return transformKeys<AdminCustomerDetail>(response.data)
}

export async function updateCustomer(
  id: number,
  data: Partial<{
    name: string
    phone: string
    dateOfBirth: string
    emergencyContactName: string
    emergencyContactPhone: string
    healthNotes: string
    source: CustomerSource
  }>
): Promise<AdminCustomerDetail> {
  const response = await apiClient.patch(`/admin/customers/${id}/`, {
    name: data.name,
    phone: data.phone,
    date_of_birth: data.dateOfBirth,
    emergency_contact_name: data.emergencyContactName,
    emergency_contact_phone: data.emergencyContactPhone,
    health_notes: data.healthNotes,
    source: data.source,
  })
  return transformKeys<AdminCustomerDetail>(response.data)
}

export async function getCustomerBookings(
  customerId: number,
  params: { status?: AdminBookingStatus; fromDate?: string; toDate?: string } = {}
): Promise<PaginatedResponse<AdminBookingListItem>> {
  const response = await apiClient.get(`/admin/customers/${customerId}/bookings/`, {
    params: {
      status: params.status,
      from_date: params.fromDate,
      to_date: params.toDate,
    },
  })
  return transformKeys<PaginatedResponse<AdminBookingListItem>>(response.data)
}

export async function getCustomerMemberships(
  customerId: number
): Promise<{ results: AdminMembership[] }> {
  const response = await apiClient.get(`/admin/customers/${customerId}/memberships/`)
  return transformKeys<{ results: AdminMembership[] }>(response.data)
}

export async function getCustomerNotes(customerId: number): Promise<{ results: AdminCustomerNote[] }> {
  const response = await apiClient.get(`/admin/customers/${customerId}/notes/`)
  return transformKeys<{ results: AdminCustomerNote[] }>(response.data)
}

export async function addCustomerNote(customerId: number, note: string): Promise<AdminCustomerNote> {
  const response = await apiClient.post(`/admin/customers/${customerId}/notes/`, { note })
  return transformKeys<AdminCustomerNote>(response.data)
}

// ============================================
// Memberships
// ============================================

interface MembershipListParams {
  page?: number
  pageSize?: number
  status?: 'active' | 'expired' | 'frozen' | 'cancelled'
  plan?: number
  expiringWithinDays?: number
  search?: string
}

export async function getMemberships(
  params: MembershipListParams = {}
): Promise<PaginatedResponse<AdminMembership>> {
  const response = await apiClient.get('/admin/memberships/', {
    params: {
      page: params.page,
      page_size: params.pageSize,
      status: params.status,
      plan: params.plan,
      expiring_within_days: params.expiringWithinDays,
      search: params.search,
    },
  })
  return transformKeys<PaginatedResponse<AdminMembership>>(response.data)
}

export async function assignMembership(data: {
  customerId: number
  planId: number
  startDate: string
  createInvoice?: boolean
  markInvoicePaid?: boolean
}): Promise<{ membership: AdminMembership; invoice?: AdminInvoice }> {
  const response = await apiClient.post('/admin/memberships/', {
    customer_id: data.customerId,
    plan_id: data.planId,
    start_date: data.startDate,
    create_invoice: data.createInvoice,
    mark_invoice_paid: data.markInvoicePaid,
  })
  return transformKeys(response.data)
}

export async function extendMembership(
  id: number,
  data: { planId: number; createInvoice?: boolean }
): Promise<{ membership: AdminMembership; invoice?: AdminInvoice }> {
  const response = await apiClient.post(`/admin/memberships/${id}/extend/`, {
    plan_id: data.planId,
    create_invoice: data.createInvoice,
  })
  return transformKeys(response.data)
}

export async function freezeMembership(
  id: number,
  data: { freezeStart: string; freezeEnd: string; reason?: string }
): Promise<AdminMembership> {
  const response = await apiClient.post(`/admin/memberships/${id}/freeze/`, {
    freeze_start: data.freezeStart,
    freeze_end: data.freezeEnd,
    reason: data.reason,
  })
  return transformKeys<AdminMembership>(response.data)
}

export async function unfreezeMembership(id: number): Promise<AdminMembership> {
  const response = await apiClient.post(`/admin/memberships/${id}/unfreeze/`)
  return transformKeys<AdminMembership>(response.data)
}

export async function cancelMembership(
  id: number,
  data: { reason: string; refundAmount?: number; createCreditNote?: boolean }
): Promise<AdminMembership> {
  const response = await apiClient.post(`/admin/memberships/${id}/cancel/`, {
    reason: data.reason,
    refund_amount: data.refundAmount,
    create_credit_note: data.createCreditNote,
  })
  return transformKeys<AdminMembership>(response.data)
}

// ============================================
// Class Schedules
// ============================================

interface ScheduleListParams {
  date?: string
  fromDate?: string
  toDate?: string
  classType?: number
  trainer?: number
  status?: 'scheduled' | 'cancelled'
}

export async function getSchedules(
  params: ScheduleListParams = {}
): Promise<{ results: AdminSchedule[] }> {
  const response = await apiClient.get('/admin/schedules/', {
    params: {
      date: params.date,
      from_date: params.fromDate,
      to_date: params.toDate,
      class_type: params.classType,
      trainer: params.trainer,
      status: params.status,
    },
  })
  return transformKeys<{ results: AdminSchedule[] }>(response.data)
}

export async function getScheduleDetail(id: number): Promise<AdminScheduleDetail> {
  const response = await apiClient.get(`/admin/schedules/${id}/`)
  return transformKeys<AdminScheduleDetail>(response.data)
}

export async function createSchedule(data: {
  classTypeId: number
  trainerId: number
  date: string
  startTime: string
  location: string
  maxCapacity: number
  notes?: string
}): Promise<AdminSchedule> {
  const response = await apiClient.post('/admin/schedules/', {
    class_type_id: data.classTypeId,
    trainer_id: data.trainerId,
    date: data.date,
    start_time: data.startTime,
    location: data.location,
    max_capacity: data.maxCapacity,
    notes: data.notes,
  })
  return transformKeys<AdminSchedule>(response.data)
}

export async function updateSchedule(
  id: number,
  data: Partial<{
    trainerId: number
    location: string
    maxCapacity: number
    notes: string
  }>
): Promise<AdminSchedule> {
  const response = await apiClient.patch(`/admin/schedules/${id}/`, {
    trainer_id: data.trainerId,
    location: data.location,
    max_capacity: data.maxCapacity,
    notes: data.notes,
  })
  return transformKeys<AdminSchedule>(response.data)
}

export async function cancelSchedule(
  id: number,
  data: { reason: string; notifyCustomers?: boolean; restoreCredits?: boolean }
): Promise<{
  id: number
  status: string
  cancelledReason: string
  bookingsCancelled: number
  creditsRestored: number
  notificationsSent: number
}> {
  const response = await apiClient.post(`/admin/schedules/${id}/cancel/`, {
    reason: data.reason,
    notify_customers: data.notifyCustomers,
    restore_credits: data.restoreCredits,
  })
  return transformKeys(response.data)
}

// ============================================
// Bookings
// ============================================

interface BookingListParams {
  page?: number
  pageSize?: number
  schedule?: number
  customer?: number
  status?: AdminBookingStatus
  date?: string
  fromDate?: string
  toDate?: string
  search?: string
}

export async function getBookings(
  params: BookingListParams = {}
): Promise<PaginatedResponse<AdminBookingListItem>> {
  const response = await apiClient.get('/admin/bookings/', {
    params: {
      page: params.page,
      page_size: params.pageSize,
      schedule: params.schedule,
      customer: params.customer,
      status: params.status,
      date: params.date,
      from_date: params.fromDate,
      to_date: params.toDate,
      search: params.search,
    },
  })
  return transformKeys<PaginatedResponse<AdminBookingListItem>>(response.data)
}

export async function createBooking(data: {
  customerId: number
  scheduleId: number
  overrideCapacity?: boolean
  isComp?: boolean
  notes?: string
}): Promise<AdminBookingListItem> {
  const response = await apiClient.post('/admin/bookings/', {
    customer_id: data.customerId,
    schedule_id: data.scheduleId,
    override_capacity: data.overrideCapacity,
    is_comp: data.isComp,
    notes: data.notes,
  })
  return transformKeys<AdminBookingListItem>(response.data)
}

export async function cancelBooking(
  id: number,
  data: { reason: string; restoreCredit?: boolean }
): Promise<AdminBookingListItem> {
  const response = await apiClient.post(`/admin/bookings/${id}/cancel/`, {
    reason: data.reason,
    restore_credit: data.restoreCredit,
  })
  return transformKeys<AdminBookingListItem>(response.data)
}

export async function moveBooking(id: number, newScheduleId: number): Promise<AdminBookingListItem> {
  const response = await apiClient.post(`/admin/bookings/${id}/move/`, {
    new_schedule_id: newScheduleId,
  })
  return transformKeys<AdminBookingListItem>(response.data)
}

export async function markNoShow(id: number): Promise<AdminBookingListItem> {
  const response = await apiClient.post(`/admin/bookings/${id}/no-show/`)
  return transformKeys<AdminBookingListItem>(response.data)
}

// ============================================
// Attendance
// ============================================

export async function checkInLookup(identifier: string): Promise<CheckInLookupResult> {
  const response = await apiClient.post('/admin/attendance/check-in/', { identifier })
  return transformKeys<CheckInLookupResult>(response.data)
}

export async function confirmCheckIn(bookingId: number): Promise<AdminBookingListItem> {
  const response = await apiClient.post('/admin/attendance/confirm/', { booking_id: bookingId })
  return transformKeys<AdminBookingListItem>(response.data)
}

export async function walkInBooking(customerId: number, scheduleId: number): Promise<AdminBookingListItem> {
  const response = await apiClient.post('/admin/attendance/walk-in/', {
    customer_id: customerId,
    schedule_id: scheduleId,
  })
  return transformKeys<AdminBookingListItem>(response.data)
}

export async function getClassAttendance(scheduleId: number): Promise<ClassAttendance> {
  const response = await apiClient.get(`/admin/schedules/${scheduleId}/attendance/`)
  return transformKeys<ClassAttendance>(response.data)
}

export async function bulkUpdateAttendance(
  scheduleId: number,
  updates: Array<{ bookingId: number; status: 'attended' | 'no_show' }>
): Promise<{
  updated: number
  results: Array<{ bookingId: number; status: string; success: boolean }>
}> {
  const response = await apiClient.post(`/admin/schedules/${scheduleId}/attendance/bulk/`, {
    updates: updates.map((u) => ({ booking_id: u.bookingId, status: u.status })),
  })
  return transformKeys(response.data)
}

// ============================================
// Trial Bookings
// ============================================

interface TrialListParams {
  page?: number
  pageSize?: number
  status?: TrialBookingStatus
  fromDate?: string
  toDate?: string
}

export async function getTrialBookings(
  params: TrialListParams = {}
): Promise<PaginatedResponse<AdminTrialBooking>> {
  const response = await apiClient.get('/admin/trial-bookings/', {
    params: {
      page: params.page,
      page_size: params.pageSize,
      status: params.status,
      from_date: params.fromDate,
      to_date: params.toDate,
    },
  })
  return transformKeys<PaginatedResponse<AdminTrialBooking>>(response.data)
}

export async function getTrialBookingDetail(id: number): Promise<AdminTrialBooking> {
  const response = await apiClient.get(`/admin/trial-bookings/${id}/`)
  return transformKeys<AdminTrialBooking>(response.data)
}

export async function updateTrialBooking(
  id: number,
  data: { status?: TrialBookingStatus; staffNotes?: string }
): Promise<AdminTrialBooking> {
  const response = await apiClient.patch(`/admin/trial-bookings/${id}/`, {
    status: data.status,
    staff_notes: data.staffNotes,
  })
  return transformKeys<AdminTrialBooking>(response.data)
}

export async function scheduleTrialClass(
  id: number,
  scheduleId: number
): Promise<AdminTrialBooking> {
  const response = await apiClient.post(`/admin/trial-bookings/${id}/schedule/`, {
    schedule_id: scheduleId,
  })
  return transformKeys<AdminTrialBooking>(response.data)
}

export async function convertTrialToCustomer(
  id: number,
  data: { planId: number; createInvoice?: boolean }
): Promise<{
  trialBooking: AdminTrialBooking
  customer: AdminCustomerDetail
  membership: AdminMembership
  invoice?: AdminInvoice
}> {
  const response = await apiClient.post(`/admin/trial-bookings/${id}/convert/`, {
    plan_id: data.planId,
    create_invoice: data.createInvoice,
  })
  return transformKeys(response.data)
}

export async function markTrialLost(id: number, reason: TrialLostReason): Promise<AdminTrialBooking> {
  const response = await apiClient.post(`/admin/trial-bookings/${id}/mark-lost/`, { reason })
  return transformKeys<AdminTrialBooking>(response.data)
}

// ============================================
// Contact Messages
// ============================================

interface MessageListParams {
  page?: number
  pageSize?: number
  status?: ContactMessageStatus
  fromDate?: string
  toDate?: string
}

export async function getContactMessages(
  params: MessageListParams = {}
): Promise<PaginatedResponse<AdminContactMessage>> {
  const response = await apiClient.get('/admin/contact-messages/', {
    params: {
      page: params.page,
      page_size: params.pageSize,
      status: params.status,
      from_date: params.fromDate,
      to_date: params.toDate,
    },
  })
  return transformKeys<PaginatedResponse<AdminContactMessage>>(response.data)
}

export async function getContactMessageDetail(id: number): Promise<AdminContactMessage> {
  const response = await apiClient.get(`/admin/contact-messages/${id}/`)
  return transformKeys<AdminContactMessage>(response.data)
}

export async function updateContactMessage(
  id: number,
  data: { status?: ContactMessageStatus; staffNotes?: string }
): Promise<AdminContactMessage> {
  const response = await apiClient.patch(`/admin/contact-messages/${id}/`, {
    status: data.status,
    staff_notes: data.staffNotes,
  })
  return transformKeys<AdminContactMessage>(response.data)
}

// ============================================
// Invoices
// ============================================

interface InvoiceListParams {
  page?: number
  pageSize?: number
  status?: 'pending' | 'paid' | 'overdue' | 'cancelled'
  customer?: number
  fromDate?: string
  toDate?: string
  search?: string
}

export async function getInvoices(
  params: InvoiceListParams = {}
): Promise<PaginatedResponse<AdminInvoice>> {
  const response = await apiClient.get('/admin/invoices/', {
    params: {
      page: params.page,
      page_size: params.pageSize,
      status: params.status,
      customer: params.customer,
      from_date: params.fromDate,
      to_date: params.toDate,
      search: params.search,
    },
  })
  return transformKeys<PaginatedResponse<AdminInvoice>>(response.data)
}

export async function getInvoiceDetail(id: number): Promise<AdminInvoice> {
  const response = await apiClient.get(`/admin/invoices/${id}/`)
  return transformKeys<AdminInvoice>(response.data)
}

export async function createInvoice(data: {
  customerId: number
  lineItems: Array<{ description: string; quantity: number; unitPrice: number }>
  dueDate: string
  notes?: string
}): Promise<AdminInvoice> {
  const response = await apiClient.post('/admin/invoices/', {
    customer_id: data.customerId,
    line_items: data.lineItems.map((item) => ({
      description: item.description,
      quantity: item.quantity,
      unit_price: item.unitPrice,
    })),
    due_date: data.dueDate,
    notes: data.notes,
  })
  return transformKeys<AdminInvoice>(response.data)
}

export async function recordPayment(
  id: number,
  data: {
    method: PaymentMethod
    reference?: string
    paidDate: string
    amount: number
  }
): Promise<AdminInvoice> {
  const response = await apiClient.post(`/admin/invoices/${id}/pay/`, {
    method: data.method,
    reference: data.reference,
    paid_date: data.paidDate,
    amount: data.amount,
  })
  return transformKeys<AdminInvoice>(response.data)
}

export async function voidInvoice(id: number, reason: string): Promise<AdminInvoice> {
  const response = await apiClient.post(`/admin/invoices/${id}/void/`, { reason })
  return transformKeys<AdminInvoice>(response.data)
}

export function getInvoicePdfUrl(id: number): string {
  return `/api/v1/admin/invoices/${id}/pdf/`
}

// ============================================
// Waitlist
// ============================================

export async function getWaitlistEntries(params: {
  schedule?: number
  status?: string
} = {}): Promise<{ results: AdminWaitlistEntry[] }> {
  const response = await apiClient.get('/admin/waitlist/', { params })
  return transformKeys<{ results: AdminWaitlistEntry[] }>(response.data)
}

export async function promoteFromWaitlist(
  id: number
): Promise<{ waitlistEntry: AdminWaitlistEntry; booking: AdminBookingListItem }> {
  const response = await apiClient.post(`/admin/waitlist/${id}/promote/`)
  return transformKeys(response.data)
}

export async function removeFromWaitlist(id: number): Promise<void> {
  await apiClient.delete(`/admin/waitlist/${id}/`)
}

// ============================================
// Membership Requests
// ============================================

export async function getMembershipRequests(params: {
  status?: 'pending' | 'approved' | 'denied'
  type?: 'freeze' | 'cancel'
} = {}): Promise<{ results: AdminMembershipRequest[] }> {
  const response = await apiClient.get('/admin/membership-requests/', { params })
  return transformKeys<{ results: AdminMembershipRequest[] }>(response.data)
}

export async function approveMembershipRequest(id: number): Promise<AdminMembershipRequest> {
  const response = await apiClient.post(`/admin/membership-requests/${id}/approve/`)
  return transformKeys<AdminMembershipRequest>(response.data)
}

export async function denyMembershipRequest(id: number, reason: string): Promise<AdminMembershipRequest> {
  const response = await apiClient.post(`/admin/membership-requests/${id}/deny/`, { reason })
  return transformKeys<AdminMembershipRequest>(response.data)
}

// ============================================
// Owner-Only: Class Types
// ============================================

export async function getClassTypes(): Promise<{ results: AdminClassType[] }> {
  const response = await apiClient.get('/admin/class-types/')
  return transformKeys<{ results: AdminClassType[] }>(response.data)
}

export async function createClassType(data: Omit<AdminClassType, 'id' | 'slug'>): Promise<AdminClassType> {
  const response = await apiClient.post('/admin/class-types/', {
    name: data.name,
    description: data.description,
    level: data.level,
    duration_minutes: data.durationMinutes,
    max_capacity: data.maxCapacity,
    color: data.color,
    is_active: data.isActive,
    display_order: data.displayOrder,
  })
  return transformKeys<AdminClassType>(response.data)
}

export async function updateClassType(
  id: number,
  data: Partial<Omit<AdminClassType, 'id' | 'slug'>>
): Promise<AdminClassType> {
  const response = await apiClient.patch(`/admin/class-types/${id}/`, {
    name: data.name,
    description: data.description,
    level: data.level,
    duration_minutes: data.durationMinutes,
    max_capacity: data.maxCapacity,
    color: data.color,
    is_active: data.isActive,
    display_order: data.displayOrder,
  })
  return transformKeys<AdminClassType>(response.data)
}

// ============================================
// Owner-Only: Membership Plans
// ============================================

export async function getMembershipPlans(): Promise<{ results: AdminMembershipPlan[] }> {
  const response = await apiClient.get('/admin/membership-plans/')
  return transformKeys<{ results: AdminMembershipPlan[] }>(response.data)
}

export async function createMembershipPlan(
  data: Omit<AdminMembershipPlan, 'id' | 'slug'>
): Promise<AdminMembershipPlan> {
  const response = await apiClient.post('/admin/membership-plans/', {
    name: data.name,
    description: data.description,
    price: data.price,
    classes_per_month: data.classesPerMonth,
    duration_days: data.durationDays,
    features: data.features,
    is_popular: data.isPopular,
    is_active: data.isActive,
    display_order: data.displayOrder,
  })
  return transformKeys<AdminMembershipPlan>(response.data)
}

export async function updateMembershipPlan(
  id: number,
  data: Partial<Omit<AdminMembershipPlan, 'id' | 'slug'>>
): Promise<AdminMembershipPlan> {
  const response = await apiClient.patch(`/admin/membership-plans/${id}/`, {
    name: data.name,
    description: data.description,
    price: data.price,
    classes_per_month: data.classesPerMonth,
    duration_days: data.durationDays,
    features: data.features,
    is_popular: data.isPopular,
    is_active: data.isActive,
    display_order: data.displayOrder,
  })
  return transformKeys<AdminMembershipPlan>(response.data)
}

// ============================================
// Owner-Only: Trainers
// ============================================

export async function getTrainers(): Promise<{ results: AdminTrainer[] }> {
  const response = await apiClient.get('/admin/trainers/')
  return transformKeys<{ results: AdminTrainer[] }>(response.data)
}

export async function createTrainer(
  data: Omit<AdminTrainer, 'id' | 'photoUrl'>
): Promise<AdminTrainer> {
  const response = await apiClient.post('/admin/trainers/', {
    name: data.name,
    email: data.email,
    phone: data.phone,
    bio: data.bio,
    years_experience: data.yearsExperience,
    specializations: data.specializations,
    certifications: data.certifications,
    is_active: data.isActive,
    display_order: data.displayOrder,
  })
  return transformKeys<AdminTrainer>(response.data)
}

export async function updateTrainer(
  id: number,
  data: Partial<Omit<AdminTrainer, 'id' | 'photoUrl'>>
): Promise<AdminTrainer> {
  const response = await apiClient.patch(`/admin/trainers/${id}/`, {
    name: data.name,
    email: data.email,
    phone: data.phone,
    bio: data.bio,
    years_experience: data.yearsExperience,
    specializations: data.specializations,
    certifications: data.certifications,
    is_active: data.isActive,
    display_order: data.displayOrder,
  })
  return transformKeys<AdminTrainer>(response.data)
}

// ============================================
// Owner-Only: Staff
// ============================================

export async function getStaffMembers(): Promise<{ results: AdminStaffMember[] }> {
  const response = await apiClient.get('/admin/staff/')
  return transformKeys<{ results: AdminStaffMember[] }>(response.data)
}

export async function inviteStaff(data: {
  email: string
  name: string
  role: 'staff' | 'owner'
}): Promise<AdminStaffMember> {
  const response = await apiClient.post('/admin/staff/invite/', data)
  return transformKeys<AdminStaffMember>(response.data)
}

export async function updateStaffMember(
  id: number,
  data: { role?: 'staff' | 'owner'; isActive?: boolean }
): Promise<AdminStaffMember> {
  const response = await apiClient.patch(`/admin/staff/${id}/`, {
    role: data.role,
    is_active: data.isActive,
  })
  return transformKeys<AdminStaffMember>(response.data)
}

export async function deactivateStaff(id: number): Promise<AdminStaffMember> {
  const response = await apiClient.post(`/admin/staff/${id}/deactivate/`)
  return transformKeys<AdminStaffMember>(response.data)
}

// ============================================
// Owner-Only: Studio Config
// ============================================

export async function getStudioConfig(): Promise<StudioConfig> {
  const response = await apiClient.get('/admin/studio/config/')
  return transformKeys<StudioConfig>(response.data)
}

export async function updateStudioConfig(data: Partial<StudioConfig>): Promise<StudioConfig> {
  const response = await apiClient.patch('/admin/studio/config/', data)
  return transformKeys<StudioConfig>(response.data)
}

// ============================================
// Owner-Only: Reports
// ============================================

import type {
  AttendanceReport,
  RevenueReport,
  MembershipReport,
  TrialConversionReport,
} from '@/types/admin'

interface ReportParams {
  fromDate: string
  toDate: string
  groupBy?: 'day' | 'week' | 'month' | 'class_type' | 'trainer' | 'plan'
}

export async function getAttendanceReport(params: ReportParams): Promise<AttendanceReport> {
  const response = await apiClient.get('/admin/reports/attendance/', {
    params: {
      from_date: params.fromDate,
      to_date: params.toDate,
      group_by: params.groupBy,
    },
  })
  return transformKeys<AttendanceReport>(response.data)
}

export async function getRevenueReport(params: ReportParams): Promise<RevenueReport> {
  const response = await apiClient.get('/admin/reports/revenue/', {
    params: {
      from_date: params.fromDate,
      to_date: params.toDate,
      group_by: params.groupBy,
    },
  })
  return transformKeys<RevenueReport>(response.data)
}

export async function getMembershipReport(): Promise<MembershipReport> {
  const response = await apiClient.get('/admin/reports/memberships/')
  return transformKeys<MembershipReport>(response.data)
}

export async function getTrialConversionReport(params: {
  fromDate: string
  toDate: string
}): Promise<TrialConversionReport> {
  const response = await apiClient.get('/admin/reports/trials/', {
    params: {
      from_date: params.fromDate,
      to_date: params.toDate,
    },
  })
  return transformKeys<TrialConversionReport>(response.data)
}

export interface ClassPerformanceReport {
  byClassType: Array<{
    classType: string
    totalClasses: number
    totalCapacity: number
    totalBooked: number
    utilizationRate: number
  }>
  byTimeSlot: Array<{
    time: string
    avgBookingRate: number
  }>
  byTrainer: Array<{
    trainer: string
    classesTaught: number
    avgAttendance: number
    avgRating: number | null
  }>
}

export async function getClassPerformanceReport(params: {
  fromDate: string
  toDate: string
}): Promise<ClassPerformanceReport> {
  const response = await apiClient.get('/admin/reports/classes/', {
    params: {
      from_date: params.fromDate,
      to_date: params.toDate,
    },
  })
  return transformKeys<ClassPerformanceReport>(response.data)
}

export function getReportExportUrl(
  reportType: 'attendance' | 'revenue' | 'memberships' | 'trials' | 'classes',
  params: { fromDate: string; toDate: string }
): string {
  const searchParams = new URLSearchParams({
    from_date: params.fromDate,
    to_date: params.toDate,
    format: 'csv',
  })
  return `/api/v1/admin/reports/${reportType}/export/?${searchParams.toString()}`
}
