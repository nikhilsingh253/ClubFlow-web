# ClubFlow (FitRit) - Phase 1 Features Implementation Plan

**Last Updated:** January 4, 2026  
**Target Completion:** 2-3 weeks  
**Goal:** Launch-ready MVP for Reformer Pilates studio CRM

---

## Overview

Phase 1 focuses on creating a **launch-ready MVP** with core features for customer acquisition and membership management. The strategy is **trial-first**: visitors book trial classes online, experience the studio in person, then staff manually enrolls them into memberships.

**Key Principles:**
- ✅ No payment gateway integration (manual enrollment by staff)
- ✅ Beautiful marketing website for customer acquisition
- ✅ Functional member portal for booking management
- ✅ Staff uses Django Admin for operations
- ✅ Focus on essential features only

---

## Feature Checklist

### ✅ Already Implemented (No Action Needed)

- [x] Google OAuth authentication
- [x] User & Customer models
- [x] Membership plan display (API)
- [x] Class schedule viewing
- [x] Class booking system
- [x] Booking cancellation
- [x] Public marketing pages (Home, About, Classes, etc.)
- [x] Customer portal pages (Dashboard, Bookings, Membership)
- [x] Responsive design & mobile support
- [x] Elegant design system (Blush/Sage/Taupe colors)

---

## 🔴 HIGH PRIORITY - Must Have for Launch

### 1. Trial Booking System (Backend + Frontend)
**Status:** Frontend exists, backend not connected  
**Priority:** P0 - Critical  
**Effort:** 1-2 days

#### Backend Tasks
```python
# apps/customers/models.py
- Add 'lead' status to Customer model (already has status field in docs)
- Or create separate TrialBooking model

# apps/customers/serializers.py
- Create TrialBookingSerializer (name, email, phone, preferred_date, message)

# apps/customers/views.py
- Create TrialBookingViewSet
  - POST endpoint to create trial booking
  - Send email notification to staff
  - Send confirmation email to customer
  - Store in database for follow-up

# apps/customers/urls.py
- Add route: POST /api/v1/trial-bookings/
```

#### Frontend Tasks
```typescript
// src/api/trialBookings.ts
- Create submitTrialBooking(data) API function

// src/pages/public/TrialBookingPage.tsx
- Connect form to API
- Add form validation (Zod schema)
- Add loading state
- Add success/error messages
- Add success screen after submission

// Success message:
"Thank you! We'll contact you within 24 hours to schedule your trial class."
```

#### Email Templates Needed
```html
1. staff_trial_booking_notification.html
   - New trial booking alert
   - Customer details
   - Link to Django Admin

2. customer_trial_confirmation.html
   - Thank you message
   - What to expect
   - Studio contact info
   - Next steps
```

**Acceptance Criteria:**
- [ ] Customer can submit trial booking form
- [ ] Form validates all required fields
- [ ] Staff receives email notification
- [ ] Customer receives confirmation email
- [ ] Booking appears in Django Admin
- [ ] Mobile responsive form

---

### 2. Invoice Viewing & PDF Download
**Status:** Models exist, API not implemented  
**Priority:** P0 - Critical  
**Effort:** 2 days

#### Backend Tasks
```python
# apps/billing/serializers.py
- Create InvoiceSerializer
- Create InvoiceLineItemSerializer
- Include customer details, line items, totals

# apps/billing/views.py
- Create InvoiceViewSet
  - list() - Get customer's invoices
  - retrieve() - Get invoice details
  - download_pdf() - Generate PDF

# apps/billing/urls.py
- GET /api/v1/invoices/ - List invoices
- GET /api/v1/invoices/{id}/ - Invoice detail
- GET /api/v1/invoices/{id}/pdf/ - Download PDF

# apps/billing/utils.py
- Create generate_invoice_pdf() function
  - Use reportlab or weasyprint
  - Include GST breakdown (CGST, SGST, IGST)
  - Include company GSTIN
  - Professional layout
```

#### Frontend Tasks
```typescript
// src/api/invoices.ts
- getInvoices() - Fetch customer's invoices
- getInvoiceDetail(id) - Fetch single invoice
- downloadInvoicePDF(id) - Download PDF

// src/pages/portal/InvoicesPage.tsx
- Connect to API
- Display invoice list (table or cards)
- Filter by status (paid, pending, overdue)
- Show totals with GST
- Add download button per invoice
- Show empty state if no invoices

// src/types/index.ts
- Add Invoice, InvoiceLineItem types
```

#### Invoice Details to Display
- Invoice number & date
- Customer details
- Line items (description, quantity, price)
- Subtotal
- GST breakdown (18%)
- Total amount
- Payment status
- Payment date (if paid)

**Acceptance Criteria:**
- [ ] Customer can view list of invoices
- [ ] Customer can click to view invoice details
- [ ] Customer can download invoice as PDF
- [ ] PDF is professionally formatted
- [ ] GST is calculated correctly (18%)
- [ ] Mobile responsive layout

---

### 3. Email Notification System
**Status:** Not implemented  
**Priority:** P0 - Critical  
**Effort:** 2-3 days

#### Setup Tasks
```python
# config/settings/base.py
- Configure SendGrid or Django email backend
- Add email templates path

# requirements/base.txt
- Add: sendgrid==6.11.0 (or django-anymail)

# .env
- Add: SENDGRID_API_KEY=xxx
- Add: DEFAULT_FROM_EMAIL=hello@fitrit.in
- Add: STAFF_EMAIL=staff@fitrit.in
```

#### Email Templates to Create
```html
templates/emails/
├── base.html (base template with branding)
├── trial_booking_confirmation.html
├── booking_confirmation.html
├── booking_cancellation.html
├── membership_expiry_warning.html
└── staff/
    └── new_trial_booking.html
```

#### Implementation
```python
# core/services/email_service.py
class EmailService:
    @staticmethod
    def send_trial_booking_confirmation(booking)
    
    @staticmethod
    def send_booking_confirmation(booking)
    
    @staticmethod
    def send_booking_cancellation(booking)
    
    @staticmethod
    def send_membership_expiry_warning(membership)
    
    @staticmethod
    def send_staff_trial_notification(booking)

# Update existing views to send emails:
# - apps/customers/views.py (trial booking)
# - apps/classes/views.py (booking create/cancel)
```

#### Celery Tasks (for async email sending)
```python
# apps/communications/tasks.py
@shared_task
def send_email_async(template_name, context, to_email)

# Usage in views:
send_email_async.delay('booking_confirmation.html', {...}, customer.email)
```

**Acceptance Criteria:**
- [ ] Trial booking confirmation sent to customer
- [ ] Trial booking notification sent to staff
- [ ] Booking confirmation sent on class booking
- [ ] Cancellation confirmation sent on cancel
- [ ] Emails use branded templates
- [ ] Emails are mobile-responsive
- [ ] Emails sent asynchronously (don't block requests)

---

### 4. Membership Card with QR Code
**Status:** UI exists, real QR code not generated  
**Priority:** P1 - Important  
**Effort:** 1 day

#### Backend Tasks
```python
# apps/memberships/serializers.py
- Add qr_code_url to CustomerMembershipSerializer
- Generate QR code data (membership ID or card number)

# apps/memberships/views.py
- Create endpoint to get membership card data
- GET /api/v1/memberships/current/card/

# Generate QR code options:
# Option 1: Generate on-the-fly and return base64
# Option 2: Generate and save to media folder
# Option 3: Generate on frontend using customer ID
```

#### Frontend Tasks
```typescript
// package.json
- Already has: qrcode.react

// src/pages/portal/MembershipPage.tsx
- Use QRCode component from qrcode.react
- Pass membership.cardNumber as value
- Large size (200-300px)
- Add download/print button

// Example:
<QRCode
  value={membership.cardNumber}
  size={256}
  level="H"
  includeMargin={true}
/>
```

**Acceptance Criteria:**
- [ ] QR code displays on membership page
- [ ] QR code displays on dashboard
- [ ] QR code encodes card number or membership ID
- [ ] QR code is scannable
- [ ] Card is downloadable/printable
- [ ] Works on mobile devices

---

### 5. Public Class Schedule Viewing
**Status:** Schedule exists but requires authentication  
**Priority:** P1 - Important  
**Effort:** 1 day

#### Backend Tasks
```python
# apps/classes/views.py
# Modify ClassScheduleViewSet
- Change permission_classes to AllowAny for list/retrieve
- OR create separate PublicClassScheduleViewSet

# Add filtering:
- By date range (next 7 days by default)
- By class type
- Exclude past classes
- Show availability (spots remaining)
```

#### Frontend Tasks
```typescript
// src/pages/public/SchedulePage.tsx
- Connect to API (currently might be static data)
- Display weekly schedule
- Show class type, time, instructor
- Show spots available
- CTA: "Login to Book" (if authenticated)
- CTA: "Book Trial Class" (if guest)

// Add filter options:
- Filter by date
- Filter by class type
- Filter by instructor
```

**Acceptance Criteria:**
- [ ] Visitors can view weekly schedule without login
- [ ] Schedule shows next 7 days by default
- [ ] Shows class details (type, time, instructor, spots)
- [ ] Mobile responsive calendar view
- [ ] Clear CTAs for booking

---

## 🟡 MEDIUM PRIORITY - Important for Polish

### 6. Contact Form Backend
**Status:** Frontend exists, backend not connected  
**Effort:** 1 day

#### Tasks
```python
# apps/communications/models.py
- Create ContactMessage model (name, email, phone, message)

# apps/communications/serializers.py
- Create ContactMessageSerializer

# apps/communications/views.py
- Create ContactMessageViewSet
- POST endpoint to submit message
- Send email to staff
- Send auto-reply to customer

# Frontend: src/pages/public/ContactPage.tsx
- Connect form to API
- Add success message
```

**Acceptance Criteria:**
- [ ] Contact form submits to backend
- [ ] Staff receives email notification
- [ ] Customer receives auto-reply
- [ ] Form validation works
- [ ] Success message displays

---

### 7. Membership Details Enhancement
**Status:** Basic display exists, needs enhancement  
**Effort:** 1 day

#### Backend Tasks
```python
# apps/memberships/views.py
- Create CustomerMembershipDetailView
- Include:
  - Current membership details
  - Usage statistics (classes used/remaining)
  - Membership history
  - Renewal date
  - Auto-renew status

# Add endpoints:
- GET /api/v1/memberships/current/
- GET /api/v1/memberships/history/
- GET /api/v1/memberships/usage-stats/
```

#### Frontend Tasks
```typescript
// src/pages/portal/MembershipPage.tsx
- Display large membership card
- Show usage progress bar
- Show renewal countdown
- Add "classes remaining" indicator
- Display membership benefits
- Show membership history
```

**Acceptance Criteria:**
- [ ] Shows detailed membership information
- [ ] Displays usage statistics visually
- [ ] Shows renewal date prominently
- [ ] Mobile responsive layout

---

### 8. Freeze/Cancel Membership Request
**Status:** Not implemented  
**Effort:** 1 day

#### Backend Tasks
```python
# apps/memberships/models.py
class MembershipChangeRequest(models.Model):
    REQUEST_TYPES = [
        ('freeze', 'Freeze'),
        ('cancel', 'Cancel'),
    ]
    membership = ForeignKey(CustomerMembership)
    request_type = CharField(choices=REQUEST_TYPES)
    reason = TextField()
    requested_at = DateTimeField(auto_now_add=True)
    status = CharField(choices=[
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ])

# apps/memberships/views.py
- POST /api/v1/memberships/{id}/request-freeze/
- POST /api/v1/memberships/{id}/request-cancellation/
```

#### Frontend Tasks
```typescript
// src/pages/portal/MembershipPage.tsx
- Add "Freeze Membership" button
- Add "Cancel Membership" button
- Modal with reason form
- Confirmation step
- Show pending request status
```

**Acceptance Criteria:**
- [ ] Customer can request freeze
- [ ] Customer can request cancellation
- [ ] Request requires reason
- [ ] Staff sees request in Django Admin
- [ ] Customer sees pending status

---

### 9. Testimonials Section
**Status:** Not implemented  
**Effort:** 1 day

#### Backend Tasks
```python
# apps/customers/models.py (or new testimonials app)
class Testimonial(models.Model):
    customer_name = CharField(max_length=100)
    customer_photo = ImageField(upload_to='testimonials/', null=True)
    content = TextField()
    rating = IntegerField(choices=[(i, i) for i in range(1, 6)])
    is_active = BooleanField(default=True)
    display_order = IntegerField(default=0)
    created_at = DateTimeField(auto_now_add=True)

# Create API endpoint
- GET /api/v1/testimonials/ (public, read-only)
```

#### Frontend Tasks
```typescript
// src/pages/public/HomePage.tsx
- Add testimonials section after benefits
- Display 3-4 testimonials in cards
- Include star ratings
- Include customer photo/name

// Style: Elegant cards with quotes
```

**Acceptance Criteria:**
- [ ] Testimonials display on home page
- [ ] Shows customer name and photo
- [ ] Shows rating (stars)
- [ ] Mobile responsive carousel
- [ ] Staff can add via Django Admin

---

### 10. FAQ Page
**Status:** Not implemented  
**Effort:** 1 day

#### Content Needed
```markdown
# Common Questions:

1. What should I wear to my first class?
2. Do I need to bring anything?
3. How do I book a class?
4. What is your cancellation policy?
5. Can I freeze my membership?
6. What if I'm injured or pregnant?
7. How many classes are in each membership?
8. Do you offer private sessions?
9. What is the studio location and parking?
10. How do I contact you?
```

#### Implementation Options
**Option 1: Simple Static Page**
```typescript
// src/pages/public/FAQPage.tsx
- Create static FAQ component
- Accordion UI for questions/answers
- No backend needed
```

**Option 2: Dynamic from Backend**
```python
# apps/communications/models.py
class FAQ(models.Model):
    question = CharField(max_length=255)
    answer = TextField()
    category = CharField(choices=[...])
    display_order = IntegerField(default=0)
    is_active = BooleanField(default=True)
```

**Recommendation:** Start with Option 1 (static), migrate to Option 2 later if needed.

**Acceptance Criteria:**
- [ ] FAQ page exists in navigation
- [ ] Covers common questions
- [ ] Accordion/collapse UI
- [ ] Mobile responsive
- [ ] Easy to update content

---

### 11. Google Maps Integration
**Status:** Not implemented  
**Effort:** 0.5 days

#### Tasks
```typescript
// src/pages/public/ContactPage.tsx
- Add Google Maps embed
- Show studio location
- Add marker
- Add directions link

// Example:
<iframe
  src="https://www.google.com/maps/embed?pb=..."
  width="100%"
  height="400"
  style={{ border: 0 }}
  allowFullScreen
  loading="lazy"
/>

// Get embed code from:
// https://www.google.com/maps
```

**Acceptance Criteria:**
- [ ] Map displays on contact page
- [ ] Shows correct studio location
- [ ] Responsive on mobile
- [ ] Links to Google Maps for directions

---

## 🟢 LOW PRIORITY - Nice to Have

### 12. Class Type Detail Pages
**Status:** Not implemented  
**Effort:** 1 day

Create individual pages for each class type with:
- Detailed description
- Benefits
- What to expect
- Difficulty level
- Duration
- Instructor info
- Schedule for this class type

Route: `/classes/{class-slug}`

---

### 13. Instructor Detail Pages
**Status:** Not implemented  
**Effort:** 1 day

Create individual pages for each instructor with:
- Bio
- Photo
- Certifications
- Specializations
- Classes they teach
- Schedule

Route: `/instructors/{instructor-slug}`

---

### 14. Blog/News Section
**Status:** Not implemented  
**Effort:** 2-3 days

Simple blog for:
- Studio updates
- Pilates tips
- Success stories
- Event announcements

Could use headless CMS (Contentful, Strapi) or simple Django model.

---

### 15. Member Referral Program
**Status:** Not implemented  
**Effort:** 2 days

Allow members to refer friends:
- Generate referral link
- Track referrals
- Offer incentive (free class, discount)

---

### 16. Usage Analytics Dashboard
**Status:** Not implemented  
**Effort:** 2 days

Show customer their stats:
- Total classes attended
- Most attended class types
- Favorite instructor
- Monthly usage chart
- Streaks/achievements

---

### 17. Waitlist for Full Classes
**Status:** Model exists, not implemented  
**Effort:** 1-2 days

If class is full:
- Join waitlist
- Get notified if spot opens
- Auto-booking option

---

### 18. Class Reminder Notifications
**Status:** Not implemented  
**Effort:** 1 day (with Celery)

Send reminder email:
- 24 hours before class
- 2 hours before class
- Configurable per customer

---

## 📋 Content & Configuration Tasks

### Content Needed
- [ ] Final studio address
- [ ] Actual phone number
- [ ] Professional photos (studio, equipment, classes)
- [ ] Instructor bios and photos
- [ ] Membership plan details finalized
- [ ] Class descriptions finalized
- [ ] Pricing confirmed (with GST)
- [ ] Terms & Conditions
- [ ] Privacy Policy
- [ ] Cancellation Policy
- [ ] Testimonials (3-5)
- [ ] FAQ answers
- [ ] Social media links

### Configuration
- [ ] Google OAuth credentials (production)
- [ ] SendGrid account setup
- [ ] Production domain name
- [ ] SSL certificate
- [ ] Database backup strategy
- [ ] Error monitoring (Sentry)
- [ ] Analytics (Google Analytics)
- [ ] Facebook Pixel (optional)

---

## 🧪 Testing Checklist

### Functional Testing
- [ ] All forms submit successfully
- [ ] All API endpoints work
- [ ] Authentication flow works
- [ ] Booking flow works end-to-end
- [ ] Email notifications send
- [ ] QR codes scan correctly
- [ ] PDFs generate correctly

### UI/UX Testing
- [ ] All pages load on mobile
- [ ] Forms are easy to use on mobile
- [ ] Navigation is intuitive
- [ ] CTAs are clear and prominent
- [ ] Error messages are helpful
- [ ] Loading states display
- [ ] Empty states display

### Browser Testing
- [ ] Chrome (desktop & mobile)
- [ ] Safari (desktop & mobile)
- [ ] Firefox
- [ ] Edge

### Performance Testing
- [ ] Page load times < 3 seconds
- [ ] Images are optimized
- [ ] API responses < 500ms
- [ ] No console errors
- [ ] Lighthouse score > 90

### Security Testing
- [ ] HTTPS enabled
- [ ] No exposed API keys
- [ ] Rate limiting works
- [ ] Authentication required for protected routes
- [ ] CSRF protection enabled
- [ ] Input validation on all forms

---

## 📝 Documentation Tasks

### For Developers
- [ ] API documentation (Swagger) up to date
- [ ] Environment setup instructions
- [ ] Deployment guide
- [ ] Database schema documentation

### For Staff
- [ ] Django Admin user guide
- [ ] How to handle trial bookings
- [ ] How to create memberships
- [ ] How to manage schedules
- [ ] How to handle customer issues

### For Customers
- [ ] How to book a class (help article)
- [ ] How to cancel a booking
- [ ] How to use membership card
- [ ] FAQ page

---

## 🚀 Launch Preparation

### Week Before Launch
- [ ] Final content review
- [ ] All features tested
- [ ] Staff training completed
- [ ] Backup strategy tested
- [ ] Monitoring alerts configured
- [ ] Support email/phone ready
- [ ] Social media accounts ready

### Launch Day
- [ ] Deploy to production
- [ ] Verify all features work
- [ ] Send announcement to existing customers
- [ ] Post on social media
- [ ] Monitor for issues
- [ ] Be available for support

### Week After Launch
- [ ] Collect user feedback
- [ ] Monitor analytics
- [ ] Fix any bugs
- [ ] Optimize based on usage
- [ ] Plan Phase 2 features

---

## 🎯 Success Metrics

### Technical
- Uptime: 99.9%
- Page load time: < 3 seconds
- API response time: < 500ms
- Zero critical bugs

### Business
- Trial bookings: 20+ per week
- Trial → Member conversion: 60%+
- Class booking rate: 80%+ of members
- Customer satisfaction: 4.5+ stars

---

## 📞 Support & Maintenance

### Daily
- Monitor error logs
- Check for failed emails
- Review new trial bookings

### Weekly
- Review analytics
- Check performance metrics
- Update content as needed
- Staff feedback session

### Monthly
- Database backup verification
- Security updates
- Feature usage analysis
- Customer satisfaction survey

---

## ✅ Definition of Done (Phase 1)

Phase 1 is complete when:

1. **All HIGH priority features** (1-5) are implemented and tested
2. **All MEDIUM priority features** (6-11) are implemented and tested
3. All testing checklists pass
4. Content is finalized and professional
5. Staff is trained on Django Admin
6. Documentation is complete
7. Soft launch to small group is successful
8. No critical bugs remain

**Target:** 2-3 weeks from today

---

## 📅 Recommended Implementation Order

**Week 1 - Critical Backend:**
1. Day 1-2: Trial booking system
2. Day 3-4: Invoice viewing & PDF
3. Day 5: Email notifications setup

**Week 2 - Polish & Content:**
1. Day 1: Membership card QR codes
2. Day 2: Public schedule viewing
3. Day 3: Contact form
4. Day 4: Testimonials & FAQ
5. Day 5: Testing & bug fixes

**Week 3 - Final Polish & Launch:**
1. Day 1-2: Content finalization
2. Day 3: Staff training
3. Day 4: Final testing
4. Day 5: Soft launch

---

**Questions or need help with any feature?**
Contact the development team or refer to the architecture documentation.

