import { useState } from "react";
import useMeetingActions from "@/hooks/useMeetingActions";
import { Input } from "../../input";
import { Button } from "../../button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../dialog";
import { HiVideoCamera, HiArrowRightOnRectangle } from "react-icons/hi2";

interface MeetingModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    isJoinMeeting: boolean;
}

function MeetingModal({ isOpen, onClose, title, isJoinMeeting }: MeetingModalProps) {
    const [meetingUrl, setMeetingUrl] = useState("");
    const { createInstantMeeting, joinMeeting } = useMeetingActions();

    const handleStart = () => {
        if (isJoinMeeting) {
            const meetingId = meetingUrl.split("/").pop();
            if (meetingId) joinMeeting(meetingId);
        } else {
            createInstantMeeting();
        }

        setMeetingUrl("");
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[440px] overflow-hidden">
                {/* Gradient Background */}
                <div
                    className={`absolute inset-0 bg-gradient-to-br ${isJoinMeeting
                        ? "from-purple-500/10 via-purple-500/5 to-transparent"
                        : "from-primary/10 via-primary/5 to-transparent"
                        }`}
                />

                {/* Content */}
                <div className="relative">
                    <DialogHeader>
                        <DialogTitle className="text-xl">{title}</DialogTitle>
                        <DialogDescription className="pt-1">
                            {isJoinMeeting
                                ? "Enter the meeting link to join an existing session"
                                : "Create an instant meeting and invite others to join"}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-5 pt-2">
                        {isJoinMeeting && (
                            <div className="space-y-2">
                                <label htmlFor="meeting-url" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Meeting Link
                                </label>
                                <Input
                                    id="meeting-url"
                                    placeholder="https://yourapp.com/meeting/..."
                                    value={meetingUrl}
                                    onChange={(e) => setMeetingUrl(e.target.value)}
                                    className="h-10"
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && meetingUrl.trim()) {
                                            handleStart();
                                        }
                                    }}
                                />
                            </div>
                        )}

                        <div className="flex justify-end gap-2 pt-2">
                            <Button
                                onClick={handleStart}
                                disabled={isJoinMeeting && !meetingUrl.trim()}
                                className="gap-1.5"
                            >
                                {isJoinMeeting ? (
                                    <>
                                        <HiArrowRightOnRectangle className="h-4 w-4" />
                                        Join Meeting
                                    </>
                                ) : (
                                    <>
                                        <HiVideoCamera className="h-4 w-4" />
                                        Start Meeting
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
export default MeetingModal;