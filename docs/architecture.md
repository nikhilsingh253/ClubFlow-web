# ClubFlow - Health Club Management System
## Overall System Architecture

**Version:** 1.0  
**Last Updated:** January 2, 2026  
**Status:** Planning Phase

---

## 1. Executive Summary

ClubFlow is a comprehensive health club management system designed to streamline gym operations, enhance customer experience, and provide powerful CRM capabilities. The system consists of:

- **Customer-facing web application** (public marketing site + member portal)
- **Staff/Admin CRM portal** (Django Admin customized for gym operations)
- **RESTful API backend** (Django + Django REST Framework)
- **Future mobile applications** (iOS/Android via React Native)

### 1.1 Primary Market
- **Location:** India (NCR Region - Delhi, Gurgaon, Noida)
- **Currency:** Indian Rupee (INR - ₹)
- **Language:** English (with Hindi support planned)
- **Payment Methods:** UPI, Cards, Net Banking, Wallets
- **Communication:** Email-first (WhatsApp critical for Phase 2)

### 1.2 International Scalability
The architecture is designed to support **multi-region expansion** from day one:
- Multi-currency support (INR, USD, EUR, etc.)
- Multi-timezone support
- Payment gateway abstraction (Razorpay for India, Stripe for international)
- Multi-language support (future)
- Localization (date formats, number formats, tax rules)

---

## 2. System Overview

### 2.1 Architecture Style
- **Microservices Architecture** (Backend and Frontend separated)
- **API-First Design** (RESTful APIs for all client applications)
- **Responsive Web Design** (Mobile-friendly web application)
- **Progressive Enhancement** (Can evolve into PWA if needed)

### 2.2 High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        INTERNET / USERS                          │
└────────────┬────────────────────────────┬─────────────────┬─────┘
             │                            │                 │
             │ HTTPS                      │ HTTPS           │ HTTPS
             │                            │                 │
┌────────────▼──────────┐    ┌───────────▼────────┐   ┌───▼─────────┐
│  React Web Client     │    │  React Native      │   │   Staff     │
│  (clubflow-web)       │    │  (clubflow-mobile) │   │   Browser   │
│                       │    │  iOS + Android     │   │             │
│  - Public Pages       │    │  - Customer App    │   │             │
│  - Member Portal      │    │  - Class Booking   │   │             │
│  - Class Booking      │    │  - Check-ins       │   │             │
│  - Account Management │    │                    │   │             │
└────────────┬──────────┘    └───────────┬────────┘   └───┬─────────┘
             │                            │                 │
             │ REST API                   │ REST API        │ HTTPS
             │                            │                 │
             └────────────────────────────┴─────────────────┘
                                  │
                                  │
┌─────────────────────────────────▼─────────────────────────────────┐
│                    API GATEWAY / LOAD BALANCER                     │
│                         (NGINX / AWS ALB)                          │
└─────────────────────────────────┬─────────────────────────────────┘
                                  │
┌─────────────────────────────────▼─────────────────────────────────┐
│                    DJANGO BACKEND (clubflow-api)                   │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │          Django REST Framework API Layer                  │    │
│  │  - Authentication (JWT)                                   │    │
│  │  - API Endpoints (v1)                                     │    │
│  │  - Serializers & Validators                               │    │
│  │  - Permissions & Throttling                               │    │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │              Business Logic Layer                         │    │
│  │  - Services (Membership, Booking, Payment)                │    │
│  │  - Event Handlers                                         │    │
│  │  - Email Service                                          │    │
│  │  - Notification Service                                   │    │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │                Django ORM / Models                        │    │
│  │  - Customer, Membership, MembershipPlan                   │    │
│  │  - Class, ClassSchedule, Booking                          │    │
│  │  - Invoice, Payment, Subscription                         │    │
│  │  - Trainer, Equipment, Check-in                           │    │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │              Django Admin (Staff Portal)                  │    │
│  │  - Customer Management (CRM)                              │    │
│  │  - Membership Management                                  │    │
│  │  - Class Scheduling                                       │    │
│  │  - Invoice Generation                                     │    │
│  │  - Reports & Analytics                                    │    │
│  └──────────────────────────────────────────────────────────┘    │
└─────────────────────────────────┬─────────────────────────────────┘
                                  │
┌─────────────────────────────────▼─────────────────────────────────┐
│                      PostgreSQL DATABASE                           │
│  - Customer data                                                   │
│  - Memberships & subscriptions                                     │
│  - Classes & bookings                                              │
│  - Financial records                                               │
│  - Audit logs                                                      │
└─────────────────────────────────┬─────────────────────────────────┘
                                  │
┌─────────────────────────────────▼─────────────────────────────────┐
│                    EXTERNAL SERVICES                               │
│  - Stripe (Payment Processing)                                     │
│  - SendGrid / AWS SES (Email Service)                              │
│  - Twilio (SMS Notifications)                                      │
│  - AWS S3 (File Storage - profile photos, documents)               │
│  - Redis (Caching & Session Storage)                               │
└────────────────────────────────────────────────────────────────────┘
```

---

## 3. Technology Stack

### 3.1 Backend (`clubflow-api`)
| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| **Framework** | Django | 5.1+ | Web framework |
| **API Framework** | Django REST Framework | 3.15+ | REST API |
| **Database** | PostgreSQL | 15+ | Primary data store |
| **Cache** | Redis | 7+ | Caching & sessions |
| **Task Queue** | Celery | 5+ | Background jobs |
| **Message Broker** | Redis/RabbitMQ | - | Celery broker |
| **Auth** | Google OAuth + JWT | - | Google Sign-In + API tokens |
| **Payment (Primary)** | Razorpay Python SDK | 1.4+ | Payment processing (India) |
| **Payment (Alt)** | Stripe Python SDK | 7+ | Payment processing (International) |
| **Email (MVP)** | Django Email / SendGrid | - | Transactional emails |
| **SMS (Phase 2)** | Twilio Python SDK | 8+ | SMS notifications |
| **WhatsApp (Phase 2)** | Twilio WhatsApp API | 8+ | WhatsApp messages |
| **File Storage** | AWS S3 / Local | - | Media files |
| **WSGI Server** | Gunicorn | 21+ | Production server |
| **Web Server** | Nginx | 1.24+ | Reverse proxy |

### 3.2 Frontend (`clubflow-web`)
| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| **Framework** | React | 18+ | UI framework |
| **Build Tool** | Vite | 5+ | Build tooling |
| **Language** | TypeScript | 5+ | Type safety |
| **Routing** | React Router | 6+ | Client-side routing |
| **State Management** | Zustand / React Query | - | Global state & API cache |
| **UI Framework** | Tailwind CSS | 3+ | Styling |
| **Component Library** | shadcn/ui | - | Pre-built components |
| **Forms** | React Hook Form | 7+ | Form handling |
| **Validation** | Zod | 3+ | Schema validation |
| **API Client** | Axios | 1+ | HTTP client |
| **Date Handling** | date-fns | 3+ | Date utilities |
| **Icons** | Lucide React | - | Icon library |

### 3.3 Mobile (Future - `clubflow-mobile`)
| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| **Framework** | React Native | 0.73+ | Mobile framework |
| **Navigation** | React Navigation | 6+ | Mobile navigation |
| **State** | Zustand / React Query | - | State management |
| **UI** | React Native Paper | 5+ | Material Design |

### 3.4 DevOps & Infrastructure
| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Version Control** | Git + GitHub | Code repository |
| **CI/CD** | GitHub Actions | Automated testing & deployment |
| **Containerization** | Docker | Application containers |
| **Orchestration** | Docker Compose / Kubernetes | Container orchestration |
| **Monitoring** | Sentry | Error tracking |
| **Logging** | ELK Stack / CloudWatch | Log aggregation |
| **Hosting** | AWS / DigitalOcean / Heroku | Cloud infrastructure |

---

## 4. Core System Components

### 4.1 Customer Management (CRM)
- Customer profiles (personal info, contact details, emergency contacts)
- Lead tracking (prospects, inquiries)
- Customer lifecycle management (prospect → member → renewal → churn)
- Customer segmentation (by membership type, activity level, etc.)
- Communication history (emails, SMS, notes)
- Document management (contracts, waivers, medical forms)

### 4.2 Membership Management
- **Membership Plans**:
  - Multiple plan types (Basic, Premium, VIP)
  - Pricing tiers (monthly, quarterly, annual)
  - Plan features (class access, guest passes, locker access)
  - Family/corporate memberships

- **Day Passes** (Phase 2):
  - Single-day access for non-members
  - One-time purchase
  - Book classes for specific date
  - Trial before membership
  
- **Subscription Management**:
  - Automatic renewals
  - Membership expiration alerts
  - Upgrade/downgrade workflows
  - Freeze/pause memberships
  - Cancellation handling

- **Membership Cards**:
  - Digital membership cards (QR codes)
  - Card activation/deactivation

### 4.3 Class & Schedule Management
- **Class Types**:
  - Yoga, Spin, CrossFit, HIIT, Pilates, etc.
  - Group classes vs. personal training
  - Difficulty levels (Beginner, Intermediate, Advanced)

- **Scheduling**:
  - Weekly recurring schedules
  - Special/holiday schedules
  - Class capacity limits
  - Multiple locations support
  - Room/studio assignments

- **Booking System**:
  - Real-time availability
  - Waitlist management
  - Cancellation policies (hours before class)
  - No-show tracking
  - Booking history

### 4.4 Trainer Management
- Trainer profiles (bio, certifications, specializations)
- Trainer schedules
- Class assignments
- Performance metrics (class ratings, attendance)
- Commission tracking (if applicable)

### 4.5 Financial Management
- **Invoicing**:
  - Automatic invoice generation (membership renewals)
  - Manual invoice creation (personal training, products)
  - Invoice templates
  - PDF generation

- **Payment Processing**:
  - Stripe integration (credit/debit cards)
  - Payment methods on file
  - Automatic billing
  - Payment history
  - Refund processing

- **Revenue Tracking**:
  - Revenue by membership type
  - Revenue by class type
  - Trainer revenue
  - Product sales

### 4.6 Attendance & Access Control
- **Check-in System**:
  - QR code scanning
  - Manual check-in (front desk)
  - Check-in history
  - Access denied (expired membership, unpaid invoices)

- **Analytics**:
  - Peak hours analysis
  - Class attendance rates
  - Member usage patterns
  - No-show rates

### 4.7 Facility Management
- **Equipment Tracking**:
  - Equipment inventory
  - Maintenance schedules
  - Out-of-service tracking

- **Locker Management**:
  - Locker assignments
  - Locker availability
  - Locker rentals (monthly)

- **Amenities**:
  - Sauna, steam room, pool schedules
  - Maintenance tracking

### 4.8 Marketing & Communications

#### Phase 1 (MVP) - Email Only:
- **Transactional Emails** (Critical):
  - Account emails (welcome, password reset, verification)
  - Booking confirmations
  - Payment receipts (with PDF invoice)
  - Membership renewal notifications
  - Membership expiring soon alerts

**Communication Strategy for MVP:**
- Website/portal is the source of truth
- Email notifications for critical actions
- Customers check portal for bookings/status
- Simple, reliable, cost-effective

#### Phase 2 - Marketing & Multi-Channel:
- **Email Marketing**:
  - Newsletter campaigns
  - Promotional emails
  - Segmented campaigns
  - Email templates
  - Campaign analytics

- **SMS Notifications**:
  - Class reminders (opt-in)
  - Booking confirmations
  - Payment reminders

- **WhatsApp Business API** (Critical for India):
  - Booking confirmations
  - Class reminders
  - Two-way conversations
  - Rich media messages
  - **Note:** WhatsApp has 90%+ penetration in India

#### Phase 3 - Mobile:
- **Push Notifications** (Mobile Apps):
  - Class starting soon
  - Booking confirmations
  - Membership expiration alerts

**Why This Approach:**
- ✅ Faster MVP launch (no complex messaging)
- ✅ Lower costs (no SMS/WhatsApp fees initially)
- ✅ Can add based on customer demand
- ✅ Use proven BSPs (Twilio, SendGrid) - never build custom

### 4.9 Reporting & Analytics
- **Financial Reports**:
  - Revenue summary (daily, weekly, monthly)
  - Payment reports
  - Outstanding invoices
  - Refund reports

- **Membership Reports**:
  - Active memberships
  - New sign-ups
  - Renewals
  - Cancellations
  - Member retention rates

- **Operational Reports**:
  - Class attendance
  - Most popular classes
  - Trainer performance
  - Check-in reports
  - Equipment maintenance

- **Marketing Reports**:
  - Lead sources
  - Conversion rates
  - Email campaign performance

### 4.10 Customer Portal Features
- View membership status & expiration
- Browse class schedules
- Book/cancel classes
- View booking history
- Update profile information
- View payment history & invoices
- Download invoices (PDF)
- Update payment methods
- Refer friends
- View guest pass balance

### 4.11 Staff Portal Features (Django Admin)
- Dashboard (key metrics, today's classes, recent sign-ups)
- Customer management (full CRM)
- Membership management (create, renew, cancel)
- Class scheduling
- Booking management
- Invoice generation
- Payment processing
- Reports & analytics
- Email campaign creation
- User management (staff roles & permissions)

---

## 5. Security Architecture

### 5.1 Authentication Strategy: Google OAuth

**Decision:** Use Google OAuth instead of custom authentication

**Why Google OAuth:**
- ✅ **No password management** (Google handles security)
- ✅ **Simpler implementation** (no registration, forgot password, reset password flows)
- ✅ **Better UX** (one-click sign-in, familiar to users)
- ✅ **More secure** (Google's security infrastructure, automatic 2FA support)
- ✅ **90%+ users have Google accounts** (especially in India with Gmail/Android)
- ✅ **Free** (no additional cost)
- ✅ **Mobile-ready** (same flow for web and future mobile apps)
- ✅ **Reduced development time** (save 2-3 weeks on auth flows)
- ✅ **Lower maintenance** (no password breach risks, no security updates)

**Architecture:**
```
User Authentication Flow:
┌──────────────┐
│ User clicks  │
│ "Sign in     │──────┐
│ with Google" │      │
└──────────────┘      │
                      ▼
              ┌───────────────┐
              │ Google OAuth  │
              │ Consent Screen│
              └───────┬───────┘
                      │
          User authorizes access
                      │
                      ▼
              ┌───────────────┐
              │ Google returns│
              │ - Email       │
              │ - Name        │
              │ - Photo       │
              │ - Google ID   │
              └───────┬───────┘
                      │
                      ▼
              ┌───────────────┐
              │ Django Backend│
              │ - Create/Update│
              │   User record │
              │ - Issue JWT   │
              └───────┬───────┘
                      │
                      ▼
              ┌───────────────┐
              │ React Frontend│
              │ - Store JWT   │
              │ - API calls   │
              └───────────────┘
```

**Implementation:**
- **Library:** django-allauth (20K+ stars, battle-tested)
- **Provider:** Google OAuth 2.0
- **API Token:** JWT (djangorestframework-simplejwt) for subsequent API calls
- **User Storage:** Django User model (email, name, photo from Google)
- **No Passwords:** Never stored, never managed
- **Data Ownership:** User data stored in YOUR database (not in Google)

### 5.2 Authorization & Access Control
- **Multi-level access control** (role-based):
  - **Public** (non-authenticated)
  - **Customer** (authenticated members via Google OAuth)
  - **Staff** (front desk, trainers - Google accounts with staff role)
  - **Manager** (operations manager - Google accounts with manager role)
  - **Admin** (full system access - Google accounts with admin role)
- **Django permissions system** (groups & permissions)
- **No password policies needed** (Google handles password security)
- **Two-factor authentication** (via user's Google account settings - free)
- **Session management** (JWT access tokens: 15min, refresh tokens: 7 days)

### 5.2 Data Security
- **Encryption at rest** (database encryption)
- **Encryption in transit** (HTTPS/TLS 1.3)
- **PCI DSS compliance** (payment data via Stripe)
- **GDPR compliance** (data privacy, right to erasure)
- **Sensitive data handling**:
  - No plain-text passwords
  - No credit card storage (Stripe handles)
  - Encrypted emergency contacts

### 5.3 API Security
- **Rate limiting** (prevent abuse)
- **CORS policies** (restrict origins)
- **Input validation** (prevent injection attacks)
- **SQL injection prevention** (Django ORM)
- **XSS prevention** (React sanitization)
- **CSRF protection** (for stateful endpoints)

### 5.4 Audit Logging
- User activity logs (login, logout, actions)
- Admin actions (membership changes, invoice creation)
- Payment transaction logs
- Data modification history

---

## 6. API Design Principles

### 6.1 RESTful Standards
- Resource-based URLs (`/api/v1/customers/`, `/api/v1/classes/`)
- HTTP methods (GET, POST, PUT, PATCH, DELETE)
- Proper status codes (200, 201, 400, 401, 403, 404, 500)
- JSON request/response format

### 6.2 Versioning
- API versioning (`/api/v1/`, `/api/v2/`)
- Backward compatibility for mobile apps

### 6.3 Pagination
- Cursor-based pagination for large datasets
- Default page size: 20-50 items

### 6.4 Filtering & Sorting
- Query parameters for filtering (`?status=active&membership_type=premium`)
- Sorting (`?ordering=-created_at`)
- Search (`?search=john`)

### 6.5 Error Handling
- Consistent error response format:
```json
{
  "error": {
    "code": "INVALID_INPUT",
    "message": "Email address is required",
    "field": "email"
  }
}
```

---

## 7. Database Design Principles

### 7.1 Core Principles
- **Normalization** (3NF minimum)
- **Foreign key constraints** (referential integrity)
- **Indexes** (performance optimization)
- **Soft deletes** (maintain data history)
- **Audit fields** (created_at, updated_at, created_by, updated_by)

### 7.2 Key Database Tables (High-Level)
```
Users
  ├── Customers (extends User)
  ├── Staff (extends User)
  └── Trainers (extends Staff)

Memberships
  ├── MembershipPlans
  ├── MembershipSubscriptions
  └── MembershipCards

Classes
  ├── ClassTypes
  ├── ClassSchedules
  ├── Bookings
  └── Waitlists

Financial
  ├── Invoices
  ├── InvoiceLineItems
  ├── Payments
  └── PaymentMethods

Facilities
  ├── Equipment
  ├── Lockers
  └── Locations

Communications
  ├── EmailCampaigns
  ├── EmailTemplates
  ├── SMSNotifications
  └── CustomerNotes

Operations
  ├── CheckIns
  └── MaintenanceRecords
```

---

## 8. Integration Points

### 8.1 Payment Gateway

#### Primary: Razorpay (India Market)
- Customer creation
- Payment method storage (cards, UPI, wallets, net banking)
- Subscription management
- One-time payments
- Refunds
- UPI payments (critical for Indian market)
- Webhooks (payment success, failure, subscription events)
- GST-compliant invoicing

#### Alternative: Stripe (International Expansion)
- Same features as Razorpay
- Used when expanding to US/EU/other markets
- Multi-currency support

**Architecture:** Payment gateway abstraction layer allows supporting multiple gateways based on customer location/currency

### 8.2 Email Service (SendGrid/AWS SES)
- Transactional emails
- Marketing campaigns
- Email templates
- Bounce/complaint handling

### 8.3 SMS Service (Twilio)
- Booking confirmations
- Class reminders
- Payment reminders

### 8.4 File Storage (AWS S3)
- Profile photos
- Contract documents
- Medical forms
- Equipment manuals

### 8.5 Analytics (Google Analytics / Mixpanel)
- User behavior tracking
- Conversion tracking
- Funnel analysis

---

## 9. Deployment Architecture

### 9.1 Environments
- **Development** (Local developer machines)
- **Staging** (Pre-production testing)
- **Production** (Live system)

### 9.2 Production Architecture
```
┌─────────────────────────────────────────┐
│         CDN (CloudFront)                │
│         Static Assets (React build)     │
└─────────────────────────────────────────┘
                   │
┌─────────────────▼───────────────────────┐
│      Load Balancer (AWS ALB)            │
└─────────────────┬───────────────────────┘
                  │
        ┌─────────┴─────────┐
        │                   │
┌───────▼──────┐    ┌──────▼────────┐
│  Django App  │    │  Django App   │
│  Container 1 │    │  Container 2  │
└───────┬──────┘    └──────┬────────┘
        │                   │
        └─────────┬─────────┘
                  │
        ┌─────────┴─────────┐
        │                   │
┌───────▼──────┐    ┌──────▼────────┐
│  PostgreSQL  │    │     Redis     │
│   (Primary)  │    │    (Cache)    │
└──────────────┘    └───────────────┘
```

### 9.3 Scalability Considerations
- Horizontal scaling (multiple Django app instances)
- Database read replicas (for reporting)
- CDN for static assets
- Redis caching (reduce database load)
- Celery workers (background tasks)
- Load balancing (distribute traffic)

---

## 10. Development Workflow

### 10.1 Version Control
- **Branching Strategy**:
  - `main` - Production-ready code
  - `develop` - Integration branch
  - `feature/*` - Feature branches
  - `hotfix/*` - Emergency fixes

### 10.2 Code Review Process
- All changes via Pull Requests
- Minimum 1 reviewer approval
- Automated tests must pass
- Code quality checks (linters)

### 10.3 CI/CD Pipeline
```
Code Push → Linting → Unit Tests → Integration Tests → Build → Deploy
```

### 10.4 Testing Strategy
- **Backend**:
  - Unit tests (pytest)
  - Integration tests (API testing)
  - Coverage target: 80%+

- **Frontend**:
  - Unit tests (Vitest)
  - Component tests (React Testing Library)
  - E2E tests (Playwright/Cypress)
  - Coverage target: 70%+

---

## 11. Performance Requirements

### 11.1 Response Times
- API endpoints: < 200ms (p95)
- Page load: < 2s (first contentful paint)
- Class booking: < 1s (real-time availability)

### 11.2 Availability
- Uptime: 99.9% (excluding planned maintenance)
- Planned maintenance windows: Off-peak hours

### 11.3 Scalability Targets
- Support 10,000+ active members
- Handle 1,000+ concurrent users
- Process 100+ bookings per minute

---

## 12. Data Backup & Recovery

### 12.1 Backup Strategy
- **Database**: Daily automated backups (retain 30 days)
- **Files**: S3 versioning enabled
- **Configuration**: Version controlled

### 12.2 Disaster Recovery
- RTO (Recovery Time Objective): 4 hours
- RPO (Recovery Point Objective): 1 hour
- Regular disaster recovery drills

---

## 13. Compliance & Legal

### 13.1 Data Privacy
- **India:** IT Act 2000, DPDP Act 2023 compliance
- **International expansion:** GDPR (EU), CCPA (California) ready
- Data retention policies
- Right to erasure (delete account)
- Customer consent management

### 13.2 Tax Compliance
- **India:** GST compliance (18% for gym services)
  - GSTIN registration
  - GST-compliant invoicing
  - HSN/SAC codes
  - GST returns filing support
- **International:** Tax calculation based on location (future)

### 13.3 Payment Compliance
- **India:** RBI guidelines for payment aggregators
- **International:** PCI DSS compliance (handled by Razorpay/Stripe)
- Secure payment data handling (never store card details)

### 13.4 Terms & Policies
- Terms of Service
- Privacy Policy
- Cookie Policy
- Refund Policy
- Membership Agreement
- Cancellation Policy

---

## 14. Internationalization & Localization

### 14.1 Multi-Currency Support
**Architecture (Built from Day 1):**
```python
# Database schema supports multi-currency
class MembershipPlan(models.Model):
    price = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default='INR')  # ISO 4217
    
class Invoice(models.Model):
    total = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default='INR')
```

**Supported Currencies (Expandable):**
- **INR** - Indian Rupee (primary)
- USD - US Dollar (Phase 3)
- EUR - Euro (Phase 3)
- GBP - British Pound (Phase 3)

### 14.2 Multi-Region Support
**Payment Gateway Selection:**
```python
def get_payment_gateway(currency):
    if currency == 'INR':
        return RazorpayGateway()
    else:
        return StripeGateway()
```

**Tax Calculation:**
```python
def calculate_tax(amount, country):
    if country == 'IN':
        return amount * 0.18  # GST 18%
    elif country == 'US':
        return calculate_sales_tax(amount, state)
    # ... other countries
```

### 14.3 Timezone Support
- All datetimes stored in UTC
- Display in user's timezone
- Booking times converted to local gym timezone

### 14.4 Language Support (Future)
- **Phase 1:** English only
- **Phase 2:** Hindi support
- **Phase 3:** Multiple languages (i18n framework ready)

### 14.5 Phone Number Handling
```python
# Using phonenumbers library
from phonenumbers import parse, format_number, PhoneNumberFormat

# Supports:
# India: +91 XXXXX XXXXX
# US: +1 (XXX) XXX-XXXX
# International format
```

---

## 15. Future Enhancements (Phase 3+)

### 14.1 Advanced Features
- Mobile apps (iOS/Android)
- Biometric check-in (facial recognition)
- Nutrition tracking
- Workout plans & progress tracking
- Social features (member community)
- Marketplace (merchandise, supplements)
- Virtual classes (live streaming)
- Wearable device integration (Fitbit, Apple Watch)
- Franchise/multi-location support
- White-label capabilities

### 14.2 AI/ML Features
- Personalized class recommendations
- Churn prediction
- Dynamic pricing
- Predictive maintenance (equipment)

---

## 15. Team Structure & Responsibilities

### 15.1 Backend Team
- API development
- Database design & optimization
- Business logic implementation
- Django Admin customization
- Integration with external services
- Performance optimization

### 15.2 Frontend Team
- React web application
- UI/UX implementation
- API integration
- Responsive design
- Form handling & validation
- State management

### 15.3 DevOps
- Infrastructure setup
- CI/CD pipelines
- Monitoring & logging
- Security hardening
- Backup & recovery

---

## 16. Communication Between Teams

### 16.1 API Contract
- OpenAPI/Swagger specification (single source of truth)
- API documentation auto-generated
- Regular sync meetings (weekly)

### 16.2 Shared Tools
- **Documentation**: Notion / Confluence
- **Communication**: Slack / Discord
- **Project Management**: Jira / Linear
- **API Testing**: Postman collections

---

## 17. Success Metrics (KPIs)

### 17.1 Technical Metrics
- API response time (p95, p99)
- Error rate (< 0.1%)
- Uptime (99.9%+)
- Test coverage (80%+)
- Build time (< 10 minutes)

### 17.2 Business Metrics
- Member sign-up rate
- Class booking rate
- Member retention rate
- Average revenue per member
- Customer satisfaction score

---

## 18. Timeline & Milestones

### Phase 1 - MVP (Months 1-3)
- ✅ Core CRM (customers, memberships)
- ✅ Class scheduling & booking
- ✅ Invoicing & payments (Razorpay integration)
- ✅ Transactional emails (SendGrid)
- ✅ Customer portal
- ✅ Django Admin (staff portal)
- ✅ GST-compliant invoicing
- ✅ INR currency support

### Phase 2 - Enhancement (Months 4-6)
- ✅ Day passes (non-member access)
- ✅ Personal training bookings
- ✅ Email marketing campaigns
- ✅ WhatsApp notifications (critical for India - 90%+ penetration)
- ✅ SMS notifications (opt-in)
- ✅ Advanced reporting & analytics
- ✅ Check-in system (QR code)
- ✅ Equipment & locker management
- ✅ Multi-currency support (for expansion)

### Phase 3 - Mobile (Months 7-9)
- ✅ React Native iOS app
- ✅ React Native Android app
- ✅ Push notifications
- ✅ Mobile check-in

### Phase 4 - Advanced (Months 10-12)
- ✅ Analytics dashboard
- ✅ Advanced marketing automation
- ✅ Multi-location support
- ✅ Franchise features

---

## 19. Risk Management

### 19.1 Technical Risks
| Risk | Impact | Mitigation |
|------|--------|------------|
| Database performance degradation | High | Implement caching, query optimization, read replicas |
| API downtime | High | Load balancing, health checks, auto-scaling |
| Data breach | Critical | Security audits, penetration testing, encryption |
| Third-party service failure | Medium | Fallback mechanisms, queue failed requests |

### 19.2 Business Risks
| Risk | Impact | Mitigation |
|------|--------|------------|
| Scope creep | Medium | Clear requirements, change control process |
| Timeline delays | Medium | Agile sprints, regular reviews, buffer time |
| Resource constraints | Medium | Prioritize features, outsource if needed |

---

## 20. Glossary

| Term | Definition |
|------|------------|
| **Member** | A customer with an active membership |
| **Lead** | A prospective customer (inquiry) |
| **Check-in** | Entry to the gym facility |
| **Booking** | Reserved spot in a class |
| **Waitlist** | Queue for fully booked classes |
| **No-show** | Booked but didn't attend |
| **Freeze** | Temporarily pause membership (e.g., medical, vacation) |
| **Churn** | Member cancellation rate |
| **Guest Pass** | Day pass for non-members |

---

## 21. References & Resources

- **Django Documentation**: https://docs.djangoproject.com/
- **Django REST Framework**: https://www.django-rest-framework.org/
- **React Documentation**: https://react.dev/
- **Stripe API**: https://stripe.com/docs/api
- **PostgreSQL Documentation**: https://www.postgresql.org/docs/

---

## 22. Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-01 | System Architect | Initial architecture document |

---

**Next Steps:**
1. Review and approve architecture
2. Create detailed backend plan
3. Create detailed frontend plan
4. Set up repositories
5. Initialize projects
6. Begin development (Sprint 1)

---

*This document is a living document and will be updated as the project evolves.*

