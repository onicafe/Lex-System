"use client";

import { useState } from 'react';
import Modal from './Modal';
import { haptics } from '../lib/haptics';

interface AddClientModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (clientData: any) => Promise<void>;
    tenantColor: string;
}

export default function AddClientModal({ isOpen, onClose, onSubmit, tenantColor }: AddClientModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        fullName: '',
        cpf: '',
        rg: '',
        email: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        // Basic Validation (B.L.A.S.T prevents native alerts)
        if (!formData.fullName || !formData.cpf) {
            haptics.error();
            setError("Full Name and CPF are mandatory fields according to LGPD registry protocols.");
            setIsLoading(false);
            return;
        }

        try {
            await onSubmit(formData);
            haptics.success();
            // Reset form
            setFormData({ fullName: '', cpf: '', rg: '', email: '' });
            onClose();
        } catch (err: any) {
            haptics.error();
            setError(err.message || "Failed to securely register client.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Register Entity (PII Vault)" size="md">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-[#f4f4f5]">
                {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-md animate-fade-in">
                        {error}
                    </div>
                )}

                <p className="text-white/40 text-xs mb-2 leading-relaxed">
                    Data entered here is subjected to B.L.A.S.T Doctrine. Personally Identifiable Information (CPF, RG) will be intercepted by the App Router and AES-256 encrypted before reaching the database.
                </p>

                <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold tracking-wide text-white/70 uppercase">Full Legal Name</label>
                    <input
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="bg-[#111] border border-white/10 rounded-md p-3 text-sm focus:outline-none transition-colors"
                        style={{ focusBorderColor: tenantColor } as any} // Hacky inline style approximation, ideally we use styled-components or complex tailwind classes here, but standard outline is fine for now
                        placeholder="John Doe"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold tracking-wide text-white/70 uppercase">CPF (Registry ID)</label>
                        <input
                            name="cpf"
                            value={formData.cpf}
                            onChange={handleChange}
                            className="bg-[#111] border border-white/10 rounded-md p-3 text-sm focus:outline-none transition-colors"
                            placeholder="000.000.000-00"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold tracking-wide text-white/70 uppercase">RG (State ID)</label>
                        <input
                            name="rg"
                            value={formData.rg}
                            onChange={handleChange}
                            className="bg-[#111] border border-white/10 rounded-md p-3 text-sm focus:outline-none transition-colors"
                            placeholder="State Issue Number"
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold tracking-wide text-white/70 uppercase">Secure Contact Email</label>
                    <input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="bg-[#111] border border-white/10 rounded-md p-3 text-sm focus:outline-none transition-colors"
                        placeholder="client@domain.com"
                    />
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 rounded-md text-sm font-semibold text-white/50 hover:bg-white/5 hover:text-white transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-6 py-2 rounded-md text-sm font-semibold text-white disabled:opacity-50 haptic-click shadow-lg transition-transform hover:scale-105"
                        style={{ backgroundColor: tenantColor }}
                    >
                        {isLoading ? 'Encrypting...' : 'Secure Vault Entry'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
