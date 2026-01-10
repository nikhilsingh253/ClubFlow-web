# ClubFlow Gap Analysis

**Generated:** January 10, 2026
**Last Updated:** January 10, 2026
**Based on:** Backend API Schema + Frontend Implementation

---

## Summary

| Category | Backend | Frontend | Gap |
|----------|---------|----------|-----|
| Authentication | 11 endpoints | 9 used | ✅ Complete (incl. password change) |
| Bookings | 5 endpoints | 5 used | ✅ Complete (incl. reschedule) |
| Class Schedules | 2 endpoints | 2 used | ✅ Complete |
| Contact | 1 endpoint | 1 used | ✅ Complete |
| Customer Profile | 2 endpoints | 2 used | ✅ Complete (profile editing done) |
| Membership | 1 endpoint | 1 used | ✅ Complete |
| Trial Bookings | 1 endpoint | 1 used | ✅ Complete |
| Invoices | 3 endpoints | 3 used | ✅ Complete (detail modal + PDF) |
| Membership Plans | 2 endpoints | 1 used | Plan detail page missing (low priority) |
| Public Schedule | 2 endpoints | 1 used | ✅ Sufficient |
| Trainers | 2 endpoints | 1 used | Trainer detail page missing (low priority) |
| Waitlist | 2 endpoints | 2 used | ✅ Complete |
| Membership Requests | 2 endpoints | 2 used | ✅ Complete |
| Notifications | 1 endpoint | 1 used | ✅ Complete |

---

## Detailed Gap Analysis

### 1. Authentication

| Backend Endpoint | Method | Frontend Status | Notes |
|------------------|--------|-----------------|-------|
| `/api/v1/auth/google/` | POST | ✅ Used | Google OAuth working |
| `/api/v1/auth/login/` | POST | ✅ Used | Email/password login implemented |
| `/api/v1/auth/logout/` | POST | ✅ Used | Backend logout called, then local tokens cleared |
| `/api/v1/auth/me/` | GET | ✅ Used | Used for user info |
| `/api/v1/auth/me/` | PATCH | ✅ Used | Profile editing in ProfilePage |
| `/api/v1/auth/password/change/` | POST | ✅ Used | Password change in ProfilePage |
| `/api/v1/auth/password/reset/` | POST | ✅ Used | Forgot password flow implemented |
| `/api/v1/auth/password/reset/confirm/` | POST | ✅ Used | Reset confirmation implemented |
| `/api/v1/auth/status/` | GET | ❌ Not Used | Could be used for session validation |
| `/api/v1/auth/token/refresh/` | POST | ✅ Used | Token refresh working |
| `/api/v1/auth/token/verify/` | POST | ❌ Not Used | Could verify token validity |
| `/api/v1/auth/user/` | GET/PUT/PATCH | ❌ Not Used | Duplicate of /me/, not needed |

**Gap Summary:**
- ~~Username/password login not available (Google-only)~~ ✅ DONE
- ~~No password reset/forgot password flow~~ ✅ DONE
- ~~User profile update not implemented~~ ✅ DONE
- ~~Logout doesn't call backend (may leave sessions active)~~ ✅ DONE
- ~~Password change for logged-in users~~ ✅ DONE

---

### 2. Bookings

| Backend Endpoint | Method | Frontend Status | Notes |
|------------------|--------|-----------------|-------|
| `/api/v1/bookings/` | GET | ✅ Used | List bookings working |
| `/api/v1/bookings/` | POST | ✅ Used | Create booking working |
| `/api/v1/bookings/{id}/` | GET | ✅ Used | View booking detail |
| `/api/v1/bookings/{id}/` | DELETE | ✅ Used | Cancel booking working |
| `/api/v1/bookings/{id}/request-reschedule/` | POST | ✅ Used | Reschedule modal in BookingsPage |

**Gap Summary:** ✅ Complete

---

### 3. Class Schedules (Authenticated)

| Backend Endpoint | Method | Frontend Status | Notes |
|------------------|--------|-----------------|-------|
| `/api/v1/class-schedules/` | GET | ✅ Used | For member booking page |
| `/api/v1/class-schedules/{id}/` | GET | ✅ Used | Class details |

**Gap Summary:** ✅ Complete

---

### 4. Contact Form

| Backend Endpoint | Method | Frontend Status | Notes |
|------------------|--------|-----------------|-------|
| `/api/v1/contact/` | POST | ✅ Used | Contact form working |

**Gap Summary:** ✅ Complete

---

### 5. Customer Profile

| Backend Endpoint | Method | Frontend Status | Notes |
|------------------|--------|-----------------|-------|
| `/api/v1/customers/me/` | GET | ✅ Used | Customer profile in ProfilePage |
| `/api/v1/customers/me/` | PUT/PATCH | ✅ Used | Emergency contact & DOB editing in ProfilePage |
| `/api/v1/customers/me/membership/` | GET | ✅ Used | Membership info working |
| `/api/v1/customers/me/notification-settings/` | GET/PATCH | ✅ Used | Notification preferences in ProfilePage |

**Available fields for update (from schema):**
- `emergency_contact_name` ✅
- `emergency_contact_phone` ✅
- `date_of_birth` ✅

**Gap Summary:** ✅ Complete

---

### 6. Trial Bookings

| Backend Endpoint | Method | Frontend Status | Notes |
|------------------|--------|-----------------|-------|
| `/api/v1/customers/trial-bookings/` | POST | ✅ Used | Trial form working |

**Backend supports:**
- Status workflow: `pending`, `contacted`, `scheduled`, `completed`, `cancelled`
- Email notifications (configured)

**Gap Summary:** ✅ Complete (frontend side)

---

### 7. Invoices

| Backend Endpoint | Method | Frontend Status | Notes |
|------------------|--------|-----------------|-------|
| `/api/v1/invoices/` | GET | ✅ Used | List invoices |
| `/api/v1/invoices/{id}/` | GET | ✅ Used | Invoice detail modal in InvoicesPage |
| `/api/v1/invoices/{id}/pdf/` | GET | ✅ Used | PDF download button in InvoicesPage |

**Backend provides:**
- Invoice list with status, amounts
- Invoice detail with line items, GST breakdown
- PDF download endpoint with proper GST formatting (CGST/SGST)

**Gap Summary:** ✅ Complete

---

### 8. Membership Plans

| Backend Endpoint | Method | Frontend Status | Notes |
|------------------|--------|-----------------|-------|
| `/api/v1/membership-plans/` | GET | ✅ Used | Pricing page working |
| `/api/v1/membership-plans/{slug}/` | GET | ❌ Not Used | Individual plan detail page |

**Gap Summary:**
- Could add individual plan detail pages (low priority)

---

### 9. Public Schedule

| Backend Endpoint | Method | Frontend Status | Notes |
|------------------|--------|-----------------|-------|
| `/api/v1/public/schedule/` | GET | ✅ Used | Public schedule page |
| `/api/v1/public/schedule/{id}/` | GET | ❌ Not Used | Individual class detail |

**Gap Summary:**
- Could add class detail popup/page (low priority)

---

### 10. Trainers/Instructors

| Backend Endpoint | Method | Frontend Status | Notes |
|------------------|--------|-----------------|-------|
| `/api/v1/trainers/` | GET | ✅ Used | Instructors page working |
| `/api/v1/trainers/{id}/` | GET | ❌ Not Used | Individual instructor profile |

**Gap Summary:**
- Could add instructor detail pages with their schedule (low priority)

---

### 11. Waitlist (NEW)

| Backend Endpoint | Method | Frontend Status | Notes |
|------------------|--------|-----------------|-------|
| `/api/v1/waitlist/join/` | POST | ✅ Used | Join waitlist for full classes |
| `/api/v1/waitlist/leave/` | POST | ✅ Used | Leave waitlist |

**Gap Summary:** ✅ Complete

---

### 12. Membership Requests (NEW)

| Backend Endpoint | Method | Frontend Status | Notes |
|------------------|--------|-----------------|-------|
| `/api/v1/membership/freeze-request/` | POST | ✅ Used | Freeze request modal in MembershipPage |
| `/api/v1/membership/cancel-request/` | POST | ✅ Used | Cancel request modal in MembershipPage |

**Gap Summary:** ✅ Complete

---

## Features Missing from Backend

Based on TEST_SCENARIOS.md requirements:

| Feature | Backend Status | Notes |
|---------|---------------|-------|
| ~~Waitlist for full classes~~ | ✅ Implemented | Frontend integrated |
| ~~Membership freeze/cancel request~~ | ✅ Implemented | Frontend integrated |
| Attendance/check-in | ❌ Not Found | No attendance endpoints |
| QR code scanning/verification | ❌ Not Found | No check-in API |
| Class type listing | ❌ Not Found | No public endpoint (only via schedule) |
| ~~Booking reminder settings~~ | ✅ Implemented | Notification preferences in ProfilePage |
| Usage statistics | ❌ Not Found | No stats endpoint for member |
| Membership history | ❌ Not Found | Only current membership |

---

## Frontend Features Not Using Backend

| Feature | Current State | Backend Available |
|---------|--------------|-------------------|
| ~~User logout~~ | ✅ Implemented | POST `/auth/logout/` |
| ~~Profile editing~~ | ✅ Implemented | PATCH `/auth/me/` and `/customers/me/` |
| ~~Reschedule booking~~ | ✅ Implemented | POST `/bookings/{id}/request-reschedule/` |
| ~~Invoice detail view~~ | ✅ Implemented | GET `/invoices/{id}/` |
| ~~Password change~~ | ✅ Implemented | POST `/auth/password/change/` |

**All previously identified gaps have been addressed.**

---

## Priority Fixes

### P0 - Should Fix Now (ALL COMPLETE)

| Issue | Type | Status |
|-------|------|--------|
| ~~Logout should call API~~ | Frontend | ✅ DONE |
| ~~Invoice detail view~~ | Frontend | ✅ DONE |
| ~~Profile editing~~ | Frontend | ✅ DONE |
| ~~Password change~~ | Frontend | ✅ DONE |

### P1 - Important for Operations (ALL COMPLETE)

| Issue | Type | Status |
|-------|------|--------|
| ~~Reschedule UI~~ | Frontend | ✅ DONE |
| ~~Password reset flow~~ | Frontend | ✅ DONE |
| ~~Username/password login~~ | Frontend | ✅ DONE |

### P2 - Backend Needed (MOSTLY COMPLETE)

| Feature | Status |
|---------|--------|
| ~~Waitlist~~ | ✅ DONE - Frontend integrated |
| Attendance | Backend needed |
| ~~Membership requests~~ | ✅ DONE - Frontend integrated |
| ~~Notification preferences~~ | ✅ DONE - Frontend integrated |

---

## API Coverage Matrix

```
✅ = Fully implemented in frontend
⚠️ = Partially implemented or API exists but not used
❌ = Not implemented (low priority or not needed)

Backend Endpoint                          Frontend
─────────────────────────────────────────────────────
AUTH
  POST /auth/google/                      ✅
  POST /auth/login/                       ✅
  POST /auth/logout/                      ✅
  GET  /auth/me/                          ✅
  PATCH /auth/me/                         ✅
  POST /auth/password/change/             ✅
  POST /auth/password/reset/              ✅
  POST /auth/password/reset/confirm/      ✅
  GET  /auth/status/                      ❌ (not needed)
  POST /auth/token/refresh/               ✅
  POST /auth/token/verify/                ❌ (not needed)

BOOKINGS
  GET  /bookings/                         ✅
  POST /bookings/                         ✅
  GET  /bookings/{id}/                    ✅
  DELETE /bookings/{id}/                  ✅
  POST /bookings/{id}/request-reschedule/ ✅

CLASS SCHEDULES
  GET  /class-schedules/                  ✅
  GET  /class-schedules/{id}/             ✅

CONTACT
  POST /contact/                          ✅

CUSTOMERS
  GET  /customers/me/                     ✅
  PATCH /customers/me/                    ✅
  GET  /customers/me/membership/          ✅
  POST /customers/trial-bookings/         ✅
  GET/PATCH /customers/me/notification-settings/ ✅

INVOICES
  GET  /invoices/                         ✅
  GET  /invoices/{id}/                    ✅
  GET  /invoices/{id}/pdf/                ✅

MEMBERSHIP PLANS
  GET  /membership-plans/                 ✅
  GET  /membership-plans/{slug}/          ❌ (low priority)

PUBLIC SCHEDULE
  GET  /public/schedule/                  ✅
  GET  /public/schedule/{id}/             ❌ (low priority)

TRAINERS
  GET  /trainers/                         ✅
  GET  /trainers/{id}/                    ❌ (low priority)

WAITLIST
  POST /waitlist/join/                    ✅
  POST /waitlist/leave/                   ✅

MEMBERSHIP REQUESTS
  POST /membership/freeze-request/        ✅
  POST /membership/cancel-request/        ✅
```

---

## Recommended Action Items

### P0 Items (ALL COMPLETE)

1. ~~**Fix logout**~~ - ✅ Backend logout called
2. ~~**Add invoice detail modal**~~ - ✅ Full detail modal implemented
3. ~~**Enable profile editing**~~ - ✅ User and customer profiles editable
4. ~~**Password change**~~ - ✅ Change password section in ProfilePage

### Low Priority (Nice to Have)

1. **Trainer detail pages** - Individual instructor profiles
2. **Plan detail pages** - Individual membership plan pages
3. **Class detail popup** - More info on public schedule

### Backend Still Needed

1. **Backend: Attendance API** - Check-in endpoints
2. ~~**Backend: PDF generation**~~ - ✅ DONE (WeasyPrint implementation)
3. **Backend: Class types endpoint** - Public listing
4. **Backend: Usage statistics** - Member stats endpoint

---

## Data Models Available (from Schema)

| Model | Description | Used |
|-------|-------------|------|
| User | Auth user | ✅ |
| Customer | Customer profile with emergency contact | ✅ |
| CustomerMembership | Active membership | ✅ |
| MembershipPlan | Plan definitions | ✅ |
| Booking | Class bookings | ✅ |
| ClassSchedule | Scheduled classes | ✅ |
| ClassType | Types of classes | ⚠️ Via schedule only |
| Trainer | Instructor profiles | ✅ |
| Invoice | Payment invoices | ✅ |
| TrialBooking | Trial requests | ✅ |
| ContactMessage | Contact form submissions | ✅ |
| Waitlist | Waitlist entries | ✅ |
| MembershipRequest | Freeze/cancel requests | ✅ |
| NotificationSettings | User preferences | ✅ |
| StudioConfig | Studio branding/GST config for invoices | ✅ (Backend) |

---

*This analysis should be updated when backend or frontend changes.*
