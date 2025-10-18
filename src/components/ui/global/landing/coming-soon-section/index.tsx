"use client";

import React, { useRef } from 'react';
import { BsJournalCode } from 'react-icons/bs';
import { BiLogoVisualStudio, BiLogoGmail } from 'react-icons/bi';
import { SiLeetcode } from 'react-icons/si';
import { FaVideo } from 'react-icons/fa';
import { BlurFade } from '@/components/ui/blur-fade';
import { AnimatedBeam } from '@/components/ui/animated-beam';


export const ComingSoonSection = () => {
    const containerRef = useRef<HTMLDivElement>(null)
    const centerRef = useRef<HTMLDivElement>(null)
    const vscodeRef = useRef<HTMLDivElement>(null)
    const leetcodeRef = useRef<HTMLDivElement>(null)
    const gmailRef = useRef<HTMLDivElement>(null)
    const videoRef = useRef<HTMLDivElement>(null)

    return (
        <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#0b0b0d] via-[#0e0e10] to-[#0b0b0d]">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <BlurFade delay={0} inView className="flex items-center justify-center w-full">
                    <div
                        className="relative h-[280px] w-[280px] md:h-[320px] md:w-[320px] overflow-hidden"
                        ref={containerRef}
                    >
                        {/* Center Logo */}
                        <div
                            ref={centerRef}
                            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 flex size-16 items-center justify-center rounded-full border-2 bg-white p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]"
                        >
                            <BsJournalCode className="text-[#10b981] text-3xl" />
                        </div>

                        {/* Top Left Corner - VS Code */}
                        <div
                            ref={vscodeRef}
                            className="absolute top-4 left-4 z-10 flex size-12 items-center justify-center rounded-full border-2 bg-white p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]"
                        >
                            <BiLogoVisualStudio className="text-blue-600 text-2xl" />
                        </div>

                        {/* Top Right Corner - Gmail */}
                        <div
                            ref={gmailRef}
                            className="absolute top-4 right-4 z-10 flex size-12 items-center justify-center rounded-full border-2 bg-white p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]"
                        >
                            <BiLogoGmail className="text-red-500 text-2xl" />
                        </div>

                        {/* Bottom Left Corner - LeetCode */}
                        <div
                            ref={leetcodeRef}
                            className="absolute bottom-4 left-4 z-10 flex size-12 items-center justify-center rounded-full border-2 bg-white p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]"
                        >
                            <SiLeetcode className="text-orange-500 text-2xl" />
                        </div>

                        {/* Bottom Right Corner - Video */}
                        <div
                            ref={videoRef}
                            className="absolute bottom-4 right-4 z-10 flex size-12 items-center justify-center rounded-full border-2 bg-white p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]"
                        >
                            <FaVideo className="text-purple-600 text-2xl" />
                        </div>

                        {/* Top Left to Center */}
                        <AnimatedBeam
                            containerRef={containerRef}
                            fromRef={vscodeRef}
                            toRef={centerRef}
                            curvature={0}
                            gradientStartColor="#10b981"
                            gradientStopColor="#14b8a6"
                        />

                        {/* Top Right to Center */}
                        <AnimatedBeam
                            containerRef={containerRef}
                            fromRef={gmailRef}
                            toRef={centerRef}
                            curvature={0}
                            gradientStartColor="#10b981"
                            gradientStopColor="#14b8a6"
                        />

                        {/* Bottom Left to Center */}
                        <AnimatedBeam
                            containerRef={containerRef}
                            fromRef={leetcodeRef}
                            toRef={centerRef}
                            curvature={0}
                            gradientStartColor="#10b981"
                            gradientStopColor="#14b8a6"
                        />

                        {/* Bottom Right to Center */}
                        <AnimatedBeam
                            containerRef={containerRef}
                            fromRef={videoRef}
                            toRef={centerRef}
                            curvature={0}
                            gradientStartColor="#10b981"
                            gradientStopColor="#14b8a6"
                        />
                    </div>
                </BlurFade>

                <BlurFade delay={0.2} inView className="flex flex-col gap-6">

                    <div className="flex items-center gap-3">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white font-manrope leading-tight">
                            Powerful features <span className="text-[#949fa6]">coming soon.</span>
                        </h2>
                        <span className="px-3 py-1 text-xs font-semibold text-[#10b981] bg-[#10b981]/10 border border-[#10b981]/20 rounded-full whitespace-nowrap">
                            COMING SOON
                        </span>
                    </div>
                    <p className="text-base md:text-lg text-white/70 leading-relaxed">
                        Write and run code directly in our <span className="text-[#10b981] font-semibold">VS Code-like editor</span>,
                        sync your progress with <span className="text-[#10b981] font-semibold">LeetCode</span>,
                        stay organized with <span className="text-[#10b981] font-semibold">Gmail integrations</span>,
                        and conduct <span className="text-[#10b981] font-semibold">video interviews</span> seamlessly.
                        Everything you need to level up your coding journey, all in one place.
                    </p>

                </BlurFade>
            </div>
        </section>
    );
};

