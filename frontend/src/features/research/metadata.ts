
import {
    BarChart3, Layers, Scale, Coins, Calculator, LayoutDashboard,
    Activity, Waves, ArrowRightLeft, ArrowDownCircle
} from "lucide-react";
import { ResearchToolItem } from "./types";

// Omit 'component' from the metadata
export type ResearchToolMetadata = Omit<ResearchToolItem, 'component'>;

export const RESEARCH_TOOL_META: ResearchToolMetadata[] = [
    {
        id: 'top-performing',
        title: 'Top Performing Funds',
        description: 'Comprehensive ranking of funds by category with benchmark comparison.',
        icon: Layers,
    },
    {
        id: 'category-monitor',
        title: 'Category Monitor',
        description: 'Heatmap view of sector performance and risk analysis.',
        icon: LayoutDashboard,
    },
    {
        id: 'benchmark-monitor',
        title: 'Benchmark Monitor',
        description: 'Track performance of key market indices (NIFTY, SENSEX).',
        icon: Activity,
    },
    {
        id: 'fund-compare',
        title: 'Fund Comparison',
        description: 'Side-by-side analysis of up to 5 funds with risk ratios.',
        icon: Scale,
    },
    {
        id: 'trailing-returns',
        title: 'Trailing Returns',
        description: 'Analyze point-to-point performance vs benchmarks.',
        icon: BarChart3,
    },
    {
        id: 'rolling-returns-analysis',
        title: 'Rolling Returns',
        description: 'The "Gold Standard" for analyzing performance consistency.',
        icon: Waves,
    },
    {
        id: 'sip-calculator',
        title: 'SIP Calculator',
        description: 'Plan wealth creation with Step-Up logic and backtesting.',
        icon: Calculator,
    },
    {
        id: 'top-lumpsum',
        title: 'Lumpsum Returns',
        description: 'Find the biggest wealth creators for one-time investments.',
        icon: Coins,
    },
    {
        id: 'stp-calculator',
        title: 'STP Calculator',
        description: 'Simulate systematic transfers from Debt to Equity.',
        icon: ArrowRightLeft,
    },
    {
        id: 'swp-calculator',
        title: 'SWP Calculator',
        description: 'Plan regular income withdrawals for retirement.',
        icon: ArrowDownCircle,
    },
    {
        id: 'fd-vs-debt',
        title: 'FD vs Debt Fund',
        description: 'Compare post-tax returns of Fixed Deposits vs Debt Funds.',
        icon: Scale,
    },
];
