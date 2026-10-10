"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ScheduleModal from './ScheduleModal';
import { haptics } from '../lib/haptics';
import type { TenantConfig } from '../lib/tenantConfig';

interface LandingProps {
    config: TenantConfig;
}

export default function LandingClientBlock({ config }: LandingProps) {
    const [isScheduleOpen, setIsScheduleOpen] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoaded(true), 800);
        return () => clearTimeout(timer);
    }, []);

    const openSchedule = (e: React.MouseEvent) => {
        e.preventDefault();
        haptics.mediumTap();
        setIsScheduleOpen(true);
    };

    return (
        <div
            className="min-h-screen text-[#f4f4f5] selection:text-white font-sans overflow-x-hidden"
            style={{
                backgroundColor: config.colors.background,
                // Inject dynamic selection color using CSS custom property hack if needed, or stick to static for now.
            }}
        >

            {/* 1. UNIFIED NAVIGATION */}
            <nav className="flex justify-between items-center p-6 md:px-12 fixed w-full top-0 z-50 backdrop-blur-xl border-b border-white/5" style={{ backgroundColor: `${config.colors.background}E6` }}>
                <div className="flex items-center gap-4 group pointer text-xl font-serif font-bold tracking-tighter" onClick={() => haptics.lightTap()}>
                    <div
                        className="w-6 h-6 relative skew-x-12 transform -rotate-12 rounded-[1px] group-hover:rotate-0 transition-transform duration-500"
                        style={{ backgroundColor: config.colors.primary }}
                    />
                    <span>{config.logoText}</span>
                </div>

                <div className="hidden lg:flex gap-10 text-xs font-semibold tracking-[0.2em] uppercase text-white/50">
                    <a href="#expertise" className="hover:text-white transition-colors haptic-click">Practice Areas</a>
                    <a href="#team" className="hover:text-white transition-colors haptic-click">Our Team</a>
                    <a href="#results" className="hover:text-white transition-colors haptic-click">Results</a>
                </div>

                <div className="flex items-center gap-6">
                    <Link href="/login" className="text-sm font-medium text-white/70 hover:text-white transition-colors hidden sm:block haptic-click">
                        Client Login
                    </Link>
                    <button
                        onClick={openSchedule}
                        className="text-white text-sm font-bold py-2.5 px-6 rounded-full transition-transform hover:scale-105 shadow-xl haptic-medium"
                        style={{ backgroundColor: config.colors.primary }}
                    >
                        Get Started
                    </button>
                </div>
            </nav>

            <div className="pt-32" />

            {/* 2. HERO SECTION */}
            <section className="px-6 md:px-12 lg:px-24 flex flex-col items-center justify-center min-h-[80vh] animate-fade-in relative">
                <div
                    className="absolute inset-0 pointer-events-none opacity-20"
                    style={{ background: `radial-gradient(circle at 50% 40%, ${config.colors.primary}, transparent 50%)` }}
                />

                <div className="mb-10 rounded-full border border-white/10 p-4 w-24 h-24 flex items-center justify-center opacity-60 pointer hover:opacity-100 transition-opacity rotate-0 hover:rotate-12 duration-700">
                    <div className="text-[10px] tracking-[0.3em] font-serif text-center uppercase leading-tight text-white/80">
                        Law <br />&<br /> Order
                    </div>
                </div>

                <div className="text-center max-w-5xl mx-auto space-y-6 relative z-10">
                    <h1 className="text-6xl md:text-[5.5rem] lg:text-[7rem] font-bold tracking-tighter leading-[0.95] mix-blend-lighten">
                        {config.copywriting.heroHeadline} <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-gray-500 font-serif italic pr-4">
                            {config.copywriting.heroAccent}
                        </span>
                    </h1>
                </div>

                <div className="mt-12 text-center text-white/40 text-lg md:text-xl font-light tracking-wide max-w-2xl leading-relaxed">
                    {config.copywriting.heroSubtitle}
                </div>

                <div className="mt-16 bg-[#111111] border border-white/10 rounded-full p-2 flex items-center w-full max-w-lg shadow-2xl relative overflow-hidden group hover:border-white/20 transition-colors">
                    <div className="pl-6 w-full text-white/30 text-sm font-medium tracking-wide flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse-fast" /> Attorneys available
                    </div>
                    <button
                        className="text-white text-sm font-bold py-3 px-8 rounded-full shrink-0 transition-colors pointer shadow-lg whitespace-nowrap"
                        style={{ backgroundColor: config.colors.primary }}
                        onClick={openSchedule}
                    >
                        Claim Consultation
                    </button>
                </div>
            </section>

            {/* 3. EXPERTISE / ABOUT (Arunika style layout) */}
            <section id="expertise" className="px-6 md:px-12 lg:px-24 py-32 border-t border-white/5 relative bg-white/5">
                <div className="flex flex-col lg:flex-row gap-16 item-start max-w-[1600px] mx-auto">
                    {/* Left Typographic Block */}
                    <div className="w-full lg:w-5/12">
                        <div className="text-xs font-bold tracking-[0.3em] uppercase mb-6 flex items-center gap-4" style={{ color: config.colors.primary }}>
                            <span className="w-12 h-[1px]" style={{ backgroundColor: config.colors.primary }} />
                            Our Expertise
                        </div>

                        <h2 className="text-4xl lg:text-5xl tracking-tighter leading-[1.1] mb-8 font-medium">
                            Commanding Authority.<br />
                            Unwavering Defense.<br />
                            <span className="font-serif italic text-white/80">For the Elite.</span>
                        </h2>

                        {!isLoaded ? (
                            <div className="space-y-4 mb-12">
                                <div className="h-4 w-full skeleton bg-white/5 rounded" />
                                <div className="h-4 w-11/12 skeleton bg-white/5 rounded" />
                                <div className="h-4 w-4/5 skeleton bg-white/5 rounded" />
                            </div>
                        ) : (
                            <p className="text-base font-light leading-loose opacity-60 mb-12 max-w-md">
                                {config.copywriting.aboutText}
                            </p>
                        )}

                        <button
                            className="bg-transparent border border-white/20 px-8 py-3 rounded-full text-sm font-semibold pointer hover:bg-white hover:text-black transition-all duration-300 flex items-center gap-3 haptic-medium"
                            onClick={openSchedule}
                        >
                            Discuss Your Case
                        </button>
                    </div>

                    {/* Right Abstract Masonry */}
                    <div className="w-full lg:w-7/12 grid grid-cols-2 gap-6 h-[500px]">
                        {!isLoaded ? (
                            <>
                                <div className="skeleton bg-white/5 rounded-2xl h-full col-span-1 border border-white/5" />
                                <div className="flex flex-col gap-6 col-span-1 h-full">
                                    <div className="skeleton bg-white/5 rounded-2xl flex-1 border border-white/5" />
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="bg-[#111] rounded-2xl overflow-hidden shadow-2xl relative col-span-1 h-full group pointer">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                                    {/* Legal Library Aesthetic Image */}
                                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center grayscale opacity-40 group-hover:opacity-60 group-hover:scale-105 transition-all duration-700" />
                                </div>
                                <div className="flex flex-col gap-6 col-span-1 h-full">
                                    <div className="bg-[#1a1a1a] rounded-2xl flex-1 overflow-hidden relative group border border-white/5">
                                        <div className="absolute inset-0 flex items-center justify-center p-8 text-center text-white/50 text-xl font-serif font-light leading-snug group-hover:text-white transition-colors duration-500">
                                            "Fiat Justitia Ruat Caelum — Let justice be done though the heavens fall."
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* 4. EXPANDED: THE TEAM (Attorney Profiles) */}
            <section id="team" className="px-6 md:px-12 lg:px-24 py-32 max-w-[1600px] mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl lg:text-5xl font-bold tracking-tighter mb-4">The Advocates</h2>
                    <p className="text-white/50 font-light max-w-xl mx-auto">Elite counsel prepared to fiercely litigate on your behalf.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {config.team.map((member, i) => (
                        <div key={i} className="group pointer">
                            <div className="w-full aspect-[4/5] bg-[#111] rounded-2xl overflow-hidden mb-6 relative">
                                {!isLoaded ? (
                                    <div className="w-full h-full skeleton bg-white/5" />
                                ) : (
                                    <div
                                        className="absolute inset-0 bg-cover bg-center grayscale group-hover:grayscale-0 transition-all duration-700"
                                        style={{ backgroundImage: `url(${member.imageUrl})` }}
                                    />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-80" />
                            </div>
                            <h3 className="text-xl font-bold tracking-tight mb-1">{member.name}</h3>
                            <p className="text-sm font-medium" style={{ color: config.colors.primary }}>{member.role}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* 5. EXPANDED: TESTIMONIALS (Social Proof) */}
            <section id="results" className="px-6 md:px-12 lg:px-24 py-32 bg-white/5 border-t border-b border-white/5 text-center">
                <h2 className="text-4xl lg:text-5xl font-bold tracking-tighter mb-16">Proven Results.</h2>

                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
                    {config.testimonials.map((test, i) => (
                        <div key={i} className="p-8 rounded-3xl bg-[#0a0a0a] border border-white/10 relative">
                            <div className="text-4xl font-serif text-white/20 absolute top-4 left-6">"</div>
                            <p className="text-lg font-serif italic text-white/80 leading-relaxed mb-6 mt-4 z-10 relative">
                                {test.quote}
                            </p>
                            <div className="text-xs font-bold tracking-[0.2em] uppercase" style={{ color: config.colors.primary }}>
                                — {test.client}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 6. EXPANDED: DEEP FOOTER */}
            <footer className="py-20 px-6 md:px-12 lg:px-24 bg-[#020202]">
                <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 text-sm text-white/50 mb-16">
                    <div className="col-span-1 md:col-span-2">
                        <div className="text-2xl font-serif font-bold text-white mb-6 tracking-tighter">{config.firmName}</div>
                        <p className="max-w-xs leading-relaxed">Representing the pinnacle of corporate defense and aggressive litigation strategy.</p>
                    </div>
                    <div>
                        <h4 className="text-white font-semibold mb-6 uppercase tracking-widest text-xs">Headquarters</h4>
                        <p className="leading-relaxed">100 Executive Plaza<br />Suite 4500<br />Metropolis, NY 10001</p>
                    </div>
                    <div>
                        <h4 className="text-white font-semibold mb-6 uppercase tracking-widest text-xs">Direct Inquiry</h4>
                        <p className="leading-relaxed hover:text-white transition-colors pointer">contact@{config.domain.replace('localhost:3002', 'lexsystem.com')}</p>
                        <p className="mt-2 text-white/30 text-xs">Secured Communications Only</p>
                    </div>
                </div>
                <div className="border-t border-white/10 pt-8 text-center text-xs tracking-widest uppercase opacity-40">
                    &copy; {new Date().getFullYear()} {config.firmName}. All Rights Reserved. Powered by Lex System B.L.A.S.T Core.
                </div>
            </footer>

            {/* CAL.COM STYLE MODAL INTEGRATION */}
            <ScheduleModal isOpen={isScheduleOpen} onClose={() => setIsScheduleOpen(false)} lawyerName={config.firmName} />

        </div>
    );
}
