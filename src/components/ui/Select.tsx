'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './Select.module.css';

interface SelectOption {
    value: string;
    label: string;
    icon?: React.ReactNode;
}

interface SelectProps {
    options: SelectOption[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    label?: string;
    disabled?: boolean;
    searchable?: boolean;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}

export function Select({
    options,
    value,
    onChange,
    placeholder = 'Vyberte...',
    label,
    disabled = false,
    searchable = false,
    className = '',
    size = 'md'
}: SelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    const selectedOption = options.find(opt => opt.value === value);

    // Filter options based on search
    const filteredOptions = searchable && searchQuery
        ? options.filter(opt =>
            opt.label.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : options;

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setSearchQuery('');
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Focus search input when opened
    useEffect(() => {
        if (isOpen && searchable && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isOpen, searchable]);

    const handleSelect = (optionValue: string) => {
        onChange(optionValue);
        setIsOpen(false);
        setSearchQuery('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            setIsOpen(false);
            setSearchQuery('');
        } else if (e.key === 'Enter' && !isOpen) {
            setIsOpen(true);
        }
    };

    return (
        <div
            ref={containerRef}
            className={`${styles.container} ${className} ${styles[size]}`}
            onKeyDown={handleKeyDown}
        >
            {label && <label className={styles.label}>{label}</label>}

            <button
                type="button"
                className={`${styles.trigger} ${isOpen ? styles.open : ''} ${disabled ? styles.disabled : ''}`}
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                aria-expanded={isOpen}
                aria-haspopup="listbox"
            >
                <span className={styles.value}>
                    {selectedOption ? (
                        <>
                            {selectedOption.icon && <span className={styles.optionIcon}>{selectedOption.icon}</span>}
                            {selectedOption.label}
                        </>
                    ) : (
                        <span className={styles.placeholder}>{placeholder}</span>
                    )}
                </span>
                <span className={`${styles.chevron} ${isOpen ? styles.chevronUp : ''}`}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="6 9 12 15 18 9" />
                    </svg>
                </span>
            </button>

            {isOpen && (
                <div className={styles.dropdown} role="listbox">
                    {searchable && (
                        <div className={styles.searchContainer}>
                            <input
                                ref={searchInputRef}
                                type="text"
                                className={styles.searchInput}
                                placeholder="Hľadať..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>
                    )}

                    <div className={styles.optionsList}>
                        {filteredOptions.length === 0 ? (
                            <div className={styles.noResults}>Žiadne výsledky</div>
                        ) : (
                            filteredOptions.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    className={`${styles.option} ${option.value === value ? styles.selected : ''}`}
                                    onClick={() => handleSelect(option.value)}
                                    role="option"
                                    aria-selected={option.value === value}
                                >
                                    {option.icon && <span className={styles.optionIcon}>{option.icon}</span>}
                                    <span className={styles.optionLabel}>{option.label}</span>
                                    {option.value === value && (
                                        <span className={styles.checkmark}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <polyline points="20 6 9 17 4 12" />
                                            </svg>
                                        </span>
                                    )}
                                </button>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
