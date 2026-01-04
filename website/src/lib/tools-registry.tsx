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
        description: 'Calculate the future value of your Systematic Investment Plan (SIP) investments. See how small regular contributions can grow into a large corpus over time.',
        icon: Calculator,
        component: SipCalculator,
        category: 'Investment'
    },
    {
        slug: 'lumpsum-calculator',
        title: 'Lumpsum Calculator',
        description: 'Estimate the potential returns on your one-time mutual fund investment. Understand the power of compounding for lumpsum amounts invested for the long term.',
        icon: Coins,
        component: LumpsumCalculator,
        category: 'Investment'
    },
    {
        slug: 'step-up-sip-calculator',
        title: 'Step Up SIP Calculator',
        description: 'Project your wealth creation by increasing your SIP amount annually. See the massive impact of topping up your investments as your income grows over time.',
        icon: TrendingUp,
        component: StepUpSip,
        category: 'Investment'
    },
    {
        slug: 'sip-vs-lumpsum-calculator',
        title: 'SIP vs Lumpsum',
        description: 'Compare the outcome of investing via SIP versus a one-time Lumpsum. Analyze which strategy works better for your specific financial situation and goals.',
        icon: ArrowUpRight,
        component: SipVsLumpsum,
        category: 'Analysis'
    },
    {
        slug: 'swp-calculator',
        title: 'SWP Calculator',
        description: 'Plan your regular income stream with a Systematic Withdrawal Plan. Determine how long your corpus will last while providing steady monthly withdrawals.',
        icon: PiggyBank,
        component: SwpCalculator,
        category: 'Investment'
    },
    {
        slug: 'child-education-planning',
        title: 'Child Education Planner',
        description: 'Estimate the future cost of your child\'s higher education. Account for inflation and calculate the monthly investment needed to secure their future dreams.',
        icon: GraduationCap,
        component: ChildEducation,
        category: 'Planning'
    },
    {
        slug: 'retirement-planning',
        title: 'Retirement Planner',
        description: 'Calculate the exact corpus you need for a stress-free retirement. Factor in inflation, life expectancy, and current expenses to build a solid retirement plan.',
        icon: User,
        component: RetirementPlanning,
        category: 'Planning'
    },
    {
        slug: 'goal-planner',
        title: 'Goal Planner',
        description: 'Create a customized investment plan for any financial goal. Determine how much you need to save monthly to achieve your target amount within your specific timeline.',
        icon: Target,
        component: GoalPlanner,
        category: 'Planning'
    },
    {
        slug: 'cost-of-delay',
        title: 'Cost of Delay',
        description: 'Quantify the financial loss of delaying your investments. See how waiting just a few years can significantly reduce your final wealth due to lost compounding.',
        icon: Clock,
        component: CostOfDelay,
        category: 'Analysis'
    },
    {
        slug: 'emergency-fund-calculator',
        title: 'Emergency Fund',
        description: 'Calculate the ideal size for your emergency safety net. Ensure you have enough liquid funds to cover 6-12 months of expenses during unexpected life events.',
        icon: ShieldAlert,
        component: EmergencyFund,
        category: 'Planning'
    },
    {
        slug: 'inflation-impact-calculator',
        title: 'Inflation Impact',
        description: 'Visualize how inflation erodes your purchasing power over time. Understand why keeping money idle is risky and see the real future value of your current savings.',
        icon: ArrowUpRight,
        component: InflationImpact,
        category: 'Analysis'
    },
    {
        slug: 'sip-delay-cost-calculator',
        title: 'SIP Delay Cost',
        description: 'Calculate the specific monetary loss incurred by delaying your SIP start date. Understand the penalty of procrastination on your long-term wealth creation.',
        icon: Clock,
        component: SipDelayCost,
        category: 'Analysis'
    }
];

export const getToolBySlug = (slug: string) => tools.find(t => t.slug === slug);
