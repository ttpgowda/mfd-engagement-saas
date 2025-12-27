"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { XCircle } from "lucide-react";

interface SurveyLeadFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: { name: string, phone: string, email: string }) => void;
    isLoading: boolean;
    title?: string;
    description?: string;
}

export function SurveyLeadForm({
    open,
    onOpenChange,
    onSubmit,
    isLoading,
    title = "Connect with an Investment Expert",
    description = "Share your details and our advisor will help you understand your results and guide you with suitable mutual fund options."
}: SurveyLeadFormProps) {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in overflow-y-auto">
            <Card className="w-full max-w-md relative bg-background p-6 space-y-4 shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
                <button
                    onClick={() => onOpenChange(false)}
                    className="absolute right-2 top-2 p-2 rounded-sm opacity-70 hover:opacity-100 hover:bg-muted transition-colors"
                >
                    <XCircle className="w-5 h-5" />
                </button>
                <div className="space-y-2 text-center pt-2">
                    <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
                    <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
                </div>
                <div className="space-y-4 pt-2">
                    <div className="space-y-2">
                        <Label htmlFor="lead-name">Name</Label>
                        <Input
                            id="lead-name"
                            className="text-base md:text-sm h-11 md:h-10"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="Your Name"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="lead-phone">Mobile Number</Label>
                        <Input
                            id="lead-phone"
                            type="tel"
                            className="text-base md:text-sm h-11 md:h-10"
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                            placeholder="9999999999"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="lead-email">Email (Optional)</Label>
                        <Input
                            id="lead-email"
                            type="email"
                            className="text-base md:text-sm h-11 md:h-10"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="email@example.com"
                        />
                    </div>
                    <Button
                        className="w-full h-11 md:h-10 text-base md:text-sm font-medium mt-2"
                        onClick={() => onSubmit({ name, phone, email })}
                        disabled={!name || !phone || isLoading}
                    >
                        {isLoading ? "Saving..." : "Save Report"}
                    </Button>
                </div>
            </Card>
        </div>
    );
}

export function AutoPopupTrigger({ shouldShow, onTrigger }: { shouldShow: boolean, onTrigger: () => void }) {
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (shouldShow) {
            timer = setTimeout(() => {
                onTrigger();
            }, 5000);
        }
        return () => clearTimeout(timer);
    }, [shouldShow]);
    return null;
}
