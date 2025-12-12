'use client';

import Script from 'next/script';

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export function GoogleAnalytics() {
    if (!GA_MEASUREMENT_ID) {
        return null;
    }

    return (
        <>
            <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
                strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
                {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
            </Script>
        </>
    );
}

// Track page views
export function trackPageView(url: string) {
    if (typeof window !== 'undefined' && GA_MEASUREMENT_ID) {
        (window as any).gtag('config', GA_MEASUREMENT_ID, {
            page_path: url,
        });
    }
}

// Track custom events
export function trackEvent(action: string, category: string, label?: string, value?: number) {
    if (typeof window !== 'undefined' && GA_MEASUREMENT_ID) {
        (window as any).gtag('event', action, {
            event_category: category,
            event_label: label,
            value: value,
        });
    }
}

// Predefined events for Salon Finder
export const SalonEvents = {
    viewSalon: (salonId: string, salonName: string) => {
        trackEvent('view_salon', 'engagement', salonName);
    },
    clickPhone: (salonId: string) => {
        trackEvent('click_phone', 'engagement', salonId);
    },
    clickWebsite: (salonId: string) => {
        trackEvent('click_website', 'engagement', salonId);
    },
    clickBooking: (salonId: string) => {
        trackEvent('click_booking', 'conversion', salonId);
    },
    search: (query: string, resultsCount: number) => {
        trackEvent('search', 'engagement', query, resultsCount);
    },
    filterCategory: (category: string) => {
        trackEvent('filter_category', 'engagement', category);
    },
    filterDistrict: (district: string) => {
        trackEvent('filter_district', 'engagement', district);
    },
    startRegistration: () => {
        trackEvent('start_registration', 'conversion');
    },
    completeRegistration: () => {
        trackEvent('complete_registration', 'conversion');
    },
    startPayment: (product: string, amount: number) => {
        trackEvent('begin_checkout', 'conversion', product, amount);
    },
    completePayment: (product: string, amount: number) => {
        trackEvent('purchase', 'conversion', product, amount);
    },
};
