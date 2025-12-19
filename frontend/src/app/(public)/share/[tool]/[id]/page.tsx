"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getCalculator } from "@/features/calculators/registry";
import { Loader2 } from "lucide-react";
import { CalculatorViewProps, CalculatorItem } from "@/features/calculators/types";
import { ResearchToolItem } from "@/features/research/types";
import axiosPublic, { AxiosError } from "axios";

const apiClient = axiosPublic.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
});
import { useAnalytics } from "@/features/share/hooks/useAnalytics";
import { LeadCaptureModal } from "@/features/share/components/LeadCaptureModal";
import { RecommendedTools } from "@/features/share/components/RecommendedTools";

import { getResearchTool } from "@/features/research/registry";
import { getSurveyTool } from "@/features/surveys/registry";

export default function SharedLinkPage() {
    const params = useParams();
    const toolSlug = params?.tool as string;
    const shortCode = params?.id as string;

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [config, setConfig] = useState<Record<string, unknown> | null>(null);
    const [tenantName, setTenantName] = useState<string | null>(null);

    const { showLeadCapture, setShowLeadCapture, trackInteraction, trackConversion } = useAnalytics(shortCode, toolSlug);

    useEffect(() => {
        if (!shortCode) return;

        if (shortCode === 'demo') {
            setLoading(false);
            return;
        }

        const fetchConfig = async () => {
            try {
                const res = await apiClient.get(`/api/public/links/${shortCode}`);
                setConfig(res.data.config);
                setTenantName(res.data.tenantName);
            } catch (err: unknown) {
                console.error("Failed to load link", err);
                const status = (err as AxiosError)?.response?.status;
                setError(status === 404 ? "Link not found" : "Failed to load configuration");
            } finally {
                setLoading(false);
            }
        };

        fetchConfig();
    }, [shortCode]);

    // 1. Try Financial Calculator Registry
    let Calculator: CalculatorItem | ResearchToolItem | undefined = getCalculator(toolSlug);
    let Component: React.ComponentType<CalculatorViewProps> | undefined = Calculator?.component;

    // 2. Try Research Tools Registry if not found
    if (!Calculator) {
        const researchTool = getResearchTool(toolSlug);
        if (researchTool) {
            Component = researchTool.component;
            Calculator = researchTool;
        }
    }

    // 3. Try Survey Registry
    let isSurveyTool = false;
    if (!Calculator) {
        const surveyTool = getSurveyTool(toolSlug);
        if (surveyTool) {
            Component = surveyTool.component as unknown as React.ComponentType<CalculatorViewProps>;
            Calculator = surveyTool as unknown as CalculatorItem;
            isSurveyTool = true;
        }
    }


    // Set Document Title with Tenant Branding
    useEffect(() => {
        const updateTitle = async () => {
            if (Calculator) {
                // If we don't have tenant name yet, try to get it from API or registry
                // However, since this is a client component, we might need a simpler way 
                // or just wait for the 'config' fetch which also has tenantName (line 45)

                // RootLayout title template is: "%s | ${title}"
                // So document.title = "SIP Calculator" will result in "SIP Calculator | TenantName" 
                // IF we let Next.js handle it. But document.title = ... overwrites it completely.

                // Let's use the fetched tenantName from the config effect if available
                const displayTenantName = tenantName || "MFD Engagement";
                document.title = `${Calculator.title} | ${displayTenantName}`;
            }
        };
        updateTitle();
    }, [Calculator, tenantName]);

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

    if (!Component || !Calculator) {
        return (
            <div className="flex h-[50vh] items-center justify-center text-muted-foreground">
                <p>Tool type &apos;{toolSlug}&apos; not found.</p>
            </div>
        );
    }



    return (
        <div className="max-w-5xl mx-auto pb-12">
            <div className="mb-6">
                <h1 className="text-3xl font-bold">{Calculator.title}</h1>
                <p className="text-muted-foreground">{Calculator.description}</p>
            </div>

            <Component
                defaultValues={config || undefined}
                isPublicView={true}
                onInteraction={trackInteraction}
                onConversion={trackConversion}
                sharedCode={shortCode}
            />

            {toolSlug !== 'financial-health-check' && toolSlug !== 'risk-profiler' && toolSlug !== 'goal-readiness' && toolSlug !== 'retirement-prep' && (
                <RecommendedTools
                    currentToolSlug={toolSlug}
                    currentShortCode={shortCode}
                    onRecommendationClick={() => trackConversion('recommendation_click')}
                />
            )}

            {!isSurveyTool && (
                <LeadCaptureModal
                    open={showLeadCapture}
                    onOpenChange={setShowLeadCapture}
                    shortCode={shortCode}
                />
            )}
        </div>
    );
}
