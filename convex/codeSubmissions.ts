import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const saveCodeOnMeetingEnd = mutation({
    args: {
        interviewId: v.id("interviews"),
        code: v.string(),
        questionId: v.string(),
        language: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("User is not authenticated");

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
            .first();

        if (!user) throw new Error("User not found");

        return await ctx.db.insert("codeSubmissions", {
            interviewId: args.interviewId,
            candidateId: identity.subject,
            questionId: args.questionId,
            language: args.language,
            code: args.code,
            submittedAt: Date.now(),
            isFinalSubmission: true,
        });
    }
});

export const getCodeSubmissionsByInterview = query({
    args: { interviewId: v.id("interviews") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("User is not authenticated");

        return await ctx.db
            .query("codeSubmissions")
            .withIndex("by_interview_id", (q) => q.eq("interviewId", args.interviewId))
            .collect();
    }
});

export const getCodeSubmissionsByCandidate = query({
    args: { candidateId: v.string() },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("User is not authenticated");

        return await ctx.db
            .query("codeSubmissions")
            .withIndex("by_candidate_id", (q) => q.eq("candidateId", args.candidateId))
            .collect();
    }
});

// Mock function for test execution (replace with real implementation later)
export const runTestsOnCode = mutation({
    args: {
        code: v.string(),
        language: v.string(),
        questionId: v.string(),
        testCases: v.array(v.object({
            input: v.string(),
            expectedOutput: v.string(),
            description: v.optional(v.string()),
        })),
    },
    handler: async (ctx, args) => {
        // Mock implementation - replace with real code execution service
        const mockResults = {
            totalTests: args.testCases.length,
            passedTests: Math.floor(Math.random() * args.testCases.length),
            failedTests: 0,
            executionTime: Math.random() * 1000,
            memoryUsage: Math.random() * 10,
            status: "success" as const,
            testCases: args.testCases.map((testCase, index) => ({
                input: testCase.input,
                expectedOutput: testCase.expectedOutput,
                actualOutput: `Output ${index + 1}`,
                passed: Math.random() > 0.3,
                executionTime: Math.random() * 100,
                errorMessage: Math.random() > 0.8 ? "Runtime error" : undefined,
            })),
        };

        mockResults.failedTests = mockResults.totalTests - mockResults.passedTests;
        return mockResults;
    }
});

export const getTestCasesForQuestion = query({
    args: { questionId: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("testCaseTemplates")
            .withIndex("by_question_id", (q) => q.eq("questionId", args.questionId))
            .first();
    }
});

export const createTestCaseTemplate = mutation({
    args: {
        questionId: v.string(),
        testCases: v.array(v.object({
            input: v.string(),
            expectedOutput: v.string(),
            description: v.optional(v.string()),
            isHidden: v.boolean(),
        })),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("User is not authenticated");

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
            .first();

        if (!user || user.role !== "interviewer") {
            throw new Error("Only interviewers can create test case templates");
        }

        return await ctx.db.insert("testCaseTemplates", {
            questionId: args.questionId,
            testCases: args.testCases,
            createdAt: Date.now(),
            createdBy: identity.subject,
        });
    }
});

