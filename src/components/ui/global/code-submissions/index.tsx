"use client";

import { useQuery } from "convex/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";

interface CodeSubmissionsProps {
    interviewId: Id<"interviews">;
    hideTitle?: boolean;
}

function CodeSubmissions({ interviewId, hideTitle = false }: CodeSubmissionsProps) {
    const submissions = useQuery(api.codeSubmissions.getCodeSubmissionsByInterview, {
        interviewId
    });

    if (submissions === undefined) {
        return (
            <div className="space-y-4">
                {!hideTitle && <h3 className="text-lg font-semibold">Code Submissions</h3>}
                <div className="space-y-4">
                    {[1, 2].map((i) => (
                        <Card key={i}>
                            <CardHeader>
                                <Skeleton className="h-6 w-3/4" />
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-32 w-full" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    if (!submissions || submissions.length === 0) {
        return (
            <div className="space-y-4">
                {!hideTitle && <h3 className="text-lg font-semibold">Code Submissions</h3>}
                <Card>
                    <CardContent className="pt-6">
                        <p className="text-center text-muted-foreground">
                            No code submissions yet for this interview.
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {!hideTitle && <h3 className="text-lg font-semibold">Code Submissions</h3>}
            <div className="space-y-4">
                {submissions.map((submission) => (
                    <Card key={submission._id}>
                        <CardHeader>
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                                <div className="flex-1">
                                    <CardTitle className="text-base">
                                        Question: {submission.questionId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                                    </CardTitle>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Submitted: {new Date(submission.submittedAt).toLocaleString()}
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <Badge variant="outline">
                                        {submission.language}
                                    </Badge>
                                    {submission.testResults && (
                                        <Badge
                                            variant={submission.testResults.passedTests === submission.testResults.totalTests ? "default" : "destructive"}
                                        >
                                            {submission.testResults.passedTests}/{submission.testResults.totalTests} tests passed
                                        </Badge>
                                    )}
                                    {submission.isFinalSubmission && (
                                        <Badge variant="secondary">
                                            Final Submission
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Code Display */}
                            <div>
                                <h4 className="text-sm font-semibold mb-2">Code:</h4>
                                <ScrollArea className="h-[300px] w-full rounded-md border">
                                    <pre className="bg-muted/50 p-4 text-sm font-mono">
                                        {submission.code}
                                    </pre>
                                </ScrollArea>
                            </div>

                            {/* Test Results Summary */}
                            {submission.testResults && (
                                <div>
                                    <h4 className="font-semibold mb-2">Test Results</h4>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                                        <div className="flex flex-col">
                                            <span className="text-muted-foreground">Status</span>
                                            <span className={`font-medium ${submission.testResults.status === "success"
                                                ? "text-green-600 dark:text-green-400"
                                                : "text-red-600 dark:text-red-400"
                                                }`}>
                                                {submission.testResults.status.toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-muted-foreground">Passed</span>
                                            <span className="text-green-600 dark:text-green-400 font-medium">
                                                {submission.testResults.passedTests}
                                            </span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-muted-foreground">Failed</span>
                                            <span className="text-red-600 dark:text-red-400 font-medium">
                                                {submission.testResults.failedTests}
                                            </span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-muted-foreground">Total</span>
                                            <span className="font-medium">
                                                {submission.testResults.totalTests}
                                            </span>
                                        </div>
                                    </div>

                                    {submission.testResults.executionTime && (
                                        <div className="mt-2 text-sm text-muted-foreground">
                                            Execution Time: {submission.testResults.executionTime.toFixed(2)}ms
                                        </div>
                                    )}

                                    {submission.testResults.errorMessage && (
                                        <div className="mt-2 p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded">
                                            <span className="text-sm text-red-600 dark:text-red-400">
                                                Error: {submission.testResults.errorMessage}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Individual Test Cases */}
                            {submission.testCases && submission.testCases.length > 0 && (
                                <div>
                                    <h4 className="font-semibold mb-2">Test Cases Details</h4>
                                    <div className="space-y-2">
                                        {submission.testCases.map((testCase, index) => (
                                            <div
                                                key={index}
                                                className={`p-3 rounded border text-sm ${testCase.passed
                                                    ? 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800'
                                                    : 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800'
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="font-medium">Test Case {index + 1}</span>
                                                    <span className={`text-xs font-semibold ${testCase.passed
                                                        ? 'text-green-600 dark:text-green-400'
                                                        : 'text-red-600 dark:text-red-400'
                                                        }`}>
                                                        {testCase.passed ? '✓ PASSED' : '✗ FAILED'}
                                                    </span>
                                                </div>

                                                <div className="space-y-1">
                                                    <div>
                                                        <span className="font-medium text-xs">Input: </span>
                                                        <code className="text-xs">{testCase.input}</code>
                                                    </div>
                                                    <div>
                                                        <span className="font-medium text-xs">Expected: </span>
                                                        <code className="text-xs">{testCase.expectedOutput}</code>
                                                    </div>
                                                    {testCase.actualOutput && (
                                                        <div>
                                                            <span className="font-medium text-xs">Actual: </span>
                                                            <code className="text-xs">{testCase.actualOutput}</code>
                                                        </div>
                                                    )}
                                                    {testCase.errorMessage && (
                                                        <div className="mt-1">
                                                            <span className="font-medium text-xs text-red-600 dark:text-red-400">
                                                                Error: {testCase.errorMessage}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

export default CodeSubmissions;

