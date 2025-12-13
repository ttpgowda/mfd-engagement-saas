"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, ArrowRight, CheckCircle2, AlertTriangle, XCircle, Award, Share2 } from "lucide-react";
import { FINANCIAL_HEALTH_DATA } from "../data/financial-health-check";
import axios from "@/lib/axios";
import { toast } from "sonner";
import { LeadCaptureModal } from "@/features/share/components/LeadCaptureModal";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ShareDialog } from "@/features/share/components/ShareDialog";
import { RecommendedTools } from "@/features/share/components/RecommendedTools";
import { PublicShareButton } from "@/features/share/components/PublicShareButton";

interface FinancialHealthCheckWizardProps {
    isPublicView?: boolean;
    sharedCode?: string;
    onComplete?: (leadId: number) => void;
}

interface QuestionResponse {
    questionId: number;
    optionIndex: number;
    optionText: string;
    scoreColor: string;
    hint: string;
}

export function FinancialHealthCheckWizard({ isPublicView = false, sharedCode, onComplete }: FinancialHealthCheckWizardProps) {
    const [currentStep, setCurrentStep] = useState(0); // 0 = Intro, 1..N = Questions, N+1 = LeadForm, N+2 = Report
    const [responses, setResponses] = useState<Record<number, QuestionResponse>>({});
    const [showLeadModal, setShowLeadModal] = useState(false);
    const [leadId, setLeadId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [history, setHistory] = useState<number[]>([]);

    const questions = FINANCIAL_HEALTH_DATA.questions;

    // Navigation Logic with Skips
    const getNextQuestionId = (currentQId: number, currentOptionIndex: number) => {
        // Skip Logic:
        // If Q1 (Dependents) is 'No' (index 2 in 1-based logic, but data is ["Select", "Yes", "No"]), 
        // optionIndex for "No" is 2.
        if (currentQId === 1 && currentOptionIndex === 2) return 3;

        // If Q3 (Health Ins) is 'No' (index 1), Skip Q4 (Awareness), Go to Q5.
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
            toast.error("Please select an option");
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
        setCurrentStep(99); // Report State
        saveResponses();
    };

    const saveResponses = async () => {
        if (!isPublicView) return;
        // We trigger the modal if public to capturing details.
        // If already captured (unlikely in this flow unless previous session?), skip.
        // We do nothing here, just set state 99 renders the view which has the modal trigger.
        // We could auto-show modal here:
        // setShowLeadModal(true); 
        // BUT user asked for 5 sec delay or "gamified" feel. See AutoPopupTrigger below.
    };

    const submitData = async (leadDetails: any) => {
        setIsLoading(true);
        try {
            // Calculate score first
            const { score, category } = calculateScore();

            const payload = {
                sharedCode: sharedCode || 'demo',
                responsesJson: JSON.stringify(responses),
                totalScore: score,
                scoreCategory: category,
                ...leadDetails
            };

            const res = await axios.post('/api/public/surveys/financial-health-check', payload);
            setLeadId(res.data);
            setShowLeadModal(false); // Close modal on success
            if (onComplete) onComplete(res.data);
            toast.success("Progress Saved!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to save.");
        } finally {
            setIsLoading(false);
        }
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
        Object.values(responses).forEach((r: any) => {
            if (r.scoreColor === "#EC1212") red++;
            else if (r.scoreColor === "#907326") orange++;
            else if (r.scoreColor === "#008A29") green++;
        });

        let category = "GREEN";
        if (red > 0) category = "RED";
        else if (orange > 2) category = "ORANGE";

        return { score: green * 10 - red * 10, category, red, orange, green };
    };

    const { category, red, orange, green } = calculateScore();

    if (currentStep === 0) {
        return (
            <Card className="max-w-2xl mx-auto border-t-4 border-t-primary shadow-lg">
                <CardHeader className="text-center pb-2">
                    <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">Financial Health Check</CardTitle>
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
                </CardContent>
                <CardFooter className="justify-center pb-8">
                    <Button size="lg" onClick={handleStart} className="w-full md:w-auto px-12 text-lg h-12 rounded-full shadow-lg hover:shadow-xl transition-all">Start Health Check</Button>
                </CardFooter>
            </Card>
        );
    }

    if (currentStep === 99) {
        // Report View
        return (
            <div className="space-y-8 max-w-4xl mx-auto">
                <Card className="border-t-4 border-t-primary shadow-lg animate-in fade-in zoom-in duration-300">
                    <CardHeader className="text-center border-b bg-muted/20 relative">
                        <CardTitle className="text-2xl">Financial Health Report</CardTitle>
                        <CardDescription>Consolidated Summary</CardDescription>

                        {/* Sharing Options for Report */}
                        <div className="absolute right-4 top-4">
                            {isPublicView ? (
                                <PublicShareButton />
                            ) : (
                                <ShareDialog
                                    toolSlug="financial-health-check"
                                    config={{}}
                                    defaultTitle="Financial Health Report"
                                    defaultDescription={`Score: ${green * 10 - red * 10}`}
                                />
                            )}
                        </div>
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
                                                {r.hint}
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
                                                {r.hint}
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
                                                {r.hint}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        {/* Lead Capture Trigger */}
                        {isPublicView && !leadId && (
                            <div className="text-center pt-8 border-t">
                                <p className="text-muted-foreground mb-4">Save your report now and get expert advice to fix these gaps.</p>
                                <Button size="lg" onClick={() => setShowLeadModal(true)} className="animate-pulse shadow-xl bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 hover:to-violet-700 transition-transformation hover:scale-105">
                                    Get Full Analysis & Expert Help
                                </Button>
                            </div>
                        )}

                    </CardContent>
                </Card>

                {/* Auto Popup Controller */}
                <AutoPopupTrigger shouldShow={isPublicView && !leadId && currentStep === 99} onTrigger={() => setShowLeadModal(true)} />

                {/* Recommendations */}
                <div className="mt-8">
                    <h3 className="text-xl font-bold mb-4">Recommended Tools</h3>
                    <RecommendedTools
                        currentToolSlug="financial-health-check"
                        currentShortCode={sharedCode}
                    />
                </div>

                <CustomLeadForm
                    open={showLeadModal}
                    onOpenChange={setShowLeadModal}
                    onSubmit={submitData}
                    isLoading={isLoading}
                />
            </div>
        );
    }

    if (!currentQuestion) return null;

    const currentResponse = responses[currentQId];

    return (
        <Card className="max-w-2xl mx-auto border-t-4 border-t-primary shadow-lg min-h-[500px] flex flex-col">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-muted-foreground">Question {history.length} / 14</span>
                            <span className="text-xs px-2 py-1 bg-muted rounded ml-2">{Math.round((history.length / 14) * 100)}% Completed</span>
                        </div>
                        <CardTitle className="text-xl leading-relaxed">{currentQuestion.question}</CardTitle>
                    </div>
                    {/* Share Button (Visible mostly in Admin/Internal view) */}
                    <div className="ml-4">
                        {isPublicView ? (
                            <div className="hidden md:block"><PublicShareButton /></div>
                        ) : (
                            <ShareDialog
                                toolSlug="financial-health-check"
                                config={{}}
                                defaultTitle="Financial Health Check"
                                defaultDescription="Assess client financial health."
                            />
                        )}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex-1 pt-6">
                <RadioGroup
                    key={currentQId}
                    value={currentResponse?.optionIndex?.toString()}
                    onValueChange={(v) => handleOptionSelect(parseInt(v), currentQuestion.options[parseInt(v)])}
                    className="space-y-4"
                >
                    {currentQuestion.options.map((opt, idx) => {
                        if (idx === 0) return null; // Skip "Select"
                        return (
                            <div key={idx} className={cn(
                                "flex items-center space-x-2 border p-4 rounded-lg transition-all cursor-pointer hover:bg-muted/50",
                                currentResponse?.optionIndex === idx ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border"
                            )}>
                                <RadioGroupItem value={idx.toString()} id={`opt-${idx}`} />
                                <Label htmlFor={`opt-${idx}`} className="flex-1 cursor-pointer font-medium">{opt}</Label>
                            </div>
                        )
                    })}
                </RadioGroup>

                {/* Live Hint Feedback */}
                {currentResponse?.hint && (
                    <div className={cn("mt-6 p-4 rounded-lg flex gap-3 text-sm animate-in fade-in slide-in-from-top-2",
                        currentResponse.scoreColor === "#008A29" ? "bg-green-50 text-green-800 border border-green-200" :
                            currentResponse.scoreColor === "#907326" ? "bg-orange-50 text-orange-800 border border-orange-200" :
                                "bg-red-50 text-red-800 border border-red-200"
                    )}>
                        {currentResponse.scoreColor === "#008A29" ? <CheckCircle2 className="w-5 h-5 shrink-0" /> :
                            currentResponse.scoreColor === "#907326" ? <AlertTriangle className="w-5 h-5 shrink-0" /> : <XCircle className="w-5 h-5 shrink-0" />}
                        <div>{currentResponse.hint}</div>
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex justify-between border-t p-6 bg-muted/10">
                <Button variant="ghost" onClick={handleBack} disabled={currentStep === 1 && history.length === 1}>
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>
                <Button onClick={handleNext} disabled={!currentResponse}>
                    {history.length >= 14 ? "Finish" : "Next"} <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
            </CardFooter>
        </Card>
    );
}

interface CustomLeadFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: { name: string, phone: string, email: string }) => void;
    isLoading: boolean;
}

function CustomLeadForm({ open, onOpenChange, onSubmit, isLoading }: CustomLeadFormProps) {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center sm:items-center bg-black/80 p-4 animate-in fade-in">
            <Card className="w-full max-w-md relative bg-background p-6 space-y-4">
                <button onClick={() => onOpenChange(false)} className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100"><XCircle className="w-4 h-4" /></button>
                <div className="space-y-2 text-center">
                    <h2 className="text-lg font-semibold">Unlock Full Access</h2>
                    <p className="text-sm text-muted-foreground">You've been exploring for a while! Enter your details to save your progress and get a detailed report.</p>
                </div>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Name</Label>
                        <input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            value={name} onChange={e => setName(e.target.value)} placeholder="Your Name" />
                    </div>
                    <div className="space-y-2">
                        <Label>Mobile Number</Label>
                        <input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            value={phone} onChange={e => setPhone(e.target.value)} placeholder="9999999999" />
                    </div>
                    <div className="space-y-2">
                        <Label>Email (Optional)</Label>
                        <input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            value={email} onChange={e => setEmail(e.target.value)} placeholder="email@example.com" />
                    </div>
                    <Button className="w-full" onClick={() => onSubmit({ name, phone, email })} disabled={!name || !phone || isLoading}>
                        {isLoading ? "Saving..." : "Save Report"}
                    </Button>
                </div>
            </Card>
        </div>
    )
}

function AutoPopupTrigger({ shouldShow, onTrigger }: { shouldShow: boolean, onTrigger: () => void }) {
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (shouldShow) {
            timer = setTimeout(() => {
                onTrigger();
            }, 5000);
        }
        return () => clearTimeout(timer);
    }, [shouldShow]); // Removing onTrigger from deps to avoid re-trigger if function reference changes, though usually fine.
    return null;
}
