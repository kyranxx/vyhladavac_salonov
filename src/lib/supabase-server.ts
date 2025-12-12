import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export function createServerSupabaseClient() {
    const cookieStore = cookies();

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value;
                },
                set(name: string, value: string, options: CookieOptions) {
                    try {
                        cookieStore.set({ name, value, ...options });
                    } catch (error) {
                        // Silent fail for SSR
                    }
                },
                remove(name: string, options: CookieOptions) {
                    try {
                        cookieStore.set({ name, value: '', ...options });
                    } catch (error) {
                        // Silent fail for SSR
                    }
                },
            },
        }
    );
}

export async function getUser() {
    const supabase = createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    return user;
}

export async function getSession() {
    const supabase = createServerSupabaseClient();
    const { data: { session } } = await supabase.auth.getSession();
    return session;
}
