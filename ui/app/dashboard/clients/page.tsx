"use client";

import { useState, useEffect } from 'react';
import { haptics } from '../../../lib/haptics';
import AddClientModal from '../../../components/AddClientModal';
import { addSecureClient } from './actions';

// Mimics the Client Schema from gemini.md
interface ClientRegistry {
    client_id: string;
    full_name: string;
    masked_cpf: string;
    email: string;
    lgpd_consent: boolean;
    status: 'active' | 'archived';
    added_on: string;
}

export default function ClientRegistryDashboard() {
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Mocking the Supabase fetch
    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 600);
        return () => clearTimeout(timer);
    }, []);

    const mockClients: ClientRegistry[] = [
        { client_id: "cl-199", full_name: "TechNova Solutions Ltd", masked_cpf: "***.458.992-**", email: "legal@technova.com", lgpd_consent: true, status: "active", added_on: "Jan 12, 2026" },
        { client_id: "cl-201", full_name: "Apex Global Properties", masked_cpf: "***.921.115-**", email: "board@apexglobal.co", lgpd_consent: true, status: "active", added_on: "Feb 04, 2026" },
        { client_id: "cl-245", full_name: "Elena Vasquez", masked_cpf: "***.845.199-**", email: "evasquez@private.net", lgpd_consent: false, status: "archived", added_on: "Mar 01, 2026" },
    ];

    const filteredClients = mockClients.filter(c =>
        c.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const openAddClient = () => {
        haptics.mediumTap();
        setIsModalOpen(true);
    };

    const handleSecureClientEntry = async (formData: any) => {
        // In a real app, Server Actions handle Supabase Insertion.
        // We pass the data to the secure server action to encrypt CPFs.
        await addSecureClient(formData);
        // We'd realistically refetch data here.
    };

    return (
        <div className="max-w-7xl mx-auto animate-fade-in">

            {/* Actions Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-3">
                        PII Vault
                        <span className="text-[10px] uppercase tracking-widest bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-2 py-0.5 rounded">AES-256</span>
                    </h1>
                    <p className="text-white/50 text-sm">Secure Client Registry. Identifiers are encrypted at rest.</p>
                </div>

                <div className="flex w-full md:w-auto gap-4">
                    <div className="relative flex-1 md:w-64">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        <input
                            type="text"
                            placeholder="Search entity..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-[#111] border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-white/30 transition-colors"
                        />
                    </div>
                    <button
                        className="bg-white text-black px-6 py-2 rounded-lg text-sm font-semibold pointer hover:bg-white/90 transition-colors shadow-lg whitespace-nowrap haptic-medium flex items-center gap-2"
                        onClick={openAddClient}
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        Register Entity
                    </button>
                </div>
            </div>

            {/* Data Table Widget */}
            <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden shadow-2xl relative">

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-[#111] border-b border-white/5 text-white/50 text-xs uppercase tracking-widest font-semibold flex-1">
                            <tr>
                                <th className="px-6 py-4">Legal Name</th>
                                <th className="px-6 py-4">CPF (Masked)</th>
                                <th className="px-6 py-4">Communication</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Data Entry Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {isLoading ? (
                                // Skeleton Loaders
                                [1, 2, 3].map(i => (
                                    <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                                        <td className="px-6 py-4"><div className="h-4 w-40 skeleton bg-white/5 rounded" /></td>
                                        <td className="px-6 py-4"><div className="h-4 w-32 skeleton bg-white/5 rounded" /></td>
                                        <td className="px-6 py-4"><div className="h-4 w-48 skeleton bg-white/5 rounded" /></td>
                                        <td className="px-6 py-4"><div className="h-6 w-16 skeleton bg-white/5 rounded-full" /></td>
                                        <td className="px-6 py-4 flex justify-end"><div className="h-4 w-24 skeleton bg-white/5 rounded" /></td>
                                    </tr>
                                ))
                            ) : filteredClients.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-white/30 text-sm">
                                        No entities found in secure vault.
                                    </td>
                                </tr>
                            ) : (
                                filteredClients.map((client) => (
                                    <tr key={client.client_id} className="group hover:bg-white/[0.03] transition-colors pointer" onClick={() => haptics.lightTap()}>
                                        <td className="px-6 py-4 font-semibold text-white/90">{client.full_name}</td>

                                        <td className="px-6 py-4 font-mono text-white/50 tracking-wider text-xs flex items-center gap-2">
                                            {client.masked_cpf}
                                            <button
                                                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-white/30 hover:text-white hover:bg-white/10 rounded pointer"
                                                title="Decrypt PII (Requires Master Admin)"
                                                onClick={(e) => { e.stopPropagation(); haptics.error(); }} // Simulate forbidden for lawyers
                                            >
                                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                            </button>
                                        </td>

                                        <td className="px-6 py-4 text-white/60 text-xs">
                                            {client.email}
                                            {!client.lgpd_consent && <span className="ml-2 text-[10px] text-red-500 bg-red-500/10 px-1 py-0.5 rounded">NO LGPD</span>}
                                        </td>

                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest border
                                  ${client.status === 'active' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-white/5 text-white/40 border-white/10'}
                               `}>
                                                {client.status}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4 text-right text-xs text-white/40">{client.added_on}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Client Interactive Modal */}
            <AddClientModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSecureClientEntry}
                tenantColor="#4338ca" // Hardcoded primary for Master Admin, would normally come from Context
            />
        </div>
    );
}
