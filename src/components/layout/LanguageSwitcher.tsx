'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import styles from './LanguageSwitcher.module.css';

const languages = [
    { code: 'sk', name: 'Slovenčina', flag: 'SK' },
    { code: 'en', name: 'English', flag: 'GB' },
    { code: 'hu', name: 'Magyar', flag: 'HU' },
];

// Flag component with proper SVG flags
function Flag({ code }: { code: string }) {
    switch (code) {
        case 'SK':
            return (
                <svg className={styles.flagIcon} viewBox="0 0 640 480">
                    <path fill="#ee1c25" d="M0 0h640v480H0z" />
                    <path fill="#0b4ea2" d="M0 0h640v320H0z" />
                    <path fill="#fff" d="M0 0h640v160H0z" />
                    <path fill="#fff" d="M233 370.8c-43-20.7-104.6-61.9-104.6-143.2 0-81.4 4-118.4 4-118.4h201.3s4 37 4 118.4c0 81.3-61.6 122.5-104.7 143.2z" />
                    <path fill="#ee1c25" d="M233 360c-39.5-19-96-56.8-96-131.4s3.6-108.6 3.6-108.6h184.8s3.6 34 3.6 108.6S272.5 341 233 360z" />
                    <path fill="#fff" d="M241.4 209c10.7-.5 31.5-2.4 31.5-2.4s-6.5-12.5-6.5-27.3c0-14.9 6.5-27.4 6.5-27.4s-20.8-1.9-31.5-2.4v-26.8h-16.8v26.8c-10.7.5-31.5 2.4-31.5 2.4s6.5 12.5 6.5 27.4c0 14.8-6.5 27.3-6.5 27.3s20.8 1.9 31.5 2.4v26.5h-50v17.8h50v48.3h16.8v-48.3h50v-17.8h-50V209z" />
                    <path fill="#0b4ea2" d="M233 308.3c-7.3 0-24.5 12.5-37 18.8 13 8.7 26.5 16.5 37 21 10.5-4.5 24-12.3 37-21-12.5-6.3-29.7-18.8-37-18.8z" />
                </svg>
            );
        case 'GB':
            return (
                <svg className={styles.flagIcon} viewBox="0 0 640 480">
                    <path fill="#012169" d="M0 0h640v480H0z" />
                    <path fill="#FFF" d="m75 0 244 181L562 0h78v62L400 241l240 178v61h-80L320 301 81 480H0v-60l239-178L0 64V0h75z" />
                    <path fill="#C8102E" d="m424 281 216 159v40L369 281h55zm-184 20 6 35L54 480H0l240-179zM640 0v3L391 191l2-44L590 0h50zM0 0l239 176h-60L0 42V0z" />
                    <path fill="#FFF" d="M241 0v480h160V0H241zM0 160v160h640V160H0z" />
                    <path fill="#C8102E" d="M0 193v96h640v-96H0zM273 0v480h96V0h-96z" />
                </svg>
            );
        case 'HU':
            return (
                <svg className={styles.flagIcon} viewBox="0 0 640 480">
                    <g fillRule="evenodd">
                        <path fill="#fff" d="M640 480H0V0h640z" />
                        <path fill="#388d00" d="M640 480H0V320h640z" />
                        <path fill="#d43516" d="M640 160.1H0V.1h640z" />
                    </g>
                </svg>
            );
        default:
            return null;
    }
}

export function LanguageSwitcher() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Get current locale from pathname
    const getCurrentLocale = () => {
        const segments = pathname.split('/');
        if (languages.some((lang) => lang.code === segments[1])) {
            return segments[1];
        }
        return 'sk'; // Default locale
    };

    const currentLocale = getCurrentLocale();
    const currentLanguage = languages.find((l) => l.code === currentLocale) || languages[0];

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const switchLanguage = (langCode: string) => {
        const segments = pathname.split('/');

        // Check if current path has a locale prefix
        if (languages.some((lang) => lang.code === segments[1])) {
            segments[1] = langCode;
        } else {
            // Add locale prefix for non-default languages
            if (langCode !== 'sk') {
                segments.splice(1, 0, langCode);
            }
        }

        // Remove locale prefix for Slovak (default)
        if (langCode === 'sk' && segments[1] === 'sk') {
            segments.splice(1, 1);
        }

        router.push(segments.join('/') || '/');
        setIsOpen(false);
    };

    return (
        <div className={styles.wrapper} ref={dropdownRef} data-testid="language-switcher">
            <button
                className={styles.trigger}
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
                aria-haspopup="true"
            >
                <Flag code={currentLanguage.flag} />
                <span className={styles.code}>{currentLanguage.code.toUpperCase()}</span>
                <span className={styles.arrow}>{isOpen ? '▲' : '▼'}</span>
            </button>

            {isOpen && (
                <div className={styles.dropdown}>
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            className={`${styles.option} ${lang.code === currentLocale ? styles.active : ''}`}
                            onClick={() => switchLanguage(lang.code)}
                        >
                            <Flag code={lang.flag} />
                            <span className={styles.name}>{lang.name}</span>
                            {lang.code === currentLocale && (
                                <span className={styles.check}>✓</span>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
