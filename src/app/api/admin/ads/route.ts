import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET all ads
export async function GET() {
    try {
        const { data, error } = await supabaseAdmin
            .from('banner_ads')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching ads:', error);
        return NextResponse.json({ error: 'Failed to fetch ads' }, { status: 500 });
    }
}

// POST create ad
export async function POST(request: Request) {
    try {
        const body = await request.json();

        const { data, error } = await supabaseAdmin
            .from('banner_ads')
            .insert(body)
            .select()
            .single();

        if (error) throw error;
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error creating ad:', error);
        return NextResponse.json({ error: 'Failed to create ad' }, { status: 500 });
    }
}

// PUT update ad
export async function PUT(request: Request) {
    try {
        const { id, ...updates } = await request.json();

        if (!id) {
            return NextResponse.json({ error: 'Ad ID required' }, { status: 400 });
        }

        const { data, error } = await supabaseAdmin
            .from('banner_ads')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error updating ad:', error);
        return NextResponse.json({ error: 'Failed to update ad' }, { status: 500 });
    }
}

// DELETE ad
export async function DELETE(request: Request) {
    try {
        const { id } = await request.json();

        if (!id) {
            return NextResponse.json({ error: 'Ad ID required' }, { status: 400 });
        }

        const { error } = await supabaseAdmin
            .from('banner_ads')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting ad:', error);
        return NextResponse.json({ error: 'Failed to delete ad' }, { status: 500 });
    }
}
