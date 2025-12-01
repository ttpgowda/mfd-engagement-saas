export const calculateRetirementPlanning = (
    currentAge: number,
    retirementAge: number,
    lifeExpectancy: number,
    currentMonthlyExpenses: number,
    inflationRate: number,
    preRetirementReturn: number,
    postRetirementReturn: number,
    currentCorpus: number
) => {
    const yearsToRetirement = retirementAge - currentAge;
    const yearsInRetirement = lifeExpectancy - retirementAge;

    // 1. Future Value of Monthly Expenses at Retirement
    // FV = PV * (1 + r)^n
    const monthlyExpensesAtRetirement = currentMonthlyExpenses * Math.pow(1 + inflationRate / 100, yearsToRetirement);

    // 2. Corpus Required at Retirement
    // We need a corpus that can generate 'monthlyExpensesAtRetirement' for 'yearsInRetirement'
    // considering inflation continues during retirement and the corpus earns 'postRetirementReturn'.
    // Real Rate of Return (during retirement) = ((1 + return) / (1 + inflation)) - 1
    const realRate = ((1 + postRetirementReturn / 100) / (1 + inflationRate / 100)) - 1;
    const monthlyRealRate = realRate / 12;
    const monthsInRetirement = yearsInRetirement * 12;

    // PV of an Annuity Due (assuming expenses needed at start of month)
    // Corpus = PMT * ((1 - (1 + r)^-n) / r) * (1 + r)
    let requiredCorpus = 0;
    if (realRate === 0) {
        requiredCorpus = monthlyExpensesAtRetirement * monthsInRetirement;
    } else {
        requiredCorpus = monthlyExpensesAtRetirement * ((1 - Math.pow(1 + monthlyRealRate, -monthsInRetirement)) / monthlyRealRate) * (1 + monthlyRealRate);
    }

    // 3. Future Value of Current Corpus
    const fvCurrentCorpus = currentCorpus * Math.pow(1 + preRetirementReturn / 100, yearsToRetirement);

    // 4. Gap to be bridged
    const gap = requiredCorpus - fvCurrentCorpus;

    // 5. Monthly SIP Required
    // FV of SIP = P * ((1+i)^n - 1) / i * (1+i)
    // We need to find P where FV = gap
    const monthlyPreRetirementRate = preRetirementReturn / 100 / 12;
    const monthsToRetirement = yearsToRetirement * 12;
    
    let monthlySipRequired = 0;
    if (gap > 0) {
        if (monthlyPreRetirementRate === 0) {
            monthlySipRequired = gap / monthsToRetirement;
        } else {
            monthlySipRequired = gap / (((Math.pow(1 + monthlyPreRetirementRate, monthsToRetirement) - 1) / monthlyPreRetirementRate) * (1 + monthlyPreRetirementRate));
        }
    }

    // 6. Generate Chart Data (Growth Phase)
    const chartData = [];
    let currentSavings = currentCorpus;
    let accumulatedSip = 0;

    for (let year = 1; year <= yearsToRetirement; year++) {
        // Grow current savings
        currentSavings = currentSavings * (1 + preRetirementReturn / 100);
        
        // Grow SIP
        // FV of SIP for this year
        const sipForYear = monthlySipRequired * 12;
        // Approximation for chart: Add yearly SIP and grow previous accumulated
        // More precise: Calculate FV of SIP series up to this year
        
        // Let's use the formula for accumulated SIP value at end of year 'year'
        const months = year * 12;
        let sipValue = 0;
        if (monthlyPreRetirementRate === 0) {
            sipValue = monthlySipRequired * months;
        } else {
            sipValue = monthlySipRequired * ((Math.pow(1 + monthlyPreRetirementRate, months) - 1) / monthlyPreRetirementRate) * (1 + monthlyPreRetirementRate);
        }

        chartData.push({
            year: `Age ${currentAge + year}`,
            corpus: Math.round(currentSavings + sipValue),
            required: Math.round(requiredCorpus) // Show the target line? Or maybe just growth
        });
    }

    return {
        summary: {
            monthlyExpensesAtRetirement: Math.round(monthlyExpensesAtRetirement),
            requiredCorpus: Math.round(requiredCorpus),
            fvCurrentCorpus: Math.round(fvCurrentCorpus),
            gap: Math.round(gap),
            monthlySipRequired: Math.round(monthlySipRequired)
        },
        chartData
    };
};
