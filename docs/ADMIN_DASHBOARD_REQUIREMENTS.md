# ClubFlow - React Admin Dashboard Requirements

**Purpose:** Define the requirements for a React-based Admin Dashboard for gym owners and staff, replacing Django Admin for day-to-day operations.

---

## Executive Summary

Django Admin remains for:
- **Superuser/Developer only**: Initial system setup, adding new studios, technical configuration

React Admin Dashboard serves:
- **Gym Owner (Manager)**: Studio configuration, staff management, reporting, oversight
- **Gym Staff**: Daily operations, bookings, attendance, customer management

---

## User Roles & Access Levels

| Role | Access Level | Primary Functions |
|------|--------------|-------------------|
| **Owner/Manager** | Full access | All staff functions + settings, staff management, reports |
| **Staff** | Limited access | Bookings, attendance, customers, schedules (no settings/reports) |

---

## Dashboard Sections

### 1. Dashboard Home (Both Roles)

**Purpose:** Quick overview of today's operations and key metrics.

#### 1.1 Today's Overview Card
- [ ] Today's date prominently displayed
- [ ] Number of classes scheduled today
- [ ] Total bookings for today
- [ ] Attendance count (checked-in vs expected)

#### 1.2 Quick Actions
- [ ] "Check-in Member" button (opens scanner/search)
- [ ] "New Booking" button
- [ ] "New Customer" button
- [ ] "View Today's Schedule" link

#### 1.3 Alerts & Notifications
- [ ] New trial booking requests (count + link)
- [ ] New contact messages (count + link)
- [ ] Pending membership requests (count + link)
- [ ] Expiring memberships this week (count + link)
- [ ] Upcoming classes starting soon

#### 1.4 Today's Classes Timeline
- [ ] Visual timeline of today's classes
- [ ] Each class shows: time, type, instructor, booked/capacity
- [ ] Click to view class details/attendance
- [ ] Color coding: upcoming (blue), in-progress (green), completed (gray)

---

### 2. Schedule Management (Both Roles)

**Purpose:** Create, view, and manage class schedules.

#### 2.1 Calendar View
- [ ] Weekly calendar view (default)
- [ ] Monthly calendar view option
- [ ] Daily list view option
- [ ] Filter by: class type, instructor, room/studio
- [ ] Click on empty slot to create class
- [ ] Click on class to view/edit details

#### 2.2 Create/Edit Class Schedule
- [ ] Select class type (dropdown from configured types)
- [ ] Select instructor (dropdown from active trainers)
- [ ] Set date
- [ ] Set start time
- [ ] End time auto-calculated from class type duration
- [ ] Set room/location
- [ ] Set capacity (defaults from class type, can override)
- [ ] Recurring option: repeat weekly for X weeks
- [ ] Notes field for special instructions

#### 2.3 Class Details View
- [ ] Class information (type, time, instructor, room)
- [ ] Booking list with member names
- [ ] Spots available vs capacity
- [ ] Waitlist (if enabled)
- [ ] Actions: Cancel class, Change instructor, Edit details
- [ ] Print attendance sheet

#### 2.4 Cancel Class
- [ ] Confirmation dialog
- [ ] Reason for cancellation (dropdown + text)
- [ ] Option to notify all booked members
- [ ] Auto-restore class credits to members
- [ ] Class marked as cancelled (not deleted)

#### 2.5 Substitute Instructor
- [ ] Select new instructor from dropdown
- [ ] Option to notify booked members
- [ ] Update displayed on schedule

---

### 3. Bookings Management (Both Roles)

**Purpose:** View, create, modify, and cancel bookings.

#### 3.1 Bookings List
- [ ] Table view with columns: Member, Class, Date, Time, Status, Actions
- [ ] Filter by: date range, class type, status, member name
- [ ] Search by member name/phone/email
- [ ] Status badges: Confirmed, Attended, Cancelled, No-Show
- [ ] Bulk actions: Mark attended, Mark no-show, Cancel

#### 3.2 Create Manual Booking
- [ ] Search/select member (autocomplete by name/phone/email)
- [ ] Select class from upcoming schedule
- [ ] Show member's remaining credits
- [ ] Confirm booking
- [ ] Option to override capacity (for staff)
- [ ] Option to skip credit deduction (comp booking)

#### 3.3 Booking Details
- [ ] Member information
- [ ] Class details
- [ ] Booking timestamp
- [ ] Status history
- [ ] Actions: Cancel, Mark attended, Mark no-show, Move to different class

#### 3.4 Cancel Booking
- [ ] Confirmation dialog
- [ ] Show late cancellation warning if <12hrs
- [ ] Credit restoration based on policy
- [ ] Reason selection (member requested, no-show, class cancelled, other)

---

### 4. Attendance & Check-in (Both Roles)

**Purpose:** Record member attendance for classes.

#### 4.1 Check-in Interface
- [ ] QR code scanner (camera-based)
- [ ] Manual search fallback (name/phone/member ID)
- [ ] When scanned/searched, show:
  - Member photo (if available)
  - Member name
  - Membership status (Active/Expired)
  - Today's booking (if any)
  - Quick action buttons

#### 4.2 Check-in Result States
- [ ] **Has booking today**: Show class name, "Check In" button, mark as attended
- [ ] **No booking today**: Option to create walk-in booking (if credits available)
- [ ] **Membership expired**: Warning, prompt to renew
- [ ] **Not found**: Option to create new customer

#### 4.3 Class Attendance View
- [ ] Select class from today's schedule
- [ ] List all bookings for that class
- [ ] Checkboxes to mark: Present / No-Show
- [ ] Bulk actions: Mark all present, Mark all no-show
- [ ] Save attendance
- [ ] Show attendance summary: X present, Y no-show, Z not marked

#### 4.4 Attendance Report (Daily)
- [ ] All classes for selected date
- [ ] Attendance rate per class
- [ ] No-show list
- [ ] Export to CSV

---

### 5. Customer Management (Both Roles)

**Purpose:** Manage customer records and profiles.

#### 5.1 Customer List
- [ ] Table view: Name, Phone, Email, Membership Status, Last Visit
- [ ] Search by name/phone/email
- [ ] Filter by: membership status, membership plan, join date
- [ ] Quick view membership status badge
- [ ] Click to view full profile

#### 5.2 Customer Profile View
- [ ] **Personal Info Section**
  - Name, phone, email
  - Date of birth
  - Emergency contact
  - Health notes
  - Join date
  - Profile photo (if uploaded)
  - Edit button

- [ ] **Membership Section**
  - Current plan name
  - Status (Active/Expired/Frozen)
  - Start date, End date
  - Classes remaining / total
  - Progress bar
  - Membership history
  - Actions: Extend, Change plan, Freeze, Cancel

- [ ] **Booking History Section**
  - List of past bookings
  - Filter by date range
  - Show attendance status
  - Total classes attended

- [ ] **Payment History Section**
  - List of invoices
  - Status (Paid/Pending/Overdue)
  - Click to view invoice details
  - Create new invoice button

- [ ] **Notes Section**
  - Internal staff notes
  - Add note with timestamp
  - Note history

#### 5.3 Create New Customer
- [ ] Form fields:
  - Name (required)
  - Phone (required)
  - Email (required, check for duplicates)
  - Date of birth
  - Emergency contact name & phone
  - Health notes/conditions
  - Source (how they heard about studio)
- [ ] Auto-generate member ID/card number
- [ ] Option to link to existing Google account (by email match)
- [ ] Option to immediately assign membership

#### 5.4 Edit Customer
- [ ] All fields editable
- [ ] Save history of changes
- [ ] Cannot change email if linked to Google account

---

### 6. Membership Management (Both Roles)

**Purpose:** Assign, modify, and track memberships.

#### 6.1 Active Memberships List
- [ ] Table: Member, Plan, Start Date, End Date, Classes Left, Status
- [ ] Filter by: plan type, status, expiring soon
- [ ] Sort by end date (expiring first)
- [ ] Quick actions: Extend, View

#### 6.2 Assign New Membership
- [ ] Search/select customer
- [ ] Select membership plan (dropdown)
- [ ] Set start date (default: today)
- [ ] End date auto-calculated
- [ ] Classes included auto-populated
- [ ] Option to create invoice immediately
- [ ] Save membership

#### 6.3 Extend/Renew Membership
- [ ] Show current membership details
- [ ] Select new plan (or same plan)
- [ ] New start date = current end date + 1
- [ ] Calculate new end date
- [ ] Add classes to balance (if same plan type)
- [ ] Create renewal invoice
- [ ] Save

#### 6.4 Freeze Membership
- [ ] Set freeze start date
- [ ] Set freeze end date (or number of days)
- [ ] Calculate new membership end date
- [ ] Member cannot book during freeze
- [ ] Automatic unfreeze on end date
- [ ] Manual unfreeze option

#### 6.5 Cancel Membership
- [ ] Confirmation dialog
- [ ] Reason for cancellation
- [ ] Option to refund (creates credit note)
- [ ] Membership status = Cancelled
- [ ] Member cannot book

#### 6.6 Expiring Memberships Report
- [ ] List of memberships expiring in next 7/14/30 days
- [ ] Contact info for follow-up
- [ ] Quick action to extend/renew
- [ ] Mark as "contacted" for tracking

---

### 7. Trial Bookings (Both Roles)

**Purpose:** Process and track trial class requests.

#### 7.1 Trial Bookings List
- [ ] Table: Name, Phone, Email, Preferred Time, Status, Date Submitted
- [ ] Filter by status: New, Contacted, Scheduled, Completed, Converted, Lost
- [ ] Sort by date (newest first for New status)
- [ ] Status badges with colors

#### 7.2 Trial Booking Details
- [ ] Contact information
- [ ] Preferred time slot
- [ ] Notes/message from prospect
- [ ] Status workflow:
  ```
  New → Contacted → Scheduled → Completed → Converted/Lost
  ```
- [ ] Actions at each stage:
  - New: "Mark Contacted"
  - Contacted: "Schedule Trial" (pick class)
  - Scheduled: "Mark Completed"
  - Completed: "Convert to Member" or "Mark as Lost"

#### 7.3 Schedule Trial
- [ ] Select class from upcoming schedule
- [ ] Creates a temporary booking (not counted against credits)
- [ ] Trial booking linked to the class
- [ ] Shows on class attendance list as "Trial"

#### 7.4 Convert to Member
- [ ] Pre-fills customer creation form with trial info
- [ ] Create customer record
- [ ] Assign membership
- [ ] Trial booking marked as "Converted"
- [ ] Track conversion metrics

---

### 8. Contact Messages (Both Roles)

**Purpose:** Manage inquiries from website contact form.

#### 8.1 Messages List
- [ ] Table: Name, Email, Subject, Status, Date
- [ ] Filter by status: New, In Progress, Resolved
- [ ] Sort by date (newest first)
- [ ] Unread indicator

#### 8.2 Message Details
- [ ] Full message content
- [ ] Contact information
- [ ] Status workflow: New → In Progress → Resolved
- [ ] Response notes (internal tracking)
- [ ] Mark as resolved

---

### 9. Billing & Invoices (Both Roles)

**Purpose:** Create and manage invoices for memberships and services.

#### 9.1 Invoice List
- [ ] Table: Invoice #, Customer, Amount, Status, Date
- [ ] Filter by: status (Paid/Pending/Overdue), date range, customer
- [ ] Search by invoice number or customer name
- [ ] Status badges with colors

#### 9.2 Create Invoice
- [ ] Select customer
- [ ] Add line items:
  - Membership plan (auto-fills price)
  - Custom item (description + amount)
- [ ] GST auto-calculated (18%)
- [ ] Show subtotal, CGST (9%), SGST (9%), Total
- [ ] Payment status: Pending
- [ ] Generate invoice number automatically
- [ ] Save and optionally send to customer email

#### 9.3 Invoice Details
- [ ] Invoice header (studio info, invoice number, date)
- [ ] Customer billing info
- [ ] Line items table
- [ ] GST breakdown
- [ ] Payment status
- [ ] Actions: Mark Paid, Download PDF, Send Email, Void

#### 9.4 Record Payment
- [ ] Payment date (default: today)
- [ ] Payment method: Cash, UPI, Card, Bank Transfer, Cheque
- [ ] Transaction reference (optional)
- [ ] Amount (defaults to invoice total)
- [ ] Notes
- [ ] Mark invoice as Paid

#### 9.5 Download PDF
- [ ] GST-compliant invoice format
- [ ] Studio logo and address
- [ ] Customer details
- [ ] Itemized with HSN/SAC code
- [ ] GST breakdown
- [ ] Proper Indian invoice format

---

### 10. Waitlist Management (Both Roles)

**Purpose:** Manage waitlists for full classes.

#### 10.1 Waitlist Entries
- [ ] Table: Member, Class, Position, Date Added, Status
- [ ] Filter by class, date
- [ ] Sort by position

#### 10.2 Process Waitlist
- [ ] When spot opens (cancellation):
  - Show next waitlist member
  - Option to auto-book or notify
  - Send notification email/SMS
  - Set expiry time to accept (e.g., 2 hours)
- [ ] If not accepted, move to next in line

---

### 11. Membership Requests (Both Roles)

**Purpose:** Handle membership requests from the member portal.

#### 11.1 Requests List
- [ ] Table: Member, Requested Plan, Status, Date
- [ ] Filter by status: Pending, Approved, Denied
- [ ] Sort by date

#### 11.2 Process Request
- [ ] View request details
- [ ] Approve: Creates pending membership (needs payment)
- [ ] Deny: With reason
- [ ] Contact customer for payment
- [ ] After payment: Activate membership

---

## Owner-Only Sections

### 12. Studio Configuration (Owner Only)

**Purpose:** Configure studio settings and branding.

#### 12.1 Studio Profile
- [ ] Studio name
- [ ] Address (line 1, line 2, city, state, pincode)
- [ ] Contact phone
- [ ] Contact email
- [ ] Website URL
- [ ] Social media links (Instagram, Facebook, etc.)
- [ ] Upload logo
- [ ] Operating hours per day

#### 12.2 GST & Billing Settings
- [ ] GSTIN number
- [ ] HSN/SAC code
- [ ] Invoice prefix
- [ ] Invoice number start
- [ ] Bank account details (for display on invoice)

#### 12.3 Booking Policies
- [ ] Advance booking window (e.g., 7 days)
- [ ] Cancellation policy hours (e.g., 12 hours)
- [ ] Late cancellation penalty (credit lost / no penalty)
- [ ] No-show policy (credit lost / no penalty)
- [ ] Waitlist enabled (yes/no)
- [ ] Auto-book from waitlist (yes/no)

---

### 13. Class Types Management (Owner Only)

**Purpose:** Define the types of classes offered.

#### 13.1 Class Types List
- [ ] Table: Name, Duration, Level, Capacity, Status
- [ ] Edit, Deactivate options

#### 13.2 Create/Edit Class Type
- [ ] Name
- [ ] Description
- [ ] Duration (minutes)
- [ ] Default capacity
- [ ] Level (Beginner, Intermediate, Advanced)
- [ ] Color (for calendar display)
- [ ] Upload image
- [ ] Active/Inactive toggle

---

### 14. Membership Plans Management (Owner Only)

**Purpose:** Define membership pricing and options.

#### 14.1 Plans List
- [ ] Table: Name, Price, Classes, Duration, Status
- [ ] Edit, Deactivate options

#### 14.2 Create/Edit Plan
- [ ] Name
- [ ] Description
- [ ] Price (before GST)
- [ ] Classes included (number or "unlimited")
- [ ] Validity period (days)
- [ ] Features list (bullet points for display)
- [ ] Display order
- [ ] Popular/Recommended badge
- [ ] Active/Inactive toggle

---

### 15. Trainers/Instructors Management (Owner Only)

**Purpose:** Manage instructor profiles.

#### 15.1 Trainers List
- [ ] Table: Name, Email, Phone, Status
- [ ] Edit, Deactivate options

#### 15.2 Create/Edit Trainer
- [ ] Name
- [ ] Email
- [ ] Phone
- [ ] Bio
- [ ] Years of experience
- [ ] Specializations (tags)
- [ ] Certifications (list)
- [ ] Upload photo
- [ ] Display order (for website)
- [ ] Active/Inactive toggle

---

### 16. Staff Management (Owner Only)

**Purpose:** Manage staff access to admin dashboard.

#### 16.1 Staff List
- [ ] Table: Name, Email, Role, Last Login, Status
- [ ] Invite new staff, Edit, Deactivate options

#### 16.2 Invite Staff
- [ ] Email address
- [ ] Name
- [ ] Role: Staff or Manager
- [ ] Sends invitation email with setup link

#### 16.3 Edit Staff
- [ ] Change role
- [ ] Reset password
- [ ] Deactivate access

---

### 17. Reports & Analytics (Owner Only)

**Purpose:** Business insights and performance metrics.

#### 17.1 Dashboard Analytics
- [ ] Key metrics cards:
  - Total active members
  - New members this month
  - Revenue this month
  - Classes held this month
  - Average attendance rate

#### 17.2 Attendance Report
- [ ] Select date range
- [ ] Classes held
- [ ] Total bookings
- [ ] Attendance rate
- [ ] No-show rate
- [ ] Breakdown by class type
- [ ] Breakdown by instructor
- [ ] Export to CSV

#### 17.3 Revenue Report
- [ ] Select date range
- [ ] Total invoiced
- [ ] Total collected
- [ ] Outstanding payments
- [ ] Breakdown by plan type
- [ ] Monthly comparison chart
- [ ] Export to CSV

#### 17.4 Membership Report
- [ ] Current active memberships by plan
- [ ] Expiring this week/month
- [ ] Expired (for re-engagement)
- [ ] New memberships over time
- [ ] Churn rate
- [ ] Export to CSV

#### 17.5 Trial Conversion Report
- [ ] Total trials in period
- [ ] Conversion rate
- [ ] Average time to convert
- [ ] Lost trial reasons (if tracked)
- [ ] Funnel visualization

#### 17.6 Class Performance Report
- [ ] Most popular classes
- [ ] Capacity utilization by class type
- [ ] Best performing time slots
- [ ] Instructor performance (classes taught, avg attendance)

---

## Technical Requirements

### Authentication
- [ ] Google OAuth (same as member portal)
- [ ] Role-based access (Owner vs Staff)
- [ ] Session timeout (configurable)
- [ ] Secure password reset

### API Endpoints Needed
See separate API specification document for detailed endpoint requirements.

### UI/UX Requirements
- [ ] Responsive design (desktop-first, tablet-friendly)
- [ ] Fast loading (<2s initial load)
- [ ] Real-time updates where needed (bookings, attendance)
- [ ] Consistent with member portal styling
- [ ] Print-friendly views for attendance sheets, invoices
- [ ] Keyboard shortcuts for common actions

### Data Export
- [ ] CSV export for all report tables
- [ ] PDF export for invoices
- [ ] Backup/export customer data (GDPR-like compliance)

---

## Navigation Structure

```
Admin Dashboard
├── Dashboard (Home)
├── Schedule
│   ├── Calendar View
│   └── Today's Classes
├── Bookings
│   ├── All Bookings
│   └── Waitlist
├── Attendance
│   ├── Check-in
│   └── Class Attendance
├── Customers
│   ├── All Customers
│   ├── Trial Bookings
│   └── Contact Messages
├── Memberships
│   ├── Active Memberships
│   ├── Membership Requests
│   └── Expiring Soon
├── Billing
│   ├── Invoices
│   └── Payments
├── [Owner Only] Configuration
│   ├── Studio Settings
│   ├── Class Types
│   ├── Membership Plans
│   ├── Trainers
│   └── Staff
└── [Owner Only] Reports
    ├── Attendance
    ├── Revenue
    ├── Memberships
    └── Class Performance
```

---

## Implementation Phases

### Phase 1: Core Operations (MVP)
1. Dashboard Home with today's overview
2. Schedule viewing (read-only initially)
3. Customer list and profile view
4. Booking list and manual booking creation
5. Check-in interface with QR scanning
6. Trial bookings management
7. Basic invoice viewing

### Phase 2: Full Operations
1. Schedule create/edit/cancel
2. Attendance marking with bulk actions
3. Customer create/edit
4. Membership assign/extend/freeze
5. Invoice create/payment recording
6. Contact messages management

### Phase 3: Owner Features
1. Studio configuration
2. Class types management
3. Membership plans management
4. Trainers management
5. Staff management

### Phase 4: Analytics
1. Dashboard analytics
2. All reports
3. Export functionality

---

## Open Questions

1. **Multi-studio support**: Should one owner manage multiple studios?
2. **Mobile app for staff**: Is a mobile check-in app needed?
3. **SMS/WhatsApp**: Integration for notifications?
4. **Online payments**: Razorpay integration in admin for collecting payments?
5. **Audit log**: Track all staff actions for accountability?

---

*Document Version: 1.0*
*Created: Based on TEST_SCENARIOS.md analysis*
