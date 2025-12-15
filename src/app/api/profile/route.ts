import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Use service role key to bypass RLS
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
    try {
        const { userId, email, fullName, avatarUrl } = await request.json();

        if (!userId || !email) {
            return NextResponse.json(
                { error: 'userId and email are required' },
                { status: 400 }
            );
        }

        // Check if profile already exists
        const { data: existingProfile } = await supabaseAdmin
            .from('profiles')
            .select('id')
            .eq('id', userId)
            .single();

        if (existingProfile) {
            return NextResponse.json({ success: true, message: 'Profile already exists' });
        }

        // Create profile
        const { error } = await supabaseAdmin
            .from('profiles')
            .insert({
                id: userId,
                email: email,
                full_name: fullName || null,
                avatar_url: avatarUrl || null,
                role: 'user',
            });

        if (error) {
            console.error('Error creating profile:', error);
            return NextResponse.json(
                { error: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, message: 'Profile created' });
    } catch (error) {
        console.error('Profile creation error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
