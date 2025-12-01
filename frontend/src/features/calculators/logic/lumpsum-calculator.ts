export const calculateLumpsum = (
    investmentAmount: number,
    expectedReturnRate: number,
    durationYears: number
) => {
    // FV = PV * (1 + r)^n
    const futureValue = investmentAmount * Math.pow(1 + expectedReturnRate / 100, durationYears);
    const totalInterest = futureValue - investmentAmount;

    const chartData = [];

    for (let year = 0; year <= durationYears; year++) {
        const projectedValue = investmentAmount * Math.pow(1 + expectedReturnRate / 100, year);
        const interestEarned = projectedValue - investmentAmount;

        chartData.push({
            year: `Year ${year}`,
            investment: investmentAmount,
            interest: Math.round(interestEarned),
            total: Math.round(projectedValue)
        });
    }

    return {
        summary: {
            futureValue: Math.round(futureValue),
            totalInterest: Math.round(totalInterest),
            investmentAmount: Math.round(investmentAmount)
        },
        chartData
    };
};
