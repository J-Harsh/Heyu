import { useCall, useCallStateHooks } from "@stream-io/video-react-sdk";
import { useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "../../../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { CodeEditorRef } from "../CodeEditor";

interface EndCallButtonProps {
    codeEditorRef: React.RefObject<CodeEditorRef>;
}

function EndCallButton({ codeEditorRef }: EndCallButtonProps) {
    const call = useCall();
    const router = useRouter();
    const { useLocalParticipant } = useCallStateHooks();
    const localParticipant = useLocalParticipant();
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [isEnding, setIsEnding] = useState(false);

    const updateInterviewStatus = useMutation(api.interviews.updateInterviewStatus);
    const saveCodeOnMeetingEnd = useMutation(api.codeSubmissions.saveCodeOnMeetingEnd);

    const interview = useQuery(api.interviews.getInterviewByStreamCallId, {
        streamCallId: call?.id || "",
    });

    if (!call || !interview) return null;

    const isMeetingOwner = localParticipant?.userId === call.state.createdBy?.id;

    if (!isMeetingOwner) return null;

    const endCall = async () => {
        setIsEnding(true);
        try {
            // Save code before ending the call
            const currentCodeState = codeEditorRef.current?.getCurrentCodeState();
            if (currentCodeState && currentCodeState.code.trim()) {
                await saveCodeOnMeetingEnd({
                    interviewId: interview._id,
                    code: currentCodeState.code,
                    questionId: currentCodeState.questionId,
                    language: currentCodeState.language,
                });
            }

            await call.endCall();

            await updateInterviewStatus({
                id: interview._id,
                status: "completed",
            });

            router.push("/dashboard");
            toast.success("Meeting ended for everyone");
        } catch (error) {
            console.log(error);
            toast.error("Failed to end meeting");
        } finally {
            setIsEnding(false);
            setShowConfirmDialog(false);
        }
    };

    return (
        <>
            <Button
                variant={"destructive"}
                onClick={() => setShowConfirmDialog(true)}
            >
                End Meeting
            </Button>

            <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>End Meeting</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to end this meeting? This action will end the meeting for all participants and cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setShowConfirmDialog(false)}
                            disabled={isEnding}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={endCall}
                            disabled={isEnding}
                        >
                            {isEnding ? "Ending..." : "End Meeting"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
export default EndCallButton;