
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
import { CALCULATOR_META } from "./metadata";
import { CalculatorItem } from "./types";

const COMPONENT_MAP: Record<string, React.ComponentType<any>> = {
    'sip-calculator': SipCalculatorView,
    'sip-vs-lumpsum': SipVsLumpsumView,
    'sip-delay-cost': SipDelayCostView,
    'cost-of-delay': CostOfDelayView,
    'step-up-sip': StepUpSipView,
    'retirement-planning': RetirementPlanningView,
    'child-education': ChildEducationView,
    'goal-planner': GoalPlannerView,
    'swp-calculator': SwpCalculatorView,
    'lumpsum-calculator': LumpsumCalculatorView,
    'inflation-impact': InflationImpactView,
    'emergency-fund': EmergencyFundView,
};

export const CALCULATORS: CalculatorItem[] = CALCULATOR_META.map(meta => ({
    ...meta,
    component: COMPONENT_MAP[meta.id]
}));

export const getCalculator = (id: string) => CALCULATORS.find(c => c.id === id);