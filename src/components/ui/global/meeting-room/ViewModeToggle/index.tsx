"use client";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { HiViewColumns, HiCodeBracket, HiVideoCamera } from "react-icons/hi2";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export type ViewMode = "split" | "editor-focus" | "video-focus";

interface ViewModeToggleProps {
    currentMode: ViewMode;
    onModeChange: (mode: ViewMode) => void;
    variant?: "dropdown" | "buttons";
}

function ViewModeToggle({ currentMode, onModeChange, variant = "dropdown" }: ViewModeToggleProps) {
    const modes = [
        {
            id: "split" as ViewMode,
            label: "Split View",
            icon: HiViewColumns,
            description: "Video & Editor side-by-side"
        },
        {
            id: "editor-focus" as ViewMode,
            label: "Editor Focus",
            icon: HiCodeBracket,
            description: "Focus on coding"
        },
        {
            id: "video-focus" as ViewMode,
            label: "Video Focus",
            icon: HiVideoCamera,
            description: "Focus on discussion"
        }
    ];

    const currentModeData = modes.find(m => m.id === currentMode);
    const CurrentIcon = currentModeData?.icon || HiViewColumns;

    if (variant === "buttons") {
        return (
            <TooltipProvider>
                <div className="flex items-center gap-1 bg-background/80 backdrop-blur rounded-lg p-1 border">
                    {modes.map((mode) => {
                        const Icon = mode.icon;
                        const isActive = currentMode === mode.id;

                        return (
                            <Tooltip key={mode.id}>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant={isActive ? "default" : "ghost"}
                                        size="sm"
                                        onClick={() => onModeChange(mode.id)}
                                        className="h-8 px-3"
                                    >
                                        <Icon className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p className="font-medium">{mode.label}</p>
                                    <p className="text-xs text-muted-foreground">{mode.description}</p>
                                </TooltipContent>
                            </Tooltip>
                        );
                    })}
                </div>
            </TooltipProvider>
        );
    }

    // Dropdown variant
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="size-10">
                    <CurrentIcon className="size-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {modes.map((mode) => {
                    const Icon = mode.icon;
                    return (
                        <DropdownMenuItem
                            key={mode.id}
                            onClick={() => onModeChange(mode.id)}
                            className={currentMode === mode.id ? "bg-accent" : ""}
                        >
                            <Icon className="mr-2 h-4 w-4" />
                            <div className="flex flex-col">
                                <span>{mode.label}</span>
                                <span className="text-xs text-muted-foreground">{mode.description}</span>
                            </div>
                        </DropdownMenuItem>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default ViewModeToggle;

