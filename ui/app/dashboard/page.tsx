"use client";

import { useState, useEffect } from 'react';
import { haptics } from '../../lib/haptics';

// B.L.A.S.T Core Rule #1: Deterministic schemas.
// We map this directly to the `LegalProcess` schema defined in gemini.md.
interface LegalProcess {
    process_id: string;
    client_name: string;
    pje_number: string;
    status: 'open' | 'waiting' | 'closed';
    details: string;
    last_updated: string;
}

export default function ProcessTrackerDashboard() {
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    // Mocking the Supabase fetch
    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    const mockProcesses: LegalProcess[] = [
        { process_id: "proc-101", client_name: "TechNova Solutions", pje_number: "0014589-92.2026.8.26.0000", status: "open", details: "Hostile Takeover Injunction - Awaiting Judge Signature", last_updated: "2 hrs ago" },
        { process_id: "proc-102", client_name: "Apex Global", pje_number: "0009211-15.2025.4.01.3800", status: "waiting", details: "Asset Freeze Appeal - Pending Ministry Review", last_updated: "1 day ago" },
        { process_id: "proc-103", client_name: "Elena V.", pje_number: "0845199-31.2026.8.19.0001", status: "open", details: "IP Infringement Draft - Final Revisions", last_updated: "3 hrs ago" },
        { process_id: "proc-104", client_name: "Hyperion Corp", pje_number: "0100455-88.2024.5.15.0004", status: "closed", details: "Settlement executed. Funds transferred.", last_updated: "2 weeks ago" }
    ];

    const filteredProcesses = mockProcesses.filter(p =>
        p.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.pje_number.includes(searchQuery)
    );

    return (
        <div className="max-w-7xl mx-auto animate-fade-in">

            {/* Actions Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Process Registry</h1>
                    <p className="text-white/50 text-sm">Manage active litigation, PJe status, and client communications.</p>
                </div>

                <div className="flex w-full md:w-auto gap-4">
                    <div className="relative flex-1 md:w-64">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        <input
                            type="text"
                            placeholder="Search client or PJe..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-[#111] border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-white/30 transition-colors"
                        />
                    </div>
                    <button
                        className="bg-white text-black px-6 py-2 rounded-lg text-sm font-semibold pointer hover:bg-white/90 transition-colors shadow-lg whitespace-nowrap haptic-medium flex items-center gap-2"
                        onClick={() => haptics.mediumTap()}
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        New Process
                    </button>
                </div>
            </div>

            {/* Data Table Widget */}
            <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-[#111] border-b border-white/5 text-white/50 text-xs uppercase tracking-widest font-semibold">
                            <tr>
                                <th className="px-6 py-4">Client / Entity</th>
                                <th className="px-6 py-4">PJe Identification</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 w-full">Current Objective</th>
                                <th className="px-6 py-4 text-right">Activity</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {isLoading ? (
                                [1, 2, 3, 4].map(i => (
                                    <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                                        <td className="px-6 py-4"><div className="h-4 w-32 skeleton bg-white/5 rounded" /></td>
                                        <td className="px-6 py-4"><div className="h-4 w-48 skeleton bg-white/5 rounded" /></td>
                                        <td className="px-6 py-4"><div className="h-6 w-20 skeleton bg-white/5 rounded-full" /></td>
                                        <td className="px-6 py-4"><div className="h-4 w-64 skeleton bg-white/5 rounded" /></td>
                                        <td className="px-6 py-4 flex justify-end"><div className="h-4 w-20 skeleton bg-white/5 rounded" /></td>
                                    </tr>
                                ))
                            ) : filteredProcesses.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-white/30 text-sm">
                                        No processes found matching query.
                                    </td>
                                </tr>
                            ) : (
                                filteredProcesses.map((process) => (
                                    <tr key={process.process_id} className="group hover:bg-white/[0.03] transition-colors pointer" onClick={() => haptics.lightTap()}>
                                        <td className="px-6 py-4 font-semibold">{process.client_name}</td>
                                        <td className="px-6 py-4 font-mono text-white/60 tracking-wider text-xs">
                                            {process.pje_number}
                                            <button className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/10 rounded"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg></button>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border
                                  ${process.status === 'open' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : ''}
                                  ${process.status === 'waiting' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : ''}
                                  ${process.status === 'closed' ? 'bg-white/5 text-white/40 border-white/10' : ''}
                               `}>
                                                {process.status === 'open' && <span className="w-1.5 h-1.5 mr-1.5 bg-emerald-500 rounded-full animate-pulse-fast" />}
                                                {process.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-white/70 truncate max-w-xs">{process.details}</td>
                                        <td className="px-6 py-4 text-right text-xs text-white/40">{process.last_updated}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
