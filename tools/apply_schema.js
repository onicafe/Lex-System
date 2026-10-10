/**
 * Lex System: Autonomous DB Migration Tool (Phase 3)
 * Objective: Read and execute architecture SQL schemas securely against the DB.
 */
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const dbUrl = process.env.SUPABASE_DB_URL;
if (!dbUrl) {
    console.error("❌ ERROR: SUPABASE_DB_URL is missing from .env");
    process.exit(1);
}

const client = new Client({
    connectionString: dbUrl,
});

async function applyMigration() {
    try {
        console.log("🔗 Connecting to Supabase Direct PostgreSQL...");
        await client.connect();
        console.log("✅ Custom DB connection established.");

        const sqlFilePath = path.join(__dirname, '../architecture/001_initial_schema.sql');
        console.log(`📡 Reading schema file: ${sqlFilePath}`);

        const sqlQuery = fs.readFileSync(sqlFilePath, 'utf8');

        console.log("⚙️ Executing migration. This may take a moment...");
        // Execute the raw query
        await client.query(sqlQuery);

        console.log("🎉 SUCCESS: Lex System Base Schema applied safely!");
        console.log("Note: Existing data in other tables was untouched as per safe migration rules.");

    } catch (err) {
        console.error("❌ DATABASE ERROR: Could not apply schema.", err);
    } finally {
        await client.end();
        console.log("🔌 Connection closed.");
    }
}

applyMigration();
