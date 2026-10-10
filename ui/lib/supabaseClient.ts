import { createClient } from '@supabase/supabase-js'

// We expose a single Supabase instance.
// Note: As per B.L.A.S.T doctrine, this file MUST only be imported by Repository classes (Layer 3),
// NEVER directly by the React components or API routes.

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("⚠️ Suppressed Supabase Client Initialization: Missing environment variables.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
