"use client";

import { useCall, useCallStateHooks } from "@stream-io/video-react-sdk";
import { useState } from "react";
import { Button } from "../../button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../../dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../select";
import { HiCamera, HiMicrophone } from "react-icons/hi2";


function DeviceSettings() {
    const [open, setOpen] = useState(false);
    const call = useCall();
    const { useCameraState, useMicrophoneState } = useCallStateHooks();

    const { camera, devices: cameraDevices, selectedDevice: selectedCamera } = useCameraState();
    const { microphone, devices: microphoneDevices, selectedDevice: selectedMicrophone } = useMicrophoneState();

    if (!call) return null;

    const handleCameraChange = async (deviceId: string) => {
        try {
            await camera.select(deviceId);
        } catch (error) {
            console.error("Error changing camera:", error);
        }
    };

    const handleMicrophoneChange = async (deviceId: string) => {
        try {
            await microphone.select(deviceId);
        } catch (error) {
            console.error("Error changing microphone:", error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    Configure
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Device Settings</DialogTitle>
                    <DialogDescription>
                        Select your preferred camera and microphone
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-5 mt-4">
                    {/* CAMERA SELECTION */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                <HiCamera className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm font-medium">Camera</p>
                            </div>
                        </div>
                        <Select
                            value={selectedCamera}
                            onValueChange={handleCameraChange}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select camera" />
                            </SelectTrigger>
                            <SelectContent>
                                {cameraDevices?.map((device) => (
                                    <SelectItem key={device.deviceId} value={device.deviceId}>
                                        {device.label || `Camera ${device.deviceId.slice(0, 8)}`}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* MICROPHONE SELECTION */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                <HiMicrophone className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm font-medium">Microphone</p>
                            </div>
                        </div>
                        <Select
                            value={selectedMicrophone}
                            onValueChange={handleMicrophoneChange}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select microphone" />
                            </SelectTrigger>
                            <SelectContent>
                                {microphoneDevices?.map((device) => (
                                    <SelectItem key={device.deviceId} value={device.deviceId}>
                                        {device.label || `Microphone ${device.deviceId.slice(0, 8)}`}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="flex justify-end mt-5 pt-4">
                    <Button onClick={() => setOpen(false)}>
                        Done
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default DeviceSettings;

