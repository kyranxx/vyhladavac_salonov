import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://vyhladavacsalonov.vercel.app';

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/api/',
                    '/dashboard/',
                    '/admin/',
                    '/prihlasenie',
                    '/registracia',
                ],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
