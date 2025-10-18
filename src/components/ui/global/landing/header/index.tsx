"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BsJournalCode } from 'react-icons/bs';
import { navLinks } from '@/constants';
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient';
import { BorderBeam } from '@/components/ui/border-beam';
import { useUser } from '@clerk/nextjs';

// SVG Icons
const MenuIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 12H21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3 6H21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3 18H21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const CloseIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 6L6 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6 6L18 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const { isSignedIn, user } = useUser();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header
            className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out"
            style={{
                padding: isScrolled ? '0.75rem 1rem 0' : '0',
            }}
        >
            <div
                className="relative mx-auto transition-all duration-1000 ease-in-out"
                style={{
                    maxWidth: isScrolled ? '56rem' : '100%',
                    borderRadius: isScrolled ? '1rem' : '0',
                    backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.02)' : 'transparent',
                    backdropFilter: isScrolled ? 'blur(24px)' : 'none',
                    boxShadow: isScrolled ? '0 8px 32px 0 rgba(0, 0, 0, 0.37)' : 'none',
                }}
            >
                {/* Gradient overlay - only when scrolled */}
                <div
                    className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent pointer-events-none transition-opacity duration-500"
                    style={{ opacity: isScrolled ? 1 : 0 }}
                />

                {/* Border Beam Shimmer Effect - Always present, just animated */}
                <div
                    className="transition-opacity duration-500"
                    style={{ opacity: isScrolled ? 1 : 0, pointerEvents: 'none' }}
                >
                    <BorderBeam
                        size={150}
                        duration={12}
                        delay={0}
                        colorFrom="#10b981"
                        colorTo="#14b8a6"
                        borderWidth={2}
                    />
                </div>

                <nav
                    className="relative z-10 transition-all duration-500 ease-in-out mx-auto px-4 sm:px-6 lg:px-8"
                >
                    <div
                        className="flex items-center justify-between transition-all duration-500 ease-in-out"
                        style={{ height: isScrolled ? '3.5rem' : '5rem' }}
                    >
                        <Link
                            href="/"
                            className="flex items-center gap-2 font-semibold text-2xl relative z-10 transition-transform duration-500 ease-in-out"
                            style={{ transform: isScrolled ? 'scale(0.9)' : 'scale(1)' }}
                        >
                            <BsJournalCode className="size-8 text-[#10b981]" />
                            <span className="text-white font-manrope">HeyU</span>
                        </Link>

                        <div
                            className="hidden lg:flex items-center space-x-10 relative z-10 transition-transform duration-500 ease-in-out"
                            style={{ transform: isScrolled ? 'scale(0.9)' : 'scale(1)' }}
                        >
                            {navLinks.map((link) => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    className="text-[#d1d5d9] hover:text-white transition-colors text-base font-medium"
                                >
                                    {link.label}
                                </a>
                            ))}
                        </div>

                        <div
                            className="hidden lg:block relative z-10 transition-transform duration-500 ease-in-out"
                            style={{ transform: isScrolled ? 'scale(0.85)' : 'scale(1)' }}
                        >
                            {isSignedIn ? (
                                <Link href="/dashboard">
                                    <HoverBorderGradient
                                        containerClassName="rounded-full"
                                        as="button"
                                        className="dark:bg-black bg-white text-black dark:text-white px-8 py-3 font-semibold"
                                        gradientColor="#10b981"
                                    >
                                        <span>Welcome, {user?.firstName || 'User'}</span>
                                    </HoverBorderGradient>
                                </Link>
                            ) : (
                                <Link href="/sign-in">
                                    <HoverBorderGradient
                                        containerClassName="rounded-full"
                                        as="button"
                                        className="dark:bg-black bg-white text-black dark:text-white px-8 py-3 font-semibold"
                                        gradientColor="#10b981"
                                    >
                                        <span>Get Started</span>
                                    </HoverBorderGradient>
                                </Link>
                            )}
                        </div>

                        <div
                            className="lg:hidden flex items-center relative z-10 transition-transform duration-500 ease-in-out"
                            style={{ transform: isScrolled ? 'scale(0.85)' : 'scale(1)' }}
                        >
                            <button onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
                                {isOpen ? <CloseIcon /> : <MenuIcon />}
                            </button>
                        </div>
                    </div>
                </nav>

                {/* Mobile menu - smoothly expands/contracts */}
                <div
                    className="lg:hidden overflow-hidden transition-all duration-300 ease-in-out"
                    style={{
                        maxHeight: isOpen ? '24rem' : '0',
                        opacity: isOpen ? 1 : 0,
                        borderTop: isOpen ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid transparent',
                    }}
                >
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 text-center bg-white/[0.02] backdrop-blur-xl">
                        {navLinks.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsOpen(false)}
                                className="text-[#d1d5d9] hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                            >
                                {link.label}
                            </a>
                        ))}
                        <div
                            className="pt-2 transition-transform duration-500 ease-in-out"
                            style={{ transform: isScrolled ? 'scale(0.85)' : 'scale(1)' }}
                        >
                            {isSignedIn ? (
                                <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                                    <HoverBorderGradient
                                        containerClassName="rounded-full"
                                        as="button"
                                        className="dark:bg-black bg-white text-black dark:text-white px-8 py-3 font-semibold"
                                        gradientColor="#10b981"
                                    >
                                        <span>Welcome, {user?.firstName || 'User'}</span>
                                    </HoverBorderGradient>
                                </Link>
                            ) : (
                                <Link href="/sign-in" onClick={() => setIsOpen(false)}>
                                    <HoverBorderGradient
                                        containerClassName="rounded-full"
                                        as="button"
                                        className="dark:bg-black bg-white text-black dark:text-white px-8 py-3 font-semibold"
                                        gradientColor="#10b981"
                                    >
                                        <span>Get Started</span>
                                    </HoverBorderGradient>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};