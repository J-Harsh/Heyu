import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TIME_SLOTS } from "@/constants";
import { FaCalendarAlt, FaClock } from "react-icons/fa";
import { cn } from "@/lib/utils";

interface DateTimePickerProps {
    date: Date;
    time: string;
    onDateChange: (date: Date) => void;
    onTimeChange: (time: string) => void;
    disablePastDates?: boolean;
    className?: string;
}

function DateTimePicker({
    date,
    time,
    onDateChange,
    onTimeChange,
    disablePastDates = true,
    className,
}: DateTimePickerProps) {
    const formatDate = (date: Date) => {
        return date.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    return (
        <div className={cn("space-y-6", className)}>
            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-medium">
                        <FaCalendarAlt className="h-4 w-4 text-primary" />
                        <span>Select Date</span>
                    </div>
                    <div className="rounded-lg border bg-card p-3">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={(newDate) => newDate && onDateChange(newDate)}
                            disabled={(date) => disablePastDates && date < new Date()}
                            className="w-full"
                        />
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-medium">
                        <FaClock className="h-4 w-4 text-primary" />
                        <span>Select Time</span>
                    </div>
                    <div className="space-y-4">
                        <Select value={time} onValueChange={onTimeChange}>
                            <SelectTrigger className="h-12">
                                <SelectValue placeholder="Select time" />
                            </SelectTrigger>
                            <SelectContent className="max-h-[300px]">
                                {TIME_SLOTS.map((slot) => (
                                    <SelectItem key={slot} value={slot} className="cursor-pointer">
                                        <div className="flex items-center gap-2">
                                            <FaClock className="h-3 w-3 text-muted-foreground" />
                                            <span className="font-medium">{slot}</span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <div className="rounded-lg border bg-muted/50 p-4 space-y-2">
                            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                Scheduled For
                            </div>
                            <div className="text-sm font-semibold text-foreground">
                                {formatDate(date)} at {time}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DateTimePicker;

