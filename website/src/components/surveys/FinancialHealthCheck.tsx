"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/base";
import { Button } from "@/components/ui/base";
import { Label } from "@/components/ui/base";
import { ArrowLeft, ArrowRight, CheckCircle2, AlertTriangle, XCircle, Award } from "lucide-react";
import { FINANCIAL_HEALTH_DATA } from "@/lib/surveys/data/financial-health-check";
import { cn } from "@/components/ui/base";
import { CalculatorRecommendations } from "@/components/calculators/CalculatorRecommendations";

interface QuestionResponse {
    questionId: number;
    optionIndex: number;
    optionText: string;
    scoreColor: string;
    hint: string;
}

export default function FinancialHealthCheck() {
    const [currentStep, setCurrentStep] = useState(0);
    const [responses, setResponses] = useState<Record<number, QuestionResponse>>({});
    const [history, setHistory] = useState<number[]>([]);

    const questions = FINANCIAL_HEALTH_DATA.questions;

    const getNextQuestionId = (currentQId: number, currentOptionIndex: number) => {
        if (currentQId === 1 && currentOptionIndex === 2) return 3;
        if (currentQId === 3 && currentOptionIndex === 1) return 5;
        return currentQId + 1;
    };

    const handleStart = () => {
        setCurrentStep(1);
        setHistory([1]);
    };

    const handleNext = () => {
        const currentQId = history[history.length - 1];
        const response = responses[currentQId];

        if (!response) {
            // Toast or alert usually here
            return;
        }

        if (currentQId >= questions.length || (currentQId === 14)) {
            finishSurvey();
        } else {
            const nextId = getNextQuestionId(currentQId, response.optionIndex);
            if (nextId > 14) {
                finishSurvey();
                return;
            }
            setHistory([...history, nextId]);
        }
    };

    const handleBack = () => {
        if (history.length <= 1) {
            setCurrentStep(0);
            setHistory([]);
        } else {
            const newHistory = [...history];
            newHistory.pop();
            setHistory(newHistory);
        }
    };

    const finishSurvey = () => {
        setCurrentStep(99);
    };

    const currentQId = history.length > 0 ? history[history.length - 1] : 1;
    const currentQuestion = questions.find(q => q.id === currentQId);

    const handleOptionSelect = (idx: number, val: string) => {
        if (!currentQuestion) return;
        const color = currentQuestion.optionsColor[idx];
        const hint = (idx > 0 && currentQuestion.optionsHint.length >= idx)
            ? currentQuestion.optionsHint[idx - 1]
            : "";

        setResponses({
            ...responses,
            [currentQId]: {
                questionId: currentQId,
                optionIndex: idx,
                optionText: val,
                scoreColor: color,
                hint: hint
            }
        });
    };

    const calculateScore = () => {
        let red = 0, orange = 0, green = 0;
        Object.values(responses).forEach((r) => {
            if (r.scoreColor === "#EC1212") red++;
            else if (r.scoreColor === "#907326") orange++;
            else if (r.scoreColor === "#008A29") green++;
        });

        // let category = "GREEN";
        // if (red > 0) category = "RED";
        // else if (orange > 2) category = "ORANGE";
        // Assuming Logic matches frontend's

        return { score: green * 10 - red * 10, red, orange, green };
    };

    // --- RENDER: INTRO ---
    if (currentStep === 0) {
        return (
            <div className="max-w-4xl mx-auto">
                <Card className="max-w-2xl mx-auto border-t-4 border-t-indigo-600 shadow-lg">
                    <CardHeader className="text-center pb-2">
                        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent">Financial Health Check</CardTitle>
                        <CardDescription className="text-lg mt-2">Discover your financial fitness in just 5 minutes.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                            <div className="p-4 bg-green-50 rounded-xl space-y-2">
                                <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto" />
                                <h3 className="font-semibold text-green-800">Assess</h3>
                                <p className="text-xs text-green-700">Check if you are on the right track.</p>
                            </div>
                            <div className="p-4 bg-orange-50 rounded-xl space-y-2">
                                <AlertTriangle className="w-8 h-8 text-orange-600 mx-auto" />
                                <h3 className="font-semibold text-orange-800">Identify</h3>
                                <p className="text-xs text-orange-700">Find gaps in your financial plan.</p>
                            </div>
                            <div className="p-4 bg-blue-50 rounded-xl space-y-2">
                                <Award className="w-8 h-8 text-blue-600 mx-auto" />
                                <h3 className="font-semibold text-blue-800">Improve</h3>
                                <p className="text-xs text-blue-700">Get tools to fix the issues.</p>
                            </div>
                        </div>
                        <div className="mt-8 bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                            <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-1">Powered by Guidelines from</p>
                            <p className="font-medium text-gray-900 text-sm flex items-center justify-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                                {FINANCIAL_HEALTH_DATA.meta.sourceCredit}
                            </p>
                        </div>
                    </CardContent>
                    <CardFooter className="justify-center pb-8">
                        <Button size="lg" onClick={handleStart} className="w-full md:w-auto px-12 text-lg h-12 rounded-full shadow-lg hover:shadow-xl transition-all">Start Health Check</Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    // --- RENDER: REPORT ---
    if (currentStep === 99) {
        const { green, red, orange } = calculateScore();

        return (
            <div className="space-y-8 max-w-4xl mx-auto">
                <Card className="border-t-4 border-t-indigo-600 shadow-lg animate-in fade-in zoom-in duration-300">
                    <CardHeader className="text-center border-b bg-slate-50 relative">
                        <CardTitle className="text-2xl">Financial Health Report</CardTitle>
                        <CardDescription>Consolidated Summary</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 space-y-8">
                        {/* Summary Badges */}
                        <div className="flex flex-wrap justify-center gap-4">
                            <div className="px-6 py-2 rounded-full bg-green-100 text-green-800 font-bold border border-green-200 flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5" /> Good: {green}
                            </div>
                            <div className="px-6 py-2 rounded-full bg-orange-100 text-orange-800 font-bold border border-orange-200 flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5" /> Improve: {orange}
                            </div>
                            <div className="px-6 py-2 rounded-full bg-red-100 text-red-800 font-bold border border-red-200 flex items-center gap-2">
                                <XCircle className="w-5 h-5" /> Concern: {red}
                            </div>
                        </div>

                        {/* Detailed List */}
                        <div className="space-y-6">
                            {red > 0 && (
                                <div className="space-y-3">
                                    <h3 className="text-lg font-bold text-red-600 flex items-center gap-2"><XCircle className="w-5 h-5" /> Areas of Concern</h3>
                                    <ul className="space-y-2">
                                        {Object.values(responses).filter(r => r.scoreColor === "#EC1212" && r.hint).map(r => (
                                            <li key={r.questionId} className="p-3 bg-red-50 text-red-900 rounded-lg text-sm border-l-4 border-red-500 shadow-sm">
                                                <div dangerouslySetInnerHTML={{ __html: r.hint }} className="[&>a]:underline [&>a]:font-semibold" />
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {orange > 0 && (
                                <div className="space-y-3">
                                    <h3 className="text-lg font-bold text-orange-600 flex items-center gap-2"><AlertTriangle className="w-5 h-5" /> Areas to Improve</h3>
                                    <ul className="space-y-2">
                                        {Object.values(responses).filter(r => r.scoreColor === "#907326" && r.hint).map(r => (
                                            <li key={r.questionId} className="p-3 bg-orange-50 text-orange-900 rounded-lg text-sm border-l-4 border-orange-500 shadow-sm">
                                                <div dangerouslySetInnerHTML={{ __html: r.hint }} className="[&>a]:underline [&>a]:font-semibold" />
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {green > 0 && (
                                <div className="space-y-3">
                                    <h3 className="text-lg font-bold text-green-600 flex items-center gap-2"><CheckCircle2 className="w-5 h-5" /> Good Health</h3>
                                    <ul className="space-y-2">
                                        {Object.values(responses).filter(r => r.scoreColor === "#008A29" && r.hint).map(r => (
                                            <li key={r.questionId} className="p-3 bg-green-50 text-green-900 rounded-lg text-sm border-l-4 border-green-500 shadow-sm">
                                                <div dangerouslySetInnerHTML={{ __html: r.hint }} className="[&>a]:underline [&>a]:font-semibold" />
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </CardContent>
                    <CardFooter className="justify-center bg-slate-50 p-6">
                        <Button variant="outline" onClick={() => setCurrentStep(0)} className="mr-4">Reset</Button>
                    </CardFooter>
                </Card>

                {/* Recommendations */}
                <CalculatorRecommendations currentToolSlug="financial-health-check" category="Planning" />
            </div>
        );
    }

    // --- RENDER: QUESTIONS ---
    if (!currentQuestion) return null;

    const currentResponse = responses[currentQId];

    return (
        <div className="max-w-xl mx-auto">
            <Card className="max-w-2xl mx-auto border-t-4 border-t-indigo-600 shadow-lg min-h-[500px] flex flex-col">
                <CardHeader>
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-muted-foreground">{history.length} / 14</span>
                            <span className="text-xs px-2 py-1 bg-slate-100 rounded ml-2">{Math.round((history.length / 14) * 100)}% Completed</span>
                        </div>
                        <CardTitle className="text-xl leading-relaxed">{currentQuestion.question}</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="flex-1 pt-6 space-y-4">
                    {currentQuestion.options.map((opt, idx) => {
                        if (idx === 0) return null; // Skip "Select"
                        const isSelected = currentResponse?.optionIndex === idx;
                        return (
                            <div key={idx}
                                onClick={() => handleOptionSelect(idx, opt)}
                                className={cn(
                                    "flex items-center space-x-3 border p-4 rounded-lg transition-all cursor-pointer hover:bg-slate-50",
                                    isSelected ? "border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600" : "border-gray-200"
                                )}>
                                <div className={cn("w-4 h-4 rounded-full border flex items-center justify-center", isSelected ? "border-indigo-600" : "border-gray-300")}>
                                    {isSelected && <div className="w-2 h-2 rounded-full bg-indigo-600" />}
                                </div>
                                <Label className="flex-1 cursor-pointer font-medium text-gray-700">{opt}</Label>
                            </div>
                        )
                    })}

                    {/* Live Hint Feedback */}
                    {currentResponse?.hint && (
                        <div className={cn("mt-6 p-4 rounded-lg flex gap-3 text-sm animate-in fade-in slide-in-from-top-2",
                            currentResponse.scoreColor === "#008A29" ? "bg-green-50 text-green-800 border border-green-200" :
                                currentResponse.scoreColor === "#907326" ? "bg-orange-50 text-orange-800 border border-orange-200" :
                                    "bg-red-50 text-red-800 border border-red-200"
                        )}>
                            {currentResponse.scoreColor === "#008A29" ? <CheckCircle2 className="w-5 h-5 shrink-0" /> :
                                currentResponse.scoreColor === "#907326" ? <AlertTriangle className="w-5 h-5 shrink-0" /> : <XCircle className="w-5 h-5 shrink-0" />}
                            <div dangerouslySetInnerHTML={{ __html: currentResponse.hint }} className="[&>a]:underline [&>a]:font-semibold" />
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex justify-between border-t p-6 bg-slate-50">
                    <Button variant="ghost" onClick={handleBack} disabled={currentStep === 1 && history.length === 1}>
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back
                    </Button>
                    <Button onClick={handleNext} disabled={!currentResponse}>
                        {history.length >= 14 ? "Finish" : "Next"} <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
