"use client";

import React from 'react';
import Link from 'next/link';
import { BlurFade } from '@/components/ui/blur-fade';
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient';
import { BorderBeam } from '@/components/ui/border-beam';
import { DotPattern } from '@/components/ui/dot-pattern';

export const CTA = () => {
    return (
        <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#0b0b0d] via-[#0d1410] to-[#0b0b0d]">
            <BlurFade delay={0} inView>
                <div className="max-w-7xl mx-auto bg-cover bg-center rounded-3xl p-12 md:p-20 text-center relative overflow-hidden border border-[#19191a]">
                    <BorderBeam
                        size={200}
                        duration={12}
                        delay={0}
                        colorFrom="#10b981"
                        colorTo="#14b8a6"
                        borderWidth={2}
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-[#0b0b0d] via-[#0e0e10] to-[#0b0b0d]"></div>
                    <DotPattern
                        className="absolute inset-0 text-[#10b981]/40 [mask-image:radial-gradient(400px_circle_at_center,white,transparent)]"
                    />
                    <div className="relative z-10 flex flex-col items-center gap-8">
                        <h2 className="text-3xl md:text-5xl font-bold text-white font-manrope">Ready to Transform Your Interviews?</h2>
                        <p className="max-w-2xl text-lg md:text-xl text-[#949fa6]">Start your journey today for free and experience seamless technical hiring.</p>
                        <Link href="/sign-in">
                            <HoverBorderGradient
                                containerClassName="rounded-full"
                                as="button"
                                className="dark:bg-black bg-white text-black dark:text-white px-12 py-4 text-lg font-bold"
                                gradientColor="#10b981"
                            >
                                <span>Start for Free →</span>
                            </HoverBorderGradient>
                        </Link>
                    </div>
                </div>
            </BlurFade>
        </section>
    );
};

