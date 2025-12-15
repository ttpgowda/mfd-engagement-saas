import { FinancialHealthCheckWizard } from "./components/FinancialHealthCheckWizard";
import { RiskProfilerWizard } from "./components/RiskProfilerWizard";
import { GoalReadinessWizard } from "./components/GoalReadinessWizard";
import { RetirementPrepWizard } from "./components/RetirementPrepWizard";

import { FileText, TrendingUp, Target, FolderClock } from "lucide-react";

export interface SurveyToolItem {
    id: string;
    title: string;
    description: string;
    component: React.ComponentType<{ isPublicView?: boolean; sharedCode?: string }>;
    icon: React.ElementType;
}

export const SURVEY_TOOLS: SurveyToolItem[] = [
    {
        id: 'financial-health-check',
        title: 'Financial Health Check',
        description: 'Comprehensive assessment of your financial wellbeing.',
        component: FinancialHealthCheckWizard,
        icon: FileText
    },
    {
        id: 'risk-profiler',
        title: 'Risk Profiler',
        description: 'Analyze your investment risk tolerance.',
        component: RiskProfilerWizard,
        icon: TrendingUp
    },
    {
        id: 'goal-readiness',
        title: 'Goal Readiness',
        description: 'Evaluate your readiness to achieve financial goals.',
        component: GoalReadinessWizard,
        icon: Target
    },
    {
        id: 'retirement-prep',
        title: 'Retirement Prep',
        description: 'Assess how prepared you are for retirement.',
        component: RetirementPrepWizard,
        icon: FolderClock
    }
];

export const getSurveyTool = (id: string) => SURVEY_TOOLS.find(t => t.id === id);
