# ✅ Your Personal To-Do Checklist

This checklist contains all the steps YOU need to complete. I'll handle the coding!

---

## 🟢 COMPLETED - BEFORE WE START CODING

### 1. Create Accounts

| # | Service | Status | Your Notes |
|---|---------|--------|------------|
| 1.1 | **GitHub** - https://github.com | ✅ DONE | kyranxx/vyhladavac_salonov |
| 1.2 | **Supabase** - https://supabase.com | ✅ DONE | salon-finder (txodloobftonmurltjpm) |
| 1.3 | **Vercel** - https://vercel.com | ✅ DONE | vyhladavac-salonov.vercel.app |
| 1.4 | **Stripe** - https://stripe.com | ✅ DONE | Vyhladavac-salonov (Test mode) |
| 1.5 | **Google Analytics** - https://analytics.google.com | ⬜ Pending | |
| 1.6 | **Microsoft Clarity** - https://clarity.microsoft.com | ⬜ Pending | |
| 1.7 | **Google Search Console** - https://search.google.com/search-console | ⬜ Pending | |

---

### 2. Collect API Keys & Credentials ✅ DONE

All keys collected and added to `.env` and Vercel:

```
# Supabase ✅
NEXT_PUBLIC_SUPABASE_URL=https://txodloobftonmurltjpm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Stripe ✅
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51SdXc...
STRIPE_SECRET_KEY=sk_test_51SdXc...

# Stripe Products Created ✅
- Premium Monthly: price_1SdXsFKD2JDE6csJ3JchrhQO (€3/month)
- Premium Yearly: price_1SdXsGKD2JDE6csJke2BCvt6 (€30/year)
- Featured 7 Days: price_1SdXsHKD2JDE6csJnTVz7dat (€5)
- Verified Badge: price_1SdXsIKD2JDE6csJhaVQLqYl (€20/year)

# Google Analytics (add when ready)
NEXT_PUBLIC_GA_MEASUREMENT_ID=

# Microsoft Clarity (add when ready)
NEXT_PUBLIC_CLARITY_PROJECT_ID=
```

---

### 3. Choose Domain Name

| Option | Available? | Notes |
|--------|------------|-------|
| salony.sk | ⬜ Check | |
| najdisalon.sk | ⬜ Check | |
| _________.sk | ⬜ | Your idea |
| _________.sk | ⬜ | Your idea |

To check availability: https://www.sk-nic.sk/

**Decision:** _______________________

---

## 🟡 DURING DEVELOPMENT

### 4. Prepare Logo & Branding

| Item | Status | Notes |
|------|--------|-------|
| Logo in SVG format | ⬜ | |
| Logo in PNG (512x512, transparent) | ⬜ | |
| Favicon (32x32 PNG) | ⬜ | |
| Apple Touch Icon (180x180 PNG) | ⬜ | |
| Social media preview image (1200x630) | ⬜ | For Open Graph |

---

### 5. Legal Documents

| Document | Status | Notes |
|----------|--------|-------|
| Privacy Policy (SK) | ⬜ | Ochrana osobných údajov |
| Privacy Policy (EN) | ⬜ | |
| Privacy Policy (HU) | ⬜ | |
| Terms of Service (SK) | ⬜ | Obchodné podmienky |
| Terms of Service (EN) | ⬜ | |
| Terms of Service (HU) | ⬜ | |
| Cookie Policy | ⬜ | Can be shorter |

**Tip:** You can use templates online and customize, or hire a lawyer.

---

### 6. Review Translations

I'll provide base translations. You need to review/correct:

| Language | Status | Notes |
|----------|--------|-------|
| Slovak (review) | ⬜ | Make sure it sounds natural |
| Hungarian (provide/review) | ⬜ | You'll need native speaker |
| English (I'll handle) | ⬜ | Just review |

---

### 7. Configure Stripe Products ✅ DONE

In Stripe Dashboard → Products (all created automatically):

| Product | Price | Type | Status |
|---------|-------|------|--------|
| Premium Mesačné | €3.00/month | Recurring | ✅ Created |
| Premium Ročné | €30.00/year | Recurring | ✅ Created |
| Zvýraznenie 7 dní | €5.00 | One-time | ✅ Created |
| Overený salón | €20.00/year | Recurring | ✅ Created |

---

## 🟢 BEFORE LAUNCH

### 8. Domain & DNS

| Step | Status | Notes |
|------|--------|-------|
| Purchase domain | ⬜ | |
| Point DNS to Vercel | ⬜ | I'll guide you |
| Verify SSL is working | ⬜ | |

---

### 9. Verify Search Console

| Step | Status | Notes |
|------|--------|-------|
| Add property in GSC | ⬜ | |
| Verify ownership | ⬜ | Via HTML tag |
| Submit sitemap | ⬜ | |

---

### 10. Configure Stripe Webhook

| Step | Status | Notes |
|------|--------|-------|
| Add webhook endpoint in Stripe | ⬜ | URL: yourdomain.com/api/subscriptions/webhook |
| Copy webhook secret | ⬜ | Add to Vercel env vars |
| Test webhook | ⬜ | |

---

### 11. Initial Data ✅ PARTIALLY DONE

| Task | Status | Notes |
|------|--------|-------|
| Review districts list | ✅ | 26 Slovak cities/districts added |
| Review categories list | ✅ | 32 categories added (17 primary + 15 secondary) |
| Add first 5-10 real salons | ⬜ | Optional, helps test |

---

## 🚀 LAUNCH DAY

| Task | Status |
|------|--------|
| Final review of all pages | ⬜ |
| Test payment flow (use Stripe test mode) | ⬜ |
| Switch Stripe to live mode | ⬜ |
| Announce on social media | ⬜ |
| Submit to Google News/Directories | ⬜ |

---

## 📞 Quick Contact Points

| Service | Where to Get Help |
|---------|-------------------|
| Supabase | https://supabase.com/docs |
| Vercel | https://vercel.com/docs |
| Stripe | https://stripe.com/docs |
| Me (AI) | Keep asking questions! |

---

## 📝 Your Questions/Notes

Use this space for any questions or notes:

```
1. 

2. 

3. 

```

---

## 🏆 PROJECT PROGRESS

| Phase | Status | Completion |
|-------|--------|------------|
| 1. Accounts & Setup | ✅ DONE | 100% |
| 2. Database Design | ✅ DONE | 100% |
| 3. Core Infrastructure | ✅ DONE | 100% |
| 4. Frontend Development | ✅ DONE | 100% |
| 5. User Authentication | ✅ DONE | 100% |
| 6. Admin Dashboard | ✅ DONE | 100% |
| 7. Payment Integration | ✅ DONE | 100% |
| 8. SEO & Analytics | ✅ DONE | 100% |
| 9. Testing & Launch | 🔄 IN PROGRESS | 75% |

---

## 📝 What's Done:
- ✅ Google Sign-in on login and registration pages (SK, EN, HU)
- ✅ All localized pages (EN, HU) for registration, login, categories, about, how it works, for owners
- ✅ Admin dashboard with full controls
- ✅ Database schema ready (executed in Supabase)
- ✅ Stripe products created
- ✅ Webhook handler with full database integration
- ✅ Build passes without errors
- ✅ All TypeScript errors resolved
- ✅ Middleware for i18n language detection + rate limiting + session refresh
- ✅ Salon listing page with real database data (no mock data!)
- ✅ Category and city pages with real database
- ✅ User dashboard
- ✅ Admin salon approval persists to database
- ✅ Admin ads page with database integration
- ✅ Dynamic sitemap includes salon pages from database
- ✅ Google Analytics & Microsoft Clarity components (ready for IDs)
- ✅ City column added to salons table
- ✅ Database password reset (security fix)
- ✅ 16 categories seeded to database
- ✅ Payment success/error messages on subscription page

## ⚠️ Still Needs YOUR Manual Action:
1. **Google Analytics** - Add measurement ID:
   - Get ID from analytics.google.com
   - Add `NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXX` to Vercel env vars

2. **Microsoft Clarity** - Add project ID:
   - Get ID from clarity.microsoft.com
   - Add `NEXT_PUBLIC_CLARITY_PROJECT_ID=XXXXXXXX` to Vercel env vars

3. **Google OAuth** - Configure in Supabase Dashboard:
   - Go to Authentication > Providers > Google
   - Add your Google OAuth credentials

4. **Stripe Webhook** - Configure in Stripe Dashboard:
   - Go to Developers > Webhooks
   - Add endpoint: `https://vyhladavac-salonov.vercel.app/api/webhook`
   - Select events: checkout.session.completed, customer.subscription.*

---

**Last Updated:** December 14, 2024 - 10:30 AM

