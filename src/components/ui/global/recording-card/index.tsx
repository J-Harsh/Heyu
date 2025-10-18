import { Call, CallRecording } from "@stream-io/video-react-sdk";
import { toast } from "sonner";
import { format } from "date-fns";
import { calculateRecordingDuration } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { IoCopyOutline, IoCopy } from "react-icons/io5";
import { FaCalendar, FaClock, FaPlay, FaVideo, FaUserTie } from "react-icons/fa";
import { Button } from "@/components/ui/button";

function RecordingCard({ recording, call }: { recording: CallRecording; call?: Call }) {
    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(recording.url);
            toast.success("Recording link copied to clipboard");
        } catch {
            toast.error("Failed to copy link to clipboard");
        }
    };

    const duration =
        recording.start_time && recording.end_time
            ? calculateRecordingDuration(recording.start_time, recording.end_time)
            : "Unknown duration";

    const formattedDate = recording.start_time
        ? format(new Date(recording.start_time), "MMM d, yyyy")
        : "Unknown";

    const host = call?.state.createdBy;
    const hostName = host?.name || host?.id || "Unknown";

    return (
        <Card className="group overflow-hidden border-border/50 hover:border-border hover:shadow-md transition-shadow">

            {/* CARD HEADER with enhanced styling */}
            <CardHeader className="space-y-3 pb-3">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                            <FaVideo className="size-4 text-primary" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="font-semibold text-base leading-none">
                                Meeting Recording
                            </h3>
                            <p className="text-xs text-muted-foreground">
                                Click to view recording
                            </p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleShare}
                        className="size-9 shrink-0 group/share"
                    >
                        <IoCopyOutline className="size-5 group-hover/share:hidden" />
                        <IoCopy className="size-5 hidden group-hover/share:block" />
                    </Button>
                </div>

                {/* Date, Duration, and Host Info */}
                <div className="flex items-center gap-3 pt-2 border-t border-border/30 text-xs flex-wrap">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                        <FaCalendar className="size-3" />
                        <span>{formattedDate}</span>
                    </div>
                    <div className="size-1 rounded-full bg-border" />
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                        <FaClock className="size-3" />
                        <span>{duration}</span>
                    </div>
                    {host && (
                        <>
                            <div className="size-1 rounded-full bg-border" />
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                                <FaUserTie className="size-3" />
                                <span>{hostName}</span>
                            </div>
                        </>
                    )}
                </div>
            </CardHeader>

            {/* CARD CONTENT with enhanced preview */}
            <CardContent className="px-6 pb-6">
                <div
                    className="relative w-full aspect-video bg-gradient-to-br from-primary/5 via-muted/50 to-primary/10 rounded-xl flex items-center justify-center cursor-pointer overflow-hidden group/preview border-2 border-border/30"
                    onClick={() => window.open(recording.url, "_blank")}
                >
                    {/* Background pattern */}
                    <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />

                    {/* Play button */}
                    <div className="relative z-10 size-16 rounded-full bg-background/95 backdrop-blur-sm flex items-center justify-center shadow-lg border-2 border-border/50 group-hover/preview:border-primary/50 transition-colors">
                        <FaPlay className="size-7 ml-1 text-muted-foreground group-hover/preview:text-primary transition-colors" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
export default RecordingCard;