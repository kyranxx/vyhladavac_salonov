'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './PhoneInput.module.css';

interface PhoneInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    required?: boolean;
    id?: string;
}

// Format phone number to international Slovak format
const formatPhoneNumber = (phone: string): string => {
    // Remove all non-digits
    let digits = phone.replace(/\D/g, '');

    // If starts with 0, assume Slovak number without country code
    if (digits.startsWith('0')) {
        digits = '421' + digits.substring(1);
    }

    // If doesn't start with country code, assume Slovak
    if (!digits.startsWith('421') && digits.length <= 9) {
        digits = '421' + digits;
    }

    // Format as +421 XXX XXX XXX
    if (digits.length >= 3) {
        let formatted = '+' + digits.substring(0, 3);
        if (digits.length > 3) {
            formatted += ' ' + digits.substring(3, 6);
        }
        if (digits.length > 6) {
            formatted += ' ' + digits.substring(6, 9);
        }
        if (digits.length > 9) {
            formatted += ' ' + digits.substring(9, 12);
        }
        return formatted;
    }

    return phone;
};

// Validate Slovak phone number
const isValidSlovakPhone = (phone: string): boolean => {
    const digits = phone.replace(/\D/g, '');
    // Slovak numbers: 421 + 9 digits = 12 total
    return digits.length === 12 && digits.startsWith('421');
};

export function PhoneInput({ value, onChange, placeholder = '+421 9XX XXX XXX', required, id }: PhoneInputProps) {
    const [_isFocused, setIsFocused] = useState(false);
    const [displayValue, setDisplayValue] = useState(value || '+421 ');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (value && value !== displayValue.replace(/\s/g, '')) {
            setDisplayValue(formatPhoneNumber(value));
        }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let newValue = e.target.value;

        // Always keep +421 prefix
        if (!newValue.startsWith('+421')) {
            newValue = '+421 ' + newValue.replace(/^\+?421?\s*/, '');
        }

        const formatted = formatPhoneNumber(newValue);
        setDisplayValue(formatted);

        // Pass clean number to parent
        const cleanNumber = formatted.replace(/\s/g, '');
        onChange(cleanNumber);
    };

    const handleFocus = () => {
        setIsFocused(true);
        if (!displayValue || displayValue === '+421') {
            setDisplayValue('+421 ');
        }
    };

    const handleBlur = () => {
        setIsFocused(false);
        // Format on blur
        if (displayValue) {
            const formatted = formatPhoneNumber(displayValue);
            setDisplayValue(formatted);
        }
    };

    const isValid = !displayValue || displayValue === '+421 ' || isValidSlovakPhone(displayValue);

    return (
        <div className={styles.container}>
            <div className={styles.flag}>🇸🇰</div>
            <input
                ref={inputRef}
                type="tel"
                id={id}
                value={displayValue}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder={placeholder}
                required={required}
                className={`${styles.input} ${!isValid ? styles.invalid : ''}`}
            />
            {!isValid && displayValue.length > 5 && (
                <span className={styles.error}>Neplatné číslo</span>
            )}
        </div>
    );
}
