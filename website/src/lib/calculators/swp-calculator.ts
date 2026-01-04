export const calculateSwp = (
    totalInvestment: number,
    withdrawalAmount: number,
    expectedReturnRate: number,
    durationYears: number
) => {
    const monthlyRate = expectedReturnRate / 100 / 12;
    const totalMonths = durationYears * 12;

    let currentBalance = totalInvestment;
    let totalWithdrawn = 0;
    let totalInterestEarned = 0;

    const chartData = [];

    // Initial point
    chartData.push({
        month: 0,
        year: 'Start',
        balance: Math.round(currentBalance),
        withdrawn: 0
    });

    for (let month = 1; month <= totalMonths; month++) {
        // Interest earned before withdrawal (usually) or after? 
        // Standard SWP: Money stays invested for the month, earns interest, then withdrawal happens.
        const interest = currentBalance * monthlyRate;
        totalInterestEarned += interest;
        currentBalance += interest;

        // Withdrawal
        let actualWithdrawal = withdrawalAmount;
        if (currentBalance < withdrawalAmount) {
            actualWithdrawal = currentBalance;
            currentBalance = 0;
        } else {
            currentBalance -= withdrawalAmount;
        }

        totalWithdrawn += actualWithdrawal;

        // Add data point for chart (yearly or if balance hits 0)
        if (month % 12 === 0 || currentBalance === 0) {
            chartData.push({
                month,
                year: `Year ${Math.ceil(month / 12)}`,
                balance: Math.max(0, Math.round(currentBalance)),
                withdrawn: Math.round(totalWithdrawn)
            });
        }

        if (currentBalance === 0) break;
    }

    return {
        summary: {
            finalBalance: Math.max(0, Math.round(currentBalance)),
            totalWithdrawn: Math.round(totalWithdrawn),
            totalInterestEarned: Math.round(totalInterestEarned),
            totalInvestment: Math.round(totalInvestment)
        },
        chartData
    };
};
