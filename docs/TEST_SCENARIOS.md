# ClubFlow - Comprehensive Test Scenarios & User Journeys

**Purpose:** Map every user journey from system deployment to daily operations, identifying what should exist in an ideal gym CRM and validating against current implementation.

---

## Table of Contents

1. [System Bootstrap (Day 0)](#1-system-bootstrap-day-0)
2. [Admin Setup (Day 1-2)](#2-admin-setup-day-1-2)
3. [Customer Acquisition Journey](#3-customer-acquisition-journey)
4. [Member Onboarding](#4-member-onboarding)
5. [Member Daily Experience](#5-member-daily-experience)
6. [Staff Daily Operations](#6-staff-daily-operations)
7. [Communication & Notifications](#7-communication--notifications)
8. [Membership Lifecycle](#8-membership-lifecycle)
9. [Reporting & Analytics](#9-reporting--analytics)
10. [Edge Cases & Error Scenarios](#10-edge-cases--error-scenarios)

---

## 1. System Bootstrap (Day 0)

### Scenario 1.1: Fresh Deployment
**Context:** System is deployed to cloud for the first time. No data exists.

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1.1.1 | Deploy backend to cloud | Django app running, database migrated | ⬜ Not Tested |
| 1.1.2 | Deploy frontend to cloud | React app accessible via domain | ⬜ Not Tested |
| 1.1.3 | Access Django Admin | Admin login page appears | ⬜ Not Tested |
| 1.1.4 | Create superuser via CLI | `python manage.py createsuperuser` works | ⬜ Not Tested |
| 1.1.5 | First admin logs in | Admin dashboard accessible | ⬜ Not Tested |

### Scenario 1.2: Create Additional Admins
**Context:** First admin needs to add other staff members as admins.

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1.2.1 | Navigate to Users in Django Admin | User list visible | ⬜ Not Tested |
| 1.2.2 | Create new user | Form to create user | ⬜ Not Tested |
| 1.2.3 | Assign staff status | User can access admin | ⬜ Not Tested |
| 1.2.4 | Assign specific permissions | User has limited access | ⬜ Not Tested |
| 1.2.5 | New admin logs in | Can access assigned areas | ⬜ Not Tested |

### Scenario 1.3: Configure System Settings
**Context:** Basic system configuration needed before operations begin.

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1.3.1 | Configure studio name | Appears on website | ⬜ Not Tested |
| 1.3.2 | Configure studio address | Appears on contact page | ⬜ Not Tested |
| 1.3.3 | Configure contact info | Phone, email displayed | ⬜ Not Tested |
| 1.3.4 | Configure studio hours | Hours displayed correctly | ⬜ Not Tested |
| 1.3.5 | Configure social media links | Links work correctly | ⬜ Not Tested |
| 1.3.6 | Upload logo | Logo appears on site | ⬜ Not Tested |
| 1.3.7 | Configure Google OAuth | OAuth login works | ⬜ Not Tested |
| 1.3.8 | Configure email service | Test email sends successfully | ⬜ Not Tested |

**Questions:**
- [ ] Where are system settings configured? (Django Admin? Settings file? Database?)
- [ ] Is there a "Settings" model for runtime configuration?
- [ ] Can non-technical staff update contact info without code changes?

---

## 2. Admin Setup (Day 1-2)

### Scenario 2.1: Create Class Types
**Context:** Admin needs to define what classes the studio offers.

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 2.1.1 | Navigate to Class Types | List of class types (empty) | ⬜ Not Tested |
| 2.1.2 | Create "Intro Reformer" | Class type saved | ⬜ Not Tested |
| 2.1.3 | Add description | Description saved | ⬜ Not Tested |
| 2.1.4 | Set duration (50 mins) | Duration saved | ⬜ Not Tested |
| 2.1.5 | Set difficulty level | Level (intro) saved | ⬜ Not Tested |
| 2.1.6 | Set capacity (8 people) | Capacity saved | ⬜ Not Tested |
| 2.1.7 | Upload class image | Image displays on website | ⬜ Not Tested |
| 2.1.8 | Repeat for Foundation, Intermediate, Advanced | All class types created | ⬜ Not Tested |
| 2.1.9 | View Classes page on website | All class types display | ⬜ Not Tested |

### Scenario 2.2: Add Instructors
**Context:** Admin adds instructor profiles.

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 2.2.1 | Navigate to Instructors/Trainers | List (empty) | ⬜ Not Tested |
| 2.2.2 | Create instructor "Priya Sharma" | Instructor saved | ⬜ Not Tested |
| 2.2.3 | Add bio | Bio saved | ⬜ Not Tested |
| 2.2.4 | Add certifications | Certifications displayed | ⬜ Not Tested |
| 2.2.5 | Upload photo | Photo displays | ⬜ Not Tested |
| 2.2.6 | Set specializations | Specializations saved | ⬜ Not Tested |
| 2.2.7 | Add more instructors | Multiple instructors exist | ⬜ Not Tested |
| 2.2.8 | View Instructors page on website | All instructors display | ⬜ Not Tested |

### Scenario 2.3: Create Membership Plans
**Context:** Admin defines membership options with pricing.

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 2.3.1 | Navigate to Membership Plans | List (empty) | ⬜ Not Tested |
| 2.3.2 | Create "4 Classes/Month" plan | Plan saved | ⬜ Not Tested |
| 2.3.3 | Set price (₹4,000) | Price saved | ⬜ Not Tested |
| 2.3.4 | Set classes included (4) | Count saved | ⬜ Not Tested |
| 2.3.5 | Set validity period (1 month) | Period saved | ⬜ Not Tested |
| 2.3.6 | Add plan description | Description saved | ⬜ Not Tested |
| 2.3.7 | Mark as active | Plan visible on website | ⬜ Not Tested |
| 2.3.8 | Create "8 Classes/Month" plan | Plan saved | ⬜ Not Tested |
| 2.3.9 | Create "Unlimited" plan | Plan saved | ⬜ Not Tested |
| 2.3.10 | View Pricing page on website | All plans display with GST | ⬜ Not Tested |

**Questions:**
- [ ] Is GST calculated automatically (18%)?
- [ ] Can plans be archived without deleting?
- [ ] Can we set "popular" or "recommended" badge?

### Scenario 2.4: Create Class Schedule
**Context:** Admin creates the weekly class schedule.

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 2.4.1 | Navigate to Class Schedule | Calendar view (empty) | ⬜ Not Tested |
| 2.4.2 | Create Monday 6 AM class | Class slot created | ⬜ Not Tested |
| 2.4.3 | Assign class type (Intro) | Type assigned | ⬜ Not Tested |
| 2.4.4 | Assign instructor (Priya) | Instructor assigned | ⬜ Not Tested |
| 2.4.5 | Set room/studio | Location set | ⬜ Not Tested |
| 2.4.6 | Set capacity (override if different) | Capacity set | ⬜ Not Tested |
| 2.4.7 | Create full week schedule | All slots created | ⬜ Not Tested |
| 2.4.8 | View Schedule page on website | Schedule displays correctly | ⬜ Not Tested |
| 2.4.9 | Verify spots available shows | Shows "8 spots available" | ⬜ Not Tested |

**Questions:**
- [ ] Is there a recurring schedule feature? (e.g., repeat every Monday)
- [ ] Can schedules be templated and copied week to week?
- [ ] What happens to existing bookings if class is cancelled?

### Scenario 2.5: Configure FAQ Content
**Context:** Admin adds/updates FAQ content.

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 2.5.1 | Navigate to FAQ management | FAQ list | ⬜ Not Tested |
| 2.5.2 | Add new FAQ | FAQ created | ⬜ Not Tested |
| 2.5.3 | Set category | Category assigned | ⬜ Not Tested |
| 2.5.4 | Set display order | Order respected | ⬜ Not Tested |
| 2.5.5 | View FAQ page on website | FAQs display in order | ⬜ Not Tested |

**Current Status:** FAQ is static in code, not editable by admin.

---

## 3. Customer Acquisition Journey

### Scenario 3.1: Prospect Discovers Website
**Context:** Someone finds the website and explores.

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 3.1.1 | Visit homepage | Attractive landing page loads | ✅ Working |
| 3.1.2 | Read about the studio | About page informative | ✅ Working |
| 3.1.3 | View class types | Classes page shows offerings | ✅ Working |
| 3.1.4 | Check schedule | Can see when classes happen | ✅ Working |
| 3.1.5 | View instructors | Instructor profiles visible | ✅ Working |
| 3.1.6 | Check pricing | Clear pricing with GST | ✅ Working |
| 3.1.7 | Read FAQs | Questions answered | ✅ Working |
| 3.1.8 | Find contact info | Phone, email, address visible | ✅ Working |
| 3.1.9 | View location on map | Google Maps shows studio | ✅ Working |

### Scenario 3.2: Prospect Submits Trial Booking
**Context:** Interested prospect wants to try a class.

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 3.2.1 | Click "Book a Trial" | Trial form page opens | ✅ Working |
| 3.2.2 | Fill in name | Field accepts input | ✅ Working |
| 3.2.3 | Fill in email | Email validated | ✅ Working |
| 3.2.4 | Fill in phone | Phone accepted | ✅ Working |
| 3.2.5 | Select preferred time | Dropdown works | ✅ Working |
| 3.2.6 | Add notes (optional) | Notes saved | ✅ Working |
| 3.2.7 | Submit form | Form submits to API | ✅ Working |
| 3.2.8 | See success message | Confirmation displayed | ✅ Working |
| 3.2.9 | Receive confirmation email | Email arrives | ⬜ Needs Email Config |
| 3.2.10 | Staff receives notification | Staff email arrives | ⬜ Needs Email Config |

### Scenario 3.3: Staff Processes Trial Booking
**Context:** Staff follows up on trial booking request.

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 3.3.1 | Staff logs into Django Admin | Admin accessible | ⬜ Not Tested |
| 3.3.2 | Navigate to Trial Bookings | List of pending trials | ⬜ Not Tested |
| 3.3.3 | View trial booking details | All info visible | ⬜ Not Tested |
| 3.3.4 | Contact prospect (call/WhatsApp) | Manual action | N/A |
| 3.3.5 | Update status to "Contacted" | Status updated | ⬜ Not Tested |
| 3.3.6 | Schedule trial class | Date/time set | ⬜ Not Tested |
| 3.3.7 | Update status to "Scheduled" | Status updated | ⬜ Not Tested |
| 3.3.8 | Add notes about conversation | Notes saved | ⬜ Not Tested |

**Questions:**
- [ ] Can staff see trial bookings without full admin access?
- [ ] Is there a status workflow for trial bookings?
- [ ] Can we track conversion (trial → member)?

### Scenario 3.4: Prospect Visits for Trial Class
**Context:** Prospect arrives at studio for trial.

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 3.4.1 | Prospect arrives at studio | - | N/A |
| 3.4.2 | Staff finds their trial booking | Quick search by name/phone | ⬜ Not Tested |
| 3.4.3 | Staff marks them present | Attendance recorded | ⬜ Not Tested |
| 3.4.4 | Prospect completes trial | - | N/A |
| 3.4.5 | Staff marks trial completed | Status = "Completed" | ⬜ Not Tested |
| 3.4.6 | Staff adds feedback notes | Notes saved | ⬜ Not Tested |
| 3.4.7 | Staff asks about membership | - | N/A |

### Scenario 3.5: Prospect Sends Contact Inquiry
**Context:** Prospect has questions before booking trial.

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 3.5.1 | Visit Contact page | Page loads | ✅ Working |
| 3.5.2 | Fill contact form | Fields work | ✅ Working |
| 3.5.3 | Submit form | Submits to API | ✅ Working |
| 3.5.4 | See success message | Confirmation shown | ✅ Working |
| 3.5.5 | Receive auto-reply email | Email arrives | ⬜ Needs Email Config |
| 3.5.6 | Staff receives inquiry | Staff notified | ⬜ Needs Email Config |
| 3.5.7 | Staff views inquiry in admin | Inquiry visible | ⬜ Not Tested |
| 3.5.8 | Staff responds | Manual action | N/A |
| 3.5.9 | Staff marks inquiry resolved | Status updated | ⬜ Not Tested |

---

## 4. Member Onboarding

### Scenario 4.1: Create Customer Record
**Context:** Prospect becomes a customer (before payment).

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 4.1.1 | Staff opens Django Admin | Admin accessible | ⬜ Not Tested |
| 4.1.2 | Navigate to Customers | Customer list | ⬜ Not Tested |
| 4.1.3 | Click "Add Customer" | Form opens | ⬜ Not Tested |
| 4.1.4 | Enter customer name | Name saved | ⬜ Not Tested |
| 4.1.5 | Enter email | Email saved | ⬜ Not Tested |
| 4.1.6 | Enter phone | Phone saved | ⬜ Not Tested |
| 4.1.7 | Enter date of birth | DOB saved | ⬜ Not Tested |
| 4.1.8 | Enter emergency contact | Contact saved | ⬜ Not Tested |
| 4.1.9 | Add any health notes | Notes saved | ⬜ Not Tested |
| 4.1.10 | Link to Google account (optional) | OAuth linked | ⬜ Not Tested |
| 4.1.11 | Save customer | Customer created | ⬜ Not Tested |
| 4.1.12 | Customer card number auto-generated | Card # assigned | ⬜ Not Tested |

**Questions:**
- [ ] How does Google OAuth link to existing customer record?
- [ ] Can customer self-register or must staff create them?
- [ ] Is there a "lead" vs "customer" distinction?

### Scenario 4.2: Assign Membership
**Context:** Staff assigns a membership plan after payment.

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 4.2.1 | Open customer record | Customer details visible | ⬜ Not Tested |
| 4.2.2 | Click "Add Membership" | Membership form opens | ⬜ Not Tested |
| 4.2.3 | Select membership plan | Plan selected | ⬜ Not Tested |
| 4.2.4 | Set start date | Date set | ⬜ Not Tested |
| 4.2.5 | End date auto-calculated | End date shows | ⬜ Not Tested |
| 4.2.6 | Save membership | Membership active | ⬜ Not Tested |
| 4.2.7 | Customer status updates | Status = "Active Member" | ⬜ Not Tested |

### Scenario 4.3: Record Payment
**Context:** Staff records that payment was received (offline).

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 4.3.1 | Navigate to Invoices/Payments | Invoice section | ⬜ Not Tested |
| 4.3.2 | Create invoice for membership | Invoice created | ⬜ Not Tested |
| 4.3.3 | Line items auto-populated | Plan price + GST | ⬜ Not Tested |
| 4.3.4 | Mark payment received | Status = "Paid" | ⬜ Not Tested |
| 4.3.5 | Enter payment method (UPI/Cash/Card) | Method saved | ⬜ Not Tested |
| 4.3.6 | Enter transaction reference | Reference saved | ⬜ Not Tested |
| 4.3.7 | Invoice number auto-generated | INV-YYYY-NNNNNN | ⬜ Not Tested |
| 4.3.8 | Customer can view invoice in portal | Invoice visible | ⬜ Not Tested |
| 4.3.9 | Customer can download PDF | PDF downloads | ⬜ Partial (placeholder) |

### Scenario 4.4: Welcome New Member
**Context:** New member receives welcome communication.

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 4.4.1 | Welcome email sent automatically | Email arrives | ⬜ Not Implemented |
| 4.4.2 | Email contains login instructions | Instructions clear | ⬜ Not Implemented |
| 4.4.3 | Email contains membership details | Plan info shown | ⬜ Not Implemented |
| 4.4.4 | Email contains QR code or card number | Can check in | ⬜ Not Implemented |
| 4.4.5 | Email contains class booking link | Link works | ⬜ Not Implemented |

### Scenario 4.5: Member First Login
**Context:** New member logs in for the first time.

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 4.5.1 | Member clicks "Sign In" | Login page | ✅ Working |
| 4.5.2 | Clicks "Continue with Google" | Google OAuth flow | ✅ Working |
| 4.5.3 | Authenticates with Google | Returns to app | ✅ Working |
| 4.5.4 | System matches email to customer | Account linked | ⬜ Not Tested |
| 4.5.5 | Redirected to Dashboard | Dashboard loads | ✅ Working |
| 4.5.6 | Sees membership status | Status displayed | ✅ Working |
| 4.5.7 | Sees upcoming bookings (empty) | Empty state shown | ✅ Working |
| 4.5.8 | Sees QR code for check-in | QR displays | ✅ Working |

**Questions:**
- [ ] What happens if Google email doesn't match any customer?
- [ ] Can members use non-Google email login?
- [ ] Is there account verification needed?

---

## 5. Member Daily Experience

### Scenario 5.1: Book a Class
**Context:** Member wants to book an upcoming class.

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 5.1.1 | Log into portal | Dashboard loads | ✅ Working |
| 5.1.2 | Click "Book a Class" | Schedule page | ✅ Working |
| 5.1.3 | View available classes | List of classes | ✅ Working |
| 5.1.4 | See spots available | "3 spots left" | ✅ Working |
| 5.1.5 | Filter by date | Filter works | ✅ Working |
| 5.1.6 | Filter by class type | Filter works | ⬜ Not Tested |
| 5.1.7 | Filter by instructor | Filter works | ⬜ Not Tested |
| 5.1.8 | Click "Book" on class | Confirmation modal | ✅ Working |
| 5.1.9 | Confirm booking | Booking created | ✅ Working |
| 5.1.10 | See success message | Toast notification | ✅ Working |
| 5.1.11 | Booking appears in "My Bookings" | Booking listed | ✅ Working |
| 5.1.12 | Receive confirmation email | Email arrives | ⬜ Needs Email Config |
| 5.1.13 | Classes remaining decrements | Count updates | ⬜ Not Tested |

### Scenario 5.2: View Booking Details
**Context:** Member reviews their bookings.

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 5.2.1 | Navigate to "My Bookings" | Bookings list | ✅ Working |
| 5.2.2 | See upcoming bookings | Future classes shown | ✅ Working |
| 5.2.3 | See past bookings | History visible | ✅ Working |
| 5.2.4 | View booking details | Class, time, instructor | ✅ Working |
| 5.2.5 | See booking status | Confirmed/Cancelled | ✅ Working |

### Scenario 5.3: Cancel a Booking
**Context:** Member needs to cancel a booked class.

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 5.3.1 | View booking | Booking details | ✅ Working |
| 5.3.2 | Click "Cancel" | Confirmation prompt | ✅ Working |
| 5.3.3 | Confirm cancellation | Booking cancelled | ✅ Working |
| 5.3.4 | Status updates to "Cancelled" | Status shown | ✅ Working |
| 5.3.5 | Class credit restored (if >12hrs) | Credit back | ⬜ Not Tested |
| 5.3.6 | No credit if late cancel (<12hrs) | Credit not restored | ⬜ Not Tested |
| 5.3.7 | Spot opens for others | Availability updates | ⬜ Not Tested |
| 5.3.8 | Cancellation email sent | Email arrives | ⬜ Needs Email Config |

### Scenario 5.4: Join Waitlist (Class Full)
**Context:** Member tries to book a full class.

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 5.4.1 | View class with 0 spots | "Class Full" shown | ✅ Working |
| 5.4.2 | Click "Join Waitlist" | Added to waitlist | ⬜ Not Implemented |
| 5.4.3 | See waitlist position | "Position #3" | ⬜ Not Implemented |
| 5.4.4 | Someone cancels | Spot opens | ⬜ Not Implemented |
| 5.4.5 | Waitlist member notified | Email/SMS sent | ⬜ Not Implemented |
| 5.4.6 | Auto-book if enabled | Booking created | ⬜ Not Implemented |
| 5.4.7 | Or click to claim spot | Manual booking | ⬜ Not Implemented |

### Scenario 5.5: View Membership Status
**Context:** Member checks their membership details.

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 5.5.1 | Navigate to "Membership" | Membership page | ✅ Working |
| 5.5.2 | See current plan name | Plan displayed | ✅ Working |
| 5.5.3 | See membership status | Active/Expired/Frozen | ✅ Working |
| 5.5.4 | See start and end dates | Dates shown | ✅ Working |
| 5.5.5 | See classes remaining | "7 of 12 remaining" | ✅ Working |
| 5.5.6 | See progress bar | Visual indicator | ⬜ Not Tested |
| 5.5.7 | See renewal date | Date displayed | ✅ Working |
| 5.5.8 | See membership card with QR | QR code shown | ✅ Working |

### Scenario 5.6: Check-in at Studio
**Context:** Member arrives for class and checks in.

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 5.6.1 | Member shows QR code on phone | QR on membership page | ✅ Working |
| 5.6.2 | Staff scans QR code | Scanner reads code | ⬜ Not Implemented |
| 5.6.3 | System shows member details | Name, photo, booking | ⬜ Not Implemented |
| 5.6.4 | Staff confirms check-in | Attendance recorded | ⬜ Not Implemented |
| 5.6.5 | Booking status = "Attended" | Status updates | ⬜ Not Implemented |

**Questions:**
- [ ] Is there a staff check-in interface?
- [ ] Can QR be scanned with phone camera?
- [ ] Is there a tablet kiosk mode?

### Scenario 5.7: View Invoices
**Context:** Member reviews their payment history.

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 5.7.1 | Navigate to "Invoices" | Invoice list | ✅ Working |
| 5.7.2 | See all invoices | List with status | ✅ Working |
| 5.7.3 | See paid vs pending | Status badges | ✅ Working |
| 5.7.4 | Click invoice for details | Detail view | ⬜ Not Implemented |
| 5.7.5 | See line items | Itemized view | ⬜ Not Implemented |
| 5.7.6 | See GST breakdown | CGST/SGST shown | ⬜ Not Implemented |
| 5.7.7 | Download PDF | PDF downloads | ⬜ Partial (placeholder) |

### Scenario 5.8: Update Profile
**Context:** Member updates their information.

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 5.8.1 | Navigate to "Profile" | Profile page | ✅ Working |
| 5.8.2 | View current info | Details displayed | ✅ Working |
| 5.8.3 | Edit phone number | Field editable | ⬜ Not Tested |
| 5.8.4 | Edit emergency contact | Field editable | ⬜ Not Tested |
| 5.8.5 | Save changes | Changes saved | ⬜ Not Tested |
| 5.8.6 | Change notification preferences | Preferences saved | ⬜ Not Implemented |

---

## 6. Staff Daily Operations

### Scenario 6.1: View Today's Schedule
**Context:** Staff reviews the day's classes.

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 6.1.1 | Log into Django Admin | Admin loads | ⬜ Not Tested |
| 6.1.2 | View today's classes | Today's schedule | ⬜ Not Tested |
| 6.1.3 | See bookings per class | Booking count | ⬜ Not Tested |
| 6.1.4 | See attendee list | Names listed | ⬜ Not Tested |
| 6.1.5 | Print attendance sheet | Printable view | ⬜ Not Implemented |

### Scenario 6.2: Manage Bookings
**Context:** Staff handles booking changes.

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 6.2.1 | Find customer booking | Search works | ⬜ Not Tested |
| 6.2.2 | Cancel booking on behalf | Booking cancelled | ⬜ Not Tested |
| 6.2.3 | Move booking to different class | Booking rescheduled | ⬜ Not Tested |
| 6.2.4 | Add booking manually | Booking created | ⬜ Not Tested |
| 6.2.5 | Override capacity (add extra) | Extra booking allowed | ⬜ Not Tested |

### Scenario 6.3: Mark Attendance
**Context:** Staff records who attended class.

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 6.3.1 | Open class attendance view | List of bookings | ⬜ Not Tested |
| 6.3.2 | Mark member as present | Status = Attended | ⬜ Not Tested |
| 6.3.3 | Mark member as no-show | Status = No-Show | ⬜ Not Tested |
| 6.3.4 | No-show policy applied | Credit deducted | ⬜ Not Tested |
| 6.3.5 | Bulk mark attendance | Multiple at once | ⬜ Not Implemented |

### Scenario 6.4: Cancel a Class
**Context:** Class needs to be cancelled (instructor sick, etc).

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 6.4.1 | Find scheduled class | Class found | ⬜ Not Tested |
| 6.4.2 | Click "Cancel Class" | Confirmation prompt | ⬜ Not Tested |
| 6.4.3 | Enter cancellation reason | Reason saved | ⬜ Not Tested |
| 6.4.4 | All bookings cancelled | Status updates | ⬜ Not Tested |
| 6.4.5 | All members notified | Emails sent | ⬜ Not Tested |
| 6.4.6 | Credits restored | Credits back | ⬜ Not Tested |
| 6.4.7 | Class shows as cancelled | Visual indicator | ⬜ Not Tested |

### Scenario 6.5: Substitute Instructor
**Context:** Different instructor teaching class.

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 6.5.1 | Edit scheduled class | Edit form | ⬜ Not Tested |
| 6.5.2 | Change instructor | New instructor | ⬜ Not Tested |
| 6.5.3 | Notify booked members (optional) | Email option | ⬜ Not Implemented |
| 6.5.4 | Schedule shows new instructor | Display updated | ⬜ Not Tested |

### Scenario 6.6: Process Membership Renewal
**Context:** Member's membership is expiring.

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 6.6.1 | View expiring memberships report | List of expiring | ⬜ Not Implemented |
| 6.6.2 | Contact member about renewal | Manual action | N/A |
| 6.6.3 | Member pays (offline) | Payment received | N/A |
| 6.6.4 | Extend membership | New end date | ⬜ Not Tested |
| 6.6.5 | Create renewal invoice | Invoice generated | ⬜ Not Tested |
| 6.6.6 | Mark invoice paid | Status = Paid | ⬜ Not Tested |

### Scenario 6.7: Handle Freeze Request
**Context:** Member requests to freeze membership.

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 6.7.1 | Member submits freeze request | Request created | ⬜ Not Implemented |
| 6.7.2 | Staff sees request in admin | Request visible | ⬜ Not Implemented |
| 6.7.3 | Staff approves request | Request approved | ⬜ Not Implemented |
| 6.7.4 | Membership status = Frozen | Status updates | ⬜ Not Implemented |
| 6.7.5 | End date extended by freeze days | Date adjusted | ⬜ Not Implemented |
| 6.7.6 | Member notified | Email sent | ⬜ Not Implemented |
| 6.7.7 | Staff unfreezes later | Status = Active | ⬜ Not Implemented |

---

## 7. Communication & Notifications

### Scenario 7.1: Automated Emails
**Context:** System sends emails automatically.

| Trigger | Email | Status |
|---------|-------|--------|
| Trial booking submitted | Confirmation to prospect | ⬜ Backend ready, needs config |
| Trial booking submitted | Notification to staff | ⬜ Backend ready, needs config |
| Contact form submitted | Auto-reply to sender | ⬜ Backend ready, needs config |
| Contact form submitted | Notification to staff | ⬜ Backend ready, needs config |
| Class booked | Confirmation to member | ⬜ Not Implemented |
| Class cancelled by member | Cancellation confirmation | ⬜ Not Implemented |
| Class cancelled by studio | Notification to all booked | ⬜ Not Implemented |
| Membership created | Welcome email | ⬜ Not Implemented |
| Membership expiring (7 days) | Reminder email | ⬜ Not Implemented |
| Membership expired | Expiry notification | ⬜ Not Implemented |
| Invoice created | Invoice email with PDF | ⬜ Not Implemented |
| Class reminder (24hrs before) | Reminder email | ⬜ Not Implemented |
| Class reminder (2hrs before) | Reminder email | ⬜ Not Implemented |

### Scenario 7.2: Manual Communications
**Context:** Staff sends custom messages.

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 7.2.1 | Compose message to member | Message form | ⬜ Not Implemented |
| 7.2.2 | Send to single member | Email sent | ⬜ Not Implemented |
| 7.2.3 | Send to group (e.g., all active) | Bulk email | ⬜ Not Implemented |
| 7.2.4 | Schedule message | Sent at time | ⬜ Not Implemented |
| 7.2.5 | Track opens/clicks | Analytics | ⬜ Not Implemented |

---

## 8. Membership Lifecycle

### Scenario 8.1: Membership States

| State | Description | Member Can Book? | Status |
|-------|-------------|------------------|--------|
| Active | Valid membership | Yes | ✅ Handled |
| Expired | Past end date | No | ✅ Handled |
| Frozen | Temporarily paused | No | ⬜ Not Implemented |
| Cancelled | Terminated early | No | ⬜ Not Tested |
| Pending | Created but not paid | No | ⬜ Not Tested |

### Scenario 8.2: Class Credit Management

| Action | Effect on Credits | Status |
|--------|-------------------|--------|
| Book a class | -1 credit (reserved) | ⬜ Not Tested |
| Attend class | Credit consumed | ⬜ Not Tested |
| Cancel >12hrs before | +1 credit (restored) | ⬜ Not Tested |
| Cancel <12hrs before | No credit back | ⬜ Not Tested |
| No-show | No credit back | ⬜ Not Tested |
| Class cancelled by studio | +1 credit | ⬜ Not Tested |
| Unlimited plan | No credit tracking | ⬜ Not Tested |

---

## 9. Reporting & Analytics

### Scenario 9.1: Business Reports (Admin)

| Report | Description | Status |
|--------|-------------|--------|
| Daily attendance | Who attended today | ⬜ Not Implemented |
| Class popularity | Most booked classes | ⬜ Not Implemented |
| Instructor performance | Classes taught, attendance | ⬜ Not Implemented |
| Revenue report | Income by period | ⬜ Not Implemented |
| Membership report | Active, expiring, expired | ⬜ Not Implemented |
| Trial conversion | Trials → Members | ⬜ Not Implemented |
| No-show report | Members with no-shows | ⬜ Not Implemented |
| Utilization report | Class capacity usage | ⬜ Not Implemented |

### Scenario 9.2: Member Stats (Portal)

| Stat | Description | Status |
|------|-------------|--------|
| Total classes attended | All-time count | ⬜ Not Implemented |
| Classes this month | Current month | ⬜ Not Implemented |
| Favorite class type | Most attended | ⬜ Not Implemented |
| Attendance streak | Consecutive weeks | ⬜ Not Implemented |

---

## 10. Edge Cases & Error Scenarios

### Scenario 10.1: Authentication Edge Cases

| Scenario | Expected Behavior | Status |
|----------|-------------------|--------|
| User logs in with Google, email doesn't match any customer | Show "not registered" message | ⬜ Not Tested |
| User logs in, customer exists but no membership | Show "no membership" state | ✅ Working |
| User logs in, membership expired | Show "expired" state | ⬜ Not Tested |
| Token expires during session | Auto-refresh or re-login | ⬜ Not Tested |
| User logs out | Session cleared, redirect to login | ⬜ Not Tested |

### Scenario 10.2: Booking Edge Cases

| Scenario | Expected Behavior | Status |
|----------|-------------------|--------|
| Book when 0 credits remaining | Show error, suggest upgrade | ⬜ Not Tested |
| Book class already booked | Show "already booked" | ⬜ Not Tested |
| Book class in the past | Not allowed | ⬜ Not Tested |
| Cancel class that already started | Not allowed | ⬜ Not Tested |
| Book while membership frozen | Not allowed | ⬜ Not Tested |
| Double-click book button | Prevent duplicate booking | ⬜ Not Tested |

### Scenario 10.3: Payment Edge Cases

| Scenario | Expected Behavior | Status |
|----------|-------------------|--------|
| Invoice for ₹0 (comp class) | Handle zero amount | ⬜ Not Tested |
| Partial payment | Track partial paid | ⬜ Not Implemented |
| Refund needed | Refund workflow | ⬜ Not Implemented |
| GST calculation rounding | Correct to paisa | ⬜ Not Tested |

### Scenario 10.4: Schedule Edge Cases

| Scenario | Expected Behavior | Status |
|----------|-------------------|--------|
| No classes scheduled for a day | Show "no classes" message | ✅ Working |
| Instructor double-booked | Prevent or warn | ⬜ Not Tested |
| Class time overlap | Detect conflict | ⬜ Not Tested |
| Class in multiple time zones | Handle correctly | ⬜ Not Tested |

### Scenario 10.5: Data Integrity

| Scenario | Expected Behavior | Status |
|----------|-------------------|--------|
| Delete customer with bookings | Cascade or prevent? | ⬜ Not Tested |
| Delete class type with schedules | Cascade or prevent? | ⬜ Not Tested |
| Delete instructor with assigned classes | Cascade or prevent? | ⬜ Not Tested |
| Duplicate email addresses | Prevent or allow? | ⬜ Not Tested |

---

## Implementation Priority Matrix

### P0 - Critical for Launch
- [ ] Trial booking workflow (end-to-end)
- [ ] Member booking workflow (end-to-end)
- [ ] Attendance tracking
- [ ] Invoice viewing with PDF
- [ ] Email notifications (basic set)

### P1 - Important for Operations
- [ ] Class cancellation by staff
- [ ] Membership renewal workflow
- [ ] No-show tracking
- [ ] Expiring membership alerts
- [ ] Staff dashboard for daily operations

### P2 - Nice to Have
- [ ] Waitlist functionality
- [ ] Freeze/cancel membership requests
- [ ] Advanced reporting
- [ ] Member statistics
- [ ] Bulk communications

### P3 - Future Enhancement
- [ ] Online payments
- [ ] Mobile app
- [ ] SMS notifications
- [ ] WhatsApp integration
- [ ] Referral program

---

## Current Gaps Summary

### Frontend Gaps
1. **No staff-facing web interface** - Relies entirely on Django Admin
2. **No check-in interface** - Need QR scanning capability
3. **No invoice detail view** - Only list, no detail modal
4. **No waitlist UI** - Feature not built
5. **No freeze/cancel request UI** - Feature not built
6. **No class filtering** - Schedule page needs filters

### Backend Gaps (Suspected)
1. **Settings configuration** - May be hardcoded
2. **Trial booking status workflow** - Unknown
3. **Attendance tracking API** - May not exist
4. **Check-in API** - May not exist
5. **Membership freeze workflow** - May not exist
6. **Email templates** - May not be styled
7. **PDF generation** - Placeholder only

### Process Gaps
1. **No documented admin workflow** - Staff needs training
2. **No data entry standards** - Consistency needed
3. **No backup/recovery plan** - Data safety
4. **No monitoring** - Error detection

---

## Next Steps

1. **Validate backend capabilities** - Check which APIs exist
2. **Prioritize gaps** - Decide what's needed for launch
3. **Create test data** - Seed database with realistic data
4. **End-to-end testing** - Walk through each scenario
5. **Document admin procedures** - Staff training material

---

*This document should be updated as features are implemented and tested.*
