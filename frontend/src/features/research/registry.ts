
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
import { StpCalculatorView } from "./views/StpCalculatorView";
import SwpCalculatorView from "./views/SwpCalculatorView";

import { RESEARCH_TOOL_META } from "./metadata";

const COMPONENT_MAP: Record<string, React.ComponentType<any>> = {
    'top-performing': TopPerformingFundsView,
    'category-monitor': CategoryMonitorView,
    'benchmark-monitor': BenchmarkMonitorView,
    'fund-compare': FundCompareView,
    'trailing-returns': TrailingReturnsView,
    'rolling-returns-analysis': RollingReturnsView,
    'sip-calculator': SipCalculatorView,
    'top-lumpsum': TopLumpsumView,
    'stp-calculator': StpCalculatorView,
    'swp-calculator': SwpCalculatorView,
    'fd-vs-debt': FdVsDebtView,
};

export const RESEARCH_TOOLS: ResearchToolItem[] = RESEARCH_TOOL_META.map(meta => ({
    ...meta,
    component: COMPONENT_MAP[meta.id]
}));

export const getResearchTool = (id: string) => {
    if (id === 'research-sip') return RESEARCH_TOOLS.find(t => t.id === 'sip-calculator');
    if (id === 'fund-comparison') return RESEARCH_TOOLS.find(t => t.id === 'fund-compare');
    if (id === 'rolling-returns') return RESEARCH_TOOLS.find(t => t.id === 'rolling-returns-analysis');

    // Legacy / Share link aliases
    if (id === 'top-performing-funds') return RESEARCH_TOOLS.find(t => t.id === 'top-performing');
    if (id === 'lumpsum-returns') return RESEARCH_TOOLS.find(t => t.id === 'top-lumpsum');
    if (id === 'research-stp') return RESEARCH_TOOLS.find(t => t.id === 'stp-calculator');
    if (id === 'research-swp') return RESEARCH_TOOLS.find(t => t.id === 'swp-calculator');

    return RESEARCH_TOOLS.find(t => t.id === id);
};