"use client";

import React from 'react';
import Link from 'next/link';
import { BsJournalCode } from 'react-icons/bs';
import { BlurFade } from '@/components/ui/blur-fade';
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient';
import { BorderBeam } from '@/components/ui/border-beam';

export const Hero = () => {
    return (
        <section id="hero" className="py-20 md:py-52 px-4 pt-32">
            <div className="max-w-7xl mx-auto flex flex-col items-center gap-[5rem]">
                <BlurFade delay={0} inView className="flex flex-col items-center gap-8 text-center max-w-4xl">
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white font-manrope leading-tight">
                        <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-br from-white via-emerald-200 to-emerald-500">
                            Elevate your interviews, seamlessly.
                        </span>
                    </h1>
                    <p className="max-w-2xl text-lg md:text-xl text-[#949fa6] leading-relaxed">
                        Experience crystal-clear HD video interviews with built-in live code collaboration.
                        The modern platform for seamless technical interviews.
                    </p>
                    <Link href="/sign-in">
                        <HoverBorderGradient
                            containerClassName="rounded-full"
                            as="button"
                            className="dark:bg-black bg-white text-black dark:text-white px-10 py-4 text-lg font-bold"
                            gradientColor="#10b981"
                        >
                            <span>Get Started →</span>
                        </HoverBorderGradient>
                    </Link>
                </BlurFade>

                <BlurFade delay={0.2} inView className="relative w-full max-w-5xl h-64 sm:h-80 md:h-[420px]">
                    <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[45%] sm:w-[35%] md:w-[302px] h-auto aspect-[0.9] opacity-30 blur-sm">
                        <div className="w-full h-full bg-gradient-to-br from-[#10b981]/20 to-[#14b8a6]/20 rounded-xl border border-white/10"></div>
                    </div>
                    <div className="absolute top-1/2 left-3/4 -translate-x-1/2 -translate-y-1/2 w-[45%] sm:w-[35%] md:w-[302px] h-auto aspect-[0.9] opacity-30 blur-sm">
                        <div className="w-full h-full bg-gradient-to-br from-[#14b8a6]/20 to-[#10b981]/20 rounded-xl border border-white/10"></div>
                    </div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] sm:w-[50%] md:w-[379px] h-auto aspect-[0.9] z-10">
                        <div className="relative w-full h-full bg-gradient-to-br from-[#10b981]/30 to-[#14b8a6]/30 rounded-xl shadow-2xl border border-white/20 flex items-center justify-center overflow-hidden">
                            <BorderBeam
                                size={200}
                                duration={15}
                                delay={0}
                                colorFrom="#10b981"
                                colorTo="#14b8a6"
                                borderWidth={2}
                            />
                            <BsJournalCode className="text-white/40 text-8xl relative z-10" />
                        </div>
                    </div>
                </BlurFade>
            </div>
        </section>
    );
};

