import type { Metadata } from 'next';
import sitemap from '../sitemap';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: 'Mapa stránky | Register salónov',
    description: 'Prehľad verejných stránok, kategórií, miest a salónov v registri salónov.',
};

function labelForUrl(url: string) {
    const path = new URL(url).pathname;

    if (path === '/') {
        return 'Domov';
    }

    return path
        .split('/')
        .filter(Boolean)
        .map((part) => part.replace(/-/g, ' '))
        .join(' / ');
}

export default async function HtmlSitemapPage() {
    const entries = await sitemap();
    const uniqueEntries = Array.from(new Map(entries.map((entry) => [entry.url, entry])).values());

    return (
        <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '48px 20px' }}>
            <p style={{ color: '#9a7a35', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Register salónov
            </p>
            <h1 style={{ margin: '12px 0 0', fontSize: 'clamp(2rem, 5vw, 3rem)', lineHeight: 1.1 }}>
                Mapa stránky
            </h1>
            <p style={{ marginTop: '16px', maxWidth: '680px', color: '#555', lineHeight: 1.7 }}>
                Verejný prehľad hlavných stránok, kategórií, miest a schválených salónov dostupných vo vyhľadávaní.
            </p>

            <ol
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: '12px',
                    padding: 0,
                    margin: '36px 0 0',
                    listStyle: 'none',
                }}
            >
                {uniqueEntries.map((entry) => (
                    <li key={entry.url}>
                        <a
                            href={entry.url}
                            style={{
                                display: 'block',
                                border: '1px solid #eadfca',
                                borderRadius: '8px',
                                padding: '12px 14px',
                                color: '#221b13',
                                textDecoration: 'none',
                                fontWeight: 600,
                            }}
                        >
                            {labelForUrl(entry.url)}
                        </a>
                    </li>
                ))}
            </ol>
        </main>
    );
}
