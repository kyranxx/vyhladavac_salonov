// Verify all database tables exist
async function verifyTables() {
    const SUPABASE_URL = 'https://txodloobftonmurltjpm.supabase.co';
    const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4b2Rsb29iZnRvbm11cmx0anBtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTU0MTc4MCwiZXhwIjoyMDgxMTE3NzgwfQ.4H18BL2Q0kPEGoTuD38v30NH-U3__QvI-yYI8eT7jFI';

    const tables = ['categories', 'districts', 'salons', 'services', 'photos', 'subscriptions', 'salon_categories'];

    console.log('🔍 Verifying database tables...\n');

    for (const table of tables) {
        try {
            const response = await fetch(
                `${SUPABASE_URL}/rest/v1/${table}?select=count&limit=0`,
                {
                    method: 'HEAD',
                    headers: {
                        'apikey': SERVICE_ROLE_KEY,
                        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
                        'Prefer': 'count=exact',
                    },
                }
            );

            if (response.ok) {
                const count = response.headers.get('content-range');
                console.log(`  ✅ ${table} - exists ${count ? '(' + count.split('/')[1] + ' rows)' : ''}`);
            } else {
                console.log(`  ❌ ${table} - NOT FOUND (${response.status})`);
            }
        } catch (error) {
            console.log(`  ❌ ${table} - Error: ${error.message}`);
        }
    }

    // Get actual category data
    console.log('\n📋 Sample data from categories:');
    const catResponse = await fetch(
        `${SUPABASE_URL}/rest/v1/categories?select=id,slug,name_sk&limit=5`,
        {
            headers: {
                'apikey': SERVICE_ROLE_KEY,
                'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
            },
        }
    );

    if (catResponse.ok) {
        const cats = await catResponse.json();
        cats.forEach(c => console.log(`   - ${c.name_sk} (${c.slug})`));
    }

    // Get districts
    console.log('\n📋 Sample data from districts:');
    const distResponse = await fetch(
        `${SUPABASE_URL}/rest/v1/districts?select=id,slug,name_sk&limit=5`,
        {
            headers: {
                'apikey': SERVICE_ROLE_KEY,
                'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
            },
        }
    );

    if (distResponse.ok) {
        const dists = await distResponse.json();
        dists.forEach(d => console.log(`   - ${d.name_sk} (${d.slug})`));
    }

    console.log('\n✅ Database verification complete!');
}

verifyTables();
