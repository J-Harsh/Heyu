"use client";

import React, { useState } from 'react';
import { BlurFade } from '@/components/ui/blur-fade';
import { faqData } from '@/constants';

const PlusIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-transform duration-300">
        <path d="M8 1V15" stroke="#949fa6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M1 8H15" stroke="#949fa6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const MinusIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-transform duration-300">
        <path d="M1 8H15" stroke="#949fa6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const AccordionItem = ({ item }: { item: { q: string; a: string } }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-[#19191a]">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center py-6 text-left"
            >
                <span className="text-lg font-medium text-white">{item.q}</span>
                <span className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                    {isOpen ? <MinusIcon /> : <PlusIcon />}
                </span>
            </button>
            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
            >
                <p className="text-[#949fa6] pb-6 pr-8">{item.a}</p>
            </div>
        </div>
    );
};

export const FAQ = () => {
    return (
        <section id="faq" className="py-12 md:py-16 px-4 sm:px-6 lg:px-8 relative bg-gradient-to-b from-[#0b0b0d] via-[#0e0e10] to-[#0b0b0d]">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl -z-10"></div>

            <div className="max-w-4xl mx-auto">
                <BlurFade delay={0} inView className="text-center mb-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-white font-manrope">Frequently Asked Questions</h2>
                    <p className="mt-4 text-lg text-[#949fa6]">Get quick answers to the most common questions about our platform.</p>
                </BlurFade>

                <BlurFade delay={0.2} inView className="bg-[#0b0b0d]/80 backdrop-blur-lg border border-[#19191a] rounded-2xl px-6 md:px-8">
                    {faqData.map((item, index) => (
                        <AccordionItem key={index} item={item} />
                    ))}
                </BlurFade>
            </div>
        </section>
    );
};

