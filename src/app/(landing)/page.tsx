"use client";

import React from 'react';
import {
    Header,
    Hero,
    Features,
    Product,
    Testimonials,
    ComingSoonSection,
    ActionSection,
    FAQ,
    CTA,
    Footer
} from '@/components/ui/global/landing';

// Main Page Component
export default function LandingPage() {
    return (
        <div className="bg-[#0b0b0d] text-white min-h-screen font-manrope overflow-x-hidden">
            <Header />
            <main className="relative">
                <Hero />
                <Features />
                <Product />
                <Testimonials />
                <ComingSoonSection />
                <ActionSection />
                <FAQ />
                <CTA />
            </main>
            <Footer />
        </div>
    );
}
