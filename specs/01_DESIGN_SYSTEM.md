# 🎨 Design System Specification

## Brand Identity

**Project:** Salon Finder SK  
**Style:** Friendly, approachable, modern, clean  
**Inspiration:** Airbnb, Grok.com  
**Priority:** Mobile-first, intuitive navigation

---

## Color Palette

### Primary Colors (Beige/Warm)

```css
:root {
  /* Primary - Warm Beige */
  --color-primary-50: #faf8f5;   /* Lightest - backgrounds */
  --color-primary-100: #f5f0e8;  /* Light backgrounds */
  --color-primary-200: #ebe0d0;  /* Hover states */
  --color-primary-300: #dcc9b0;  /* Borders */
  --color-primary-400: #c9a882;  /* Subtle text */
  --color-primary-500: #b08d5b;  /* Primary brand color */
  --color-primary-600: #8f7048;  /* Darker accents */
  --color-primary-700: #6d5638;  /* Dark text */
  --color-primary-800: #4d3d28;  /* Very dark */
  --color-primary-900: #2d2318;  /* Darkest */
}
```

### Neutral Colors (Grey)

```css
:root {
  /* Neutrals - Warm Greys */
  --color-neutral-50: #fafafa;   /* Page background */
  --color-neutral-100: #f5f5f4;  /* Card backgrounds */
  --color-neutral-200: #e7e5e4;  /* Borders, dividers */
  --color-neutral-300: #d6d3d1;  /* Disabled states */
  --color-neutral-400: #a8a29e;  /* Placeholder text */
  --color-neutral-500: #78716c;  /* Secondary text */
  --color-neutral-600: #57534e;  /* Body text */
  --color-neutral-700: #44403c;  /* Headings */
  --color-neutral-800: #292524;  /* Strong text */
  --color-neutral-900: #1c1917;  /* Darkest text */
}
```

### Semantic Colors

```css
:root {
  /* Success */
  --color-success-50: #f0fdf4;
  --color-success-500: #22c55e;
  --color-success-700: #15803d;
  
  /* Error */
  --color-error-50: #fef2f2;
  --color-error-500: #ef4444;
  --color-error-700: #b91c1c;
  
  /* Warning */
  --color-warning-50: #fffbeb;
  --color-warning-500: #f59e0b;
  --color-warning-700: #b45309;
  
  /* Info */
  --color-info-50: #eff6ff;
  --color-info-500: #3b82f6;
  --color-info-700: #1d4ed8;
}
```

### Special Colors

```css
:root {
  /* Featured/Premium - Subtle Gold */
  --color-featured-bg: #fef9e7;
  --color-featured-border: #f4d03f;
  --color-featured-text: #9a7b4f;
  
  /* Verified Badge - Blue check */
  --color-verified: #3b82f6;
  
  /* Premium Badge - Gold */
  --color-premium: #d4af37;
}
```

---

## Typography

### Font Family

```css
:root {
  /* Primary Font - Clean, modern, readable */
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  
  /* Monospace - for code/prices */
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
}
```

**Google Fonts Import:**
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

### Font Sizes (Mobile-first)

```css
:root {
  --text-xs: 0.75rem;     /* 12px */
  --text-sm: 0.875rem;    /* 14px */
  --text-base: 1rem;      /* 16px */
  --text-lg: 1.125rem;    /* 18px */
  --text-xl: 1.25rem;     /* 20px */
  --text-2xl: 1.5rem;     /* 24px */
  --text-3xl: 1.875rem;   /* 30px */
  --text-4xl: 2.25rem;    /* 36px */
  --text-5xl: 3rem;       /* 48px */
}
```

### Font Weights

```css
:root {
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
}
```

### Line Heights

```css
:root {
  --leading-tight: 1.25;
  --leading-snug: 1.375;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;
}
```

---

## Spacing Scale

```css
:root {
  --space-0: 0;
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.25rem;   /* 20px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
  --space-20: 5rem;     /* 80px */
  --space-24: 6rem;     /* 96px */
}
```

---

## Border Radius

```css
:root {
  --radius-none: 0;
  --radius-sm: 0.25rem;   /* 4px - subtle */
  --radius-md: 0.5rem;    /* 8px - buttons, inputs */
  --radius-lg: 0.75rem;   /* 12px - cards */
  --radius-xl: 1rem;      /* 16px - modals */
  --radius-2xl: 1.5rem;   /* 24px - large cards */
  --radius-full: 9999px;  /* Pills, avatars */
}
```

---

## Shadows

```css
:root {
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  
  /* Card hover effect */
  --shadow-card: 0 2px 8px rgba(0, 0, 0, 0.08);
  --shadow-card-hover: 0 8px 24px rgba(0, 0, 0, 0.12);
}
```

---

## Breakpoints (Mobile-first)

```css
/* Default: Mobile (< 640px) */

/* sm: Small tablets */
@media (min-width: 640px) { }

/* md: Tablets */
@media (min-width: 768px) { }

/* lg: Laptops */
@media (min-width: 1024px) { }

/* xl: Desktops */
@media (min-width: 1280px) { }

/* 2xl: Large screens */
@media (min-width: 1536px) { }
```

### Container Widths

```css
:root {
  --container-sm: 640px;
  --container-md: 768px;
  --container-lg: 1024px;
  --container-xl: 1280px;
  --container-2xl: 1400px;  /* Max content width */
}
```

---

## Component Styles

### Buttons

```css
/* Base button */
.btn {
  font-weight: var(--font-medium);
  font-size: var(--text-sm);
  padding: var(--space-3) var(--space-5);
  border-radius: var(--radius-md);
  transition: all 0.2s ease;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
}

/* Primary button - filled beige */
.btn-primary {
  background: var(--color-primary-500);
  color: white;
}
.btn-primary:hover {
  background: var(--color-primary-600);
}

/* Secondary button - outlined */
.btn-secondary {
  background: transparent;
  border: 1px solid var(--color-neutral-300);
  color: var(--color-neutral-700);
}
.btn-secondary:hover {
  background: var(--color-neutral-100);
  border-color: var(--color-neutral-400);
}

/* Ghost button - no border */
.btn-ghost {
  background: transparent;
  color: var(--color-neutral-600);
}
.btn-ghost:hover {
  background: var(--color-neutral-100);
}

/* Sizes */
.btn-sm { padding: var(--space-2) var(--space-3); font-size: var(--text-xs); }
.btn-lg { padding: var(--space-4) var(--space-6); font-size: var(--text-base); }
```

### Input Fields

```css
.input {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  font-size: var(--text-base);
  border: 1px solid var(--color-neutral-300);
  border-radius: var(--radius-md);
  background: white;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.input:focus {
  outline: none;
  border-color: var(--color-primary-500);
  box-shadow: 0 0 0 3px var(--color-primary-100);
}

.input::placeholder {
  color: var(--color-neutral-400);
}

.input-error {
  border-color: var(--color-error-500);
}
```

### Cards

```css
.card {
  background: white;
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-neutral-200);
  overflow: hidden;
  transition: box-shadow 0.2s, transform 0.2s;
}

.card:hover {
  box-shadow: var(--shadow-card-hover);
  transform: translateY(-2px);
}

/* Featured card - gold border */
.card-featured {
  border: 2px solid var(--color-featured-border);
  background: var(--color-featured-bg);
}
```

### Badges

```css
.badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-1) var(--space-2);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  border-radius: var(--radius-full);
}

.badge-premium {
  background: linear-gradient(135deg, #f4d03f 0%, #d4af37 100%);
  color: white;
}

.badge-verified {
  background: var(--color-info-50);
  color: var(--color-info-700);
}

.badge-featured {
  background: var(--color-featured-bg);
  color: var(--color-featured-text);
  border: 1px solid var(--color-featured-border);
}
```

---

## Animation & Transitions

```css
:root {
  --transition-fast: 0.1s ease;
  --transition-base: 0.2s ease;
  --transition-slow: 0.3s ease;
}

/* Skeleton loading animation */
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.skeleton {
  background: linear-gradient(
    90deg,
    var(--color-neutral-200) 25%,
    var(--color-neutral-100) 50%,
    var(--color-neutral-200) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: var(--radius-md);
}

/* Fade in animation */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-in {
  animation: fadeIn 0.3s ease forwards;
}
```

---

## Icons

Use **Lucide React** icons (MIT license, consistent style):

```bash
npm install lucide-react
```

### Common Icons Used

| Icon | Usage |
|------|-------|
| `Search` | Search bar |
| `MapPin` | Location/address |
| `Phone` | Phone number |
| `Globe` | Website link |
| `Clock` | Opening hours |
| `Star` | Ratings/featured |
| `Check` | Verified badge |
| `Camera` | Photo upload |
| `Settings` | Settings |
| `User` | User account |
| `Menu` | Mobile menu |
| `X` | Close/cancel |
| `ChevronRight` | Breadcrumbs |
| `ExternalLink` | External links |
| `Facebook` | Facebook link |
| `Instagram` | Instagram link |

---

## Z-Index Scale

```css
:root {
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-fixed: 300;
  --z-modal-backdrop: 400;
  --z-modal: 500;
  --z-toast: 600;
  --z-tooltip: 700;
}
```

---

## Grid Layouts

### Salon Cards Grid

```css
/* Mobile: 1 column */
.salon-grid {
  display: grid;
  gap: var(--space-4);
  grid-template-columns: 1fr;
}

/* Tablet: 2 columns */
@media (min-width: 640px) {
  .salon-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop: 3 columns */
@media (min-width: 1024px) {
  .salon-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Large: 4 columns */
@media (min-width: 1280px) {
  .salon-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

### Category Grid

```css
.category-grid {
  display: grid;
  gap: var(--space-3);
  grid-template-columns: repeat(2, 1fr);
}

@media (min-width: 640px) {
  .category-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1024px) {
  .category-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (min-width: 1280px) {
  .category-grid {
    grid-template-columns: repeat(5, 1fr);
  }
}
```

---

## Accessibility Guidelines

1. **Color contrast:** All text meets WCAG AA (4.5:1 for normal text)
2. **Focus states:** All interactive elements have visible focus indicators
3. **Touch targets:** Minimum 44x44px for mobile
4. **Alt text:** All images have descriptive alt text
5. **Semantic HTML:** Use proper heading hierarchy
6. **Keyboard navigation:** All features accessible via keyboard

---

## Dark Mode (Future)

Not for MVP, but design with dark mode in mind:
- Use CSS variables for all colors
- Avoid hardcoded colors in components
- Test contrast ratios for both modes

---

**Document Version:** 1.0  
**Last Updated:** December 12, 2024
