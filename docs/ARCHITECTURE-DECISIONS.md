# ClubFlow - Architecture Decisions Record (ADR)

**Last Updated:** January 2, 2026

---

## ADR-001: Custom CRM vs. HubSpot Integration

**Status:** ✅ DECIDED  
**Decision:** Build Custom CRM with Django  
**Date:** January 2, 2026

### Context

We evaluated two approaches for the CRM and customer management system:

**Option A:** HubSpot CRM + Custom Orchestration Layer  
**Option B:** Custom Django CRM + Smart Integrations

### Decision

**We chose Option B: Custom Django CRM** ✅

### Rationale

#### 1. **Cost Comparison (5 Years)**

| Approach | Year 1 | Years 2-5 | Total (5 years) |
|----------|--------|-----------|-----------------|
| **HubSpot + Custom** | ₹6,00,000 | ₹5,00,000/year | **₹26,00,000** |
| **Custom Solution** | ₹1,50,000 | ₹1,20,000/year | **₹6,30,000** |
| **Savings** | - | - | **₹19,70,000** |

**Savings: ₹20 lakhs over 5 years!**

#### 2. **Gym-Specific Requirements**

**What HubSpot CAN do (20%):**
- ✅ Lead management
- ✅ Contact management
- ✅ Email campaigns
- ✅ Sales pipeline

**What HubSpot CANNOT do (80%):**
- ❌ Membership management (active, frozen, expired)
- ❌ Class schedules (yoga, spin, etc.)
- ❌ Class bookings (capacity, waitlists)
- ❌ Attendance tracking / check-ins
- ❌ Day passes
- ❌ Trainer schedules
- ❌ Equipment tracking
- ❌ Locker assignments
- ❌ GST-compliant invoices (India)
- ❌ Razorpay payment integration

**Reality:** We'd need to build 80% custom anyway!

#### 3. **Complexity Comparison**

**With HubSpot:**
```
HubSpot (Contacts, Leads, Campaigns)
     +
Custom Database (Memberships, Classes, Bookings, Payments)
     =
TWO SOURCES OF TRUTH (nightmare!)

Every operation requires:
1. Query HubSpot API (slow, rate limits)
2. Query custom database
3. Sync data between systems
4. Handle sync failures
5. Reconcile conflicts
```

**With Custom Django:**
```
Single PostgreSQL Database (Everything)
     =
ONE SOURCE OF TRUTH (simple!)

Every operation:
1. Query database (fast, no limits)
Done!
```

#### 4. **Performance Comparison**

| Factor | HubSpot | Custom Django |
|--------|---------|---------------|
| **Latency** | 200-500ms (US servers) | 10-50ms (India hosting) |
| **Rate Limits** | 100 calls per 10 seconds | Unlimited |
| **Real-time** | Not possible | Yes |
| **Complex Queries** | Limited | Full SQL power |

#### 5. **India Market Considerations**

**HubSpot Issues:**
- Pricing in USD (expensive for India)
- Servers in US (high latency)
- No native Razorpay integration
- No GST compliance features
- No UPI payment support

**Custom Django Advantages:**
- Host in Mumbai/Bangalore (low latency)
- INR currency native
- Razorpay integration built-in
- GST-compliant invoicing
- UPI payment support

### Consequences

#### Positive:
- ✅ Save ₹20 lakhs over 5 years
- ✅ Complete control over features
- ✅ Better performance (lower latency)
- ✅ One source of truth (simpler)
- ✅ No vendor lock-in
- ✅ Own all customer data
- ✅ Gym-specific features perfectly tailored
- ✅ Django Admin = free CRM interface

#### Negative:
- ❌ More code to write (but Django Admin makes it easy)
- ❌ Need to build email marketing (Phase 2)
- ❌ Responsible for maintenance (but have full control)

### Implementation

**Custom CRM includes:**
- Django models for all gym entities
- Django Admin (customized for gym staff)
- PostgreSQL database (all data)
- REST API for frontend
- Email campaigns (Phase 2)

**Smart integrations:**
- Google OAuth (authentication)
- Razorpay (payments)
- SendGrid (email)
- Twilio (WhatsApp/SMS - Phase 2)

---

## ADR-002: Google OAuth vs. Custom Authentication

**Status:** ✅ DECIDED  
**Decision:** Use Google OAuth  
**Date:** January 2, 2026

### Context

We evaluated two approaches for user authentication:

**Option A:** Custom email/password authentication  
**Option B:** Google OAuth (Social Login)

### Decision

**We chose Option B: Google OAuth** ✅

### Rationale

#### 1. **Development Time Savings**

**Custom Auth requires building:**
- Registration flow (3-4 days)
- Login flow (2-3 days)
- Forgot password flow (2-3 days)
- Reset password flow (2-3 days)
- Email verification (1-2 days)
- Password security (2-3 days)
- Testing (2-3 days)
- **Total: 14-21 days (2-3 weeks)**

**Google OAuth requires:**
- Install django-allauth (1 hour)
- Configure Google OAuth (2 hours)
- Update frontend (4 hours)
- **Total: 1 day** ✅

**Time saved: 13-20 days** (₹6,50,000 - ₹10,00,000 at ₹50K/day)

#### 2. **User Experience**

**Custom Auth Flow:**
```
1. Click "Sign Up"
2. Fill form (email, password, name, phone)
3. Create password (meet complexity requirements)
4. Verify email (check inbox, click link)
5. Login with email/password
6. Remember password or use "forgot password" flow

Total: 5-6 steps, 2-3 minutes
```

**Google OAuth Flow:**
```
1. Click "Sign in with Google"
2. Select Google account (or sign in)
3. Authorize access

Total: 3 clicks, 10-20 seconds ✅
```

#### 3. **Security Comparison**

| Aspect | Custom Auth | Google OAuth |
|--------|-------------|--------------|
| **Password Storage** | Your responsibility (hashing, salting) | No passwords stored |
| **Password Breaches** | Your liability if leaked | Not applicable |
| **2FA** | Must implement (~1 week) | Included free |
| **Security Updates** | Must maintain | Google handles |
| **Phishing Risk** | Users might reuse passwords | Lower (OAuth tokens) |
| **Account Recovery** | Build forgot password flow | Google handles |
| **Trust** | User must trust new platform | Users trust Google |

#### 4. **Cost Comparison**

**Initial Development:**
- Custom Auth: ₹7,00,000 - ₹10,00,000 (2-3 weeks)
- Google OAuth: ₹50,000 (1 day)
- **Savings: ₹6,50,000 - ₹9,50,000** ✅

**Annual Maintenance:**
- Custom Auth: ₹1,20,000/year (security, bugs, features)
- Google OAuth: ₹20,000/year (minimal maintenance)
- **Savings: ₹1,00,000/year** ✅

**5-Year Total:**
- Custom Auth: ₹11,00,000 - ₹14,00,000
- Google OAuth: ₹1,30,000
- **Savings: ₹9,70,000 - ₹12,70,000** ✅

#### 5. **India Market Considerations**

**Why Google OAuth is perfect for India:**
- 90%+ smartphone users have Google accounts (Android dominance)
- Gmail is the #1 email provider in India
- Users already trust Google
- No need to remember another password
- 2FA through Google account (free)
- Same Google account for web and mobile apps

#### 6. **Mobile App Ready**

**Future Mobile Apps:**
- Same Google OAuth flow works on iOS and Android
- Users sign in with same Google account
- No separate mobile auth implementation needed
- Seamless experience across platforms

### Consequences

#### Positive:
- ✅ Save ₹10-13 lakhs over 5 years
- ✅ Better UX (one-click sign-in)
- ✅ More secure (Google's infrastructure)
- ✅ No password management headaches
- ✅ 2FA included free
- ✅ Mobile-ready
- ✅ Faster development (2-3 weeks saved)
- ✅ Lower maintenance burden

#### Negative:
- ❌ Dependency on Google (but Google is reliable)
- ❌ Users without Google accounts excluded (< 5% in India)
- ❌ Slight vendor lock-in (but easy to add email auth later if needed)

### Implementation

**Backend:**
```python
# Install
pip install django-allauth

# Configure
INSTALLED_APPS += [
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'allauth.socialaccount.providers.google',
]

# Google OAuth credentials
SOCIALACCOUNT_PROVIDERS = {
    'google': {
        'APP': {
            'client_id': env('GOOGLE_OAUTH_CLIENT_ID'),
            'secret': env('GOOGLE_OAUTH_CLIENT_SECRET'),
        }
    }
}
```

**Frontend:**
```typescript
// Install
npm install @react-oauth/google

// Use
import { GoogleLogin } from '@react-oauth/google';

<GoogleLogin
  onSuccess={handleGoogleSuccess}
  onError={handleGoogleError}
/>
```

**Google Cloud Console:**
1. Create project at console.cloud.google.com
2. Enable Google+ API
3. Create OAuth 2.0 credentials
4. Add authorized redirect URIs
5. Copy Client ID and Secret

---

## ADR-003: Razorpay vs. Stripe for India Market

**Status:** ✅ DECIDED  
**Decision:** Razorpay (Primary), Stripe (International)  
**Date:** January 2, 2026

### Context

Need payment gateway for Indian gym business with future international expansion.

### Decision

**Primary:** Razorpay (for India market)  
**Alternative:** Stripe (for international expansion)  
**Architecture:** Payment gateway abstraction layer

### Rationale

#### Razorpay Advantages for India:
- #1 payment gateway in India
- Native UPI support (60%+ of digital payments)
- Supports all Indian payment methods (net banking, wallets)
- Lower fees (2% vs 2.9% Stripe international)
- GST-compliant invoicing
- INR currency native
- Faster settlements (T+1)
- Better support for Indian banks
- Local infrastructure (lower latency)

#### Payment Gateway Abstraction:
```python
def get_payment_gateway(currency):
    if currency == 'INR':
        return RazorpayGateway()
    else:
        return StripeGateway()
```

### Consequences

**Positive:**
- ✅ Best payment methods for India (UPI, net banking, wallets)
- ✅ Lower costs
- ✅ Better user experience for Indian customers
- ✅ Ready for international expansion (Stripe as fallback)
- ✅ Multi-currency support from day 1

**Negative:**
- ❌ Need to integrate two payment gateways (but abstraction layer makes this manageable)

---

## ADR-004: Email-First Communication Strategy

**Status:** ✅ DECIDED  
**Decision:** Email only (MVP), WhatsApp (Phase 2)  
**Date:** January 2, 2026

### Context

Need communication strategy for customer notifications.

### Decision

**MVP (Phase 1):** Email only (transactional)  
**Phase 2 (Month 4-6):** Add WhatsApp + SMS  

### Rationale

#### Why Email-First:
- Simpler implementation (SendGrid integration: 1 day)
- Lower costs (free tier sufficient for MVP)
- Reliable delivery
- No complex BSP integrations initially
- Customers can check website/portal for details
- Saves 2-3 weeks development time

#### Why Add WhatsApp in Phase 2:
- 90%+ penetration in India
- Higher engagement than SMS (70% vs 20% open rates)
- Lower cost than SMS (₹0.35 vs ₹0.50-0.70 per message)
- Rich media support
- Two-way conversations
- **But not critical for MVP** - add based on customer demand

### Consequences

**Positive:**
- ✅ Faster MVP launch (save 2-3 weeks)
- ✅ Lower initial costs
- ✅ Simpler architecture
- ✅ Can add WhatsApp/SMS later based on demand

**Negative:**
- ❌ No SMS/WhatsApp notifications initially (but email sufficient for MVP)

---

## Summary of Decisions

| Decision | Choice | Rationale | Savings |
|----------|--------|-----------|---------|
| **CRM** | Custom Django | Gym-specific, lower cost | ₹20 lakhs/5 years |
| **Authentication** | Google OAuth | Better UX, more secure | ₹10-13 lakhs/5 years |
| **Payment (India)** | Razorpay | Best for India market | Lower fees |
| **Payment (International)** | Stripe | International expansion | Multi-currency ready |
| **Communication (MVP)** | Email only | Faster MVP launch | 2-3 weeks saved |
| **Communication (Phase 2)** | WhatsApp + SMS | Critical for India | Based on demand |

**Total Estimated Savings:** ₹30-33 lakhs over 5 years

---

## Architecture Overview

```
┌──────────────────────────────────────────┐
│  React Frontend (clubflow-web)           │
│  - Google OAuth login                    │
│  - Responsive design                     │
└──────────────┬───────────────────────────┘
               │ REST API
               │
┌──────────────▼───────────────────────────┐
│  Django Backend (clubflow-api)           │
│  ✅ Custom CRM (Django Admin)           │
│  ✅ Google OAuth (django-allauth)       │
│  ✅ Gym-specific models                 │
│  ✅ Business logic                       │
│  ✅ JWT tokens for API                  │
└──┬────────┬─────────┬────────────────────┘
   │        │         │
   ▼        ▼         ▼
PostgreSQL Razorpay SendGrid
(All data) (Payment) (Email)
   ▲
   │
Google OAuth
(Auth only)
```

**Key Principles:**
1. **Own your data** (PostgreSQL, not HubSpot)
2. **Integrate smartly** (Google, Razorpay, SendGrid)
3. **Keep it simple** (one database, one source of truth)
4. **Build what matters** (gym features, not auth/payments)
5. **Scale when needed** (add WhatsApp/SMS in Phase 2)

---

**Document maintained by:** ClubFlow Architecture Team  
**Last reviewed:** January 2, 2026  
**Next review:** After Phase 1 completion (Month 3)

