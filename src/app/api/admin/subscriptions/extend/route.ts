import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
    try {
        const { subscriptionId, days } = await request.json();

        const supabase = createServerSupabaseClient();

        // Get current subscription
        const { data: subscription, error: fetchError } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('id', subscriptionId)
            .single();

        if (fetchError || !subscription) {
            return NextResponse.json({ error: 'Subscription not found' }, { status: 404 });
        }

        // Calculate new end date
        const currentEnd = new Date(subscription.current_period_end);
        const newEnd = new Date(currentEnd.getTime() + days * 24 * 60 * 60 * 1000);

        // Update subscription
        const { error: updateError } = await supabase
            .from('subscriptions')
            .update({
                current_period_end: newEnd.toISOString(),
                status: 'active'
            })
            .eq('id', subscriptionId);

        if (updateError) {
            return NextResponse.json({ error: 'Failed to update subscription' }, { status: 500 });
        }

        return NextResponse.json({ success: true, newEndDate: newEnd.toISOString() });
    } catch (error) {
        console.error('Error extending subscription:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
