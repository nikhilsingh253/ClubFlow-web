# ClubFlow Admin API Specification

**Version:** 1.0
**Base URL:** `/api/v1/admin/`
**Authentication:** Bearer Token (JWT) + Role Check (Owner/Staff)

---

## Table of Contents

1. [Authentication & Authorization](#1-authentication--authorization)
2. [Dashboard](#2-dashboard)
3. [Customers](#3-customers)
4. [Memberships](#4-memberships)
5. [Class Schedules](#5-class-schedules)
6. [Bookings](#6-bookings)
7. [Attendance](#7-attendance)
8. [Trial Bookings](#8-trial-bookings)
9. [Contact Messages](#9-contact-messages)
10. [Invoices](#10-invoices)
11. [Waitlist](#11-waitlist)
12. [Membership Requests](#12-membership-requests)
13. [Class Types (Owner)](#13-class-types-owner-only)
14. [Membership Plans (Owner)](#14-membership-plans-owner-only)
15. [Trainers (Owner)](#15-trainers-owner-only)
16. [Staff Management (Owner)](#16-staff-management-owner-only)
17. [Studio Configuration (Owner)](#17-studio-configuration-owner-only)
18. [Reports (Owner)](#18-reports-owner-only)

---

## Common Patterns

### Authentication Header
```
Authorization: Bearer <jwt_token>
```

### Pagination (List Endpoints)
```json
{
  "count": 150,
  "next": "/api/v1/admin/customers/?page=2",
  "previous": null,
  "results": [...]
}
```

Query params: `?page=1&page_size=20`

### Filtering
Query params vary by endpoint, documented per endpoint.

### Error Responses
```json
{
  "error": "error_code",
  "message": "Human readable message",
  "details": { "field": ["error message"] }
}
```

### Common HTTP Status Codes
- `200` - Success
- `201` - Created
- `204` - No Content (successful delete)
- `400` - Bad Request (validation error)
- `401` - Unauthorized (not logged in)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate, etc.)

---

## 1. Authentication & Authorization

### 1.1 Admin Login
Same OAuth flow as customer portal, but returns additional role info.

**POST** `/api/v1/auth/google/`

**Response** (existing, add role):
```json
{
  "access_token": "eyJ...",
  "refresh_token": "eyJ...",
  "user": {
    "id": 1,
    "email": "owner@studio.com",
    "name": "Studio Owner",
    "role": "owner",
    "permissions": ["customers.view", "customers.edit", "reports.view", ...]
  }
}
```

**Roles:**
- `owner` - Full access
- `staff` - Limited access (no settings, no reports)

### 1.2 Get Current Admin User
**GET** `/api/v1/admin/me/`

**Response:**
```json
{
  "id": 1,
  "email": "owner@studio.com",
  "name": "Studio Owner",
  "role": "owner",
  "last_login": "2024-01-15T09:30:00Z"
}
```

---

## 2. Dashboard

### 2.1 Dashboard Stats
**GET** `/api/v1/admin/dashboard/stats/`

**Response:**
```json
{
  "today": {
    "date": "2024-01-15",
    "classes_count": 5,
    "total_bookings": 32,
    "checked_in": 18,
    "expected_remaining": 14
  },
  "alerts": {
    "new_trial_bookings": 3,
    "new_contact_messages": 1,
    "pending_membership_requests": 2,
    "expiring_memberships_7_days": 5
  },
  "quick_stats": {
    "active_members": 145,
    "new_members_this_month": 12,
    "revenue_this_month": 425000.00
  }
}
```

### 2.2 Today's Classes
**GET** `/api/v1/admin/dashboard/today-classes/`

**Response:**
```json
{
  "classes": [
    {
      "id": 101,
      "class_type": {
        "id": 1,
        "name": "Intro Reformer",
        "color": "#10B981"
      },
      "trainer": {
        "id": 1,
        "name": "Priya Sharma"
      },
      "start_time": "06:00",
      "end_time": "06:50",
      "location": "Studio A",
      "booked": 6,
      "capacity": 8,
      "checked_in": 4,
      "status": "in_progress"
    }
  ]
}
```

**Status values:** `upcoming`, `in_progress`, `completed`, `cancelled`

---

## 3. Customers

### 3.1 List Customers
**GET** `/api/v1/admin/customers/`

**Query Params:**
- `search` - Search by name, email, phone, card_number
- `membership_status` - `active`, `expired`, `none`
- `membership_plan` - Plan ID
- `joined_after` - Date (YYYY-MM-DD)
- `joined_before` - Date
- `ordering` - `name`, `-name`, `created_at`, `-created_at`, `last_visit`, `-last_visit`

**Response:**
```json
{
  "count": 145,
  "next": "/api/v1/admin/customers/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "card_number": "CF-0001",
      "name": "Rahul Kumar",
      "email": "rahul@example.com",
      "phone": "+919876543210",
      "membership_status": "active",
      "membership_plan": "8 Classes/Month",
      "classes_remaining": 5,
      "last_visit": "2024-01-14",
      "created_at": "2023-06-15T10:00:00Z"
    }
  ]
}
```

### 3.2 Get Customer Detail
**GET** `/api/v1/admin/customers/{id}/`

**Response:**
```json
{
  "id": 1,
  "card_number": "CF-0001",
  "name": "Rahul Kumar",
  "email": "rahul@example.com",
  "phone": "+919876543210",
  "date_of_birth": "1990-05-15",
  "emergency_contact_name": "Priya Kumar",
  "emergency_contact_phone": "+919876543211",
  "health_notes": "Mild back pain, avoid heavy stretches",
  "source": "instagram",
  "created_at": "2023-06-15T10:00:00Z",
  "user": {
    "id": 5,
    "email": "rahul@example.com",
    "is_active": true
  },
  "current_membership": {
    "id": 45,
    "plan": {
      "id": 2,
      "name": "8 Classes/Month"
    },
    "status": "active",
    "start_date": "2024-01-01",
    "end_date": "2024-01-31",
    "classes_total": 8,
    "classes_used": 3,
    "classes_remaining": 5,
    "auto_renew": false
  },
  "stats": {
    "total_classes_attended": 47,
    "classes_this_month": 3,
    "no_shows": 2,
    "member_since_days": 214
  }
}
```

### 3.3 Create Customer
**POST** `/api/v1/admin/customers/`

**Request:**
```json
{
  "name": "New Customer",
  "email": "new@example.com",
  "phone": "+919876543210",
  "date_of_birth": "1992-03-20",
  "emergency_contact_name": "Emergency Contact",
  "emergency_contact_phone": "+919876543211",
  "health_notes": "None",
  "source": "walk_in"
}
```

**Response:** `201 Created` with full customer object

**Source options:** `walk_in`, `website`, `referral`, `instagram`, `facebook`, `google`, `other`

### 3.4 Update Customer
**PATCH** `/api/v1/admin/customers/{id}/`

**Request:** (partial update)
```json
{
  "phone": "+919876543299",
  "health_notes": "Updated notes"
}
```

**Response:** `200 OK` with updated customer object

### 3.5 Customer Booking History
**GET** `/api/v1/admin/customers/{id}/bookings/`

**Query Params:**
- `status` - `confirmed`, `attended`, `cancelled`, `no_show`
- `from_date` - Date
- `to_date` - Date

**Response:**
```json
{
  "count": 47,
  "results": [
    {
      "id": 234,
      "class_schedule": {
        "id": 101,
        "class_type": "Intro Reformer",
        "date": "2024-01-14",
        "start_time": "09:00",
        "trainer": "Priya Sharma"
      },
      "status": "attended",
      "booked_at": "2024-01-12T14:00:00Z",
      "attended_at": "2024-01-14T08:55:00Z"
    }
  ]
}
```

### 3.6 Customer Membership History
**GET** `/api/v1/admin/customers/{id}/memberships/`

**Response:**
```json
{
  "results": [
    {
      "id": 45,
      "plan": {
        "id": 2,
        "name": "8 Classes/Month",
        "price": 7000.00
      },
      "status": "active",
      "start_date": "2024-01-01",
      "end_date": "2024-01-31",
      "classes_total": 8,
      "classes_used": 3
    },
    {
      "id": 38,
      "plan": {
        "id": 2,
        "name": "8 Classes/Month",
        "price": 7000.00
      },
      "status": "expired",
      "start_date": "2023-12-01",
      "end_date": "2023-12-31",
      "classes_total": 8,
      "classes_used": 8
    }
  ]
}
```

### 3.7 Customer Notes
**GET** `/api/v1/admin/customers/{id}/notes/`

**Response:**
```json
{
  "results": [
    {
      "id": 12,
      "note": "Called about membership renewal, will visit Saturday",
      "created_by": {
        "id": 1,
        "name": "Staff Member"
      },
      "created_at": "2024-01-14T15:30:00Z"
    }
  ]
}
```

**POST** `/api/v1/admin/customers/{id}/notes/`

**Request:**
```json
{
  "note": "Customer mentioned interest in personal training"
}
```

---

## 4. Memberships

### 4.1 List Active Memberships
**GET** `/api/v1/admin/memberships/`

**Query Params:**
- `status` - `active`, `expired`, `frozen`, `cancelled`
- `plan` - Plan ID
- `expiring_within_days` - Number (e.g., 7, 14, 30)
- `search` - Customer name/email/phone

**Response:**
```json
{
  "count": 145,
  "results": [
    {
      "id": 45,
      "customer": {
        "id": 1,
        "name": "Rahul Kumar",
        "email": "rahul@example.com",
        "phone": "+919876543210"
      },
      "plan": {
        "id": 2,
        "name": "8 Classes/Month"
      },
      "status": "active",
      "start_date": "2024-01-01",
      "end_date": "2024-01-31",
      "classes_total": 8,
      "classes_used": 3,
      "classes_remaining": 5,
      "days_remaining": 16
    }
  ]
}
```

### 4.2 Assign Membership
**POST** `/api/v1/admin/memberships/`

**Request:**
```json
{
  "customer_id": 1,
  "plan_id": 2,
  "start_date": "2024-01-15",
  "create_invoice": true,
  "mark_invoice_paid": false
}
```

**Response:** `201 Created`
```json
{
  "membership": {
    "id": 46,
    "customer": {...},
    "plan": {...},
    "status": "active",
    "start_date": "2024-01-15",
    "end_date": "2024-02-14",
    "classes_total": 8,
    "classes_used": 0
  },
  "invoice": {
    "id": 78,
    "invoice_number": "INV-2024-000078",
    "total": 8260.00,
    "status": "pending"
  }
}
```

### 4.3 Extend Membership
**POST** `/api/v1/admin/memberships/{id}/extend/`

**Request:**
```json
{
  "plan_id": 2,
  "create_invoice": true
}
```

**Response:** Updated membership + new invoice

### 4.4 Freeze Membership
**POST** `/api/v1/admin/memberships/{id}/freeze/`

**Request:**
```json
{
  "freeze_start": "2024-01-20",
  "freeze_end": "2024-02-05",
  "reason": "Medical leave"
}
```

**Response:**
```json
{
  "id": 45,
  "status": "frozen",
  "freeze_start": "2024-01-20",
  "freeze_end": "2024-02-05",
  "original_end_date": "2024-01-31",
  "new_end_date": "2024-02-16",
  "message": "Membership frozen. End date extended by 16 days."
}
```

### 4.5 Unfreeze Membership
**POST** `/api/v1/admin/memberships/{id}/unfreeze/`

**Response:** Updated membership with status `active`

### 4.6 Cancel Membership
**POST** `/api/v1/admin/memberships/{id}/cancel/`

**Request:**
```json
{
  "reason": "Customer requested",
  "refund_amount": 3500.00,
  "create_credit_note": true
}
```

**Response:** Updated membership with status `cancelled`

### 4.7 Add Classes (Manual Adjustment)
**POST** `/api/v1/admin/memberships/{id}/add-classes/`

**Request:**
```json
{
  "classes": 2,
  "reason": "Compensation for class cancellation"
}
```

---

## 5. Class Schedules

### 5.1 List Class Schedules
**GET** `/api/v1/admin/schedules/`

**Query Params:**
- `date` - Specific date (YYYY-MM-DD)
- `from_date` - Start of range
- `to_date` - End of range
- `class_type` - Class type ID
- `trainer` - Trainer ID
- `status` - `scheduled`, `cancelled`

**Response:**
```json
{
  "results": [
    {
      "id": 101,
      "class_type": {
        "id": 1,
        "name": "Intro Reformer",
        "color": "#10B981",
        "level": "beginner"
      },
      "trainer": {
        "id": 1,
        "name": "Priya Sharma"
      },
      "date": "2024-01-15",
      "start_time": "06:00",
      "end_time": "06:50",
      "location": "Studio A",
      "max_capacity": 8,
      "booked_count": 6,
      "attended_count": 0,
      "waitlist_count": 2,
      "status": "scheduled",
      "notes": ""
    }
  ]
}
```

### 5.2 Get Schedule Detail
**GET** `/api/v1/admin/schedules/{id}/`

**Response:** Full schedule object with bookings list
```json
{
  "id": 101,
  "class_type": {...},
  "trainer": {...},
  "date": "2024-01-15",
  "start_time": "06:00",
  "end_time": "06:50",
  "location": "Studio A",
  "max_capacity": 8,
  "status": "scheduled",
  "notes": "",
  "bookings": [
    {
      "id": 234,
      "customer": {
        "id": 1,
        "name": "Rahul Kumar",
        "card_number": "CF-0001"
      },
      "status": "confirmed",
      "booked_at": "2024-01-12T14:00:00Z",
      "is_trial": false
    }
  ],
  "waitlist": [
    {
      "id": 45,
      "customer": {
        "id": 5,
        "name": "Anita Singh"
      },
      "position": 1,
      "joined_at": "2024-01-13T10:00:00Z"
    }
  ]
}
```

### 5.3 Create Schedule
**POST** `/api/v1/admin/schedules/`

**Request:**
```json
{
  "class_type_id": 1,
  "trainer_id": 1,
  "date": "2024-01-20",
  "start_time": "06:00",
  "location": "Studio A",
  "max_capacity": 8,
  "notes": ""
}
```

`end_time` auto-calculated from class type duration.

**Response:** `201 Created` with schedule object

### 5.4 Create Recurring Schedule
**POST** `/api/v1/admin/schedules/recurring/`

**Request:**
```json
{
  "class_type_id": 1,
  "trainer_id": 1,
  "start_time": "06:00",
  "location": "Studio A",
  "max_capacity": 8,
  "days_of_week": [0, 2, 4],
  "start_date": "2024-01-15",
  "end_date": "2024-02-15",
  "notes": ""
}
```

`days_of_week`: 0=Monday, 1=Tuesday, ..., 6=Sunday

**Response:**
```json
{
  "created_count": 14,
  "schedules": [...]
}
```

### 5.5 Update Schedule
**PATCH** `/api/v1/admin/schedules/{id}/`

**Request:**
```json
{
  "trainer_id": 2,
  "notes": "Substitute instructor"
}
```

### 5.6 Cancel Schedule
**POST** `/api/v1/admin/schedules/{id}/cancel/`

**Request:**
```json
{
  "reason": "Instructor unavailable",
  "notify_customers": true,
  "restore_credits": true
}
```

**Response:**
```json
{
  "id": 101,
  "status": "cancelled",
  "cancelled_reason": "Instructor unavailable",
  "bookings_cancelled": 6,
  "credits_restored": 6,
  "notifications_sent": 6
}
```

### 5.7 Delete Schedule
**DELETE** `/api/v1/admin/schedules/{id}/`

Only allowed if no bookings exist. Returns `409 Conflict` if bookings exist.

---

## 6. Bookings

### 6.1 List Bookings
**GET** `/api/v1/admin/bookings/`

**Query Params:**
- `schedule` - Schedule ID
- `customer` - Customer ID
- `status` - `confirmed`, `attended`, `cancelled`, `no_show`
- `date` - Date
- `from_date`, `to_date` - Date range
- `search` - Customer name/phone

**Response:**
```json
{
  "count": 500,
  "results": [
    {
      "id": 234,
      "customer": {
        "id": 1,
        "name": "Rahul Kumar",
        "card_number": "CF-0001",
        "phone": "+919876543210"
      },
      "class_schedule": {
        "id": 101,
        "class_type": "Intro Reformer",
        "date": "2024-01-15",
        "start_time": "06:00",
        "trainer": "Priya Sharma"
      },
      "status": "confirmed",
      "booked_at": "2024-01-12T14:00:00Z",
      "is_trial": false,
      "is_comp": false
    }
  ]
}
```

### 6.2 Create Booking (Admin)
**POST** `/api/v1/admin/bookings/`

**Request:**
```json
{
  "customer_id": 1,
  "schedule_id": 101,
  "override_capacity": false,
  "is_comp": false,
  "notes": ""
}
```

- `override_capacity`: Allow booking even if class is full
- `is_comp`: Complimentary booking (no credit deducted)

**Response:** `201 Created` with booking object

### 6.3 Cancel Booking (Admin)
**POST** `/api/v1/admin/bookings/{id}/cancel/`

**Request:**
```json
{
  "reason": "customer_requested",
  "restore_credit": true
}
```

**Reason options:** `customer_requested`, `no_show`, `class_cancelled`, `admin_action`, `other`

### 6.4 Move Booking
**POST** `/api/v1/admin/bookings/{id}/move/`

**Request:**
```json
{
  "new_schedule_id": 105
}
```

### 6.5 Mark No-Show
**POST** `/api/v1/admin/bookings/{id}/no-show/`

**Response:** Booking with status `no_show`

---

## 7. Attendance

### 7.1 Check-in Customer (QR/Search)
**POST** `/api/v1/admin/attendance/check-in/`

**Request:**
```json
{
  "identifier": "CF-0001"
}
```

`identifier` can be: card_number, email, phone, or customer_id

**Response:**
```json
{
  "customer": {
    "id": 1,
    "name": "Rahul Kumar",
    "card_number": "CF-0001",
    "photo_url": null
  },
  "membership": {
    "status": "active",
    "plan": "8 Classes/Month",
    "classes_remaining": 5
  },
  "today_booking": {
    "id": 234,
    "class_schedule": {
      "id": 101,
      "class_type": "Intro Reformer",
      "start_time": "06:00"
    },
    "status": "confirmed"
  },
  "action_available": "check_in"
}
```

**action_available values:**
- `check_in` - Has booking, can check in
- `already_checked_in` - Already marked attended
- `no_booking` - No booking today (can create walk-in)
- `membership_expired` - Membership expired
- `not_found` - Customer not found

### 7.2 Confirm Check-in
**POST** `/api/v1/admin/attendance/confirm/`

**Request:**
```json
{
  "booking_id": 234
}
```

**Response:** Booking with status `attended`

### 7.3 Walk-in Booking
**POST** `/api/v1/admin/attendance/walk-in/`

**Request:**
```json
{
  "customer_id": 1,
  "schedule_id": 101
}
```

Creates booking and marks as attended in one step.

### 7.4 Class Attendance List
**GET** `/api/v1/admin/schedules/{id}/attendance/`

**Response:**
```json
{
  "schedule": {
    "id": 101,
    "class_type": "Intro Reformer",
    "date": "2024-01-15",
    "start_time": "06:00"
  },
  "summary": {
    "total_booked": 6,
    "attended": 4,
    "no_show": 1,
    "pending": 1
  },
  "bookings": [
    {
      "id": 234,
      "customer": {
        "id": 1,
        "name": "Rahul Kumar",
        "card_number": "CF-0001"
      },
      "status": "attended",
      "checked_in_at": "2024-01-15T05:55:00Z"
    },
    {
      "id": 235,
      "customer": {
        "id": 2,
        "name": "Priya Singh",
        "card_number": "CF-0002"
      },
      "status": "confirmed",
      "checked_in_at": null
    }
  ]
}
```

### 7.5 Bulk Update Attendance
**POST** `/api/v1/admin/schedules/{id}/attendance/bulk/`

**Request:**
```json
{
  "updates": [
    {"booking_id": 234, "status": "attended"},
    {"booking_id": 235, "status": "attended"},
    {"booking_id": 236, "status": "no_show"}
  ]
}
```

**Response:**
```json
{
  "updated": 3,
  "results": [
    {"booking_id": 234, "status": "attended", "success": true},
    {"booking_id": 235, "status": "attended", "success": true},
    {"booking_id": 236, "status": "no_show", "success": true}
  ]
}
```

---

## 8. Trial Bookings

### 8.1 List Trial Bookings
**GET** `/api/v1/admin/trial-bookings/`

**Query Params:**
- `status` - `new`, `contacted`, `scheduled`, `completed`, `converted`, `lost`
- `from_date`, `to_date` - Date range

**Response:**
```json
{
  "count": 15,
  "results": [
    {
      "id": 1,
      "name": "Potential Customer",
      "email": "potential@example.com",
      "phone": "+919876543210",
      "preferred_time": "morning",
      "notes": "Interested in beginner classes",
      "status": "new",
      "scheduled_class": null,
      "created_at": "2024-01-14T10:00:00Z"
    }
  ]
}
```

### 8.2 Get Trial Booking Detail
**GET** `/api/v1/admin/trial-bookings/{id}/`

### 8.3 Update Trial Booking Status
**PATCH** `/api/v1/admin/trial-bookings/{id}/`

**Request:**
```json
{
  "status": "contacted",
  "staff_notes": "Called, interested in Saturday class"
}
```

### 8.4 Schedule Trial Class
**POST** `/api/v1/admin/trial-bookings/{id}/schedule/`

**Request:**
```json
{
  "schedule_id": 105
}
```

**Response:**
```json
{
  "id": 1,
  "status": "scheduled",
  "scheduled_class": {
    "id": 105,
    "class_type": "Intro Reformer",
    "date": "2024-01-20",
    "start_time": "09:00"
  },
  "trial_booking_created": {
    "id": 300,
    "is_trial": true
  }
}
```

### 8.5 Convert to Customer
**POST** `/api/v1/admin/trial-bookings/{id}/convert/`

**Request:**
```json
{
  "plan_id": 1,
  "create_invoice": true
}
```

**Response:**
```json
{
  "trial_booking": {
    "id": 1,
    "status": "converted"
  },
  "customer": {
    "id": 50,
    "name": "Potential Customer",
    "card_number": "CF-0050"
  },
  "membership": {
    "id": 60,
    "plan": "4 Classes/Month"
  },
  "invoice": {
    "id": 80,
    "invoice_number": "INV-2024-000080"
  }
}
```

### 8.6 Mark as Lost
**POST** `/api/v1/admin/trial-bookings/{id}/mark-lost/`

**Request:**
```json
{
  "reason": "price_concern"
}
```

**Reason options:** `price_concern`, `timing_issue`, `not_interested`, `competitor`, `no_response`, `other`

---

## 9. Contact Messages

### 9.1 List Contact Messages
**GET** `/api/v1/admin/contact-messages/`

**Query Params:**
- `status` - `new`, `in_progress`, `resolved`
- `from_date`, `to_date`

**Response:**
```json
{
  "count": 10,
  "results": [
    {
      "id": 1,
      "name": "Interested Person",
      "email": "interest@example.com",
      "phone": "+919876543210",
      "message": "I would like to know more about your classes...",
      "status": "new",
      "created_at": "2024-01-14T10:00:00Z"
    }
  ]
}
```

### 9.2 Get Message Detail
**GET** `/api/v1/admin/contact-messages/{id}/`

### 9.3 Update Message Status
**PATCH** `/api/v1/admin/contact-messages/{id}/`

**Request:**
```json
{
  "status": "resolved",
  "staff_notes": "Called and answered questions. Will visit for trial."
}
```

---

## 10. Invoices

### 10.1 List Invoices
**GET** `/api/v1/admin/invoices/`

**Query Params:**
- `status` - `pending`, `paid`, `overdue`, `cancelled`
- `customer` - Customer ID
- `from_date`, `to_date`
- `search` - Invoice number, customer name

**Response:**
```json
{
  "count": 200,
  "results": [
    {
      "id": 78,
      "invoice_number": "INV-2024-000078",
      "customer": {
        "id": 1,
        "name": "Rahul Kumar"
      },
      "subtotal": 7000.00,
      "cgst": 630.00,
      "sgst": 630.00,
      "total": 8260.00,
      "status": "paid",
      "due_date": "2024-01-20",
      "paid_date": "2024-01-15",
      "created_at": "2024-01-15T10:00:00Z"
    }
  ]
}
```

### 10.2 Get Invoice Detail
**GET** `/api/v1/admin/invoices/{id}/`

**Response:**
```json
{
  "id": 78,
  "invoice_number": "INV-2024-000078",
  "customer": {
    "id": 1,
    "name": "Rahul Kumar",
    "email": "rahul@example.com",
    "phone": "+919876543210",
    "address": "123 Main St, Mumbai"
  },
  "line_items": [
    {
      "description": "8 Classes/Month Membership",
      "hsn_sac": "999293",
      "quantity": 1,
      "unit_price": 7000.00,
      "amount": 7000.00
    }
  ],
  "subtotal": 7000.00,
  "cgst_rate": 9,
  "cgst": 630.00,
  "sgst_rate": 9,
  "sgst": 630.00,
  "total": 8260.00,
  "status": "paid",
  "due_date": "2024-01-20",
  "payment": {
    "method": "upi",
    "reference": "UPI123456",
    "paid_date": "2024-01-15",
    "paid_amount": 8260.00
  },
  "notes": "",
  "created_at": "2024-01-15T10:00:00Z"
}
```

### 10.3 Create Invoice
**POST** `/api/v1/admin/invoices/`

**Request:**
```json
{
  "customer_id": 1,
  "line_items": [
    {
      "description": "8 Classes/Month Membership",
      "quantity": 1,
      "unit_price": 7000.00
    }
  ],
  "due_date": "2024-01-20",
  "notes": ""
}
```

GST calculated automatically.

**Response:** `201 Created` with invoice object

### 10.4 Record Payment
**POST** `/api/v1/admin/invoices/{id}/pay/`

**Request:**
```json
{
  "method": "upi",
  "reference": "UPI123456",
  "paid_date": "2024-01-15",
  "amount": 8260.00
}
```

**Method options:** `cash`, `upi`, `card`, `bank_transfer`, `cheque`

### 10.5 Download PDF
**GET** `/api/v1/admin/invoices/{id}/pdf/`

**Response:** PDF file download

### 10.6 Send Invoice Email
**POST** `/api/v1/admin/invoices/{id}/send-email/`

**Response:**
```json
{
  "sent": true,
  "sent_to": "rahul@example.com"
}
```

### 10.7 Void Invoice
**POST** `/api/v1/admin/invoices/{id}/void/`

**Request:**
```json
{
  "reason": "Duplicate invoice"
}
```

---

## 11. Waitlist

### 11.1 List Waitlist Entries
**GET** `/api/v1/admin/waitlist/`

**Query Params:**
- `schedule` - Schedule ID
- `status` - `waiting`, `notified`, `expired`, `booked`, `cancelled`

**Response:**
```json
{
  "results": [
    {
      "id": 45,
      "customer": {
        "id": 5,
        "name": "Anita Singh",
        "phone": "+919876543210"
      },
      "class_schedule": {
        "id": 101,
        "class_type": "Intro Reformer",
        "date": "2024-01-15",
        "start_time": "06:00"
      },
      "position": 1,
      "status": "waiting",
      "joined_at": "2024-01-13T10:00:00Z"
    }
  ]
}
```

### 11.2 Promote from Waitlist
**POST** `/api/v1/admin/waitlist/{id}/promote/`

Creates booking for waitlisted customer.

**Response:**
```json
{
  "waitlist_entry": {
    "id": 45,
    "status": "booked"
  },
  "booking": {
    "id": 250,
    "status": "confirmed"
  }
}
```

### 11.3 Remove from Waitlist
**DELETE** `/api/v1/admin/waitlist/{id}/`

---

## 12. Membership Requests

### 12.1 List Membership Requests
**GET** `/api/v1/admin/membership-requests/`

**Query Params:**
- `status` - `pending`, `approved`, `denied`
- `type` - `freeze`, `cancel`

**Response:**
```json
{
  "results": [
    {
      "id": 10,
      "customer": {
        "id": 1,
        "name": "Rahul Kumar"
      },
      "membership": {
        "id": 45,
        "plan": "8 Classes/Month"
      },
      "request_type": "freeze",
      "reason": "Going on vacation",
      "freeze_start": "2024-02-01",
      "freeze_end": "2024-02-15",
      "status": "pending",
      "created_at": "2024-01-14T10:00:00Z"
    }
  ]
}
```

### 12.2 Approve Request
**POST** `/api/v1/admin/membership-requests/{id}/approve/`

**Response:** Request with status `approved`, membership updated accordingly

### 12.3 Deny Request
**POST** `/api/v1/admin/membership-requests/{id}/deny/`

**Request:**
```json
{
  "reason": "Already used freeze this quarter"
}
```

---

## 13. Class Types (Owner Only)

### 13.1 List Class Types
**GET** `/api/v1/admin/class-types/`

**Response:**
```json
{
  "results": [
    {
      "id": 1,
      "name": "Intro Reformer",
      "slug": "intro-reformer",
      "description": "Perfect introduction to Pilates...",
      "level": "beginner",
      "duration_minutes": 50,
      "max_capacity": 8,
      "color": "#10B981",
      "image_url": null,
      "is_active": true,
      "display_order": 1
    }
  ]
}
```

### 13.2 Create Class Type
**POST** `/api/v1/admin/class-types/`

**Request:**
```json
{
  "name": "New Class",
  "description": "Description here",
  "level": "intermediate",
  "duration_minutes": 50,
  "max_capacity": 8,
  "color": "#3B82F6",
  "is_active": true,
  "display_order": 5
}
```

### 13.3 Update Class Type
**PATCH** `/api/v1/admin/class-types/{id}/`

### 13.4 Delete/Deactivate Class Type
**DELETE** `/api/v1/admin/class-types/{id}/`

Returns `409 Conflict` if schedules exist. Use PATCH to set `is_active: false` instead.

---

## 14. Membership Plans (Owner Only)

### 14.1 List Plans
**GET** `/api/v1/admin/membership-plans/`

**Response:**
```json
{
  "results": [
    {
      "id": 2,
      "name": "8 Classes/Month",
      "slug": "8-classes-month",
      "description": "Our most popular plan...",
      "price": 7000.00,
      "classes_per_month": 8,
      "duration_days": 30,
      "features": ["8 classes per month", "Priority booking", ...],
      "is_popular": true,
      "is_active": true,
      "display_order": 2
    }
  ]
}
```

### 14.2 Create Plan
**POST** `/api/v1/admin/membership-plans/`

### 14.3 Update Plan
**PATCH** `/api/v1/admin/membership-plans/{id}/`

### 14.4 Delete/Deactivate Plan
**DELETE** `/api/v1/admin/membership-plans/{id}/`

Returns `409` if active memberships exist. Use PATCH to deactivate.

---

## 15. Trainers (Owner Only)

### 15.1 List Trainers
**GET** `/api/v1/admin/trainers/`

**Response:**
```json
{
  "results": [
    {
      "id": 1,
      "name": "Priya Sharma",
      "email": "priya@studio.com",
      "phone": "+919876543210",
      "bio": "Certified Pilates instructor...",
      "years_experience": 5,
      "specializations": ["Reformer", "Rehabilitation"],
      "certifications": ["STOTT Pilates Certified"],
      "photo_url": null,
      "is_active": true,
      "display_order": 1
    }
  ]
}
```

### 15.2 Create Trainer
**POST** `/api/v1/admin/trainers/`

### 15.3 Update Trainer
**PATCH** `/api/v1/admin/trainers/{id}/`

### 15.4 Upload Trainer Photo
**POST** `/api/v1/admin/trainers/{id}/photo/`

**Request:** `multipart/form-data` with `photo` file

### 15.5 Delete/Deactivate Trainer
**DELETE** `/api/v1/admin/trainers/{id}/`

Returns `409` if assigned to future schedules. Use PATCH to deactivate.

---

## 16. Staff Management (Owner Only)

### 16.1 List Staff
**GET** `/api/v1/admin/staff/`

**Response:**
```json
{
  "results": [
    {
      "id": 2,
      "name": "Staff Member",
      "email": "staff@studio.com",
      "role": "staff",
      "is_active": true,
      "last_login": "2024-01-14T09:00:00Z",
      "created_at": "2023-06-01T10:00:00Z"
    }
  ]
}
```

### 16.2 Invite Staff
**POST** `/api/v1/admin/staff/invite/`

**Request:**
```json
{
  "email": "newstaff@studio.com",
  "name": "New Staff",
  "role": "staff"
}
```

Sends invitation email.

### 16.3 Update Staff
**PATCH** `/api/v1/admin/staff/{id}/`

**Request:**
```json
{
  "role": "owner",
  "is_active": true
}
```

### 16.4 Deactivate Staff
**POST** `/api/v1/admin/staff/{id}/deactivate/`

### 16.5 Reset Staff Password
**POST** `/api/v1/admin/staff/{id}/reset-password/`

Sends password reset email.

---

## 17. Studio Configuration (Owner Only)

### 17.1 Get Studio Config
**GET** `/api/v1/admin/studio/config/`

**Response:**
```json
{
  "name": "FitRit Pilates Studio",
  "address_line1": "123 MG Road",
  "address_line2": "Block A",
  "city": "Gurgaon",
  "state": "Haryana",
  "pincode": "122001",
  "phone": "+91-124-4567890",
  "email": "info@fitrit.com",
  "website": "https://fitrit.com",
  "logo_url": null,
  "social_links": {
    "instagram": "https://instagram.com/fitrit",
    "facebook": ""
  },
  "operating_hours": {
    "monday": {"open": "06:00", "close": "21:00"},
    "tuesday": {"open": "06:00", "close": "21:00"},
    "sunday": {"open": null, "close": null}
  },
  "gstin": "06AABCT1234F1ZH",
  "hsn_sac_code": "999293",
  "invoice_prefix": "INV",
  "policies": {
    "advance_booking_days": 7,
    "cancellation_hours": 12,
    "late_cancel_penalty": true,
    "no_show_penalty": true,
    "waitlist_enabled": true,
    "auto_book_from_waitlist": false
  }
}
```

### 17.2 Update Studio Config
**PATCH** `/api/v1/admin/studio/config/`

### 17.3 Upload Logo
**POST** `/api/v1/admin/studio/logo/`

**Request:** `multipart/form-data` with `logo` file

---

## 18. Reports (Owner Only)

### 18.1 Attendance Report
**GET** `/api/v1/admin/reports/attendance/`

**Query Params:**
- `from_date` (required)
- `to_date` (required)
- `group_by` - `day`, `week`, `month`, `class_type`, `trainer`

**Response:**
```json
{
  "period": {
    "from": "2024-01-01",
    "to": "2024-01-15"
  },
  "summary": {
    "total_classes": 45,
    "total_bookings": 320,
    "total_attended": 290,
    "total_no_shows": 20,
    "total_cancelled": 10,
    "attendance_rate": 90.6,
    "avg_class_size": 6.4
  },
  "breakdown": [
    {
      "date": "2024-01-15",
      "classes": 5,
      "bookings": 32,
      "attended": 28,
      "no_shows": 3,
      "attendance_rate": 87.5
    }
  ]
}
```

### 18.2 Revenue Report
**GET** `/api/v1/admin/reports/revenue/`

**Query Params:**
- `from_date` (required)
- `to_date` (required)
- `group_by` - `day`, `week`, `month`, `plan`

**Response:**
```json
{
  "period": {
    "from": "2024-01-01",
    "to": "2024-01-15"
  },
  "summary": {
    "total_invoiced": 425000.00,
    "total_collected": 400000.00,
    "outstanding": 25000.00,
    "avg_invoice_value": 8500.00
  },
  "breakdown": [
    {
      "date": "2024-01-15",
      "invoiced": 25000.00,
      "collected": 25000.00,
      "invoice_count": 3
    }
  ],
  "by_plan": [
    {
      "plan": "8 Classes/Month",
      "count": 30,
      "revenue": 248000.00
    }
  ]
}
```

### 18.3 Membership Report
**GET** `/api/v1/admin/reports/memberships/`

**Response:**
```json
{
  "current": {
    "total_active": 145,
    "by_plan": [
      {"plan": "4 Classes/Month", "count": 45},
      {"plan": "8 Classes/Month", "count": 70},
      {"plan": "Unlimited", "count": 30}
    ]
  },
  "expiring": {
    "next_7_days": 12,
    "next_14_days": 25,
    "next_30_days": 45
  },
  "trends": {
    "new_this_month": 15,
    "churned_this_month": 8,
    "net_growth": 7
  }
}
```

### 18.4 Trial Conversion Report
**GET** `/api/v1/admin/reports/trials/`

**Query Params:**
- `from_date` (required)
- `to_date` (required)

**Response:**
```json
{
  "period": {
    "from": "2024-01-01",
    "to": "2024-01-15"
  },
  "summary": {
    "total_trials": 25,
    "converted": 15,
    "lost": 5,
    "pending": 5,
    "conversion_rate": 75.0
  },
  "by_source": [
    {"source": "instagram", "trials": 10, "converted": 8},
    {"source": "website", "trials": 8, "converted": 5}
  ],
  "lost_reasons": [
    {"reason": "price_concern", "count": 3},
    {"reason": "timing_issue", "count": 2}
  ]
}
```

### 18.5 Class Performance Report
**GET** `/api/v1/admin/reports/classes/`

**Query Params:**
- `from_date` (required)
- `to_date` (required)

**Response:**
```json
{
  "by_class_type": [
    {
      "class_type": "Intro Reformer",
      "total_classes": 20,
      "total_capacity": 160,
      "total_booked": 140,
      "utilization_rate": 87.5
    }
  ],
  "by_time_slot": [
    {
      "time": "06:00",
      "avg_booking_rate": 95.0
    },
    {
      "time": "09:00",
      "avg_booking_rate": 85.0
    }
  ],
  "by_trainer": [
    {
      "trainer": "Priya Sharma",
      "classes_taught": 15,
      "avg_attendance": 6.2,
      "avg_rating": null
    }
  ]
}
```

### 18.6 Export Report
**GET** `/api/v1/admin/reports/{report_type}/export/`

**Query Params:** Same as respective report + `format=csv`

**Response:** CSV file download

---

## Appendix: Enum Values

### Booking Status
- `confirmed` - Booking confirmed
- `attended` - Customer attended
- `cancelled` - Booking cancelled
- `no_show` - Customer didn't attend

### Membership Status
- `active` - Currently active
- `expired` - Past end date
- `frozen` - Temporarily paused
- `cancelled` - Terminated

### Invoice Status
- `pending` - Awaiting payment
- `paid` - Payment received
- `overdue` - Past due date, unpaid
- `cancelled` - Voided

### Trial Booking Status
- `new` - Just submitted
- `contacted` - Staff contacted prospect
- `scheduled` - Trial class scheduled
- `completed` - Trial attended
- `converted` - Became a member
- `lost` - Did not convert

### Contact Message Status
- `new` - Unread
- `in_progress` - Being handled
- `resolved` - Completed

### Membership Request Status
- `pending` - Awaiting review
- `approved` - Approved by staff
- `denied` - Denied by staff

### Payment Method
- `cash`
- `upi`
- `card`
- `bank_transfer`
- `cheque`

### Class Level
- `beginner`
- `intermediate`
- `advanced`
- `all_levels`

### Customer Source
- `walk_in`
- `website`
- `referral`
- `instagram`
- `facebook`
- `google`
- `other`

---

*Document Version: 1.0*
*For: Frontend & Backend parallel development*
