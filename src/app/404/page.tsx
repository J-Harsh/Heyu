"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HiOutlineHome } from "react-icons/hi";

export default function Custom404() {

    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4">
            <div className="text-center space-y-6 max-w-md">
                {/* 404 Text */}
                <h1 className="text-6xl font-bold text-foreground">
                    404
                </h1>

                {/* Title */}
                <h2 className="text-xl font-medium text-foreground">
                    Page Not Found
                </h2>

                {/* Description */}
                <p className="text-muted-foreground">
                    The page you&apos;re looking for doesn&apos;t exist or you don&apos;t have permission to access it.
                </p>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                    <Link href="/">
                        <Button className="gap-2">
                            <HiOutlineHome className="h-4 w-4" />
                            Home
                        </Button>
                    </Link>

                </div>
            </div>
        </div>
    );
}

