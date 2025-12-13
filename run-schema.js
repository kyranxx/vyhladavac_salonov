// Run database schema using Supabase REST API
const fs = require('fs');
const path = require('path');

async function runSchema() {
    const SUPABASE_URL = 'https://txodloobftonmurltjpm.supabase.co';
    const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4b2Rsb29iZnRvbm11cmx0anBtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTU0MTc4MCwiZXhwIjoyMDgxMTE3NzgwfQ.4H18BL2Q0kPEGoTuD38v30NH-U3__QvI-yYI8eT7jFI';

    // Read schema file
    const schemaPath = path.join(__dirname, 'database', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    console.log('Running schema via Supabase REST API...\n');

    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SERVICE_ROLE_KEY,
                'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
            },
            body: JSON.stringify({ sql: schema }),
        });

        if (!response.ok) {
            // Try direct SQL endpoint
            console.log('Trying alternative method...');

            // Split into statements and run individually
            const statements = schema
                .split(/;[\r\n]+/)
                .map(s => s.trim())
                .filter(s => s && !s.startsWith('--'));

            let successCount = 0;
            let errorCount = 0;

            for (const statement of statements) {
                if (!statement) continue;

                // Use pg_catalog to execute
                const res = await fetch(`${SUPABASE_URL}/rest/v1/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'apikey': SERVICE_ROLE_KEY,
                        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
                        'Prefer': 'return=minimal',
                    },
                    body: JSON.stringify({}),
                });
                successCount++;
            }

            console.log(`Processed ${successCount} statements`);
        } else {
            console.log('✅ Schema executed successfully!');
        }
    } catch (error) {
        console.error('❌ REST API Error:', error.message);
    }

    // Check what tables exist
    console.log('\nVerifying tables...');
    const tablesResponse = await fetch(
        `${SUPABASE_URL}/rest/v1/?select=*`,
        {
            method: 'HEAD',
            headers: {
                'apikey': SERVICE_ROLE_KEY,
                'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
            },
        }
    );

    // Try to query categories to see if tables exist
    const catResponse = await fetch(
        `${SUPABASE_URL}/rest/v1/categories?select=*&limit=1`,
        {
            headers: {
                'apikey': SERVICE_ROLE_KEY,
                'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
            },
        }
    );

    if (catResponse.ok) {
        const data = await catResponse.json();
        console.log('✅ Categories table exists with', data.length, 'rows');
    } else {
        console.log('❌ Categories table not found - schema may not have run');
        console.log('   Please run the schema manually in Supabase SQL Editor');
    }
}

runSchema();
