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

        if (error) {
            console.error('Error fetching ads:', error);
            // Return empty array if table doesn't exist
            if (error.code === '42P01') {
                return NextResponse.json([]);
            }
            throw error;
        }
        return NextResponse.json(data || []);
    } catch (error: any) {
        console.error('Error fetching ads:', error);
        return NextResponse.json({ error: error?.message || 'Failed to fetch ads' }, { status: 500 });
    }
}

// POST create ad
export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Validate required fields
        if (!body.name || !body.image_url || !body.link_url) {
            return NextResponse.json({
                error: 'Vyžadované polia: name, image_url, link_url'
            }, { status: 400 });
        }

        // Map frontend field names to database field names if needed
        const adData = {
            name: body.name,
            placement: body.placement || 'sidebar',
            image_url: body.image_url,
            link_url: body.link_url,
            expires_at: body.expires_at || null,
            status: body.status || 'active',
            impressions: body.impressions || 0,
            clicks: body.clicks || 0,
        };

        const { data, error } = await supabaseAdmin
            .from('banner_ads')
            .insert(adData)
            .select()
            .single();

        if (error) {
            console.error('Error creating ad:', error);
            return NextResponse.json({
                error: `Database error: ${error.message}`
            }, { status: 500 });
        }
        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Error creating ad:', error);
        return NextResponse.json({ error: error?.message || 'Failed to create ad' }, { status: 500 });
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

        if (error) {
            console.error('Error updating ad:', error);
            return NextResponse.json({
                error: `Database error: ${error.message}`
            }, { status: 500 });
        }
        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Error updating ad:', error);
        return NextResponse.json({ error: error?.message || 'Failed to update ad' }, { status: 500 });
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

        if (error) {
            console.error('Error deleting ad:', error);
            return NextResponse.json({
                error: `Database error: ${error.message}`
            }, { status: 500 });
        }
        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Error deleting ad:', error);
        return NextResponse.json({ error: error?.message || 'Failed to delete ad' }, { status: 500 });
    }
}
