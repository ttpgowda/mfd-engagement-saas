export const calculateSipDelayCost = (
    monthlySip: number,
    totalYears: number,
    rate: number,
    delayMonths: number // User inputs delay in months or years
) => {
    const monthlyRate = rate / 100 / 12;
    const totalMonths = totalYears * 12;

    // Timeline 1: Start Now (Invests for full duration)
    let nowData = [];
    let nowCorpus = 0;
    let nowInvested = 0;

    // Timeline 2: Start Later (Invests for (Total - Delay) months)
    let laterData = [];
    let laterCorpus = 0;
    let laterInvested = 0;

    // We loop through the entire timeline (month 1 to totalMonths)
    for (let month = 1; month <= totalMonths; month++) {
        // --- Logic for "Start Now" ---
        nowCorpus = (nowCorpus + monthlySip) * (1 + monthlyRate);
        nowInvested += monthlySip;

        // --- Logic for "Start Later" ---
        // Only start investing if current month > delayMonths
        if (month > delayMonths) {
            laterCorpus = (laterCorpus + monthlySip) * (1 + monthlyRate);
            laterInvested += monthlySip;
        }

        // Push data points for chart (yearly snapshots to keep chart clean)
        if (month % 12 === 0) {
            nowData.push({
                year: `Year ${month / 12}`,
                corpus: Math.round(nowCorpus),
                invested: Math.round(nowInvested),
                type: 'Start Now'
            });

            laterData.push({
                year: `Year ${month / 12}`,
                corpus: Math.round(laterCorpus),
                invested: Math.round(laterInvested),
                type: 'Start Later'
            });
        }
    }

    // Merge for Recharts
    const chartData = nowData.map((item, i) => ({
        year: item.year,
        nowValue: item.corpus,
        laterValue: laterData[i].corpus
    }));

    const finalNow = nowData[nowData.length - 1];
    const finalLater = laterData[laterData.length - 1];

    return {
        chartData,
        summary: {
            nowCorpus: finalNow.corpus,
            laterCorpus: finalLater.corpus,
            lossAmount: finalNow.corpus - finalLater.corpus,
            delayYears: (delayMonths / 12).toFixed(1)
        }
    };
};