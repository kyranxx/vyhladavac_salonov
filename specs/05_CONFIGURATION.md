# 🔧 Environment Variables & Configuration

## Environment Variables (.env.local)

```bash
# SUPABASE (From: Dashboard → Project Settings → API)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...

# STRIPE (From: Dashboard → Developers → API keys)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Stripe Product Price IDs
STRIPE_PREMIUM_MONTHLY_PRICE_ID=price_...
STRIPE_PREMIUM_YEARLY_PRICE_ID=price_...
STRIPE_FEATURED_PRICE_ID=price_...
STRIPE_VERIFIED_PRICE_ID=price_...

# ANALYTICS
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_CLARITY_PROJECT_ID=xxxxxxxxxx

# EMAIL (Resend)
RESEND_API_KEY=re_...
EMAIL_FROM=noreply@yourdomain.sk

# APPLICATION
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_DEFAULT_LOCALE=sk
AUTH_SECRET=your-random-secret-here
ADMIN_EMAIL=admin@yourdomain.sk
```

## next.config.js

```javascript
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ['sk', 'en', 'hu'],
    defaultLocale: 'sk',
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
    ],
  },
};
module.exports = nextConfig;
```

## Path Aliases (tsconfig.json)

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"]
    }
  }
}
```

## Core Dependencies (package.json)

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "@supabase/supabase-js": "^2.38.0",
    "next-intl": "^3.4.0",
    "stripe": "^14.5.0",
    "zod": "^3.22.4",
    "react-hook-form": "^7.48.0",
    "lucide-react": "^0.294.0",
    "resend": "^2.0.0"
  }
}
```

## Stripe Products to Create

| Product | Price | Type |
|---------|-------|------|
| Premium Monthly | €3.00/month | Recurring |
| Premium Yearly | €30.00/year | Recurring |
| Featured 7 Days | €5.00 | One-time |
| Verified Badge | €20.00 | One-time |

## Supabase Storage Buckets

| Bucket | Public | Description |
|--------|--------|-------------|
| logos | Yes | Salon logos |
| photos | Yes | Salon gallery |
| banners | Yes | Banner ads |

---

**Document Version:** 1.0
