# Lex System: Master Platform Blueprint
**Version:** 0.0.0.1
**Mode:** Enterprise-Grade Architecture (Maximum Scalability)

## 0. Version History
- `0.0.0.1`: Initial creation of gemini.md. System map, schemas, security, and LGPD strategies defined.

---

## 1. System Architecture (Enterprise-Grade)

The Lex System operates as a Multi-Tenant SaaS designed for high compliance and scalability.
- **Infrastructure Strategy:** Event-Driven Microservices.
- **Tenant Isolation:** Separate database schemas or Row-Level Security (RLS) with strict Tenant ID injection at the ORM layer. No query executes without tenant context.
- **Event Bus:** Asynchronous handling for heavy operations (Pje scraping, LLM petition generation, NLP trend analysis).
- **Frontend Delivery:** A single Next.js / React application operating headlessly. UI configuration (branding, colors) is loaded dynamically based on the accessed domain.

### Layered Breakdown:
* **Storage Layer:** Supabase Managed PostgreSQL (Transactional Data, JSONB for schemas) + Redis (Session/Rate Limiting/Cache).
* **Application Layer:** Stateful auth (Supabase Auth) + Stateless micro-APIs grouped by bounded context.
* **Database Abstraction (Critical Portability Rule):** The backend MUST use the **Repository Pattern**. Direct SQL or Supabase Client calls are forbidden inside business logic controllers. All DB access must go through a generic Data Access Layer interface so migrating away from Supabase in the future only requires swapping the repository implementation.
* **Worker Layer:** Isolated processes for handling external brittle integrations (Meta APIs, Pje Systems).

---

## 2. Module Registry & Dependency Graph

Modules are plug-and-play. The Master SaaS Admin controls which tenant has access to which module.

```text
Lex System Core Layer (Mandatory)
├── module: identity (Auth, RBAC, Tenant isolation)
├── module: client-registry (PII Vault, Encryption)
└── module: white-label-engine (Domain mapping, Assets)

Lex System Experience Layer (Tenant Toggles)
├── module: process-tracker (Depends on: identity, client-registry)
├── module: finances (Depends on: process-tracker)
├── module: document-editor (Depends on: process-tracker)
├── module: mentorship-hub (Standalone, integrates with finances)
└── module: client-portal (Depends on: process-tracker, finances)

Lex System Automation & AI Layer (Add-ons)
├── module: ai-drafts (Depends on: document-editor, process-tracker)
├── module: ai-omni-agent (Depends on: identity) -> WhatsApp/IG
├── module: pje-connector (Worker module)
└── module: social-bot (Standalone NLP worker)
```

---

## 3. Data Schema Definitions

*Note: All logic relies on these deterministic schemas.*

### 3.1 Tenant Schema (Law Firm)
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Tenant",
  "type": "object",
  "properties": {
    "tenant_id": { "type": "string", "description": "UUID" },
    "firm_name": { "type": "string" },
    "domain": { "type": "string" },
    "active_modules": { "type": "array", "items": { "type": "string" } },
    "ui_config": {
      "type": "object",
      "properties": {
        "primary_color": { "type": "string" },
        "logo_url": { "type": "string" }
      }
    }
  },
  "required": ["tenant_id", "firm_name", "domain"]
}
```

### 3.2 Client Schema (End-User / PII Vault)
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "ClientRegistry",
  "type": "object",
  "properties": {
    "client_id": { "type": "string", "description": "UUID" },
    "tenant_id": { "type": "string", "description": "Strict isolation constraint" },
    "full_name": { "type": "string" },
    "encrypted_cpf": { "type": "string", "description": "AES-256 encrypted at rest" },
    "encrypted_rg": { "type": "string" },
    "birth_date": { "type": "string", "format": "date" },
    "address": {
      "type": "object",
      "properties": {
        "street": { "type": "string" },
        "city": { "type": "string" },
        "state": { "type": "string" },
        "zip": { "type": "string" }
      }
    },
    "lgpd_consent": { "type": "boolean", "default": false }
  },
  "required": ["client_id", "tenant_id", "full_name"]
}
```

### 3.3 Process/Case Schema
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "LegalProcess",
  "type": "object",
  "properties": {
    "process_id": { "type": "string" },
    "tenant_id": { "type": "string" },
    "client_id": { "type": "string" },
    "pje_number": { "type": "string" },
    "status": { "type": "string", "enum": ["open", "waiting", "closed"] },
    "details": { "type": "string" }
  }
}
```

### 3.4 API Input/Output Envelope (Standard Payload)
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "LexStandardAPIEnvelope",
  "type": "object",
  "properties": {
    "status": { "type": "string", "enum": ["success", "error"] },
    "data": { "type": "object", "description": "Type depends on bounded context" },
    "error": {
      "type": "object",
      "properties": {
        "code": { "type": "string" },
        "message": { "type": "string" },
        "details": { "type": "array" }
      }
    },
    "meta": {
      "type": "object",
      "properties": {
        "request_id": { "type": "string" },
        "timestamp": { "type": "string", "format": "date-time" },
        "pagination": {
          "type": "object",
          "properties": {
            "total_records": { "type": "integer" },
            "current_page": { "type": "integer" },
            "page_size": { "type": "integer" }
          }
        }
      }
    }
  },
  "required": ["status", "meta"]
}
```

### 3.5 Module Configuration Schema
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "LexModuleConfig",
  "type": "object",
  "properties": {
    "module_id": { "type": "string", "description": "e.g., ai-omni-agent" },
    "tenant_id": { "type": "string" },
    "settings": { "type": "object", "description": "Dynamic JSONB payload for module-specific config" },
    "is_active": { "type": "boolean", "default": false },
    "webhook_urls": { "type": "array", "items": { "type": "string", "format": "uri" } }
  },
  "required": ["module_id", "tenant_id"]
}
```

### 3.6 Analytics Event Schema
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "LexAnalyticsEvent",
  "type": "object",
  "properties": {
    "event_id": { "type": "string", "description": "UUID v4" },
    "event_type": { "type": "string", "description": "e.g., USER_LOGIN, PETITION_GENERATED, AI_TRIAGE_COMPLETE" },
    "timestamp": { "type": "integer", "description": "Epoch MS" },
    "tenant_id": { "type": "string", "description": "Strict isolation" },
    "user_id": { "type": "string", "description": "Can be null for anonymous web leads" },
    "context": {
      "type": "object",
      "properties": {
        "device_type": { "type": "string", "enum": ["mobile", "tablet", "desktop"] },
        "os": { "type": "string" },
        "browser": { "type": "string" },
        "approx_location": { "type": "string", "description": "City/Region max resolution to respect LGPD" }
      }
    },
    "metadata": { "type": "object", "description": "Key-value pairs specific to the event" }
  },
  "required": ["event_id", "event_type", "timestamp", "tenant_id"]
}
```

### 3.7 Documentation Structure Schema
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "LexDocumentationNode",
  "type": "object",
  "properties": {
    "doc_id": { "type": "string", "description": "UUID v4" },
    "module_reference": { "type": "string", "description": "Which module this doc belongs to" },
    "title": { "type": "string" },
    "content": { "type": "string", "description": "Markdown content" },
    "audience": { "type": "string", "enum": ["developer", "client", "architecture"] },
    "last_updated": { "type": "string", "format": "date-time" }
  },
  "required": ["doc_id", "title", "content", "audience"]
}
```

---

## 4. Security Architecture & Threat Modeling

**Core Rule:** Assume the network is hostile.

1.  **Authentication & Sessions (Supabase Provider):**
    *   **MFA (Multi-Factor Authentication):** Enforced via Supabase Auth for `MASTER_ADMIN`, `FIRM_ADMIN`, and `LAWYER` roles.
    *   **Inactivity Timeouts:** Absolute requirement. The frontend client will monitor interaction data and forcefully log users out after 15 minutes of inactivity, terminating the Supabase session token.
    *   Role-Based Access Control (RBAC): `MASTER_ADMIN`, `FIRM_ADMIN`, `LAWYER`, `ASSISTANT`, `CLIENT`.
2.  **Continuous Self-Audit & Self-Pentesting:**
    *   Automated scans (e.g., OWASP ZAP hooks) trigger on pull requests and deployments.
    *   Tests verify: SQL Injection blocks, CSRF/XSS, Rate-Limiting bypass, and IDOR (Insecure Direct Object Reference) prevention.
3.  **Threat Models (Initial Framework):**
    *   *Vector 1: Malicious Assistant Attempting Mass Export.*
        *   **Risk:** Assistant role attempts to download the entire client registry or petition bank to steal intellectual property or sell PII.
        *   **Mitigation:** Strict pagination limits (max `page_size=100`). Real-time anomaly detection monitoring `READ` velocities per user. Trigger an automatic session kill and `FIRM_ADMIN` alert upon threshold breach.
    *   *Vector 2: Cross-Tenant Data Leakage (IDOR).*
        *   **Risk:** Tenant A changes a URL parameter from `process_id=123` to `process_id=456` and mistakenly views Tenant B's case files.
        *   **Mitigation:** ORM-level RLS enforcing `WHERE tenant_id = current_tenant()` on *all* queries globally. APIs reject requests if the requested resource's `tenant_id` does not match the authenticated session `tenant_id`.
    *   *Vector 3: AI Legal Hallucination Liability.*
        *   **Risk:** The WhatsApp AI Omni-Agent gives legally incorrect advice to a client, creating legal liability for the firm.
        *   **Mitigation:** The AI prompt engineering contains absolute restrictions (`system_prompt` guardrails). The AI is restricted to a "Read-Only Summary" RAG database. It is hardcoded to refuse legal advice and strictly handle scheduling, triage, and basic process status updates.
    *   *Vector 4: External Pje API Abuse.*
        *   **Risk:** Lex Pje Pollers get IP-banned by national court systems for excessive scrape/API requests, taking down the module globally.
        *   **Mitigation:** Requests are heavily throttled and routed through a rotating proxy pool. Implement exponential backoff.
    *   *Vector 5: CSRF/XSS on Client Portal.*
        *   **Risk:** Attacker injects malicious JS via a "Contact Us" web lead form, hijacking lawyer session cookies.
        *   **Mitigation:** Strict Content Security Policy (CSP). Sanitization of all user inputs using rigorous HTML escaping. Use HTTPOnly, Secure `SameSite=Strict` cookies for session management—never local storage.

---

## 5. LGPD Compliance Strategy

*   **Consent Manager:** First login prompts explicit, granular consent (Cookie tracking, AI analysis consent).
*   **Data Rights:** Client dashboard includes a "Privacy Center". They can click "Export My Data" or "Request Deletion".
*   **Anonymization:** Deleting a user soft-deletes and cryptographic wipes PII. Their historical financial ledgers remain for audit, but are scrubbed of CPF/Name (e.g., `User_Deleted_XYZ` in records).
*   **Audit Logging:** Every Read/Write of the Client Registry is logged to an immutable table with the Lawyer/Assistant ID.

---

## 6. UI/UX Design System

1.  **Aesthetics:** Modern, serious, trust-inspiring, highly responsive (mobile > tablet > desktop).
2.  **Haptics:** Integration of `web-haptics` across all touchpoints (Success = Happy Vibration, Deny = Strong Shake).
3.  **Interactive States:** Complete avoidance of native `alert()` or `confirm()`. Custom polymorphic modal manager.
4.  **Load States:** Use skeleton loaders instead of spinners to minimize layout shift and improve perceived speed.
5.  **Cursors:** Explicit definitions for `.pointer`, `.text-input`, `.grab`, `.loading`.

---

## 7. Analytics Architecture

*   **Rule:** Respect LGPD. Analytics do not fire unless `analytics=true` in cookies.
*   **Events Captured:** Module activation metrics, Time-to-Draft (for AI success tracking), Lead conversion rates from the website module, DAU (Daily Active Users).
*   **Payload Schema:**
```json
{
  "event_type": "string",
  "timestamp": "integer",
  "tenant_id": "string",
  "metadata": "object"
}
```

---

## 8. Documentation Index (Architecture SOPs)

Every module contains an auto-generated `/docs` interface that routes to the Client Dashboard's "Documentation Center." The core system docs live in:
*   `/architecture/SECURITY.md`
*   `/architecture/DATA_FLOW.md`
*   `/architecture/UX_GUIDELINES.md`

---

## 9. Self-Learning Notes & Heuristics
*   *Heuristic 1:* Never couple Pje Integrations deeply to the core DB. Always treat court APIs as highly brittle external actors.
*   *Heuristic 2:* Build the White-Label toggles FIRST. Modularity is hard to retrofit.
*   *Heuristic 3:* AI Bots should only know the immediate next steps of a process, not the entire case strategy, to limit scope and hallucination risk.

---

## 10. B.L.A.S.T. Core Doctrine (Permanent Rules)
The system operates on five permanent principles that must be consulted regularly:
1. **Determinism over Guessing:** Business logic must always be deterministic. If unclear, pause and ask.
2. **Security by Design:** Assume the network is hostile, APIs will be abused, and malicious automation will occur. Threat model everything.
3. **Continuous Self-Audit:** After any feature/change, run security, performance, UX, and consistency checks.
4. **Documentation as Infrastructure:** No feature exists without docs. Generate dev, client, and architecture notes.
5. **Modular SaaS Architecture:** All components must be portable and reusable across white-label deployments.
