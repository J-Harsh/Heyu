"use client";

import React from 'react';
import { BsJournalCode } from 'react-icons/bs';
import { BiLogoVisualStudio, BiLogoGmail } from 'react-icons/bi';
import { SiLeetcode } from 'react-icons/si';
import { BlurFade } from '@/components/ui/blur-fade';
import { OrbitingCircles } from '@/components/ui/orbiting-circles';


export const ComingSoonSection = () => {
    return (
        <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#0b0b0d] via-[#0e0e10] to-[#0b0b0d]">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <BlurFade delay={0} inView className="relative h-96 lg:h-[32rem] w-full overflow-hidden">
                    <div className="relative w-full h-full flex items-center justify-center">
                        <BsJournalCode className="text-white/50 text-7xl relative z-10" />

                        {/* Inner orbit - VSCode */}
                        <OrbitingCircles radius={120} duration={20} iconSize={50}>
                            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#10b981] to-[#14b8a6] flex items-center justify-center shadow-lg">
                                <BiLogoVisualStudio className="text-white text-2xl" />
                            </div>
                        </OrbitingCircles>

                        {/* Outer orbit - Email */}
                        <OrbitingCircles radius={180} duration={30} iconSize={40}>
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#10b981]/80 to-[#14b8a6]/80 flex items-center justify-center shadow-lg">
                                <BiLogoGmail className="text-white text-xl" />
                            </div>
                        </OrbitingCircles>



                        <OrbitingCircles radius={240} duration={20} iconSize={50}>
                            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#10b981] to-[#14b8a6] flex items-center justify-center shadow-lg">
                                <SiLeetcode className="text-white text-2xl" />
                            </div>
                        </OrbitingCircles>
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
                        and stay organized with <span className="text-[#10b981] font-semibold">email & calendar integrations</span>.
                        Everything you need to level up your coding journey, all in one place.
                    </p>

                </BlurFade>
            </div>
        </section>
    );
};

