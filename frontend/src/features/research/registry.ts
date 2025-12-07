import {
    BarChart3,
    Layers,
    Scale,
    Coins,
    Calculator,
    LayoutDashboard,
    Activity,
    Waves,
    ArrowRightLeft,
    ArrowDownCircle
} from "lucide-react";
import { ResearchToolItem } from "./types";
import TrailingReturnsView from "./views/TrailingReturnsView";
import TopPerformingFundsView from "./views/TopPerformingFundsView";
import FundCompareView from "./views/FundCompareView";
import TopLumpsumView from "./views/TopLumpsumView";
import SipCalculatorView from "./views/SipCalculatorView";
import CategoryMonitorView from "./views/CategoryMonitorView";
import BenchmarkMonitorView from "./views/BenchmarkMonitorView";
import RollingReturnsView from "./views/RollingReturnsView";
import FdVsDebtView from "./views/FdVsDebtView";
import StpCalculatorView from "./views/StpCalculatorView";
import SwpCalculatorView from "./views/SwpCalculatorView";

export const RESEARCH_TOOLS: ResearchToolItem[] = [
    {
        id: 'top-performing',
        title: 'Top Performing Funds',
        description: 'Comprehensive ranking of funds by category with benchmark comparison.',
        icon: Layers,
        component: TopPerformingFundsView
    },
    {
        id: 'category-monitor',
        title: 'Category Monitor',
        description: 'Heatmap view of sector performance and risk analysis.',
        icon: LayoutDashboard,
        component: CategoryMonitorView
    },
    {
        id: 'benchmark-monitor',
        title: 'Benchmark Monitor',
        description: 'Track performance of key market indices (NIFTY, SENSEX).',
        icon: Activity,
        component: BenchmarkMonitorView
    },

    {
        id: 'fund-compare',
        title: 'Fund Comparison',
        description: 'Side-by-side analysis of up to 5 funds with risk ratios.',
        icon: Scale,
        component: FundCompareView
    },
    {
        id: 'trailing-returns',
        title: 'Trailing Returns',
        description: 'Analyze point-to-point performance vs benchmarks.',
        icon: BarChart3,
        component: TrailingReturnsView
    },
    {
        id: 'rolling-returns-analysis',
        title: 'Rolling Returns',
        description: 'The "Gold Standard" for analyzing performance consistency.',
        icon: Waves,
        component: RollingReturnsView
    },

    {
        id: 'sip-calculator',
        title: 'SIP Calculator',
        description: 'Plan wealth creation with Step-Up logic and backtesting.',
        icon: Calculator,
        component: SipCalculatorView
    },
    {
        id: 'top-lumpsum',
        title: 'Lumpsum Returns',
        description: 'Find the biggest wealth creators for one-time investments.',
        icon: Coins,
        component: TopLumpsumView
    },
    {
        id: 'stp-calculator',
        title: 'STP Calculator',
        description: 'Simulate systematic transfers from Debt to Equity.',
        icon: ArrowRightLeft,
        component: StpCalculatorView
    },
    {
        id: 'swp-calculator',
        title: 'SWP Calculator',
        description: 'Plan regular income withdrawals for retirement.',
        icon: ArrowDownCircle,
        component: SwpCalculatorView
    },
    {
        id: 'fd-vs-debt',
        title: 'FD vs Debt Fund',
        description: 'Compare post-tax returns of Fixed Deposits vs Debt Funds.',
        icon: Scale,
        component: FdVsDebtView
    },
];

export const getResearchTool = (id: string) => RESEARCH_TOOLS.find(t => t.id === id);