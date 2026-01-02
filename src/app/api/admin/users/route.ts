import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET all users with their salon counts and details
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '50');
        const search = searchParams.get('search') || '';
        const sortBy = searchParams.get('sortBy') || 'created_at';
        const sortOrder = searchParams.get('sortOrder') || 'desc';

        const offset = (page - 1) * limit;

        // First, get all profiles
        let profilesQuery = supabaseAdmin
            .from('profiles')
            .select('*', { count: 'exact' });

        // Apply search filter on profiles
        if (search) {
            profilesQuery = profilesQuery.or(`email.ilike.%${search}%,full_name.ilike.%${search}%`);
        }

        // Apply sorting
        profilesQuery = profilesQuery.order(sortBy, { ascending: sortOrder === 'asc' });

        // Apply pagination
        profilesQuery = profilesQuery.range(offset, offset + limit - 1);

        const { data: profiles, error: profilesError, count: totalCount } = await profilesQuery;

        if (profilesError) throw profilesError;

        // Get all salons to count per user and also for filtering
        const { data: allSalons, error: salonsError } = await supabaseAdmin
            .from('salons')
            .select('id, owner_id, name, phone, email, status, tier, city');

        if (salonsError) throw salonsError;

        // Create a map of owner_id to their salons
        const salonsByOwner: Record<string, typeof allSalons> = {};
        allSalons?.forEach(salon => {
            if (!salonsByOwner[salon.owner_id]) {
                salonsByOwner[salon.owner_id] = [];
            }
            salonsByOwner[salon.owner_id].push(salon);
        });

        // If searching by salon name or phone, filter users who have matching salons
        let filteredProfiles = profiles || [];
        if (search) {
            const searchLower = search.toLowerCase();
            const ownerIdsWithMatchingSalons = new Set(
                allSalons
                    ?.filter(s => 
                        s.name?.toLowerCase().includes(searchLower) ||
                        s.phone?.includes(search) ||
                        s.email?.toLowerCase().includes(searchLower)
                    )
                    .map(s => s.owner_id)
            );

            // Add users whose salons match the search (if not already included)
            if (ownerIdsWithMatchingSalons.size > 0) {
                const { data: additionalProfiles } = await supabaseAdmin
                    .from('profiles')
                    .select('*')
                    .in('id', Array.from(ownerIdsWithMatchingSalons));

                if (additionalProfiles) {
                    const existingIds = new Set(filteredProfiles.map(p => p.id));
                    additionalProfiles.forEach(p => {
                        if (!existingIds.has(p.id)) {
                            filteredProfiles.push(p);
                        }
                    });
                }
            }
        }

        // Enrich profiles with salon information
        const enrichedProfiles = filteredProfiles.map(profile => {
            const userSalons = salonsByOwner[profile.id] || [];
            return {
                ...profile,
                salon_count: userSalons.length,
                salons: userSalons.map(s => ({
                    id: s.id,
                    name: s.name,
                    status: s.status,
                    tier: s.tier,
                    city: s.city
                }))
            };
        });

        return NextResponse.json({
            users: enrichedProfiles,
            pagination: {
                page,
                limit,
                total: totalCount || filteredProfiles.length,
                totalPages: Math.ceil((totalCount || filteredProfiles.length) / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }
}

// PUT update user
export async function PUT(request: Request) {
    try {
        const { id, ...updates } = await request.json();

        if (!id) {
            return NextResponse.json({ error: 'User ID required' }, { status: 400 });
        }

        const { data, error } = await supabaseAdmin
            .from('profiles')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error updating user:', error);
        return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
    }
}

// DELETE user and their salons
export async function DELETE(request: Request) {
    try {
        const { id, deleteSalons } = await request.json();

        if (!id) {
            return NextResponse.json({ error: 'User ID required' }, { status: 400 });
        }

        // If deleteSalons is true, delete all salons owned by this user first
        if (deleteSalons) {
            const { error: salonsError } = await supabaseAdmin
                .from('salons')
                .delete()
                .eq('owner_id', id);

            if (salonsError) {
                console.error('Error deleting user salons:', salonsError);
            }
        }

        // Delete the profile
        const { error: profileError } = await supabaseAdmin
            .from('profiles')
            .delete()
            .eq('id', id);

        if (profileError) throw profileError;

        // Also try to delete from auth.users (this might fail if no matching user exists)
        try {
            await supabaseAdmin.auth.admin.deleteUser(id);
        } catch (authError) {
            console.error('Error deleting auth user (might not exist):', authError);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting user:', error);
        return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
    }
}
