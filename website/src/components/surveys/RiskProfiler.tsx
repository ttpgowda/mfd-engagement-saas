"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/base";
import { Button } from "@/components/ui/base";
import { Label } from "@/components/ui/base";
import { ArrowLeft, ArrowRight, CheckCircle2, ShieldCheck, TrendingUp, Wallet, ArrowRightCircle } from "lucide-react";
import { RISK_PROFILER_DATA } from "@/lib/surveys/data/risk-profiler";
import { cn } from "@/components/ui/base";
import { RiskGauge } from "./RiskGauge";
import { CalculatorRecommendations } from "@/components/calculators/CalculatorRecommendations";

interface QuestionResponse {
    questionId: number;
    optionIndex: number;
    optionText: string;
    score: number;
}

export default function RiskProfiler() {
    // State definitions
    const [currentStep, setCurrentStep] = useState(0); // 0 = Intro, 1...N = Questions, 99 = Result
    const [responses, setResponses] = useState<Record<number, QuestionResponse>>({});
    const [isTransitioning, setIsTransitioning] = useState(false);

    const questions = RISK_PROFILER_DATA.questions;

    const handleStart = () => {
        setIsTransitioning(true);
        setTimeout(() => {
            setCurrentStep(1);
            setIsTransitioning(false);
        }, 300);
    };

    const handleNext = () => {
        if (!responses[currentStep]) {
            // alert("Please select an option"); // Simple alert or toast replacement
            return;
        }

        if (currentStep >= questions.length) {
            finishSurvey();
        } else {
            setIsTransitioning(true);
            setTimeout(() => {
                setCurrentStep(prev => prev + 1);
                setIsTransitioning(false);
            }, 300);
        }
    };

    const handleBack = () => {
        setIsTransitioning(true);
        setTimeout(() => {
            setCurrentStep(prev => prev - 1);
            setIsTransitioning(false);
        }, 300);
    };

    const handleOptionSelect = (idx: number, val: string) => {
        const q = questions[currentStep - 1];
        if (!q) return;

        const score = q.optionsScore[idx];

        setResponses({
            ...responses,
            [currentStep]: { // Use step as key or q.id
                questionId: q.id,
                optionIndex: idx,
                optionText: val,
                score: score
            }
        });
    };

    const calculateResult = () => {
        let totalScore = 0;
        Object.values(responses).forEach(r => {
            totalScore += r.score;
        });
        const percentage = Math.round((totalScore / (questions.length * 4)) * 100);
        let category = "Moderate";
        if (percentage < 40) category = "Conservative";
        else if (percentage > 70) category = "Aggressive";
        return { score: percentage, category };
    };

    const finishSurvey = () => {
        setIsTransitioning(true);
        setTimeout(() => {
            setCurrentStep(99);
            setIsTransitioning(false);
        }, 300);
    };

    // --- RENDER: INTRO ---
    if (currentStep === 0) {
        return (
            <div className="max-w-4xl mx-auto">
                <Card className={cn("max-w-2xl mx-auto border-t-4 border-t-indigo-600 shadow-xl transition-all duration-500", isTransitioning ? "opacity-0 translate-y-4" : "opacity-100")}>
                    <CardHeader className="text-center pb-2 bg-gradient-to-b from-indigo-50 to-transparent dark:from-indigo-900/20 dark:to-transparent">
                        <div className="mx-auto bg-indigo-100 dark:bg-indigo-900 p-4 rounded-full mb-4 w-20 h-20 flex items-center justify-center">
                            <TrendingUp className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <CardTitle className="text-3xl font-black text-slate-800 dark:text-gray-100">Risk Profiler</CardTitle>
                        <CardDescription className="text-lg mt-2 max-w-md mx-auto text-gray-600 dark:text-gray-400">
                            Understand your investment personality. Are you a daredevil or a guardian of capital?
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8 pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                            <div className="p-4 rounded-xl border border-slate-100 dark:border-gray-800 bg-slate-50 dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow">
                                <ShieldCheck className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                                <h3 className="font-bold text-slate-700 dark:text-gray-200">Safety</h3>
                                <p className="text-xs text-muted-foreground mt-1">Gauge your comfort with loss</p>
                            </div>
                            <div className="p-4 rounded-xl border border-slate-100 dark:border-gray-800 bg-slate-50 dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow">
                                <Wallet className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                                <h3 className="font-bold text-slate-700 dark:text-gray-200">Capacity</h3>
                                <p className="text-xs text-muted-foreground mt-1">Analyze financial ability</p>
                            </div>
                            <div className="p-4 rounded-xl border border-slate-100 dark:border-gray-800 bg-slate-50 dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow">
                                <TrendingUp className="w-8 h-8 text-indigo-500 mx-auto mb-2" />
                                <h3 className="font-bold text-slate-700 dark:text-gray-200">Growth</h3>
                                <p className="text-xs text-muted-foreground mt-1">Find your growth target</p>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="justify-center pb-10">
                        <Button onClick={handleStart} className="w-full md:w-auto px-12 text-lg h-14 rounded-full shadow-lg hover:shadow-indigo-500/25 bg-indigo-600 hover:bg-indigo-700 transition-all">
                            Discover My Profile <ArrowRightCircle className="ml-2 w-5 h-5" />
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    // --- RENDER: RESULTS ---
    if (currentStep === 99) {
        const { score, category } = calculateResult();

        return (
            <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
                <Card className="border-t-4 border-t-indigo-500 shadow-2xl overflow-hidden mb-12">
                    <CardHeader className="text-center relative border-b dark:border-gray-800 bg-slate-50/50 dark:bg-gray-900/50">
                        <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">Your Risk Profile</CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                        <RiskGauge score={score} category={category} />

                        <div className="mt-8 text-center max-w-2xl mx-auto space-y-4">
                            <h3 className="text-xl font-semibold">What this means for you</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {category === "Conservative" && "You prioritize the safety of your principal over high returns. You prefer stable, predictable investments and are uncomfortable with significant market fluctuations."}
                                {category === "Moderate" && "You seek a balance between risk and reward. You are willing to accept some short-term volatility in exchange for potential long-term growth, but you still value some protection."}
                                {category === "Aggressive" && "You are focused on maximizing long-term growth and are comfortable with significant market volatility. You have a higher risk tolerance and financial capacity to weather market downturns."}
                            </p>
                        </div>
                    </CardContent>
                    <CardFooter className="justify-center bg-slate-50 dark:bg-gray-900 p-6">
                        <Button variant="outline" onClick={() => setCurrentStep(0)} className="mr-4">Retake Assessment</Button>
                    </CardFooter>
                </Card>

                {/* Recommendations */}
                <CalculatorRecommendations currentToolSlug="risk-profiler" category="Investment" />
            </div>
        );
    }

    // --- RENDER: QUESTIONS ---
    const currentQuestion = questions[currentStep - 1];
    const progress = (currentStep / questions.length) * 100;
    const hasAnswer = responses[currentStep] !== undefined;

    return (
        <div className="max-w-xl mx-auto">
            <Card className={cn("border-t-4 border-t-indigo-600 shadow-xl transition-all duration-300 min-h-[400px] flex flex-col", isTransitioning ? "opacity-50 scale-95" : "opacity-100 scale-100")}>
                <CardHeader>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">Question {currentStep} of {questions.length}</span>
                        <span className="text-xs text-muted-foreground">{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-gray-800 rounded-full h-1.5 mb-4">
                        <div className="bg-indigo-600 h-1.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                    </div>
                    <CardTitle className="text-xl font-bold leading-tight text-gray-900 dark:text-gray-100">{currentQuestion.question}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 pt-2 space-y-3">
                    {currentQuestion.options.map((opt, idx) => {
                        if (idx === 0) return null; // Skip "Select" placeholder
                        const isSelected = responses[currentStep]?.optionIndex === idx;
                        const hint = currentQuestion.optionsHint?.[idx];

                        return (
                            <div key={idx}
                                onClick={() => handleOptionSelect(idx, opt)}
                                className={cn(
                                    "relative flex items-center p-4 rounded-xl border-2 transition-all cursor-pointer hover:shadow-md",
                                    isSelected
                                        ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/20 shadow-md"
                                        : "border-slate-100 dark:border-gray-800 hover:border-indigo-200 dark:hover:border-indigo-800"
                                )}>
                                <div className={cn("w-4 h-4 rounded-full border mr-3 flex items-center justify-center", isSelected ? "border-indigo-600" : "border-slate-300")}>
                                    {isSelected && <div className="w-2 h-2 rounded-full bg-indigo-600" />}
                                </div>
                                <div className="flex-1">
                                    <Label className="cursor-pointer font-medium text-slate-700 dark:text-gray-200 block">
                                        {opt}
                                    </Label>
                                    {hint && (
                                        <p className={cn("text-xs mt-1 font-normal", isSelected ? "text-indigo-700 dark:text-indigo-300" : "text-muted-foreground")}>
                                            {hint}
                                        </p>
                                    )}
                                </div>
                                {isSelected && <CheckCircle2 className="w-5 h-5 text-indigo-600 animate-in zoom-in spin-in-90 duration-300" />}
                            </div>
                        );
                    })}
                </CardContent>
                <CardFooter className="flex justify-between border-t border-gray-100 dark:border-gray-800 p-6 bg-slate-50/50 dark:bg-gray-900/50">
                    <Button variant="ghost" onClick={handleBack} disabled={currentStep === 1} className="text-slate-500 hover:text-slate-800">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back
                    </Button>
                    <Button
                        onClick={handleNext}
                        disabled={!hasAnswer}
                        className={cn("bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 min-w-[120px]", !hasAnswer && "opacity-50 cursor-not-allowed")}
                    >
                        {currentStep === questions.length ? "Analyze" : "Next"}
                        {currentStep !== questions.length && <ArrowRight className="w-4 h-4 ml-2" />}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}

// Helper variant prop patch if Button doesn't support 'ghost'/'outline' properly in base (it usually does in shadcn, but base.tsx might be simple)
// Step 596 base.tsx Button was VERY simple. It didn't have variants.
// I need to patch Button usage or update base.tsx to support variants.
// Or just inline styles.
