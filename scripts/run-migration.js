/**
 * Run SQL migration against Supabase database
 * Uses the service role key to bypass RLS
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration() {
    console.log('Reading migration file...');

    const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '20241215000001_fix_security_performance.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');

    // Split by semicolons but keep CREATE FUNCTION blocks together
    const statements = [];
    let currentStatement = '';
    let inFunction = false;

    for (const line of sql.split('\n')) {
        const trimmedLine = line.trim();

        // Skip comments
        if (trimmedLine.startsWith('--') && !inFunction) {
            continue;
        }

        currentStatement += line + '\n';

        // Check if we're entering a function block
        if (trimmedLine.includes('AS $$') || trimmedLine.includes("AS '$$'")) {
            inFunction = true;
        }

        // Check if we're exiting a function block
        if (inFunction && (trimmedLine.includes('$$;') || trimmedLine.includes('$$ language'))) {
            inFunction = false;
            if (currentStatement.trim()) {
                statements.push(currentStatement.trim());
            }
            currentStatement = '';
            continue;
        }

        // If not in function and line ends with semicolon
        if (!inFunction && trimmedLine.endsWith(';')) {
            if (currentStatement.trim()) {
                statements.push(currentStatement.trim());
            }
            currentStatement = '';
        }
    }

    console.log(`Found ${statements.length} SQL statements to execute\n`);

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < statements.length; i++) {
        const stmt = statements[i];

        // Skip empty statements
        if (!stmt || stmt === '--') continue;

        // Get a description of what we're doing
        const firstLine = stmt.split('\n')[0].slice(0, 60);
        console.log(`[${i + 1}/${statements.length}] Executing: ${firstLine}...`);

        try {
            const { error } = await supabase.rpc('exec_sql', { sql_query: stmt });

            if (error) {
                // Try alternative method - direct query
                const { error: error2 } = await supabase.from('_sql').select().sql(stmt);
                if (error2) {
                    throw error;
                }
            }

            console.log(`    ✓ Success`);
            successCount++;
        } catch (err) {
            console.log(`    ✗ Error: ${err.message || err}`);
            errorCount++;
        }
    }

    console.log(`\n========================================`);
    console.log(`Migration complete!`);
    console.log(`  Successful: ${successCount}`);
    console.log(`  Errors: ${errorCount}`);
    console.log(`========================================`);
}

runMigration().catch(console.error);
