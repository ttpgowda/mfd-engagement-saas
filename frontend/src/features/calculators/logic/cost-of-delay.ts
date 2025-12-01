export const calculateCostOfDelay = (
    delaySipAmount: number,
    delayYears: number,
    delayRate: number,
    delayStart: number
) => {
    const rate = delayRate / 100 / 12;
    const totalMonths = delayYears * 12;
    const delayedMonths = (delayYears - delayStart) * 12;

    // Future Value Formula: P * ((1+r)^n - 1) / r * (1+r)
    const fvStartNow = delaySipAmount * ((Math.pow(1 + rate, totalMonths) - 1) / rate) * (1 + rate);
    const fvStartLater = delaySipAmount * ((Math.pow(1 + rate, delayedMonths) - 1) / rate) * (1 + rate);

    const investedNow = delaySipAmount * totalMonths;
    const investedLater = delaySipAmount * delayedMonths;

    return {
        fvNow: fvStartNow,
        fvLater: fvStartLater,
        costOfDelay: fvStartNow - fvStartLater,
        chartData: [
            { name: 'Start Today', value: Math.round(fvStartNow), invested: investedNow },
            { name: `Start in ${delayStart} Years`, value: Math.round(fvStartLater), invested: investedLater },
        ]
    };
};