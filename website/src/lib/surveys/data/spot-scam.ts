export interface ScamQuestion {
    id: number;
    question: string;
    options: string[];
    optionsHint: string[]; // Recommendation/Feedback text
    optionsColor: string[]; // ""=neutral, "#0bbd0b"=Green (Safe/Good), "#ff0000" or implied High Risk? 
    // The source HTML uses:
    // #0bbd0b for GREEN (Safe/Good)
    // But logic says: if color is red (#ff0000) -> Red Flag to be counted.
    // The source JSON doesn't actually have #ff0000 in 'optionsColor' array in the HTML snippet provided?
    // Wait, looking closer at HTML source:
    // Q1: ["","#0bbd0b","#0bbd0b","#0bbd0b"] -> All green? That seems wrong for "Guaranteed Returns".
    // The HTML logic code: `if(val['optionsColor']=="#ff0000") { $("#report_red").show(); ... }`
    // BUT the JSON data in the script:
    // "optionsColor" : ["","#0bbd0b","#0bbd0b","#0bbd0b"]
    // This looks like the source HTML might have malformed color data OR I need to interpret the content contextually.
    // Let's look at the content:
    // Q1, Opt 1: "Guaranteed Returns" -> Logic says "All investments carry risk...". Usually a RED FLAG in scams.
    // The source HTML color array seems all same? That might be a bug in the source provided or I misread it?
    // Ah, I see: ` "optionsColor" : ["","#0bbd0b","#0bbd0b","#0bbd0b"],`
    // But later in JS: `if(color=="#ff0000")`
    // I will infer the risk based on the content for this port to be BETTER than the source.
    // "Guaranteed Returns" = RED FLAG.
    // "Verified by SEBI" = GREEN FLAG.
}

export interface SpotScamData {
    meta: {
        title: string;
        description: string;
        sourceCredit: string;
        sourceUrl: string;
    };
    questions: ScamQuestion[];
    guidelines: string[];
}

export const SPOT_SCAM_DATA: SpotScamData = {
    meta: {
        title: "How to Spot a Scam",
        description: "Identify potential investment fraud with this quick checklist adopted from SEBI guidelines.",
        sourceCredit: "Securities and Exchange Board of India (SEBI)",
        sourceUrl: "https://investor.sebi.gov.in/spot-any-scam.html"
    },
    questions: [
        {
            id: 1,
            question: "What does the securities market investment scheme/product/strategy offer?",
            options: [
                "Select",
                "Guaranteed / Assured Returns (e.g., 'Risk-free 12% monthly')",
                "High returns / Quick Daily Returns at low risk",
                "Offers to teach 'secret' strategies for quick money (F&O tricks)",
                "Market-linked returns with clear risk disclosure" // Added a 'Good' option for contrast
            ],
            optionsHint: [
                "",
                "Recommendation: RED FLAG. All investments carry some degree of risk. Returns cannot be guaranteed in the securities market. This is a hallmark of a Ponzi or scam.",
                "Recommendation: RED FLAG. Be wary of anyone promising high returns with low or no risk. High return always dictates high risk.",
                "Recommendation: CAUTION. Investment strategies should be based on sound principles, not 'tricks'. 9 out of 10 retail traders in F&O lose money.",
                "Recommendation: GREEN FLAG. Legitimate investments disclose risks and do not promise fixed high returns."
            ],
            optionsColor: ["", "RED", "RED", "ORANGE", "GREEN"]
        },
        {
            id: 2,
            question: "How did you come to know about this investment opportunity?",
            options: [
                "Select",
                "Social Media 'Experts' (Telegram, WhatsApp, Instagram Reels)",
                "Unsolicited Phone Call / SMS / Email",
                "Friend/Relative (who heard it from someone else)",
                "Registered Investment Advisor / Mutual Fund Distributor"
            ],
            optionsHint: [
                "",
                "Recommendation: HIGH RISK. Many scammers pose as experts on social media. Always verify their SEBI registration before engaging.",
                "Recommendation: HIGH RISK. Legitimate entities rarely cold-call with 'hot tips'. Never share personal info or transfer money based on unsolicited calls.",
                "Recommendation: CAUTION. Affinity fraud is common—scams spread through trust networks. Verify the product independently regardless of who recommended it.",
                "Recommendation: GREEN FLAG. Registered intermediaries act within regulations. Always check their registration number on the SEBI website."
            ],
            optionsColor: ["", "RED", "RED", "ORANGE", "GREEN"]
        },
        {
            id: 3,
            question: "Does the offer include high-pressure tactics or 'too good to be true' claims?",
            options: [
                "Select",
                "Yes - 'Limited time offer', 'Act now or lose out'",
                "Yes - 'Rags to riches' testimonials / Life-changing promises",
                "Yes - Claims to be the 'Next Big Thing' or 'Secret AI Algorithm'",
                "No - They encouraged me to read the documents and take my time"
            ],
            optionsHint: [
                "",
                "Recommendation: RED FLAG. Scammers use urgency to bypass your critical thinking. No reputable professional pushes you to invest immediately without due diligence.",
                "Recommendation: RED FLAG. Testimonials are easily faked. 'Life-changing' promises are typical of get-rich-quick schemes.",
                "Recommendation: RED FLAG. Be skeptical of 'secret' algorithms or buzzwords. If you don't understand it, don't invest.",
                "Recommendation: GREEN FLAG. A professional approach allows you time to research and understand the product."
            ],
            optionsColor: ["", "RED", "RED", "RED", "GREEN"]
        },
        {
            id: 4,
            question: "Is the entity authorised/regulated by SEBI?",
            options: [
                "Select",
                "No / They say they don't need registration",
                "Don't Know / Unsure",
                "Yes (I have verified their registration number on sebi.gov.in)"
            ],
            optionsHint: [
                "",
                "Recommendation: DANGER. Invest only with SEBI-registered entities. Unregulated entities offer no investor protection.",
                "Recommendation: STOP. Do not invest until you verify. Check the SEBI website for their registration status.",
                "Recommendation: GREEN FLAG. Dealing with regulated entities provides a layer of safety and recourse."
            ],
            optionsColor: ["", "RED", "RED", "GREEN"]
        }
    ],
    guidelines: [
        "High returns / Quick Daily Returns: Be suspicious of guaranteed or near-certain returns.",
        "Unregistered Entities: Check if the entity is regulated by SEBI.",
        "False promises: Any investment providing remarkably high returns regardless of market conditions is suspicious.",
        "Complex Strategies: Be wary of 'secret' or highly complex techniques you don't understand.",
        "Documentation: Always check for proper documentation.",
        "Pushy Salesperson: Reputable professionals won't pressure you to 'act now'."
    ]
};
