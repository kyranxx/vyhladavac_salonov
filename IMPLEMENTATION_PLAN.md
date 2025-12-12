# 🏢 Salon Finder SK - Implementation Plan

**Project Codename:** `salon-finder-sk`  
**Start Date:** December 2024  
**Target Launch:** February/March 2025  
**Tech Stack:** Next.js 14 + Supabase + Vercel + Stripe

---

## 📋 Table of Contents

1. [Project Overview](#1-project-overview)
2. [Requirements Checklist](#2-requirements-checklist)
3. [Technology Stack](#3-technology-stack)
4. [Database Schema](#4-database-schema)
5. [Page Structure & Routes](#5-page-structure--routes)
6. [Component Architecture](#6-component-architecture)
7. [Development Phases](#7-development-phases)
8. [User Manual Steps](#8-user-manual-steps)
9. [SEO Strategy](#9-seo-strategy)
10. [Security Checklist](#10-security-checklist)
11. [Timeline](#11-timeline)

---

## 1. Project Overview

### Vision
A comprehensive directory/catalog of salons and beauty services in Slovakia. The platform connects customers with salons by location and category, with a focus on SEO to drive organic traffic.

### Business Model
- **Free listings** attract maximum salon registrations
- **Premium subscriptions** (3€/month or 30€/year) for enhanced features
- **Featured listings** (5€/7 days) for top placement
- **Verified badges** (20€/year) for trust signals
- **Banner ads** for additional revenue

### Target Audience
- **Primary:** Slovak-speaking users looking for beauty services
- **Secondary:** Hungarian-speaking users in southern Slovakia
- **Tertiary:** English-speaking expats/tourists

### Languages
- Slovak (primary)
- English
- Hungarian

---

## 2. Requirements Checklist

### 🔴 CRITICAL Requirements

| # | Requirement | Status |
|---|-------------|--------|
| 1 | Mobile-first, fully responsive design | ✅ |
| 2 | 3 languages: Slovak, English, Hungarian (i18n) | ✅ |
| 3 | 100/100 PageSpeed score | 🔄 |
| 4 | Zero console errors/warnings | 🔄 |
| 5 | Top-level security (HTTPS, SQL injection, XSS, CSRF) | ✅ |
| 6 | SEO optimized (meta tags, schema.org, sitemap, robots.txt) | ✅ |
| 7 | Admin dashboard with full control | ✅ |
| 8 | Next.js 14+ with App Router | ✅ |
| 9 | Supabase (PostgreSQL + Auth + RLS) | ✅ |
| 10 | Cloudflare R2 / Supabase Storage for images | 🔄 |
| 11 | Vercel hosting | ✅ |
| 12 | GitHub version control | ✅ |
| 13 | Google Analytics 4 | ✅ |
| 14 | Microsoft Clarity | ✅ |
| 15 | Google Search Console integration | ✅ |
| 16 | Dynamic sitemap generation | ✅ |
| 17 | Structured data (LocalBusiness schema) | ✅ |
| 18 | City + Category landing pages for SEO | ✅ |
| 19 | Meta descriptions, OG tags for sharing | ✅ |
| 20 | Cookie consent banner (GDPR) | ✅ |
| 21 | Privacy policy & Terms of service | ✅ |
| 22 | Stripe payment integration | 🔄 |
| 23 | User registration & authentication | ✅ |
| 24 | Listing approval workflow | ✅ |
| 25 | Search with filters (city, category) | ✅ |

### 🟡 HIGH Priority Requirements

| # | Requirement | Status |
|---|-------------|--------|
| 26 | Image optimization (WebP, lazy loading) | ✅ |
| 27 | CDN for static assets | 🔄 |
| 28 | Rate limiting on forms/API | 🔄 |
| 29 | Bing Webmaster Tools | ✅ |
| 30 | Admin 2FA authentication | 🔄 |
| 31 | Security headers (CSP, HSTS) | ✅ |
| 32 | 404 and error pages | ✅ |
| 33 | Loading skeletons for UX | ✅ |
| 34 | Breadcrumb navigation | ✅ |
| 35 | Email notifications for admin | 🔄 |
| 36 | Database backup strategy | 🔄 |

---

## 3. Technology Stack

### Frontend
```
Next.js 14.x (App Router)
TypeScript
CSS Modules / Vanilla CSS
next-intl (i18n)
React Hook Form + Zod (validation)
```

### Backend
```
Next.js API Routes
Supabase (PostgreSQL)
Supabase Auth
Supabase Row Level Security
```

### Infrastructure
```
Vercel (hosting)
Supabase (database + storage)
Cloudflare (CDN, optional)
GitHub (version control)
```

### Payments
```
Stripe (subscriptions + one-time payments)
```

### Analytics
```
Google Analytics 4
Microsoft Clarity
Google Search Console
Bing Webmaster Tools
Ahrefs (free version)
```

---

## 4. Database Schema

### Tables Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        DATABASE SCHEMA                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐    │
│  │    users     │────▶│   salons     │────▶│   photos     │    │
│  └──────────────┘     └──────────────┘     └──────────────┘    │
│                              │                                  │
│                              │                                  │
│                              ▼                                  │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐    │
│  │  categories  │◀────│salon_categories│    │   services   │    │
│  └──────────────┘     └──────────────┘     └──────────────┘    │
│                                                                 │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐    │
│  │   districts  │     │subscriptions │     │ banner_ads   │    │
│  └──────────────┘     └──────────────┘     └──────────────┘    │
│                                                                 │
│  ┌──────────────┐     ┌──────────────┐                         │
│  │change_requests│    │   analytics  │                         │
│  └──────────────┘     └──────────────┘                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Detailed Table Definitions

#### users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255), -- Managed by Supabase Auth
  role ENUM('user', 'salon_owner', 'admin') DEFAULT 'user',
  full_name VARCHAR(255),
  phone VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  email_verified BOOLEAN DEFAULT FALSE,
  last_login TIMESTAMP
);
```

#### categories
```sql
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(100) UNIQUE NOT NULL, -- e.g., 'damske-kadernictvo'
  name_sk VARCHAR(100) NOT NULL,
  name_en VARCHAR(100) NOT NULL,
  name_hu VARCHAR(100) NOT NULL,
  icon VARCHAR(50), -- emoji or icon class
  category_type ENUM('primary', 'secondary') DEFAULT 'primary',
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### districts
```sql
CREATE TABLE districts (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(100) UNIQUE NOT NULL, -- e.g., 'bratislava-i'
  name_sk VARCHAR(100) NOT NULL,
  name_en VARCHAR(100) NOT NULL,
  name_hu VARCHAR(100) NOT NULL,
  region_sk VARCHAR(100), -- Bratislavský kraj
  region_en VARCHAR(100),
  region_hu VARCHAR(100),
  is_major_city BOOLEAN DEFAULT FALSE, -- For featured cities
  population INT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### salons
```sql
CREATE TABLE salons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES users(id) ON DELETE SET NULL,
  
  -- Basic Info (FREE tier)
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL, -- e.g., 'salon-maria-bratislava'
  phone VARCHAR(50),
  address VARCHAR(255) NOT NULL,
  district_id INT REFERENCES districts(id),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  logo_url VARCHAR(500),
  
  -- Opening Hours (FREE tier)
  opening_hours JSONB, -- {"mon": {"open": "09:00", "close": "18:00"}, ...}
  
  -- Premium Features
  description_sk TEXT,
  description_en TEXT,
  description_hu TEXT,
  website VARCHAR(255),
  booking_url VARCHAR(255),
  facebook_url VARCHAR(255),
  instagram_url VARCHAR(255),
  google_reviews_url VARCHAR(255),
  google_maps_url VARCHAR(255),
  
  -- Additional Info (Premium)
  has_parking BOOLEAN DEFAULT FALSE,
  payment_methods VARCHAR(255)[], -- ['cash', 'card', 'transfer']
  
  -- Status
  status ENUM('pending', 'approved', 'rejected', 'suspended') DEFAULT 'pending',
  rejection_note TEXT,
  
  -- Subscription Tier
  tier ENUM('free', 'premium') DEFAULT 'free',
  is_featured BOOLEAN DEFAULT FALSE,
  featured_until TIMESTAMP,
  is_verified BOOLEAN DEFAULT FALSE,
  verified_until TIMESTAMP,
  
  -- Statistics
  view_count INT DEFAULT 0,
  click_count INT DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  approved_at TIMESTAMP,
  
  -- Search optimization
  search_vector TSVECTOR
);

-- Full-text search index
CREATE INDEX idx_salons_search ON salons USING GIN(search_vector);
CREATE INDEX idx_salons_district ON salons(district_id);
CREATE INDEX idx_salons_status ON salons(status);
CREATE INDEX idx_salons_featured ON salons(is_featured, featured_until);
```

#### salon_categories (junction table)
```sql
CREATE TABLE salon_categories (
  salon_id UUID REFERENCES salons(id) ON DELETE CASCADE,
  category_id INT REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (salon_id, category_id)
);
```

#### photos
```sql
CREATE TABLE photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  salon_id UUID REFERENCES salons(id) ON DELETE CASCADE,
  url VARCHAR(500) NOT NULL,
  thumbnail_url VARCHAR(500),
  alt_text VARCHAR(255),
  sort_order INT DEFAULT 0,
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_photos_salon ON photos(salon_id);
```

#### services
```sql
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  salon_id UUID REFERENCES salons(id) ON DELETE CASCADE,
  name_sk VARCHAR(255) NOT NULL,
  name_en VARCHAR(255),
  name_hu VARCHAR(255),
  price DECIMAL(10, 2),
  price_to DECIMAL(10, 2), -- For price ranges "10-20€"
  duration_minutes INT,
  sort_order INT DEFAULT 0,
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_services_salon ON services(salon_id);
```

#### subscriptions
```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  salon_id UUID REFERENCES salons(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  
  type ENUM('premium', 'featured', 'verified') NOT NULL,
  status ENUM('active', 'cancelled', 'expired', 'pending') DEFAULT 'pending',
  
  stripe_subscription_id VARCHAR(255),
  stripe_customer_id VARCHAR(255),
  
  amount_paid DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'EUR',
  
  starts_at TIMESTAMP NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_salon ON subscriptions(salon_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_expires ON subscriptions(expires_at);
```

#### change_requests
```sql
CREATE TABLE change_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  salon_id UUID REFERENCES salons(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  
  request_type ENUM('create', 'update', 'photo_add', 'photo_delete', 'service_update') NOT NULL,
  field_name VARCHAR(100), -- Which field is being changed
  old_value TEXT,
  new_value TEXT,
  
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  admin_note TEXT,
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_change_requests_status ON change_requests(status);
CREATE INDEX idx_change_requests_salon ON change_requests(salon_id);
```

#### banner_ads
```sql
CREATE TABLE banner_ads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  name VARCHAR(255) NOT NULL, -- Internal name
  placement ENUM('hero', 'sidebar', 'between_listings', 'footer', 'category_header', 'city_header') NOT NULL,
  
  image_url VARCHAR(500) NOT NULL,
  image_url_mobile VARCHAR(500), -- Separate mobile image
  link_url VARCHAR(500) NOT NULL,
  alt_text VARCHAR(255),
  
  -- Targeting
  target_categories INT[], -- Empty = all categories
  target_districts INT[], -- Empty = all districts
  
  -- Scheduling
  starts_at TIMESTAMP NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  
  -- Stats
  impressions INT DEFAULT 0,
  clicks INT DEFAULT 0,
  
  -- Payment
  amount_paid DECIMAL(10, 2),
  advertiser_name VARCHAR(255),
  advertiser_email VARCHAR(255),
  
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_banner_ads_placement ON banner_ads(placement);
CREATE INDEX idx_banner_ads_active ON banner_ads(is_active, starts_at, expires_at);
```

#### analytics_events
```sql
CREATE TABLE analytics_events (
  id BIGSERIAL PRIMARY KEY,
  event_type ENUM('salon_view', 'salon_click_phone', 'salon_click_website', 'salon_click_booking', 'search', 'banner_impression', 'banner_click') NOT NULL,
  
  salon_id UUID REFERENCES salons(id) ON DELETE SET NULL,
  banner_id UUID REFERENCES banner_ads(id) ON DELETE SET NULL,
  
  -- Context
  user_agent TEXT,
  ip_hash VARCHAR(64), -- Hashed for privacy
  referrer VARCHAR(500),
  
  -- Search context
  search_query VARCHAR(255),
  search_category_id INT,
  search_district_id INT,
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- Partition by month for performance
CREATE INDEX idx_analytics_created ON analytics_events(created_at);
CREATE INDEX idx_analytics_salon ON analytics_events(salon_id);
```

---

## 5. Page Structure & Routes

### Public Pages (Frontend)

```
/                                    # Homepage
├── /[lang]                          # Language prefix (sk, en, hu)
│   ├── /                            # Homepage (localized)
│   ├── /salony                      # All salons listing
│   ├── /salony/[district]           # Salons by district
│   ├── /kategoria/[category]        # Salons by category
│   ├── /kategoria/[category]/[district]  # Category + District combo
│   ├── /salon/[slug]                # Individual salon page
│   ├── /vyhladavanie                # Search results page
│   ├── /pre-majitelov               # "For Salon Owners" landing page
│   ├── /cennik                      # Pricing page
│   ├── /ako-to-funguje              # How it works
│   ├── /kontakt                     # Contact page
│   ├── /ochrana-sukromia            # Privacy policy
│   ├── /obchodne-podmienky          # Terms of service
│   └── /cookies                     # Cookie policy
```

### User Dashboard (Salon Owners)

```
/dashboard                           # Redirect to /dashboard/moj-salon
├── /dashboard
│   ├── /moj-salon                   # My salon profile
│   ├── /moj-salon/upravit           # Edit salon
│   ├── /moj-salon/fotky             # Manage photos
│   ├── /moj-salon/sluzby            # Manage services
│   ├── /predplatne                  # Subscription management
│   ├── /statistiky                  # View statistics
│   ├── /nastavenia                  # Account settings
│   └── /platby                      # Payment history
```

### Admin Dashboard

```
/admin                               # Admin home / overview
├── /admin
│   ├── /salony                      # All salons list
│   ├── /salony/[id]                 # Salon detail view
│   ├── /schvalovanie                # Pending approvals
│   ├── /schvalovanie/salony         # New salon registrations
│   ├── /schvalovanie/zmeny          # Change requests
│   ├── /schvalovanie/fotky          # Photo approvals
│   ├── /kategorie                   # Manage categories
│   ├── /okresy                      # Manage districts
│   ├── /uzivatelia                  # User management
│   ├── /reklamy                     # Banner ads management
│   ├── /reklamy/nova                # Create banner ad
│   ├── /predplatne                  # Subscriptions overview
│   ├── /featured                    # Featured listings management
│   ├── /verified                    # Verified badges management
│   ├── /statistiky                  # Analytics dashboard
│   ├── /statistiky/navstevnost      # Traffic stats
│   ├── /statistiky/salony           # Salon stats
│   ├── /statistiky/prijem           # Revenue stats
│   ├── /export                      # Export data (CSV)
│   └── /nastavenia                  # Admin settings
```

### API Routes

```
/api
├── /auth
│   ├── /register                    # POST - User registration
│   ├── /login                       # POST - User login
│   ├── /logout                      # POST - User logout
│   ├── /forgot-password             # POST - Password reset request
│   └── /reset-password              # POST - Password reset
│
├── /salons
│   ├── GET /                        # List salons (with filters)
│   ├── POST /                       # Create salon (auth required)
│   ├── GET /[id]                    # Get salon details
│   ├── PUT /[id]                    # Update salon (creates change request)
│   ├── DELETE /[id]                 # Delete salon (admin only)
│   ├── POST /[id]/photos            # Upload photo
│   ├── DELETE /[id]/photos/[photoId] # Delete photo
│   └── POST /[id]/services          # Add/update services
│
├── /categories
│   ├── GET /                        # List all categories
│   └── GET /[slug]                  # Get category details
│
├── /districts
│   ├── GET /                        # List all districts
│   └── GET /[slug]                  # Get district details
│
├── /search
│   └── GET /                        # Search salons
│
├── /subscriptions
│   ├── POST /create-checkout        # Create Stripe checkout session
│   ├── POST /webhook                # Stripe webhook handler
│   └── GET /my-subscriptions        # Get user's subscriptions
│
├── /admin
│   ├── GET /salons                  # List all salons (admin)
│   ├── PUT /salons/[id]/approve     # Approve salon
│   ├── PUT /salons/[id]/reject      # Reject salon
│   ├── GET /change-requests         # List change requests
│   ├── PUT /change-requests/[id]    # Approve/reject change
│   ├── CRUD /categories             # Manage categories
│   ├── CRUD /districts              # Manage districts
│   ├── CRUD /banner-ads             # Manage banner ads
│   └── GET /analytics               # Get analytics data
│
├── /upload
│   └── POST /image                  # Upload image to storage
│
└── /sitemap.xml                     # Dynamic sitemap
```

---

## 6. Component Architecture

### Layout Components

```
components/
├── layout/
│   ├── Header.tsx                   # Main navigation header
│   ├── Footer.tsx                   # Site footer
│   ├── MobileMenu.tsx               # Mobile navigation drawer
│   ├── LanguageSwitcher.tsx         # SK/EN/HU switcher
│   ├── Breadcrumbs.tsx              # Breadcrumb navigation
│   ├── CookieConsent.tsx            # GDPR cookie banner
│   └── Container.tsx                # Max-width container
```

### UI Components

```
├── ui/
│   ├── Button.tsx                   # Button variants
│   ├── Input.tsx                    # Form input
│   ├── Select.tsx                   # Dropdown select
│   ├── Textarea.tsx                 # Text area
│   ├── Checkbox.tsx                 # Checkbox
│   ├── Radio.tsx                    # Radio button
│   ├── Card.tsx                     # Card container
│   ├── Badge.tsx                    # Status badges
│   ├── Modal.tsx                    # Modal dialog
│   ├── Toast.tsx                    # Toast notifications
│   ├── Skeleton.tsx                 # Loading skeleton
│   ├── Spinner.tsx                  # Loading spinner
│   ├── Pagination.tsx               # Pagination controls
│   ├── Tabs.tsx                     # Tab navigation
│   ├── Tooltip.tsx                  # Tooltips
│   └── Avatar.tsx                   # User/salon avatars
```

### Salon Components

```
├── salon/
│   ├── SalonCard.tsx                # Salon listing card
│   ├── SalonCardFeatured.tsx        # Featured salon card (highlighted)
│   ├── SalonGrid.tsx                # Grid of salon cards
│   ├── SalonDetail.tsx              # Full salon page content
│   ├── SalonGallery.tsx             # Photo gallery
│   ├── SalonServices.tsx            # Services list with prices
│   ├── SalonOpeningHours.tsx        # Opening hours display
│   ├── SalonContact.tsx             # Contact buttons
│   ├── SalonMap.tsx                 # Google Maps embed
│   ├── SalonBadges.tsx              # Premium/Verified badges
│   └── SalonShare.tsx               # Share buttons
```

### Search & Filter Components

```
├── search/
│   ├── SearchBar.tsx                # Main search input
│   ├── SearchFilters.tsx            # Filter sidebar
│   ├── CategoryFilter.tsx           # Category checkboxes
│   ├── DistrictFilter.tsx           # District dropdown
│   ├── SortDropdown.tsx             # Sort options
│   ├── ActiveFilters.tsx            # Show active filters as chips
│   └── SearchResults.tsx            # Results container
```

### Form Components

```
├── forms/
│   ├── SalonRegistrationForm.tsx    # New salon registration
│   ├── SalonEditForm.tsx            # Edit salon details
│   ├── PhotoUpload.tsx              # Photo upload with preview
│   ├── ServiceForm.tsx              # Add/edit service
│   ├── OpeningHoursForm.tsx         # Opening hours editor
│   ├── ContactForm.tsx              # Contact us form
│   └── UserSettingsForm.tsx         # User account settings
```

### Dashboard Components

```
├── dashboard/
│   ├── DashboardNav.tsx             # Dashboard sidebar nav
│   ├── DashboardStats.tsx           # Stats cards
│   ├── SubscriptionCard.tsx         # Current subscription info
│   ├── PaymentHistory.tsx           # Payment history table
│   └── NotificationList.tsx         # Notifications list
```

### Admin Components

```
├── admin/
│   ├── AdminNav.tsx                 # Admin sidebar navigation
│   ├── AdminHeader.tsx              # Admin top bar
│   ├── DataTable.tsx                # Reusable data table
│   ├── ApprovalCard.tsx             # Approval request card
│   ├── ChangeRequestDiff.tsx        # Show before/after changes
│   ├── BannerAdForm.tsx             # Banner ad creation form
│   ├── StatsDashboard.tsx           # Analytics charts
│   ├── RevenueChart.tsx             # Revenue visualization
│   └── QuickActions.tsx             # Quick action buttons
```

### Home Page Components

```
├── home/
│   ├── HeroSearch.tsx               # Hero with search
│   ├── CategoryGrid.tsx             # Browse by category
│   ├── PopularCities.tsx            # Popular cities section
│   ├── FeaturedSalons.tsx           # Featured salons carousel
│   ├── HowItWorks.tsx               # How it works section
│   ├── ForOwnersSection.tsx         # CTA for salon owners
│   └── StatsSection.tsx             # Platform statistics
```

### SEO Components

```
├── seo/
│   ├── StructuredData.tsx           # JSON-LD schema
│   ├── MetaTags.tsx                 # Meta tags handler
│   └── CanonicalUrl.tsx             # Canonical URL handler
```

---

## 7. Development Phases

### Phase 1: Project Setup & Foundation (Week 1-2)

#### 1.1 Initial Setup
- [ ] Create GitHub repository `salon-finder-sk`
- [ ] Initialize Next.js 14 project with TypeScript
- [ ] Set up ESLint + Prettier configuration
- [ ] Configure path aliases (@components, @lib, etc.)
- [ ] Set up environment variables structure

#### 1.2 Design System
- [ ] Create CSS custom properties (colors, spacing, typography)
- [ ] Design color palette (beige, grey tones from Airbnb/Grok inspiration)
- [ ] Set up Google Fonts (Inter or similar)
- [ ] Create base UI components (Button, Input, Card, etc.)
- [ ] Implement responsive breakpoints

#### 1.3 Supabase Setup
- [ ] Create Supabase project
- [ ] Design and create all database tables
- [ ] Set up Row Level Security policies
- [ ] Configure authentication providers
- [ ] Set up storage buckets for images

#### 1.4 Internationalization
- [ ] Install and configure next-intl
- [ ] Create translation files structure
- [ ] Set up language detection and switching
- [ ] Create all static translations

### Phase 2: Core Frontend (Week 3-4)

#### 2.1 Layout & Navigation
- [ ] Create Header component with responsive menu
- [ ] Create Footer component
- [ ] Implement language switcher
- [ ] Create breadcrumb navigation
- [ ] Implement 404 and error pages

#### 2.2 Homepage
- [ ] Design and implement hero section with search
- [ ] Create category grid component
- [ ] Create popular cities section
- [ ] Implement featured salons carousel
- [ ] Add "How it works" section
- [ ] Add "For salon owners" CTA section

#### 2.3 Listing Pages
- [ ] Create salon card component (with Featured variant)
- [ ] Implement salon grid with pagination
- [ ] Create filter sidebar
- [ ] Implement search functionality
- [ ] Create category listing pages
- [ ] Create district listing pages
- [ ] Create combined category+district pages

#### 2.4 Salon Detail Page
- [ ] Create salon detail layout
- [ ] Implement photo gallery with lightbox
- [ ] Create services list component
- [ ] Create opening hours display
- [ ] Implement contact section
- [ ] Add Google Maps embed
- [ ] Add structured data (schema.org)

### Phase 3: User Authentication & Dashboard (Week 5-6)

#### 3.1 Authentication
- [ ] Implement registration flow
- [ ] Implement login flow
- [ ] Add forgot/reset password
- [ ] Set up email verification
- [ ] Implement protected routes

#### 3.2 Salon Registration
- [ ] Create multi-step registration form
- [ ] Implement photo upload with preview
- [ ] Add services management
- [ ] Add opening hours editor
- [ ] Implement form validation
- [ ] Create pending approval state

#### 3.3 User Dashboard
- [ ] Create dashboard layout
- [ ] Implement "My Salon" view
- [ ] Create edit salon functionality (with change requests)
- [ ] Implement photo management
- [ ] Add services management
- [ ] Create subscription overview
- [ ] Add statistics view

### Phase 4: Admin Dashboard (Week 7-8)

#### 4.1 Admin Layout
- [ ] Create admin layout with sidebar
- [ ] Implement admin authentication (2FA optional)
- [ ] Create dashboard overview

#### 4.2 Salon Management
- [ ] Create salons list with search/filter
- [ ] Implement salon detail view
- [ ] Add approve/reject functionality
- [ ] Create change requests queue
- [ ] Implement photo approval queue

#### 4.3 Content Management
- [ ] Create categories management
- [ ] Create districts management
- [ ] Implement banner ads management
- [ ] Add featured listings management
- [ ] Create verified badges management

#### 4.4 Analytics & Reports
- [ ] Create statistics dashboard
- [ ] Implement traffic analytics
- [ ] Add revenue reports
- [ ] Create export functionality (CSV)

### Phase 5: Payments & Subscriptions (Week 9-10)

#### 5.1 Stripe Integration
- [ ] Set up Stripe account and products
- [ ] Create checkout sessions API
- [ ] Implement webhook handler
- [ ] Handle subscription lifecycle events

#### 5.2 Subscription Features
- [ ] Implement premium tier unlocking
- [ ] Add featured listing functionality
- [ ] Create verified badge system
- [ ] Build payment history

#### 5.3 Tier Enforcement
- [ ] Implement feature gating based on tier
- [ ] Add upgrade prompts
- [ ] Handle subscription expiration

### Phase 6: SEO & Performance (Week 11-12)

#### 6.1 SEO Implementation
- [ ] Create dynamic sitemap generation
- [ ] Implement robots.txt
- [ ] Add meta tags for all pages
- [ ] Implement Open Graph tags
- [ ] Add structured data (LocalBusiness, BreadcrumbList)
- [ ] Create SEO-optimized URL structure

#### 6.2 Performance Optimization
- [ ] Optimize images (WebP, responsive)
- [ ] Implement lazy loading
- [ ] Add loading skeletons
- [ ] Optimize bundle size
- [ ] Implement caching strategies
- [ ] Achieve 100/100 PageSpeed

#### 6.3 Analytics Setup
- [ ] Install Google Analytics 4
- [ ] Install Microsoft Clarity
- [ ] Set up Google Search Console
- [ ] Set up Bing Webmaster Tools
- [ ] Configure event tracking

### Phase 7: Security & Legal (Week 13)

#### 7.1 Security Hardening
- [ ] Implement security headers
- [ ] Add rate limiting
- [ ] Configure CSRF protection
- [ ] Implement input sanitization
- [ ] Set up file upload validation
- [ ] Add admin 2FA (optional)

#### 7.2 Legal Pages
- [ ] Create privacy policy page
- [ ] Create terms of service page
- [ ] Create cookie policy page
- [ ] Implement cookie consent banner

#### 7.3 Email Notifications
- [ ] Set up email service (Resend/SendGrid)
- [ ] Create email templates
- [ ] Implement notification triggers

### Phase 8: Testing & Launch Prep (Week 14)

#### 8.1 Testing
- [ ] Manual testing all user flows
- [ ] Test on multiple devices
- [ ] Test in all 3 languages
- [ ] Performance testing
- [ ] Security testing

#### 8.2 Data Population
- [ ] Import districts data
- [ ] Set up categories
- [ ] Add initial sample salons (or real ones)

#### 8.3 Launch Preparation
- [ ] Set up production environment
- [ ] Configure domain and DNS
- [ ] Set up SSL certificate
- [ ] Final performance check
- [ ] Backup strategy verification

---

## 8. User Manual Steps

### STEP 1: Create Accounts (Before Development)

#### 1.1 GitHub Account
If you don't have one:
1. Go to https://github.com
2. Click "Sign up"
3. Complete registration
4. Enable 2FA for security

#### 1.2 Supabase Account
1. Go to https://supabase.com
2. Click "Start your project"
3. Sign in with GitHub
4. Create new organization (your company name)
5. **Save these credentials:**
   - `SUPABASE_URL` (Project Settings → API → Project URL)
   - `SUPABASE_ANON_KEY` (Project Settings → API → anon public)
   - `SUPABASE_SERVICE_KEY` (Project Settings → API → service_role)

#### 1.3 Vercel Account
1. Go to https://vercel.com
2. Click "Sign Up"
3. Sign in with GitHub
4. Connect your GitHub account

#### 1.4 Stripe Account
1. Go to https://stripe.com
2. Click "Start now"
3. Complete business registration
4. Verify your identity
5. **From Dashboard → Developers → API keys, save:**
   - `STRIPE_PUBLISHABLE_KEY`
   - `STRIPE_SECRET_KEY`
6. **Set up webhook** (later, after deployment)

#### 1.5 Google Analytics
1. Go to https://analytics.google.com
2. Create an account
3. Create a property (Web)
4. **Save:** `GA_MEASUREMENT_ID` (format: G-XXXXXXX)

#### 1.6 Microsoft Clarity
1. Go to https://clarity.microsoft.com
2. Sign up with Microsoft account
3. Create a project
4. **Save:** `CLARITY_PROJECT_ID`

#### 1.7 Google Search Console
1. Go to https://search.google.com/search-console
2. Add property (URL prefix method)
3. Verify ownership (will do after deployment via HTML tag)

#### 1.8 Domain Registration (When Ready)
1. Choose a registrar (Namecheap, Cloudflare, or SK domain at sk-nic.sk)
2. Search for available domain
3. Purchase domain
4. We'll connect it to Vercel later

### STEP 2: Prepare Assets

#### 2.1 Logo
- Create or commission a logo
- Provide in these formats:
  - SVG (vector, for web)
  - PNG with transparent background (512x512 for favicon)
  - PNG (180x180 for Apple touch icon)

#### 2.2 Translations
I'll provide translation files, but you'll need to:
- Review Slovak translations
- Provide/review Hungarian translations
- (English I'll handle)

#### 2.3 Legal Documents
You need to prepare or have a lawyer prepare:
- Privacy Policy (Ochrana osobných údajov)
- Terms of Service (Obchodné podmienky)
- Cookie Policy (Zásady používania cookies)
- GDPR compliance documentation

### STEP 3: Data Preparation

#### 3.1 Districts Data
I'll prepare Slovak districts data, but verify:
- All 79 districts are correct
- Major cities are marked
- Hungarian names for relevant districts

#### 3.2 Initial Salons (Optional)
If you want to launch with some salons:
- Prepare a list in spreadsheet format
- Include: name, category, city, phone, address

---

## 9. SEO Strategy

### URL Structure

```
# Homepage
/
/en
/hu

# Category pages (generate for all categories)
/sk/kategoria/damske-kadernictvo
/sk/kategoria/nechtove-studio
...

# District pages (generate for all 79 districts)
/sk/salony/bratislava-i
/sk/salony/kosice-i
...

# Category + District combos (high-value SEO pages)
/sk/kategoria/damske-kadernictvo/bratislava
/sk/kategoria/masazny-salon/kosice
...

# Individual salon pages
/sk/salon/kadernictvo-maria-bratislava
```

### Target Keywords (Examples)

| Category | Keywords (SK) |
|----------|---------------|
| Hairdresser | kaderníctvo bratislava, kadernícky salón, dámske kaderníctvo |
| Nails | nechtové štúdio, gélové nechty bratislava, manikúra |
| Massage | masážny salón, masáže bratislava, relaxačná masáž |
| Barber | barber bratislava, pánske kaderníctvo, holičstvo |

### Schema.org Structured Data

Every salon page will include:
```json
{
  "@context": "https://schema.org",
  "@type": "BeautySalon",
  "name": "Salón Mária",
  "image": "...",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "...",
    "addressLocality": "Bratislava",
    "addressCountry": "SK"
  },
  "telephone": "+421...",
  "openingHoursSpecification": [...],
  "priceRange": "€€"
}
```

---

## 10. Security Checklist

| # | Security Measure | Implementation |
|---|------------------|----------------|
| 1 | HTTPS | Vercel provides automatic SSL |
| 2 | SQL Injection | Supabase parameterized queries + RLS |
| 3 | XSS | React auto-escaping + Content Security Policy |
| 4 | CSRF | SameSite cookies + token validation |
| 5 | Authentication | Supabase Auth with secure session handling |
| 6 | Authorization | Row Level Security policies |
| 7 | File Uploads | Type validation, size limits, virus scanning |
| 8 | Rate Limiting | Vercel Edge + custom middleware |
| 9 | Input Validation | Zod schemas on client and server |
| 10 | Security Headers | Strict-Transport-Security, X-Frame-Options, etc. |
| 11 | Admin Protection | Separate auth, optional 2FA |
| 12 | API Protection | Authentication required, rate limited |
| 13 | Environment Variables | Never exposed to client |
| 14 | Dependencies | Regular updates, security audits |

---

## 11. Timeline

### Gantt Chart Overview

```
Week 1-2:   ████████████████████  Project Setup & Foundation
Week 3-4:   ████████████████████  Core Frontend
Week 5-6:   ████████████████████  User Auth & Dashboard
Week 7-8:   ████████████████████  Admin Dashboard
Week 9-10:  ████████████████████  Payments & Subscriptions
Week 11-12: ████████████████████  SEO & Performance
Week 13:    ██████████            Security & Legal
Week 14:    ██████████            Testing & Launch

Total: ~14 weeks (3.5 months)
```

### Key Milestones

| Week | Milestone |
|------|-----------|
| 2 | Project foundation complete, design system ready |
| 4 | Homepage and listing pages functional |
| 6 | User registration and salon management working |
| 8 | Admin dashboard complete |
| 10 | Payments integrated, subscriptions working |
| 12 | SEO optimized, 100/100 PageSpeed |
| 14 | **LAUNCH** 🚀 |

---

## Next Steps

1. **You do:** Complete Step 1 (create all accounts) and Step 2 (prepare assets)
2. **I do:** Set up project structure and begin development
3. **Together:** Review each phase before moving to next

---

**Document Version:** 1.0  
**Last Updated:** December 12, 2024  
**Status:** Planning Complete - Ready for Development
