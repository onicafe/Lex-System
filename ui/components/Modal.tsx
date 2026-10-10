"use client";

import { ReactNode, useEffect, useState } from 'react';
import { haptics } from '../lib/haptics';

// Lex System UI Rule #3: Complete avoidance of native alert() or confirm().
// This is the core polymorphic modal manager.

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    showCloseButton?: boolean;
}

export default function Modal({
    isOpen,
    onClose,
    title,
    children,
    size = 'md',
    showCloseButton = true
}: ModalProps) {
    const [shouldRender, setShouldRender] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setShouldRender(true);
            haptics.lightTap(); // Fire haptic on open
            // Prevent body scroll
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
            // We delay unmounting to allow the exit animation to fire
            setTimeout(() => setShouldRender(false), 300);
        }
    }, [isOpen]);

    if (!shouldRender) return null;

    const sizeClasses = {
        sm: 'max-w-sm',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl'
    };

    return (
        <div
            className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
            role="dialog"
            aria-modal="true"
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer transition-opacity"
                onClick={() => {
                    haptics.lightTap();
                    onClose();
                }}
            />

            {/* Modal Card */}
            <div
                className={`relative w-full ${sizeClasses[size]} bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}
            >
                {/* Header (Optional) */}
                {(title || showCloseButton) && (
                    <div className="flex items-center justify-between px-6 py-4 border-b border-border/50 bg-black/5 dark:bg-white/5">
                        {title && <h3 className="text-lg font-semibold tracking-tight">{title}</h3>}

                        {showCloseButton && (
                            <button
                                onClick={() => {
                                    haptics.lightTap();
                                    onClose();
                                }}
                                className="ml-auto flex items-center justify-center w-8 h-8 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors pointer text-foreground/50 hover:text-foreground"
                                aria-label="Close modal"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>
                )}

                {/* Content Body */}
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
}
