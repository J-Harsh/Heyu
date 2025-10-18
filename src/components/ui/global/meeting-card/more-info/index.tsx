import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FaInfoCircle, FaCalendarAlt, FaClock, FaUser, FaUsers, FaStar, FaCommentDots, FaCheckCircle, FaTimesCircle, FaClipboardCheck, FaChevronDown, FaChevronRight } from "react-icons/fa";
import { HiCodeBracket } from "react-icons/hi2";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Doc } from "../../../../../../convex/_generated/dataModel";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getInterviewerInfo } from "@/lib/utils";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useState } from "react";
import CodeSubmissions from "../../code-submissions";

type Interview = Doc<"interviews">;
type Comment = Doc<"comments">;
type User = Doc<"users">;

interface MoreInfoProps {
    interview: Interview;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    formattedDate: string;
    formattedTime: string;
    currentStatus: {
        variant: "default" | "secondary" | "outline" | "destructive";
        label: string;
        badgeClass: string;
    };
    candidateInfo: {
        name: string;
        image: string;
        initials: string;
    };
    interviewers: Array<{
        name: string;
        image: string | undefined;
        initials: string;
    }>;
    comments: Comment[];
    users: User[];
}

function MoreInfo({
    interview,
    open,
    onOpenChange,
    formattedDate,
    formattedTime,
    candidateInfo,
    interviewers,
    comments,
    users,
}: MoreInfoProps) {
    const [isCodeSubmissionsExpanded, setIsCodeSubmissionsExpanded] = useState(false);
    const renderStars = (rating: number) => (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((starValue) => (
                <FaStar
                    key={starValue}
                    className={`h-4 w-4 ${starValue <= rating ? "fill-primary text-primary" : "text-muted-foreground"}`}
                />
            ))}
        </div>
    );

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button variant="outline" className="flex-1">
                    <FaInfoCircle className="mr-2 h-4 w-4" />
                    More Info
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto overflow-x-hidden">
                <DialogHeader className="space-y-1">
                    <div className="flex items-start justify-between gap-1">
                        <DialogTitle className="text-2xl font-bold leading-tight break-words">
                            {interview.title}
                        </DialogTitle>

                    </div>
                </DialogHeader>

                <Separator className="" />

                <div className="space-y-5 py-1">
                    {/* Result Section - Always show since result is always present */}
                    <div className={cn(
                        "rounded-lg border-2 p-4 flex items-center gap-3",
                        {
                            "bg-green-50 dark:bg-green-950/20 border-green-500": interview.result === "pass",
                            "bg-red-50 dark:bg-red-950/20 border-red-500": interview.result === "fail",
                            "bg-orange-50 dark:bg-orange-950/20 border-orange-500": interview.result === "pending" || !interview.result
                        }
                    )}>
                        <div className={cn(
                            "flex h-10 w-10 items-center justify-center rounded-full",
                            {
                                "bg-green-500": interview.result === "pass",
                                "bg-red-500": interview.result === "fail",
                                "bg-orange-500": interview.result === "pending" || !interview.result
                            }
                        )}>
                            {interview.result === "pass" ? (
                                <FaCheckCircle className="h-6 w-6 text-white" />
                            ) : interview.result === "fail" ? (
                                <FaTimesCircle className="h-6 w-6 text-white" />
                            ) : (
                                <FaClipboardCheck className="h-6 w-6 text-white" />
                            )}
                        </div>
                        <div className="flex-1">
                            <h4 className="text-base font-semibold">
                                Interview Result: {(interview.result || "pending").toUpperCase()}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                                {interview.result === "pass"
                                    ? "The candidate has successfully passed this interview."
                                    : interview.result === "fail"
                                        ? "The candidate did not meet the required standards for this interview."
                                        : "This interview is awaiting review by the interviewer."}
                            </p>
                        </div>
                    </div>
                    <Separator />

                    {/* Description Section */}
                    <div>
                        <h4 className="text-sm font-semibold text-foreground/90 mb-2">Description</h4>
                        <div className="max-h-32 overflow-y-auto overflow-x-hidden">
                            <p className="text-sm text-foreground/80 leading-relaxed break-words whitespace-pre-wrap overflow-wrap-anywhere">
                                {interview.description || "No description provided for this interview."}
                            </p>
                        </div>
                    </div>

                    {/* Date & Time Section */}
                    <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                            <FaCalendarAlt className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            <span className="font-medium">{formattedDate}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <FaClock className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                            <span className="font-medium">{formattedTime}</span>
                        </div>
                    </div>


                    {/* Participants Section */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Candidate */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-1.5">
                                <div className="flex h-5 w-5 items-center justify-center rounded-md bg-green-500/10">
                                    <FaUser className="h-3 w-3 text-green-600 dark:text-green-400" />
                                </div>
                                <h4 className="text-xs font-semibold text-muted-foreground">Candidate</h4>
                            </div>
                            <div className="flex items-center gap-2 rounded-lg border bg-muted/30 p-2 transition-colors hover:bg-muted/50">
                                <Avatar className="h-8 w-8 ring-2 ring-background">
                                    <AvatarImage src={candidateInfo.image} alt={candidateInfo.name} />
                                    <AvatarFallback className="text-xs font-semibold bg-gradient-to-br from-green-400 to-green-600 text-white">
                                        {candidateInfo.initials}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="min-w-0 flex-1">
                                    <div className="text-sm font-medium truncate">{candidateInfo.name}</div>
                                </div>
                            </div>
                        </div>

                        {/* Interviewers */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-1.5">
                                <div className="flex h-5 w-5 items-center justify-center rounded-md bg-orange-500/10">
                                    <FaUsers className="h-3 w-3 text-orange-600 dark:text-orange-400" />
                                </div>
                                <h4 className="text-xs font-semibold text-muted-foreground">
                                    Interviewers
                                    <span className="ml-1 text-[10px] font-normal">
                                        ({interviewers.length})
                                    </span>
                                </h4>
                            </div>
                            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                                {interviewers.map((interviewer, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center gap-2 rounded-lg border bg-muted/30 p-2 transition-colors hover:bg-muted/50"
                                    >
                                        <Avatar className="h-8 w-8 ring-2 ring-background">
                                            <AvatarImage src={interviewer.image} alt={interviewer.name} />
                                            <AvatarFallback className="text-xs font-semibold bg-gradient-to-br from-orange-400 to-orange-600 text-white">
                                                {interviewer.initials}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="min-w-0 flex-1">
                                            <div className="text-sm font-medium truncate">{interviewer.name}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Comments Section */}
                    <>
                        <Separator className="my-4" />
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-5 w-5 items-center justify-center rounded-md bg-purple-500/10">
                                        <FaCommentDots className="h-3 w-3 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <h4 className="text-sm font-semibold text-foreground/90">Comments</h4>
                                </div>
                                <Badge variant="outline">
                                    {comments.length} Comment{comments.length !== 1 ? "s" : ""}
                                </Badge>
                            </div>

                            {comments.length > 0 ? (
                                <ScrollArea className="max-h-[280px]">
                                    <div className="space-y-3 pr-4">
                                        {comments.map((comment, index) => {
                                            const interviewer = getInterviewerInfo(users, comment.commenterId);
                                            return (
                                                <div key={index} className="rounded-lg border bg-muted/30 p-3 space-y-2.5">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <Avatar className="h-7 w-7 ring-2 ring-background">
                                                                <AvatarImage src={interviewer.image} alt={interviewer.name} />
                                                                <AvatarFallback className="text-xs font-semibold">
                                                                    {interviewer.initials}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div>
                                                                <p className="text-xs font-medium">{interviewer.name}</p>
                                                                <p className="text-[10px] text-muted-foreground">
                                                                    {format(comment._creationTime, "MMM d, yyyy • h:mm a")}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        {renderStars(comment.rating)}
                                                    </div>
                                                    <p className="text-xs text-foreground/70 leading-relaxed break-words">
                                                        {comment.content}
                                                    </p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </ScrollArea>
                            ) : (
                                <div className="rounded-lg border border-dashed bg-muted/20 p-6 text-center">
                                    <p className="text-sm text-muted-foreground">
                                        No comments yet for this interview.
                                    </p>
                                </div>
                            )}
                        </div>
                    </>

                    {/* Code Submissions Section */}
                    <>
                        <Separator className="my-4" />
                        <div className="space-y-3">
                            <div
                                className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 rounded-md p-2 -m-2 transition-colors"
                                onClick={() => setIsCodeSubmissionsExpanded(!isCodeSubmissionsExpanded)}
                            >
                                <div className="flex h-5 w-5 items-center justify-center rounded-md bg-blue-500/10">
                                    <HiCodeBracket className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                                </div>
                                <h4 className="text-sm font-semibold text-foreground/90 flex-1">Code Submissions</h4>
                                {isCodeSubmissionsExpanded ? (
                                    <FaChevronDown className="h-3 w-3 text-muted-foreground" />
                                ) : (
                                    <FaChevronRight className="h-3 w-3 text-muted-foreground" />
                                )}
                            </div>
                            {isCodeSubmissionsExpanded && (
                                <div className="animate-in slide-in-from-top-2 duration-200">
                                    <CodeSubmissions interviewId={interview._id} hideTitle={true} />
                                </div>
                            )}
                        </div>
                    </>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default MoreInfo;


