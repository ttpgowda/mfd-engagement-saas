"use client";

import { RetirementPrepWizard } from "@/features/surveys/components/RetirementPrepWizard";
import { ClientPageTitle } from "@/components/utils/ClientPageTitle";
import { ShareDialog } from "@/features/share/components/ShareDialog";

export default function RetirementPrepPage() {
    return (
        <div className="p-6 space-y-8 max-w-6xl mx-auto">
            <ClientPageTitle title="Retirement Preparedness" />

            <div className="flex justify-between items-center pb-6 border-b border-border/40">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        Retirement Preparedness
                    </h1>
                    <p className="text-muted-foreground mt-1 ml-1">
                        Assess client readiness for retirement.
                    </p>
                </div>
                <ShareDialog
                    toolSlug="retirement-prep"
                    config={{}}
                    defaultTitle="Retirement Assessment"
                    defaultDescription="Check your retirement preparedness."
                />
            </div>

            <RetirementPrepWizard isPublicView={false} />
        </div>
    );
}
