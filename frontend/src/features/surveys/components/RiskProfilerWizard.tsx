"use client";

import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, ArrowRight, CheckCircle2, ShieldCheck, TrendingUp, Wallet, ArrowRightCircle } from "lucide-react";
import { RISK_PROFILER_DATA } from "../data/risk-profiler";
import axios from "@/lib/axios";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ShareDialog } from "@/features/share/components/ShareDialog";
import { PublicShareButton } from "@/features/share/components/PublicShareButton";
import { RiskGauge } from "./RiskGauge";
import { RecommendedTools } from "@/features/share/components/RecommendedTools";
import { useAnalytics } from "@/features/share/hooks/useAnalytics";
import { SurveyLeadForm, AutoPopupTrigger } from "./SurveyLeadForm";
import { useSurvey } from "../hooks/useSurvey";
import { useEffect } from "react";

interface RiskProfilerWizardProps {
    isPublicView?: boolean;
    sharedCode?: string;
    onComplete?: (leadId: number) => void;
}

interface QuestionResponse {
    questionId: number;
    optionIndex: number;
    optionText: string;
    score: number;
}

export function RiskProfilerWizard({ isPublicView = false, sharedCode, onComplete }: RiskProfilerWizardProps) {

    // State definitions
    const [currentStep, setCurrentStep] = useState(0);
    const [responses, setResponses] = useState<Record<number, QuestionResponse>>({});
    const [showLeadForm, setShowLeadForm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Gamification state
    const [isTransitioning, setIsTransitioning] = useState(false);
    const questions = RISK_PROFILER_DATA.questions;

    const { isSaving, saveProgress, submitLead, responseId } = useSurvey({
        surveyType: "RISK_PROFILER",
        sharedCode
    });

    const [finishTriggered, setFinishTriggered] = useState(false);
    const [hasLinkedLead, setHasLinkedLead] = useState(false);

    const handleStart = () => {
        setIsTransitioning(true);
        setTimeout(() => {
            setCurrentStep(1);
            setIsTransitioning(false);
        }, 300);
    };

    const handleNext = () => {
        if (!responses[currentStep]) {
            toast.error("Please select an option");
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
            [q.id]: {
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
        setCurrentStep(99);
    };


    // ... existing navigation logic ...

    // Auto-save Anonymous Result when hitting Report Step
    useEffect(() => {
        if (currentStep === 99 && !finishTriggered) {
            setFinishTriggered(true);
            const { score, category } = calculateResult();
            const data = {
                responses,
                riskScore: score,
                riskCategory: category
            };
            // Save anonymous progress immediately
            saveProgress(data, { status: "COMPLETED" });
        }
    }, [currentStep, finishTriggered]);

    const submitData = async (leadDetails: any) => {
        // Link the lead
        await submitLead(leadDetails);
        setHasLinkedLead(true);
        setShowLeadForm(false);
        if (onComplete && responseId) onComplete(responseId);
    };




    if (currentStep === 0) {
        return (
            <Card className={cn("max-w-2xl mx-auto border-t-4 border-t-indigo-600 shadow-xl transition-all duration-500", isTransitioning ? "opacity-0 translate-y-4" : "opacity-100")}>
                <CardHeader className="text-center pb-2 bg-gradient-to-b from-indigo-50/50 to-transparent dark:from-indigo-950/20">
                    <div className="mx-auto bg-indigo-100 dark:bg-indigo-900/50 p-4 rounded-full mb-4 w-20 h-20 flex items-center justify-center">
                        <TrendingUp className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <CardTitle className="text-3xl font-black text-slate-800 dark:text-slate-100">Risk Profiler</CardTitle>
                    <CardDescription className="text-lg mt-2 max-w-md mx-auto">
                        Understand your investment personality. Are you a daredevil or a guardian of capital?
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8 pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                        <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 shadow-sm hover:shadow-md transition-shadow">
                            <ShieldCheck className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                            <h3 className="font-bold text-slate-700 dark:text-slate-300">Safety</h3>
                            <p className="text-xs text-muted-foreground mt-1">Gauge your comfort with loss</p>
                        </div>
                        <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 shadow-sm hover:shadow-md transition-shadow">
                            <Wallet className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                            <h3 className="font-bold text-slate-700 dark:text-slate-300">Capacity</h3>
                            <p className="text-xs text-muted-foreground mt-1">Analyze financial ability</p>
                        </div>
                        <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 shadow-sm hover:shadow-md transition-shadow">
                            <TrendingUp className="w-8 h-8 text-indigo-500 mx-auto mb-2" />
                            <h3 className="font-bold text-slate-700 dark:text-slate-300">Growth</h3>
                            <p className="text-xs text-muted-foreground mt-1">Find your growth target</p>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="justify-center pb-10">
                    <Button size="lg" onClick={handleStart} className="w-full md:w-auto px-12 text-lg h-14 rounded-full shadow-lg hover:shadow-indigo-500/25 bg-indigo-600 hover:bg-indigo-700 transition-all">
                        Discover My Profile <ArrowRightCircle className="ml-2 w-5 h-5" />
                    </Button>
                </CardFooter>
            </Card>
        );
    }

    if (currentStep === 99) {
        const { score, category } = calculateResult();

        return (
            <div className="space-y-8 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
                <Card className="border-t-4 border-t-indigo-500 shadow-2xl overflow-hidden">
                    <CardHeader className="text-center relative border-b bg-slate-50/50 dark:bg-slate-900/50">
                        <CardTitle className="text-2xl font-bold">Your Risk Profile</CardTitle>
                        <div className="absolute right-4 top-4">
                            {isPublicView ? <PublicShareButton /> : <ShareDialog toolSlug="risk-profiler" config={{}} defaultTitle="My Risk Profile" />}
                        </div>
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
                </Card>

                <AutoPopupTrigger shouldShow={isPublicView && !hasLinkedLead && currentStep === 99} onTrigger={() => setShowLeadForm(true)} />

                <SurveyLeadForm
                    open={showLeadForm}
                    onOpenChange={setShowLeadForm}
                    onSubmit={submitData}
                    isLoading={isLoading}
                    title="Save Your Profile"
                    description="Get a detailed investment plan based on your risk score."
                />

                {/* Recommendations */}
                <div className="mt-8">
                    <RecommendedTools currentToolSlug="risk-profiler" currentShortCode={sharedCode} />
                </div>
            </div>
        );
    }

    const currentQuestion = questions[currentStep - 1];

    return (
        <Card className={cn("max-w-xl mx-auto border-t-4 border-t-indigo-600 shadow-xl transition-all duration-300 min-h-[400px] flex flex-col", isTransitioning ? "opacity-50 scale-95" : "opacity-100 scale-100")}>
            <CardHeader>
                <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">Question {currentStep} of {questions.length}</span>
                    <span className="text-xs text-muted-foreground">{Math.round((currentStep / questions.length) * 100)}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 mb-4">
                    <div className="bg-indigo-600 h-1.5 rounded-full transition-all duration-500" style={{ width: `${(currentStep / questions.length) * 100}%` }}></div>
                </div>
                <CardTitle className="text-xl font-bold leading-tight">{currentQuestion.question}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 pt-2">
                <RadioGroup
                    key={currentQuestion.id} // Force re-render to clear selection
                    onValueChange={(v) => handleOptionSelect(parseInt(v), currentQuestion.options[parseInt(v)])}
                    className="space-y-3"
                >
                    {currentQuestion.options.map((opt, idx) => {
                        if (idx === 0) return null;
                        const isSelected = responses[currentQuestion.id]?.optionIndex === idx;
                        return (
                            <div key={idx} className={cn(
                                "relative flex items-center p-4 rounded-xl border-2 transition-all cursor-pointer hover:shadow-md",
                                isSelected
                                    ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/20 shadow-md"
                                    : "border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-800"
                            )}>
                                <RadioGroupItem value={idx.toString()} id={`opt-${idx}`} className="absolute opacity-0" />
                                <Label htmlFor={`opt-${idx}`} className="flex-1 cursor-pointer font-medium text-slate-700 dark:text-slate-200 pl-2">
                                    {opt}
                                </Label>
                                {isSelected && <CheckCircle2 className="w-5 h-5 text-indigo-600 animate-in zoom-in spin-in-90 duration-300" />}
                            </div>
                        );
                    })}
                </RadioGroup>
            </CardContent>
            <CardFooter className="flex justify-between border-t p-6 bg-slate-50/50 dark:bg-slate-900/20">
                <Button variant="ghost" onClick={handleBack} disabled={currentStep === 1} className="text-slate-500 hover:text-slate-800">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>
                <Button onClick={handleNext} className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 dark:shadow-none min-w-[120px]">
                    {currentStep === questions.length ? "Analyze" : "Next"}
                    {currentStep !== questions.length && <ArrowRight className="w-4 h-4 ml-2" />}
                </Button>
            </CardFooter>
        </Card>
    );
}
