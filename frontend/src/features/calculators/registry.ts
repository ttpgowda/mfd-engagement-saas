import { TrendingUp, Clock, Coins, Scale, TrendingDown, Briefcase, GraduationCap, Target, ArrowDownCircle, Wallet, ShieldAlert, Calendar } from "lucide-react";
import CostOfDelayView from "./views/CostOfDelayView";
import StepUpSipView from "./views/StepUpSipView";
import SipCalculatorView from "./views/SipCalculatorView";
import SipVsLumpsumView from "./views/SipVsLumpsumView";
import SipDelayCostView from "./views/SipDelayCostView";
import RetirementPlanningView from "./views/RetirementPlanningView";
import ChildEducationView from "./views/ChildEducationView";
import GoalPlannerView from "./views/GoalPlannerView";
import SwpCalculatorView from "./views/SwpCalculatorView";
import LumpsumCalculatorView from "./views/LumpsumCalculatorView";
import InflationImpactView from "./views/InflationImpactView";
import EmergencyFundView from "./views/EmergencyFundView";
import { CalculatorItem } from "./types";

export const CALCULATORS: CalculatorItem[] = [
    {
        id: 'sip-calculator',
        title: 'SIP Calculator',
        description: 'Estimate the future value of your monthly investments.',
        icon: Coins,
        component: SipCalculatorView
    },
    {
        id: 'sip-vs-lumpsum',
        title: 'SIP vs Lumpsum',
        description: 'Compare one-time investment vs spreading it out monthly.',
        icon: Scale,
        component: SipVsLumpsumView
    },
    {
        id: 'sip-delay-cost',
        title: 'SIP Delay Cost',
        description: 'Analyze the wealth gap created by delaying your start.',
        icon: TrendingDown,
        component: SipDelayCostView
    },
    {
        id: 'cost-of-delay',
        title: 'Cost of Delay (Bar)',
        description: 'Visualize the impact of delaying your investments.',
        icon: Clock,
        component: CostOfDelayView
    },
    {
        id: 'step-up-sip',
        title: 'Step-Up SIP',
        description: 'See the magic of increasing your SIP annually.',
        icon: TrendingUp,
        component: StepUpSipView
    },
    {
        id: 'retirement-planning',
        title: 'Retirement Planning',
        description: 'Plan your retirement corpus and SIP.',
        icon: Briefcase,
        component: RetirementPlanningView
    },
    {
        id: 'child-education',
        title: 'Child Education',
        description: 'Plan for your child\'s future education costs.',
        icon: GraduationCap,
        component: ChildEducationView
    },
    {
        id: 'goal-planner',
        title: 'Goal Planner',
        description: 'Plan for any financial goal (car, vacation, home).',
        icon: Target,
        component: GoalPlannerView
    },
    {
        id: 'swp-calculator',
        title: 'SWP Calculator',
        description: 'Calculate monthly withdrawals from your investments.',
        icon: ArrowDownCircle,
        component: SwpCalculatorView
    },
    {
        id: 'lumpsum-calculator',
        title: 'Lump Sum Calculator',
        description: 'Calculate future value of one-time investment.',
        icon: Wallet,
        component: LumpsumCalculatorView
    },
    {
        id: 'inflation-impact',
        title: 'Inflation Impact',
        description: 'See how inflation erodes your purchasing power.',
        icon: TrendingDown,
        component: InflationImpactView
    },
    {
        id: 'emergency-fund',
        title: 'Emergency Fund',
        description: 'Calculate how much you need for a rainy day.',
        icon: ShieldAlert,
        component: EmergencyFundView
    }
];

export const getCalculator = (id: string) => CALCULATORS.find(c => c.id === id);