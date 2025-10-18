import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getAllInterviews = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("User is not authenticated");

        const interviews = await ctx.db.query("interviews").collect();
        return interviews;
    }
});

export const getMyInterviews = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return [];

        // Get user's role
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
            .first();

        if (!user) return [];

        // If candidate, get interviews where they are the candidate
        if (user.role === "candidate") {
            const interviews = await ctx.db
                .query("interviews")
                .withIndex("by_candidate_id", (q) => q.eq("candidateId", identity.subject))
                .collect();
            return interviews;
        }

        // If interviewer, get all interviews where they are one of the interviewers
        const allInterviews = await ctx.db.query("interviews").collect();
        const myInterviews = allInterviews.filter((interview) =>
            interview.interviewerIds.includes(identity.subject)
        );

        return myInterviews;
    }
});

export const getInterviewByStreamCallId = query({
    args: { streamCallId: v.string() },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("User is not authenticated");

        const interview = await ctx.db
            .query("interviews")
            .withIndex("by_stream_call_id", (q) => q.eq("streamCallId", args.streamCallId))
            .first();

        return interview;
    }
});

export const getInterviewsByInterviewer = query({
    args: { interviewerId: v.string() },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("User is not authenticated");

        const allInterviews = await ctx.db.query("interviews").collect();
        const interviews = allInterviews.filter((interview) =>
            interview.interviewerIds.includes(args.interviewerId)
        );

        return interviews;
    }
});

export const createInterview = mutation({
    args: {
        title: v.string(),
        description: v.string(),
        startTime: v.number(),
        status: v.union(v.literal("upcoming"), v.literal("scheduled"), v.literal("ongoing"), v.literal("completed")),
        streamCallId: v.string(),
        candidateId: v.string(),
        interviewerIds: v.array(v.string()),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("User is not authenticated");

        // Verify user is an interviewer
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
            .first();

        if (!user || user.role !== "interviewer") {
            throw new Error("Only interviewers can create interviews");
        }

        // Ensure the creating interviewer is in the interviewerIds list
        const interviewerIds = args.interviewerIds.includes(identity.subject)
            ? args.interviewerIds
            : [...args.interviewerIds, identity.subject];

        const insertRes = await ctx.db.insert("interviews", {
            ...args,
            interviewerIds,
            result: "pending"
        });

        return insertRes;
    }
});

export const updateInterviewStatus = mutation({
    args: {
        id: v.id("interviews"),
        status: v.union(v.literal("upcoming"), v.literal("scheduled"), v.literal("ongoing"), v.literal("completed")),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("User is not authenticated");

        return await ctx.db.patch(args.id, {
            status: args.status,
            ...(args.status === "completed" ? { endTime: Date.now() } : {})
        });

    }
});

export const rescheduleInterview = mutation({
    args: {
        id: v.id("interviews"),
        startTime: v.number(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("User is not authenticated");

        return await ctx.db.patch(args.id, {
            startTime: args.startTime,
            status: "scheduled",
        });
    }
});

export const updateInterviewResult = mutation({
    args: {
        id: v.id("interviews"),
        result: v.union(v.literal("pass"), v.literal("fail"), v.literal("pending")),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("User is not authenticated");

        // Verify user is an interviewer
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
            .first();

        if (!user || user.role !== "interviewer") {
            throw new Error("Only interviewers can update interview results");
        }

        // Get the interview to verify the user is one of the interviewers
        const interview = await ctx.db.get(args.id);
        if (!interview) throw new Error("Interview not found");

        if (!interview.interviewerIds.includes(identity.subject)) {
            throw new Error("Only assigned interviewers can update results");
        }

        await ctx.db.patch(args.id, {
            result: args.result,
        });

        // Create a notification for the candidate if the interview has a candidate
        if (interview.candidateId && args.result !== "pending") {
            const resultText = args.result === "pass" ? "passed" : "failed";
            await ctx.db.insert("notifications", {
                userId: interview.candidateId,
                type: "review",
                interviewId: interview._id,
                message: `Your interview "${interview.title}" has been reviewed: ${resultText}`,
                isRead: false,
                createdAt: Date.now(),
            });
        }

        return interview._id;
    }
});

export const createOrGetInterview = mutation({
    args: {
        streamCallId: v.string(),
        title: v.optional(v.string()),
        description: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("User is not authenticated");

        // Get user's role
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
            .first();

        if (!user) throw new Error("User not found");

        // Check if interview already exists
        const existingInterview = await ctx.db
            .query("interviews")
            .withIndex("by_stream_call_id", (q) => q.eq("streamCallId", args.streamCallId))
            .first();

        if (existingInterview) {
            // If interview exists and user is a candidate, update candidateId if not already set
            if (user.role === "candidate" && !existingInterview.candidateId) {
                await ctx.db.patch(existingInterview._id, {
                    candidateId: identity.subject
                });
                return await ctx.db.get(existingInterview._id);
            }
            // If interview exists and user is an interviewer, add them to interviewerIds if not already there
            if (user.role === "interviewer" && !existingInterview.interviewerIds.includes(identity.subject)) {
                await ctx.db.patch(existingInterview._id, {
                    interviewerIds: [...existingInterview.interviewerIds, identity.subject]
                });
                return await ctx.db.get(existingInterview._id);
            }
            return existingInterview;
        }

        // Only interviewers can create new interviews
        if (user.role !== "interviewer") {
            throw new Error("Only interviewers can start new interview sessions");
        }

        // Create new interview if it doesn't exist (interviewer starting a new session)
        const insertRes = await ctx.db.insert("interviews", {
            title: args.title || "Interview Session",
            description: args.description || "Interview session started via meeting link",
            startTime: Date.now(),
            status: "ongoing",
            streamCallId: args.streamCallId,
            candidateId: undefined,
            interviewerIds: [identity.subject],
            result: "pending"
        });

        const newInterview = await ctx.db.get(insertRes);
        return newInterview;
    }
});
