"use client";

import { GoalReadinessWizard } from "@/features/surveys/components/GoalReadinessWizard";
import { ClientPageTitle } from "@/components/utils/ClientPageTitle";
import { ShareDialog } from "@/features/share/components/ShareDialog";

export default function GoalReadinessPage() {
    return (
        <div className="p-6 space-y-8 max-w-6xl mx-auto">
            <ClientPageTitle title="Goal Readiness" />

            <div className="flex justify-between items-center pb-6 border-b border-border/40">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        Goal Readiness
                    </h1>
                    <p className="text-muted-foreground mt-1 ml-1">
                        Evaluate client readiness for financial goals.
                    </p>
                </div>
                <ShareDialog
                    toolSlug="goal-readiness"
                    config={{}}
                    defaultTitle="Goal Readiness Assessment"
                    defaultDescription="Check your financial goal readiness."
                />
            </div>

            <GoalReadinessWizard isPublicView={false} />
        </div>
    );
}
