import { ComponentType, ElementType } from 'react';

export type CalculatorID =
    | 'cost-of-delay'
    | 'step-up-sip'
    | 'sip-calculator'
    | 'sip-vs-lumpsum'
    | 'sip-delay-cost'
    | 'retirement-planning'
    | 'child-education'
    | 'goal-planner'
    | 'swp-calculator'
    | 'lumpsum-calculator'
    | 'inflation-impact'
    | 'emergency-fund';


export interface CalculatorViewProps {
    defaultValues?: Record<string, any>;
    isPublicView?: boolean;
}

export interface CalculatorItem {
    id: CalculatorID;
    title: string;
    description: string;
    /**
     * The icon component (e.g., imported from lucide-react).
     * We use ElementType so you can pass the component reference itself (e.g., icon: Coins).
     */
    icon: ElementType;
    /**
     * The actual view component for the calculator.
     */
    component: ComponentType<CalculatorViewProps>;
}