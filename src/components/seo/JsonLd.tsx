'use client';

import { useEffect } from 'react';

interface JsonLdProps {
    data: object;
    id: string;
}

export function JsonLd({ data, id }: JsonLdProps) {
    useEffect(() => {
        // Create and inject the script on client side
        const existingScript = document.getElementById(id);
        if (!existingScript) {
            const script = document.createElement('script');
            script.id = id;
            script.type = 'application/ld+json';
            script.textContent = JSON.stringify(data);
            document.head.appendChild(script);
        }

        return () => {
            const script = document.getElementById(id);
            if (script) {
                script.remove();
            }
        };
    }, [data, id]);

    // Also render server-side for initial HTML
    return (
        <script
            id={id}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
            suppressHydrationWarning
        />
    );
}

// Canonical link component
export function CanonicalLink({ url }: { url: string }) {
    useEffect(() => {
        // Ensure canonical is in head
        const existingCanonical = document.querySelector('link[rel="canonical"]');
        if (!existingCanonical) {
            const link = document.createElement('link');
            link.rel = 'canonical';
            link.href = url;
            document.head.appendChild(link);
        }
    }, [url]);

    return null;
}
