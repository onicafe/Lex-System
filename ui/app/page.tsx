import { headers } from 'next/headers';
import LandingClientBlock from '../components/LandingClientBlock';
import { getTenantConfig } from '../lib/tenantConfig';

// Next.js Server Component
export default async function Home() {
    // Use Next.js headers to determine the incoming request's host/domain.
    // This is the core mechanism of the Multi-Tenant White-Label Architecture.
    const headersList = headers();
    const host = headersList.get('host') || 'localhost:3002';

    // Fetch specific firm's UI configuration based on the domain accessed
    const tenantConfig = await getTenantConfig(host);

    return (
        <LandingClientBlock config={tenantConfig} />
    );
}
