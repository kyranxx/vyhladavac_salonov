# 🔌 API Specification

## Base URL
- Development: `http://localhost:3000/api`
- Production: `https://yourdomain.sk/api`

## Authentication
All protected endpoints require Bearer token in header:
```
Authorization: Bearer <access_token>
```

---

## Public Endpoints

### GET /salons
List approved salons with pagination and filters.

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| page | number | Page number (default: 1) |
| limit | number | Items per page (default: 20, max: 50) |
| category | string | Category slug |
| district | string | District slug |
| search | string | Search query |
| sort | string | `newest`, `name` (default: featured first, then newest) |

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Salón Mária",
      "slug": "salon-maria-bratislava",
      "phone": "+421900123456",
      "address": "Hlavná 123",
      "district": { "slug": "bratislava-i", "name_sk": "Bratislava I" },
      "categories": [{ "slug": "damske-kadernictvo", "name_sk": "Dámske kaderníctvo" }],
      "logo_url": "https://...",
      "tier": "premium",
      "is_featured": true,
      "is_verified": false,
      "opening_hours": {...}
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

### GET /salons/:slug
Get salon details by slug.

**Response:** Full salon object with all fields including:
- services (if premium)
- photos (if premium, max 10)
- description, website, social links (if premium)

### GET /categories
List all active categories.

### GET /districts
List all districts, optionally filter by `?major=true` for major cities only.

### GET /search
Search salons.
| Param | Type | Description |
|-------|------|-------------|
| q | string | Search query |
| category | string | Category slug |
| district | string | District slug |

---

## Protected Endpoints (Salon Owners)

### POST /salons
Create new salon (requires auth).

**Body:**
```json
{
  "name": "Salón Mária",
  "phone": "+421900123456",
  "address": "Hlavná 123",
  "district_id": 1,
  "category_id": 1,
  "opening_hours": {
    "mon": { "open": "09:00", "close": "18:00" },
    "tue": { "open": "09:00", "close": "18:00" }
  }
}
```

### PUT /salons/:id
Update salon (creates change_request for approval).

### POST /salons/:id/photos
Upload photo.
- Multipart form data
- Max 5MB per file
- Formats: JPG, PNG, WebP

### DELETE /salons/:id/photos/:photoId
Delete photo.

### POST /salons/:id/services
Add/update services.

---

## Payment Endpoints

### POST /subscriptions/create-checkout
Create Stripe checkout session.

**Body:**
```json
{
  "salon_id": "uuid",
  "type": "premium_monthly" | "premium_yearly" | "featured" | "verified"
}
```

**Response:**
```json
{
  "checkout_url": "https://checkout.stripe.com/..."
}
```

### POST /subscriptions/webhook
Stripe webhook handler (called by Stripe).

---

## Admin Endpoints

All admin endpoints require admin role.

### GET /admin/salons
List all salons (any status).

### PUT /admin/salons/:id/approve
Approve salon.

### PUT /admin/salons/:id/reject
Reject salon.
**Body:** `{ "note": "Reason for rejection" }`

### GET /admin/change-requests
List pending change requests.

### PUT /admin/change-requests/:id
Approve/reject change.
**Body:** `{ "action": "approve" | "reject", "note": "..." }`

### CRUD /admin/categories
Manage categories.

### CRUD /admin/districts
Manage districts.

### CRUD /admin/banner-ads
Manage banner ads.

### GET /admin/analytics
Get analytics data.
| Param | Type | Description |
|-------|------|-------------|
| from | date | Start date |
| to | date | End date |
| type | string | `views`, `clicks`, `revenue` |

---

## Error Responses

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "details": [
      { "field": "phone", "message": "Invalid phone number" }
    ]
  }
}
```

**Error Codes:**
| Code | HTTP Status | Description |
|------|-------------|-------------|
| VALIDATION_ERROR | 400 | Invalid input |
| UNAUTHORIZED | 401 | Not authenticated |
| FORBIDDEN | 403 | No permission |
| NOT_FOUND | 404 | Resource not found |
| RATE_LIMITED | 429 | Too many requests |
| SERVER_ERROR | 500 | Internal error |

---

## Rate Limits

| Endpoint | Limit | Window |
|----------|-------|--------|
| POST /auth/* | 5 requests | 15 min |
| POST /salons | 3 requests | 1 hour |
| POST /*/photos | 20 requests | 1 day |
| GET /* | 100 requests | 1 min |

---

**Document Version:** 1.0
