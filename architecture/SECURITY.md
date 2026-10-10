# Lex System Security Architecture & Auditing (SOP)

**Version:** 0.0.1
**Classification:** Internal Confidential / B.L.A.S.T Protocol Document

## 1. Zero Trust Identity Architecture

Lex System assumes that all internal network traffic is as hostile as external traffic.

### 1.1 Authentication Boundaries
*   **Public Edge:** Traffic reaching the edge must present a valid origin domain and pass Cloudflare/WAF preliminary DDOS checks.
*   **API Gateway:** All API calls require an Authorization header containing an active authentication token.
*   **Token Lifecycle:** Use short-lived cryptographically signed Access Tokens (e.g., 15 mins) and opaque, Redis-managed Refresh Tokens (e.g., 7 days).
*   **Session Revocation:** A user or `FIRM_ADMIN` can instantly revoke any active session terminating immediately at the Redis layer.

### 1.2 Unified Role-Based Access Control (RBAC)
Every endpoint must enforce the following authorization decorators rigidly:
*   `MASTER_ADMIN`: Lex System operational management. Access to global feature flags and tenant billing.
*   `FIRM_ADMIN`: Law firm partners. Full read/write access to their specific `tenant_id` data, audit logs, and module toggles.
*   `LAWYER`: Primary case workers. Read/write to legal processes, petitions, and delegated CRM leads. 
*   `ASSISTANT`: Administrative support. Read-only or scoped write access. Cannot perform mass exports or delete core records.
*   `CLIENT`: Extremely constrained boundary. Can only read specific fields belonging to their `client_id` (e.g., installments due, hearing dates).

## 2. Cryptographic Standards

*   **In-Transit Data:** TLS 1.3 mandated across all public endpoints and internal microservice-to-microservice communication channels.
*   **At-Rest Data:**
    *   **PII (CPF, RG, Birthdates, Identifiable Health/Financial data):** Encrypted using AES-256-GCM. The encryption keys must be managed by a dedicated KMS (Key Management Service) and rotated every 90 days.
    *   **Passwords:** Hashed using Argon2id or bcrypt (cost factor >= 12).
*   **Database Isolation Constraint:** Regardless of encryption, ORM layers MUST append `AND tenant_id = 'current_tenant'` to all DB queries dynamically, preventing cross-tenant leakage.

## 3. Continuous Self-Audit & Self-Pentesting Protocol

As defined in the B.L.A.S.T Core Doctrine (Rule 3), code is not considered merged unless it passes the CI/CD Security Pipeline.

### 3.1 Pre-Commit / Pre-Push Phases
*   **SAST (Static Application Security Testing):** Tools automatically scan for hardcoded secrets, dangerous SQL concatenation (all queries must be parameterized), and vulnerable dependencies.

### 3.2 Deployment Pipeline (The "Self-Pentest")
Every PR requires automated validation against the OWASP Top 10 vectors:
1.  **Injection Test:** The CI runs fuzzing payloads targeting typical injection points (Login, Search, Forms).
2.  **Broken Auth Test:** Validates that expired/revoked tokens are strictly denied.
3.  **IDOR Test (Broken Access Control):** Authenticates a "Tenant A" mock user, and dynamically tests API paths hoping to modify "Tenant B" mock data. The deployment fails immediately if the API returns a 200 OK.
4.  **Rate Limiting Bypass:** Floods public endpoints to ensure Redis-backed limits trigger a `429 Too Many Requests`.

### 3.3 Production Auditing (LGPD Logging)
*   **Immutable Trail:** Create an `audit_logs` table. Every `CREATE`, `UPDATE`, `DELETE`, and explicit `READ` (of encrypted PII) writes a record containing: `timestamp`, `actor_id`, `actor_role`, `action`, `resource_id`, and `ip_address`. This log is insert-only and append-only.

## 4. Incident Response Mitigation
In the event of anomalous activity (e.g., sudden burst of PII access):
1.  System automatically revokes the actor's session.
2.  Alert sent to `MASTER_ADMIN` and respective `FIRM_ADMIN`.
3.  Actor IP added to WAF deny-list for 24 hours pending review.
