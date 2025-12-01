export const calculateSipVsLumpsum = (
    investmentAmount: number, // Total amount available to invest
    years: number,
    rate: number,
    inflationAdjusted: boolean,
    inflationRate: number = 6
) => {
    const monthlyRate = rate / 100 / 12;
    const yearlyRate = rate / 100;

    // Scenario A: Lumpsum (One-time investment of the total amount)
    let lumpsumData = [];
    let currentLumpsum = investmentAmount;

    // Scenario B: SIP (Spreading the total amount over the duration)
    // Monthly SIP amount = Total Amount / (Years * 12)
    const monthlySipAmount = investmentAmount / (years * 12);
    let sipData = [];
    let currentSipCorpus = 0;
    let totalSipInvested = 0;

    for (let year = 1; year <= years; year++) {
        // --- Lumpsum Calc ---
        currentLumpsum = currentLumpsum * (1 + yearlyRate);

        const displayLumpsum = inflationAdjusted
            ? currentLumpsum / Math.pow(1 + inflationRate/100, year)
            : currentLumpsum;

        lumpsumData.push({
            year: `Year ${year}`,
            value: Math.round(displayLumpsum),
            type: 'Lumpsum'
        });

        // --- SIP Calc ---
        for (let month = 1; month <= 12; month++) {
            currentSipCorpus = (currentSipCorpus + monthlySipAmount) * (1 + monthlyRate);
            totalSipInvested += monthlySipAmount;
        }

        const displaySip = inflationAdjusted
            ? currentSipCorpus / Math.pow(1 + inflationRate/100, year)
            : currentSipCorpus;

        sipData.push({
            year: `Year ${year}`,
            value: Math.round(displaySip),
            type: 'SIP'
        });
    }

    // Merge data for the chart
    const chartData = lumpsumData.map((item, index) => ({
        year: item.year,
        lumpsumValue: item.value,
        sipValue: sipData[index].value
    }));

    const finalLumpsum = lumpsumData[lumpsumData.length - 1].value;
    const finalSip = sipData[sipData.length - 1].value;

    return {
        chartData,
        summary: {
            lumpsumValue: finalLumpsum,
            sipValue: finalSip,
            difference: finalLumpsum - finalSip,
            winningStrategy: finalLumpsum > finalSip ? 'Lumpsum' : 'SIP',
            monthlySipAmount: Math.round(monthlySipAmount)
        }
    };
};