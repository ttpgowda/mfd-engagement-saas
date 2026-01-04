export const calculateChildEducation = (
    currentCost: number,
    childAge: number,
    collegeStartAge: number,
    inflationRate: number,
    returnRate: number,
    currentSavings: number
) => {
    const yearsToCollege = Math.max(0, collegeStartAge - childAge);
    const monthsToCollege = yearsToCollege * 12;

    // 1. Future Cost of Education
    // FV = PV * (1 + r)^n
    const futureCost = currentCost * Math.pow(1 + inflationRate / 100, yearsToCollege);

    // 2. Future Value of Current Savings
    const fvCurrentSavings = currentSavings * Math.pow(1 + returnRate / 100, yearsToCollege);

    // 3. Gap to be bridged
    const gap = Math.max(0, futureCost - fvCurrentSavings);

    // 4. Monthly SIP Required
    // SIP = Gap / ( ((1+r)^n - 1)/r * (1+r) )
    const monthlyRate = returnRate / 100 / 12;
    let monthlySipRequired = 0;

    if (gap > 0 && monthsToCollege > 0) {
        if (monthlyRate === 0) {
            monthlySipRequired = gap / monthsToCollege;
        } else {
            monthlySipRequired = gap / (((Math.pow(1 + monthlyRate, monthsToCollege) - 1) / monthlyRate) * (1 + monthlyRate));
        }
    }

    // 5. Generate Chart Data
    const chartData = [];
    let projectedSavings = currentSavings;

    for (let year = 0; year <= yearsToCollege; year++) {
        const age = childAge + year;
        const projectedCost = currentCost * Math.pow(1 + inflationRate / 100, year);

        // Calculate projected savings growth (Current + SIP)
        // This is an approximation for the chart
        if (year > 0) {
            projectedSavings = projectedSavings * (1 + returnRate / 100);
            // Add yearly SIP contribution (approx)
            projectedSavings += (monthlySipRequired * 12) * (1 + returnRate / 100 / 2); // Mid-year approximation
        }

        chartData.push({
            year: `Age ${age}`,
            cost: Math.round(projectedCost),
            savings: Math.round(projectedSavings)
        });
    }

    return {
        summary: {
            futureCost: Math.round(futureCost),
            fvCurrentSavings: Math.round(fvCurrentSavings),
            gap: Math.round(gap),
            monthlySipRequired: Math.round(monthlySipRequired),
            yearsToCollege
        },
        chartData
    };
};
