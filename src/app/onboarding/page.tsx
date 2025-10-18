"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { BlurFade } from '@/components/ui/blur-fade';
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient';
import { BorderBeam } from '@/components/ui/border-beam';
import { DotPattern } from '@/components/ui/dot-pattern';
import { MdPerson, MdWork } from 'react-icons/md';
import { cn } from '@/lib/utils';
import { updateUserRoleInClerk } from '@/actions/stream.actions';
import { useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';

const OnboardingPage = () => {
    const [selectedRole, setSelectedRole] = useState<'interviewer' | 'candidate' | null>(null);
    const router = useRouter();
    const { isSignedIn, isLoaded } = useAuth();
    const { user } = useUser();
    const [isProcessingRole, setIsProcessingRole] = useState(false);

    // Check if user already has a role
    const existingUser = useQuery(
        api.users.getUserByClerkId,
        user?.id ? { clerkId: user.id } : "skip"
    );

    useEffect(() => {
        // If not signed in, redirect to sign-in
        if (isLoaded && !isSignedIn) {
            router.push('/sign-in');
            return;
        }

        // If user already has a role, redirect to dashboard
        if (existingUser && existingUser.role) {
            router.push('/dashboard');
        }
    }, [isLoaded, isSignedIn, existingUser, router]);

    const handleRoleSelection = (role: 'interviewer' | 'candidate') => {
        setSelectedRole(role);
    };

    const handleContinue = async () => {
        if (!selectedRole || !user) return;

        setIsProcessingRole(true);
        try {
            // Update Clerk metadata - webhook will automatically sync to database
            await updateUserRoleInClerk(selectedRole);

            // Wait a bit for webhook to process
            await new Promise(resolve => setTimeout(resolve, 1500));

            router.push('/dashboard');
        } catch (err) {
            console.error('Error updating user role:', err);
            setIsProcessingRole(false);
        }
    };

    if (!isLoaded || existingUser === undefined) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-[#0b0b0d] via-[#0d1410] to-[#0b0b0d] flex items-center justify-center px-4">
                <DotPattern
                    className="absolute inset-0 text-[#10b981]/20 [mask-image:radial-gradient(800px_circle_at_center,white,transparent)]"
                />
                <div className="relative z-10 max-w-md w-full">
                    <div className="bg-[#0e0e10] border border-[#19191a] rounded-3xl p-12 relative overflow-hidden">
                        <BorderBeam
                            size={200}
                            duration={12}
                            delay={0}
                            colorFrom="#10b981"
                            colorTo="#14b8a6"
                            borderWidth={2}
                        />
                        <div className="text-center">
                            <div className="mb-6">
                                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">
                                Loading...
                            </h2>
                            <p className="text-[#949fa6]">
                                Please wait
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (isProcessingRole) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-[#0b0b0d] via-[#0d1410] to-[#0b0b0d] flex items-center justify-center px-4">
                <DotPattern
                    className="absolute inset-0 text-[#10b981]/20 [mask-image:radial-gradient(800px_circle_at_center,white,transparent)]"
                />

                <div className="relative z-10 max-w-md w-full">
                    <div className="bg-[#0e0e10] border border-[#19191a] rounded-3xl p-12 relative overflow-hidden">
                        <BorderBeam
                            size={200}
                            duration={12}
                            delay={0}
                            colorFrom="#10b981"
                            colorTo="#14b8a6"
                            borderWidth={2}
                        />

                        <div className="text-center">
                            <div className="mb-6">
                                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">
                                Setting up your account
                            </h2>
                            <p className="text-[#949fa6]">
                                Please wait while we prepare your workspace...
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0b0b0d] via-[#0d1410] to-[#0b0b0d] flex items-center justify-center px-4 py-12">
            <DotPattern
                className="absolute inset-0 text-[#10b981]/20 [mask-image:radial-gradient(800px_circle_at_center,white,transparent)]"
            />

            <BlurFade delay={0} inView>
                <div className="relative max-w-4xl w-full">
                    <BorderBeam
                        size={200}
                        duration={12}
                        delay={0}
                        colorFrom="#10b981"
                        colorTo="#14b8a6"
                        borderWidth={2}
                    />

                    <div className="bg-[#0e0e10] border border-[#19191a] rounded-3xl p-8 md:p-12 relative overflow-hidden">
                        <div className="relative z-10">
                            {/* Header */}
                            <div className="text-center mb-12">
                                <h1 className="text-3xl md:text-5xl font-bold text-white font-manrope mb-4">
                                    <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-br from-white via-emerald-200 to-emerald-500">
                                        Welcome to HeyU
                                    </span>
                                </h1>
                                <p className="text-lg md:text-xl text-[#949fa6]">
                                    Choose your role to get started
                                </p>
                            </div>

                            {/* Role Selection Cards */}
                            <div className="grid md:grid-cols-2 gap-6 mb-8">
                                {/* Interviewer Card */}
                                <button
                                    onClick={() => handleRoleSelection('interviewer')}
                                    className={cn(
                                        "relative group p-8 rounded-2xl border-2 transition-all duration-300 text-left",
                                        selectedRole === 'interviewer'
                                            ? "border-emerald-500 bg-emerald-500/10"
                                            : "border-[#19191a] bg-[#0b0b0d] hover:border-emerald-500/50"
                                    )}
                                >
                                    <div className="flex flex-col items-center text-center gap-4">
                                        <div className={cn(
                                            "w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300",
                                            selectedRole === 'interviewer'
                                                ? "bg-emerald-500/20"
                                                : "bg-[#19191a] group-hover:bg-emerald-500/10"
                                        )}>
                                            <MdWork className={cn(
                                                "text-4xl transition-all duration-300",
                                                selectedRole === 'interviewer'
                                                    ? "text-emerald-400"
                                                    : "text-[#949fa6] group-hover:text-emerald-400"
                                            )} />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-white mb-2">
                                                Interviewer
                                            </h3>
                                            <p className="text-[#949fa6]">
                                                Conduct technical interviews, evaluate candidates, and collaborate with your team
                                            </p>
                                        </div>
                                        {selectedRole === 'interviewer' && (
                                            <div className="absolute top-4 right-4 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                                                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                </button>

                                {/* Candidate Card */}
                                <button
                                    onClick={() => handleRoleSelection('candidate')}
                                    className={cn(
                                        "relative group p-8 rounded-2xl border-2 transition-all duration-300 text-left",
                                        selectedRole === 'candidate'
                                            ? "border-emerald-500 bg-emerald-500/10"
                                            : "border-[#19191a] bg-[#0b0b0d] hover:border-emerald-500/50"
                                    )}
                                >
                                    <div className="flex flex-col items-center text-center gap-4">
                                        <div className={cn(
                                            "w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300",
                                            selectedRole === 'candidate'
                                                ? "bg-emerald-500/20"
                                                : "bg-[#19191a] group-hover:bg-emerald-500/10"
                                        )}>
                                            <MdPerson className={cn(
                                                "text-4xl transition-all duration-300",
                                                selectedRole === 'candidate'
                                                    ? "text-emerald-400"
                                                    : "text-[#949fa6] group-hover:text-emerald-400"
                                            )} />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-white mb-2">
                                                Candidate
                                            </h3>
                                            <p className="text-[#949fa6]">
                                                Showcase your skills in technical interviews with live coding and video calls
                                            </p>
                                        </div>
                                        {selectedRole === 'candidate' && (
                                            <div className="absolute top-4 right-4 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                                                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                </button>
                            </div>

                            {/* Continue Button */}
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-full md:w-auto">
                                    <HoverBorderGradient
                                        containerClassName="rounded-full w-full"
                                        as="button"
                                        onClick={handleContinue}
                                        className={cn(
                                            "dark:bg-black bg-white text-black dark:text-white px-16 py-4 text-lg font-bold w-full",
                                            !selectedRole && "opacity-50 cursor-not-allowed"
                                        )}
                                        gradientColor="#10b981"
                                    >
                                        <span>Continue →</span>
                                    </HoverBorderGradient>
                                </div>

                                <p className="text-[#949fa6] text-sm">
                                    Please select a role to continue
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </BlurFade>
        </div>
    );
};

export default OnboardingPage;

