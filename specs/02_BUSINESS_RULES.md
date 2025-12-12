# 💼 Business Rules & Feature Gating

## Subscription Tiers

### Tier Overview

| Feature | FREE | PREMIUM (3€/mo) | + FEATURED (5€/7d) | + VERIFIED (20€/yr) |
|---------|------|-----------------|--------------------|--------------------|
| **Basic listing** | ✅ | ✅ | ✅ | ✅ |
| Name | ✅ | ✅ | ✅ | ✅ |
| Address | ✅ | ✅ | ✅ | ✅ |
| Phone | ✅ | ✅ | ✅ | ✅ |
| Logo (1 image) | ✅ | ✅ | ✅ | ✅ |
| Opening hours | ✅ | ✅ | ✅ | ✅ |
| Services list (names only) | ✅ | ✅ | ✅ | ✅ |
| 1 category | ✅ | ✅ | ✅ | ✅ |
| **Premium features** | | | | |
| Multiple categories (up to 3) | ❌ | ✅ | ✅ | ✅ |
| Photos (up to 10) | ❌ | ✅ | ✅ | ✅ |
| Services with prices | ❌ | ✅ | ✅ | ✅ |
| Description (SK, EN, HU) | ❌ | ✅ | ✅ | ✅ |
| Website link | ❌ | ✅ | ✅ | ✅ |
| Booking link | ❌ | ✅ | ✅ | ✅ |
| Social links (FB, IG) | ❌ | ✅ | ✅ | ✅ |
| Google Reviews link | ❌ | ✅ | ✅ | ✅ |
| Google Maps link | ❌ | ✅ | ✅ | ✅ |
| Parking info | ❌ | ✅ | ✅ | ✅ |
| Payment methods | ❌ | ✅ | ✅ | ✅ |
| Basic statistics | ❌ | ✅ | ✅ | ✅ |
| **Featured benefits** | | | | |
| Top of listings | ❌ | ❌ | ✅ | ❌ |
| Highlighted card (gold border) | ❌ | ❌ | ✅ | ❌ |
| "Featured" badge | ❌ | ❌ | ✅ | ❌ |
| Priority in search | ❌ | ❌ | ✅ | ❌ |
| **Verified benefits** | | | | |
| Verified badge (blue check) | ❌ | ❌ | ❌ | ✅ |
| Trust signal in listing | ❌ | ❌ | ❌ | ✅ |

---

## Pricing Structure

### Premium Subscription
```
Monthly: 3.00 EUR (auto-renewing)
Yearly:  30.00 EUR (auto-renewing, 2 months free)
```

### Featured Listing
```
7 days: 5.00 EUR (one-time, can be purchased multiple times)
```
- Can be purchased by both FREE and PREMIUM users
- Stacks: if purchased again before expiry, extends duration
- Expires automatically after 7 days

### Verified Badge
```
365 days: 20.00 EUR (one-time, must re-verify annually)
```

**Verification Process:**
1. Salon owner requests verification
2. Admin receives notification
3. Admin verifies:
   - Photos are real (not stock photos)
   - Business exists on Google Maps
   - Phone number answers
   - (Optional) Physical visit
4. Admin approves/rejects with note
5. If approved, badge active for 365 days
6. Reminder email 30 days before expiry

---

## Listing Lifecycle

### States

```
PENDING → APPROVED → [active listing]
       ↘ REJECTED → [can resubmit]
       
APPROVED → SUSPENDED → [hidden from public]
```

| State | Description | Visible to Public | Can Edit |
|-------|-------------|-------------------|----------|
| `pending` | Awaiting admin approval | ❌ | ✅ (owner) |
| `approved` | Active and visible | ✅ | ✅ (creates change request) |
| `rejected` | Rejected by admin | ❌ | ✅ (resubmit) |
| `suspended` | Suspended (policy violation) | ❌ | ❌ |

### Approval Workflow

**New Salon Registration:**
1. User fills registration form
2. Status: `pending`
3. Admin notified via email
4. Admin reviews in dashboard
5. Admin approves → status: `approved`, notification sent
6. OR Admin rejects with note → status: `rejected`, notification sent
7. User can edit and resubmit

**Edit Existing Salon (Approved):**
1. Salon owner makes changes
2. System creates `change_request` record
3. Original data remains visible to public
4. Admin reviews change request
5. Admin approves → changes applied to salon
6. OR Admin rejects → changes discarded, owner notified

**Photo Uploads:**
1. Photo uploaded, stored with `is_approved: false`
2. Visible only to owner until approved
3. Admin approves → `is_approved: true`, visible to public
4. Admin rejects → photo deleted, owner notified

---

## Search & Sorting Logic

### Default Sort Order

1. **Featured listings first** (sorted by `featured_until` DESC - newest featured at very top)
2. **Then by approval date** (`approved_at` DESC - newest first)

### When Category Filter Applied

1. Featured in category → top
2. Then regular by approval date

### When District Filter Applied

1. Featured in district → top
2. Then regular by approval date

### When Both Filters Applied

1. Featured matching both → top
2. Regular matching both by approval date

### Search Query

Uses PostgreSQL full-text search on:
- `name`
- `description_sk`, `description_en`, `description_hu`
- `address`
- Category names
- District names

---

## Statistics & Analytics

### Tracked Events

| Event | Description | Available to |
|-------|-------------|--------------|
| `salon_view` | Salon detail page viewed | Admin, Premium owners |
| `salon_click_phone` | Phone number clicked | Admin, Premium owners |
| `salon_click_website` | Website link clicked | Admin, Premium owners |
| `salon_click_booking` | Booking link clicked | Admin, Premium owners |
| `salon_click_social` | Social link clicked | Admin, Premium owners |
| `search` | Search performed | Admin only |
| `banner_impression` | Banner ad displayed | Admin only |
| `banner_click` | Banner ad clicked | Admin only |

### Dashboard Statistics for Salon Owners

**Premium owners see:**
- Total views (last 7 days, 30 days, all time)
- Phone clicks (last 7 days, 30 days)
- Website clicks (last 7 days, 30 days)
- Booking clicks (last 7 days, 30 days)
- Graph of views over time

**Free owners see:**
- "Upgrade to Premium to see statistics" message
- Blurred preview of stats

---

## Rate Limiting

| Endpoint | Limit | Window |
|----------|-------|--------|
| Login attempts | 5 | 15 minutes |
| Registration | 3 | 1 hour |
| Password reset | 3 | 1 hour |
| Photo upload | 20 | 1 day |
| Contact form | 5 | 1 hour |
| Search API | 60 | 1 minute |
| General API | 100 | 1 minute |

---

## Email Notifications

### To Salon Owners

| Trigger | Subject Template (SK) |
|---------|----------------------|
| Registration submitted | Vaša registrácia bola prijatá |
| Salon approved | Váš salón bol schválený! 🎉 |
| Salon rejected | Potrebujeme úpravy vo vašej registrácii |
| Change request approved | Vaše zmeny boli schválené |
| Change request rejected | Vaše zmeny neboli schválené |
| Subscription created | Ďakujeme za predplatné Premium |
| Subscription renewed | Vaše predplatné bolo obnovené |
| Subscription cancelled | Vaše predplatné bolo zrušené |
| Subscription expiring (7 days) | Vaše predplatné čoskoro vyprší |
| Featured expired | Vaša propagácia skončila |
| Verified expiring (30 days) | Vaša verifikácia čoskoro vyprší |

### To Admin

| Trigger | Subject Template |
|---------|-----------------|
| New salon registration | Nová registrácia: [Salon Name] |
| New change request | Nová žiadosť o zmenu: [Salon Name] |
| New photo awaiting approval | Nová fotka na schválenie |
| Payment received | Platba prijatá: [Amount] EUR |
| Payment failed | Platba zlyhala: [Salon Name] |

---

## Content Guidelines

### Salon Name
- Min 3 characters
- Max 100 characters
- No all-caps
- No excessive punctuation
- No phone numbers

### Description
- Min 50 characters (if provided)
- Max 2000 characters
- No HTML allowed
- No external links (use website field)
- No contact info (use designated fields)

### Photos
- Formats: JPG, PNG, WebP
- Max size: 5MB per photo
- Min resolution: 400x300px
- Max resolution: 4000x3000px (will be resized)
- No watermarks
- No stock photos (verified check for this)
- No inappropriate content

### Services
- Max 50 services per salon
- Name: 3-100 characters
- Price: 0-10,000 EUR
- Duration: 5-480 minutes

---

## SEO Rules

### URL Structure

```
# Category pages
/{lang}/kategoria/{category-slug}
Example: /sk/kategoria/damske-kadernictvo

# District pages  
/{lang}/salony/{district-slug}
Example: /sk/salony/bratislava-i

# Combined pages
/{lang}/kategoria/{category-slug}/{district-slug}
Example: /sk/kategoria/damske-kadernictvo/bratislava

# Salon pages
/{lang}/salon/{salon-slug}
Example: /sk/salon/kadernictvo-maria-bratislava
```

### Slug Generation

```javascript
function generateSlug(name, city) {
  const base = `${name}-${city}`
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9]+/g, '-')     // Replace non-alphanumeric with -
    .replace(/^-+|-+$/g, '')         // Trim leading/trailing -
    .substring(0, 100);              // Max 100 chars
  
  // If exists, append number: salon-maria-bratislava-2
  return checkUniqueness(base);
}
```

### Meta Tags Template

```html
<!-- Category page -->
<title>{Category} v {City} | {SiteName}</title>
<meta name="description" content="Najlepšie {category} v meste {city}. Nájdite a porovnajte {count} salónov. Otváracie hodiny, cenníky, fotky a recenzie.">

<!-- Salon page -->
<title>{SalonName} - {Category} {City} | {SiteName}</title>
<meta name="description" content="{SalonName} - {category} v {city}. {first100CharsOfDescription}...">
```

---

## Admin Dashboard Permissions

For now, single admin role. Future-ready for multiple roles:

| Permission | Admin |
|------------|-------|
| View all salons | ✅ |
| Approve/reject salons | ✅ |
| Edit any salon | ✅ |
| Delete salons | ✅ |
| Manage categories | ✅ |
| Manage districts | ✅ |
| Manage banner ads | ✅ |
| View all statistics | ✅ |
| Export data | ✅ |
| Manage users | ✅ |
| Access settings | ✅ |

---

**Document Version:** 1.0  
**Last Updated:** December 12, 2024
