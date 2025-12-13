'use client';

import Script from 'next/script';

// Google Analytics
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
                    gtag('config', '${GA_MEASUREMENT_ID}', {
                        page_title: document.title,
                        page_location: window.location.href,
                    });
                `}
            </Script>
        </>
    );
}

// Microsoft Clarity
const CLARITY_PROJECT_ID = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;

export function MicrosoftClarity() {
    if (!CLARITY_PROJECT_ID) {
        return null;
    }

    return (
        <Script id="microsoft-clarity" strategy="afterInteractive">
            {`
                (function(c,l,a,r,i,t,y){
                    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                })(window, document, "clarity", "script", "${CLARITY_PROJECT_ID}");
            `}
        </Script>
    );
}

// Track page views
export function trackPageView(url: string) {
    if (typeof window !== 'undefined' && GA_MEASUREMENT_ID) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).gtag?.('config', GA_MEASUREMENT_ID, {
            page_path: url,
        });
    }
}

// Track custom events
export function trackEvent(action: string, category: string, label?: string, value?: number) {
    if (typeof window !== 'undefined' && GA_MEASUREMENT_ID) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).gtag?.('event', action, {
            event_category: category,
            event_label: label,
            value: value,
        });
    }
}

// Predefined event types for consistency
export const AnalyticsEvents = {
    SALON_VIEW: 'salon_view',
    SALON_CONTACT: 'salon_contact',
    SALON_REGISTER: 'salon_register',
    PREMIUM_CLICK: 'premium_click',
    PAYMENT_START: 'payment_start',
    PAYMENT_SUCCESS: 'payment_success',
    SEARCH: 'search',
    FILTER_USE: 'filter_use',
} as const;
