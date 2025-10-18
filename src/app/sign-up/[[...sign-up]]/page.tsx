"use client";

import React from 'react';
import { SignUp } from '@clerk/nextjs';
import { DotPattern } from '@/components/ui/dot-pattern';
import { BlurFade } from '@/components/ui/blur-fade';
import Link from 'next/link';
import { useTheme } from 'next-themes';

const SignUpPage = () => {
    const { theme, systemTheme } = useTheme();

    // Get the actual current theme (considering system theme)
    const currentTheme = theme === 'system' ? systemTheme : theme;
    // Invert the theme for Clerk - if site is dark, Clerk should be light and vice versa
    const clerkTheme = currentTheme === 'dark' ? 'light' : 'dark';

    // Clerk appearance for light theme (when site is dark)
    const lightAppearance = {
        elements: {
            formButtonPrimary:
                'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white',
            card: 'bg-white border border-gray-200 shadow-xl',
            headerTitle: 'text-gray-900',
            headerSubtitle: 'text-gray-600',
            socialButtonsBlockButton: 'border-gray-300 text-gray-900 hover:bg-gray-50',
            formFieldLabel: 'text-gray-900',
            formFieldInput: 'bg-white border-gray-300 text-gray-900 focus:border-emerald-500',
            footerActionLink: 'text-emerald-600 hover:text-emerald-700',
            identityPreviewText: 'text-gray-900',
            identityPreviewEditButton: 'text-emerald-600 hover:text-emerald-700',
            formFieldInputShowPasswordButton: 'text-gray-600 hover:text-gray-900',
            dividerLine: 'bg-gray-300',
            dividerText: 'text-gray-600',
            formResendCodeLink: 'text-emerald-600 hover:text-emerald-700',
            otpCodeFieldInput: 'border-gray-300 text-gray-900',
        },
    };

    // Clerk appearance for dark theme (when site is light)
    const darkAppearance = {
        elements: {
            formButtonPrimary:
                'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white',
            card: 'bg-[#0e0e10] border border-[#19191a] shadow-xl',
            headerTitle: 'text-white',
            headerSubtitle: 'text-[#949fa6]',
            socialButtonsBlockButton: 'border-[#19191a] text-white hover:bg-[#19191a]',
            formFieldLabel: 'text-white',
            formFieldInput: 'bg-[#0b0b0d] border-[#19191a] text-white focus:border-emerald-500',
            footerActionLink: 'text-emerald-500 hover:text-emerald-400',
            identityPreviewText: 'text-white',
            identityPreviewEditButton: 'text-emerald-500 hover:text-emerald-400',
            formFieldInputShowPasswordButton: 'text-[#949fa6] hover:text-white',
            dividerLine: 'bg-[#19191a]',
            dividerText: 'text-[#949fa6]',
            formResendCodeLink: 'text-emerald-500 hover:text-emerald-400',
            otpCodeFieldInput: 'border-[#19191a] text-white bg-[#0b0b0d]',
        },
    };

    const clerkAppearance = clerkTheme === 'light' ? lightAppearance : darkAppearance;

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0b0b0d] via-[#0d1410] to-[#0b0b0d] flex items-center justify-center px-4 py-12">
            <DotPattern
                className="absolute inset-0 text-[#10b981]/20 [mask-image:radial-gradient(800px_circle_at_center,white,transparent)]"
            />

            <BlurFade delay={0} inView>
                <div className="relative max-w-md w-full">
                    <div className="mb-6 text-center">
                        <Link
                            href="/"
                            className="text-[#949fa6] hover:text-emerald-400 transition-colors inline-flex items-center gap-2"
                        >
                            ← Back to Home
                        </Link>
                    </div>

                    <div className="relative">
                        <SignUp
                            appearance={clerkAppearance}
                            routing='hash'
                        />
                    </div>
                </div>
            </BlurFade>
        </div>
    );
};

export default SignUpPage;

