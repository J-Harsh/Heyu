import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FaClipboardCheck, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

interface ReviewProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    isUpdating: boolean;
    onResult: (result: "pass" | "fail") => void;
    buttonVariant?: "default" | "outline";
}

function Review({
    open,
    onOpenChange,
    isUpdating,
    onResult,
    buttonVariant = "outline",
}: ReviewProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button variant={buttonVariant} className="flex-1">
                    <FaClipboardCheck className="mr-2 h-4 w-4" />
                    Review
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader className="space-y-3 pb-2">
                    <DialogTitle className="text-2xl font-bold">Review Interview</DialogTitle>
                    <DialogDescription className="text-base">
                        Provide your final assessment of the candidate&apos;s performance
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-6">
                    <div className="bg-muted/50 rounded-lg p-4 border">
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Select the result for this interview. This decision will be recorded and shared with the candidate.
                        </p>
                    </div>

                    <div className="flex flex-col gap-4">
                        <button
                            onClick={() => onResult("pass")}
                            disabled={isUpdating}
                            className="group relative w-full p-6 rounded-xl border-2 border-green-200 dark:border-green-900 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 hover:from-green-100 hover:to-emerald-100 dark:hover:from-green-900/40 dark:hover:to-emerald-900/40 transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            <div className="flex items-center gap-4">
                                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-600 dark:bg-green-500 flex items-center justify-center text-white shadow-md group-hover:shadow-lg transition-shadow">
                                    {isUpdating ? (
                                        <AiOutlineLoading3Quarters className="h-6 w-6 animate-spin" />
                                    ) : (
                                        <FaCheckCircle className="h-6 w-6" />
                                    )}
                                </div>
                                <div className="flex flex-col items-start text-left flex-1">
                                    <span className="font-bold text-lg text-green-900 dark:text-green-100 mb-1">
                                        Pass
                                    </span>
                                    <span className="text-sm text-green-700 dark:text-green-300 font-medium">
                                        Candidate has successfully passed the interview
                                    </span>
                                </div>
                            </div>
                        </button>

                        <button
                            onClick={() => onResult("fail")}
                            disabled={isUpdating}
                            className="group relative w-full p-6 rounded-xl border-2 border-red-200 dark:border-red-900 bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-950/30 hover:from-red-100 hover:to-rose-100 dark:hover:from-red-900/40 dark:hover:to-rose-900/40 transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            <div className="flex items-center gap-4">
                                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-600 dark:bg-red-500 flex items-center justify-center text-white shadow-md group-hover:shadow-lg transition-shadow">
                                    {isUpdating ? (
                                        <AiOutlineLoading3Quarters className="h-6 w-6 animate-spin" />
                                    ) : (
                                        <FaTimesCircle className="h-6 w-6" />
                                    )}
                                </div>
                                <div className="flex flex-col items-start text-left flex-1">
                                    <span className="font-bold text-lg text-red-900 dark:text-red-100 mb-1">
                                        Fail
                                    </span>
                                    <span className="text-sm text-red-700 dark:text-red-300 font-medium">
                                        Candidate did not meet the required standards
                                    </span>
                                </div>
                            </div>
                        </button>
                    </div>
                </div>

                <div className="flex justify-end pt-4 border-t">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isUpdating}
                        className="px-6"
                    >
                        Cancel
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default Review;

