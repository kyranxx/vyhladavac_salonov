import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET all subscriptions
export async function GET() {
    try {
        const { data, error } = await supabaseAdmin
            .from('subscriptions')
            .select(`
                *,
                salons(name, city)
            `)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching subscriptions:', error);
            // Return empty array if table doesn't exist
            if (error.code === '42P01') {
                return NextResponse.json([]);
            }
            throw error;
        }
        return NextResponse.json(data || []);
    } catch (error: any) {
        console.error('Error fetching subscriptions:', error);
        return NextResponse.json({ error: error?.message || 'Failed to fetch subscriptions' }, { status: 500 });
    }
}
