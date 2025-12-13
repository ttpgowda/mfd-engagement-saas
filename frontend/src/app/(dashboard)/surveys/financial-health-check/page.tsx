import { FinancialHealthCheckWizard } from "@/features/surveys/components/FinancialHealthCheckWizard";
import { ClientPageTitle } from "@/components/utils/ClientPageTitle";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ShareDialog } from "@/features/share/components/ShareDialog";

export default function FinancialHealthCheckPage() {
    return (
        <div className="p-6 space-y-8 max-w-6xl mx-auto">
            <ClientPageTitle title="Financial Health Check" />

            <div className="flex justify-between items-center pb-6 border-b border-border/40">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        Financial Health Check
                    </h1>
                    <p className="text-muted-foreground mt-1 ml-1">
                        Assess client financial health with this comprehensive survey.
                    </p>
                </div>
                {/* We use a specific toolSlug for this survey */}
                <ShareDialog
                    toolSlug="financial-health-check"
                    config={{}}
                    defaultTitle="Financial Health Check"
                    defaultDescription="Assess your financial health."
                />
            </div>

            {/* In internal view, we can just show the wizard in preview mode or allow them to take it?
                Usually internal view is for Agent to run it WITH the client sitting next to them.
                So we treat it as public-like but maybe with different save logic?
                For now, treat as public (isPublic=true) so it saves leads. 
                But in internal view, maybe we select an existing lead? 
                
                The requirement: "create the Survey nav ... store there enter".
                So yes, create leads. 
            */}
            <FinancialHealthCheckWizard isPublicView={false} />
        </div>
    );
}
