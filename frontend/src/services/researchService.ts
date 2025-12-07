import api from '@/lib/axios';

// --- Interfaces ---

export interface PeriodReturn {
    period: string;
    fundReturn: number;
    // Updated to allow null based on your Java service logic
    benchmarkReturn: number | null;
    alpha: number | null;
}

export interface TrailingReturnsResponse {
    schemeName: string;
    benchmarkName: string;
    periods: PeriodReturn[];
}

export interface AnnualReturn {
    year: number;
    returnPercentage: number;
}

export interface SipResponse {
    totalInvested: number;
    currentValue: number;
    profit: number;
    xirr: number;
    chartData: {
        date: string;
        investedAmount: number;
        currentValue: number;
    }[];
}

export interface FundRankerResponse {
    schemeCode: number;
    schemeName: string;
    category: string;
    alpha3y: number;
    beta3y: number;
    return3y: number;
    sparklineData: number[];
}

export interface SchemeDropdownDto {
    schemeCode: number;
    schemeName: string;
}

export interface TopFundsRequest {
    category: string;
    page: number;
    size: number;
    sortBy: 'return_1y' | 'return_3y' | 'return_5y' | 'return_inception';
    sortDirection: 'ASC' | 'DESC';
}

export interface FundRowDto {
    schemeCode: number;
    schemeName: string;
    return1y: number;
    return3y: number;
    return5y: number;
    returnInception: number;
    stdDev: number;
}

export interface TopFundsResponse {
    category: string;
    benchmark: {
        name: string;
        return1y: number;
        return3y: number;
        return5y: number;
        returnInception: number;
    } | null;
    categoryAverage: {
        return1y: number;
        return3y: number;
        return5y: number;
        returnInception: number;
    };
    funds: FundRowDto[];
    totalPages: number;
    totalElements: number;
    dataAsOn: string;
}

export interface FundCompareRequest {
    schemeCodes: number[];
}

export interface CompareFundData {
    schemeCode: number;
    schemeName: string;
    fundHouse: string;
    category: string;
    benchmarkName: string;
    return1y: number;
    return3y: number;
    return5y: number;
    returnInception: number;
    stdDev: number;
    alpha3y: number;
    beta3y: number;
    sharpeRatio: number;
}

export interface FundCompareResponse {
    funds: CompareFundData[];
    dataAsOn: string;
}

export interface LumpsumRequest {
    category: string;
    years: number;
    amount: number;
    page: number;
    size: number;
}

export interface LumpsumFundRow {
    schemeCode: number;
    schemeName: string;
    startNav: number;
    startDate: string;
    currentNav: number;
    currentDate: string;
    investedAmount: number;
    currentValue: number;
    absoluteReturn: number;
    cagr: number;
}

export interface LumpsumResponse {
    funds: LumpsumFundRow[];
    totalElements: number;
    totalPages: number;
    dataAsOn: string;
}

export interface HistoricalSipRequest {
    schemeCodes: number[];
    amount: number;
    frequency: string;
    startDate: string;
    endDate: string;
    stepUpPercentage: number;
}

export interface HistoricalSipResponse {
    results: {
        schemeCode: number;
        schemeName: string;
        totalInvested: number;
        currentValue: number;
        absoluteReturn: number;
        xirr: number;
        chartData: { date: string, value: number, invested: number }[];
    }[];
}

export interface CategoryMonitorResponse {
    categoryName: string;
    schemeCount: number;
    avgReturn1M: number;
    avgReturn3M: number;
    avgReturn6M: number;
    avgReturn1Y: number;
    avgReturn3Y: number;
    avgReturn5Y: number;
    avgStdDev: number;
    avgAlpha: number;
    outperformance3Y: number;
}

export interface BenchmarkMonitorResponse {
    benchmarkName: string;
    nseSymbol: string;
    return1Y: number;
    return3Y: number;
    return5Y: number;
    returnInception: number;
    stdDev: number;
    sharpeRatio: number;
}

export interface RollingReturnsRequest {
    schemeCodes: number[];
    period: string;
    startDate?: string; // Optional
}

export interface RollingReturnsResponse {
    funds: {
        schemeCode: number;
        schemeName: string;
        stats: {
            average: number;
            max: number;
            min: number;
            positivePercent: number;
            negativePercent: number;
        };
        dataPoints: { date: string; returnVal: number }[];
    }[];
}

export interface FdVsDebtRequest {
    investmentAmount: number;
    fdInterestRate: number;
    debtSchemeCode: number;
    startDate: string;
    endDate: string;
    taxRate: number;
}

export interface FdVsDebtResponse {
    schemeName: string;
    investmentAmount: number;
    fdMaturityValue: number;
    fdPreTaxProfit: number;
    fdTaxLiability: number;
    fdPostTaxValue: number;
    fdPostTaxReturnPercent: number;
    debtMaturityValue: number;
    debtPreTaxProfit: number;
    debtTaxLiability: number;
    debtPostTaxValue: number;
    debtPostTaxReturnPercent: number;
    wealthDifference: number;
    debtWins: boolean;
}

export interface StpRequest {
    initialInvestmentAmount: number;
    transferAmount: number;
    sourceSchemeCode: number;
    targetSchemeCode: number;
    startDate: string;
    stpStartDate: string;
    endDate: string;
    frequency: string;
}

export interface StpResponse {
    sourceSchemeName: string;
    targetSchemeName: string;
    totalTransferred: number;
    finalSourceValue: number;
    finalTargetValue: number;
    totalValue: number;
    totalProfit: number;
    ledger: {
        date: string;
        type: string;          // Added this
        sourceNav: number;     // Added this
        targetNav: number;     // Added this
        sourceMarketValue: number;
        targetMarketValue: number;
        totalPortfolioValue: number;
        unitsSold: number;
        unitsBought: number;
    }[];
}

export interface SwpRequest {
    schemeCode: number;
    initialInvestmentAmount: number;
    investmentDate: string;
    withdrawalAmount: number;
    swpStartDate: string;
    swpEndDate: string;
    frequency: string;
}

export interface SwpResponse {
    schemeName: string;
    totalWithdrawn: number;
    finalValue: number;
    totalProfit: number;
    ledger: {
        date: string;
        nav: number;
        cashFlow: number;
        balanceUnits: number;
        currentValue: number;
    }[];
}
// --- Service ---

export const researchService = {
    /**
     * Fetch list of all available mutual fund categories
     * Endpoint: /api/funds/categories
     */
    getCategories: async (): Promise<string[]> => {
        const response = await api.get('/funds/categories');
        return response.data;
    },

    /**
     * Fetch schemes belonging to a specific category
     * Endpoint: /api/funds/schemes?category=...
     */
    getSchemesByCategory: async (category: string): Promise<SchemeDropdownDto[]> => {
        const response = await api.get('/funds/schemes', {
            params: { category }
        });
        return response.data;
    },

    /**
     * Get trailing returns (1M, 1Y, 3Y, etc.) for a specific scheme
     * Endpoint: /api/funds/{schemeCode}/trailing-returns
     */
    getTrailingReturns: async (schemeCode: number): Promise<TrailingReturnsResponse> => {
        const response = await api.get(`/funds/${schemeCode}/trailing-returns`);
        return response.data;
    },

    /**
     * Get annual returns matrix
     * Endpoint: /api/funds/{schemeCode}/annual-returns
     */
    getAnnualReturns: async (schemeCode: number): Promise<AnnualReturn[]> => {
        const response = await api.get(`/funds/${schemeCode}/annual-returns`);
        return response.data;
    },

    /**
     * Simulate SIP logic
     * Endpoint: /api/simulate/sip
     */
    simulateSip: async (schemeCode: number, monthlyAmount: number, years: number): Promise<SipResponse> => {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setFullYear(endDate.getFullYear() - years);

        const response = await api.post(`/simulate/sip`, {
            schemeCode,
            monthlyAmount,
            // Format dates as YYYY-MM-DD for Java LocalDate compatibility
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0],
        });
        return response.data;
    },

    /**
     * Get Top Funds Ranker
     * Endpoint: /api/funds/ranker
     */
    getTopFunds: async (category: string = 'Equity', sortBy: string = 'alpha_3y'): Promise<FundRankerResponse[]> => {
        const response = await api.get(`/funds/ranker`, {
            params: { category, sortBy },
        });
        return response.data;
    },

    getTopPerformingFunds: async (req: TopFundsRequest): Promise<TopFundsResponse> => {
        const response = await api.post('/funds/top-performing', req);
        return response.data;
    },

    // Add function to researchService object
    getFundComparison: async (req: FundCompareRequest): Promise<FundCompareResponse> => {
        const response = await api.post('/funds/compare', req);
        return response.data;
    },

    // Add to researchService object:
    getTopLumpsumFunds: async (req: LumpsumRequest): Promise<LumpsumResponse> => {
        const response = await api.post('/funds/lumpsum-ranking', req);
        return response.data;
    },

    calculateHistoricalSip: async (req: HistoricalSipRequest): Promise<HistoricalSipResponse> => {
        const response = await api.post('/calculators/sip-historical', req);
        return response.data;
    },

    getCategoryMonitor: async (): Promise<CategoryMonitorResponse[]> => {
        const response = await api.get('/funds/category-monitor');
        return response.data;
    },

    getBenchmarkMonitor: async (): Promise<BenchmarkMonitorResponse[]> => {
        const response = await api.get('/funds/benchmark-monitor');
        return response.data;
    },
    calculateRollingReturns: async (req: RollingReturnsRequest): Promise<RollingReturnsResponse> => {
        const response = await api.post('/funds/rolling-returns-analysis', req);
        return response.data;
    },
    compareFdVsDebt: async (req: FdVsDebtRequest): Promise<FdVsDebtResponse> => {
        const response = await api.post('/calculators/fd-vs-debt', req);
        return response.data;
    },

    calculateStp: async (req: StpRequest): Promise<StpResponse> => {
        const response = await api.post('/calculators/stp', req);
        return response.data;
    },

    calculateSwp: async (req: SwpRequest): Promise<SwpResponse> => {
        const response = await api.post('/calculators/swp', req);
        return response.data;
    },
};