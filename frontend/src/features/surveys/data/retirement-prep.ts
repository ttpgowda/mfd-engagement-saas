export interface RetirementQuestion {
    id: number;
    question: string;
    type: "single-select";
    options: string[];
    optionsHint: string[];
    scores: number[]; // 0-4 scale
    weight: number;
}

export interface RetirementPrepData {
    meta: {
        name: string;
        version: string;
        description: string;
    };
    questions: RetirementQuestion[];
    followUps: RetirementQuestion[];
    scoring: {
        thresholds: {
            notPrepared: { max: number; label: string; note: string };
            partiallyPrepared: { min: number; max: number; label: string; note: string };
            prepared: { min: number; max: number; label: string; note: string };
            wellPrepared: { min: number; label: string; note: string };
        };
        recommendedActions: {
            notPrepared: string[];
            partiallyPrepared: string[];
            prepared: string[];
            wellPrepared: string[];
        };
    };
}

export const RETIREMENT_PREP_DATA: RetirementPrepData = {
    meta: {
        name: "Retirement Preparedness",
        version: "1.0",
        description:
            "Assesses how prepared a user is for retirement by measuring clarity, saved corpus, contribution capacity, protection (insurance), and behaviour."
    },
    questions: [
        {
            id: 1,
            question: "At what age do you plan to retire (target retirement age)?",
            type: "single-select",
            options: [
                "Select",
                "Before 55",
                "55 - 60",
                "61 - 65",
                "Above 65",
                "Not sure"
            ],
            optionsHint: [
                "",
                "Early retirement — requires larger corpus/savings rate.",
                "Typical retirement window.",
                "Later retirement — shorter accumulation period.",
                "Very late retirement — lower accumulation pressure but check health.",
                "Uncertain horizon reduces readiness."
            ],
            scores: [0, 2, 3, 4, 2, 0],
            weight: 1.0
        },
        {
            id: 2,
            question: "What annual post-tax income (in today's rupees) would you like during retirement?",
            type: "single-select",
            options: [
                "Select",
                "Up to ₹3 Lakh/year",
                "₹3 Lakh – ₹6 Lakh/year",
                "₹6 Lakh – ₹12 Lakh/year",
                "Over ₹12 Lakh/year",
                "Not sure"
            ],
            optionsHint: [
                "",
                "Frugal/basic lifestyle — lower corpus needed.",
                "Modest comfortable lifestyle.",
                "Comfortable lifestyle with discretionary spend.",
                "High-standard lifestyle — large corpus required.",
                "Estimate improves plan accuracy."
            ],
            scores: [0, 4, 3, 2, 1, 0],
            weight: 1.2
        },
        {
            id: 3,
            question: "How many years until your planned retirement?",
            type: "single-select",
            options: [
                "Select",
                "Under 5 years",
                "5 – 10 years",
                "11 – 20 years",
                "Over 20 years",
                "Not sure"
            ],
            optionsHint: [
                "",
                "Short runway — conservative, immediate actions needed.",
                "Medium-short — need focused catch-up.",
                "Medium — good time to balance growth + safety.",
                "Long — can take advantage of equity compounding.",
                "Unclear horizon lowers readiness."
            ],
            scores: [0, 1, 2, 3, 4, 0],
            weight: 1.4
        },
        {
            id: 4,
            question: "What is your current retirement corpus (sum of PF, EPF, gratuity, NPS, mutual funds earmarked, pension, other)?",
            type: "single-select",
            options: [
                "Select",
                "No corpus / ₹0",
                "Up to ₹10 Lakh",
                "₹10 Lakh – ₹50 Lakh",
                "₹50 Lakh – ₹2 Crore",
                "Over ₹2 Crore",
                "Not sure"
            ],
            optionsHint: [
                "",
                "No savings — low readiness; needs immediate plan.",
                "Early stage — catch-up needed depending on horizon.",
                "Moderate progress.",
                "Strong progress — good readiness if horizon aligns.",
                "Likely well-funded depending on target.",
                "Unclear — recommend quick net-worth & earmark step."
            ],
            scores: [0, 1, 2, 3, 4, 0],
            weight: 1.8
        },
        {
            id: 5,
            question: "What percentage of your current salary or income are you saving for retirement monthly?",
            type: "single-select",
            options: [
                "Select",
                "0% (none)",
                "Under 5%",
                "5% - 10%",
                "10% - 20%",
                "Over 20%"
            ],
            optionsHint: [
                "",
                "No savings — very low readiness.",
                "Low savings — needs aggressive catch-up or extended horizon.",
                "Moderate saving — can work if horizon long.",
                "Good saving rate — strong readiness trajectory.",
                "Excellent saving capacity — high readiness."
            ],
            scores: [0, 0, 1, 2, 3, 4],
            weight: 1.6
        },
        {
            id: 6,
            question: "Do you have any employer/guaranteed pension, provident fund, or annuity income expected in retirement?",
            type: "single-select",
            options: ["Select", "Yes — significant", "Yes — small", "No", "Not sure"],
            optionsHint: [
                "",
                "Significant guaranteed income reduces corpus needed.",
                "Small guaranteed income helps but may not be enough.",
                "No guaranteed income — depends fully on savings/investments.",
                "Unclear — verify pension entitlements."
            ],
            scores: [0, 4, 2, 0, 0],
            weight: 1.2
        },
        {
            id: 7,
            question: "Do you have health insurance that will reasonably cover major medical costs during retirement (or plan to have one)?",
            type: "single-select",
            options: ["Select", "Yes — adequate cover", "Partial cover", "No"],
            optionsHint: [
                "",
                "Adequate cover reduces retirement spending shocks.",
                "Partial cover — some risk remains.",
                "No — major risk to retirement corpus from healthcare costs."
            ],
            scores: [0, 4, 2, 0],
            weight: 1.4
        },
        {
            id: 8,
            question: "How much high-interest debt (credit card/personal loan) will you carry into retirement?",
            type: "single-select",
            options: ["Select", "No debt", "Low (manageable)", "Moderate", "High/significant"],
            optionsHint: [
                "",
                "No debt improves retirement cashflows.",
                "Low — manageable.",
                "Moderate — will reduce retirement cushion.",
                "High — major drag; reduce before retirement."
            ],
            scores: [0, 4, 2, 1, 0],
            weight: 1.3
        },
        {
            id: 9,
            question: "What proportion of your retirement portfolio is currently in growth assets (equity / equity funds) vs debt?",
            type: "single-select",
            options: [
                "Select",
                "Mostly debt / cash (0% - 20% equity)",
                "Conservative (21% - 40% equity)",
                "Balanced (41% - 60% equity)",
                "Growth (61% - 100% equity)",
                "Not sure / haven't earmarked"
            ],
            optionsHint: [
                "",
                "Low equity — low growth potential; suitable for short horizon.",
                "Conservative mix — lower volatility.",
                "Balanced — reasonable for many near-retirees.",
                "High equity — higher growth but higher volatility.",
                "Unclear allocation — needs portfolio review."
            ],
            scores: [0, 1, 2, 3, 4, 0],
            weight: 1.3
        },
        {
            id: 10,
            question: "Have you calculated an inflation-adjusted retirement corpus (i.e., accounting for future price rise)?",
            type: "single-select",
            options: ["Select", "Yes — detailed calculation", "Yes — rough estimate", "No"],
            optionsHint: [
                "",
                "Detailed calc shows planning maturity.",
                "Rough estimate better than none.",
                "No — risk of underestimating corpus."
            ],
            scores: [0, 4, 2, 0],
            weight: 1.1
        },
        {
            id: 11,
            question: "How confident are you that you will not reduce retirement contributions during near-term financial stress?",
            type: "single-select",
            options: [
                "Select",
                "Very confident (automated and protected)",
                "Somewhat confident",
                "Not confident — likely to stop contributions",
                "No contributions currently"
            ],
            optionsHint: [
                "",
                "Automation & discipline are strong predictors of success.",
                "Some discipline — moderate risk to plan.",
                "Behavioural risk likely to derail plan.",
                "No contributions — immediate action needed."
            ],
            scores: [0, 4, 2, 0, 0],
            weight: 1.5
        },
        {
            id: 12,
            question: "Have you discussed or planned how you will draw down your retirement corpus (withdrawal strategy / annuity / systematic withdrawal)?",
            type: "single-select",
            options: ["Select", "Yes — detailed plan", "Yes — basic idea", "No"],
            optionsHint: [
                "",
                "Drawdown planning reduces longevity/cashflow risk.",
                "Basic idea helpful but needs details.",
                "No plan — higher execution risk during retirement."
            ],
            scores: [0, 4, 2, 0],
            weight: 1.0
        },
        {
            id: 13,
            question: "How regularly do you review and rebalance your retirement portfolio?",
            type: "single-select",
            options: [
                "Select",
                "Quarterly or more often",
                "Annually",
                "Rarely (less than once a year)",
                "Never / no monitoring"
            ],
            optionsHint: [
                "",
                "Active and frequent monitoring helps keep plan on track.",
                "Annual is acceptable for many investors.",
                "Rare monitoring increases risk of drift.",
                "No monitoring — high risk."
            ],
            scores: [0, 4, 3, 1, 0],
            weight: 1.0
        },
        {
            id: 14,
            question: "Do you plan to continue any form of paid work (part-time or freelance) during retirement?",
            type: "single-select",
            options: ["Select", "Yes — likely", "Maybe / depends", "No"],
            optionsHint: [
                "",
                "Supplemental income reduces corpus needed.",
                "Possible buffer but not guaranteed.",
                "No — plan depends solely on savings/investments."
            ],
            scores: [0, 3, 2, 0],
            weight: 0.8
        }
    ],
    followUps: [
        {
            id: 21,
            question: "If your corpus falls short at retirement, which fallback would you prefer (choose one)?",
            type: "single-select",
            options: [
                "Select",
                "Downscale lifestyle / reduce expenses",
                "Work part-time during retirement",
                "Delay retirement",
                "Purchase annuity / guaranteed product",
                "Use family support / borrow"
            ],
            optionsHint: [
                "",
                "Downscaling reduces required corpus — practical fallback.",
                "Working reduces pressure on corpus.",
                "Delaying retirement extends accumulation / reduces years to fund.",
                "Annuity provides guaranteed income but may reduce liquidity.",
                "Borrowing/family support is uncertain and risky."
            ],
            scores: [0, 4, 3, 3, 2, 0],
            weight: 1.0
        },
        {
            id: 22,
            question: "Do you have a written retirement plan (with target corpus, contributions, projected returns, withdrawal rules)?",
            type: "single-select",
            options: ["Select", "Yes — written & reviewed", "Draft / informal", "No"],
            optionsHint: [
                "",
                "Written plans are a strong positive indicator.",
                "Draft helps but needs formalization.",
                "No plan — start with a simple written plan."
            ],
            scores: [0, 4, 2, 0],
            weight: 1.0
        },
        {
            id: 23,
            question: "Have you planned for long-term care or eldercare costs (separate from health insurance)?",
            type: "single-select",
            options: ["Select", "Yes — earmarked", "Partially planned", "No"],
            optionsHint: [
                "",
                "Earmarked funds reduce large unexpected drains.",
                "Partial planning helps but may be inadequate.",
                "No — major risk to corpus."
            ],
            scores: [0, 4, 2, 0],
            weight: 0.9
        }
    ],
    scoring: {
        thresholds: {
            notPrepared: { max: 39, label: "Not Prepared", note: "Significant gaps: start immediately with emergency fund, debt reduction, and retirement automation." },
            partiallyPrepared: { min: 40, max: 59, label: "Partially Prepared", note: "On the way: increase contributions, run inflation-adjusted projection, strengthen protections." },
            prepared: { min: 60, max: 79, label: "Prepared", note: "Good position: maintain discipline, refine drawdown strategy and review regularly." },
            wellPrepared: { min: 80, label: "Well Prepared", note: "Strong readiness: fine-tune tax/estate planning and stress-test assumptions." }
        },
        recommendedActions: {
            notPrepared: [
                "Start retirement savings immediately (automate contributions / SIPs)",
                "Build or top-up emergency fund (6–12 months)",
                "Prioritise repayment of high-interest debt",
                "Run a basic projection to estimate required corpus (use inflation 4–6% and real return assumptions)",
                "Consider meeting a financial planner for a catch-up plan"
            ],
            partiallyPrepared: [
                "Increase monthly contributions where possible or extend retirement horizon",
                "Earmark existing investments specifically for retirement",
                "Buy/upgrade health insurance and consider long-term care provisions",
                "Create a basic written retirement plan and review annually"
            ],
            prepared: [
                "Maintain contribution discipline and rebalance portfolio annually",
                "Refine drawdown/annuity strategy and tax planning for retirement income",
                "Stress-test the plan for different return/inflation scenarios",
                "Ensure beneficiaries/estate documents are in order"
            ],
            wellPrepared: [
                "Fine-tune withdrawal rates and tax-efficient income strategies",
                "Look into legacy planning, gifting, and healthcare contingencies",
                "Monitor and adjust for lifestyle changes or major life events"
            ]
        }
    }
};
