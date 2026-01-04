export const calculateEmergencyFund = (
    monthlyExpenses: number,
    monthsOfCoverage: number
) => {
    const requiredFund = monthlyExpenses * monthsOfCoverage;

    const chartData = [
        {
            name: 'Monthly Expenses',
            amount: monthlyExpenses,
            fill: '#ef4444' // Red
        },
        {
            name: 'Required Fund',
            amount: requiredFund,
            fill: '#22c55e' // Green
        }
    ];

    return {
        summary: {
            requiredFund: Math.round(requiredFund),
            monthlyExpenses: Math.round(monthlyExpenses),
            monthsOfCoverage
        },
        chartData
    };
};
