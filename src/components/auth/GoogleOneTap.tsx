'use client';

import { useEffect, useCallback } from 'react';
import { createBrowserSupabaseClient } from '@/lib/supabase-browser';
import { useAuth } from '@/components/providers/AuthProvider';

interface GoogleOneTapProps {
    onSuccess?: () => void;
}

declare global {
    interface Window {
        google?: {
            accounts: {
                id: {
                    initialize: (config: {
                        client_id: string;
                        callback: (response: { credential: string }) => void;
                        auto_select?: boolean;
                        cancel_on_tap_outside?: boolean;
                        itp_support?: boolean;
                    }) => void;
                    prompt: (callback?: (notification: { isNotDisplayed: () => boolean; isSkippedMoment: () => boolean }) => void) => void;
                    renderButton: (element: HTMLElement, config: {
                        type?: 'standard' | 'icon';
                        theme?: 'outline' | 'filled_blue' | 'filled_black';
                        size?: 'large' | 'medium' | 'small';
                        text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
                        shape?: 'rectangular' | 'pill' | 'circle' | 'square';
                        logo_alignment?: 'left' | 'center';
                        width?: number;
                        locale?: string;
                    }) => void;
                    cancel: () => void;
                };
            };
        };
    }
}

export function GoogleOneTap({ onSuccess }: GoogleOneTapProps) {
    const { user } = useAuth();
    const supabase = createBrowserSupabaseClient();

    const handleCredentialResponse = useCallback(async (response: { credential: string }) => {
        if (!supabase) return;

        try {
            const { data, error } = await supabase.auth.signInWithIdToken({
                provider: 'google',
                token: response.credential,
            });

            if (error) {
                console.error('Google One Tap login error:', error);
                return;
            }

            if (data?.user) {
                console.log('Google One Tap login successful');
                onSuccess?.();
            }
        } catch (error) {
            console.error('Google One Tap error:', error);
        }
    }, [supabase, onSuccess]);

    useEffect(() => {
        // Don't show One Tap if user is already logged in
        if (user) return;

        const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
        if (!clientId) {
            console.warn('Google Client ID not configured for One Tap');
            return;
        }

        // Load Google Identity Services script
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = () => {
            if (window.google) {
                window.google.accounts.id.initialize({
                    client_id: clientId,
                    callback: handleCredentialResponse,
                    auto_select: true,
                    cancel_on_tap_outside: true,
                    itp_support: true,
                });

                // Show One Tap prompt
                window.google.accounts.id.prompt((notification) => {
                    if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
                        console.log('Google One Tap not displayed or skipped');
                    }
                });
            }
        };

        document.head.appendChild(script);

        return () => {
            // Cancel One Tap on unmount
            if (window.google) {
                window.google.accounts.id.cancel();
            }
            script.remove();
        };
    }, [user, handleCredentialResponse]);

    // This component doesn't render anything - One Tap shows as an overlay
    return null;
}

// Separate component for Google Sign-In Button
export function GoogleSignInButton({ onSuccess }: { onSuccess?: () => void }) {
    const { user } = useAuth();
    const supabase = createBrowserSupabaseClient();

    const handleCredentialResponse = useCallback(async (response: { credential: string }) => {
        if (!supabase) return;

        try {
            const { data, error } = await supabase.auth.signInWithIdToken({
                provider: 'google',
                token: response.credential,
            });

            if (error) {
                console.error('Google Sign-In error:', error);
                return;
            }

            if (data?.user) {
                console.log('Google Sign-In successful');
                onSuccess?.();
            }
        } catch (error) {
            console.error('Google Sign-In error:', error);
        }
    }, [supabase, onSuccess]);

    useEffect(() => {
        if (user) return;

        const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
        if (!clientId) return;

        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = () => {
            const buttonContainer = document.getElementById('google-signin-button');
            if (window.google && buttonContainer) {
                window.google.accounts.id.initialize({
                    client_id: clientId,
                    callback: handleCredentialResponse,
                });

                window.google.accounts.id.renderButton(buttonContainer, {
                    type: 'standard',
                    theme: 'outline',
                    size: 'large',
                    text: 'continue_with',
                    shape: 'rectangular',
                    width: 300,
                    locale: 'sk',
                });
            }
        };

        document.head.appendChild(script);

        return () => {
            script.remove();
        };
    }, [user, handleCredentialResponse]);

    return <div id="google-signin-button" style={{ display: 'flex', justifyContent: 'center' }} />;
}
