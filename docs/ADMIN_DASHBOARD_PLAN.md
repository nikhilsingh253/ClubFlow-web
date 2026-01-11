# Admin Dashboard Implementation Plan

**Created:** January 11, 2026
**Status:** Draft - Pending Review

---

## Executive Summary

Build a React-based Admin Dashboard to replace Django Admin for daily gym operations. The dashboard will serve two user roles (Owner/Manager and Staff) across 17 functional sections, implemented in 4 phases.

**Goal:** Enable gym staff to manage all daily operations without touching Django Admin.

---

## Architecture Decisions

### 1. Single App vs Separate App

**Decision:** Integrate into existing ClubFlow-web app

**Rationale:**
- Shared authentication system (Google OAuth + email/password)
- Shared API client and types
- Consistent styling (Tailwind, design tokens)
- Simpler deployment and maintenance

**Implementation:**
- New route prefix: `/admin/*`
- New layout: `AdminLayout.tsx`
- Role-based route protection

### 2. State Management

**Decision:** React Query + Zustand (same as member portal)

**Rationale:**
- Already proven in the codebase
- React Query for server state (API data)
- Zustand for client state (UI, filters, modals)

### 3. Component Library

**Decision:** Build on existing components + add admin-specific ones

**New Components Needed:**
- DataTable (sortable, filterable, paginated)
- Calendar (week/month views)
- StatCard (metrics display)
- StatusBadge (workflow states)
- QRScanner (camera-based)

---

## Phase Breakdown

### Phase 1: Core Operations MVP (Estimated: ~40 screens/components)

**Goal:** Staff can handle daily operations without Django Admin

#### 1.1 Admin Authentication & Layout
| Feature | Description | Backend Dependency |
|---------|-------------|-------------------|
| Admin login | Same auth, role check | Need: `is_staff` or `is_owner` flag on User |
| Admin layout | Sidebar nav, header, content area | None |
| Role-based nav | Hide owner-only items from staff | Need: Role field on User |
| Session timeout | Auto-logout after inactivity | Frontend only |

#### 1.2 Dashboard Home
| Feature | Description | Backend Dependency |
|---------|-------------|-------------------|
| Today's overview card | Classes, bookings, attendance counts | Need: `/admin/stats/today/` |
| Quick action buttons | Check-in, New Booking, New Customer | None (links) |
| Alerts panel | Trials, messages, expiring memberships | Need: `/admin/alerts/` |
| Today's timeline | Visual class schedule | Existing: `/class-schedules/` |

#### 1.3 Customer Management (Read + Create)
| Feature | Description | Backend Dependency |
|---------|-------------|-------------------|
| Customer list | Table with search, filters | Need: `/admin/customers/` |
| Customer profile view | All info, membership, history | Need: `/admin/customers/{id}/` |
| Create customer | Form with all fields | Need: `POST /admin/customers/` |
| Customer notes | Add/view internal notes | Need: Notes model + endpoints |

#### 1.4 Booking Management
| Feature | Description | Backend Dependency |
|---------|-------------|-------------------|
| Bookings list | Table with filters by date, status | Need: `/admin/bookings/` |
| View booking details | Member, class, status | Existing: `/bookings/{id}/` |
| Create manual booking | Staff books for member | Need: `POST /admin/bookings/` |
| Cancel booking | With reason selection | Existing: `DELETE /bookings/{id}/` |

#### 1.5 Schedule Viewing
| Feature | Description | Backend Dependency |
|---------|-------------|-------------------|
| Weekly calendar view | Visual schedule | Existing: `/class-schedules/` |
| Daily list view | Today's classes | Existing: `/class-schedules/?date=` |
| Class details modal | Bookings, capacity, instructor | Existing: `/class-schedules/{id}/` |

#### 1.6 Check-in Interface
| Feature | Description | Backend Dependency |
|---------|-------------|-------------------|
| QR scanner | Camera-based scanning | Frontend only (decode QR) |
| Manual search | By name/phone/member ID | Need: `/admin/customers/search/` |
| Check-in result | Show member + booking | Need: `/admin/checkin/lookup/` |
| Mark attendance | Record check-in | Need: `POST /admin/attendance/` |

#### 1.7 Trial Bookings Management
| Feature | Description | Backend Dependency |
|---------|-------------|-------------------|
| Trials list | With status filter | Need: `/admin/trial-bookings/` |
| Trial details | Contact info, notes | Existing: `/trial-bookings/{id}/` |
| Status workflow | New→Contacted→Scheduled→Completed | Need: `PATCH /admin/trial-bookings/{id}/` |
| Convert to member | Pre-fill customer form | Frontend flow |

#### 1.8 Contact Messages
| Feature | Description | Backend Dependency |
|---------|-------------|-------------------|
| Messages list | With status filter | Need: `/admin/contact-messages/` |
| Message details | Full content, contact info | Need: `/admin/contact-messages/{id}/` |
| Update status | New→In Progress→Resolved | Need: `PATCH /admin/contact-messages/{id}/` |

---

### Phase 2: Full Operations

**Goal:** Complete CRUD operations and attendance tracking

#### 2.1 Schedule Management (Full CRUD)
| Feature | Description | Backend Dependency |
|---------|-------------|-------------------|
| Create class | Form with all fields | Need: `POST /admin/class-schedules/` |
| Edit class | Modify details | Need: `PATCH /admin/class-schedules/{id}/` |
| Cancel class | With member notification | Need: `POST /admin/class-schedules/{id}/cancel/` |
| Recurring classes | Create weekly repeats | Need: Bulk create endpoint |
| Substitute instructor | Change instructor | Existing: PATCH endpoint |

#### 2.2 Attendance Management
| Feature | Description | Backend Dependency |
|---------|-------------|-------------------|
| Class attendance view | List all bookings for class | Need: `/admin/class-schedules/{id}/attendance/` |
| Mark present/no-show | Individual toggle | Need: `PATCH /admin/bookings/{id}/attendance/` |
| Bulk mark attendance | Select multiple | Need: `POST /admin/attendance/bulk/` |
| Daily attendance report | Summary by class | Need: `/admin/reports/attendance/daily/` |

#### 2.3 Customer Management (Full CRUD)
| Feature | Description | Backend Dependency |
|---------|-------------|-------------------|
| Edit customer | Update all fields | Need: `PATCH /admin/customers/{id}/` |
| Customer booking history | Past bookings list | Need: `/admin/customers/{id}/bookings/` |
| Customer payment history | Past invoices | Need: `/admin/customers/{id}/invoices/` |

#### 2.4 Membership Management
| Feature | Description | Backend Dependency |
|---------|-------------|-------------------|
| Active memberships list | With filters | Need: `/admin/memberships/` |
| Assign membership | To customer | Need: `POST /admin/memberships/` |
| Extend/renew membership | New end date | Need: `POST /admin/memberships/{id}/extend/` |
| Freeze membership | Set freeze period | Need: `POST /admin/memberships/{id}/freeze/` |
| Cancel membership | With reason | Need: `POST /admin/memberships/{id}/cancel/` |
| Expiring soon report | List expiring in X days | Need: `/admin/memberships/expiring/` |

#### 2.5 Invoice Management
| Feature | Description | Backend Dependency |
|---------|-------------|-------------------|
| Invoice list | With filters | Existing: `/invoices/` (need admin version) |
| Create invoice | Line items, GST calc | Need: `POST /admin/invoices/` |
| Invoice details | Full breakdown | Existing: `/invoices/{id}/` |
| Record payment | Mark as paid | Need: `POST /admin/invoices/{id}/payment/` |
| Download PDF | GST-compliant | Existing: `/invoices/{id}/pdf/` |
| Void invoice | Cancel invoice | Need: `POST /admin/invoices/{id}/void/` |

#### 2.6 Waitlist Management
| Feature | Description | Backend Dependency |
|---------|-------------|-------------------|
| Waitlist entries | By class | Need: `/admin/waitlist/` |
| Process waitlist | When spot opens | Need: `POST /admin/waitlist/{id}/process/` |
| Remove from waitlist | Manual removal | Need: `DELETE /admin/waitlist/{id}/` |

#### 2.7 Membership Requests
| Feature | Description | Backend Dependency |
|---------|-------------|-------------------|
| Requests list | Freeze/cancel requests | Existing: `/membership/my-requests/` (need admin) |
| Approve/deny request | Process request | Need: `POST /admin/membership-requests/{id}/approve/` |

---

### Phase 3: Owner Configuration

**Goal:** Owners can configure studio settings without developer help

#### 3.1 Studio Configuration
| Feature | Description | Backend Dependency |
|---------|-------------|-------------------|
| Studio profile | Name, address, contact | Need: `/admin/studio/` |
| GST settings | GSTIN, HSN code | Need: Part of studio config |
| Booking policies | Cancellation hours, etc | Need: Part of studio config |
| Branding | Logo upload | Need: File upload endpoint |

#### 3.2 Class Types Management
| Feature | Description | Backend Dependency |
|---------|-------------|-------------------|
| Class types list | All types | Need: `/admin/class-types/` |
| Create class type | Full form | Need: `POST /admin/class-types/` |
| Edit class type | Modify details | Need: `PATCH /admin/class-types/{id}/` |
| Deactivate type | Soft delete | Need: `PATCH` with `is_active` |

#### 3.3 Membership Plans Management
| Feature | Description | Backend Dependency |
|---------|-------------|-------------------|
| Plans list | All plans | Existing: `/membership-plans/` |
| Create plan | Full form | Need: `POST /admin/membership-plans/` |
| Edit plan | Modify details | Need: `PATCH /admin/membership-plans/{id}/` |
| Deactivate plan | Soft delete | Need: `PATCH` with `is_active` |

#### 3.4 Trainers Management
| Feature | Description | Backend Dependency |
|---------|-------------|-------------------|
| Trainers list | All trainers | Existing: `/trainers/` |
| Create trainer | Full form | Need: `POST /admin/trainers/` |
| Edit trainer | Modify details | Need: `PATCH /admin/trainers/{id}/` |
| Deactivate trainer | Soft delete | Need: `PATCH` with `is_active` |

#### 3.5 Staff Management
| Feature | Description | Backend Dependency |
|---------|-------------|-------------------|
| Staff list | All staff users | Need: `/admin/staff/` |
| Invite staff | Send invitation email | Need: `POST /admin/staff/invite/` |
| Edit staff | Change role | Need: `PATCH /admin/staff/{id}/` |
| Deactivate staff | Revoke access | Need: `PATCH` with `is_active` |

---

### Phase 4: Analytics & Reports

**Goal:** Business insights and performance metrics

#### 4.1 Dashboard Analytics
| Feature | Description | Backend Dependency |
|---------|-------------|-------------------|
| KPI cards | Active members, revenue, etc | Need: `/admin/analytics/summary/` |
| Trend charts | Month-over-month | Need: `/admin/analytics/trends/` |

#### 4.2 Reports
| Feature | Description | Backend Dependency |
|---------|-------------|-------------------|
| Attendance report | By date range | Need: `/admin/reports/attendance/` |
| Revenue report | By date range | Need: `/admin/reports/revenue/` |
| Membership report | Active, expiring, churned | Need: `/admin/reports/memberships/` |
| Trial conversion report | Funnel metrics | Need: `/admin/reports/conversions/` |
| Class performance | Utilization, popularity | Need: `/admin/reports/classes/` |
| CSV export | All reports | Need: `?format=csv` param |

---

## Success Criteria

### Phase 1 Success Criteria

| ID | Criteria | Validation Method |
|----|----------|-------------------|
| P1.1 | Staff can log in and see admin dashboard | Manual test |
| P1.2 | Staff can view today's classes and bookings count | Manual test |
| P1.3 | Staff can search and view any customer profile | Manual test |
| P1.4 | Staff can create a new customer record | Manual test |
| P1.5 | Staff can view all bookings with filters | Manual test |
| P1.6 | Staff can create a booking for a customer | Manual test |
| P1.7 | Staff can cancel a booking | Manual test |
| P1.8 | Staff can view weekly schedule calendar | Manual test |
| P1.9 | Staff can scan QR or search to check in member | Manual test |
| P1.10 | Staff can mark a booking as attended | Manual test |
| P1.11 | Staff can view and process trial bookings | Manual test |
| P1.12 | Staff can update trial status through workflow | Manual test |
| P1.13 | Staff can view and respond to contact messages | Manual test |
| P1.14 | Owner-only nav items hidden from staff role | Manual test |

**Phase 1 Complete When:** All 14 criteria pass

### Phase 2 Success Criteria

| ID | Criteria | Validation Method |
|----|----------|-------------------|
| P2.1 | Staff can create a new class on schedule | Manual test |
| P2.2 | Staff can cancel a class (members notified) | Manual test + email check |
| P2.3 | Staff can view class attendance list | Manual test |
| P2.4 | Staff can bulk mark attendance | Manual test |
| P2.5 | Staff can edit customer information | Manual test |
| P2.6 | Staff can assign membership to customer | Manual test |
| P2.7 | Staff can freeze a membership | Manual test |
| P2.8 | Staff can view expiring memberships | Manual test |
| P2.9 | Staff can create an invoice | Manual test |
| P2.10 | Staff can record a payment | Manual test |
| P2.11 | Staff can process waitlist entries | Manual test |
| P2.12 | Staff can approve/deny membership requests | Manual test |

**Phase 2 Complete When:** All 12 criteria pass

### Phase 3 Success Criteria

| ID | Criteria | Validation Method |
|----|----------|-------------------|
| P3.1 | Owner can update studio name and address | Manual test |
| P3.2 | Owner can update GST settings | Manual test |
| P3.3 | Owner can create/edit class types | Manual test |
| P3.4 | Owner can create/edit membership plans | Manual test |
| P3.5 | Owner can create/edit trainers | Manual test |
| P3.6 | Owner can invite new staff | Manual test + email |
| P3.7 | Owner can change staff roles | Manual test |
| P3.8 | Owner can deactivate staff access | Manual test |
| P3.9 | Staff cannot access owner-only sections | Manual test |

**Phase 3 Complete When:** All 9 criteria pass

### Phase 4 Success Criteria

| ID | Criteria | Validation Method |
|----|----------|-------------------|
| P4.1 | Owner sees KPI cards on dashboard | Manual test |
| P4.2 | Owner can generate attendance report | Manual test |
| P4.3 | Owner can generate revenue report | Manual test |
| P4.4 | Owner can generate membership report | Manual test |
| P4.5 | Owner can export any report to CSV | Manual test |
| P4.6 | Reports show correct data | Compare with raw data |

**Phase 4 Complete When:** All 6 criteria pass

---

## End-to-End Test Scenarios

### E2E Scenario 1: New Member Onboarding
```
1. Prospect submits trial booking on website
2. Staff sees trial in admin dashboard alerts
3. Staff updates trial status to "Contacted"
4. Staff schedules trial for specific class
5. Prospect arrives, staff checks them in
6. Staff marks trial as "Completed"
7. Staff converts trial to customer (creates customer record)
8. Staff assigns membership plan
9. Staff creates and records payment
10. Customer can now log in and book classes
```

### E2E Scenario 2: Daily Operations
```
1. Staff logs into admin dashboard
2. Views today's classes on dashboard
3. Clicks into first class to see bookings
4. Members arrive, staff scans QR codes
5. Staff marks attendance for each member
6. One member is no-show, staff marks no-show
7. End of day: staff views attendance summary
```

### E2E Scenario 3: Class Cancellation
```
1. Instructor calls in sick
2. Staff finds class on schedule
3. Staff clicks "Cancel Class"
4. Staff selects reason and confirms
5. All booked members receive notification
6. Credits restored to all members
7. Class shows as "Cancelled" on schedule
```

---

## Backend API Requirements Summary

### New Endpoints Needed (Minimum for Phase 1)

```
# Authentication & Authorization
GET  /admin/me/                          # Current admin user with role

# Dashboard
GET  /admin/stats/today/                 # Today's metrics
GET  /admin/alerts/                      # Pending items counts

# Customers
GET  /admin/customers/                   # List with search & filters
GET  /admin/customers/{id}/              # Full profile
POST /admin/customers/                   # Create customer
GET  /admin/customers/search/?q=         # Quick search

# Bookings
GET  /admin/bookings/                    # List with filters
POST /admin/bookings/                    # Create booking (staff)

# Check-in
GET  /admin/checkin/lookup/?qr=          # Lookup by QR code
GET  /admin/checkin/lookup/?customer=    # Lookup by customer ID
POST /admin/attendance/                  # Record attendance

# Trial Bookings
GET  /admin/trial-bookings/              # List with status filter
PATCH /admin/trial-bookings/{id}/        # Update status

# Contact Messages
GET  /admin/contact-messages/            # List with status filter
PATCH /admin/contact-messages/{id}/      # Update status
```

---

## File Structure

```
src/
├── pages/
│   └── admin/
│       ├── AdminDashboardPage.tsx
│       ├── AdminCustomersPage.tsx
│       ├── AdminCustomerDetailPage.tsx
│       ├── AdminBookingsPage.tsx
│       ├── AdminSchedulePage.tsx
│       ├── AdminCheckInPage.tsx
│       ├── AdminTrialsPage.tsx
│       ├── AdminMessagesPage.tsx
│       └── ...
├── components/
│   └── admin/
│       ├── AdminLayout.tsx
│       ├── AdminSidebar.tsx
│       ├── AdminHeader.tsx
│       ├── DataTable.tsx
│       ├── StatCard.tsx
│       ├── Calendar.tsx
│       ├── QRScanner.tsx
│       └── ...
├── api/
│   └── admin/
│       ├── customers.ts
│       ├── bookings.ts
│       ├── attendance.ts
│       ├── trials.ts
│       └── ...
└── types/
    └── admin.ts
```

---

## Timeline Considerations

**Dependencies:**
1. Backend APIs must be built for each phase
2. Phase 1 backend should be prioritized
3. Phases can overlap (frontend can start once APIs are spec'd)

**Risk Mitigation:**
- Start with read-only views while write APIs are built
- Mock APIs for frontend development
- Incremental rollout (staff can still use Django Admin as fallback)

---

## Open Questions

1. **Backend capacity:** Who will build the admin APIs? Timeline?
2. **Existing Django Admin:** Keep for superuser/developer, or phase out entirely?
3. **Mobile:** Is tablet support sufficient, or need dedicated mobile app?
4. **Notifications:** Email only, or also SMS/WhatsApp in Phase 1?
5. **Audit logging:** Track all staff actions? Required for Phase 1?

---

## Next Steps

1. **Review this plan** - Get feedback on scope and priorities
2. **Confirm backend API plan** - Align on endpoints and timeline
3. **Create Phase 1 branch** - Start implementation
4. **Build incrementally** - Ship features as they're ready

---

*Document Version: 1.0*
*Last Updated: January 11, 2026*