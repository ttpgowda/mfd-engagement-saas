export interface SurveyQuestion {
    id: number;
    question: string;
    options: string[];
    optionsHint: string[];
    optionsColor: string[]; // "", "#EC1212" (Red), "#907326" (Orange), "#008A29" (Green)
    hints: string;
}

export interface SurveyData {
    meta: {
        sourceCredit: string;
        sourceUrl: string;
    };
    questions: SurveyQuestion[];
}

export const FINANCIAL_HEALTH_DATA: SurveyData = {
    meta: {
        sourceCredit: "Securities and Exchange Board of India (SEBI)",
        sourceUrl: "https://investor.sebi.gov.in/"
    },
    "questions": [
        {
            "id": 1,
            "question": "Do you have anyone who depends on you financially?",
            "options": ["Select", "Yes", "No"],
            "optionsHint": ["", ""],
            "optionsColor": ["", "", ""],
            "hints": "",
        },
        {
            "id": 2,
            "question": "Do you have life insurance cover for at least 15 to 20 times your annual income?",
            "options": ["Select", "Yes", "No", "Not applicable"],
            "optionsHint": ["It is Great that you have life insurance cover for at least 15 to 20 times your annual income. Life insurance is a key component of financial security.", "As you do not have life insurance cover for at least 15 to 20 times your annual income, it is recommended that you purchase a term life insurance policy with your dependents as nominees. This will ensure they can fend for themselves in the event of unfortunate demise of the breadwinner.", ""],
            "optionsColor": ["", "#008A29", "#EC1212"],
            "hints": "* (If you have sufficient net worth and believe you do not need such an amount of life insurance, you can select 'not applicable')",
        },
        {
            "id": 3,
            "question": "Do you have health insurance for yourself and all your dependents (if applicable)? ",
            "options": ["Select", "I do not have any health insurance", "I have health insurance provided by my employer", "I have personal health insurance", "I have both personal and employer provided insurance", "I have health insurance provided by Central / State Government"],
            "optionsHint": ["As you don’t have any health insurance, it is recommended to purchase a personal health insurance policy for at least Rs. 5 lakhs to 50% of your annual income (which is the higher), covering you.", "As you have health insurance provided by your employer, you can additionally consider purchasing a personal health insurance policy for at least Rs. 5 lakhs to 50% of your annual income (which is the higher), covering you.", "As you have personal health insurance, you may consider purchasing a Super-Top Up policy (policy that covers you over and above your existing primary health insurance policy).", "It is Great that you have both personal and employer provided insurance.", "It is Great that you have health insurance provided by Central/State Government."],
            "optionsColor": ["", "#EC1212", "#008A29", "#008A29", "#008A29", "#008A29"],
            "hints": "* Insurance is a risk management tool, not an investment vehicle",
        },
        {
            "id": 4,
            "question": "How well are you aware of the features, terms and conditions of your health insurance cover?",
            "options": ["Select", "I am well aware", "I am not aware", "I know only the basics"],
            "optionsHint": ["Way to go! This will help you handle cashless and reimbursement claims at ease!", "Please spend time reading these. They are essential for the smooth processing of claims", "You are only one step away from being an expert! Read up more. It will help you handle hospitalizations with confidence."],
            "optionsColor": ["", "#008A29", "#EC1212", "#907326"],
            "hints": "* Insurance is a risk management tool, not an investment vehicle",
        },

        {
            "id": 5,
            "question": "How well can you handle sudden, unexpected expenses?",
            "options": ["Select", "I cannot :(", "I can handle small emergency expenses", "I am confident of handling financial emergencies"],
            "optionsHint": ["As you are not able to handle sudden, unexpected expenses, it is recommended for you to build an emergency fund over the next few months from which you can withdraw immediately (e.g. a savings bank account other than your salary account or main account). The emergency fund should at least be six times your monthly expenses.", "It is a positive start that you can handle small emergency expenses. Additionally, it is recommended to build your emergency fund over the next few months to at least six to twelve times your monthly expenses.", "It is great that you are confident of handling emergency expenses."],
            "optionsColor": ["", "#EC1212", "#907326", "#008A29"],
            "hints": "",
        },
        {
            "id": 6,
            "question": "If you have a credit card do you manage to pay the bill in full before the due date each month?",
            "options": ["Select", "I don't have a credit card", "I pay in full each month", "Occasionally I fail to pay in full", "I often do not pay in full"],
            "optionsHint": ["", "It is Fantastic that you manage to pay your credit card bill in full before due date each month.", "As you occasionally fail in managing to pay your credit card bill in full before due date each month, it is recommended that you curb your spending within your ability to pay. If you don't pay your credit card bill in full on time, you will have to pay late fees, high interest charges and it can cause damage to your credit score, harming your ability to take other loans.", "As you do not pay your credit card bill in full before due date each month very often, you will be charged an annual interest of about 40% or oustanding! Failing to pay in full amount regularly is a sign of a spending problem and it is recommended that you return your credit card and seek the help of a credit / debt counsellor or a Registered investment advisor."],
            "optionsColor": ["", "", "#008A29", "#EC1212", "#EC1212"],
            "hints": "",
        },
        {
            "id": 7,
            "question": "Do you have any personal loans or any unsecured loans?",
            "options": ["Select", "Yes", "No"],
            "optionsHint": ["As you have personal / unsecured loans, it is recommended that you close these loans as soon as possible as their interest rates are high.", "It is Fantastic that you have no personal / unsecured loans."],
            "optionsColor": ["", "#EC1212", "#008A29"],
            "hints": "",
        },
        {
            "id": 8,
            "question": "Is the total EMI you pay towards the home loan, car loan, personal loan etc., greater than 40% of your monthly take-home pay?",
            "options": ["Select", "Yes", "No", "I don't have any debt"],
            "optionsHint": ["As your total EMI towards the home loan, car loan, personal loan etc., is greater than 40% of your monthly take-home pay, it is recommended that you focus on reducing your debt burden. You can consider the possibility of refinancing some debt. Expert advice from a Registered investment advisor may help.", "It is Great that your total EMI towards the home loan, car loan, personal loan etc., is less than 40% of your monthly take-home pay. It is recommended that you continue to keep debt as low as possible as it is the first step towards building wealth.", "It is Great that you don’t have any debt. You can try to invest as much as possible for as long as possible to build a sizeable corpus for retirement or achieving financial freedom."],
            "optionsColor": ["", "#EC1212", "#008A29", "#008A29"],
            "hints": "",
        },
        {
            "id": 9,
            "question": "Do you create a budget for your income?",
            "options": ["Select", "Yes", "No"],
            "optionsHint": ["It is a good habit to create a budget for your income to have control over your spending.", "As you don’t have a budget, it is recommended that you set a budget for income and expenditure each month. You can allocate a maximum target amount that can be spent for different ‘needs’ and ‘wants’. The goal is to not exceed the amount set as a target for 'wants'."],
            "optionsColor": ["", "#008A29", "#EC1212"],
            "hints": "",
        },
        {
            "id": 10,
            "question": "Have you calculated the corpus needed for you to retire comfortably?",
            "options": ["Select", "Yes", "No"],
            "optionsHint": ["It is Great that you have calculated the corpus needed to retire comfortably. Further, you can also consider validating your calculations with our <a href='https://investor.sebi.gov.in/calculators/financial_goal_planner.html' target='_blank'>financial goal planner available on SEBI Investor Website</a>.", "As you have not calculated the corpus needed for you to retire comfortably, you may use the <a href='https://investor.sebi.gov.in/calculators/financial_goal_planner.html' target='_blank'>financial goal planner available on SEBI Investor Website</a> to plan for your retirement and other financial goals. Delaying this exercise can be quite expensive as the total investment amount increases by 10-12% for each year of delay."],
            "optionsColor": ["", "#008A29", "#EC1212", "#8f8f16"],
            "hints": "",
        },
        {
            "id": 11,
            "question": "Are you investing enough for retirement?",
            "options": ["Select", "Yes", "No"],
            "optionsHint": ["It is great that you have invested enough for your financial independence after retirement.", "As you haven’t invested enough for your financial independence after retirement you can begin your retirement planning journey. With focus, discipline and small dash of luck, things will become progressively better. Don't lose heart!"],
            "optionsColor": ["", "#008A29", "#EC1212"],
            "hints": "",
        },
        {
            "id": 12,
            "question": "Have you shared the details of your investments with your spouse/children/or other dependents (as applicable/relevant)?",
            "options": ["Select", "Yes", "No", "I don't have any spouse/children/or other dependents"],
            "optionsHint": ["It is great that you have shared the details of your investments with your spouse/children/or other dependents. Now your net worth can be seamlessly managed by your loved ones in case you are unable to. Further, you can consider including the contact details of a Registered Investment Advisor to guide your family members.", "As you haven’t shared the details of your investments with your spouse/children/or other dependents, it is recommended to discuss your investments with them so that they do not suffer in case you are incapacitated / unable to manage your money", "As you don’t have any spouse/children/other, you can consider taking legal advice on how your investments can be managed if you are incapacitated / unable to do so."],
            "optionsColor": ["", "#008A29", "#EC1212", "#907326"],
            "hints": "",
        },
        {
            "id": 13,
            "question": "Have you added nomination details to all your investments?",
            "options": ["Select", "Yes", "No"],
            "optionsHint": ["It is Great that you have added nomination details to all your investments. Do also keep your nominees informed.", "As you haven’t added nomination details to all your investments, it is recommended you do this immediately! This is a crucial step to ensure your loved ones have easy access to your investments in the event of your demise."],
            "optionsColor": ["", "#008A29", "#EC1212"],
            "hints": "",
        },
        {
            "id": 14,
            "question": "Have you made a will?",
            "options": ["Select", "Yes", "No"],
            "optionsHint": ["Kudos to your foresight for creating a Will! If you ensure that the beneficiaries in the Will are also the nominees (when possible), asset disbursal can be hassle-free.", "A nomination alone is not enough to ensure your assets are distributed to your kin as per your wishes. The provisions of a Will prevail over the nomination. Therefore, it is recommended to create a Will and ensure that beneficiaries in the Will are also the nominees (when possible) for smooth disbursement of the amount."],
            "optionsColor": ["", "#008A29", "#EC1212"],
            "hints": "This allows you to distribute your assets to your relatives/nominees as per your wishes",
        }
    ]
};
