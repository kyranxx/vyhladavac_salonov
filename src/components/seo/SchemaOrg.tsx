import Script from 'next/script';

// Interface used for type checking in tests
interface _SchemaOrgProps {
    type: 'WebSite' | 'LocalBusiness' | 'Organization' | 'BreadcrumbList';
    data?: Record<string, unknown>;
}

// Main website schema
export function WebsiteSchema() {
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Register salónov',
        alternateName: 'Vyhľadávač salónov',
        url: 'https://vyhladavacsalonov.vercel.app',
        description: 'Najväčší katalóg salónov krásy na Slovensku',
        inLanguage: ['sk', 'en', 'hu'],
        potentialAction: {
            '@type': 'SearchAction',
            target: {
                '@type': 'EntryPoint',
                urlTemplate: 'https://vyhladavacsalonov.vercel.app/salony?q={search_term_string}'
            },
            'query-input': 'required name=search_term_string'
        }
    };

    return (
        <Script
            id="schema-website"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}

// Organization schema
export function OrganizationSchema() {
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Register salónov',
        url: 'https://vyhladavacsalonov.vercel.app',
        logo: 'https://vyhladavacsalonov.vercel.app/logo_register_salonov.png',
        description: 'Najväčší katalóg salónov krásy na Slovensku',
        address: {
            '@type': 'PostalAddress',
            addressCountry: 'SK'
        },
        contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'customer service',
            availableLanguage: ['Slovak', 'English', 'Hungarian']
        },
        sameAs: [
            // Add social media URLs when available
        ]
    };

    return (
        <Script
            id="schema-organization"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}

// Salon/LocalBusiness schema
interface SalonSchemaProps {
    name: string;
    description?: string;
    address: string;
    city: string;
    phone?: string;
    website?: string;
    image?: string;
    rating?: number;
    reviewCount?: number;
    priceRange?: string;
    category?: string;
}

export function SalonSchema({
    name,
    description,
    address,
    city,
    phone,
    website,
    image,
    rating,
    reviewCount,
    priceRange = '€€',
    // category is available for future use 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    category = 'Beauty Salon'
}: SalonSchemaProps) {
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'BeautySalon',
        name,
        description,
        address: {
            '@type': 'PostalAddress',
            streetAddress: address,
            addressLocality: city,
            addressCountry: 'SK'
        },
        telephone: phone,
        url: website,
        image,
        priceRange,
        ...(rating && reviewCount && {
            aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: rating,
                reviewCount: reviewCount
            }
        })
    };

    return (
        <Script
            id={`schema-salon-${name.replace(/\s+/g, '-').toLowerCase()}`}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}

// Breadcrumb schema
interface BreadcrumbItem {
    name: string;
    url: string;
}

export function BreadcrumbSchema({ items }: { items: BreadcrumbItem[] }) {
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url
        }))
    };

    return (
        <Script
            id="schema-breadcrumb"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}

// FAQ Schema for SEO pages
interface FAQItem {
    question: string;
    answer: string;
}

export function FAQSchema({ items }: { items: FAQItem[] }) {
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: items.map(item => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: item.answer
            }
        }))
    };

    return (
        <Script
            id="schema-faq"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}

// Service schema for category pages
export function ServiceSchema({
    name,
    description,
    provider = 'Register salónov'
}: {
    name: string;
    description: string;
    provider?: string;
}) {
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name,
        description,
        provider: {
            '@type': 'Organization',
            name: provider
        },
        areaServed: {
            '@type': 'Country',
            name: 'Slovakia'
        }
    };

    return (
        <Script
            id={`schema-service-${name.replace(/\s+/g, '-').toLowerCase()}`}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}
