import useMeetingActions from "@/hooks/useMeetingActions";
import { Doc } from "../../../../../convex/_generated/dataModel";
import { getMeetingStatus, getCandidateInfo, getInterviewerInfo } from "@/lib/utils";
import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FaClock, FaCalendar } from "react-icons/fa";
import { cn } from "@/lib/utils";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { useState } from "react";
import { toast } from "sonner";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useUser } from "@clerk/nextjs";
import { useUserRole } from "@/hooks/useUserRole";
import MoreInfo from "./more-info";
import Reschedule from "./reschedule";
import Review from "./review";
import Comments from "./comments";

type Interview = Doc<"interviews">;

interface MeetingCardProps {
    interview: Interview;
    showComments?: boolean;
}

function MeetingCard({ interview, showComments = false }: MeetingCardProps) {
    const { joinMeeting } = useMeetingActions();
    const client = useStreamVideoClient();
    const { user } = useUser();
    const { isInterviewer } = useUserRole();
    const users = useQuery(api.users.getUsers) ?? [];
    const comments = useQuery(api.comments.getCommentsByInterview, { interviewId: interview._id }) ?? [];
    const reschedule = useMutation(api.interviews.rescheduleInterview);
    const updateResult = useMutation(api.interviews.updateInterviewResult);

    const [infoDialogOpen, setInfoDialogOpen] = useState(false);
    const [rescheduleDialogOpen, setRescheduleDialogOpen] = useState(false);
    const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
    const [isRescheduling, setIsRescheduling] = useState(false);
    const [isUpdatingResult, setIsUpdatingResult] = useState(false);
    const [newDate, setNewDate] = useState<Date>(new Date(interview.startTime));
    const [newTime, setNewTime] = useState<string>(format(new Date(interview.startTime), "HH:mm"));

    const status = getMeetingStatus(interview);
    const startTime = new Date(interview.startTime);
    const formattedDate = format(startTime, "EEEE, MMMM d");
    const formattedTime = format(startTime, "h:mm a");

    // Check if current user is an interviewer for this meeting
    const isInterviewerForThisMeeting = user?.id && interview.interviewerIds.includes(user.id);

    const statusConfig: Record<string, {
        variant: "default" | "secondary" | "outline" | "destructive";
        label: string;
        badgeClass: string;
    }> = {
        scheduled: {
            variant: "secondary" as const,
            label: "Scheduled",
            badgeClass: "bg-blue-500 font-thin active:bg-blue-500 hover:bg-blue-500 text-white",
        },
        ongoing: {
            variant: "default" as const,
            label: "Ongoing",
            badgeClass: "bg-primary font-thin active:bg-primary hover:bg-primary text-primary-foreground",
        },
        pending_review: {
            variant: "destructive" as const,
            label: "Pending Review",
            badgeClass: "bg-orange-500 font-thin active:bg-orange-500 hover:bg-orange-500 text-white",
        },
        reviewed: {
            variant: "default" as const,
            label: "Reviewed",
            badgeClass: "bg-green-500 font-thin active:bg-green-500 hover:bg-green-500 text-white",
        },
    };

    // Get the appropriate status configuration based on result for reviewed interviews
    let currentStatus;
    if (status === "reviewed") {
        if (interview.result === "pass") {
            currentStatus = {
                ...statusConfig.reviewed,
                label: "Passed",
            };
        } else if (interview.result === "fail") {
            currentStatus = {
                ...statusConfig.reviewed,
                label: "Failed",
                badgeClass: "bg-red-500 font-thin active:bg-red-500 hover:bg-red-500 text-white",
            };
        } else {
            currentStatus = statusConfig.reviewed;
        }
    } else {
        currentStatus = statusConfig[status];
    }

    const candidateInfo = getCandidateInfo(users, interview.candidateId);
    const interviewers = interview.interviewerIds.map(id => getInterviewerInfo(users, id));

    const handleReschedule = async () => {
        if (!client) return;

        setIsRescheduling(true);
        try {
            const [hours, minutes] = newTime.split(":");
            const meetingDate = new Date(newDate);
            meetingDate.setHours(parseInt(hours), parseInt(minutes), 0);

            // Update the Stream call
            const call = client.call("default", interview.streamCallId);
            await call.update({
                starts_at: meetingDate.toISOString(),
            });

            // Update the database
            await reschedule({
                id: interview._id,
                startTime: meetingDate.getTime(),
            });

            toast.success("Interview rescheduled successfully!");
            setRescheduleDialogOpen(false);
        } catch (error) {
            console.error(error);
            toast.error("Failed to reschedule interview. Please try again.");
        } finally {
            setIsRescheduling(false);
        }
    };

    const handleResult = async (result: "pass" | "fail") => {
        setIsUpdatingResult(true);
        try {
            await updateResult({
                id: interview._id,
                result: result,
            });
            const resultMessages = {
                pass: "Interview marked as Pass!",
                fail: "Interview marked as Fail!",
            };
            toast.success(resultMessages[result]);
            setReviewDialogOpen(false);
        } catch (error) {
            console.error(error);
            toast.error("Failed to update result. Please try again.");
        } finally {
            setIsUpdatingResult(false);
        }
    };

    return (
        <Card className="group relative transition-all duration-200 hover:shadow-sm">
            <CardHeader className="space-y-4">
                {/* Title and Status Badge */}
                <div className="flex items-start justify-between gap-3">
                    <CardTitle className="text-lg font-semibold leading-tight truncate">
                        {interview.title}
                    </CardTitle>
                    <div className="flex flex-col gap-2 items-end">
                        <Badge className={cn("shrink-0", currentStatus.badgeClass)}>
                            {currentStatus.label}
                        </Badge>
                    </div>
                </div>

                {/* Date and Time with labels */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-sm">
                        <FaCalendar className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="font-medium">{formattedDate}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <FaClock className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="font-medium">{formattedTime}</span>
                    </div>
                </div>

                {/* Description */}
                {interview.description && (
                    <CardDescription className="line-clamp-2 text-sm leading-relaxed">
                        {interview.description}
                    </CardDescription>
                )}
            </CardHeader>

            {/* Action buttons */}
            <CardContent className="pt-0 space-y-2">
                {/* Join Meeting button for ongoing interviews */}
                {status === "ongoing" && (
                    <Button
                        className="w-full"
                        onClick={() => joinMeeting(interview.streamCallId)}
                    >
                        Join Meeting
                    </Button>
                )}

                <div className="flex gap-2">
                    {/* View More Info Dialog - Available for all users */}
                    <MoreInfo
                        interview={interview}
                        open={infoDialogOpen}
                        onOpenChange={setInfoDialogOpen}
                        formattedDate={formattedDate}
                        formattedTime={formattedTime}
                        currentStatus={currentStatus}
                        candidateInfo={candidateInfo}
                        interviewers={interviewers}
                        comments={comments}
                        users={users}
                    />

                    {/* Show different actions based on user role */}
                    {isInterviewer && isInterviewerForThisMeeting && (
                        <>
                            {status === "ongoing" && (
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => joinMeeting(interview.streamCallId)}
                                >
                                    Join
                                </Button>
                            )}

                            {status === "scheduled" && (
                                <Reschedule
                                    open={rescheduleDialogOpen}
                                    onOpenChange={setRescheduleDialogOpen}
                                    newDate={newDate}
                                    setNewDate={setNewDate}
                                    newTime={newTime}
                                    setNewTime={setNewTime}
                                    isRescheduling={isRescheduling}
                                    onReschedule={handleReschedule}
                                />
                            )}

                            {status === "pending_review" && (
                                <Review
                                    open={reviewDialogOpen}
                                    onOpenChange={setReviewDialogOpen}
                                    isUpdating={isUpdatingResult}
                                    onResult={handleResult}
                                />
                            )}
                        </>
                    )}
                </div>

                {/* Comments Section - Only for interviewers */}
                {showComments && isInterviewer && (
                    <Comments interviewId={interview._id} variant="button" />
                )}
            </CardContent>

        </Card>
    );
}

export default MeetingCard;
