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
        description: 'Discover your unique investor personality and risk tolerance. This comprehensive assessment analyzes your financial psychology to recommend the right asset allocation.',
        icon: TrendingUp,
        component: RiskProfiler,
        category: 'Assessment'
    },
    {
        slug: 'financial-health-check',
        title: 'Financial Health Check',
        description: 'Take a 5-minute diagnostic of your personal finances. Evaluate your savings, debt, insurance, and investments to identify strengths and areas for immediate improvement.',
        icon: Activity,
        component: FinancialHealthCheck,
        category: 'Audit'
    },
    {
        slug: 'goal-readiness',
        title: 'Goal Readiness',
        description: 'Are you financially prepared for your major life goals? This tool evaluates your current savings and investment strategy against your specific future targets.',
        icon: Target,
        component: GoalReadiness,
        category: 'Assessment'
    },
    {
        slug: 'retirement-prep',
        title: 'Retirement Preparedness',
        description: 'Assess if your retirement nest egg is on track. We analyze your current corpus, savings rate, and lifestyle expectations to give you a clear preparedness score.',
        icon: ShieldCheck,
        component: RetirementPrep,
        category: 'Assessment'
    },
    {
        slug: 'spot-scam',
        title: 'Spot a Scam',
        description: 'Learn to identify the red flags of financial fraud. Based on SEBI guidelines, this educational tool helps you verify investment opportunities and protect your capital.',
        icon: ShieldAlert,
        component: SpotScamWizard,
        category: 'Education'
    }
];

export const getSurveyBySlug = (slug: string) => surveys.find(s => s.slug === slug);
