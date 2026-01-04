export const calculateStepUpSip = (
    amount: number,
    years: number,
    rate: number,
    increase: number,
    inflationAdjusted: boolean,
    inflationRate: number = 6
) => {
    const data = [];
    let currentMonthlySip = amount;
    let totalCorpus = 0;
    let totalInvested = 0;
    const monthlyRate = rate / 100 / 12;

    for (let year = 1; year <= years; year++) {
        for (let month = 1; month <= 12; month++) {
            totalCorpus = (totalCorpus + currentMonthlySip) * (1 + monthlyRate);
            totalInvested += currentMonthlySip;
        }

        const displayValue = inflationAdjusted
            ? totalCorpus / Math.pow(1 + inflationRate / 100, year)
            : totalCorpus;

        data.push({
            year: `Year ${year}`,
            corpus: Math.round(displayValue),
            invested: Math.round(totalInvested),
            growth: Math.round(displayValue - totalInvested)
        });

        currentMonthlySip = currentMonthlySip * (1 + increase / 100);
    }

    return {
        chartData: data,
        summary: data[data.length - 1]
    };
};
