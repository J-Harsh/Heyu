"use client";

import Link from "next/link";
import { ThemeToggleButton } from "./theme-toggle-button";
import { BsJournalCode } from "react-icons/bs";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { NotificationBell } from "./notifications";
import { useUserRole } from "@/hooks/useUserRole";

function Navbar() {
    const { isCandidate } = useUserRole();

    return (
        <nav className="border-b">
            <div className="flex h-16 items-center px-4 container mx-auto">
                {/* LEFT SIDE -LOGO */}
                <Link
                    href="/dashboard"
                    className="flex items-center gap-2 font-semibold text-2xl mr-6 font-mono hover:opacity-80 transition-opacity"
                >
                    <BsJournalCode className="size-8 text-emerald-500" />
                    <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                        Heyu
                    </span>
                </Link>

                {/* RIGHT SIDE - ACTIONS */}
                <SignedIn>
                    <div className="flex items-center space-x-4 ml-auto">
                        {/* Only show notifications for candidates */}
                        {isCandidate && <NotificationBell />}
                        <ThemeToggleButton start="top-right" />
                        <UserButton />
                    </div>
                </SignedIn>
                <SignedOut>
                    <div className="ml-auto">
                        <ThemeToggleButton start="top-right" />
                    </div>
                </SignedOut>
            </div>
        </nav>
    );
}
export default Navbar;