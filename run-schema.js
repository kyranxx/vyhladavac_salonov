// Run database schema on Supabase
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function runSchema() {
    const connectionString = 'postgresql://postgres.txodloobftonmurltjpm:Sk49hzm2qw@aws-0-eu-central-1.pooler.supabase.com:6543/postgres';

    const client = new Client({ connectionString });

    try {
        console.log('Connecting to Supabase...');
        await client.connect();
        console.log('Connected!');

        // Read schema file
        const schemaPath = path.join(__dirname, 'database', 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        console.log('Running schema...');
        await client.query(schema);
        console.log('✅ Schema executed successfully!');

        // Verify tables
        const result = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            ORDER BY table_name;
        `);

        console.log('\nTables created:');
        result.rows.forEach(row => console.log('  -', row.table_name));

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await client.end();
    }
}

runSchema();
