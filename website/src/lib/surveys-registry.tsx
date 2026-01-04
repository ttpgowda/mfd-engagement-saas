import { ComponentType } from 'react';
import dynamic from 'next/dynamic';
import { TrendingUp, Activity, Target, ShieldCheck, ShieldAlert } from 'lucide-react';

const RiskProfiler = dynamic(() => import('@/components/surveys/RiskProfiler'), { ssr: true });
const FinancialHealthCheck = dynamic(() => import('@/components/surveys/FinancialHealthCheck'), { ssr: true });
const GoalReadiness = dynamic(() => import('@/components/surveys/GoalReadiness'), { ssr: true });
const RetirementPrep = dynamic(() => import('@/components/surveys/RetirementPrep'), { ssr: true });
const SpotScamWizard = dynamic(() => import('@/components/surveys/SpotScamWizard'), { ssr: true });

export interface Survey {
    slug: string;
    title: string;
    description: string;
    icon: ComponentType<{ className?: string }>;
    component: ComponentType<any>;
    category: 'Assessment' | 'Audit' | 'Education';
}

export const surveys: Survey[] = [
    {
        slug: 'risk-profiler',
        title: 'Risk Profiler',
        description: 'Analyze your investment risk tolerance with our comprehensive assessment.',
        icon: TrendingUp,
        component: RiskProfiler,
        category: 'Assessment'
    },
    {
        slug: 'financial-health-check',
        title: 'Financial Health Check',
        description: 'A 5-minute checkup to assess your overall financial fitness and stability.',
        icon: Activity,
        component: FinancialHealthCheck,
        category: 'Audit'
    },
    {
        slug: 'goal-readiness',
        title: 'Goal Readiness',
        description: 'Evaluate how prepared you are to achieve your specific financial goals.',
        icon: Target,
        component: GoalReadiness,
        category: 'Assessment'
    },
    {
        slug: 'retirement-prep',
        title: 'Retirement Preparedness',
        description: 'See if you are on track for a secure and comfortable retirement.',
        icon: ShieldCheck,
        component: RetirementPrep,
        category: 'Assessment'
    },
    {
        slug: 'spot-scam',
        title: 'Spot a Scam',
        description: 'Protect your money by learning how to identify investment fraud red flags.',
        icon: ShieldAlert,
        component: SpotScamWizard,
        category: 'Education'
    }
];

export const getSurveyBySlug = (slug: string) => surveys.find(s => s.slug === slug);
