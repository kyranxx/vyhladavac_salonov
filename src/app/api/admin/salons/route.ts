import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Use service role key to bypass RLS
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET all salons (admin)
export async function GET() {
    try {
        const { data, error } = await supabaseAdmin
            .from('salons')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching salons:', error);
        return NextResponse.json({ error: 'Failed to fetch salons' }, { status: 500 });
    }
}

// PUT update salon status/tier
export async function PUT(request: Request) {
    try {
        const { id, ...updates } = await request.json();

        if (!id) {
            return NextResponse.json({ error: 'Salon ID required' }, { status: 400 });
        }

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
export async function DELETE(request: Request) {
    try {
        const { id } = await request.json();

        if (!id) {
            return NextResponse.json({ error: 'Salon ID required' }, { status: 400 });
        }

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
