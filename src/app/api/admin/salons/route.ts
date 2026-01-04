import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { sendEmail, emailTemplates } from '@/lib/email';

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
            .select('*, profiles:owner_id(email, first_name, last_name), companies(name, display_id)')
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

        // Get salon info before update (for email)
        const { data: salonBefore } = await supabaseAdmin
            .from('salons')
            .select('name, status, owner_id, profiles:owner_id(email)')
            .eq('id', id)
            .single();

        const { data, error } = await supabaseAdmin
            .from('salons')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        // Send email notifications based on status change
        if (salonBefore && updates.status) {
            const ownerEmail = (salonBefore.profiles as { email?: string })?.email;

            if (ownerEmail) {
                // Get email settings from localStorage simulation - in production use DB
                // For now, always send if email is configured

                if (updates.status === 'approved' && salonBefore.status !== 'approved') {
                    // Salon was approved - notify owner
                    const template = emailTemplates.salonApproved(salonBefore.name);
                    await sendEmail({
                        to: ownerEmail,
                        subject: template.subject,
                        html: template.html
                    });
                    console.log(`[Email] Sent approval notification to ${ownerEmail}`);
                }

                if (updates.status === 'rejected' && salonBefore.status !== 'rejected') {
                    // Salon was rejected - notify owner
                    const reason = updates.rejection_reason || 'Dôvod nebol uvedený';
                    const template = emailTemplates.salonRejected(salonBefore.name, reason);
                    await sendEmail({
                        to: ownerEmail,
                        subject: template.subject,
                        html: template.html
                    });
                    console.log(`[Email] Sent rejection notification to ${ownerEmail}`);
                }
            }
        }

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
