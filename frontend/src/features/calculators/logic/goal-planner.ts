export const calculateGoalPlanner = (
    currentCost: number,
    yearsToGoal: number,
    inflationRate: number,
    returnRate: number,
    currentSavings: number
) => {
    // 1. Future Cost of Goal
    // FV = PV * (1 + r)^n
    const futureCost = currentCost * Math.pow(1 + inflationRate / 100, yearsToGoal);

    // 2. Future Value of Current Savings
    const fvCurrentSavings = currentSavings * Math.pow(1 + returnRate / 100, yearsToGoal);

    // 3. Gap to be bridged
    const gap = Math.max(0, futureCost - fvCurrentSavings);

    // 4. Monthly SIP Required
    const monthlyRate = returnRate / 100 / 12;
    const monthsToGoal = yearsToGoal * 12;
    let monthlySipRequired = 0;

    if (gap > 0 && monthsToGoal > 0) {
        if (monthlyRate === 0) {
            monthlySipRequired = gap / monthsToGoal;
        } else {
            monthlySipRequired = gap / (((Math.pow(1 + monthlyRate, monthsToGoal) - 1) / monthlyRate) * (1 + monthlyRate));
        }
    }

    // 5. Lumpsum Required (Alternative)
    // PV = FV / (1 + r)^n
    let lumpsumRequired = 0;
    if (gap > 0) {
        lumpsumRequired = gap / Math.pow(1 + returnRate / 100, yearsToGoal);
    }

    // 6. Generate Chart Data
    const chartData = [];
    let projectedSavings = currentSavings;

    for (let year = 0; year <= yearsToGoal; year++) {
        const projectedCost = currentCost * Math.pow(1 + inflationRate / 100, year);

        if (year > 0) {
            projectedSavings = projectedSavings * (1 + returnRate / 100);
            // Add yearly SIP contribution (approx)
            projectedSavings += (monthlySipRequired * 12) * (1 + returnRate / 100 / 2);
        }

        chartData.push({
            year: `Year ${year}`,
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
            lumpsumRequired: Math.round(lumpsumRequired)
        },
        chartData
    };
};
