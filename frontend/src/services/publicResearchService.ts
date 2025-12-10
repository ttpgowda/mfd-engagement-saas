import axios from 'axios';
import {
    SchemeDropdownDto,
    TrailingReturnsResponse,
    AnnualReturn,
    SipResponse,
    FundRankerResponse,
    TopFundsRequest,
    TopFundsResponse,
    FundCompareRequest,
    FundCompareResponse,
    LumpsumRequest,
    LumpsumResponse,
    HistoricalSipRequest,
    HistoricalSipResponse,
    CategoryMonitorResponse,
    BenchmarkMonitorResponse,
    RollingReturnsRequest,
    RollingReturnsResponse,
    FdVsDebtRequest,
    FdVsDebtResponse,
    StpRequest,
    StpResponse,
    SwpRequest,
    SwpResponse
} from './researchService';

// Create a public axios instance without interceptors
const publicApi = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const publicResearchService = {
    /**
     * Fetch list of all available mutual fund categories
     * Endpoint: /api/public/research/funds/categories
     */
    getCategories: async (): Promise<string[]> => {
        const response = await publicApi.get('/api/public/research/funds/categories');
        return response.data;
    },

    /**
     * Fetch schemes belonging to a specific category
     * Endpoint: /api/public/research/funds/schemes?category=...
     */
    getSchemesByCategory: async (category: string): Promise<SchemeDropdownDto[]> => {
        const response = await publicApi.get('/api/public/research/funds/schemes', {
            params: { category }
        });
        return response.data;
    },

    /**
     * Get trailing returns
     * Endpoint: /api/public/research/funds/{schemeCode}/trailing-returns
     */
    getTrailingReturns: async (schemeCode: number): Promise<TrailingReturnsResponse> => {
        const response = await publicApi.get(`/api/public/research/funds/${schemeCode}/trailing-returns`);
        return response.data;
    },

    /**
     * Get annual returns matrix
     * Endpoint: /api/public/research/funds/{schemeCode}/annual-returns
     */
    getAnnualReturns: async (schemeCode: number): Promise<AnnualReturn[]> => {
        const response = await publicApi.get(`/api/public/research/funds/${schemeCode}/annual-returns`);
        return response.data;
    },

    /**
     * Simulate SIP logic
     * Endpoint: /api/public/research/simulate/sip
     */
    simulateSip: async (schemeCode: number, monthlyAmount: number, years: number): Promise<SipResponse> => {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setFullYear(endDate.getFullYear() - years);

        const response = await publicApi.post(`/api/public/research/simulate/sip`, {
            schemeCode,
            monthlyAmount,
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0],
        });
        return response.data;
    },

    /**
     * Get Top Performing Funds
     * Endpoint: /api/public/research/funds/top-performing
     */
    getTopPerformingFunds: async (req: TopFundsRequest): Promise<TopFundsResponse> => {
        const response = await publicApi.post('/api/public/research/funds/top-performing', req);
        return response.data;
    },

    /**
     * Get Fund Comparison
     * Endpoint: /api/public/research/funds/compare
     */
    getFundComparison: async (req: FundCompareRequest): Promise<FundCompareResponse> => {
        const response = await publicApi.post('/api/public/research/funds/compare', req);
        return response.data;
    },

    /**
     * Get Top Lumpsum Funds
     * Endpoint: /api/public/research/funds/lumpsum-ranking
     */
    getTopLumpsumFunds: async (req: LumpsumRequest): Promise<LumpsumResponse> => {
        const response = await publicApi.post('/api/public/research/funds/lumpsum-ranking', req);
        return response.data;
    },

    /**
     * Calculate Historical SIP
     * Endpoint: /api/public/research/calculators/sip-historical
     */
    calculateHistoricalSip: async (req: HistoricalSipRequest): Promise<HistoricalSipResponse> => {
        const response = await publicApi.post('/api/public/research/calculators/sip-historical', req);
        return response.data;
    },

    /**
     * Get Category Monitor
     * Endpoint: /api/public/research/funds/category-monitor
     */
    getCategoryMonitor: async (): Promise<CategoryMonitorResponse[]> => {
        const response = await publicApi.get('/api/public/research/funds/category-monitor');
        return response.data;
    },

    /**
     * Get Benchmark Monitor
     * Endpoint: /api/public/research/funds/benchmark-monitor
     */
    getBenchmarkMonitor: async (): Promise<BenchmarkMonitorResponse[]> => {
        const response = await publicApi.get('/api/public/research/funds/benchmark-monitor');
        return response.data;
    },

    /**
     * Calculate Rolling Returns
     * Endpoint: /api/public/research/funds/rolling-returns-analysis
     */
    calculateRollingReturns: async (req: RollingReturnsRequest): Promise<RollingReturnsResponse> => {
        const response = await publicApi.post('/api/public/research/funds/rolling-returns-analysis', req);
        return response.data;
    },

    /**
     * Compare FD vs Debt
     * Endpoint: /api/public/research/calculators/fd-vs-debt
     */
    compareFdVsDebt: async (req: FdVsDebtRequest): Promise<FdVsDebtResponse> => {
        const response = await publicApi.post('/api/public/research/calculators/fd-vs-debt', req);
        return response.data;
    },

    /**
     * Calculate STP
     * Endpoint: /api/public/research/calculators/stp
     */
    calculateStp: async (req: StpRequest): Promise<StpResponse> => {
        const response = await publicApi.post('/api/public/research/calculators/stp', req);
        return response.data;
    },

    /**
     * Calculate SWP
     * Endpoint: /api/public/research/calculators/swp
     */
    calculateSwp: async (req: SwpRequest): Promise<SwpResponse> => {
        const response = await publicApi.post('/api/public/research/calculators/swp', req);
        return response.data;
    },
};
