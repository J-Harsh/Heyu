"use client";

import React from 'react';
import ScrollStack from '@/components/ui/scroll-stack';
import { Badge } from '@/components/ui/badge';
import { productTabs } from '@/constants';

export const Product = () => {
    // Transform productTabs data to match ScrollStack API
    const cards = productTabs.map((tab) => ({
        title: tab.title,
        content: (
            <div className="flex flex-col h-full justify-center max-w-3xl">
                {/* Green accent line */}
                <div className="w-16 h-1 bg-gradient-to-r from-primary to-primary/50 rounded-full mb-6" />

                <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-card-foreground leading-tight mb-5 tracking-tight">
                    {tab.title}
                </h3>
                <p className="text-base sm:text-lg text-muted-foreground mb-7 leading-relaxed">
                    {tab.description}
                </p>
                <div className="flex flex-wrap gap-2.5">
                    {tab.tags.map((tag, tagIndex) => (
                        <Badge
                            key={tagIndex}
                            variant="outline"
                            className="text-sm font-medium px-3 py-1.5 hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all duration-300"
                        >
                            {tag}
                        </Badge>
                    ))}
                </div>
            </div>
        )
    }));

    return (
        <section id="product" className="relative w-full bg-gradient-to-b from-[#0b0b0d] via-[#0e0e10] to-[#0b0b0d]">
            <ScrollStack
                cards={cards}
                backgroundColor="bg-transparent"
                cardHeight="65vh"
                animationDuration="0.5s"
                sectionHeightMultiplier={2.2}
                intersectionThreshold={0.3}
            />
        </section>
    );
};


