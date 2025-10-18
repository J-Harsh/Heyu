import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FaCalendarAlt } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import DateTimePicker from "@/components/ui/global/date-time-picker";

interface RescheduleProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    newDate: Date;
    setNewDate: (date: Date) => void;
    newTime: string;
    setNewTime: (time: string) => void;
    isRescheduling: boolean;
    onReschedule: () => void;
}

function Reschedule({
    open,
    onOpenChange,
    newDate,
    setNewDate,
    newTime,
    setNewTime,
    isRescheduling,
    onReschedule,
}: RescheduleProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button variant="outline" className="flex-1">
                    <FaCalendarAlt className="mr-2 h-4 w-4" />
                    Reschedule
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Reschedule Interview</DialogTitle>
                    <DialogDescription>
                        Choose a new date and time for this interview
                    </DialogDescription>
                </DialogHeader>

                <DateTimePicker
                    date={newDate}
                    time={newTime}
                    onDateChange={setNewDate}
                    onTimeChange={setNewTime}
                    className="py-4"
                />

                <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isRescheduling}
                    >
                        Cancel
                    </Button>
                    <Button onClick={onReschedule} disabled={isRescheduling}>
                        {isRescheduling ? (
                            <>
                                <AiOutlineLoading3Quarters className="mr-2 h-4 w-4 animate-spin" />
                                Rescheduling...
                            </>
                        ) : (
                            "Confirm Reschedule"
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default Reschedule;

