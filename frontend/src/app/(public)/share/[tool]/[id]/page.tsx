"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getCalculator, CALCULATORS } from "@/features/calculators/registry";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import axios from '@/lib/axios'; // Or standard axios if lib/axios has interceptors that might conflict (auth)
// lib/axios probably attaches token. For public API, we might need a clean instance or ensure it handles 401 gracefully?
// Ideally use a plain axios instance for public calls if the main one is heavily tied to Auth.
import axiosPublic from "axios";

const apiClient = axiosPublic.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
});

// Need to handle CalculatorViewProps
import { CalculatorViewProps } from "@/features/calculators/types";
import { useAnalytics } from "@/features/share/hooks/useAnalytics";
import { LeadCaptureModal } from "@/features/share/components/LeadCaptureModal";
import TopPerformingFundsView from "@/features/research/views/TopPerformingFundsView";

export default function SharedLinkPage() {
    const params = useParams();
    // params.tool might be array or string, safer to cast
    const toolSlug = params?.tool as string;
    const shortCode = params?.id as string;

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [config, setConfig] = useState<Record<string, any> | null>(null);

    const { showLeadCapture, setShowLeadCapture } = useAnalytics(shortCode);

    useEffect(() => {
        if (!shortCode) return;

        const fetchConfig = async () => {
            try {
                // Determine API URL based on environment or window location
                // If running on same domain, relative path works
                const res = await apiClient.get(`/api/public/links/${shortCode}`);
                setConfig(res.data.config);
            } catch (err: any) {
                console.error("Failed to load link", err);
                setError(err.response?.status === 404 ? "Link not found" : "Failed to load configuration");
            } finally {
                setLoading(false);
            }
        };

        fetchConfig();
    }, [shortCode]);

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-[50vh] items-center justify-center text-destructive">
                <p>{error}</p>
            </div>
        );
    }

    let Calculator = getCalculator(toolSlug);
    let Component: React.ElementType | undefined;

    // Manual override for Research Tools that aren't in the Calculator Registry
    if (toolSlug === 'top-performing-funds') {
        Component = TopPerformingFundsView;
        Calculator = {
            id: 'top-performing-funds',
            title: 'Top Performing Funds',
            description: 'Check out the high growth mutual funds.',
            icon: Loader2, // Placeholder
            component: TopPerformingFundsView
        };
    } else {
        Component = Calculator?.component;
    }

    if (!Component || !Calculator) {
        return (
            <div className="flex h-[50vh] items-center justify-center text-muted-foreground">
                <p>Tool type '{toolSlug}' not found.</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto">
            <div className="mb-6">
                <h1 className="text-3xl font-bold">{Calculator.title}</h1>
                <p className="text-muted-foreground">{Calculator.description}</p>
            </div>

            <Component defaultValues={config || undefined} isPublicView={true} />

            <LeadCaptureModal
                open={showLeadCapture}
                onOpenChange={setShowLeadCapture} // Allow user to close it? Or force? 
                shortCode={shortCode}
            // Usually force or strictly require. But for UX better allow close or make it persistent. 
            // Implementation plan said "if missing, display a modal ... and then proceed"
            // Assuming modal is dismissible or has logic. For now default Dialog behavior.
            />
        </div>
    );
}
