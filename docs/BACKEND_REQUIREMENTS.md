# Backend Requirements for Phase 1 Launch

**Created:** January 4, 2026
**Status:** Pending Backend Implementation
**Frontend Status:** Completed (waiting for API connections)

---

## Overview

This document outlines the backend API endpoints and functionality required to complete the Phase 1 MVP launch. The frontend is ready and waiting for these APIs.

---

## Priority 1: Trial Booking API

### Endpoint Required
```
POST /api/v1/trial-bookings/
```

### Request Body
```json
{
  "full_name": "string (required)",
  "email": "string (required, valid email)",
  "phone": "string (required)",
  "preferred_time": "string (required) - one of: 'morning', 'afternoon', 'evening', 'flexible'",
  "notes": "string (optional)"
}
```

### Response
```json
{
  "id": "uuid",
  "full_name": "string",
  "email": "string",
  "phone": "string",
  "preferred_time": "string",
  "notes": "string",
  "created_at": "datetime",
  "status": "pending"
}
```

### Backend Tasks
1. Create `TrialBooking` model (or add to existing Customer model with 'lead' status)
2. Create `TrialBookingSerializer`
3. Create `TrialBookingViewSet` with POST endpoint
4. Send email notification to staff when trial is submitted
5. Send confirmation email to customer
6. Make endpoint publicly accessible (no auth required)

### Frontend File Ready
- `src/pages/public/TrialBookingPage.tsx` - Form built, needs API connection
- `src/api/trialBookings.ts` - To be created when API is ready

---

## Priority 2: Invoice APIs

### Endpoints Required

#### List Invoices
```
GET /api/v1/invoices/
```

**Response:**
```json
{
  "count": 10,
  "results": [
    {
      "id": "uuid",
      "invoice_number": "INV-2026-0001",
      "invoice_date": "2026-01-01",
      "due_date": "2026-01-15",
      "status": "paid|pending|overdue|cancelled",
      "subtotal": 5000.00,
      "tax_amount": 900.00,
      "total_amount": 5900.00,
      "paid_date": "2026-01-05 or null"
    }
  ]
}
```

#### Invoice Detail
```
GET /api/v1/invoices/{id}/
```

**Response:**
```json
{
  "id": "uuid",
  "invoice_number": "INV-2026-0001",
  "invoice_date": "2026-01-01",
  "due_date": "2026-01-15",
  "status": "paid",
  "customer": {
    "id": "uuid",
    "name": "Customer Name",
    "email": "customer@example.com",
    "address": "Address line"
  },
  "line_items": [
    {
      "description": "Monthly Unlimited Membership - January 2026",
      "quantity": 1,
      "unit_price": 5000.00,
      "amount": 5000.00
    }
  ],
  "subtotal": 5000.00,
  "cgst_amount": 450.00,
  "sgst_amount": 450.00,
  "total_amount": 5900.00,
  "paid_date": "2026-01-05",
  "payment_method": "UPI",
  "notes": "optional notes"
}
```

#### Download Invoice PDF
```
GET /api/v1/invoices/{id}/pdf/
```

**Response:** PDF file download

### Backend Tasks
1. Create `InvoiceSerializer` with line items
2. Create `InvoiceViewSet` with list, retrieve, download_pdf actions
3. Implement PDF generation (use reportlab or weasyprint)
4. Include GST breakdown (CGST 9%, SGST 9% = 18% total)
5. Filter invoices by authenticated customer only

### Frontend File Ready
- `src/pages/portal/InvoicesPage.tsx` - UI built, using mock data
- `src/api/invoices.ts` - Already exists with placeholder functions

---

## Priority 3: Public Class Schedule API

### Endpoint Required
```
GET /api/v1/public/schedule/
```

Currently the schedule API requires authentication. We need a public endpoint for visitors.

### Query Parameters
- `date_from`: Start date (default: today)
- `date_to`: End date (default: today + 7 days)
- `class_type`: Filter by class type slug (optional)

### Response
```json
{
  "count": 20,
  "results": [
    {
      "id": "uuid",
      "class_type": {
        "id": "uuid",
        "name": "Foundation Reformer",
        "slug": "foundation-reformer",
        "level": "foundation",
        "description": "...",
        "duration_minutes": 50
      },
      "instructor": {
        "id": "uuid",
        "name": "Priya Sharma",
        "photo_url": "..."
      },
      "start_time": "2026-01-05T09:00:00",
      "end_time": "2026-01-05T09:50:00",
      "capacity": 8,
      "booked_count": 5,
      "spots_available": 3,
      "status": "scheduled|full|cancelled"
    }
  ]
}
```

### Backend Tasks
1. Create public schedule endpoint (AllowAny permission)
2. Return upcoming classes for next 7 days by default
3. Exclude past classes
4. Include spots availability
5. Allow filtering by class type and date range

### Frontend File Ready
- `src/pages/public/SchedulePage.tsx` - Currently using sample data

---

## Priority 4: Contact Form API

### Endpoint Required
```
POST /api/v1/contact/
```

### Request Body
```json
{
  "name": "string (required)",
  "email": "string (required)",
  "phone": "string (optional)",
  "message": "string (required)"
}
```

### Response
```json
{
  "success": true,
  "message": "Thank you for your message. We'll respond within 24 hours."
}
```

### Backend Tasks
1. Create `ContactMessage` model
2. Create serializer and viewset
3. Send email notification to staff
4. Store message in database for follow-up
5. Make endpoint publicly accessible

### Frontend File Ready
- `src/pages/public/ContactPage.tsx` - Form built, needs API connection

---

## Priority 5: Email Notification System

### Required Email Templates

| Template | Trigger | Recipient |
|----------|---------|-----------|
| `trial_booking_confirmation.html` | Trial form submitted | Customer |
| `trial_booking_notification.html` | Trial form submitted | Staff |
| `contact_confirmation.html` | Contact form submitted | Customer |
| `contact_notification.html` | Contact form submitted | Staff |
| `booking_confirmation.html` | Class booked | Customer |
| `booking_cancellation.html` | Class cancelled | Customer |

### Backend Tasks
1. Configure email backend (SendGrid recommended)
2. Create email service class with send methods
3. Create HTML email templates with FitRit branding
4. Use Celery for async sending (don't block requests)

### Environment Variables Needed
```
SENDGRID_API_KEY=xxx
DEFAULT_FROM_EMAIL=hello@fitrit.in
STAFF_NOTIFICATION_EMAIL=staff@fitrit.in
```

---

## Priority 6: Membership Enhancement

### Endpoint Enhancement
```
GET /api/v1/memberships/current/
```

### Additional Fields Needed
```json
{
  "id": "uuid",
  "plan": {...},
  "card_number": "FIT-2026-00001",
  "status": "active",
  "start_date": "2026-01-01",
  "end_date": "2026-02-01",
  "classes_included": 12,
  "classes_used": 5,
  "classes_remaining": 7,
  "renewal_date": "2026-02-01",
  "auto_renew": false
}
```

### Backend Tasks
1. Add `classes_used` calculation to serializer
2. Add `classes_remaining` calculation
3. Ensure `card_number` is generated on membership creation

### Frontend File Ready
- `src/pages/portal/MembershipPage.tsx` - Shows QR code with card_number

---

## API Response Standards

### Success Response
```json
{
  "count": 10,
  "next": "url or null",
  "previous": "url or null",
  "results": [...]
}
```

### Error Response
```json
{
  "detail": "Error message",
  "errors": {
    "field_name": ["Error for this field"]
  }
}
```

### Status Codes
- `200` - Success
- `201` - Created
- `400` - Validation error
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not found
- `500` - Server error

---

## Frontend Files Ready for API Connection

| Frontend File | Waiting For |
|--------------|-------------|
| `src/pages/public/TrialBookingPage.tsx` | Trial booking API |
| `src/pages/public/ContactPage.tsx` | Contact form API |
| `src/pages/public/SchedulePage.tsx` | Public schedule API |
| `src/pages/portal/InvoicesPage.tsx` | Invoice APIs |
| `src/pages/portal/MembershipPage.tsx` | Enhanced membership API |

---

## Testing the APIs

Once endpoints are ready, frontend can be connected by updating:

1. `src/api/trialBookings.ts` - Create new file
2. `src/api/contact.ts` - Create new file
3. `src/api/schedules.ts` - Update to use public endpoint
4. `src/api/invoices.ts` - Update to use real endpoints

---

## Questions for Backend Team

1. Is there an existing contact/inquiry endpoint we can use for trial bookings?
2. What email service is configured (SendGrid, SES, SMTP)?
3. Is Celery set up for async tasks?
4. Should we create a separate Testimonial model or store in Django Admin as static content?
5. Is the Invoice model already in place with line items?

---

## Timeline Estimate

| Feature | Backend Effort |
|---------|---------------|
| Trial Booking API | 1 day |
| Invoice APIs + PDF | 2 days |
| Public Schedule | 0.5 day |
| Contact Form API | 0.5 day |
| Email System | 2 days |
| Membership Enhancement | 0.5 day |

**Total estimated backend effort:** ~6-7 days

---

## Contact

For any questions about frontend requirements or integration details, please reach out to the frontend team.
