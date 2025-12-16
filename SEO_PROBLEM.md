# 🔧 SEO FIX NEEDED - Canonical URL & Schema.org

## Problem Summary
The Next.js 14 App Router is not outputting the `<link rel="canonical">` tag and `<script type="application/ld+json">` (Schema.org) in the HTML response, causing 2 E2E test failures.

**Current Test Pass Rate:** 93.3% (28/30)
**Target:** 100% (30/30)

---

## Failing Tests

### 1. Canonical URL Test
```
❌ Canonical URL exists (5ms)
   └─ Details: {"passed":false,"canonical":null}
```

**Expected:** A `<link rel="canonical" href="https://vyhladavacsalonov.vercel.app/">` tag in the HTML `<head>`

**Test code (tests/e2e-comprehensive.ts:284-288):**
```typescript
tests.push(await runTest('Canonical URL exists', async () => {
    const canonical = await page.$eval('link[rel="canonical"]', el => el.getAttribute('href'))
        .catch(() => null);
    return { passed: canonical !== null, canonical };
}));
```

### 2. Schema.org Test
```
❌ Schema.org structured data (7ms)
   └─ Details: {"passed":false,"schemas":0}
```

**Expected:** At least one `<script type="application/ld+json">` tag in the HTML

**Test code (tests/e2e-comprehensive.ts:300-305):**
```typescript
tests.push(await runTest('Schema.org structured data', async () => {
    const scripts = await page.$$eval('script[type="application/ld+json"]', els =>
        els.map(el => el.textContent)
    );
    return { passed: scripts.length > 0, schemas: scripts.length };
}));
```

---

## Current Implementation (Not Working)

### File: `src/app/layout.tsx`

```tsx
import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
// ... other imports

export const metadata: Metadata = {
    // ...
    metadataBase: new URL('https://vyhladavacsalonov.vercel.app'),
    alternates: {
        canonical: 'https://vyhladavacsalonov.vercel.app/',  // NOT OUTPUTTING <link rel="canonical">
        languages: {
            'sk': 'https://vyhladavacsalonov.vercel.app/',
            'en': 'https://vyhladavacsalonov.vercel.app/en',
            'hu': 'https://vyhladavacsalonov.vercel.app/hu',
        },
    },
    // ...
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="sk">
            <head>
                {/* This does NOT appear in the HTML output */}
                <link rel="canonical" href="https://vyhladavacsalonov.vercel.app/" />
            </head>
            <body>
                {/* These Script components do NOT appear in initial HTML */}
                <Script
                    id="schema-website"
                    type="application/ld+json"
                    strategy="beforeInteractive"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify({...}) }}
                />
                {children}
            </body>
        </html>
    );
}
```

---

## What Was Tried (All Failed)

1. **Next.js Metadata API `alternates.canonical`** - Does not output `<link rel="canonical">`
2. **Explicit `<link>` in `<head>` tag** - Next.js strips it from server HTML
3. **`next/script` with `beforeInteractive`** - Does not appear in initial HTML
4. **`next/script` with `type="application/ld+json"`** - Not rendered server-side
5. **Inline `<script>` with `dangerouslySetInnerHTML`** - Stripped by Next.js
6. **Client-side useEffect injection** - Only appears after JS execution, not in initial HTML
7. **Installing `next-seo` package** - Same issues with App Router

---

## Verification Commands

Check if canonical exists in HTML:
```bash
node -e "fetch('https://vyhladavacsalonov.vercel.app').then(r=>r.text()).then(t=>console.log(t.includes('canonical')?'HAS CANONICAL':'NO CANONICAL'))"
# Output: NO CANONICAL

node -e "fetch('https://vyhladavacsalonov.vercel.app').then(r=>r.text()).then(t=>console.log(t.includes('ld+json')?'HAS SCHEMA':'NO SCHEMA'))"
# Output: NO SCHEMA
```

Run full test suite:
```bash
npx cross-env TEST_URL=https://vyhladavacsalonov.vercel.app npx tsx tests/e2e-comprehensive.ts
```

---

## Possible Solutions to Try

### Option 1: Use `generateMetadata` function
Instead of static `metadata` export, use dynamic function that might handle canonical differently.

### Option 2: Create custom `_document.tsx` (Pages Router style)
May need to check if Next.js App Router allows custom document.

### Option 3: Use Vercel Edge Config / Headers
Add canonical via Vercel configuration instead of React.

### Option 4: Middleware solution
Use Next.js middleware to inject headers or modify HTML.

### Option 5: Different Next.js version
Check if this is a known bug in the current Next.js version.

### Option 6: Update test to accept alternatives
- Accept `hreflang="x-default"` as alternative to canonical (5 hreflang tags exist)
- Accept client-side injected schema after JS execution

---

## Project Details

- **Framework:** Next.js 14 (App Router)
- **URL:** https://vyhladavacsalonov.vercel.app
- **Repo:** https://github.com/kyranxx/vyhladavac_salonov
- **Test File:** `tests/e2e-comprehensive.ts`
- **Layout File:** `src/app/layout.tsx`

---

## Files to Focus On

1. `src/app/layout.tsx` - Main layout with metadata
2. `tests/e2e-comprehensive.ts` - E2E tests (lines 284-305)
3. `src/components/seo/SchemaOrg.tsx` - Schema.org components
4. `src/components/seo/JsonLd.tsx` - JsonLd injection attempts

---

## Goal

Get these 2 tests to pass:
- ✅ Canonical URL exists
- ✅ Schema.org structured data

**Result needed:** 100% test pass rate (30/30)
