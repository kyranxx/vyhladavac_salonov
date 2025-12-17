import { createServerSupabaseClient } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    const type = requestUrl.searchParams.get('type'); // 'signup', 'recovery', 'magiclink', etc.

    // Get the redirect URL from cookie (set before OAuth redirect)
    const redirectTo = request.cookies.get('auth_redirect')?.value || '/';

    if (code) {
        const supabase = createServerSupabaseClient();
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);

        if (error) {
            console.error('Auth callback error:', error);
            return NextResponse.redirect(new URL('/auth/email-confirmed?error=auth_error', request.url));
        }

        // If this is a new signup, ensure profile exists
        if (data?.user) {
            const { data: existingProfile } = await supabase
                .from('profiles')
                .select('id')
                .eq('id', data.user.id)
                .single();

            // Create profile if it doesn't exist
            if (!existingProfile) {
                const { error: profileError } = await supabase
                    .from('profiles')
                    .insert({
                        id: data.user.id,
                        email: data.user.email,
                        full_name: data.user.user_metadata?.full_name || null,
                        avatar_url: data.user.user_metadata?.avatar_url || null,
                        role: 'user',
                    });

                if (profileError) {
                    console.error('Profile creation error:', profileError);
                }
            }
        }
    }

    // Redirect to confirmation page for email confirmations
    if (type === 'signup' || type === 'email') {
        return NextResponse.redirect(new URL('/auth/email-confirmed', request.url));
    }

    // Create response and clear the redirect cookie
    const response = NextResponse.redirect(new URL(redirectTo, request.url));
    response.cookies.delete('auth_redirect');

    return response;
}
