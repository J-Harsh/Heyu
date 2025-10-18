import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";

// Mutation to add a comment
export const addComment = mutation({
    args: {
        content: v.string(),
        rating: v.number(),
        interviewId: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()
        if (!identity) throw new Error("Unauthorized")

        // Get the commenter's information
        const commenter = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
            .first();

        if (!commenter) throw new Error("User not found");
        if (!commenter.role) throw new Error("User role not set. Please complete onboarding.");

        const comment = await ctx.db.insert("comments", {
            content: args.content,
            rating: args.rating,
            commenterId: identity.subject,
            commenterRole: commenter.role,
            interviewId: args.interviewId,
        });

        // Get the interview to find who to notify
        const interview = await ctx.db
            .query("interviews")
            .filter((q) => q.eq(q.field("_id"), args.interviewId))
            .first();

        if (interview) {
            // If interviewer commented, notify the candidate
            if (commenter.role === "interviewer" && interview.candidateId) {
                await ctx.db.insert("notifications", {
                    userId: interview.candidateId,
                    type: "comment",
                    interviewId: interview._id,
                    message: `${commenter.name} commented on your interview: "${interview.title}"`,
                    isRead: false,
                    createdAt: Date.now(),
                });
            }
            // If candidate commented, notify all interviewers
            else if (commenter.role === "candidate" && interview.interviewerIds.length > 0) {
                // Note: Interviewers don't see notifications in the UI anymore, 
                // but we keep this for potential future use or email notifications
                for (const interviewerId of interview.interviewerIds) {
                    await ctx.db.insert("notifications", {
                        userId: interviewerId,
                        type: "comment",
                        interviewId: interview._id,
                        message: `${commenter.name} commented on the interview: "${interview.title}"`,
                        isRead: false,
                        createdAt: Date.now(),
                    });
                }
            }
        }

        return comment;
    },
});

// Query to get all comments for an interview
export const getCommentsByInterview = query({
    args: {
        interviewId: v.id("interviews"),
    },
    handler: async (ctx, args) => {
        const comments = await ctx.db
            .query("comments")
            .withIndex("by_interview_id", (q) =>
                q.eq("interviewId", args.interviewId)
            )
            .collect();
        return comments;
    },
});

