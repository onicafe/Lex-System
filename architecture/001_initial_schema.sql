-- Lex System: Enterprise Baseline Schema (Supabase)
-- Version: 0.0.1
-- Rule: ALL tables containing cross-tenant data MUST have RLS enabled.

-- 1. Enable pgcrypto for UUIDs
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Create the central Tenants Table
CREATE TABLE public.tenants (
    tenant_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    firm_name VARCHAR(255) NOT NULL,
    domain VARCHAR(255) UNIQUE NOT NULL,
    active_modules JSONB DEFAULT '[]'::jsonb,
    ui_config JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Custom Claims Helper Function
-- Supabase handles auth via its 'auth.users' table and JWTs. 
-- We map a user to a tenant_id using the auth.jwt() function in RLS policies.
CREATE OR REPLACE FUNCTION public.current_tenant_id()
RETURNS UUID AS $$
  -- Extracts the app_metadata.tenant_id from the active Supabase JWT
  SELECT (current_setting('request.jwt.claims', true)::jsonb -> 'app_metadata' ->> 'tenant_id')::UUID;
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- 4. Create the Client Registry Table (PII Vault)
CREATE TABLE public.client_registry (
    client_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(tenant_id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    encrypted_cpf TEXT NOT NULL,
    encrypted_rg TEXT,
    birth_date DATE,
    address JSONB,
    lgpd_consent BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Create Legal Processes Table
CREATE TABLE public.legal_processes (
    process_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(tenant_id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES public.client_registry(client_id) ON DELETE CASCADE,
    pje_number VARCHAR(100),
    status VARCHAR(50) CHECK (status IN ('open', 'waiting', 'closed')) DEFAULT 'open',
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Enable Row-Level Security (RLS) Mandated by B.L.A.S.T. Doctrine
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legal_processes ENABLE ROW LEVEL SECURITY;

-- 7. Define RLS Policies

-- Tenants: A Master Admin can view all, but Firm Admins/Lawyers only see their own tenant.
-- Note: 'app_metadata.role' logic will be enforced inside Supabase Auth JWT claims.
CREATE POLICY "Tenant Isolation: Read" ON public.tenants
  FOR SELECT
  TO authenticated
  USING (
    tenant_id = public.current_tenant_id() 
    OR (current_setting('request.jwt.claims', true)::jsonb -> 'app_metadata' ->> 'role') = 'MASTER_ADMIN'
  );

-- Clients: Absolute isolation. No query can fetch a client belonging to another tenant.
CREATE POLICY "Client Registry: Tenant Isolation" ON public.client_registry
  FOR ALL
  TO authenticated
  USING (tenant_id = public.current_tenant_id());

-- Processes: Absolute isolation.
CREATE POLICY "Legal Processes: Tenant Isolation" ON public.legal_processes
  FOR ALL
  TO authenticated
  USING (tenant_id = public.current_tenant_id());

-- 8. Audit Logging Trigger Structure
-- Ensure all writes to Client PII are logged.
CREATE TABLE public.audit_logs (
    log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    actor_id UUID NOT NULL, -- auth.uid()
    action VARCHAR(50) NOT NULL,
    table_name VARCHAR(100) NOT NULL,
    record_id UUID NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Note: The trigger function writing to `audit_logs` will be defined alongside the API ORM implementation 
-- or inside Supabase DB triggers.
