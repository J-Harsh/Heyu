"use client";

import { CallControls, CallingState, CallParticipantsList, PaginatedGridLayout, SpeakerLayout, useCallStateHooks } from "@stream-io/video-react-sdk";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState, useCallback, useRef } from "react";
import CLoader from "../cloader";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "../../resizable";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../dropdown-menu";
import { Button } from "../../button";
import { HiListBullet, HiUsers } from "react-icons/hi2";
import CodeEditor, { CodeEditorRef } from "./CodeEditor";
import EndCallButton from "./EndCallButton";
import ViewModeToggle, { ViewMode } from "./ViewModeToggle";
import FloatingCallIndicator from "./FloatingCallIndicator";
import { useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";

function MeetingRoom() {

    const router = useRouter()
    const params = useParams()
    const [layout, setLayout] = useState<"grid" | "speaker">('speaker')
    const [showParticipants, setShowParticipants] = useState(false)
    const [viewMode, setViewMode] = useState<ViewMode>("split")
    const codeEditorRef = useRef<CodeEditorRef>(null)

    const { useCallCallingState } = useCallStateHooks()
    const callingState = useCallCallingState()

    const saveCodeOnMeetingEnd = useMutation(api.codeSubmissions.saveCodeOnMeetingEnd);

    const handleViewModeChange = useCallback((mode: ViewMode) => {
        setViewMode(mode);
    }, []);

    // Handle call end - save code and redirect all participants when call ends
    useEffect(() => {
        if (callingState === CallingState.LEFT) {
            // Save code when call ends naturally
            const currentCodeState = codeEditorRef.current?.getCurrentCodeState();
            if (currentCodeState && currentCodeState.code.trim() && params.id) {
                saveCodeOnMeetingEnd({
                    interviewId: params.id as Id<"interviews">,
                    code: currentCodeState.code,
                    questionId: currentCodeState.questionId,
                    language: currentCodeState.language,
                }).catch(console.error);
            }
            router.push("/dashboard");
        }
    }, [callingState, router, params.id, saveCodeOnMeetingEnd]);

    if (callingState !== CallingState.JOINED) {
        return <CLoader context="meeting" />
    }

    // Video Layout Component (reusable)
    const VideoLayout = ({ isVisible }: { isVisible: boolean }) => (
        <div className={`absolute inset-0 ${!isVisible ? 'opacity-0 pointer-events-none' : ''}`}>
            {layout === "grid" ? <PaginatedGridLayout /> : <SpeakerLayout />}

            {/* PARTICIPANTS LIST OVERLAY */}
            {showParticipants && (
                <div className="absolute right-0 top-0 h-full w-[300px] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <CallParticipantsList onClose={() => setShowParticipants(false)} />
                </div>
            )}
        </div>
    );

    // Video Controls Component (reusable)
    const VideoControls = ({ position = "bottom" }: { position?: "bottom" | "top" }) => (
        <div className={`absolute ${position === "bottom" ? "bottom-4" : "top-4"} left-0 right-0`}>
            <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-2 flex-wrap justify-center px-4">
                    <CallControls onLeave={() => router.push("/dashboard")} />

                    <div className="flex items-center gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="icon" className="size-10">
                                    <HiListBullet className="size-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => setLayout("grid")}>
                                    Grid View
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setLayout("speaker")}>
                                    Speaker View
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <Button
                            variant="outline"
                            size="icon"
                            className="size-10"
                            onClick={() => setShowParticipants(!showParticipants)}
                        >
                            <HiUsers className="size-4" />
                        </Button>

                        <ViewModeToggle
                            currentMode={viewMode}
                            onModeChange={handleViewModeChange}
                            variant="dropdown"
                        />

                        <EndCallButton
                            codeEditorRef={codeEditorRef}
                        />
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="h-[calc(100vh-4rem-1px)] relative">
            {/* SPLIT VIEW MODE (Default) */}
            {viewMode === "split" && (
                <ResizablePanelGroup direction="horizontal">
                    <ResizablePanel defaultSize={35} minSize={25} maxSize={100} className="relative">
                        <VideoLayout isVisible={true} />
                        <VideoControls position="bottom" />
                    </ResizablePanel>

                    <ResizableHandle withHandle />

                    <ResizablePanel defaultSize={65} minSize={25}>
                        <CodeEditor
                            ref={codeEditorRef}
                        />
                    </ResizablePanel>
                </ResizablePanelGroup>
            )}

            {/* EDITOR FOCUS MODE */}
            {viewMode === "editor-focus" && (
                <div className="h-full relative">
                    {/* Hidden video - keeps call active */}
                    <div className="absolute -left-[9999px] w-screen h-screen">
                        <VideoLayout isVisible={false} />
                    </div>

                    {/* Full screen editor with horizontal layout */}
                    <CodeEditor
                        ref={codeEditorRef}
                        layout="horizontal"
                    />

                    {/* Floating call indicator - now self-positioning and draggable */}
                    <FloatingCallIndicator />

                    {/* Floating controls */}
                    <div className="absolute top-4 right-4 z-10">
                        <div className="flex items-center gap-2">
                            <ViewModeToggle
                                currentMode={viewMode}
                                onModeChange={handleViewModeChange}
                                variant="buttons"
                            />
                            <EndCallButton
                                codeEditorRef={codeEditorRef}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* VIDEO FOCUS MODE */}
            {viewMode === "video-focus" && (
                <div className="h-full relative">
                    {/* Full screen video */}
                    <VideoLayout isVisible={true} />

                    {/* Floating controls */}
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
                        <ViewModeToggle
                            currentMode={viewMode}
                            onModeChange={handleViewModeChange}
                            variant="buttons"
                        />
                    </div>

                    <VideoControls position="bottom" />
                </div>
            )}
        </div>
    );
}
export default MeetingRoom;