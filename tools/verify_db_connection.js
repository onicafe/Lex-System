/**
 * Lex System: Verification Tool (Phase 2)
 * Objective: Verify database connectivity and test the Supabase client wrapper.
 * 
 * Usage:
 * 1. npm install @supabase/supabase-js dotenv
 * 2. Configure .env with SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
 * 3. node tools/verify_db_connection.js
 */

const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("❌ ERROR: Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env");
    process.exit(1);
}

// Initialize Supabase Client with the Service Role (bypasses RLS to test base DB connection)
const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyConnection() {
    console.log("🔗 Lex System: Initializing DB Connectivity Test...");
    console.log(`📡 Ping target: ${supabaseUrl}`);

    try {
        // Attempt to fetch 1 record from the 'tenants' table to prove read access
        const { data, error } = await supabase
            .from('tenants')
            .select('tenant_id')
            .limit(1);

        if (error) {
            // It is acceptable if the table doesn't exist yet, it proves we connected and Supabase responded.
            if (error.code === '42P01') {
                console.log("✅ CONNECTED: Successfully reached Supabase DB.");
                console.warn("⚠️ WARNING: The 'tenants' table does not exist yet. Please run architecture/001_initial_schema.sql in your dashboard.");
            } else {
                console.error("❌ CONNECTION FAILED: Received DB error: ", error.message);
            }
        } else {
            console.log("✅ CONNECTED: Successfully reached Supabase DB and read from 'tenants'.");
        }

    } catch (err) {
        console.error("❌ SEVERE ERROR: Could not hit Supabase API. Check network and keys.", err);
    }
}

verifyConnection();
