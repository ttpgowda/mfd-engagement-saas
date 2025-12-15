"use client";

import { RiskProfilerWizard } from "@/features/surveys/components/RiskProfilerWizard";
import { ClientPageTitle } from "@/components/utils/ClientPageTitle";
import { ShareDialog } from "@/features/share/components/ShareDialog";

export default function RiskProfilerPage() {
    return (
        <div className="p-6 space-y-8 max-w-6xl mx-auto">
            <ClientPageTitle title="Risk Profiler" />

            <div className="flex justify-between items-center pb-6 border-b border-border/40">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        Risk Profiler
                    </h1>
                    <p className="text-muted-foreground mt-1 ml-1">
                        Assess client risk appetite with this gamified tool.
                    </p>
                </div>
                <ShareDialog
                    toolSlug="risk-profiler"
                    config={{}}
                    defaultTitle="Risk Profile Assessment"
                    defaultDescription="Discover your investment risk profile."
                />
            </div>

            <RiskProfilerWizard isPublicView={false} />
        </div>
    );
}
