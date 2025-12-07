package com.engine.mfdengagement.research.service;

import com.engine.mfdengagement.research.dto.*;
import java.util.List;

public interface ResearchService {
    TrailingReturnsResponse getTrailingReturns(Long schemeCode);

    List<AnnualReturnsResponse> getAnnualReturns(Long schemeCode);

    SipResponse simulateSip(SipRequest request);

    List<FundRankerResponse> getTopFunds(String category, String sortBy);

    List<String> getAllCategories();

    List<SchemeDropdownDto> getSchemesByCategory(String category);

    TopFundsResponse getTopPerformingFunds(TopFundsRequest request);

    FundCompareResponse getFundComparison(FundCompareRequest request);

    LumpsumResponse getTopLumpsumFunds(LumpsumRequest request);

    HistoricalSipResponse calculateHistoricalSip(HistoricalSipRequest request);

    List<CategoryMonitorResponse> getCategoryMonitor();

    List<BenchmarkMonitorResponse> getBenchmarkMonitor();

    RollingReturnsResponse calculateRollingReturns(RollingReturnsRequest request);

    FdVsDebtResponse compareFdVsDebt(FdVsDebtRequest request);

    StpResponse calculateStp(StpRequest request);

    SwpResponse calculateSwp(SwpRequest request);
}