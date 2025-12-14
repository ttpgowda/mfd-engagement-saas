// Goal Readiness Survey (Goal Discovery)
export const GOAL_READINESS_SURVEY = {
    meta: {
        name: "Goal Readiness / Goal Discovery",
        version: "1.0",
        description:
            "Collects goal details (type, amount, horizon) and evaluates readiness to pursue that goal using clarity, resources, stability, and behaviour signals."
    },

    // Core discovery + readiness questions
    questions: [
        {
            id: 1,
            question: "What is the primary financial goal you want to achieve?",
            type: "single-select",
            options: [
                "Select",
                "Retirement",
                "Child's education",
                "Home purchase",
                "Car purchase",
                "Short-term travel / holiday",
                "Emergency fund",
                "Wealth creation / investing",
                "Debt repayment",
                "Other (specify)"
            ],
            optionsHint: [
                "",
                "Long horizon — plan long-term investments.",
                "Often multi-year with predictable timeline.",
                "Large lump-sum required; may need loans + downpayment.",
                "Medium-term purchase.",
                "Short-term, typically <3 years.",
                "Safety net — usually highest priority.",
                "Ongoing objective — needs recurring investments.",
                "Prioritise reducing high-interest liabilities first.",
                ""
            ],
            weight: 0.5
        },

        {
            id: 2,
            question: "What is the target amount for this goal (approx.)?",
            type: "single-select",
            options: [
                "Select",
                "Under ₹1 Lakh",
                "₹1 Lakh – ₹5 Lakhs",
                "₹5 Lakhs – ₹20 Lakhs",
                "₹20 Lakhs – ₹1 Crore",
                "Over ₹1 Crore",
                "I don’t know / unsure"
            ],
            optionsHint: [
                "",
                "Small target — easier to fund.",
                "Manageable with medium-term saving.",
                "Significant — requires disciplined investing.",
                "Large — long-term planning needed.",
                "Very large — multi-decade planning or high savings rate.",
                "Clarity improves plan — try estimating actual cost."
            ],
            // scores reflect clarity/resource implications: unknown reduces readiness
            scores: [0, 4, 3, 2, 1, 0, 0],
            weight: 1.0
        },

        {
            id: 3,
            question: "What is your time horizon to achieve this goal?",
            type: "single-select",
            options: [
                "Select",
                "Less than 1 year",
                "1 – 3 years",
                "3 – 5 years",
                "5 – 10 years",
                "More than 10 years",
                "Not sure"
            ],
            optionsHint: [
                "",
                "Short horizon — prefer conservative/liquid instruments.",
                "Short–medium — mix of debt + conservative equity.",
                "Medium — can use balanced growth strategies.",
                "Long — equity-heavy allocation possible.",
                "Very long — benefit from compounding.",
                "Unclear horizon lowers readiness."
            ],
            scores: [0, 1, 2, 3, 4, 4, 0],
            weight: 1.2
        },

        {
            id: 4,
            question: "How much of the target amount have you already saved / earmarked?",
            type: "single-select",
            options: [
                "Select",
                "0% (nothing saved)",
                "1% - 25%",
                "26% - 50%",
                "51% - 75%",
                "Over 75%"
            ],
            optionsHint: [
                "",
                "No progress — lower readiness; need immediate plan.",
                "Early stage — needs discipline and automatic saving.",
                "Good progress — achievable with continued contributions.",
                "Close to goal — high readiness.",
                "Almost there — easy to complete."
            ],
            scores: [0, 0, 1, 2, 3, 4],
            weight: 1.5
        },

        {
            id: 5,
            question: "How confident are you in the accuracy of your target amount (cost estimate)?",
            type: "single-select",
            options: ["Select", "Very confident", "Somewhat confident", "Not confident", "I didn't estimate"],
            optionsHint: [
                "",
                "Good clarity — higher readiness.",
                "Moderate — may need buffer.",
                "Low — needs research before investing.",
                "Unknown — requires clarity first."
            ],
            scores: [0, 4, 2, 0, 0],
            weight: 0.8
        },

        {
            id: 6,
            question: "How soon will you need to start using the money (goal start / payout date)?",
            type: "single-select",
            options: [
                "Select",
                "Immediately / within 6 months",
                "6 months – 1 year",
                "1 – 3 years",
                "3 – 5 years",
                "5+ years",
                "Not sure"
            ],
            optionsHint: [
                "",
                "Immediate need — liquidity & capital preservation priority.",
                "Short-term — low risk instruments preferred.",
                "Medium-term — balanced approach.",
                "Medium-long — can include growth assets.",
                "Long-term — equity allocation acceptable.",
                "Unclear timing reduces readiness."
            ],
            scores: [0, 1, 2, 3, 4, 4, 0],
            weight: 1.0
        },

        {
            id: 7,
            question: "Can you commit a regular monthly contribution towards this goal?",
            type: "single-select",
            options: ["Select", "No", "Yes — small (up to 5% of income)", "Yes — moderate (5–15%)", "Yes — high (over 15%)", "One-time lump-sum available"],
            optionsHint: [
                "",
                "No regular contribution reduces readiness.",
                "Small but steady contributions help — need time.",
                "Good discipline — feasible to reach medium goals.",
                "Strong capacity — high readiness for aggressive targets.",
                "Lump-sum can fast-track certain goals."
            ],
            scores: [0, 0, 1, 3, 4, 2],
            weight: 1.6
        },

        {
            id: 8,
            question: "Do you have an emergency fund covering at least 6 months of expenses?",
            type: "single-select",
            options: ["Select", "Yes — fully funded", "Partially (3 months)", "No"],
            optionsHint: [
                "",
                "Strong buffer — can stay invested without panic.",
                "Some buffer — caution required.",
                "No buffer — build emergency fund before locking funds into long-term illiquid investments."
            ],
            scores: [0, 4, 2, 0],
            weight: 1.4
        },

        {
            id: 9,
            question: "Do you have high-interest liabilities (credit card, personal loans) that you are repaying?",
            type: "single-select",
            options: ["Select", "No", "Yes — manageable", "Yes — significant"],
            optionsHint: [
                "",
                "No debt improves readiness.",
                "Manageable — can pursue goals while servicing debt.",
                "Significant — reduce debt first to improve financial position."
            ],
            scores: [0, 3, 2, 0],
            weight: 1.2
        },

        {
            id: 10,
            question: "How important is this goal compared to your other financial priorities?",
            type: "single-select",
            options: ["Select", "Top priority", "Important but not top", "One of many", "Low priority"],
            optionsHint: [
                "",
                "Top priority — resources likely channelled to it.",
                "Important — reasonable chance to be funded.",
                "Competing priorities — progress may be slow.",
                "Low — unlikely to be funded soon."
            ],
            scores: [0, 4, 3, 2, 0],
            weight: 1.0
        },

        {
            id: 11,
            question: "Do you already have investments earmarked or suitable for this goal (e.g., SIPs, RDs, existing mutual funds)?",
            type: "single-select",
            options: ["Select", "Yes — earmarked investments", "Yes — investments but not earmarked", "No"],
            optionsHint: [
                "",
                "Earmarked investments increase readiness.",
                "Existing investments can be reallocated/earmarked.",
                "No — need to start investing."
            ],
            scores: [0, 4, 2, 0],
            weight: 1.3
        },

        {
            id: 12,
            question: "How consistent is your saving/investing behaviour historically?",
            type: "single-select",
            options: [
                "Select",
                "Very consistent (automated, monthly)",
                "Sometimes consistent",
                "Irregular / occasional",
                "No history of saving/investing"
            ],
            optionsHint: [
                "",
                "Strong habit — higher chance of goal success.",
                "Moderate habit — needs improvement.",
                "Irregular — lower probability without automation.",
                "No history — behaviour change needed."
            ],
            scores: [0, 4, 2, 1, 0],
            weight: 1.4
        },

        {
            id: 13,
            question: "How comfortable are you with potential short-term setbacks (market dips, job changes) while pursuing this goal?",
            type: "single-select",
            options: ["Select", "Very comfortable", "Somewhat comfortable", "Not comfortable", "Would stop investing during setbacks"],
            optionsHint: [
                "",
                "High resilience increases readiness.",
                "Moderate — can continue with some stress.",
                "Low — likely to interrupt plan.",
                "Behaviour likely to derail long-term plans."
            ],
            scores: [0, 4, 2, 0, 0],
            weight: 1.0
        }
    ], // end core questions

    // Optional follow-ups — show when borderline, or when contradictions appear (e.g., short horizon + large target)
    followUps: [
        {
            id: 21,
            question:
                "If you face a shortfall, which fallback would you prefer? (select one)",
            type: "single-select",
            options: [
                "Select",
                "Reduce goal amount / scale back",
                "Extend time horizon",
                "Increase monthly savings",
                "Use debt / loan",
                "Sell other investments"
            ],
            optionsHint: [
                "",
                "Shows acceptance of scaling — workable fallback.",
                "Flexible timeline increases feasibility.",
                "Can increase discipline — good sign.",
                "Debt reduces financial health — cautious.",
                "Selling other goals may indicate weak prioritization."
            ],
            scores: [0, 3, 3, 4, 1, 2],
            weight: 1.0
        },
        {
            id: 22,
            question:
                "How certain are you about continuing your current income level over the next 3 years?",
            type: "single-select",
            options: ["Select", "Very certain", "Somewhat certain", "Uncertain", "Highly uncertain"],
            optionsHint: [
                "",
                "Income stability favors readiness.",
                "Moderate — some caution.",
                "Uncertain — prefer conservative allocations.",
                "Very uncertain — build buffers first."
            ],
            scores: [0, 4, 2, 1, 0],
            weight: 1.0
        },
        {
            id: 23,
            question: "Do you have any planned large expenses in the next 2 years (wedding, surgery, relocation)?",
            type: "single-select",
            options: ["Select", "No", "Yes — small", "Yes — significant"],
            optionsHint: [
                "",
                "No competing large expenses — better readiness.",
                "Small — manageable.",
                "Significant — may conflict with goal funding."
            ],
            scores: [0, 4, 2, 0],
            weight: 0.8
        },
        {
            id: 24,
            question:
                "Would you prefer a conservative plan that ensures goal completion with lower expected returns, or an aggressive plan that risks short-term failure but may hit the target faster?",
            type: "single-select",
            options: ["Select", "Conservative", "Balanced", "Aggressive", "Not sure"],
            optionsHint: [
                "",
                "Conservative indicates prioritizing certainty.",
                "Balanced is middle-ground.",
                "Aggressive needs high discipline and risk capacity.",
                "Uncertainty lowers readiness."
            ],
            scores: [0, 4, 3, 1, 0],
            weight: 1.0
        }
    ],

    // Scoring guidance (client / implementation)
    scoring: {
        explanation:
            "Each question result is mapped to a numeric score (0–4). Compute a weighted sum across answered questions, then normalise to a 0–100 scale.",
        formula: `normalized_score = round( (sum(question_score * question_weight) / sum(max_score_per_question * question_weight)) * 100 )`,
        // Example of max_score_per_question = 4 for all questions that use 0-4 scoring.
        thresholds: {
            notReady: { max: 39, label: "Not Ready", note: "Needs clarity / emergency fund / debt reduction / budgeting first." },
            partiallyReady: { min: 40, max: 69, label: "Partially Ready", note: "Good to start with cautious, automated plans and checkpoints." },
            ready: { min: 70, label: "Ready", note: "Proceed with a full plan: allocation, automation, tax optimisation." }
        },
        // Quick mapping to actions based on score bands
        recommendedActions: {
            notReady: [
                "Build or top-up emergency fund (6 months)",
                "Resolve high-interest debt prioritized over risky investments",
                "Clarify target amount and timeline (research costs)",
                "Start with a small automated savings vehicle (RD / high-yield savings)"
            ],
            partiallyReady: [
                "Automate contributions (SIP / recurring) and track progress monthly",
                "Prefer conservative-to-balanced allocations; use liquid buffers",
                "Re-evaluate target & horizon annually; use milestone-based checkpoints",
                "Consider partial earmarking of existing investments"
            ],
            ready: [
                "Create a goal-specific investment plan (assets + allocation)",
                "Automate contributions and increase SIPs when possible",
                "Use tax-efficient instruments and diversify across debt/equity",
                "Set review cadence (quarterly) and contingency triggers"
            ]
        }
    },

    // UI / flow hints for implementation
    uiHints: {
        recommendedOrder: [
            "1: Goal type + name (Q1)",
            "2: Amount (Q2) + horizon (Q3)",
            "3: Current progress (Q4) + monthly contribution (Q7)",
            "4: Emergency fund (Q8) and high-interest debt (Q9)",
            "5: Behavioural signals (Q12, Q13)",
            "6: Follow-ups only if score lands in Partially Ready band or contradictions (e.g., short horizon + large target)."
        ],
        progressiveDisclosure:
            "Keep the first 5 questions as the 'core' to minimise drop-off. Show further questions as user moves forward, or when the core answers are contradictory/ambiguous.",
        tips:
            "Show inline hints for cost estimates and a 'help me estimate' quick calculator for Q2. If user selects 'I don’t know' for amount or horizon, provide a short estimation helper before scoring."
    }
};
