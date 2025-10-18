import React, { ReactNode } from 'react'
import StreamClientProvider from '@/components/providers/StreamClientProvider'
import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/nextjs";
import Navbar from "@/components/ui/global/navbar";

const Layout = ({ children }: { children: ReactNode }) => {
    return (
        <>
            <SignedIn>
                <StreamClientProvider>
                    <div className="min-h-screen">
                        <Navbar />
                        <main className="px-4 sm:px-6 lg:px-8">{children}</main>
                    </div>
                </StreamClientProvider>
            </SignedIn>

            <SignedOut>
                <RedirectToSignIn />
            </SignedOut>
        </>
    )
}

export default Layout