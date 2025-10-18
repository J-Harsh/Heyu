"use client";

import Link from "next/link";
import { HiSparkles } from "react-icons/hi2";
import { Button } from "@/components/ui/button";
import { useUserRole } from "@/hooks/useUserRole";
import { Skeleton } from "@/components/ui/skeleton";
// import { useUserRole } from "@/hooks/useUserRole";


function DasboardBtn() {
    const { isCandidate, isLoading } = useUserRole();

    if (isCandidate) return null;

    if (isLoading) return <Skeleton className="h-9 w-28 rounded-md" />

    return (
        <Link href={"/dashboard"}>
            <Button className="gap-2 font-medium bg-green-500" size={"sm"}>
                <HiSparkles className="size-4" />
                Dashboard
            </Button>
        </Link>
    );
}
export default DasboardBtn;