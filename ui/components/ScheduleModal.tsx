"use client";

import { useState } from 'react';
import Modal from './Modal';
import { haptics } from '../lib/haptics';

interface ScheduleModalProps {
    isOpen: boolean;
    onClose: () => void;
    lawyerName?: string;
}

export default function ScheduleModal({ isOpen, onClose, lawyerName = "J. Firm Partner" }: ScheduleModalProps) {
    const [selectedDate, setSelectedDate] = useState<number | null>(17); // Default to mock attachment date
    const [selectedTime, setSelectedTime] = useState<string | null>(null);

    // Mock Calendar Data
    const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const dates = Array.from({ length: 31 }, (_, i) => i + 1);
    const timeSlots = ['16:40', '17:00', '17:20', '17:40', '18:00'];

    const handleDateSelect = (date: number) => {
        setSelectedDate(date);
        setSelectedTime(null);
        haptics.lightTap();
    };

    const handleTimeSelect = (time: string) => {
        setSelectedTime(time);
        haptics.mediumTap(); // Medium tap signifies a primary selection choice
    };

    const handleConfirm = () => {
        haptics.success();
        // Simulate API Call
        setTimeout(() => {
            onClose();
        }, 500);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="xl" showCloseButton={false}>
            <div className="flex flex-col md:flex-row bg-[#111111] text-white -m-6 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 relative">

                {/* Left Column: Context Area */}
                <div className="w-full md:w-1/3 p-6 md:p-8 border-r border-white/10 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 rounded-full bg-white/10 shrink-0" />
                            <span className="text-sm opacity-70 font-medium">{lawyerName}</span>
                        </div>

                        <h2 className="text-2xl font-bold mb-2 tracking-tight">Discovery Call</h2>
                        <p className="opacity-60 text-sm mb-8 leading-relaxed">
                            Let's see if our firm is the right fit to defend your rights.
                        </p>

                        <div className="space-y-4 text-sm font-medium opacity-80">
                            <div className="flex items-center gap-3">
                                <svg className="w-4 h-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                Requires confirmation
                            </div>
                            <div className="flex items-center gap-3">
                                <svg className="w-4 h-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                20m
                            </div>
                            <div className="flex items-center gap-3">
                                <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" /></svg>
                                Google Meet
                            </div>
                            <div className="flex items-center gap-3">
                                <svg className="w-4 h-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                America/Sao_Paulo
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="mt-8 text-sm opacity-40 hover:opacity-100 transition-opacity flex items-center gap-2 pointer"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        Cancel
                    </button>
                </div>

                {/* Middle Column: Calendar Grid */}
                <div className="w-full md:w-1/3 p-6 md:p-8 flex flex-col border-r border-white/10">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="font-semibold tracking-wide">March 2026</h3>
                        <div className="flex gap-4 opacity-50">
                            <button className="pointer hover:opacity-100 transition-opacity">&lt;</button>
                            <button className="pointer hover:opacity-100 transition-opacity">&gt;</button>
                        </div>
                    </div>

                    <div className="grid grid-cols-7 gap-y-4 mb-4 text-xs font-semibold opacity-50 tracking-widest text-center">
                        {daysOfWeek.map(d => <div key={d}>{d}</div>)}
                    </div>

                    <div className="grid grid-cols-7 gap-2">
                        {/* Offset empty cells (simulating March starting on Sunday) */}
                        <div /><div /><div />
                        {dates.map((date) => {
                            const isActive = selectedDate === date;
                            const isPast = date < 15; // Mock past logic

                            if (isPast) {
                                return <div key={date} className="h-10 w-10 flex items-center justify-center text-sm opacity-20 pointer-events-none">{date}</div>;
                            }

                            return (
                                <button
                                    key={date}
                                    onClick={() => handleDateSelect(date)}
                                    className={`
                    h-10 w-10 rounded-lg flex items-center justify-center text-sm font-medium transition-all pointer
                    ${isActive ? 'bg-white text-black scale-110 shadow-lg' : 'hover:bg-white/10'}
                  `}
                                >
                                    {date}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Right Column: Time Slots */}
                <div className="w-full md:w-1/3 p-6 md:p-8">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="font-semibold tracking-wide">{selectedDate ? `Tue ${selectedDate}` : 'Select Date'}</h3>
                        <div className="flex bg-white/10 rounded-lg overflow-hidden text-xs font-medium">
                            <button className="px-3 py-1 bg-white/20 pointer">12h</button>
                            <button className="px-3 py-1 opacity-50 hover:bg-white/10 pointer transition-colors">24h</button>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {timeSlots.map((time) => {
                            const isSelected = selectedTime === time;
                            return (
                                <div key={time} className="flex gap-2">
                                    <button
                                        onClick={() => handleTimeSelect(time)}
                                        className={`
                         flex-1 py-3 rounded-xl border text-sm font-medium transition-all pointer
                         ${isSelected ? 'bg-white text-black border-white' : 'border-white/20 hover:border-white/50 text-white/80'}
                       `}
                                    >
                                        {time}
                                    </button>

                                    {/* Slide-in Confirm Button */}
                                    {isSelected && (
                                        <button
                                            onClick={handleConfirm}
                                            className="w-16 bg-primary text-white rounded-xl text-sm font-bold flex items-center justify-center pointer animate-fade-in shadow-[0_0_15px_rgba(67,56,202,0.5)] haptic-heavy"
                                        >
                                            OK
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </Modal>
    );
}
