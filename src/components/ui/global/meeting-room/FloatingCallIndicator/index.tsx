"use client";

import { useCallStateHooks } from "@stream-io/video-react-sdk";
import { HiUsers, HiMicrophone, HiVideoCamera } from "react-icons/hi2";
import { MdDragIndicator } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { DndContext, useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

// Draggable component using @dnd-kit
function DraggableIndicator() {
    const { useParticipantCount, useMicrophoneState, useCameraState } = useCallStateHooks();
    const participantCount = useParticipantCount();
    const { microphone, isMute } = useMicrophoneState();
    const { camera, isMute: isCameraOff } = useCameraState();

    const [duration, setDuration] = useState(0);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        isDragging,
    } = useDraggable({
        id: 'floating-call-indicator',
    });

    const style = {
        transform: CSS.Translate.toString(transform),
    };

    // Call duration timer
    useEffect(() => {
        const interval = setInterval(() => {
            setDuration(prev => prev + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const toggleMic = async () => {
        if (microphone) {
            if (isMute) {
                await microphone.enable();
            } else {
                await microphone.disable();
            }
        }
    };

    const toggleCamera = async () => {
        if (camera) {
            if (isCameraOff) {
                await camera.enable();
            } else {
                await camera.disable();
            }
        }
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                "fixed flex items-center gap-2 bg-background/95 backdrop-blur border rounded-lg px-3 py-2 shadow-lg z-50",
                isDragging ? "cursor-grabbing" : "cursor-grab"
            )}
            {...listeners}
            {...attributes}
        >
            {/* Drag handle indicator */}
            <MdDragIndicator />

            {/* Divider */}
            <div className="w-px h-4 bg-border" />

            {/* Call active indicator */}
            <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs font-medium text-green-600 dark:text-green-400">Live</span>
            </div>

            {/* Divider */}
            <div className="w-px h-4 bg-border" />

            {/* Duration */}
            <div className="text-xs font-mono text-muted-foreground">
                {formatDuration(duration)}
            </div>

            {/* Divider */}
            <div className="w-px h-4 bg-border" />

            {/* Participant count */}
            <div className="flex items-center gap-1">
                <HiUsers className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs font-medium">{participantCount}</span>
            </div>

            {/* Divider */}
            <div className="w-px h-4 bg-border" />

            {/* Call controls */}
            <div className="flex items-center gap-1">
                <Button
                    variant={isMute ? "destructive" : "secondary"}
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={(e) => {
                        e.stopPropagation();
                        toggleMic();
                    }}
                >
                    <HiMicrophone className="h-3 w-3" />
                </Button>
                <Button
                    variant={isCameraOff ? "destructive" : "secondary"}
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={(e) => {
                        e.stopPropagation();
                        toggleCamera();
                    }}
                >
                    <HiVideoCamera className="h-3 w-3" />
                </Button>
            </div>
        </div>
    );
}

// Main component with DndContext
function FloatingCallIndicator() {
    const handleDragEnd = () => {
        // The position is automatically handled by @dnd-kit
        // No manual position management needed
    };

    return (
        <DndContext onDragEnd={handleDragEnd}>
            <DraggableIndicator />
        </DndContext>
    );
}

export default FloatingCallIndicator;

