
import {
    TrendingUp, Clock, Coins, Scale, TrendingDown, Briefcase,
    GraduationCap, Target, ArrowDownCircle, Wallet, ShieldAlert
} from "lucide-react";
import { CalculatorItem } from "./types";

// Omit 'component' from the metadata to avoid circular dependencies in non-component consumers
export type CalculatorMetadata = Omit<CalculatorItem, 'component'>;

export const CALCULATOR_META: CalculatorMetadata[] = [
    {
        id: 'sip-calculator',
        title: 'SIP Calculator',
        description: 'Estimate the future value of your monthly investments.',
        icon: Coins,
    },
    {
        id: 'sip-vs-lumpsum',
        title: 'SIP vs Lumpsum',
        description: 'Compare one-time investment vs spreading it out monthly.',
        icon: Scale,
    },
    {
        id: 'sip-delay-cost',
        title: 'SIP Delay Cost',
        description: 'Analyze the wealth gap created by delaying your start.',
        icon: TrendingDown,
    },
    {
        id: 'cost-of-delay',
        title: 'Cost of Delay (Bar)',
        description: 'Visualize the impact of delaying your investments.',
        icon: Clock,
    },
    {
        id: 'step-up-sip',
        title: 'Step-Up SIP',
        description: 'See the magic of increasing your SIP annually.',
        icon: TrendingUp,
    },
    {
        id: 'retirement-planning',
        title: 'Retirement Planning',
        description: 'Plan your retirement corpus and SIP.',
        icon: Briefcase,
    },
    {
        id: 'child-education',
        title: 'Child Education',
        description: 'Plan for your child\'s future education costs.',
        icon: GraduationCap,
    },
    {
        id: 'goal-planner',
        title: 'Goal Planner',
        description: 'Plan for any financial goal (car, vacation, home).',
        icon: Target,
    },
    {
        id: 'swp-calculator',
        title: 'SWP Calculator',
        description: 'Calculate monthly withdrawals from your investments.',
        icon: ArrowDownCircle,
    },
    {
        id: 'lumpsum-calculator',
        title: 'Lump Sum Calculator',
        description: 'Calculate future value of one-time investment.',
        icon: Wallet,
    },
    {
        id: 'inflation-impact',
        title: 'Inflation Impact',
        description: 'See how inflation erodes your purchasing power.',
        icon: TrendingDown,
    },
    {
        id: 'emergency-fund',
        title: 'Emergency Fund',
        description: 'Calculate how much you need for a rainy day.',
        icon: ShieldAlert,
    }
];
