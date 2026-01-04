import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
    try {
        const { subscriptionId } = await request.json();

        const supabase = createServerSupabaseClient();

        // Update subscription status to canceled
        const { error: updateError } = await supabase
            .from('subscriptions')
            .update({ status: 'canceled' })
            .eq('id', subscriptionId);

        if (updateError) {
            return NextResponse.json({ error: 'Failed to cancel subscription' }, { status: 500 });
        }

        // Also update the salon tier back to free
        const { data: subscription } = await supabase
            .from('subscriptions')
            .select('salon_id')
            .eq('id', subscriptionId)
            .single();

        if (subscription?.salon_id) {
            await supabase
                .from('salons')
                .update({ tier: 'free' })
                .eq('id', subscription.salon_id);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error canceling subscription:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
