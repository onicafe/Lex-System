/**
 * Lex System: Verification Tool - External Integrations (Phase 2)
 * Objective: Verify connectivity to external APIs (Meta WhatsApp/IG, OpenAI).
 */

const dotenv = require('dotenv');
dotenv.config();

const metaToken = process.env.META_API_TOKEN;
const openaiKey = process.env.OPENAI_API_KEY;

async function verifyIntegrations() {
    console.log("🔗 Lex System: Initializing External Integrations Test...");

    // 1. Meta / WhatsApp API Verification
    if (!metaToken) {
        console.warn("⚠️ SKIP: META_API_TOKEN missing. Skipping Meta Graph API check.");
    } else {
        try {
            // Minimal ping to Meta Graph API
            const res = await fetch(`https://graph.facebook.com/v19.0/me?access_token=${metaToken}`);
            if (res.ok) {
                console.log("✅ CONNECTED: Successfully reached Meta Graph API.");
            } else {
                console.error("❌ CONNECTION FAILED: Meta Graph API rejected the token.");
            }
        } catch (err) {
            console.error("❌ SEVERE ERROR: Could not resolve Meta Graph hostname.");
        }
    }

    // 2. OpenAI Verification (for Petition Builder & Omni-Agent)
    if (!openaiKey) {
        console.warn("⚠️ SKIP: OPENAI_API_KEY missing. Skipping OpenAI check.");
    } else {
        try {
            const res = await fetch('https://api.openai.com/v1/models', {
                headers: {
                    'Authorization': `Bearer ${openaiKey}`
                }
            });
            if (res.ok) {
                console.log("✅ CONNECTED: Successfully reached OpenAI API.");
            } else {
                console.error("❌ CONNECTION FAILED: OpenAI rejected the key.");
            }
        } catch (err) {
            console.error("❌ SEVERE ERROR: Could not resolve OpenAI hostname.");
        }
    }
}

verifyIntegrations();
