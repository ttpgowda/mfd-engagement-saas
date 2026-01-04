"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/base";
import { Button } from "@/components/ui/base";
import { Label } from "@/components/ui/base";
import { ArrowLeft, ArrowRight, CheckCircle2, AlertTriangle, AlertCircle, TrendingUp, Target } from "lucide-react";
import { GOAL_READINESS_DATA, type GoalReadinessData } from "@/lib/surveys/data/goal-readiness";
import { cn } from "@/components/ui/base";
import { CalculatorRecommendations } from "@/components/calculators/CalculatorRecommendations";

interface QuestionResponse {
    questionId: number;
    optionIndex: number; // 0-based index in the original options array
    optionText: string;
    score: number;
    weight: number;
    maxOriginalScore: number;
}

export default function GoalReadiness() {
    const [currentStep, setCurrentStep] = useState(0); // 0=Intro, 1..N=Questions, 99=Result
    const [responses, setResponses] = useState<Record<number, QuestionResponse>>({});

    // Combine main questions and follow-ups into one linear flow or handle separately. 
    // For simplicity, we'll concatenate them for the wizard flow.
    const allQuestions = [...GOAL_READINESS_DATA.questions];
    // Note: Follow-ups in the data file are slightly separate logic-wise, but for the UI wizard we often want a seamless flow.
    // However, the original logic might have been conditional. 
    // Looking at the data structure, they are just listed as 'followUps' but no explicit condition is in the JSON.
    // We will append them to the end for a comprehensive check.
    const fullQuestionSet = [...allQuestions, ...GOAL_READINESS_DATA.followUps];

    const currentQuestionIndex = currentStep - 1;
    const currentQuestion = fullQuestionSet[currentQuestionIndex];
    const totalQuestions = fullQuestionSet.length;

    const handleStart = () => {
        setCurrentStep(1);
    };

    const handleOptionSelect = (idx: number, val: string) => {
        if (!currentQuestion) return;

        // Data is 1-indexed for "Select", so real options start at index 1.
        // The `scores` array matches the options array length (including "Select" usually, or aligned).
        // Let's verify data integrity:
        // Options: ["Select", "A", "B"] -> Length 3
        // Scores: [0, 4, 0] -> Length 3

        const score = currentQuestion.scores?.[idx] ?? 0;

        // Find max possible score for this question to normalize later if needed, 
        // though the formula usually uses the weighted sum specific to the choice.
        // Actually, for "weighting" to work correctly as a percentage, we need to know the max potential score.
        // Max score for most questions is 4.
        const maxScore = 4;

        setResponses({
            ...responses,
            [currentQuestion.id]: {
                questionId: currentQuestion.id,
                optionIndex: idx,
                optionText: val,
                score: score,
                weight: currentQuestion.weight,
                maxOriginalScore: maxScore
            }
        });
    };

    const handleNext = () => {
        if (currentStep < totalQuestions) {
            setCurrentStep(currentStep + 1);
        } else {
            finishSurvey();
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        } else {
            setCurrentStep(0);
        }
    };

    const finishSurvey = () => {
        setCurrentStep(99);
    };

    const calculateReadiness = () => {
        let totalWeightedScore = 0;
        let totalMaxWeightedScore = 0;

        Object.values(responses).forEach(r => {
            totalWeightedScore += r.score * r.weight;
            totalMaxWeightedScore += r.maxOriginalScore * r.weight;
        });

        // Avoid division by zero
        if (totalMaxWeightedScore === 0) return { percentage: 0, status: "Not Ready" };

        const percentage = Math.round((totalWeightedScore / totalMaxWeightedScore) * 100);

        let status = "Not Ready";
        let color = "text-red-600";
        let bgColor = "bg-red-50";
        let borderColor = "border-red-200";
        let note = "";
        let actions: string[] = [];

        const thresholds = GOAL_READINESS_DATA.scoring.thresholds;

        if (percentage < thresholds.notReady.max) {
            status = thresholds.notReady.label;
            note = thresholds.notReady.note;
            actions = GOAL_READINESS_DATA.scoring.recommendedActions.notReady || [];
            color = "text-red-600";
            bgColor = "bg-red-50";
            borderColor = "border-red-200";
        } else if (percentage <= thresholds.partiallyReady.max) {
            status = thresholds.partiallyReady.label;
            note = thresholds.partiallyReady.note;
            actions = GOAL_READINESS_DATA.scoring.recommendedActions.partiallyReady || [];
            color = "text-orange-600";
            bgColor = "bg-orange-50";
            borderColor = "border-orange-200";
        } else {
            status = thresholds.ready.label;
            note = thresholds.ready.note;
            actions = GOAL_READINESS_DATA.scoring.recommendedActions.ready || [];
            color = "text-green-600";
            bgColor = "bg-green-50";
            borderColor = "border-green-200";
        }

        return { percentage, status, note, actions, color, bgColor, borderColor };
    };

    // --- RENDER: INTRO ---
    if (currentStep === 0) {
        return (
            <div className="max-w-4xl mx-auto">
                <Card className="max-w-2xl mx-auto border-t-4 border-t-indigo-600 shadow-lg">
                    <CardHeader className="text-center pb-2">
                        <div className="mx-auto w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                            <Target className="w-6 h-6 text-indigo-600" />
                        </div>
                        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent">Goal Readiness Score</CardTitle>
                        <CardDescription className="text-lg mt-2">Evaluate how prepared you are to achieve your financial dreams.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-4 text-center">
                        <p className="text-muted-foreground">This assessment looks at your clarity, resources, stability, and behaviors to give you a readiness score.</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left p-4 bg-slate-50 rounded-xl">
                            <div className="flex gap-3">
                                <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                                <span className="text-sm text-gray-700">Validate your goal timeline & cost</span>
                            </div>
                            <div className="flex gap-3">
                                <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                                <span className="text-sm text-gray-700">Check fallback options</span>
                            </div>
                            <div className="flex gap-3">
                                <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                                <span className="text-sm text-gray-700">Assess savings discipline</span>
                            </div>
                            <div className="flex gap-3">
                                <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                                <span className="text-sm text-gray-700">Get tailored recommendations</span>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="justify-center pb-8">
                        <Button size="lg" onClick={handleStart} className="px-12 text-lg h-12 rounded-full shadow-lg hover:shadow-xl transition-all">Start Assessment</Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    // --- RENDER: REPORT ---
    if (currentStep === 99) {
        const { percentage, status, note, actions, color, bgColor, borderColor } = calculateReadiness();

        return (
            <div className="space-y-8 max-w-4xl mx-auto">
                <Card className="border-t-4 border-t-indigo-600 shadow-lg animate-in fade-in zoom-in duration-300">
                    <CardHeader className="text-center border-b bg-slate-50 relative pb-10">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-sm border">
                            <Target className="w-8 h-8 text-indigo-600" />
                        </div>
                        <div className="mt-6">
                            <CardDescription className="uppercase tracking-wider text-xs font-bold text-gray-500 mb-2"> Your Readiness Score</CardDescription>
                            <div className="flex items-baseline justify-center gap-2">
                                <span className="text-6xl font-black text-gray-900">{percentage}%</span>
                            </div>
                            <div className={cn("inline-flex items-center gap-2 px-4 py-1 rounded-full text-sm font-bold mt-4", bgColor, color, "border", borderColor)}>
                                {status === "Ready" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                                {status}
                            </div>
                            <p className="text-gray-600 mt-4 max-w-lg mx-auto">{note}</p>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8">
                        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <TrendingUp className="w-6 h-6 text-indigo-600" /> Recommended Actions
                        </h3>
                        <div className="grid gap-4">
                            {actions.map((action, i) => (
                                <div key={i} className="flex items-start gap-3 p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:border-indigo-100 transition-colors">
                                    <div className="w-6 h-6 rounded-full bg-indigo-50 flex items-center justify-center shrink-0 mt-0.5">
                                        <span className="text-xs font-bold text-indigo-600">{i + 1}</span>
                                    </div>
                                    <p className="text-gray-700 leading-relaxed">{action}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                    <CardFooter className="justify-center bg-slate-50 p-6">
                        <Button variant="outline" onClick={() => setCurrentStep(0)} className="mr-4">Reset</Button>
                        <Button className="bg-indigo-600 hover:bg-indigo-700">Save My Plan</Button>
                    </CardFooter>
                </Card>

                {/* Recommendations */}
                <CalculatorRecommendations currentToolSlug="goal-readiness" category="Planning" />
            </div>
        );
    }

    // --- RENDER: QUESTIONS ---
    const currentResponse = responses[currentQuestion.id];

    return (
        <div className="max-w-xl mx-auto">
            <Card className="max-w-2xl mx-auto border-t-4 border-t-indigo-600 shadow-lg min-h-[500px] flex flex-col">
                <CardHeader>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-muted-foreground">Step {currentStep} of {totalQuestions}</span>
                        <div className="h-2 w-24 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-600 transition-all duration-300" style={{ width: `${(currentStep / totalQuestions) * 100}%` }} />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="flex-1 space-y-6 pt-2">
                    <h2 className="text-xl font-semibold leading-relaxed text-gray-900">{currentQuestion.question}</h2>

                    <div className="space-y-3">
                        {currentQuestion.options.map((opt, idx) => {
                            if (idx === 0) return null; // Skip "Select" placeholder
                            const isSelected = currentResponse?.optionIndex === idx;
                            return (
                                <div key={idx}
                                    onClick={() => handleOptionSelect(idx, opt)}
                                    className={cn(
                                        "flex items-center space-x-3 border p-4 rounded-xl transition-all cursor-pointer hover:bg-slate-50 hover:border-indigo-200",
                                        isSelected ? "border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600" : "border-gray-200"
                                    )}>
                                    <div className={cn("w-5 h-5 rounded-full border flex items-center justify-center shrink-0", isSelected ? "border-indigo-600" : "border-gray-300")}>
                                        {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-indigo-600" />}
                                    </div>
                                    <Label className="flex-1 cursor-pointer font-medium text-gray-700">{opt}</Label>
                                </div>
                            )
                        })}
                    </div>

                    {/* Live Hint Feedback */}
                    {currentResponse && currentQuestion.optionsHint[currentResponse.optionIndex] && (
                        <div className="mt-4 p-4 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-900 text-sm animate-in fade-in slide-in-from-top-1">
                            <p className="font-medium mb-1 flex items-center gap-2">
                                <TrendingUp className="w-4 h-4" /> Insight
                            </p>
                            {currentQuestion.optionsHint[currentResponse.optionIndex]}
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex justify-between border-t p-6 bg-slate-50 rounded-b-xl">
                    <Button variant="ghost" onClick={handleBack} disabled={currentStep === 1}>
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back
                    </Button>
                    <Button onClick={handleNext} disabled={!currentResponse} className="bg-indigo-600 hover:bg-indigo-700">
                        {currentStep === totalQuestions ? "See Results" : "Next"} <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
