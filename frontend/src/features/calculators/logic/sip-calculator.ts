export const calculateSip = (
    monthlyAmount: number,
    years: number,
    rate: number,
    inflationAdjusted: boolean,
    inflationRate: number = 6
) => {
    const monthlyRate = rate / 100 / 12;
    const totalMonths = years * 12;

    let data = [];
    let currentCorpus = 0;
    let totalInvested = 0;

    for (let year = 1; year <= years; year++) {
        // Calculate 12 months for this year
        for (let month = 1; month <= 12; month++) {
            currentCorpus = (currentCorpus + monthlyAmount) * (1 + monthlyRate);
            totalInvested += monthlyAmount;
        }

        // Inflation Adjustment logic
        const displayValue = inflationAdjusted
            ? currentCorpus / Math.pow(1 + inflationRate / 100, year)
            : currentCorpus;

        data.push({
            year: `Year ${year}`,
            corpus: Math.round(displayValue),
            invested: Math.round(totalInvested),
            gain: Math.round(displayValue - totalInvested)
        });
    }

    return {
        chartData: data,
        summary: data[data.length - 1]
    };
};