"use client";

import { useState, useEffect } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
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
    title = "Unlock Full Access",
    description = "You've been exploring for a while! Enter your details to save your progress and get a detailed report."
}: SurveyLeadFormProps) {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center sm:items-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
            <Card className="w-full max-w-md relative bg-background p-6 space-y-4 shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
                <button onClick={() => onOpenChange(false)} className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100"><XCircle className="w-4 h-4" /></button>
                <div className="space-y-2 text-center">
                    <h2 className="text-lg font-semibold">{title}</h2>
                    <p className="text-sm text-muted-foreground">{description}</p>
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
