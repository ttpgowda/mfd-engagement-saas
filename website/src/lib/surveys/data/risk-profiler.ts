export interface RiskQuestion {
    id: number;
    question: string;
    options: string[];
    optionsHint: string[];
    optionsScore: number[]; // 1 = Low Risk, 4 = High Risk
}

export interface RiskProfileData {
    questions: RiskQuestion[];
    followUps: RiskQuestion[];
}

export const RISK_PROFILER_DATA: RiskProfileData = {
    questions: [
        {
            id: 1,
            question: "What is your age group?",
            options: ["Select", "Under 30", "30 - 45", "46 - 60", "Above 60"],
            optionsHint: [
                "",
                "Longer horizon — can take higher risk for growth.",
                "Balanced horizon — mix of growth + protection.",
                "Shorter horizon — lean towards stability.",
                "Capital protection and income are higher priority."
            ],
            optionsScore: [0, 4, 3, 2, 1]
        },
        {
            id: 2,
            question: "What is your primary investment objective?",
            options: ["Select", "Wealth creation (growth)", "Income generation (regular payouts)", "Capital preservation", "Balanced (growth + protection)"],
            optionsHint: [
                "",
                "Maximise long-term returns; accept volatility.",
                "Stable cashflows with moderate risk.",
                "Minimise downside even if returns are lower.",
                "Moderate approach — mix of both."
            ],
            optionsScore: [0, 4, 2, 1, 3]
        },
        {
            id: 3,
            question: "How would you react if your portfolio fell 20% in a single year?",
            options: [
                "Select",
                "I would sell to avoid further losses",
                "I would stay invested and wait for recovery",
                "I would buy more to take advantage of lower prices",
                "I would review and maybe rebalance but largely stay invested"
            ],
            optionsHint: [
                "",
                "Lower risk tolerance (emotional reaction to loss).",
                "Higher tolerance for volatility.",
                "Higher tolerance and opportunistic mindset.",
                "Moderate tolerance with active management."
            ],
            optionsScore: [0, 1, 3, 4, 3]
        },
        {
            id: 4,
            question: "How much of your annual income can you comfortably invest without affecting lifestyle?",
            options: ["Select", "Under 10%", "10% - 25%", "25% - 50%", "Over 50%"],
            optionsHint: [
                "",
                "Limited capacity to take risk.",
                "Some capacity — moderate risk possible.",
                "Good capacity — can accept higher risk for growth.",
                "High capacity — can take significant market risk."
            ],
            optionsScore: [0, 1, 2, 3, 4]
        },
        {
            id: 5,
            question: "Do you have an emergency fund that covers 6 months of expenses?",
            options: ["Select", "Yes", "No", "Partially (3 months)"],
            optionsHint: [
                "",
                "Strong buffer — more capacity to stay invested.",
                "No buffer — recommend conservative stance until buffer built.",
                "Partial buffer — caution advised."
            ],
            optionsScore: [0, 4, 1, 2] // Yes gives ability to take risk, No reduces it
        },
        {
            id: 6,
            question: "What portion of your total investible assets would you be comfortable allocating to equity (stocks / equity funds)?",
            options: ["Select", "0% - 20%", "21% - 40%", "41% - 60%", "61% - 100%"],
            optionsHint: [
                "",
                "Very conservative allocation.",
                "Conservative to moderate.",
                "Balanced / moderate-aggressive.",
                "Aggressive (higher long-term growth orientation)."
            ],
            optionsScore: [0, 1, 2, 3, 4]
        },
        {
            id: 7,
            question: "If expected equity returns are ~12% over 5 years, what level of annual downside (loss) in a bad year would you accept?",
            options: ["Select", "Up to 5%", "Up to 10%", "Up to 20%", "Over 20%"],
            optionsHint: [
                "",
                "Very low downside tolerance.",
                "Low-moderate tolerance.",
                "Moderate-high tolerance.",
                "High tolerance for volatility."
            ],
            optionsScore: [0, 1, 2, 3, 4]
        },
        {
            id: 8,
            question: "Do you currently have high-interest debt (credit card, personal loan) you are repaying?",
            options: ["Select", "No", "Yes — large amount", "Yes — small/manageable amount"],
            optionsHint: [
                "",
                "No debt improves capacity to take investment risk.",
                "High-interest debt suggests prioritise repayment / conservative investing.",
                "Manageable — can invest but be cautious."
            ],
            optionsScore: [0, 4, 1, 2]
        },
        {
            id: 9,
            question: "How many years of personal investing experience do you have (mutual funds / stocks / other)?",
            options: ["Select", "None", "Under 2 years", "2 - 5 years", "Over 5 years"],
            optionsHint: [
                "",
                "No experience — might prefer simpler, lower-volatility products.",
                "Early experience — learning curve; moderate approach.",
                "Reasonable experience — can handle some volatility.",
                "Experienced — likely better at handling market cycles."
            ],
            optionsScore: [0, 1, 2, 3, 4]
        },
        {
            id: 10,
            question: "How important is capital protection vs higher returns for you?",
            options: ["Select", "Capital protection is top priority", "Balanced — protection and returns equally important", "Higher returns (accept volatility)"],
            optionsHint: [
                "",
                "Prefer conservative portfolios.",
                "Moderate approach.",
                "Comfortable with volatility for higher returns."
            ],
            optionsScore: [0, 1, 3, 4]
        }
    ],

    followUps: [
        {
            id: 11,
            question: "For financial shocks (job loss, medical emergency), can you maintain expenses for 6–12 months without selling investments?",
            options: ["Select", "Yes — comfortably", "Yes — with difficulty", "No"],
            optionsHint: [
                "",
                "Stronger resilience; higher risk possible.",
                "Some resilience; caution warranted.",
                "Low resilience; prefer conservative approach."
            ],
            optionsScore: [0, 4, 2, 1]
        },
        {
            id: 12,
            question: "Would you prefer a single product with steady predictable returns (fixed deposits) or a diversified portfolio with variable returns?",
            options: ["Select", "Prefer predictable fixed-like returns", "Diversified portfolio with variable returns", "A mix of both"],
            optionsHint: [
                "",
                "Conservative preference.",
                "Growth-oriented preference.",
                "Balanced preference."
            ],
            optionsScore: [0, 1, 4, 3]
        }
    ]
};
