export const calculateInflationImpact = (
    currentCost: number,
    inflationRate: number,
    timePeriodYears: number
) => {
    // FV = PV * (1 + r)^n
    const futureCost = currentCost * Math.pow(1 + inflationRate / 100, timePeriodYears);
    const costIncrease = futureCost - currentCost;
    const multiplier = futureCost / currentCost;

    const chartData = [];

    for (let year = 0; year <= timePeriodYears; year++) {
        const projectedCost = currentCost * Math.pow(1 + inflationRate / 100, year);

        chartData.push({
            year: `Year ${year}`,
            cost: Math.round(projectedCost)
        });
    }

    return {
        summary: {
            futureCost: Math.round(futureCost),
            costIncrease: Math.round(costIncrease),
            multiplier: multiplier.toFixed(2)
        },
        chartData
    };
};
