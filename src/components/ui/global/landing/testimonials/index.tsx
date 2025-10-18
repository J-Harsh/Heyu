"use client";

import React from 'react';
import Image from 'next/image';
import { BlurFade } from '@/components/ui/blur-fade';
import { MagicCard } from '@/components/ui/magic-card';
import { testimonials } from '@/constants';

const Badge = ({ children }: { children: React.ReactNode }) => (
    <div className="inline-flex items-center bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 rounded-full px-5 py-2 text-sm text-emerald-400 font-medium shadow-lg shadow-emerald-500/10">
        {children}
    </div>
);

export const Testimonials = () => {
    return (
        <section id="testimonials" className="py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#0b0b0d] via-[#0d1410] to-[#0b0b0d]">
            <div className="max-w-7xl mx-auto">
                <BlurFade delay={0} inView className="lg:w-2/3">
                    <Badge>Client testimonials</Badge>
                    <h2 className="mt-6 text-3xl md:text-4xl lg:text-5xl font-bold text-white font-manrope leading-tight">
                        Trusted by industry leaders, <span className="text-[#949fa6]">loved by hiring teams.</span>
                    </h2>
                    <p className="mt-4 text-lg md:text-xl text-[#949fa6] leading-relaxed">
                        See how companies are transforming their technical hiring process with HeyU.
                        Join thousands of satisfied customers who trust our platform.
                    </p>
                </BlurFade>
                <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {testimonials.map((testimonial, index) => (
                        <BlurFade key={index} delay={index * 0.1} inView>
                            <MagicCard
                                className="bg-[#0e0e10] border border-[#19191a] rounded-2xl p-6 h-full"
                                gradientSize={200}
                                gradientColor="#1a1a1d"
                                gradientOpacity={0.5}
                                gradientFrom="#10b981"
                                gradientTo="#14b8a6"
                            >
                                <div className="flex flex-col h-full">
                                    <p className="text-[#949fa6] text-base leading-relaxed flex-grow">&ldquo;{testimonial.quote}&rdquo;</p>
                                    <div className="mt-6 flex items-center gap-4">
                                        <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-emerald-500/30">
                                            <Image
                                                src={testimonial.avatar}
                                                alt={testimonial.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-white">{testimonial.name}</p>
                                            <p className="text-sm text-[#949fa6]">{testimonial.title}</p>
                                        </div>
                                    </div>
                                </div>
                            </MagicCard>
                        </BlurFade>
                    ))}
                </div>
            </div>
        </section>
    );
};

