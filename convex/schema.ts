import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    users: defineTable({
        name: v.string(),
        email: v.string(),
        image: v.optional(v.string()),
        role: v.optional(v.union(v.literal("candidate"), v.literal("interviewer"))),
        createdAt: v.number(),
        clerkId: v.string(),
    }).index("by_clerk_id", ["clerkId"]),


    interviews: defineTable({
        title: v.string(),
        description: v.string(),
        startTime: v.number(),
        endTime: v.optional(v.number()),
        status: v.union(v.literal("upcoming"), v.literal("scheduled"), v.literal("ongoing"), v.literal("completed")),
        streamCallId: v.string(),
        candidateId: v.optional(v.string()),
        interviewerIds: v.array(v.string()),
        result: v.optional(v.union(v.literal("pass"), v.literal("fail"), v.literal("pending")))
    })
        .index("by_candidate_id", ["candidateId"])
        .index("by_stream_call_id", ["streamCallId"]),


    comments: defineTable({
        content: v.string(),
        rating: v.number(),
        commenterId: v.string(), // clerkId of the person making the comment (interviewer or candidate)
        commenterRole: v.union(v.literal("candidate"), v.literal("interviewer")),
        interviewId: v.string()
    }).index("by_interview_id", ["interviewId"]),

    notifications: defineTable({
        userId: v.string(), // clerkId of the user receiving the notification
        type: v.union(v.literal("comment"), v.literal("review")),
        interviewId: v.id("interviews"),
        message: v.string(),
        isRead: v.boolean(),
        createdAt: v.number(),
    })
        .index("by_user_id", ["userId"])
        .index("by_user_and_read", ["userId", "isRead"]),

    codeSubmissions: defineTable({
        interviewId: v.id("interviews"),
        candidateId: v.string(),
        questionId: v.string(), // e.g., "two-sum", "reverse-string"
        language: v.string(), // e.g., "javascript", "python"
        code: v.string(), // The actual code written
        submittedAt: v.number(),
        isFinalSubmission: v.boolean(),
        // Test execution results
        testResults: v.optional(v.object({
            totalTests: v.number(),
            passedTests: v.number(),
            failedTests: v.number(),
            executionTime: v.optional(v.number()), // in milliseconds
            memoryUsage: v.optional(v.number()), // in MB
            status: v.union(v.literal("success"), v.literal("error"), v.literal("timeout")),
            errorMessage: v.optional(v.string()),
        })),
        // Individual test case results
        testCases: v.optional(v.array(v.object({
            input: v.string(),
            expectedOutput: v.string(),
            actualOutput: v.optional(v.string()),
            passed: v.boolean(),
            executionTime: v.optional(v.number()),
            errorMessage: v.optional(v.string()),
        }))),
    })
        .index("by_interview_id", ["interviewId"])
        .index("by_candidate_id", ["candidateId"])
        .index("by_interview_and_question", ["interviewId", "questionId"]),

    // Separate table for test case templates (reusable across interviews)
    testCaseTemplates: defineTable({
        questionId: v.string(),
        testCases: v.array(v.object({
            input: v.string(),
            expectedOutput: v.string(),
            description: v.optional(v.string()),
            isHidden: v.boolean(), // For hidden test cases
        })),
        createdAt: v.number(),
        createdBy: v.string(), // interviewer who created these test cases
    })
        .index("by_question_id", ["questionId"]),
}
);
