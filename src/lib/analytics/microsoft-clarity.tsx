'use client';

import Script from 'next/script';

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

// Identify users (optional - for logged-in users)
export function identifyUser(userId: string, sessionId?: string, pageId?: string) {
    if (typeof window !== 'undefined' && CLARITY_PROJECT_ID) {
        (window as any).clarity('identify', userId, sessionId, pageId);
    }
}

// Set custom tags for better filtering in Clarity
export function setTag(key: string, value: string) {
    if (typeof window !== 'undefined' && CLARITY_PROJECT_ID) {
        (window as any).clarity('set', key, value);
    }
}

// Upgrade session priority (for important sessions like registrations/payments)
export function upgradeSession(reason: string) {
    if (typeof window !== 'undefined' && CLARITY_PROJECT_ID) {
        (window as any).clarity('upgrade', reason);
    }
}
