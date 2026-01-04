import { ComponentType } from 'react';
import dynamic from 'next/dynamic';
import { Calculator, TrendingUp, Coins, PiggyBank, GraduationCap, User, Target, Clock, ShieldAlert, ArrowUpRight } from 'lucide-react';

// Dynamic imports for better performance
const SipCalculator = dynamic(() => import('@/components/calculators/SipCalculator'), { ssr: true });
const LumpsumCalculator = dynamic(() => import('@/components/calculators/LumpsumCalculator'), { ssr: true });
const StepUpSip = dynamic(() => import('@/components/calculators/StepUpSip'), { ssr: true });
const SipVsLumpsum = dynamic(() => import('@/components/calculators/SipVsLumpsum'), { ssr: true });
const SwpCalculator = dynamic(() => import('@/components/calculators/SwpCalculator'), { ssr: true });
const ChildEducation = dynamic(() => import('@/components/calculators/ChildEducation'), { ssr: true });
const RetirementPlanning = dynamic(() => import('@/components/calculators/RetirementPlanning'), { ssr: true });
const GoalPlanner = dynamic(() => import('@/components/calculators/GoalPlanner'), { ssr: true });
const CostOfDelay = dynamic(() => import('@/components/calculators/CostOfDelay'), { ssr: true });
const EmergencyFund = dynamic(() => import('@/components/calculators/EmergencyFund'), { ssr: true });
const InflationImpact = dynamic(() => import('@/components/calculators/InflationImpact'), { ssr: true });
const SipDelayCost = dynamic(() => import('@/components/calculators/SipDelayCost'), { ssr: true });

export interface Tool {
    slug: string;
    title: string;
    description: string;
    icon: ComponentType<{ className?: string }>;
    component: ComponentType<any>;
    category: 'Investment' | 'Planning' | 'Analysis';
}

export const tools: Tool[] = [
    {
        slug: 'sip-calculator',
        title: 'SIP Calculator',
        description: 'Calculate returns on your monthly Systematic Investment Plans (SIP).',
        icon: Calculator,
        component: SipCalculator,
        category: 'Investment'
    },
    {
        slug: 'lumpsum-calculator',
        title: 'Lumpsum Calculator',
        description: 'Estimate the future value of your one-time investment.',
        icon: Coins,
        component: LumpsumCalculator,
        category: 'Investment'
    },
    {
        slug: 'step-up-sip-calculator',
        title: 'Step Up SIP Calculator',
        description: 'Calculate returns if you increase your SIP amount annually.',
        icon: TrendingUp,
        component: StepUpSip,
        category: 'Investment'
    },
    {
        slug: 'sip-vs-lumpsum-calculator',
        title: 'SIP vs Lumpsum',
        description: 'Compare returns between monthly SIP and one-time investment.',
        icon: ArrowUpRight,
        component: SipVsLumpsum,
        category: 'Analysis'
    },
    {
        slug: 'swp-calculator',
        title: 'SWP Calculator',
        description: 'Plan your Systematic Withdrawal Plan for regular income.',
        icon: PiggyBank,
        component: SwpCalculator,
        category: 'Investment'
    },
    {
        slug: 'child-education-planning',
        title: 'Child Education Planner',
        description: 'Estimate and plan for your child\'s higher education expenses.',
        icon: GraduationCap,
        component: ChildEducation,
        category: 'Planning'
    },
    {
        slug: 'retirement-planning',
        title: 'Retirement Planner',
        description: 'Calculate the corpus needed for a stress-free retirement.',
        icon: User,
        component: RetirementPlanning,
        category: 'Planning'
    },
    {
        slug: 'goal-planner',
        title: 'Goal Planner',
        description: 'Plan investments to achieve your financial goals.',
        icon: Target,
        component: GoalPlanner,
        category: 'Planning'
    },
    {
        slug: 'cost-of-delay',
        title: 'Cost of Delay',
        description: 'Understand how delaying investments affects your wealth.',
        icon: Clock,
        component: CostOfDelay,
        category: 'Analysis'
    },
    {
        slug: 'emergency-fund-calculator',
        title: 'Emergency Fund',
        description: 'Determine the safety net you need for unexpected expenses.',
        icon: ShieldAlert,
        component: EmergencyFund,
        category: 'Planning'
    },
    {
        slug: 'inflation-impact-calculator',
        title: 'Inflation Impact',
        description: 'Visualize how inflation erodes the value of money over time.',
        icon: ArrowUpRight,
        component: InflationImpact,
        category: 'Analysis'
    },
    {
        slug: 'sip-delay-cost-calculator',
        title: 'SIP Delay Cost',
        description: 'Calculate the loss incurred by delaying your SIP start.',
        icon: Clock,
        component: SipDelayCost,
        category: 'Analysis'
    }
];

export const getToolBySlug = (slug: string) => tools.find(t => t.slug === slug);
