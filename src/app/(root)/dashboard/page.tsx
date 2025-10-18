"use client";


import { QUICK_ACTIONS, INTERVIEW_CATEGORY } from "@/constants";
import { useUserRole } from "@/hooks/useUserRole";
import { useQuery } from "convex/react";
import { useState, useEffect } from "react";
import { api } from "../../../../convex/_generated/api";
import { useRouter } from "next/navigation";
import CLoader from "@/components/ui/global/cloader";
import ActionCard from "@/components/ui/global/action-card";
import MeetingModal from "@/components/ui/global/meeting-modal";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import MeetingCard from "@/components/ui/global/meeting-card";
import { Badge } from "@/components/ui/badge";
import { groupInterviews } from "@/lib/utils";
import { Doc } from "../../../../convex/_generated/dataModel";
import { useUser } from "@clerk/nextjs";

type Interview = Doc<"interviews">;

export default function Home() {
    const router = useRouter();
    const { user } = useUser();

    const { isInterviewer, isLoading } = useUserRole();
    const interviews = useQuery(api.interviews.getMyInterviews);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState<"start" | "join">();

    // Check if user has a role in the database
    const existingUser = useQuery(
        api.users.getUserByClerkId,
        user?.id ? { clerkId: user.id } : "skip"
    );

    useEffect(() => {
        // If user exists but has no role, redirect to onboarding
        if (existingUser !== undefined && !existingUser) {
            // User not in DB yet, redirect to onboarding
            router.push('/onboarding');
        } else if (existingUser && !existingUser.role) {
            // User exists but has no role, redirect to onboarding
            router.push('/onboarding');
        }
    }, [existingUser, router]);

    const handleQuickAction = (title: string) => {
        switch (title) {
            case "New Call":
                setModalType("start");
                setShowModal(true);
                break;
            case "Join Interview":
                setModalType("join");
                setShowModal(true);
                break;
            default:
                router.push(`/${title.toLowerCase()}`);
        }
    };

    if (isLoading) return <CLoader />;

    return (
        <div className="container max-w-7xl mx-auto p-6">
            {/* WELCOME SECTION */}
            <div className="rounded-lg bg-card p-6 border shadow-sm mb-10">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                    Welcome back!
                </h1>
                <p className="text-muted-foreground mt-2">
                    {isInterviewer
                        ? "Manage your interviews and review candidates effectively"
                        : "Access your upcoming interviews and preparations"}
                </p>
            </div>

            {isInterviewer ? (
                <>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {QUICK_ACTIONS.map((action) => (
                            <ActionCard
                                key={action.title}
                                action={action}
                                onClick={() => handleQuickAction(action.title)}
                            />
                        ))}
                    </div>

                    <MeetingModal
                        isOpen={showModal}
                        onClose={() => setShowModal(false)}
                        title={modalType === "join" ? "Join Meeting" : "Start Meeting"}
                        isJoinMeeting={modalType === "join"}
                    />

                    {/* Dashboard - Categorized Interviews Section for Interviewers */}
                    <div className="mt-10 space-y-8">
                        {interviews === undefined ? (
                            <div className="flex justify-center py-12">
                                <AiOutlineLoading3Quarters className="h-8 w-8 animate-spin text-muted-foreground" />
                            </div>
                        ) : interviews.length > 0 ? (
                            <>
                                {(() => {
                                    const groupedInterviews = groupInterviews(interviews);
                                    return INTERVIEW_CATEGORY.map(
                                        (category) =>
                                            groupedInterviews[category.id]?.length > 0 && (
                                                <section key={category.id}>
                                                    {/* CATEGORY TITLE */}
                                                    <div className="flex items-center gap-2 mb-4">
                                                        <h2 className="text-2xl font-bold">{category.title}</h2>
                                                        <Badge variant={category.variant}>
                                                            {groupedInterviews[category.id].length}
                                                        </Badge>
                                                    </div>

                                                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                                        {groupedInterviews[category.id].map((interview: Interview) => (
                                                            <MeetingCard
                                                                key={interview._id}
                                                                interview={interview}
                                                                showComments={true}
                                                            />
                                                        ))}
                                                    </div>
                                                </section>
                                            )
                                    );
                                })()}
                            </>
                        ) : (
                            <div className="text-center py-12 text-muted-foreground">
                                You have no scheduled interviews at the moment
                            </div>
                        )}
                    </div>
                </>
            ) : (
                <>
                    {/* Quick Actions for Candidates */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                        <ActionCard
                            key="join-interview"
                            action={QUICK_ACTIONS[1]} // Join Interview action
                            onClick={() => handleQuickAction("Join Interview")}
                        />
                        <ActionCard
                            key="recordings"
                            action={QUICK_ACTIONS[3]} // Recordings action
                            onClick={() => handleQuickAction("Recordings")}
                        />
                    </div>

                    <MeetingModal
                        isOpen={showModal}
                        onClose={() => setShowModal(false)}
                        title="Join Meeting"
                        isJoinMeeting={true}
                    />

                    <div>
                        <h1 className="text-3xl font-bold">Your Interviews</h1>
                        <p className="text-muted-foreground mt-1">View and join your scheduled interviews</p>
                    </div>

                    <div className="mt-8">
                        {interviews === undefined ? (
                            <div className="flex justify-center py-12">
                                <AiOutlineLoading3Quarters className="h-8 w-8 animate-spin text-muted-foreground" />
                            </div>
                        ) : interviews.length > 0 ? (
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {interviews.map((interview) => (
                                    <MeetingCard
                                        key={interview._id}
                                        interview={interview}
                                        showComments={true}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 text-muted-foreground">
                                You have no scheduled interviews at the moment
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

