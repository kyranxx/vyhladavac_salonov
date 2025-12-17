'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';

/**
 * Google One Tap component that shows a sign-in prompt
 * Triggers immediately when user is not logged in
 */
export function GoogleOneTap() {
    const { user, signInWithGoogle } = useAuth();
    const [showPrompt, setShowPrompt] = useState(false);
    const [dismissed, setDismissed] = useState(false);

    useEffect(() => {
        // Don't show if user is logged in or has dismissed
        if (user || dismissed) {
            setShowPrompt(false);
            return;
        }

        // Check if already dismissed in this session
        const wasDismissed = sessionStorage.getItem('google-onetap-dismissed');
        if (wasDismissed) {
            setDismissed(true);
            return;
        }

        // Show prompt after a short delay (1.5s)
        const timer = setTimeout(() => {
            setShowPrompt(true);
        }, 1500);

        return () => clearTimeout(timer);
    }, [user, dismissed]);

    const handleSignIn = () => {
        setShowPrompt(false);
        signInWithGoogle();
    };

    const handleDismiss = () => {
        setDismissed(true);
        setShowPrompt(false);
        sessionStorage.setItem('google-onetap-dismissed', 'true');
    };

    if (!showPrompt) return null;

    return (
        <div style={{
            position: 'fixed',
            top: '80px',
            right: '20px',
            zIndex: 9999,
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.15)',
            padding: '16px 20px',
            maxWidth: '300px',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            animation: 'googleOneTapSlide 0.3s ease-out',
        }}>
            <style>{`
                @keyframes googleOneTapSlide {
                    from {
                        opacity: 0;
                        transform: translateX(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
            `}</style>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" style={{ flexShrink: 0, marginTop: '2px' }}>
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>

                <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#202124', marginBottom: '8px' }}>
                        Prihláste sa rýchlo cez Google
                    </div>

                    <button
                        onClick={handleSignIn}
                        style={{
                            width: '100%',
                            background: '#1a73e8',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '10px 16px',
                            fontSize: '14px',
                            fontWeight: 500,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                        }}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24">
                            <path fill="white" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="white" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="white" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="white" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Pokračovať s Google
                    </button>

                    <button
                        onClick={handleDismiss}
                        style={{
                            width: '100%',
                            background: 'transparent',
                            color: '#5f6368',
                            border: 'none',
                            padding: '8px',
                            fontSize: '12px',
                            cursor: 'pointer',
                            marginTop: '8px',
                        }}
                    >
                        Teraz nie
                    </button>
                </div>

                <button
                    onClick={handleDismiss}
                    style={{
                        background: 'none',
                        border: 'none',
                        padding: '4px',
                        cursor: 'pointer',
                        color: '#5f6368',
                        fontSize: '18px',
                        lineHeight: 1,
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                    }}
                    aria-label="Zavrieť"
                >
                    ×
                </button>
            </div>
        </div>
    );
}
