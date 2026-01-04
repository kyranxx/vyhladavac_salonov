import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
    try {
        const { subscriptionId } = await request.json();

        const supabase = createServerSupabaseClient();

        // Get subscription to find plan type
        const { data: subscription } = await supabase
            .from('subscriptions')
            .select('salon_id, plan_type')
            .eq('id', subscriptionId)
            .single();

        // Calculate new period (30 days from now)
        const now = new Date();
        const endDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

        // Update subscription status to active with new period
        const { error: updateError } = await supabase
            .from('subscriptions')
            .update({
                status: 'active',
                current_period_start: now.toISOString(),
                current_period_end: endDate.toISOString()
            })
            .eq('id', subscriptionId);

        if (updateError) {
            return NextResponse.json({ error: 'Failed to reactivate subscription' }, { status: 500 });
        }

        // Also update the salon tier back to premium
        if (subscription?.salon_id) {
            await supabase
                .from('salons')
                .update({ tier: 'premium' })
                .eq('id', subscription.salon_id);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error reactivating subscription:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
