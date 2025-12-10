"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getCalculator } from "@/features/calculators/registry";
import { Loader2 } from "lucide-react";
import { CalculatorViewProps, CalculatorID, CalculatorItem } from "@/features/calculators/types";
import axiosPublic from "axios";

const apiClient = axiosPublic.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
});
import { useAnalytics } from "@/features/share/hooks/useAnalytics";
import { LeadCaptureModal } from "@/features/share/components/LeadCaptureModal";

// Research Views
import TopPerformingFundsView from "@/features/research/views/TopPerformingFundsView";
import TrailingReturnsView from '@/features/research/views/TrailingReturnsView';
import RollingReturnsView from '@/features/research/views/RollingReturnsView';
import TopLumpsumView from '@/features/research/views/TopLumpsumView';
import SipCalculatorView from '@/features/research/views/SipCalculatorView';
import StpCalculatorView from '@/features/research/views/StpCalculatorView';
import SwpCalculatorView from '@/features/research/views/SwpCalculatorView';
import FdVsDebtView from '@/features/research/views/FdVsDebtView';
import AnnualReturnsView from '@/features/research/views/AnnualReturnsView';
import FundRankerView from '@/features/research/views/FundRankerView';
import CategoryMonitorView from '@/features/research/views/CategoryMonitorView';
import BenchmarkMonitorView from '@/features/research/views/BenchmarkMonitorView';
import FundCompareView from '@/features/research/views/FundCompareView';

const RESEARCH_TOOLS: Record<string, { component: React.ComponentType<CalculatorViewProps>, title: string, description: string, icon?: React.ElementType }> = {
    'top-performing-funds': { component: TopPerformingFundsView, title: 'Top Performing Funds', description: 'Check out the high growth mutual funds.' },
    'trailing-returns': { component: TrailingReturnsView, title: 'Trailing Returns', description: 'Analyze trailing returns of funds.' },
    'rolling-returns': { component: RollingReturnsView, title: 'Rolling Returns', description: 'Analyze period-wise rolling returns.' },
    'lumpsum-returns': { component: TopLumpsumView, title: 'Top Lumpsum Returns', description: 'Find the best lumpsum investment returns.' },
    'research-sip': { component: SipCalculatorView, title: 'Historical SIP Returns', description: 'Simulate past SIP performance.' },
    'research-stp': { component: StpCalculatorView, title: 'STP Calculator', description: 'Simulate Systematic Transfer Plan returns.' },
    'research-swp': { component: SwpCalculatorView, title: 'SWP Calculator', description: 'Simulate Systematic Withdrawal Plan returns.' },
    'fd-vs-debt': { component: FdVsDebtView, title: 'FD vs Debt Funds', description: 'Tax-adjusted comparison of FD and Debt Funds.' },
    'annual-returns': { component: AnnualReturnsView, title: 'Annual Returns Matrix', description: 'Year-wise performance matrix.' },
    'fund-ranker': { component: FundRankerView, title: 'Fund Ranker', description: 'Top funds ranked by Alpha and returns.' },
    'category-monitor': { component: CategoryMonitorView, title: 'Category Monitor', description: 'Monitor performance across categories.' },
    'benchmark-monitor': { component: BenchmarkMonitorView, title: 'Benchmark Monitor', description: 'Monitor performance across benchmarks.' },
    'fund-comparison': { component: FundCompareView, title: 'Fund Comparison', description: 'Compare multiple funds side-by-side.' },
};

export default function SharedLinkPage() {
    const params = useParams();
    const toolSlug = params?.tool as string;
    const shortCode = params?.id as string;

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [config, setConfig] = useState<Record<string, unknown> | null>(null);

    const { showLeadCapture, setShowLeadCapture } = useAnalytics(shortCode);

    useEffect(() => {
        if (!shortCode) return;

        const fetchConfig = async () => {
            try {
                const res = await apiClient.get(`/api/public/links/${shortCode}`);
                setConfig(res.data.config);
            } catch (err: unknown) {
                console.error("Failed to load link", err);
                // Safe check for axios error structure
                const status = (err as { response?: { status?: number } })?.response?.status;
                setError(status === 404 ? "Link not found" : "Failed to load configuration");
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

    // 1. Try Financial Calculator Registry
    let Calculator: CalculatorItem | undefined = getCalculator(toolSlug);
    let Component: React.ComponentType<CalculatorViewProps> | undefined = Calculator?.component;

    // 2. Try Research Tools Registry
    const researchTool = RESEARCH_TOOLS[toolSlug];
    if (researchTool) {
        Component = researchTool.component;
        Calculator = { // Mock CalculatorItem interface
            id: toolSlug as unknown as CalculatorID,
            title: researchTool.title,
            description: researchTool.description,
            icon: (researchTool.icon || Loader2) as React.ElementType,
            component: researchTool.component
        };
    }

    if (!Component || !Calculator) {
        return (
            <div className="flex h-[50vh] items-center justify-center text-muted-foreground">
                <p>Tool type &apos;{toolSlug}&apos; not found.</p>
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
                onOpenChange={setShowLeadCapture}
                shortCode={shortCode}
            />
        </div>
    );
}
