"use client";

import { useUserRole } from "@/hooks/useUserRole";
import { useRouter } from "next/navigation";
import CLoader from "@/components/ui/global/cloader";
import { useUser } from "@clerk/nextjs";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { api } from "../../../../convex/_generated/api";
import { toast } from "sonner";
import {
    Dialog,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import UserInfo from "@/components/ui/global/user-info";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { IoClose } from "react-icons/io5";
import MeetingCard from "@/components/ui/global/meeting-card";
import DateTimePicker from "@/components/ui/global/date-time-picker";
import { getMeetingStatus } from "@/lib/utils";

type FilterType = "all" | "scheduled" | "pending_review" | "reviewed";

function SchedulePage() {
    const router = useRouter();
    const { isInterviewer, isLoading } = useUserRole();
    const client = useStreamVideoClient();
    const { user } = useUser();
    const [open, setOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [filter, setFilter] = useState<FilterType>("all");

    const interviews = useQuery(api.interviews.getAllInterviews) ?? [];
    const users = useQuery(api.users.getUsers) ?? [];
    const createInterview = useMutation(api.interviews.createInterview);

    const candidates = users?.filter((u) => u.role === "candidate");
    const interviewers = users?.filter((u) => u.role === "interviewer");

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        date: new Date(),
        time: "09:00",
        candidateId: "",
        interviewerIds: user?.id ? [user.id] : [],
    });

    const scheduleMeeting = async () => {
        if (!client || !user) return;
        if (!formData.candidateId || formData.interviewerIds.length === 0) {
            toast.error("Please select both candidate and at least one interviewer");
            return;
        }

        setIsCreating(true);

        try {
            const { title, description, date, time, candidateId, interviewerIds } = formData;
            const [hours, minutes] = time.split(":");
            const meetingDate = new Date(date);
            meetingDate.setHours(parseInt(hours), parseInt(minutes), 0);

            const id = crypto.randomUUID();
            const call = client.call("default", id);

            await call.getOrCreate({
                data: {
                    starts_at: meetingDate.toISOString(),
                    custom: {
                        description: title,
                        additionalDetails: description,
                    },
                },
            });

            await createInterview({
                title,
                description,
                startTime: meetingDate.getTime(),
                status: "scheduled",
                streamCallId: id,
                candidateId,
                interviewerIds,
            });

            setOpen(false);
            toast.success("Scheduling up your interview...");

            setFormData({
                title: "",
                description: "",
                date: new Date(),
                time: "09:00",
                candidateId: "",
                interviewerIds: user?.id ? [user.id] : [],
            });
        } catch (error) {
            console.error(error);
            toast.error("Failed to schedule meeting. Please try again.");
        } finally {
            setIsCreating(false);
        }
    };

    const addInterviewer = (interviewerId: string) => {
        if (!formData.interviewerIds.includes(interviewerId)) {
            setFormData((prev) => ({
                ...prev,
                interviewerIds: [...prev.interviewerIds, interviewerId],
            }));
        }
    };

    const removeInterviewer = (interviewerId: string) => {
        if (interviewerId === user?.id) return;
        setFormData((prev) => ({
            ...prev,
            interviewerIds: prev.interviewerIds.filter((id) => id !== interviewerId),
        }));
    };

    const selectedInterviewers = interviewers.filter((i) =>
        formData.interviewerIds.includes(i.clerkId)
    );

    const availableInterviewers = interviewers.filter(
        (i) => !formData.interviewerIds.includes(i.clerkId)
    );

    // Filter interviews based on UI status (using getMeetingStatus)
    const filteredInterviews = interviews.filter((interview) => {
        const uiStatus = getMeetingStatus(interview);
        switch (filter) {
            case "scheduled":
                return uiStatus === "scheduled";
            case "pending_review":
                return uiStatus === "pending_review";
            case "reviewed":
                return uiStatus === "reviewed";
            case "all":
            default:
                return true;
        }
    });

    // Count interviews by UI status
    const scheduledCount = interviews.filter((i) => getMeetingStatus(i) === "scheduled").length;
    const pendingReviewCount = interviews.filter((i) => getMeetingStatus(i) === "pending_review").length;
    const reviewedCount = interviews.filter((i) => getMeetingStatus(i) === "reviewed").length;

    if (isLoading) return <CLoader context="schedule" />;
    if (!isInterviewer) {
        router.push("/404");
        return null;
    }

    return (
        <div className="container max-w-7xl mx-auto p-6 space-y-8">
            <div className="flex items-center justify-between">
                {/* HEADER INFO */}
                <div>
                    <h1 className="text-3xl font-bold">Interviews</h1>
                    <p className="text-muted-foreground mt-1">Schedule and manage interviews</p>
                </div>

                {/* DIALOG */}

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button size="lg">Schedule Interview</Button>
                    </DialogTrigger>

                    <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-auto">
                        <DialogHeader>
                            <DialogTitle>Schedule Interview</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-6 py-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-medium">Title</label>
                                        <span className={`text-xs ${formData.title.length > 50 ? 'text-destructive' : 'text-muted-foreground'}`}>
                                            {formData.title.length}/50
                                        </span>
                                    </div>
                                    <Input
                                        placeholder="Interview title"
                                        value={formData.title}
                                        onChange={(e) => {
                                            if (e.target.value.length <= 50) {
                                                setFormData({ ...formData, title: e.target.value });
                                            }
                                        }}
                                        maxLength={50}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Candidate</label>
                                    <Select
                                        value={formData.candidateId}
                                        onValueChange={(candidateId) => setFormData({ ...formData, candidateId })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select candidate" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {candidates.map((candidate) => (
                                                <SelectItem key={candidate.clerkId} value={candidate.clerkId}>
                                                    <UserInfo user={candidate} />
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium">Description</label>
                                    <span className={`text-xs ${formData.description.length > 500 ? 'text-destructive' : 'text-muted-foreground'}`}>
                                        {formData.description.length}/500
                                    </span>
                                </div>
                                <Textarea
                                    placeholder="Interview description"
                                    value={formData.description}
                                    onChange={(e) => {
                                        if (e.target.value.length <= 500) {
                                            setFormData({ ...formData, description: e.target.value });
                                        }
                                    }}
                                    maxLength={500}
                                    rows={3}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Interviewers</label>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {selectedInterviewers.map((interviewer) => (
                                        <div
                                            key={interviewer.clerkId}
                                            className="inline-flex items-center gap-2 bg-secondary px-3 py-1.5 rounded-full text-sm"
                                        >
                                            <UserInfo user={interviewer} />
                                            {interviewer.clerkId !== user?.id && (
                                                <button
                                                    onClick={() => removeInterviewer(interviewer.clerkId)}
                                                    className="hover:text-destructive transition-colors"
                                                >
                                                    <IoClose className="h-4 w-4" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                {availableInterviewers.length > 0 && (
                                    <Select onValueChange={addInterviewer}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Add interviewer" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {availableInterviewers.map((interviewer) => (
                                                <SelectItem key={interviewer.clerkId} value={interviewer.clerkId}>
                                                    <UserInfo user={interviewer} />
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            </div>

                            <div className="pt-4 border-t">
                                <DateTimePicker
                                    date={formData.date}
                                    time={formData.time}
                                    onDateChange={(date) => setFormData({ ...formData, date })}
                                    onTimeChange={(time) => setFormData({ ...formData, time })}
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t">
                                <Button variant="outline" onClick={() => setOpen(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={scheduleMeeting} disabled={isCreating}>
                                    {isCreating ? (
                                        <>
                                            <AiOutlineLoading3Quarters className="mr-2 size-4 animate-spin" />
                                            Scheduling...
                                        </>
                                    ) : (
                                        "Schedule Interview"
                                    )}
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* FILTER TABS */}
            <Tabs value={filter} onValueChange={(value) => setFilter(value as FilterType)}>
                <TabsList>
                    <TabsTrigger value="all">
                        All ({interviews.length})
                    </TabsTrigger>
                    <TabsTrigger value="scheduled">
                        Scheduled ({scheduledCount})
                    </TabsTrigger>
                    <TabsTrigger value="pending_review">
                        Pending Review ({pendingReviewCount})
                    </TabsTrigger>
                    <TabsTrigger value="reviewed">
                        Reviewed ({reviewedCount})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-6">
                    {!interviews ? (
                        <div className="flex justify-center py-12">
                            <AiOutlineLoading3Quarters className="size-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : filteredInterviews.length > 0 ? (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {filteredInterviews.map((interview) => (
                                <MeetingCard key={interview._id} interview={interview} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-muted-foreground">
                            No interviews found
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="scheduled" className="mt-6">
                    {!interviews ? (
                        <div className="flex justify-center py-12">
                            <AiOutlineLoading3Quarters className="size-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : filteredInterviews.length > 0 ? (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {filteredInterviews.map((interview) => (
                                <MeetingCard key={interview._id} interview={interview} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-muted-foreground">
                            No scheduled interviews found
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="pending_review" className="mt-6">
                    {!interviews ? (
                        <div className="flex justify-center py-12">
                            <AiOutlineLoading3Quarters className="size-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : filteredInterviews.length > 0 ? (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {filteredInterviews.map((interview) => (
                                <MeetingCard key={interview._id} interview={interview} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-muted-foreground">
                            No interviews pending review
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="reviewed" className="mt-6">
                    {!interviews ? (
                        <div className="flex justify-center py-12">
                            <AiOutlineLoading3Quarters className="size-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : filteredInterviews.length > 0 ? (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {filteredInterviews.map((interview) => (
                                <MeetingCard key={interview._id} interview={interview} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-muted-foreground">
                            No reviewed interviews found
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
export default SchedulePage;