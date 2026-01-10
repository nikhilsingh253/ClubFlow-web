# ClubFlow - India Market Setup Guide

**Target Market:** NCR Region (Delhi, Gurgaon, Noida)  
**Last Updated:** January 2, 2026

---

## 🇮🇳 India-Specific Requirements

### 1. Payment Gateway: Razorpay

**Why Razorpay:**
- #1 payment gateway in India
- Native UPI support (60%+ of digital payments)
- Support for all Indian payment methods
- GST-compliant invoicing
- Lower fees than international gateways
- Faster settlement (T+1 days)

**Setup Steps:**
1. Create account: https://razorpay.com
2. Complete KYC (Aadhaar/PAN, Bank Account, Business docs)
3. Get API keys (Test + Live)
4. Set up webhook URL
5. Enable required payment methods:
   - UPI (PhonePe, Google Pay, Paytm, BHIM)
   - Cards (Visa, Mastercard, RuPay)
   - Net Banking (all major banks)
   - Wallets (Paytm, PhonePe, Amazon Pay)

**Configuration:**
```python
# settings/production.py
RAZORPAY_KEY_ID = env('RAZORPAY_KEY_ID')  # rzp_live_xxxxx
RAZORPAY_KEY_SECRET = env('RAZORPAY_KEY_SECRET')
RAZORPAY_WEBHOOK_SECRET = env('RAZORPAY_WEBHOOK_SECRET')
```

**Test Credentials:**
```
Test Key ID: rzp_test_xxxxx
Test Secret: xxxxx

Test Cards:
- Success: 4111 1111 1111 1111
- Failure: 4111 1111 1111 1112

Test UPI: success@razorpay
```

---

### 2. GST Compliance

**GST Rate for Gym Services:** 18%
- **Intra-State:** 9% CGST + 9% SGST
- **Inter-State:** 18% IGST

**HSN/SAC Code:** 999293 (Health club and fitness services)

**GSTIN Registration:**
1. Register for GSTIN: https://www.gst.gov.in/
2. Add GSTIN to invoices
3. File monthly/quarterly returns (GSTR-1, GSTR-3B)

**Invoice Requirements:**
- GSTIN of supplier (your gym)
- GSTIN of customer (if B2B)
- HSN/SAC code
- CGST/SGST/IGST breakdown
- Total amount (including GST)

**Example Invoice:**
```
Membership Plan: Premium Monthly
Base Price: ₹4,237.29
CGST (9%): ₹381.36
SGST (9%): ₹381.36
----------------
Total: ₹5,000.00
```

---

### 3. Currency & Pricing

**Currency:** Indian Rupee (INR - ₹)

**Pricing Examples:**
```
Basic Membership:
- Monthly: ₹2,499
- Quarterly: ₹6,999 (save ₹500)
- Annual: ₹24,999 (save ₹4,989)

Premium Membership:
- Monthly: ₹4,999
- Quarterly: ₹13,999 (save ₹1,000)
- Annual: ₹49,999 (save ₹9,989)

VIP Membership:
- Monthly: ₹9,999
- Quarterly: ₹27,999 (save ₹2,000)
- Annual: ₹99,999 (save ₹19,989)

Day Pass: ₹999
```

**Database Configuration:**
```python
# All amounts stored with currency
class MembershipPlan:
    price = DecimalField(max_digits=10, decimal_places=2)
    currency = CharField(default='INR')
```

---

### 4. Communication Strategy

### MVP (Phase 1): Email Only

**Why Email-First:**
- Simple, reliable, cost-effective
- No complex BSP integrations initially
- SendGrid free tier: 100 emails/day
- Customers can check portal for details

**Transactional Emails:**
```python
from django.core.mail import send_mail

# Welcome email
subject = 'Welcome to ClubFlow!'
send_mail(subject, message, 'noreply@clubflow.com', [customer.email])

# Booking confirmation
subject = f'Class Booked: {class_schedule.class_type.name}'
send_mail(subject, message, 'noreply@clubflow.com', [customer.email])

# Payment receipt
subject = f'Payment Receipt - Invoice #{invoice.invoice_number}'
send_mail(subject, message, 'noreply@clubflow.com', [customer.email])
```

**SendGrid Setup:**
1. Create account: https://sendgrid.com
2. Verify domain (clubflow.com)
3. Create API key
4. Set up sender authentication

**Configuration:**
```python
# settings/production.py
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.sendgrid.net'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'apikey'
EMAIL_HOST_PASSWORD = env('SENDGRID_API_KEY')
DEFAULT_FROM_EMAIL = 'noreply@clubflow.com'
```

---

### Phase 2 (Month 4-6): WhatsApp + SMS

**Why WhatsApp for India:**
- 90%+ penetration in India
- Higher engagement than SMS (70% vs 20% open rates)
- Lower cost (₹0.35 vs ₹0.50-0.70 per message)
- Rich media support
- Two-way conversations

**Twilio WhatsApp Setup:**
1. Create Twilio account: https://www.twilio.com
2. Request WhatsApp Business API access
3. Get approved WhatsApp number (+91 number preferred)
4. Create message templates (required for marketing)
5. Get them approved by WhatsApp

**Message Templates (Examples):**
```
Template: booking_confirmation
Category: UTILITY (transactional)

Hi {{1}}, your class booking is confirmed!
Class: {{2}}
Date: {{3}} at {{4}}
Location: {{5}}

See you there! 🏋️
```

```
Template: membership_expiring
Category: UTILITY (transactional)

Hi {{1}}, your {{2}} membership expires on {{3}}.
Renew now: {{4}}
```

**Configuration:**
```python
# settings/production.py
TWILIO_ACCOUNT_SID = env('TWILIO_ACCOUNT_SID')
TWILIO_AUTH_TOKEN = env('TWILIO_AUTH_TOKEN')
TWILIO_PHONE_NUMBER = env('TWILIO_PHONE_NUMBER')  # +919876543210
TWILIO_WHATSAPP_NUMBER = env('TWILIO_WHATSAPP_NUMBER')  # whatsapp:+919876543210
```

**Implementation:**
```python
from twilio.rest import Client

client = Client(account_sid, auth_token)

# WhatsApp message
message = client.messages.create(
    body='Your class booking is confirmed!',
    from_='whatsapp:+919876543210',
    to='whatsapp:+919876543210'
)
```

**Costs (Approximate):**
- SMS: ₹0.50-0.70 per message
- WhatsApp: ₹0.35-0.50 per message
- Email: ~Free (SendGrid free tier sufficient)

---

### 5. Phone Numbers

**Format:** +91 XXXXX XXXXX

**Validation:**
```python
from phonenumbers import parse, is_valid_number, format_number, PhoneNumberFormat

phone = parse('+919876543210', 'IN')
is_valid = is_valid_number(phone)  # True
formatted = format_number(phone, PhoneNumberFormat.NATIONAL)  # '98765 43210'
```

**Database Field:**
```python
from phonenumber_field.modelfields import PhoneNumberField

class User(AbstractBaseUser):
    phone_number = PhoneNumberField(region='IN')
```

---

### 6. Timezone

**India Timezone:** Asia/Kolkata (IST - UTC+5:30)

**Configuration:**
```python
# settings/base.py
TIME_ZONE = 'Asia/Kolkata'
USE_TZ = True  # Always store in UTC, display in local time
```

**Usage:**
```python
from django.utils import timezone
import pytz

# Current time in UTC
utc_now = timezone.now()

# Convert to IST
ist = pytz.timezone('Asia/Kolkata')
ist_now = utc_now.astimezone(ist)
```

---

### 7. Language & Localization

**Phase 1:** English only

**Phase 2:** Add Hindi support
```python
# settings/base.py
LANGUAGES = [
    ('en', 'English'),
    ('hi', 'Hindi'),  # Phase 2
]

LANGUAGE_CODE = 'en'
```

**Date/Time Formats:**
```python
# Indian format: DD/MM/YYYY
DATE_FORMAT = 'd/m/Y'
SHORT_DATE_FORMAT = 'd/m/y'
DATETIME_FORMAT = 'd/m/Y H:i'

# Examples:
# 02/01/2026 (not 01/02/2026)
# 14:30 (24-hour format)
```

**Number Formats:**
```python
# Indian numbering system
# 1,00,000 (one lakh) not 100,000
# 10,00,000 (ten lakh) not 1,000,000
# 1,00,00,000 (one crore) not 10,000,000

from django.contrib.humanize.templatetags.humanize import intcomma
# Uses locale-aware formatting
```

---

### 8. Legal & Compliance

**Data Privacy:**
- IT Act 2000
- Digital Personal Data Protection Act (DPDP) 2023
- Customer consent for data collection
- Right to erasure
- Data retention policies

**Payment Compliance:**
- RBI guidelines for payment aggregators
- PCI DSS (handled by Razorpay)
- Never store card details directly

**SMS/WhatsApp Compliance:**
- TRAI DLT registration (for SMS)
- Customer opt-in required
- Unsubscribe option mandatory
- No spam (TRAI regulations)

**Required Documents:**
- Privacy Policy
- Terms of Service
- Refund Policy
- Membership Agreement
- GST invoices

---

### 9. Banking & Settlements

**Bank Account Requirements:**
- Current account in Indian bank
- IFSC code for transfers
- UPI VPA (for collections)

**Settlement Timeline:**
- Razorpay: T+1 days (next working day)
- Direct bank transfer: Same day (IMPS/NEFT/RTGS)

**Bank Details on Invoice:**
```
Bank Name: HDFC Bank
Account Name: ClubFlow Private Limited
Account Number: 50200012345678
IFSC Code: HDFC0001234
Branch: Connaught Place, New Delhi
```

---

### 10. Initial Setup Checklist

**Legal:**
- [ ] Register company (Private Limited / LLP)
- [ ] Get PAN for company
- [ ] Register for GSTIN
- [ ] Open current bank account
- [ ] Get Professional Tax registration (if applicable)

**Payment Gateway:**
- [ ] Create Razorpay account
- [ ] Complete KYC
- [ ] Get API keys (test & live)
- [ ] Set up webhook
- [ ] Enable payment methods (UPI, Cards, Net Banking)

**Email:**
- [ ] Register domain (clubflow.com)
- [ ] Create SendGrid account
- [ ] Verify domain
- [ ] Create API key
- [ ] Set up email templates

**Hosting:**
- [ ] Choose hosting (AWS/DigitalOcean/Heroku)
- [ ] Set up PostgreSQL database
- [ ] Configure Redis
- [ ] Set up SSL certificate
- [ ] Configure domain DNS

**Compliance:**
- [ ] Draft Privacy Policy
- [ ] Draft Terms of Service
- [ ] Draft Refund Policy
- [ ] Create GST invoice templates
- [ ] Set up customer consent forms

---

### 11. Testing Checklist

**Payment Testing:**
- [ ] UPI payment (success & failure)
- [ ] Credit card payment
- [ ] Debit card payment
- [ ] Net banking payment
- [ ] Wallet payment
- [ ] Refund flow
- [ ] Webhook handling

**GST Testing:**
- [ ] Intra-state transaction (CGST+SGST)
- [ ] Inter-state transaction (IGST)
- [ ] Invoice PDF generation
- [ ] GST calculations correct

**Email Testing:**
- [ ] Welcome email
- [ ] Booking confirmation
- [ ] Payment receipt
- [ ] Password reset
- [ ] Membership renewal reminder

**Regional Testing:**
- [ ] Currency display (₹ symbol)
- [ ] Date format (DD/MM/YYYY)
- [ ] Phone number format (+91)
- [ ] Timezone (IST)

---

### 12. Go-Live Checklist

**Week Before Launch:**
- [ ] Switch Razorpay to live mode
- [ ] Update SendGrid to verified domain
- [ ] Enable SSL certificate
- [ ] Set DEBUG=False
- [ ] Configure production database backups
- [ ] Set up error monitoring (Sentry)
- [ ] Load test payment flow
- [ ] Train staff on Django Admin

**Launch Day:**
- [ ] Deploy to production
- [ ] Test all critical flows
- [ ] Monitor logs for errors
- [ ] Have rollback plan ready
- [ ] Customer support ready

**Post-Launch:**
- [ ] Monitor Razorpay dashboard for payments
- [ ] Check email delivery rates
- [ ] Monitor server performance
- [ ] Collect customer feedback
- [ ] Plan Phase 2 features (WhatsApp)

---

### 13. Support Contacts

**Razorpay Support:**
- Email: support@razorpay.com
- Phone: 080-68216821
- Dashboard: https://dashboard.razorpay.com

**SendGrid Support:**
- Email: support@sendgrid.com
- Docs: https://docs.sendgrid.com

**GST Helpline:**
- Phone: 0124-4688999, 1800-103-4786
- Portal: https://www.gst.gov.in

---

### 14. Cost Estimates (Monthly)

**MVP (Month 1-3):**
- Razorpay: 2% per transaction + ₹0 (no setup fee)
- SendGrid: Free (up to 100 emails/day)
- Hosting: ₹2,000-5,000/month (DigitalOcean/AWS)
- Domain: ₹800/year
- SSL: Free (Let's Encrypt)
- **Total: ~₹2,000-5,000/month** (+ payment gateway fees)

**Phase 2 (Month 4+):**
- Razorpay: 2% per transaction
- SendGrid: ₹1,500-3,000/month (for marketing)
- Twilio WhatsApp: ₹0.35 per message (~₹5,000-10,000/month)
- Hosting: ₹5,000-10,000/month (scaled up)
- **Total: ~₹12,000-25,000/month** (+ payment gateway fees)

---

### 15. Quick Reference

**Currency:** INR (₹)  
**Tax:** GST 18% (CGST 9% + SGST 9%)  
**Payment Gateway:** Razorpay  
**Email:** SendGrid  
**WhatsApp:** Twilio (Phase 2)  
**Timezone:** Asia/Kolkata (IST, UTC+5:30)  
**Phone Format:** +91 XXXXX XXXXX  
**Date Format:** DD/MM/YYYY  

**Example Pricing:**
- Basic: ₹2,499/month
- Premium: ₹4,999/month
- VIP: ₹9,999/month
- Day Pass: ₹999

---

**Document Version:** 1.0  
**Last Updated:** January 2, 2026  
**For:** ClubFlow - NCR Region Launch

---

**Need Help?**
- Technical: devops@clubflow.com
- Business: business@clubflow.com
- Support: support@clubflow.com

