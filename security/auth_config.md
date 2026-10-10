# Lex System Auth Configuration (Supabase)

**Version:** 0.0.1
**Classification:** Internal Security Document / B.L.A.S.T Protocol

## 1. Provider Choice & Rationale

Lex System utilizes **Supabase Auth** built atop PostgreSQL's native `auth.users` schema. 
*   **Why:** Provides secure JWT handling natively compatible with Row-Level Security (RLS).
*   **Portability Rule:** We must wrap the Supabase Auth client inside a `LexIdentityService` interface on our frontend/backend. If we ever migrate away from Supabase to AWS Cognito or Auth0, we only change the contents of `LexIdentityService`, not the application's business logic.

## 2. JWT Custom Claims Structure

To enforce multi-tenancy securely, we inject custom claims into the Supabase JWT `app_metadata` during user creation/invitation.

**Example `app_metadata` Payload:**
```json
{
  "provider": "email",
  "providers": ["email"],
  "tenant_id": "a1b2c3d4-e5f6-7890-1234-56789abcdef0",
  "role": "LAWYER"
}
```
*Note: The `role` here refers to the Lex System RBAC (`MASTER_ADMIN`, `FIRM_ADMIN`, `LAWYER`, `ASSISTANT`, `CLIENT`), not the Supabase internal default roles (`authenticated`, `anon`).*

## 3. Strict Security Enhancements

As mandated by the user, Lex System requires high-security standards for sensitive legal data.

### 3.1 Multi-Factor Authentication (MFA/2FA)
*   **Requirement:** `FIRM_ADMIN` and `LAWYER` roles MUST have MFA enabled via Authenticator App (TOTP) to access the system.
*   **Supabase MFA Enrollment Flow:** The frontend will force users to complete the Supabase MFA enrollment flow using the `@supabase/supabase-js` `auth.mfa.enroll()` API upon their first login.
*   **Assurance Levels:** Endpoints and RLS policies containing sensitive PII will require an Assurance Level of 2 (`aal2`). e.g., Supabase JWT token must contain `"aal": "aal2"`.

### 3.2 Inactivity Timeouts & Session Protection
*   **Requirement:** Users must be kicked off the system if they leave the application open and unattended.
*   **Implementation Strategy:**
    1.  **Frontend Watcher:** A React context provider attached to `window.addEventListener` for `mousemove`, `keydown`, `scroll`, and `click`.
    2.  **Timeout Limits:**
        *   `ASSISTANT` / `LAWYER` / `FIRM_ADMIN`: 15 minutes of inactivity.
        *   `CLIENT`: 30 minutes of inactivity.
    3.  **Action:** If the timer expires, the frontend will proactively call `supabase.auth.signOut()` and destroy the local session cache, redirecting to the `/login?reason=timeout` screen.

## 4. Portability / Extensibility Warning 
Do NOT rely solely on Supabase `user_metadata` for mapping business entities. Always reference the user ID (`auth.uid()`) to internal tables (e.g. `lawyer_profiles` or `client_registry`) via foreign keys to guarantee data survives any future provider migrations.
