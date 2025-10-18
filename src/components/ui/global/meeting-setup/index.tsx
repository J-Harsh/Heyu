import { useCall, VideoPreview } from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";
import { Card } from "../../card";
import { HiCamera, HiMicrophone, HiCog6Tooth, HiClipboard, HiCheck } from "react-icons/hi2";
import { Switch } from "../../switch";
import { Button } from "../../button";
import DeviceSettings from "../device-settings";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../tooltip";
import { useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";

function MeetingSetup({ onSetupComplete }: { onSetupComplete: () => void }) {
    const [isCameraDisabled, setIsCameraDisabled] = useState(true);
    const [isMicDisabled, setIsMicDisabled] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    const call = useCall();
    const createOrGetInterview = useMutation(api.interviews.createOrGetInterview);

    useEffect(() => {
        if (!call) return;
        if (isCameraDisabled) call.camera.disable();
        else call.camera.enable();
    }, [isCameraDisabled, call]);

    useEffect(() => {
        if (!call) return;
        if (isMicDisabled) call.microphone.disable();
        else call.microphone.enable();
    }, [isMicDisabled, call]);

    if (!call) return null;

    const handleJoin = async () => {
        try {
            // Create or get interview in the database
            await createOrGetInterview({
                streamCallId: call.id,
            });

            // Join the call
            await call.join();
            onSetupComplete();
        } catch (error) {
            console.error("Error joining meeting:", error);
            toast.error("Failed to join meeting");
        }
    };

    const handleCopyMeetingId = async () => {
        try {
            await navigator.clipboard.writeText(call.id);
            setIsCopied(true);
            toast.success("Meeting ID copied to clipboard!");
            setTimeout(() => {
                setIsCopied(false);
            }, 2000);
        } catch {
            toast.error("Failed to copy Meeting ID");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-background/95">
            <div className="w-full max-w-[1200px] mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* VIDEO PREVIEW CONTAINER */}
                    <Card className="md:col-span-1 p-6 flex flex-col">
                        <div>
                            <h1 className="text-xl font-semibold mb-1">Camera Preview</h1>
                            <p className="text-sm text-muted-foreground">Make sure you look good!</p>
                        </div>

                        {/* VIDEO PREVIEW */}
                        <div className="mt-4 flex-1 min-h-[400px] rounded-xl overflow-hidden bg-muted/50 border relative">
                            <div className="absolute inset-0">
                                <VideoPreview className={`h-full w-full bg-muted border-primary border dark:text-white  text-black`} />
                            </div>
                        </div>
                    </Card>

                    {/* CARD CONTROLS */}

                    <Card className="md:col-span-1 p-6 overflow-hidden bg-gradient-to-br from-card via-card to-card/95 backdrop-blur-sm border-border/50 flex flex-col">
                        {/* MEETING DETAILS  */}
                        <div>
                            <h2 className="text-xl font-semibold mb-1">Ready to Join?</h2>
                            <div className="inline-flex items-center gap-2 mt-2 px-2.5 py-1.5 rounded-lg bg-muted/40 border border-border/40 backdrop-blur-sm">
                                <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                                <span className="text-xs font-medium text-muted-foreground">Meeting ID:</span>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <button
                                            onClick={handleCopyMeetingId}
                                            className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-foreground transition-colors duration-200 cursor-pointer group"
                                        >
                                            <span className="group-hover:underline underline-offset-2">{call.id}</span>
                                            {isCopied ? (
                                                <HiCheck className="h-3 w-3 text-green-500" />
                                            ) : (
                                                <HiClipboard className="h-3 w-3 opacity-50 group-hover:opacity-100 transition-opacity" />
                                            )}
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-muted text-primary">
                                        <p> {isCopied ? "Copied!" : "Click to copy"}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                        </div>

                        {/* CONTROLS SECTION */}
                        <div className="space-y-2 mt-6">
                            {/* CAM CONTROL */}
                            <div
                                onClick={() => setIsCameraDisabled(!isCameraDisabled)}
                                className="flex items-center justify-between p-4 rounded-xl hover:bg-gradient-to-r hover:from-muted/60 hover:to-muted/30 transition-all duration-200 group border border-transparent hover:border-border/40 hover:shadow-sm cursor-pointer"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/15 via-primary/10 to-primary/5 group-hover:from-primary/20 group-hover:via-primary/15 group-hover:to-primary/10 flex items-center justify-center transition-all duration-200 border border-primary/10 group-hover:border-primary/20">
                                        <HiCamera className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Camera</p>
                                        <p className="text-sm text-muted-foreground">
                                            {isCameraDisabled ? "Disabled" : "Enabled"}
                                        </p>
                                    </div>
                                </div>
                                <div onClick={(e) => e.stopPropagation()}>
                                    <Switch
                                        checked={!isCameraDisabled}
                                        onCheckedChange={(checked) => setIsCameraDisabled(!checked)}
                                    />
                                </div>
                            </div>

                            {/* MIC CONTROL */}
                            <div
                                onClick={() => setIsMicDisabled(!isMicDisabled)}
                                className="flex items-center justify-between p-4 rounded-xl hover:bg-gradient-to-r hover:from-muted/60 hover:to-muted/30 transition-all duration-200 group border border-transparent hover:border-border/40 hover:shadow-sm cursor-pointer"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/15 via-primary/10 to-primary/5 group-hover:from-primary/20 group-hover:via-primary/15 group-hover:to-primary/10 flex items-center justify-center transition-all duration-200 border border-primary/10 group-hover:border-primary/20">
                                        <HiMicrophone className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Microphone</p>
                                        <p className="text-sm text-muted-foreground">
                                            {isMicDisabled ? "Disabled" : "Enabled"}
                                        </p>
                                    </div>
                                </div>
                                <div onClick={(e) => e.stopPropagation()}>
                                    <Switch
                                        checked={!isMicDisabled}
                                        onCheckedChange={(checked) => setIsMicDisabled(!checked)}
                                    />
                                </div>
                            </div>

                            {/* DEVICE SETTINGS */}
                            <div className="flex items-center justify-between p-4 rounded-xl hover:bg-gradient-to-r hover:from-muted/60 hover:to-muted/30 transition-all duration-200 group border border-transparent hover:border-border/40 hover:shadow-sm">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/15 via-primary/10 to-primary/5 group-hover:from-primary/20 group-hover:via-primary/15 group-hover:to-primary/10 flex items-center justify-center transition-all duration-200 border border-primary/10 group-hover:border-primary/20">
                                        <HiCog6Tooth className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Device Settings</p>
                                        <p className="text-sm text-muted-foreground">Configure audio & video</p>
                                    </div>
                                </div>
                                <DeviceSettings />
                            </div>
                        </div>

                        {/* JOIN BTN */}
                        <div className="space-y-3 mt-auto">
                            <Button className="w-full font-semibold" size="lg" onClick={handleJoin}>
                                Join Meeting
                            </Button>
                            <p className="text-xs text-center text-muted-foreground">
                                Do not worry, our team is super friendly! We want you to succeed. 🎉
                            </p>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
export default MeetingSetup;