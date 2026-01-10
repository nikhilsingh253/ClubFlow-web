# ClubFlow - Quick Start Guide

**Welcome to ClubFlow!** 🎉  
**Last Updated:** January 2, 2026

This guide will help you understand the key decisions and get started quickly.

---

## 🎯 **What is ClubFlow?**

ClubFlow is a complete gym management system for your health club in NCR (Delhi, Gurgaon, Noida, India).

**What it includes:**
- ✅ Customer CRM (manage members, leads, notes)
- ✅ Membership management (plans, renewals, cancellations)
- ✅ Class scheduling & booking (yoga, spin, etc.)
- ✅ Payment processing (Razorpay - UPI, cards, net banking)
- ✅ GST-compliant invoicing
- ✅ Email notifications
- ✅ Digital membership cards (QR code)
- ✅ Customer portal (web-based)
- ✅ Staff CRM (Django Admin)

---

## 💡 **Key Architectural Decisions (Important!)**

We made 4 critical decisions to save **₹30-33 lakhs over 5 years**:

### 1. ✅ **Custom CRM (NOT HubSpot)**

**Decision:** Build our own CRM with Django

**Why:**
- HubSpot costs **₹42,000/month** (₹5,04,000/year)
- HubSpot can't do 80% of what we need (memberships, classes, bookings)
- Custom solution costs **₹8,500/month** (₹1,02,000/year)
- **Save: ₹20 lakhs over 5 years**
- Django Admin = free CRM interface
- Own all customer data

**Bottom line:** We build everything ourselves. No HubSpot.

---

### 2. ✅ **Google OAuth (NOT email/password)**

**Decision:** Users sign in with Google

**Why:**
- No need to build registration/login/forgot password flows
- **Save 2-3 weeks development** (₹7-10 lakhs)
- Better UX (one-click sign-in)
- More secure (Google handles security, 2FA included)
- 90%+ users in India have Google accounts
- No password management headaches
- **Save: ₹10-13 lakhs over 5 years**

**Bottom line:** Just a "Sign in with Google" button. That's it.

---

### 3. ✅ **Razorpay (NOT Stripe alone)**

**Decision:** Razorpay for India, Stripe for international

**Why:**
- #1 payment gateway in India
- Native UPI support (60%+ of Indian payments)
- Cards, net banking, wallets all supported
- Lower fees (2% vs 2.9%)
- GST-compliant invoicing
- Built for Indian market

**Bottom line:** Perfect for India, ready for international expansion.

---

### 4. ✅ **Email-First (WhatsApp Phase 2)**

**Decision:** Email only in MVP, add WhatsApp later

**Why:**
- Email sufficient for MVP operations
- **Save 2-3 weeks development**
- Lower initial costs (SendGrid free tier)
- Add WhatsApp (critical for India) in Phase 2 based on demand

**Bottom line:** Start simple, add complexity when needed.

---

## 🏗️ **System Architecture**

```
User (Customer/Staff)
        ↓
    Google Sign-In
        ↓
React Web App (clubflow-web)
        ↓
    REST API
        ↓
Django Backend (clubflow-api)
├── Custom CRM (Django Admin)
├── Memberships, Classes, Bookings
├── Business Logic
└── JWT Tokens
        ↓
┌───────┴────────┬─────────────┐
│                │             │
PostgreSQL    Razorpay    SendGrid
(All data)    (Payment)   (Email)
```

**Simple, powerful, cost-effective!**

---

## 📦 **Technology Stack**

### **Backend:**
- Django 5.1+ (Python 3.13)
- PostgreSQL 15+
- Google OAuth (django-allauth)
- Razorpay SDK
- SendGrid
- Redis + Celery

### **Frontend:**
- React 18+ (TypeScript)
- Google OAuth (@react-oauth/google)
- Razorpay.js
- Tailwind CSS
- React Router

---

## 🚀 **Quick Setup**

### **Prerequisites:**
```bash
# Backend
Python 3.13
PostgreSQL 15+
Redis 7+

# Frontend
Node.js 20+

# Accounts needed:
Google Cloud Console (OAuth credentials)
Razorpay account (payment gateway)
SendGrid account (email)
```

### **Backend Setup:**

1. **Clone and create virtual environment:**
```bash
mkdir clubflow-api
cd clubflow-api
python3.13 -m venv venv
source venv/bin/activate  # macOS/Linux
```

2. **Install Django:**
```bash
pip install Django==5.1.3
pip install djangorestframework
pip install django-allauth
pip install razorpay
pip install sendgrid
```

3. **Create environment file:**
```bash
# .env
GOOGLE_OAUTH_CLIENT_ID=your-id.apps.googleusercontent.com
GOOGLE_OAUTH_CLIENT_SECRET=your-secret
RAZORPAY_KEY_ID=rzp_test_xxx
RAZORPAY_KEY_SECRET=xxx
SENDGRID_API_KEY=SG.xxx
```

4. **Start development:**
```bash
python manage.py runserver
```

### **Frontend Setup:**

1. **Create React app:**
```bash
npm create vite@latest clubflow-web -- --template react-ts
cd clubflow-web
```

2. **Install dependencies:**
```bash
npm install @react-oauth/google
npm install @tanstack/react-query
npm install zustand
npm install axios
npm install react-router-dom
npm install tailwindcss
```

3. **Create environment file:**
```bash
# .env.local
VITE_GOOGLE_CLIENT_ID=your-id.apps.googleusercontent.com
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_RAZORPAY_KEY_ID=rzp_test_xxx
```

4. **Start development:**
```bash
npm run dev
```

---

## 📖 **Documentation**

### **Essential Reading:**

1. **[README.md](./README.md)** - Project overview
2. **[ARCHITECTURE-DECISIONS.md](./ARCHITECTURE-DECISIONS.md)** - ⭐ **WHY we made these choices**
3. **[architecture.md](./architecture.md)** - Complete system architecture
4. **[backend-plan.md](./backend-plan.md)** - Django implementation (18-week roadmap)
5. **[frontend-plan.md](./frontend-plan.md)** - React implementation (16-week roadmap)

### **Supplementary:**

6. **[PYTHON-VERSION.md](./PYTHON-VERSION.md)** - Python 3.13 specification
7. **[INDIA-SETUP-GUIDE.md](./INDIA-SETUP-GUIDE.md)** - Razorpay, GST, India-specific setup
8. **[CHANGELOG.md](./CHANGELOG.md)** - Version history

---

## 🎓 **Learning Path**

### **For Backend Developers:**

1. Read [ARCHITECTURE-DECISIONS.md](./ARCHITECTURE-DECISIONS.md) - understand WHY
2. Read [backend-plan.md](./backend-plan.md) - understand HOW
3. Set up Google OAuth credentials
4. Set up Razorpay test account
5. Start with Phase 1 (Week 1-2): Project setup

### **For Frontend Developers:**

1. Read [ARCHITECTURE-DECISIONS.md](./ARCHITECTURE-DECISIONS.md) - understand WHY
2. Read [frontend-plan.md](./frontend-plan.md) - understand HOW
3. Set up Google OAuth credentials
4. Install @react-oauth/google
5. Start with Phase 1 (Week 1): Project setup

---

## 🔑 **Getting Credentials**

### **Google OAuth (Required for both teams):**

1. Go to: https://console.cloud.google.com/
2. Create project: "ClubFlow"
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:8000/accounts/google/login/callback/` (backend)
   - `http://localhost:3000` (frontend)
6. Copy Client ID and Client Secret

### **Razorpay (Backend team):**

1. Go to: https://razorpay.com
2. Sign up
3. Complete KYC
4. Get test API keys
5. Copy Key ID and Key Secret

### **SendGrid (Backend team):**

1. Go to: https://sendgrid.com
2. Sign up
3. Verify domain (clubflow.com)
4. Create API key
5. Copy API key

---

## 📝 **Development Timeline**

### **MVP (Months 1-3):**
- Week 1-2: Setup
- Week 3-4: Customer & Membership models
- Week 5-6: Class scheduling & booking
- Week 7-8: Billing & payments (Razorpay)
- Week 9-10: Operations (check-ins, trainers)
- Week 11-12: Communications (email)

### **Phase 2 (Months 4-6):**
- Day passes
- Personal training
- WhatsApp notifications
- Email marketing
- Advanced analytics

---

## 💰 **Cost Breakdown**

### **MVP (Months 1-3):**
- Development: ₹7,50,000 - ₹10,00,000 (2-3 developers, 3 months)
- Hosting: ₹5,000/month
- SendGrid: Free (100 emails/day)
- Razorpay: 2% per transaction
- **Total: ₹7,50,000 - ₹10,00,000 initial + ₹5,000/month**

### **Operating Costs (Monthly):**
- Hosting: ₹5,000
- Email: ₹1,500 (if exceed free tier)
- Razorpay: 2% of revenue
- **Total: ~₹6,500/month + transaction fees**

### **Avoided Costs:**
- HubSpot: ₹42,000/month (AVOIDED ✅)
- Custom auth development: ₹7-10 lakhs (AVOIDED ✅)
- **Savings: ₹30-33 lakhs over 5 years**

---

## ✅ **Checklist Before Starting**

### **Business:**
- [ ] Company registered (Pvt Ltd / LLP)
- [ ] PAN card for company
- [ ] GSTIN registered
- [ ] Current bank account opened
- [ ] Domain registered (clubflow.com or your choice)

### **Development:**
- [ ] Google Cloud Console project created
- [ ] Google OAuth credentials obtained
- [ ] Razorpay test account created
- [ ] SendGrid account created
- [ ] Git repositories created (clubflow-api, clubflow-web)
- [ ] Development environments set up (Python 3.13, Node.js 20)
- [ ] PostgreSQL installed
- [ ] Redis installed

### **Team:**
- [ ] Backend developer(s) assigned
- [ ] Frontend developer(s) assigned
- [ ] Weekly sync meetings scheduled
- [ ] Documentation reviewed by all

---

## 🆘 **Need Help?**

### **Technical Questions:**
- Backend: backend-team@clubflow.com
- Frontend: frontend-team@clubflow.com
- DevOps: devops@clubflow.com

### **Business Questions:**
- General: business@clubflow.com
- Payments: finance@clubflow.com

### **Documentation Issues:**
- Create issue in project repository
- Email: docs@clubflow.com

---

## 🎉 **You're Ready!**

You now understand:
- ✅ Why we chose custom CRM over HubSpot
- ✅ Why we chose Google OAuth over custom auth
- ✅ Why we chose Razorpay for India
- ✅ Why we start with email and add WhatsApp later
- ✅ How the system architecture works
- ✅ What technologies we're using
- ✅ How to get started

**Next steps:**
1. Read [ARCHITECTURE-DECISIONS.md](./ARCHITECTURE-DECISIONS.md) for full context
2. Read [backend-plan.md](./backend-plan.md) OR [frontend-plan.md](./frontend-plan.md) based on your role
3. Set up credentials (Google OAuth, Razorpay, SendGrid)
4. Start Phase 1 development!

**Let's build ClubFlow!** 🚀💪

---

**Document Version:** 1.0  
**Last Updated:** January 2, 2026  
**Status:** Ready to Start Development ✅

