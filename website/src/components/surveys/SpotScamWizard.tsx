"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/base";
import { Button } from "@/components/ui/base";
import { Label } from "@/components/ui/base";
import { AlertCircle, CheckCircle2, AlertTriangle, ShieldAlert, ArrowRight, ArrowLeft } from "lucide-react";
import { SPOT_SCAM_DATA, type ScamQuestion } from "@/lib/surveys/data/spot-scam";
import { cn } from "@/components/ui/base";

interface Selection {
    questionId: number;
    optionIndex: number; // 0-based index in options array
}

export default function SpotScamWizard() {
    const [currentStep, setCurrentStep] = useState(0); // 0=Intro, 1..N=Questions, 99=Result
    const [selections, setSelections] = useState<Record<number, Selection>>({});

    const questions = SPOT_SCAM_DATA.questions;
    const totalQuestions = questions.length;
    const currentQuestion = currentStep > 0 && currentStep <= totalQuestions ? questions[currentStep - 1] : null;

    const handleStart = () => setCurrentStep(1);

    const handleOptionSelect = (idx: number) => {
        if (!currentQuestion) return;
        setSelections({
            ...selections,
            [currentQuestion.id]: {
                questionId: currentQuestion.id,
                optionIndex: idx
            }
        });
    };

    const handleNext = () => {
        if (currentStep < totalQuestions) {
            setCurrentStep(currentStep + 1);
        } else {
            setCurrentStep(99);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        } else {
            setCurrentStep(0);
        }
    };

    const calculateRisk = () => {
        let redFlags = 0;
        let orangeFlags = 0;
        let greenFlags = 0;

        Object.values(selections).forEach(sel => {
            const q = questions.find(q => q.id === sel.questionId);
            if (!q) return;
            const color = q.optionsColor[sel.optionIndex];
            if (color === "RED") redFlags++;
            else if (color === "ORANGE") orangeFlags++;
            else if (color === "GREEN") greenFlags++;
        });

        return { redFlags, orangeFlags, greenFlags };
    };

    if (currentStep === 0) {
        return (
            <div className="max-w-4xl mx-auto px-4">
                <Card className="border-t-4 border-t-red-600 shadow-xl">
                    <CardHeader className="text-center pb-6">
                        <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6 animate-in fade-in zoom-in duration-500">
                            <ShieldAlert className="w-8 h-8 text-red-600" />
                        </div>
                        <CardTitle className="text-3xl md:text-4xl font-bold text-gray-900">{SPOT_SCAM_DATA.meta.title}</CardTitle>
                        <CardDescription className="text-lg mt-3 text-gray-600 max-w-2xl mx-auto">
                            {SPOT_SCAM_DATA.meta.description}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-2">
                        <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 text-center">
                            <p className="text-sm text-slate-500 uppercase tracking-widest font-semibold mb-2">Powered by Guidelines from</p>
                            <p className="font-medium text-gray-900 text-lg flex items-center justify-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                                {SPOT_SCAM_DATA.meta.sourceCredit}
                            </p>
                        </div>
                    </CardContent>
                    <CardFooter className="justify-center pb-8 pt-4">
                        <Button size="lg" onClick={handleStart} className="w-full md:w-auto px-12 h-14 text-lg bg-red-600 hover:bg-red-700 shadow-lg shadow-red-200">
                            CHECK NOW
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    if (currentStep === 99) {
        const { redFlags, orangeFlags, greenFlags } = calculateRisk();
        const isSafe = redFlags === 0 && orangeFlags === 0;

        return (
            <div className="max-w-4xl mx-auto px-4 space-y-8">
                <Card className={cn(
                    "border-t-8 shadow-xl overflow-hidden",
                    redFlags > 0 ? "border-t-red-600" : (orangeFlags > 0 ? "border-t-orange-500" : "border-t-green-600")
                )}>
                    <CardHeader className="text-center bg-slate-50/50 pb-8 pt-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Assessment Complete</h2>
                        <div className="flex justify-center items-center gap-4 mt-6">
                            {redFlags > 0 && (
                                <div className="flex flex-col items-center p-4 bg-red-50 rounded-xl border border-red-100 min-w-[120px]">
                                    <span className="text-4xl font-black text-red-600 mb-1">{redFlags}</span>
                                    <span className="text-xs font-bold text-red-700 uppercase tracking-wide">Red Flags</span>
                                </div>
                            )}
                            {orangeFlags > 0 && (
                                <div className="flex flex-col items-center p-4 bg-orange-50 rounded-xl border border-orange-100 min-w-[120px]">
                                    <span className="text-4xl font-black text-orange-600 mb-1">{orangeFlags}</span>
                                    <span className="text-xs font-bold text-orange-700 uppercase tracking-wide">Precautions</span>
                                </div>
                            )}
                            {(isSafe || greenFlags > 0) && (
                                <div className="flex flex-col items-center p-4 bg-green-50 rounded-xl border border-green-100 min-w-[120px]">
                                    <span className="text-4xl font-black text-green-600 mb-1">{greenFlags}</span>
                                    <span className="text-xs font-bold text-green-700 uppercase tracking-wide">Green Flags</span>
                                </div>
                            )}
                        </div>

                        <div className="mt-8">
                            {redFlags > 0 ? (
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-800 rounded-full font-bold">
                                    <AlertCircle className="w-5 h-5" /> High Scam Risk
                                </div>
                            ) : orangeFlags > 0 ? (
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-800 rounded-full font-bold">
                                    <AlertTriangle className="w-5 h-5" /> Proceed with Caution
                                </div>
                            ) : (
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full font-bold">
                                    <CheckCircle2 className="w-5 h-5" /> Seems Legitimate
                                </div>
                            )}
                        </div>
                    </CardHeader>

                    <CardContent className="p-8">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <ShieldAlert className="w-5 h-5 text-indigo-600" /> Guidelines for Spotting a Scam
                        </h3>
                        <ul className="space-y-4">
                            {SPOT_SCAM_DATA.guidelines.map((g, i) => (
                                <li key={i} className="flex gap-3 text-gray-700 items-start p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
                                    <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold text-slate-600">{i + 1}</div>
                                    <span>{g}</span>
                                </li>
                            ))}
                        </ul>

                        <div className="mt-8 p-4 bg-blue-50 text-blue-900 rounded-lg text-sm border-l-4 border-blue-500">
                            <strong>Note:</strong> Adapted from <a href={SPOT_SCAM_DATA.meta.sourceUrl} target="_blank" className="underline hover:text-blue-700">SEBI Investor Education</a>. This tool is for educational purposes only.
                        </div>
                    </CardContent>

                    <CardFooter className="justify-center bg-slate-50 p-6">
                        <Button variant="outline" onClick={() => setCurrentStep(0)} className="mr-4">Check Another</Button>
                        <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={() => window.location.href = '/surveys'}>All Surveys</Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    // QUESTION VIEW
    if (!currentQuestion) return null;

    const selection = selections[currentQuestion.id];
    let feedbackColor = "gray";
    let FeedbackIcon = AlertCircle;
    let feedbackBg = "bg-gray-50";
    let feedbackBorder = "border-gray-200";

    if (selection) {
        const colorCode = currentQuestion.optionsColor[selection.optionIndex];
        if (colorCode === "RED") {
            feedbackColor = "text-red-700";
            FeedbackIcon = AlertCircle;
            feedbackBg = "bg-red-50";
            feedbackBorder = "border-red-200";
        } else if (colorCode === "ORANGE") {
            feedbackColor = "text-orange-700";
            FeedbackIcon = AlertTriangle;
            feedbackBg = "bg-orange-50";
            feedbackBorder = "border-orange-200";
        } else if (colorCode === "GREEN") {
            feedbackColor = "text-green-700";
            FeedbackIcon = CheckCircle2;
            feedbackBg = "bg-green-50";
            feedbackBorder = "border-green-200";
        }
    }

    return (
        <div className="max-w-xl mx-auto px-2">
            <Card className="shadow-lg border-t-4 border-t-indigo-600 min-h-[500px] flex flex-col">
                <CardHeader>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-slate-500">Question {currentStep} of {totalQuestions}</span>
                        <div className="h-1.5 w-24 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-600 transition-all duration-300" style={{ width: `${(currentStep / totalQuestions) * 100}%` }} />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="flex-1 space-y-6">
                    <h2 className="text-xl font-bold leading-relaxed text-gray-900">{currentQuestion.question}</h2>

                    <div className="space-y-3">
                        {currentQuestion.options.map((opt, idx) => {
                            if (idx === 0) return null; // Skip "Select"
                            const isSelected = selection?.optionIndex === idx;
                            return (
                                <button
                                    key={idx}
                                    onClick={() => handleOptionSelect(idx)}
                                    className={cn(
                                        "w-full text-left p-4 rounded-xl border transition-all duration-200 relative flex items-center group",
                                        isSelected
                                            ? "border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600 z-10"
                                            : "border-gray-200 hover:border-indigo-300 hover:bg-slate-50"
                                    )}
                                >
                                    <div className={cn(
                                        "w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center shrink-0 transition-colors",
                                        isSelected ? "border-indigo-600" : "border-gray-300 group-hover:border-indigo-400"
                                    )}>
                                        {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-indigo-600" />}
                                    </div>
                                    <span className={cn("text-base", isSelected ? "font-semibold text-indigo-900" : "text-gray-700")}>{opt}</span>
                                </button>
                            )
                        })}
                    </div>

                    {/* Immediate Feedback Area */}
                    <div className="min-h-[100px]">
                        {selection && (
                            <div className={cn(
                                "p-4 rounded-lg border flex gap-3 items-start animate-in fade-in slide-in-from-top-2",
                                feedbackBg, feedbackBorder, feedbackColor
                            )}>
                                <FeedbackIcon className="w-5 h-5 shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-bold text-sm mb-1 uppercase tracking-wide">Analysis</p>
                                    <p className="text-sm leading-relaxed">{currentQuestion.optionsHint[selection.optionIndex]}</p>
                                </div>
                            </div>
                        )}
                    </div>

                </CardContent>
                <CardFooter className="flex justify-between border-t p-6 bg-slate-50/50">
                    <Button variant="ghost" onClick={handleBack} disabled={currentStep === 1}>
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back
                    </Button>
                    <Button
                        onClick={handleNext}
                        disabled={!selection}
                        className={cn(
                            "transition-all",
                            selection ? "bg-indigo-600 hover:bg-indigo-700" : "bg-slate-300 cursor-not-allowed"
                        )}
                    >
                        {currentStep === totalQuestions ? "See Result" : "Next"} <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
