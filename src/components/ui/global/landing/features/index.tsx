"use client";

import React from 'react';
import { BlurFade } from '@/components/ui/blur-fade';
import { MagicCard } from '@/components/ui/magic-card';
import { features } from '@/constants';

export const Features = () => {
    return (
        <section id="features" className="py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#0b0b0d] via-[#0e0e10] to-[#0b0b0d]">
            <div className="max-w-7xl mx-auto flex flex-col items-center gap-8">
                <BlurFade delay={0} inView className="text-center max-w-3xl">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white font-manrope">Transform Your Interview Process</h2>
                    <p className="mt-4 text-lg md:text-xl text-[#949fa6]">
                        Powerful features designed for modern technical hiring. Everything you need in one platform.
                    </p>
                </BlurFade>

                <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <BlurFade key={index} delay={index * 0.1} inView>
                                <MagicCard
                                    className="h-full p-8 bg-[#0e0e10] rounded-2xl border border-white/10"
                                    gradientSize={200}
                                    gradientColor="#1a1a1d"
                                    gradientOpacity={0.5}
                                    gradientFrom="#10b981"
                                    gradientTo="#14b8a6"
                                >
                                    <div className="flex flex-col items-start text-left h-full">
                                        <div className="p-3 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-xl border border-emerald-500/30">
                                            <Icon className="w-6 h-6 text-emerald-400" />
                                        </div>
                                        <h3 className="mt-6 text-xl font-bold text-white">{feature.title}</h3>
                                        <p className="mt-3 text-base text-[#949fa6] flex-grow">{feature.description}</p>
                                    </div>
                                </MagicCard>
                            </BlurFade>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

