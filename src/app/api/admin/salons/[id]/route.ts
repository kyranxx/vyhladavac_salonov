import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET single salon with full details
export async function GET(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;

        // Try to get salon with all related data
        let salon = null;
        let queryError = null;

        // First try with all relations
        const { data: fullSalon, error: fullError } = await supabaseAdmin
            .from('salons')
            .select(`
                *,
                salon_categories(category:categories(*)),
                services(*),
                opening_hours(*),
                photos(*)
            `)
            .eq('id', id)
            .single();

        if (fullError) {
            // If error is about relations, try simpler query
            if (fullError.message?.includes('relation') || fullError.code === '42P01') {
                const { data: simpleSalon, error: simpleError } = await supabaseAdmin
                    .from('salons')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (simpleError) {
                    queryError = simpleError;
                } else {
                    salon = { ...simpleSalon, salon_categories: [], services: [], opening_hours: [], photos: [] };
                }
            } else if (fullError.code === 'PGRST116') {
                // No rows returned - salon not found
                return NextResponse.json({ error: 'Salon not found' }, { status: 404 });
            } else {
                queryError = fullError;
            }
        } else {
            salon = fullSalon;
        }

        if (queryError) {
            console.error('Salon query error:', queryError);
            throw queryError;
        }

        if (!salon) {
            return NextResponse.json({ error: 'Salon not found' }, { status: 404 });
        }

        // Get owner info
        let owner = null;
        if (salon.owner_id) {
            const { data: ownerData } = await supabaseAdmin
                .from('profiles')
                .select('id, email, full_name')
                .eq('id', salon.owner_id)
                .single();
            owner = ownerData;
        }

        return NextResponse.json({
            ...salon,
            owner: owner || null
        });
    } catch (error) {
        console.error('Error fetching salon:', error);
        return NextResponse.json({ error: 'Failed to fetch salon' }, { status: 500 });
    }
}

// PUT update salon
export async function PUT(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        const updates = await request.json();

        // Remove fields that shouldn't be directly updated
        delete updates.id;
        delete updates.owner_id;
        delete updates.created_at;
        delete updates.salon_categories;
        delete updates.services;
        delete updates.opening_hours;
        delete updates.photos;
        delete updates.owner;

        const { data, error } = await supabaseAdmin
            .from('salons')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error updating salon:', error);
        return NextResponse.json({ error: 'Failed to update salon' }, { status: 500 });
    }
}

// DELETE salon
export async function DELETE(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;

        // Delete related data first
        await supabaseAdmin.from('salon_categories').delete().eq('salon_id', id);
        await supabaseAdmin.from('services').delete().eq('salon_id', id);
        await supabaseAdmin.from('opening_hours').delete().eq('salon_id', id);
        await supabaseAdmin.from('photos').delete().eq('salon_id', id);

        // Delete the salon
        const { error } = await supabaseAdmin
            .from('salons')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting salon:', error);
        return NextResponse.json({ error: 'Failed to delete salon' }, { status: 500 });
    }
}

