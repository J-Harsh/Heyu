"use client";

import CLoader from "@/components/ui/global/cloader";
import RecordingCard from "@/components/ui/global/recording-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import useGetCalls from "@/hooks/useGetCalls";
import { Call, CallRecording } from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";

type RecordingWithCall = {
    recording: CallRecording;
    call: Call;
};

function RecordingsPage() {
    const { calls, isLoading } = useGetCalls();
    const [recordings, setRecordings] = useState<RecordingWithCall[]>([]);
    const [isLoadingRecordings, setIsLoadingRecordings] = useState(false);

    useEffect(() => {
        const fetchRecordings = async () => {
            if (!calls) return;

            setIsLoadingRecordings(true);
            try {
                const recordingsWithCalls: RecordingWithCall[] = [];

                for (const call of calls) {
                    const { recordings: callRecordings } = await call.queryRecordings();
                    callRecordings.forEach((recording) => {
                        recordingsWithCalls.push({ recording, call });
                    });
                }

                setRecordings(recordingsWithCalls);
            } catch (error) {
                console.log("Error fetching recordings:", error);
            } finally {
                setIsLoadingRecordings(false);
            }
        };

        fetchRecordings();
    }, [calls]);

    if (isLoading || isLoadingRecordings) return <CLoader context="recordings" />;

    return (
        <div className="container max-w-7xl mx-auto p-6">
            {/* HEADER SECTION */}
            <h1 className="text-3xl font-bold">Recordings</h1>
            <p className="text-muted-foreground my-1">
                {recordings.length} {recordings.length === 1 ? "recording" : "recordings"} available
            </p>

            {/* RECORDINGS GRID */}

            <ScrollArea className="h-[calc(100vh-12rem)] mt-3">
                {recordings.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-6">
                        {recordings.map((r) => (
                            <RecordingCard key={r.recording.end_time} recording={r.recording} call={r.call} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-[400px] gap-4">
                        <p className="text-xl font-medium text-muted-foreground">No recordings available</p>
                    </div>
                )}
            </ScrollArea>
        </div>
    );
}
export default RecordingsPage;