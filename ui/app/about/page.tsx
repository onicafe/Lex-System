"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ScheduleModal from '../../components/ScheduleModal';
import { haptics } from '../../lib/haptics';

export default function AboutContent() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Simulate network load to showcase B.L.A.S.T UX Rule 4: Skeleton Loaders
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="min-h-screen bg-[#faf8f5] text-[#111111] selection:bg-black selection:text-[#faf8f5] font-sans pb-32">

            {/* Editorial Navigation */}
            <nav className="flex justify-between items-center p-8 md:px-16 w-full">
                <div className="text-xl font-serif font-semibold tracking-tight pointer">Arunika & Co</div>
                <div className="hidden md:flex gap-8 text-sm font-medium tracking-wide">
                    <Link href="#" className="hover:opacity-60 transition-opacity">About Us</Link>
                    <span>—</span>
                    <Link href="#" className="hover:opacity-60 transition-opacity">People</Link>
                    <span>—</span>
                    <Link href="#" className="hover:opacity-60 transition-opacity">Office</Link>
                </div>
                <button
                    onClick={() => {
                        haptics.mediumTap();
                        setIsModalOpen(true);
                    }}
                    className="bg-black/5 hover:bg-black/10 px-6 py-2 rounded-full text-sm font-semibold pointer transition-colors haptic-click"
                >
                    Contact Us
                </button>
            </nav>

            {/* Main Content Layout (Attachment 2/3 style) */}
            <main className="px-8 md:px-16 mt-20 max-w-[1400px] mx-auto animate-fade-in">

                {/* Typographic Hero */}
                <div className="flex flex-col md:flex-row gap-12 mb-16 items-end relative">
                    <div className="w-full md:w-2/3">
                        <h1 className="text-5xl md:text-7xl lg:text-[5rem] leading-[1.05] tracking-tight font-medium">
                            Illuminating Justice,<br />
                            Protecting Your<br />
                            Rights.
                        </h1>
                    </div>

                    <div className="w-full md:w-1/3 flex flex-col justify-end border-l-2 border-black/10 pl-6 pb-2">
                        <p className="text-sm md:text-base font-medium opacity-80 leading-relaxed max-w-xs">
                            We stand by your side in every step toward legal certainty.
                        </p>
                        <button
                            onClick={() => {
                                haptics.mediumTap();
                                setIsModalOpen(true);
                            }}
                            className="mt-8 bg-black hover:bg-black/80 text-white px-6 py-3 rounded-full text-sm font-semibold pointer shadow-md w-fit flex items-center gap-3 transition-colors haptic-medium group"
                        >
                            Let's Discuss
                            <svg className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                        </button>
                    </div>

                    {/* Abstract Geometric Element (Attachment 2 reference) */}
                    <div className="absolute top-0 right-0 hidden lg:flex flex-col gap-1 opacity-90">
                        <div className="flex gap-1 justify-end">
                            <div className="w-12 h-12 bg-black"></div>
                        </div>
                        <div className="flex gap-1">
                            <div className="w-12 h-12 bg-black"></div>
                            <div className="w-12 h-12 bg-black"></div>
                        </div>
                    </div>
                </div>

                {/* Hero Image Container with Skeleton */}
                <div className="w-full h-[50vh] min-h-[400px] rounded-3xl overflow-hidden shadow-2xl relative mb-24 border border-black/5">
                    {isLoading ? (
                        <div className="w-full h-full skeleton bg-black/10" />
                    ) : (
                        <div className="w-full h-full bg-[#1e2329] flex items-center justify-center relative">
                            {/* Simulated 'Lady Justice' hero image using CSS blocks for stark contrast */}
                            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/80" />
                            <div className="text-white/20 text-[10rem] font-serif tracking-widest leading-none absolute">JUSTICE</div>
                        </div>
                    )}
                </div>

                {/* Secondary Editorial Section (Attachment 3 reference) */}
                <div className="flex flex-col md:flex-row gap-16 item-start">

                    {/* Left Block */}
                    <div className="w-full md:w-5/12">
                        <h2 className="text-4xl lg:text-5xl tracking-tight leading-tight mb-8 font-medium">
                            Our Legal Experts,<br />
                            Your Trusted<br />
                            Advocates
                        </h2>

                        {isLoading ? (
                            <div className="space-y-3 mb-10">
                                <div className="h-4 w-full skeleton bg-black/10 rounded" />
                                <div className="h-4 w-11/12 skeleton bg-black/10 rounded" />
                                <div className="h-4 w-4/5 skeleton bg-black/10 rounded" />
                            </div>
                        ) : (
                            <p className="text-sm font-medium leading-relaxed opacity-80 mb-10 max-w-md">
                                At Arunika & Co, our seasoned lawyers bring years of expertise and dedication to every case. We stand by your side, ensuring your rights are protected with strategic legal solutions, unwavering commitment, and a results-driven approach. Trust us to navigate complexities and fight for your justice.
                            </p>
                        )}

                        <button
                            className="bg-transparent border border-black px-6 py-3 rounded-full text-sm font-semibold pointer hover:bg-black/5 transition-colors haptic-click flex items-center gap-3"
                        >
                            See Advocates <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                        </button>
                    </div>

                    {/* Right Block (Masonry style layout) */}
                    <div className="w-full md:w-7/12 grid grid-cols-2 gap-4 h-[500px]">
                        {isLoading ? (
                            <>
                                <div className="skeleton bg-black/5 rounded-xl h-full col-span-1 border border-black/5" />
                                <div className="flex flex-col gap-4 col-span-1 h-full">
                                    <div className="skeleton bg-black/5 rounded-xl flex-1 border border-black/5" />
                                    <div className="skeleton bg-black/5 rounded-xl h-1/3 border border-black/5" />
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="bg-[#111] rounded-xl overflow-hidden shadow-inner relative col-span-1 h-full">
                                    <div className="absolute inset-0 flex items-center justify-center text-white/10 font-serif text-3xl">-</div>
                                </div>
                                <div className="flex flex-col gap-4 col-span-1 h-full">
                                    <div className="bg-[#333] rounded-xl flex-1 overflow-hidden relative">
                                        <div className="absolute inset-0 flex items-center justify-center text-white/10 font-serif">-</div>
                                    </div>
                                    <div className="bg-[#1e1e1e] rounded-xl h-1/3 flex items-center justify-center text-white/50 text-xs font-medium tracking-widest px-4 text-center">
                                        EST. 1994
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                </div>

            </main>

            {/* Integrate the Cal.com style schedule modal */}
            <ScheduleModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} lawyerName="Arunika Partner" />

        </div>
    );
}
