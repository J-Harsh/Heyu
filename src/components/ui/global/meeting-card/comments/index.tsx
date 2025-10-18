import { useState } from "react";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../../../convex/_generated/api";
import { toast } from "sonner";
import { FaCommentDots, FaStar } from "react-icons/fa";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getUserInfo } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface CommentsProps {
    interviewId: Id<"interviews">;
    variant?: "button" | "inline";
}

function Comments({ interviewId, variant = "button" }: CommentsProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [comment, setComment] = useState("");
    const [rating, setRating] = useState("3");

    const addComment = useMutation(api.comments.addComment);
    const users = useQuery(api.users.getUsers);
    const existingComments = useQuery(api.comments.getCommentsByInterview, { interviewId });

    const handleSubmit = async () => {
        if (!comment.trim()) return toast.error("Please enter comment");

        try {
            await addComment({
                interviewId,
                content: comment.trim(),
                rating: parseInt(rating),
            });

            toast.success("Comment submitted");
            setComment("");
            setRating("3");
            setIsOpen(false);
        } catch {
            toast.error("Failed to submit comment");
        }
    };

    const renderStars = (rating: number) => (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((starValue) => (
                <FaStar
                    key={starValue}
                    className={`h-4 w-4 ${starValue <= rating ? "fill-primary text-primary" : "text-muted-foreground"}`}
                />
            ))}
        </div>
    );

    if (existingComments === undefined || users === undefined) return null;

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            {/* TRIGGER BUTTON */}
            <DialogTrigger asChild>
                {variant === "button" ? (
                    <Button variant="secondary" className="w-full">
                        <FaCommentDots className="h-4 w-4 mr-2" />
                        {existingComments.length > 0 ? `Comments (${existingComments.length})` : "Comment"}
                    </Button>
                ) : (
                    <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                        <FaCommentDots className="h-4 w-4" />
                        <span>{existingComments.length} {existingComments.length === 1 ? 'Comment' : 'Comments'}</span>
                    </button>
                )}
            </DialogTrigger>

            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Interview Comments</DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {existingComments.length > 0 && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h4 className="text-sm font-medium">All Comments</h4>
                                <Badge variant="outline">
                                    {existingComments.length} Comment{existingComments.length !== 1 ? "s" : ""}
                                </Badge>
                            </div>

                            {/* DISPLAY EXISTING COMMENTS */}
                            <ScrollArea className="h-[240px]">
                                <div className="space-y-4 pr-4">
                                    {existingComments.map((comment, index) => {
                                        const commenter = getUserInfo(users, comment.commenterId);
                                        return (
                                            <div key={index} className="rounded-lg border p-4 space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <Avatar className="h-8 w-8">
                                                            <AvatarImage src={commenter.image} />
                                                            <AvatarFallback>{commenter.initials}</AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <p className="text-sm font-medium">
                                                                {commenter.name}
                                                                <span className="ml-2 text-xs text-muted-foreground">
                                                                    ({comment.commenterRole})
                                                                </span>
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">
                                                                {format(comment._creationTime, "MMM d, yyyy • h:mm a")}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    {renderStars(comment.rating)}
                                                </div>
                                                <p className="text-sm text-muted-foreground">{comment.content}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </ScrollArea>
                        </div>
                    )}

                    {/* ADD COMMENT FORM - AVAILABLE TO ALL USERS */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-medium">
                            {existingComments.length === 0 ? "Be the first to comment" : "Add Your Comment"}
                        </h4>

                        {/* RATING */}
                        <div className="space-y-2">
                            <Label>Rating</Label>
                            <Select value={rating} onValueChange={setRating}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select rating" />
                                </SelectTrigger>
                                <SelectContent>
                                    {[1, 2, 3, 4, 5].map((value) => (
                                        <SelectItem key={value} value={value.toString()}>
                                            <div className="flex items-center gap-2">{renderStars(value)}</div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* COMMENT */}
                        <div className="space-y-2">
                            <Label>Your Comment</Label>
                            <Textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Share your detailed feedback about the interview..."
                                className="h-32"
                            />
                        </div>
                    </div>
                </div>

                {/* BUTTONS */}
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsOpen(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit}>Submit Comment</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default Comments;

