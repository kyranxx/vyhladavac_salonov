'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import styles from './LanguageSwitcher.module.css';

const languages = [
    { code: 'sk', name: 'Slovenčina', flag: '🇸🇰' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'hu', name: 'Magyar', flag: '🇭🇺' },
];

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
        <div className={styles.wrapper} ref={dropdownRef}>
            <button
                className={styles.trigger}
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
                aria-haspopup="true"
            >
                <span className={styles.flag}>{currentLanguage.flag}</span>
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
                            <span className={styles.flag}>{lang.flag}</span>
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
