# 🚀 CRITICAL SETUP GUIDE - Complete These Steps!

**Last Updated:** December 15, 2024

This guide contains all the mandatory steps needed before going live. Follow each section carefully.

---

## 1️⃣ STRIPE WEBHOOK SETUP (CRITICAL)

Without this, payments won't work properly!

### Step 1: Open Stripe Dashboard
1. Go to [https://dashboard.stripe.com/test/webhooks](https://dashboard.stripe.com/test/webhooks)
2. Make sure you're in **Test mode** (toggle at top right)

### Step 2: Create Webhook Endpoint
1. Click **"+ Add endpoint"**
2. Enter the endpoint URL:
   ```
   https://vyhladavac-salonov.vercel.app/api/webhook
   ```
   (Replace with your custom domain when ready)

### Step 3: Select Events
Click **"Select events"** and choose these:
- ✅ `checkout.session.completed`
- ✅ `customer.subscription.created`
- ✅ `customer.subscription.updated`
- ✅ `customer.subscription.deleted`
- ✅ `invoice.paid`
- ✅ `invoice.payment_failed`

### Step 4: Copy Webhook Secret
After creating, you'll see a **Signing secret** starting with `whsec_...`
1. Click **"Reveal"** to see the full secret
2. Copy this value

### Step 5: Add to Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project `vyhladavac-salonov`
3. Go to **Settings** → **Environment Variables**
4. Add new variable:
   - **Name:** `STRIPE_WEBHOOK_SECRET`
   - **Value:** `whsec_...` (paste your secret)
   - **Environments:** ✅ Production, ✅ Preview, ✅ Development
5. Click **Save**
6. **Redeploy** your project (go to Deployments → click "..." on latest → Redeploy)

### Step 6: Test the Webhook
1. In Stripe Dashboard, go to your webhook endpoint
2. Click **"Send test webhook"**
3. Select `checkout.session.completed`
4. Click **"Send test webhook"**
5. You should see a **200 OK** response

---

## 2️⃣ GOOGLE ANALYTICS SETUP

### Step 1: Create GA4 Property
1. Go to [https://analytics.google.com](https://analytics.google.com)
2. Click **Admin** (gear icon)
3. Click **"+ Create Property"**
4. Enter:
   - Property name: `Salon Finder SK`
   - Timezone: `Slovakia (GMT+1)`
   - Currency: `EUR`

### Step 2: Set Up Data Stream
1. Choose **"Web"** platform
2. Enter:
   - Website URL: `https://vyhladavac-salonov.vercel.app` (or your domain)
   - Stream name: `Salon Finder SK Web`
3. Click **"Create stream"**

### Step 3: Get Measurement ID
1. You'll see a **Measurement ID** like `G-XXXXXXXXXX`
2. Copy this ID

### Step 4: Add to Vercel
1. Go to Vercel Dashboard → your project → Settings → Environment Variables
2. Add:
   - **Name:** `NEXT_PUBLIC_GA_MEASUREMENT_ID`
   - **Value:** `G-XXXXXXXXXX` (your ID)
3. Save and redeploy

---

## 3️⃣ MICROSOFT CLARITY SETUP

### Step 1: Create Project
1. Go to [https://clarity.microsoft.com](https://clarity.microsoft.com)
2. Sign in with Microsoft account
3. Click **"+ Add new project"**
4. Enter:
   - Name: `Salon Finder SK`
   - Website URL: `https://vyhladavac-salonov.vercel.app`

### Step 2: Get Project ID
After creating, you'll see a Project ID in the URL or setup page.
It looks like: `xxxxxxxxxx` (alphanumeric string)

### Step 3: Add to Vercel
1. Go to Vercel Dashboard → your project → Settings → Environment Variables
2. Add:
   - **Name:** `NEXT_PUBLIC_CLARITY_PROJECT_ID`
   - **Value:** Your Clarity project ID
3. Save and redeploy

---

## 4️⃣ GOOGLE SEARCH CONSOLE SETUP

### Step 1: Add Property
1. Go to [https://search.google.com/search-console](https://search.google.com/search-console)
2. Click **"Add property"**
3. Choose **"URL prefix"** method
4. Enter: `https://vyhladavac-salonov.vercel.app`

### Step 2: Verify Ownership
Choose one of these methods:
- **HTML file** (download and upload to `/public/`)
- **HTML tag** (add meta tag to layout.tsx)
- **Google Analytics** (if already set up)

For HTML tag method, add this to `src/app/layout.tsx` in the `<head>`:
```tsx
<meta name="google-site-verification" content="YOUR_VERIFICATION_CODE" />
```

### Step 3: Submit Sitemap
1. After verification, go to **Sitemaps** in the left menu
2. Enter: `sitemap.xml`
3. Click **Submit**

Your sitemap is automatically generated at: `/sitemap.xml`

---

## 5️⃣ TEST STRIPE PAYMENT FLOW

### Use Test Cards
| Card Number | Scenario |
|-------------|----------|
| `4242 4242 4242 4242` | Successful payment |
| `4000 0000 0000 0002` | Card declined |
| `4000 0000 0000 3220` | 3D Secure required |

For all test cards use:
- Expiry: Any future date (e.g., 12/34)
- CVC: Any 3 digits (e.g., 123)
- ZIP: Any 5 digits (e.g., 12345)

### Test Flow:
1. Register a new account
2. Create a salon (it will be pending)
3. As admin, approve the salon
4. Go to the salon's subscription page
5. Click "Premium" or "Featured"
6. Complete payment with test card
7. Verify:
   - ✅ Redirect to success page
   - ✅ Salon status updated in database
   - ✅ Subscription record created
   - ✅ Webhook received in Stripe dashboard

---

## 6️⃣ ENVIRONMENT VARIABLES CHECKLIST

Make sure all these are set in Vercel:

| Variable | Required | Status |
|----------|----------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ Yes | Check |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ Yes | Check |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ Yes | Check |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | ✅ Yes | Check |
| `STRIPE_SECRET_KEY` | ✅ Yes | Check |
| `STRIPE_WEBHOOK_SECRET` | ✅ Yes | **ADD NOW** |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | ⚠️ For analytics | Add when ready |
| `NEXT_PUBLIC_CLARITY_PROJECT_ID` | ⚠️ For analytics | Add when ready |

---

## 7️⃣ PRE-LAUNCH FINAL CHECKLIST

After completing the above, verify:

- [ ] Stripe webhook endpoint returns 200
- [ ] Test payment completes successfully
- [ ] Salon tier updates after payment
- [ ] Google Search Console shows your sitemap
- [ ] All 3 languages (SK/EN/HU) work correctly
- [ ] Admin can approve/reject salons
- [ ] Registration works with email
- [ ] Registration works with Google OAuth
- [ ] Password reset email works
- [ ] Contact form submissions work

---

## 🎉 READY TO SWITCH TO LIVE MODE

When ready for real payments:

### Stripe Live Mode:
1. Go to Stripe Dashboard
2. Turn OFF **Test mode** (toggle at top right)
3. Get your **Live** API keys
4. Create the same products in Live mode
5. Create a new webhook for production URL
6. Update Vercel with live keys:
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (live key starts with `pk_live_`)
   - `STRIPE_SECRET_KEY` (live key starts with `sk_live_`)
   - `STRIPE_WEBHOOK_SECRET` (new live webhook secret)

### Custom Domain:
1. Purchase domain (e.g., `salony.sk`)
2. In Vercel, go to Settings → Domains
3. Add your domain
4. Configure DNS as instructed
5. SSL is automatic

---

**Questions?** The code is ready - you just need to configure these external services!
