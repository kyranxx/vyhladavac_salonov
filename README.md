# 🚀 Salon Finder SK - Quick Reference

## Project Overview

A directory/catalog website for salons in Slovakia (beauty, wellness, services).

**Goal:** Maximum organic traffic → earn via ads + subscriptions

---

## Key Files

| File | Description |
|------|-------------|
| `IMPLEMENTATION_PLAN.md` | Master plan with phases, timeline, requirements |
| `YOUR_TODO_CHECKLIST.md` | User's manual tasks checklist |
| `specs/01_DESIGN_SYSTEM.md` | Colors, typography, components |
| `specs/02_BUSINESS_RULES.md` | Pricing tiers, feature gating, workflows |
| `specs/03_CATEGORIES_DISTRICTS.md` | All 26 categories + 79 Slovak districts |
| `specs/04_TRANSLATIONS.md` | i18n strings for SK, EN, HU |
| `specs/05_CONFIGURATION.md` | Environment variables, dependencies |
| `specs/06_API_SPECIFICATION.md` | API endpoints documentation |

---

## Tech Stack

- **Frontend:** Next.js 14 (App Router) + TypeScript
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth
- **Payments:** Stripe
- **Hosting:** Vercel
- **Languages:** Slovak (primary), English, Hungarian

---

## Monetization

| Tier | Price | Key Features |
|------|-------|--------------|
| Free | €0 | Basic listing, 1 photo, 1 category |
| Premium | €3/month or €30/year | 10 photos, website, booking, social, stats |
| Featured | €5/7 days | Top of listings, highlighted |
| Verified | €20/year | Verified badge after manual check |

---

## Key Requirements

1. ✅ Mobile-first, responsive
2. ✅ 3 languages (SK, EN, HU) with i18n
3. ✅ 100/100 PageSpeed
4. ✅ SEO optimized (sitemap, schema.org, meta)
5. ✅ Admin dashboard with full control
6. ✅ Approval workflow for listings
7. ✅ Top-level security
8. ✅ Analytics (GA4, Clarity)

---

## Design Style

- **Inspiration:** Airbnb, Grok.com
- **Colors:** Warm beige + grey palette
- **Vibe:** Friendly, approachable, modern, clean
- **Priority:** Intuitive navigation, mobile-first

---

## Categories (26 total)

**Primary (17):** Women's Hair, Men's Hair, Barber, Nails, Beauty, Massage, Wellness, Pedicure, Tanning, Tattoo, Permanent Makeup, Makeup Artist, Lash & Brow, Slimming, Teeth Whitening, Waxing, Sauna

**Secondary (9):** Fitness, Wedding Photo/Video, Photo Studio, Tailor, Pet Grooming, Plastic Surgery, Relaxation, Taxi

---

## Districts

79 Slovak districts (okresy) across 8 regions
~20 major cities featured prominently

---

## Development Timeline

- **Weeks 1-2:** Project Setup & Design System
- **Weeks 3-4:** Core Frontend (Homepage, Listings)
- **Weeks 5-6:** Auth & User Dashboard
- **Weeks 7-8:** Admin Dashboard
- **Weeks 9-10:** Payments (Stripe)
- **Weeks 11-12:** SEO & Performance
- **Week 13:** Security & Legal
- **Week 14:** Testing & Launch

**Total: ~14 weeks (3.5 months)**

---

## Before Starting Development

User needs to complete:
1. Create accounts: GitHub, Supabase, Vercel, Stripe, GA, Clarity
2. Collect API keys
3. Decide on domain name

---

## Commands

```bash
# Development
npm run dev

# Build
npm run build

# Lint
npm run lint

# End-to-end test
npm run test

# Production test
npm run test:prod

# Lighthouse audit
npm run audit
```

---

**Status:** Planning Complete ✅ - Ready for Development  
**Last Updated:** December 12, 2024
