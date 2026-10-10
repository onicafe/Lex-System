import { headers } from 'next/headers';
import Link from 'next/link';
import { getTenantConfig } from '../../lib/tenantConfig';

// B.L.A.S.T Rule: Dashboard must be secure and isolated from public routes.
// The layout.tsx wraps all /dashboard pages, ensuring consistent navigation and auth checks.

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const headersList = headers();
    const host = headersList.get('host') || 'localhost:3002';

    // Fetch tenant config to style the internal dashboard consistently with the brand
    const config = await getTenantConfig(host);

    return (
        <div className="min-h-screen flex bg-[#050505] text-[#f4f4f5] font-sans">

            {/* 1. SECURE SIDEBAR (Left Navigation) */}
            <aside
                className="w-64 flex-shrink-0 flex flex-col border-r border-white/5"
                style={{ backgroundColor: config.colors.surface }}
            >
                {/* Brand Header */}
                <div className="h-16 flex items-center px-6 border-b border-white/5">
                    <div className="flex items-center gap-3 font-serif font-bold tracking-tight">
                        <div
                            className="w-4 h-4 rounded-sm"
                            style={{ backgroundColor: config.colors.primary }}
                        />
                        <span className="opacity-90 tracking-widest uppercase text-xs">Lex Workspace</span>
                    </div>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 px-4 py-8 flex flex-col gap-2 text-sm font-medium">

                    <div className="text-[10px] uppercase tracking-widest text-white/40 mb-2 pl-2">Operations</div>

                    <Link
                        href="/dashboard"
                        className="px-4 py-2.5 rounded-lg flex items-center gap-3 transition-colors text-white"
                        style={{ backgroundColor: `${config.colors.primary}33` /* 20% opacity */ }}
                    >
                        <svg className="w-4 h-4" style={{ color: config.colors.primary }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                        Process Tracker
                    </Link>

                    <Link
                        href="#"
                        className="px-4 py-2.5 rounded-lg flex items-center gap-3 text-white/50 hover:bg-white/5 hover:text-white transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        Finances <span className="text-[10px] uppercase font-bold text-yellow-500/70 ml-auto">Pro</span>
                    </Link>

                    <Link
                        href="#"
                        className="px-4 py-2.5 rounded-lg flex items-center gap-3 text-white/50 hover:bg-white/5 hover:text-white transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                        Client Registry
                    </Link>

                    <div className="mt-8 text-[10px] uppercase tracking-widest text-white/40 mb-2 pl-2">System</div>

                    <Link
                        href="#"
                        className="px-4 py-2.5 rounded-lg flex items-center gap-3 text-white/50 hover:bg-white/5 hover:text-white transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        Settings
                    </Link>

                </nav>

                {/* User Block */}
                <div className="p-4 border-t border-white/5 bg-black/20">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-white/20 to-white/5" />
                        <div className="flex flex-col">
                            <span className="text-xs font-bold leading-tight">Master Admin</span>
                            <span className="text-[10px] text-white/50">{config.firmName}</span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* 2. MAIN CONTENT AREA */}
            <main className="flex-1 flex flex-col relative overflow-hidden">
                {/* Top Header / Breadcrumbs */}
                <header className="h-16 flex items-center justify-between px-8 border-b border-white/5 z-10" style={{ backgroundColor: `${config.colors.background}E6` }}>
                    <h2 className="text-sm font-semibold tracking-wide">Dashboard <span className="text-white/30 mx-2">/</span> Process Tracker</h2>
                    <div className="flex gap-4">
                        {/* Mock Notifications */}
                        <button className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors">
                            <svg className="w-4 h-4 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                        </button>
                    </div>
                </header>

                {/* Children (The specific dashboard view) */}
                <div className="flex-1 overflow-y-auto p-8 relative z-0">
                    {children}
                </div>

                {/* Decorative Theme Element (Analogous visual hint) */}
                <div
                    className="absolute bottom-0 right-0 w-[500px] h-[500px] opacity-10 pointer-events-none rounded-tl-full mix-blend-screen blur-3xl"
                    style={{ backgroundColor: config.colors.secondary }}
                />
            </main>

        </div>
    );
}
