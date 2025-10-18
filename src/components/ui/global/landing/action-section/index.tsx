"use client";

import React from 'react';
import { BlurFade } from '@/components/ui/blur-fade';
import { NumberTicker } from '@/components/ui/number-ticker';
import { stats } from '@/constants';

export const ActionSection = () => {
    return (
        <section className="relative py-12 md:py-16 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-[#0b0b0d] via-[#0d1410] to-[#0b0b0d]">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <BlurFade delay={0} inView className="text-center mb-10 max-w-3xl mx-auto">
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                        Trusted by Thousands Worldwide
                    </h2>
                    <p className="text-lg md:text-xl text-[#949fa6] leading-relaxed">
                        Join the companies revolutionizing their interview process with HeyU.
                        Our platform delivers exceptional results at scale.
                    </p>
                </BlurFade>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {stats.map((stat, index) => (
                        <BlurFade key={index} delay={0.2 + index * 0.1} inView>
                            <div className="relative group">
                                {/* Card Content */}
                                <div className="relative bg-[#0e0e10] rounded-2xl p-8 md:p-10 border border-white/10 hover:border-white/20 transition-all duration-300">
                                    {/* Stat Value */}
                                    <div className="mb-4">
                                        {stat.value.includes('+') || stat.value.includes('%') ? (
                                            <div className="flex items-baseline gap-1">
                                                {stat.value.match(/[\d,]+/) && (
                                                    <NumberTicker
                                                        value={parseInt(stat.value.match(/[\d,]+/)?.[0].replace(/,/g, '') || '0')}
                                                        className="text-5xl md:text-6xl lg:text-7xl font-bold text-white"
                                                        direction="up"
                                                        delay={0.5}
                                                    />
                                                )}
                                                <span className="text-5xl md:text-6xl lg:text-7xl font-bold text-white">
                                                    {stat.value.replace(/[\d,]+/, '')}
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-5xl md:text-6xl lg:text-7xl font-bold text-white">
                                                {stat.value}
                                            </span>
                                        )}
                                    </div>

                                    {/* Divider */}
                                    <div className="w-full h-px bg-white/10 mb-4" />

                                    {/* Description */}
                                    <p className="text-base md:text-lg text-[#949fa6] leading-relaxed">
                                        {stat.description}
                                    </p>
                                </div>
                            </div>
                        </BlurFade>
                    ))}
                </div>

                {/* Bottom CTA */}
                <BlurFade delay={0.6} inView className="mt-10 text-center">
                    <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                        <div className="flex -space-x-2">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div
                                    key={i}
                                    className="w-10 h-10 rounded-full bg-white/10 border-2 border-[#0b0b0d] flex items-center justify-center text-white/70 font-bold text-sm"
                                >
                                    {String.fromCharCode(64 + i)}
                                </div>
                            ))}
                        </div>
                        <p className="text-white/90 text-sm sm:text-base">
                            Join <span className="font-bold text-white">500+</span> companies already using HeyU
                        </p>
                    </div>
                </BlurFade>
            </div>
        </section>
    );
};
