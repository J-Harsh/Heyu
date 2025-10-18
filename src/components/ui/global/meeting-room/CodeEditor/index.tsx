import { CODING_QUESTIONS, LANGUAGES } from "@/constants";
import { useState, useImperativeHandle, forwardRef } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HiExclamationCircle, HiBookOpen, HiLightBulb } from "react-icons/hi2";
import { SiJavascript, SiPython, SiGo, SiCplusplus } from "react-icons/si";
import { TbBrandCSharp } from "react-icons/tb";
import { FaJava } from "react-icons/fa6";
import Editor from "@monaco-editor/react";
import { CodeState } from "@/types/code";

interface CodeEditorProps {
    layout?: "vertical" | "horizontal";
}

export interface CodeEditorRef {
    getCurrentCodeState: () => CodeState | null;
}

const CodeEditor = forwardRef<CodeEditorRef, CodeEditorProps>(({ layout = "vertical" }, ref) => {
    const [selectedQuestion, setSelectedQuestion] = useState(CODING_QUESTIONS[0]);
    const [language, setLanguage] = useState<"javascript" | "python" | "java" | "go" | "cpp" | "csharp">(LANGUAGES[0].id);
    const [code, setCode] = useState(selectedQuestion.starterCode[language]);

    // Expose methods to parent component
    useImperativeHandle(ref, () => ({
        getCurrentCodeState: () => {
            if (!code.trim()) return null;
            return {
                code,
                questionId: selectedQuestion.id,
                language,
            };
        }
    }));

    const handleQuestionChange = (questionId: string) => {
        const question = CODING_QUESTIONS.find((q) => q.id === questionId)!;
        setSelectedQuestion(question);
        setCode(question.starterCode[language]);
    };

    const handleLanguageChange = (newLanguage: "javascript" | "python" | "java" | "go" | "cpp" | "csharp") => {
        setLanguage(newLanguage);
        setCode(selectedQuestion.starterCode[newLanguage]);
    };

    return (
        <ResizablePanelGroup direction={layout} className="min-h-[calc-100vh-4rem-1px]">
            {/* QUESTION SECTION */}
            <ResizablePanel defaultSize={layout === "horizontal" ? 40 : undefined} minSize={layout === "horizontal" ? 25 : undefined}>
                <ScrollArea className="h-full">
                    <div className="p-6">
                        <div className="max-w-4xl mx-auto space-y-6">
                            {/* HEADER */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <h2 className="text-2xl font-semibold tracking-tight">
                                            {selectedQuestion.title}
                                        </h2>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Choose your language and solve the problem
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Select value={selectedQuestion.id} onValueChange={handleQuestionChange}>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Select question" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {CODING_QUESTIONS.map((q) => (
                                                <SelectItem key={q.id} value={q.id}>
                                                    {q.title}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    <Select value={language} onValueChange={handleLanguageChange}>
                                        <SelectTrigger className="w-[150px]">
                                            {/* SELECT VALUE */}
                                            <SelectValue>
                                                <div className="flex items-center gap-2">
                                                    {language === "javascript" && <SiJavascript className="w-4 h-4 text-yellow-400" />}
                                                    {language === "python" && <SiPython className="w-4 h-4 text-blue-500" />}
                                                    {language === "java" && <FaJava className="w-4 h-4 text-red-500" />}
                                                    {language === "go" && <SiGo className="w-4 h-4 text-cyan-400" />}
                                                    {language === "cpp" && <SiCplusplus className="w-4 h-4 text-blue-600" />}
                                                    {language === "csharp" && <TbBrandCSharp className="w-4 h-4 text-purple-500" />}
                                                    {LANGUAGES.find((l) => l.id === language)?.name}
                                                </div>
                                            </SelectValue>
                                        </SelectTrigger>
                                        {/* SELECT CONTENT */}
                                        <SelectContent>
                                            {LANGUAGES.map((lang) => (
                                                <SelectItem key={lang.id} value={lang.id}>
                                                    <div className="flex items-center gap-2">
                                                        {lang.id === "javascript" && <SiJavascript className="w-4 h-4 text-yellow-400" />}
                                                        {lang.id === "python" && <SiPython className="w-4 h-4 text-blue-500" />}
                                                        {lang.id === "java" && <FaJava className="w-4 h-4 text-red-500" />}
                                                        {lang.id === "go" && <SiGo className="w-4 h-4 text-cyan-400" />}
                                                        {lang.id === "cpp" && <SiCplusplus className="w-4 h-4 text-blue-600" />}
                                                        {lang.id === "csharp" && <TbBrandCSharp className="w-4 h-4 text-purple-500" />}
                                                        {lang.name}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* PROBLEM DESC. */}
                            <Card>
                                <CardHeader className="flex flex-row items-center gap-2">
                                    <HiBookOpen className="h-5 w-5 text-primary/80" />
                                    <CardTitle>Problem Description</CardTitle>
                                </CardHeader>
                                <CardContent className="text-sm leading-relaxed">
                                    <div className="prose prose-sm dark:prose-invert max-w-none">
                                        <p className="whitespace-pre-line">{selectedQuestion.description}</p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* PROBLEM EXAMPLES */}
                            <Card>
                                <CardHeader className="flex flex-row items-center gap-2">
                                    <HiLightBulb className="h-5 w-5 text-yellow-500" />
                                    <CardTitle>Examples</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ScrollArea className="h-full w-full rounded-md border">
                                        <div className="p-4 space-y-4">
                                            {selectedQuestion.examples.map((example, index) => (
                                                <div key={index} className="space-y-2">
                                                    <p className="font-medium text-sm">Example {index + 1}:</p>
                                                    <ScrollArea className="h-full w-full rounded-md">
                                                        <pre className="bg-muted/50 p-3 rounded-lg text-sm font-mono">
                                                            <div>Input: {example.input}</div>
                                                            <div>Output: {example.output}</div>
                                                            {example.explanation && (
                                                                <div className="pt-2 text-muted-foreground">
                                                                    Explanation: {example.explanation}
                                                                </div>
                                                            )}
                                                        </pre>
                                                        <ScrollBar orientation="horizontal" />
                                                    </ScrollArea>
                                                </div>
                                            ))}
                                        </div>
                                        <ScrollBar />
                                    </ScrollArea>
                                </CardContent>
                            </Card>

                            {/* CONSTRAINTS */}
                            {selectedQuestion.constraints && (
                                <Card>
                                    <CardHeader className="flex flex-row items-center gap-2">
                                        <HiExclamationCircle className="h-5 w-5 text-blue-500" />
                                        <CardTitle>Constraints</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="list-disc list-inside space-y-1.5 text-sm marker:text-muted-foreground">
                                            {selectedQuestion.constraints.map((constraint, index) => (
                                                <li key={index} className="text-muted-foreground">
                                                    {constraint}
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                    <ScrollBar />
                </ScrollArea>
            </ResizablePanel>

            <ResizableHandle withHandle />

            {/* CODE EDITOR */}
            <ResizablePanel defaultSize={layout === "horizontal" ? 60 : 60} maxSize={100} minSize={layout === "horizontal" ? 30 : undefined}>
                <div className="h-full relative">
                    <Editor
                        height={"100%"}
                        defaultLanguage={language}
                        language={language}
                        theme="vs-dark"
                        value={code}
                        onChange={(value) => setCode(value || "")}
                        options={{
                            minimap: { enabled: false },
                            fontSize: 14,
                            lineNumbers: "on",
                            scrollBeyondLastLine: false,
                            automaticLayout: true,
                            padding: { top: 16, bottom: 16 },
                            wordWrap: "on",
                            wrappingIndent: "indent",
                        }}
                    />
                </div>
            </ResizablePanel>
        </ResizablePanelGroup>
    );
});

CodeEditor.displayName = "CodeEditor";

export default CodeEditor;