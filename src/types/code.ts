export interface CodeState {
    code: string;
    questionId: string;
    language: string;
}

export interface TestResults {
    passedTests: number;
    failedTests: number;
    totalTests: number;
    testCases: Array<{
        input: string;
        expectedOutput: string;
        actualOutput: string;
        passed: boolean;
        errorMessage?: string;
    }>;
}

