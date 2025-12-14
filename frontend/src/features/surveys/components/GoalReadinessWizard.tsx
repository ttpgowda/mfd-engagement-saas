"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, ArrowRight, CheckCircle2, Trophy, Target, TrendingUp, AlertTriangle } from "lucide-react";
import { GOAL_READINESS_DATA, GoalQuestion } from "../data/goal-readiness";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ShareDialog } from "@/features/share/components/ShareDialog";
import { PublicShareButton } from "@/features/share/components/PublicShareButton";
import { RecommendedTools } from "@/features/share/components/RecommendedTools";
import { SurveyLeadForm, AutoPopupTrigger } from "./SurveyLeadForm";
import { useSurvey } from "../hooks/useSurvey";

interface GoalReadinessWizardProps {
    isPublicView?: boolean;
    sharedCode?: string;
    onComplete?: (leadId: number) => void;
}

interface QuestionResponse {
    questionId: number;
    optionIndex: number;
    optionText: string;
    score: number;
    weight: number;
    maxScore: number;
}

export function GoalReadinessWizard({ isPublicView = false, sharedCode, onComplete }: GoalReadinessWizardProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [responses, setResponses] = useState<Record<number, QuestionResponse>>({});
    const [showLeadForm, setShowLeadForm] = useState(false);
    const [hasLinkedLead, setHasLinkedLead] = useState(false);

    // Combine core questions and follow-ups based on logic if needed. 
    // For simplicity, we'll just flow through the core questions first.
    // The spec mentions progressive disclosure, but for V1 we can do a linear flow of core questions.
    const questions = GOAL_READINESS_DATA.questions;

    const { isSaving, saveProgress, submitLead, responseId } = useSurvey({
        surveyType: "GOAL_READINESS",
        sharedCode
    });

    const [finishTriggered, setFinishTriggered] = useState(false);

    const handleStart = () => {
        setCurrentStep(1);
    };

    const handleNext = () => {
        if (!responses[currentStep]) {
            toast.error("Please select an option");
            return;
        }

        if (currentStep >= questions.length) {
            finishSurvey();
        } else {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handleBack = () => {
        setCurrentStep(prev => prev - 1);
    };

    const handleOptionSelect = (idx: number, val: string) => {
        const q = questions[currentStep - 1];
        if (!q) return;

        // Score logic: if scores array exists, take value. Else 0.
        // Max score is typically 4 in this dataset.
        const score = (q.scores && q.scores.length > idx) ? q.scores[idx] : 0;

        setResponses({
            ...responses,
            [q.id]: {
                questionId: q.id,
                optionIndex: idx,
                optionText: val,
                score: score,
                weight: q.weight,
                maxScore: 4 // Assuming 4 is max for normalization based on dataset
            }
        });
    };

    const calculateResult = () => {
        let weightedSum = 0;
        let weightedMaxSum = 0;

        Object.values(responses).forEach(r => {
            // Only count if maxScore > 0 to avoid divide by zero or counting informational questions
            if (r.maxScore > 0 && r.weight > 0) {
                weightedSum += r.score * r.weight;
                weightedMaxSum += r.maxScore * r.weight;
            }
        });

        const percentage = weightedMaxSum > 0 ? Math.round((weightedSum / weightedMaxSum) * 100) : 0;

        let status = "notReady";
        let label = GOAL_READINESS_DATA.scoring.thresholds.notReady.label;
        let note = GOAL_READINESS_DATA.scoring.thresholds.notReady.note;

        if (percentage >= GOAL_READINESS_DATA.scoring.thresholds.ready.min) {
            status = "ready";
            label = GOAL_READINESS_DATA.scoring.thresholds.ready.label;
            note = GOAL_READINESS_DATA.scoring.thresholds.ready.note;
        } else if (percentage >= GOAL_READINESS_DATA.scoring.thresholds.partiallyReady.min) {
            status = "partiallyReady";
            label = GOAL_READINESS_DATA.scoring.thresholds.partiallyReady.label;
            note = GOAL_READINESS_DATA.scoring.thresholds.partiallyReady.note;
        }

        return { score: percentage, status, label, note };
    };

    const finishSurvey = () => {
        setCurrentStep(99);
    };

    // Auto-save Anonymous Result when hitting Report Step
    useEffect(() => {
        if (currentStep === 99 && !finishTriggered) {
            setFinishTriggered(true);
            const { score, label } = calculateResult();
            const data = {
                responses,
                readinessScore: score,
                readinessLabel: label
            };
            // Save anonymous progress immediately
            saveProgress(data, { status: "COMPLETED" });
        }
    }, [currentStep, finishTriggered]);

    const submitData = async (leadDetails: any) => {
        await submitLead(leadDetails);
        setHasLinkedLead(true);
        setShowLeadForm(false);
        if (onComplete && responseId) onComplete(responseId);
    };


    if (currentStep === 0) {
        return (
            <Card className="max-w-2xl mx-auto border-t-4 border-t-emerald-600 shadow-xl">
                <CardHeader className="text-center pb-2 bg-gradient-to-b from-emerald-50/50 to-transparent dark:from-emerald-950/20">
                    <div className="mx-auto bg-emerald-100 dark:bg-emerald-900/50 p-4 rounded-full mb-4 w-20 h-20 flex items-center justify-center">
                        <Target className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <CardTitle className="text-3xl font-black text-slate-800 dark:text-slate-100">{GOAL_READINESS_DATA.meta.name}</CardTitle>
                    <CardDescription className="text-lg mt-2 max-w-md mx-auto">
                        {GOAL_READINESS_DATA.meta.description}
                    </CardDescription>
                </CardHeader>
                <CardFooter className="justify-center pb-10">
                    <Button size="lg" onClick={handleStart} className="w-full md:w-auto px-12 text-lg h-14 rounded-full shadow-lg hover:shadow-emerald-500/25 bg-emerald-600 hover:bg-emerald-700 transition-all">
                        Start Survey <TrendingUp className="ml-2 w-5 h-5" />
                    </Button>
                </CardFooter>
            </Card>
        );
    }

    if (currentStep === 99) {
        const { score, status, label, note } = calculateResult();

        // Type safe actions access
        const actions = GOAL_READINESS_DATA.scoring.recommendedActions[status as keyof typeof GOAL_READINESS_DATA.scoring.recommendedActions] || [];

        return (
            <div className="space-y-8 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
                <Card className={cn("border-t-4 shadow-2xl overflow-hidden",
                    status === 'ready' ? "border-t-emerald-500" :
                        status === 'partiallyReady' ? "border-t-amber-500" : "border-t-red-500"
                )}>
                    <CardHeader className="text-center relative border-b bg-slate-50/50 dark:bg-slate-900/50">
                        <CardTitle className="text-2xl font-bold">Readiness Result</CardTitle>
                        <div className="absolute right-4 top-4">
                            {isPublicView ? <PublicShareButton /> : <ShareDialog toolSlug="goal-readiness" config={{}} defaultTitle="Goal Readiness Report" />}
                        </div>
                    </CardHeader>
                    <CardContent className="p-8">
                        <div className="text-center mb-8">
                            <div className={cn("inline-flex items-center justify-center w-32 h-32 rounded-full border-4 text-4xl font-black mb-4",
                                status === 'ready' ? "border-emerald-200 text-emerald-600 bg-emerald-50" :
                                    status === 'partiallyReady' ? "border-amber-200 text-amber-600 bg-amber-50" : "border-red-200 text-red-600 bg-red-50"
                            )}>
                                {score}%
                            </div>
                            <h2 className="text-3xl font-bold mb-2">{label}</h2>
                            <p className="text-muted-foreground max-w-lg mx-auto">{note}</p>
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border">
                            <h3 className="font-semibold mb-4 flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-indigo-600" /> Recommended Actions
                            </h3>
                            <ul className="space-y-3">
                                {actions.map((action, i) => (
                                    <li key={i} className="flex gap-3 text-sm text-slate-700 dark:text-slate-300">
                                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 shrink-0" />
                                        {action}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </CardContent>
                </Card>

                <AutoPopupTrigger shouldShow={isPublicView && !hasLinkedLead && currentStep === 99} onTrigger={() => setShowLeadForm(true)} />

                <SurveyLeadForm
                    open={showLeadForm}
                    onOpenChange={setShowLeadForm}
                    onSubmit={submitData}
                    isLoading={false}
                    title="Save Your Goal Plan"
                    description="Get a detailed report and professional guidance."
                />

                {/* Recommendations */}
                <div className="mt-8">
                    <RecommendedTools currentToolSlug="goal-readiness" currentShortCode={sharedCode} />
                </div>
            </div>
        );
    }

    const currentQuestion = questions[currentStep - 1];

    return (
        <Card className="max-w-xl mx-auto border-t-4 border-t-emerald-600 shadow-xl transition-all duration-300 min-h-[400px] flex flex-col">
            <CardHeader>
                <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">Question {currentStep} of {questions.length}</span>
                    <span className="text-xs text-muted-foreground">{Math.round((currentStep / questions.length) * 100)}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 mb-4">
                    <div className="bg-emerald-600 h-1.5 rounded-full transition-all duration-500" style={{ width: `${(currentStep / questions.length) * 100}%` }}></div>
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
                                    ? "border-emerald-600 bg-emerald-50/50 dark:bg-emerald-900/20 shadow-md"
                                    : "border-slate-100 dark:border-slate-800 hover:border-emerald-200 dark:hover:border-emerald-800"
                            )}>
                                <RadioGroupItem value={idx.toString()} id={`opt-${idx}`} className="absolute opacity-0" />
                                <Label htmlFor={`opt-${idx}`} className="flex-1 cursor-pointer font-medium text-slate-700 dark:text-slate-200 pl-2">
                                    {opt}
                                </Label>
                                {isSelected && <CheckCircle2 className="w-5 h-5 text-emerald-600 animate-in zoom-in spin-in-90 duration-300" />}
                            </div>
                        );
                    })}
                </RadioGroup>
            </CardContent>
            <CardFooter className="flex justify-between border-t p-6 bg-slate-50/50 dark:bg-slate-900/20">
                <Button variant="ghost" onClick={handleBack} disabled={currentStep === 1} className="text-slate-500 hover:text-slate-800">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>
                <Button onClick={handleNext} className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200 dark:shadow-none min-w-[120px]">
                    {currentStep === questions.length ? "Analyze" : "Next"}
                    {currentStep !== questions.length && <ArrowRight className="w-4 h-4 ml-2" />}
                </Button>
            </CardFooter>
        </Card>
    );
}
