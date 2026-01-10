# ClubFlow - Health Club Management System

A comprehensive health club management system with customer-facing web application and powerful CRM capabilities for gym operations.

**Tagline:** *Seamless Gym Management*

---

## 📋 Project Overview

**ClubFlow** is a modern, full-stack health club management system designed to streamline gym operations and enhance customer experience. The system consists of two main repositories:

- **`clubflow-api`** (Backend) - Django REST Framework API
- **`clubflow-web`** (Frontend) - React web application

### Primary Market
- **Location:** India (NCR Region - Delhi, Gurgaon, Noida)
- **Currency:** Indian Rupee (INR - ₹)
- **Payment Gateway:** Razorpay (UPI, Cards, Net Banking, Wallets)
- **Communication:** Email-first (WhatsApp in Phase 2)

### International Scalability
Built with multi-region expansion in mind:
- Multi-currency support (INR, USD, EUR, etc.)
- Payment gateway abstraction (Razorpay + Stripe)
- Multi-timezone ready
- Localization framework

---

## 🎯 **Key Architectural Decisions**

We made several important decisions to optimize for **cost, simplicity, and speed:**

### 1. **Custom CRM vs. HubSpot** ✅ Custom Django
**Decision:** Build custom CRM with Django instead of using HubSpot  
**Why:** 
- Save **₹20 lakhs over 5 years**
- 80% of features need to be custom anyway (memberships, classes, bookings)
- HubSpot can't handle gym-specific features
- Django Admin = free CRM interface for staff
- Own all customer data (no vendor lock-in)

### 2. **Authentication** ✅ Google OAuth
**Decision:** Use Google OAuth instead of custom email/password  
**Why:**
- Save **₹10-13 lakhs over 5 years**
- Better UX (one-click sign-in)
- More secure (Google's infrastructure, 2FA included)
- No password management headaches
- Save 2-3 weeks development time
- 90%+ users in India have Google accounts

### 3. **Payment Gateway** ✅ Razorpay (Primary)
**Decision:** Razorpay for India, Stripe for international  
**Why:**
- #1 payment gateway in India
- Native UPI support (60%+ of payments)
- Lower fees (2% vs 2.9%)
- GST-compliant invoicing
- Multi-currency architecture ready

### 4. **Communication** ✅ Email-First
**Decision:** Email only (MVP), WhatsApp in Phase 2  
**Why:**
- Save 2-3 weeks development time
- Email sufficient for MVP operations
- Add WhatsApp (critical for India) based on demand
- Lower initial costs

**Total Estimated Savings: ₹30-33 lakhs over 5 years!** 💰

📖 **[Read full decision rationale →](./ARCHITECTURE-DECISIONS.md)**

---

## 🏗️ Architecture

The system follows a **microservices architecture** with separated frontend and backend:

```
┌─────────────────────────────────────────────┐
│  React Web App (clubflow-web)               │
│  - Public marketing pages                   │
│  - Customer portal                          │
│  - Mobile-responsive                        │
└─────────────────┬───────────────────────────┘
                  │ REST API
                  │
┌─────────────────▼───────────────────────────┐
│  Django Backend (clubflow-api)              │
│  - REST API endpoints                       │
│  - Business logic                           │
│  - Django Admin (Staff CRM)                 │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│  PostgreSQL Database                        │
└─────────────────────────────────────────────┘
```

---

## 📚 Documentation

This repository contains the **planning and architecture documents**:

1. **[architecture.md](./architecture.md)** - Overall system architecture, tech stack, and design principles
2. **[backend-plan.md](./backend-plan.md)** - Backend implementation plan for Django team
3. **[frontend-plan.md](./frontend-plan.md)** - Frontend implementation plan for React team
4. **[ARCHITECTURE-DECISIONS.md](./ARCHITECTURE-DECISIONS.md)** - ⭐ **Key decisions explained** (Custom CRM vs HubSpot, Google OAuth, etc.)
5. **[PYTHON-VERSION.md](./PYTHON-VERSION.md)** - Python 3.13 specification
6. **[INDIA-SETUP-GUIDE.md](./INDIA-SETUP-GUIDE.md)** - India-specific setup (Razorpay, GST, etc.)
7. **[CHANGELOG.md](./CHANGELOG.md)** - Version history and updates

---

## ✨ Core Features

### For Customers:
- 🔐 **One-click sign-in with Google** (no passwords!)
- 🏋️ Browse classes and trainers
- 📅 Book classes with real-time availability
- 💳 Manage memberships and payments
- 🎫 Purchase day passes (non-member access) - Phase 2
- 📱 Digital membership card (QR code)
- 👤 Profile and account management
- 📊 View booking history and invoices

### For Staff (Django Admin):
- 👥 **Customer CRM** (leads, members, notes)
- 🎟️ **Membership management** (plans, renewals, cancellations)
- 📆 **Class scheduling** (recurring classes, capacity management)
- 💰 **Billing & invoicing** (automatic invoicing, Razorpay integration, GST-compliant)
- 📧 **Email marketing** (campaigns, newsletters)
- 📈 **Analytics & reporting** (revenue, attendance, retention)
- ✅ **Check-in system** (QR code scanning)
- 🏢 **Facility management** (equipment, lockers)

---

## 🛠️ Technology Stack

### Backend (`clubflow-api`)
- **Framework**: Django 5.1+ with Django REST Framework
- **Python**: 3.13 (recommended), 3.12+ (minimum)
- **Database**: PostgreSQL 15+
- **Cache/Queue**: Redis + Celery
- **Authentication**: Google OAuth (django-allauth) + JWT for API
- **Payments**: Razorpay (Primary - India), Stripe (International)
- **Email**: SendGrid (Transactional emails - MVP)
- **SMS & WhatsApp**: Twilio (Phase 2)
- **Storage**: AWS S3
- **Tax**: GST-compliant invoicing

### Frontend (`clubflow-web`)
- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: Zustand + React Query
- **Routing**: React Router v6
- **Forms**: React Hook Form + Zod
- **Payments**: Razorpay.js (Primary), Stripe.js (International)

### Future
- **Mobile Apps**: React Native (iOS & Android)

---

## 📁 Repository Structure

**This repo contains planning documents only.** The actual code will be in separate repositories:

```
GymWebSite/                    # This repo (planning)
├── architecture.md            # ✅ Overall architecture
├── backend-plan.md            # ✅ Backend implementation plan
├── frontend-plan.md           # ✅ Frontend implementation plan
└── README.md                  # ✅ This file

clubflow-api/                  # Backend repository (to be created)
├── apps/                      # Django applications
├── config/                    # Project configuration
├── requirements/              # Python dependencies
└── ...

clubflow-web/                  # Frontend repository (to be created)
├── src/                       # React application
│   ├── api/                   # API client
│   ├── components/            # React components
│   ├── pages/                 # Page components
│   └── ...
└── ...
```

---

## 🚀 Getting Started

### Prerequisites
- Python 3.13 (recommended), 3.12+ (minimum)
- Node.js 20+
- PostgreSQL 15+
- Redis 7+
- Git

### Next Steps

1. **Review planning documents**:
   - Read `architecture.md` for system overview
   - Backend team reads `backend-plan.md`
   - Frontend team reads `frontend-plan.md`

2. **Create separate repositories**:
   ```bash
   # Backend repository
   mkdir clubflow-api
   cd clubflow-api
   git init
   
   # Frontend repository
   mkdir clubflow-web
   cd clubflow-web
   git init
   ```

3. **Set up development environments**:
   - Backend: Follow backend-plan.md Phase 1
   - Frontend: Follow frontend-plan.md Phase 1

4. **API Contract**:
   - Backend team implements API endpoints
   - Generate OpenAPI/Swagger documentation
   - Frontend team integrates with API

5. **Weekly syncs**:
   - Backend + Frontend teams sync on API changes
   - Review progress and blockers
   - Update planning documents as needed

---

## 📅 Development Timeline

### MVP (Months 1-3)
- Core CRM & membership management
- Class scheduling & booking
- Invoicing & payments (Razorpay + UPI)
- GST-compliant invoicing
- Transactional emails (SendGrid)
- Customer portal
- Django Admin (staff portal)
- INR currency support

### Enhancement (Months 4-6)
- Day passes (non-member access)
- Personal training bookings
- Email marketing campaigns
- **WhatsApp notifications** (critical for India - 90%+ penetration)
- SMS notifications (opt-in)
- Advanced reporting & analytics
- Check-in system (QR code)
- Equipment & locker management
- Multi-currency support (for expansion)

### Mobile (Months 7-9)
- React Native iOS app
- React Native Android app
- Push notifications
- Mobile check-in

### Advanced (Months 10-12)
- Analytics dashboard
- Marketing automation
- Multi-location support
- Franchise features

---

## 🎯 Success Metrics

### Technical
- API response time < 200ms (p95)
- Page load < 2s
- 99.9% uptime
- 80%+ test coverage

### Business
- Member sign-up rate
- Class booking rate
- Member retention rate
- Customer satisfaction score

---

## 🔒 Security

- JWT token authentication
- HTTPS/TLS encryption
- PCI DSS compliance (Razorpay/Stripe handle card data)
- Data privacy (IT Act 2000, DPDP Act 2023 for India)
- GDPR & CCPA ready (for international expansion)
- Rate limiting & DDoS protection
- Regular security audits

---

## 📞 Contact & Support

- **Project Manager**: pm@clubflow.com
- **Backend Team**: backend-team@clubflow.com
- **Frontend Team**: frontend-team@clubflow.com
- **DevOps Team**: devops@clubflow.com

---

## 📄 License

[Choose appropriate license: MIT, Apache 2.0, etc.]

---

## 🙏 Acknowledgments

- Django & Django REST Framework teams
- React & Vite teams
- Razorpay for payment processing (India)
- Stripe for international payments
- SendGrid for email delivery
- Twilio for SMS & WhatsApp
- All open-source contributors

---

**Built with ❤️ by the ClubFlow Team**

