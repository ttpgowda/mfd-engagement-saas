import { FinancialHealthCheckWizard } from "./components/FinancialHealthCheckWizard";

import { FileText } from "lucide-react";

export interface SurveyToolItem {
    id: string;
    title: string;
    description: string;
    component: React.ComponentType<any>;
    icon: any;
}

export const SURVEY_TOOLS: SurveyToolItem[] = [
    {
        id: 'financial-health-check',
        title: 'Financial Health Check',
        description: 'Comprehensive assessment of your financial wellbeing.',
        component: FinancialHealthCheckWizard,
        icon: FileText
    }
];

export const getSurveyTool = (id: string) => SURVEY_TOOLS.find(t => t.id === id);
