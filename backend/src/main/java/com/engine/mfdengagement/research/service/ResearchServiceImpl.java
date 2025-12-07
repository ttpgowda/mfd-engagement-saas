package com.engine.mfdengagement.research.service;

import com.engine.mfdengagement.research.dto.*;
import com.engine.mfdengagement.research.model.*;
import com.engine.mfdengagement.research.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ResearchServiceImpl implements ResearchService {

    private final SchemeMasterRepository schemeMasterRepository;
    private final SchemeResearchRepository schemeResearchRepository;
    private final SchemeAnalyticsRepository schemeAnalyticsRepository;
    private final BenchmarkAnalyticsRepository benchmarkAnalyticsRepository;
    private final NavHistoryRepository navHistoryRepository;
    private final BenchmarkHistoryRepository benchmarkHistoryRepository;
    private final BenchmarkMasterRepository benchmarkMasterRepository;
    private final ResearchRepository researchRepository;

    @Override
    @Transactional(readOnly = true)
    public TrailingReturnsResponse getTrailingReturns(Long schemeCode) {
        // 1. Fetch Core Data
        SchemeMaster scheme = schemeMasterRepository.findById(schemeCode)
                .orElseThrow(() -> new RuntimeException("Scheme not found: " + schemeCode));

        Optional<SchemeResearch> researchOpt = schemeResearchRepository.findById(schemeCode);
        Optional<SchemeAnalytics> analyticsOpt = schemeAnalyticsRepository.findById(schemeCode);

        // 2. Fetch Benchmark Data
        BenchmarkAnalytics  benchmark = null;
        BenchmarkMaster benchmarkMaster = null;
        String benchmarkName = "N/A";
        if (scheme.getBenchmarkCode() != null) {
            benchmark = benchmarkAnalyticsRepository.findById(scheme.getBenchmarkCode()).orElse(null);
            benchmarkMaster = benchmarkMasterRepository.findById(scheme.getBenchmarkCode()).orElse(null);
            // In a real app, fetch Benchmark Name from BenchmarkMaster
            assert benchmarkMaster != null;
            benchmarkName = "Benchmark (" + benchmarkMaster.getBenchmarkName() + ")";
        }

        List<TrailingReturnsResponse.PeriodReturn> periods = new ArrayList<>();

        // 3. Map Short Term Returns (From SchemeResearch)
        if (researchOpt.isPresent()) {
            SchemeResearch res = researchOpt.get();
            // Note: Benchmark Analytics table might not have 1M/6M/YTD.
            // We show Scheme data even if Benchmark is missing.
            addPeriod(periods, "1M", res.getReturn1m(), null);
            addPeriod(periods, "6M", res.getReturn6m(), null);
            addPeriod(periods, "YTD", res.getReturnYtd(), null);
        }

        // 4. Map Long Term Returns (From SchemeAnalytics)
        if (analyticsOpt.isPresent()) {
            SchemeAnalytics ana = analyticsOpt.get();
            addPeriod(periods, "1Y", ana.getReturn1y(), benchmark != null ? benchmark.getReturn1y() : null);
            addPeriod(periods, "3Y", ana.getReturn3y(), benchmark != null ? benchmark.getReturn3y() : null);
            addPeriod(periods, "5Y", ana.getReturn5y(), benchmark != null ? benchmark.getReturn5y() : null);
            addPeriod(periods, "Inception", ana.getReturnInception(),
                    benchmark != null ? benchmark.getReturnInception() : null);
        }

        return TrailingReturnsResponse.builder()
                .schemeName(scheme.getSchemeName())
                .benchmarkName(benchmarkName)
                .periods(periods)
                .build();
    }

    private void addPeriod(List<TrailingReturnsResponse.PeriodReturn> periods, String period, BigDecimal fundReturn,
            BigDecimal benchmarkReturn) {
        if (fundReturn == null)
            return;

        BigDecimal alpha = null;
        if (benchmarkReturn != null) {
            alpha = fundReturn.subtract(benchmarkReturn);
        }

        periods.add(TrailingReturnsResponse.PeriodReturn.builder()
                .period(period)
                .fundReturn(fundReturn)
                .benchmarkReturn(benchmarkReturn) // Can be null
                .alpha(alpha)
                .build());
    }

    @Override
    public List<AnnualReturnsResponse> getAnnualReturns(Long schemeCode) {
        SchemeResearch fund = schemeResearchRepository.findById(schemeCode)
                .orElseThrow(() -> new RuntimeException("Fund not found"));

        List<AnnualReturnsResponse> returns = new ArrayList<>();
        addAnnualReturn(returns, 2024, fund.getReturn2024());
        addAnnualReturn(returns, 2023, fund.getReturn2023());
        addAnnualReturn(returns, 2022, fund.getReturn2022());
        addAnnualReturn(returns, 2021, fund.getReturn2021());
        addAnnualReturn(returns, 2020, fund.getReturn2020());

        return returns;
    }

    private void addAnnualReturn(List<AnnualReturnsResponse> list, Integer year, BigDecimal ret) {
        if (ret != null) {
            list.add(AnnualReturnsResponse.builder().year(year).returnPercentage(ret).build());
        }
    }

    @Override
    public SipResponse simulateSip(SipRequest request) {
        // Simplified SIP logic for now
        // In a real implementation, we would query NavHistory
        // For this task, I'll implement the logic as described

        List<NavHistory> history = navHistoryRepository.findBySchemeCodeAndNavDateBetweenOrderByNavDateAsc(
                request.getSchemeCode(), request.getStartDate(), request.getEndDate());

        if (history.isEmpty()) {
            throw new RuntimeException("No NAV history found");
        }

        BigDecimal totalUnits = BigDecimal.ZERO;
        BigDecimal totalInvested = BigDecimal.ZERO;
        List<SipResponse.SipPoint> chartData = new ArrayList<>();

        // Naive monthly iteration - in production use proper date logic
        LocalDate currentDate = request.getStartDate();
        int historyIndex = 0;

        while (!currentDate.isAfter(request.getEndDate())) {
            // Find NAV for this date (or next available)
            NavHistory nav = null;
            while (historyIndex < history.size()) {
                NavHistory h = history.get(historyIndex);
                if (!h.getNavDate().isBefore(currentDate)) {
                    nav = h;
                    break;
                }
                historyIndex++;
            }

            if (nav != null) {
                BigDecimal amount = BigDecimal.valueOf(request.getMonthlyAmount());
                BigDecimal navVal = BigDecimal.valueOf(nav.getNavValue());
                BigDecimal units = amount.divide(navVal, 4, RoundingMode.HALF_UP);

                totalUnits = totalUnits.add(units);
                totalInvested = totalInvested.add(amount);

                BigDecimal currentValue = totalUnits.multiply(navVal);

                chartData.add(SipResponse.SipPoint.builder()
                        .date(nav.getNavDate())
                        .investedAmount(totalInvested)
                        .currentValue(currentValue)
                        .build());
            }

            currentDate = currentDate.plusMonths(1);
        }

        // Final calculation
        NavHistory lastNav = history.get(history.size() - 1);
        BigDecimal currentNav = BigDecimal.valueOf(lastNav.getNavValue());
        BigDecimal finalValue = totalUnits.multiply(currentNav);
        BigDecimal profit = finalValue.subtract(totalInvested);

        // XIRR calculation is complex, using a simplified placeholder or library is
        // needed.
        // For now returning 0.0

        return SipResponse.builder()
                .totalInvested(totalInvested)
                .currentValue(finalValue)
                .profit(profit)
                .xirr(0.0) // To be implemented with XIRR logic
                .chartData(chartData)
                .build();
    }

    @Override
    public List<FundRankerResponse> getTopFunds(String category, String sortBy) {
        List<SchemeResearch> funds;
        if ("return_3y".equals(sortBy)) { // Note: return_3y not in SchemeResearch, need to fix
            funds = schemeResearchRepository.findTopFundsByAlpha3y(category); // Fallback
        } else {
            funds = schemeResearchRepository.findTopFundsByAlpha3y(category);
        }

        return funds.stream().limit(10).map(f -> {
            // Fetch sparkline data (simplified 1Y history)
            // For performance, maybe just fetch last 12 points?
            List<Double> sparkline = new ArrayList<>();
            // Placeholder for sparkline

            return FundRankerResponse.builder()
                    .schemeCode(f.getSchemeCode())
                    .schemeName(f.getSchemeMaster().getSchemeName())
                    .category(f.getSchemeMaster().getSchemeCategory())
                    .alpha3y(f.getAlpha3y())
                    .beta3y(f.getBeta3y())
                    .return3y(BigDecimal.ZERO) // Placeholder
                    .sparklineData(sparkline)
                    .build();
        }).collect(Collectors.toList());
    }

    @Override
    public List<String> getAllCategories(){
        return schemeMasterRepository.findDistinctCategories();
    }
    @Override
    public List<SchemeDropdownDto> getSchemesByCategory(String category) {
        List<SchemeMaster> schemeMasters =
                schemeMasterRepository.findBySchemeCategoryAndIsTrackedTrueOrderBySchemeNameAsc(category);

        return schemeMasters.stream()
                .map(s -> new SchemeDropdownDto(
                        s.getSchemeCode(),
                        s.getSchemeName()
                ))
                .toList();
    }

    // In ResearchServiceImpl.java

    @Override
    public TopFundsResponse getTopPerformingFunds(TopFundsRequest request) {
        List<SchemeMaster> schemes = schemeMasterRepository.findBySchemeCategoryAndIsTrackedTrueOrderBySchemeNameAsc(request.getCategory());

        // Note: In a real optimize scenario, use a JOIN query in Repository.
        // Here we iterate for demonstration based on provided snippets.
        List<TopFundsResponse.FundRowDto> allRows = new ArrayList<>();

        BigDecimal sum1y = BigDecimal.ZERO, sum3y = BigDecimal.ZERO, sum5y = BigDecimal.ZERO;
        int count1y = 0, count3y = 0, count5y = 0;
        LocalDate latestDate = LocalDate.now();

        // Used to find the common benchmark for this category
        Long commonBenchmarkCode = null;

        for (SchemeMaster scheme : schemes) {
            Optional<SchemeAnalytics> analyticsOpt = schemeAnalyticsRepository.findById(scheme.getSchemeCode());

            if (analyticsOpt.isPresent()) {
                SchemeAnalytics ana = analyticsOpt.get();
                if(ana.getLastUpdated() != null) latestDate = ana.getLastUpdated();

                // Aggregating for Category Average
                if (ana.getReturn1y() != null) { sum1y = sum1y.add(ana.getReturn1y()); count1y++; }
                if (ana.getReturn3y() != null) { sum3y = sum3y.add(ana.getReturn3y()); count3y++; }
                if (ana.getReturn5y() != null) { sum5y = sum5y.add(ana.getReturn5y()); count5y++; }

                if (commonBenchmarkCode == null && scheme.getBenchmarkCode() != null) {
                    commonBenchmarkCode = scheme.getBenchmarkCode();
                }

                allRows.add(TopFundsResponse.FundRowDto.builder()
                        .schemeCode(scheme.getSchemeCode())
                        .schemeName(scheme.getSchemeName())
                        .return1y(ana.getReturn1y())
                        .return3y(ana.getReturn3y())
                        .return5y(ana.getReturn5y())
                        .returnInception(ana.getReturnInception())
                        .stdDev(ana.getStdDev())
                        .build());
            }
        }

        // 3. Calculate Averages
        TopFundsResponse.CategoryAverageSummary avgSummary = TopFundsResponse.CategoryAverageSummary.builder()
                .return1y(count1y > 0 ? sum1y.divide(BigDecimal.valueOf(count1y), 2, RoundingMode.HALF_UP) : null)
                .return3y(count3y > 0 ? sum3y.divide(BigDecimal.valueOf(count3y), 2, RoundingMode.HALF_UP) : null)
                .return5y(count5y > 0 ? sum5y.divide(BigDecimal.valueOf(count5y), 2, RoundingMode.HALF_UP) : null)
                .build();

        // 4. Fetch Benchmark Info
        TopFundsResponse.BenchmarkSummary benchSummary = null;
        if (commonBenchmarkCode != null) {
            Optional<BenchmarkAnalytics> baOpt = benchmarkAnalyticsRepository.findById(commonBenchmarkCode);
            Optional<BenchmarkMaster> bmOpt = benchmarkMasterRepository.findById(commonBenchmarkCode);

            if (baOpt.isPresent() && bmOpt.isPresent()) {
                BenchmarkAnalytics ba = baOpt.get();
                benchSummary = TopFundsResponse.BenchmarkSummary.builder()
                        .name(bmOpt.get().getBenchmarkName())
                        .return1y(ba.getReturn1y())
                        .return3y(ba.getReturn3y())
                        .return5y(ba.getReturn5y())
                        .returnInception(ba.getReturnInception())
                        .build();
            }
        }

        // 5. Sorting
        Comparator<TopFundsResponse.FundRowDto> comparator = switch (request.getSortBy()) {
            case "return_1y" ->
                    Comparator.comparing(d -> d.getReturn1y() == null ? BigDecimal.valueOf(-999) : d.getReturn1y());
            case "return_5y" ->
                    Comparator.comparing(d -> d.getReturn5y() == null ? BigDecimal.valueOf(-999) : d.getReturn5y());
            case "return_inception" ->
                    Comparator.comparing(d -> d.getReturnInception() == null ? BigDecimal.valueOf(-999) : d.getReturnInception());
            default -> Comparator.comparing(d -> d.getReturn3y() == null ? BigDecimal.valueOf(-999) : d.getReturn3y());
        };

        if ("DESC".equalsIgnoreCase(request.getSortDirection())) {
            comparator = comparator.reversed();
        }
        allRows.sort(comparator);

        // 6. Pagination
        int start = Math.min(request.getPage() * request.getSize(), allRows.size());
        int end = Math.min(start + request.getSize(), allRows.size());
        List<TopFundsResponse.FundRowDto> pagedRows = allRows.subList(start, end);

        return TopFundsResponse.builder()
                .category(request.getCategory())
                .funds(pagedRows)
                .categoryAverage(avgSummary)
                .benchmark(benchSummary)
                .totalElements(allRows.size())
                .totalPages((int) Math.ceil((double) allRows.size() / request.getSize()))
                .dataAsOn(latestDate)
                .build();
    }


    // Add this method to ResearchServiceImpl class

    @Override
    public FundCompareResponse getFundComparison(FundCompareRequest request) {
        List<FundCompareResponse.CompareFundData> list = new ArrayList<>();
        LocalDate latestDate = LocalDate.now();

        if (request.getSchemeCodes() != null && !request.getSchemeCodes().isEmpty()) {
            for (Long code : request.getSchemeCodes()) {
                // Fetch Entities
                SchemeMaster master = schemeMasterRepository.findById(code).orElse(null);
                SchemeAnalytics analytics = schemeAnalyticsRepository.findById(code).orElse(null);
                SchemeResearch research = schemeResearchRepository.findById(code).orElse(null);

                if (master != null && analytics != null) {
                    if (analytics.getLastUpdated() != null) latestDate = analytics.getLastUpdated();

                    String benchName = "N/A";
                    if (master.getBenchmarkCode() != null) {
                        benchName = benchmarkMasterRepository.findById(master.getBenchmarkCode())
                                .map(BenchmarkMaster::getBenchmarkName).orElse("N/A");
                    }

                    list.add(FundCompareResponse.CompareFundData.builder()
                            .schemeCode(master.getSchemeCode())
                            .schemeName(master.getSchemeName())
                            .fundHouse(master.getFundHouse())
                            .category(master.getSchemeCategory())
                            .benchmarkName(benchName)
                            .return1y(analytics.getReturn1y())
                            .return3y(analytics.getReturn3y())
                            .return5y(analytics.getReturn5y())
                            .returnInception(analytics.getReturnInception())
                            .stdDev(analytics.getStdDev())
                            .alpha3y(research != null ? research.getAlpha3y() : null)
                            .beta3y(research != null ? research.getBeta3y() : null)
                            .sharpeRatio(analytics.getSharpeRatio())
                            .build());
                }
            }
        }

        return FundCompareResponse.builder()
                .funds(list)
                .dataAsOn(latestDate)
                .build();
    }

    // ... imports including NavHistory, etc.

    @Override
    public LumpsumResponse getTopLumpsumFunds(LumpsumRequest request) {
        // 1. Fetch Schemes in Category
        List<SchemeMaster> schemes = schemeMasterRepository
                .findBySchemeCategoryAndIsTrackedTrueOrderBySchemeNameAsc(request.getCategory());

        LocalDate endDate = LocalDate.now();
        // Adjust to previous day if today is weekend/holiday logic could be added here,
        // but generally we look for "latest available" or specific date.
        // For simplicity, we calculate target Start Date.
        LocalDate targetStartDate = endDate.minusYears(request.getYears());

        List<LumpsumResponse.LumpsumFundRow> calculatedFunds = new ArrayList<>();
        LocalDate globalLatestDate = endDate;

        // 2. Calculation Loop (Note: In production, use bulk SQL queries for performance)
        for (SchemeMaster scheme : schemes) {
            // A. Get Current NAV (From Analytics or History)
            Optional<SchemeAnalytics> analyticsOpt = schemeAnalyticsRepository.findById(scheme.getSchemeCode());
            if (analyticsOpt.isEmpty()) continue;
            SchemeAnalytics analytics = analyticsOpt.get();

            BigDecimal currentNav = analytics.getNavCurrent();
            LocalDate currentDate = analytics.getLastUpdated();

            if (currentNav == null) continue;
            if (currentDate != null) globalLatestDate = currentDate;

            // B. Get Historical NAV
            // We need to find a NAV record close to targetStartDate.
            // A simple repository method like `findFirstBySchemeCodeAndNavDateLessThanEqualOrderByNavDateDesc` is ideal.
            // Assuming we use NavHistoryRepository:
            Optional<NavHistory> startNavOpt = navHistoryRepository
                    .findTopBySchemeCodeAndNavDateLessThanEqualOrderByNavDateDesc(scheme.getSchemeCode(), targetStartDate);

            if (startNavOpt.isPresent()) {
                NavHistory startHistory = startNavOpt.get();
                BigDecimal startNav = BigDecimal.valueOf(startHistory.getNavValue());

                // If the found date is too far off (e.g., fund didn't exist), skip
                if (startHistory.getNavDate().isBefore(targetStartDate.minusMonths(1))) {
                    continue; // Fund is younger than the requested period
                }

                // C. Calculate Lumpsum Values
                BigDecimal amount = BigDecimal.valueOf(request.getAmount());

                // Units = Amount / StartNAV
                BigDecimal units = amount.divide(startNav, 4, RoundingMode.HALF_UP);

                // Current Value = Units * CurrentNAV
                BigDecimal currentValue = units.multiply(currentNav).setScale(2, RoundingMode.HALF_UP);

                // Absolute Return
                BigDecimal absReturn = currentValue.subtract(amount);

                // CAGR = (CurrentVal / Amount)^(1/n) - 1
                // We use double for power calculation then convert back
                double cagrDouble = Math.pow(currentValue.doubleValue() / amount.doubleValue(), 1.0 / request.getYears()) - 1;
                BigDecimal cagr = BigDecimal.valueOf(cagrDouble * 100).setScale(2, RoundingMode.HALF_UP);

                calculatedFunds.add(LumpsumResponse.LumpsumFundRow.builder()
                        .schemeCode(scheme.getSchemeCode())
                        .schemeName(scheme.getSchemeName())
                        .startNav(startNav)
                        .startDate(startHistory.getNavDate())
                        .currentNav(currentNav)
                        .currentDate(currentDate)
                        .investedAmount(amount)
                        .currentValue(currentValue)
                        .absoluteReturn(absReturn)
                        .cagr(cagr)
                        .build());
            }
        }

        // 3. Sort by Current Value (Descending)
        calculatedFunds.sort(Comparator.comparing(LumpsumResponse.LumpsumFundRow::getCurrentValue).reversed());

        // 4. Paginate
        int start = Math.min(request.getPage() * request.getSize(), calculatedFunds.size());
        int end = Math.min(start + request.getSize(), calculatedFunds.size());
        List<LumpsumResponse.LumpsumFundRow> pagedRows = calculatedFunds.subList(start, end);

        return LumpsumResponse.builder()
                .funds(pagedRows)
                .totalElements(calculatedFunds.size())
                .totalPages((int) Math.ceil((double) calculatedFunds.size() / request.getSize()))
                .dataAsOn(globalLatestDate)
                .build();
    }

    @Override
    public HistoricalSipResponse calculateHistoricalSip(HistoricalSipRequest request) {
        List<HistoricalSipResponse.SipResultRow> results = new ArrayList<>();

        // Validate dates
        if (request.getStartDate() == null || request.getEndDate() == null) {
            throw new IllegalArgumentException("Start and End dates are required");
        }

        for (Long schemeCode : request.getSchemeCodes()) {
            // 1. Fetch Master Info
            SchemeMaster scheme = schemeMasterRepository.findById(schemeCode).orElse(null);
            if (scheme == null) continue;

            // 2. Fetch NAV History (Optimized: Fetch only range)
            List<NavHistory> history = navHistoryRepository
                    .findBySchemeCodeAndNavDateBetweenOrderByNavDateAsc(schemeCode, request.getStartDate(), request.getEndDate());

            if (history.isEmpty()) continue;

            // 3. Simulation Variables
            BigDecimal totalUnits = BigDecimal.ZERO;
            BigDecimal totalInvested = BigDecimal.ZERO;
            BigDecimal currentInstallment = BigDecimal.valueOf(request.getAmount());

            List<HistoricalSipResponse.DateValuePoint> chartData = new ArrayList<>();

            LocalDate nextSipDate = request.getStartDate();
            LocalDate stepUpDate = request.getStartDate().plusYears(1);
            int monthsPassed = 0;

            // 4. Iterate through time
            // We iterate through the history list to find matching dates
            for (int i = 0; i < history.size(); i++) {
                NavHistory navRecord = history.get(i);
                LocalDate navDate = navRecord.getNavDate();

                // Check if we passed the SIP date (handling holidays/weekends implicitly by taking next available)
                if (!navDate.isBefore(nextSipDate)) {
                    // BUY EXECUTION
                    BigDecimal nav = BigDecimal.valueOf(navRecord.getNavValue());
                    if (nav.compareTo(BigDecimal.ZERO) > 0) {
                        BigDecimal unitsBought = currentInstallment.divide(nav, 4, RoundingMode.HALF_UP);
                        totalUnits = totalUnits.add(unitsBought);
                        totalInvested = totalInvested.add(currentInstallment);

                        // Record for Chart
                        BigDecimal curVal = totalUnits.multiply(nav);
                        chartData.add(HistoricalSipResponse.DateValuePoint.builder()
                                .date(navDate)
                                .invested(totalInvested)
                                .value(curVal)
                                .build());

                        // Calculate Next SIP Date
                        if ("Quarterly".equalsIgnoreCase(request.getFrequency())) {
                            nextSipDate = nextSipDate.plusMonths(3);
                            monthsPassed += 3;
                        } else {
                            nextSipDate = nextSipDate.plusMonths(1);
                            monthsPassed += 1;
                        }

                        // Handle Step Up (Annual)
                        if (request.getStepUpPercentage() > 0 && !navDate.isBefore(stepUpDate)) {
                            BigDecimal increase = currentInstallment
                                    .multiply(BigDecimal.valueOf(request.getStepUpPercentage()))
                                    .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
                            currentInstallment = currentInstallment.add(increase);
                            stepUpDate = stepUpDate.plusYears(1);
                        }
                    }
                }
            }

            // 5. Final Calculation
            BigDecimal finalNav = BigDecimal.valueOf(history.get(history.size() - 1).getNavValue());
            BigDecimal finalValue = totalUnits.multiply(finalNav);
            BigDecimal profit = finalValue.subtract(totalInvested);

            // XIRR Calculation (Simplified estimation for display)
            // In production, use a dedicated XIRR library like Apache POI or a custom Newton-Raphson solver
            // Here we return a placeholder 0 or calculate simple CAGR if XIRR is too heavy
            BigDecimal xirr = BigDecimal.ZERO;

            results.add(HistoricalSipResponse.SipResultRow.builder()
                    .schemeCode(schemeCode)
                    .schemeName(scheme.getSchemeName())
                    .totalInvested(totalInvested)
                    .currentValue(finalValue)
                    .absoluteReturn(profit)
                    .xirr(xirr)
                    .chartData(chartData) // Can sample this if too large
                    .build());
        }

        return HistoricalSipResponse.builder().results(results).build();
    }

    @Override
    public List<CategoryMonitorResponse> getCategoryMonitor() {
        List<CategoryMonitorResponse> categories = researchRepository.getCategoryAverages();

        // Post-processing: Calculate Outperformance or format data
        // Example: If you want to compare against a static benchmark like 12%
        categories.forEach(c -> {
            if (c.getAvgReturn3Y() != null) {
                // Simple logic: Compare vs a fixed 10% benchmark for demo
                c.setOutperformance3Y(c.getAvgReturn3Y().subtract(BigDecimal.valueOf(10)));
            }
        });

        // Sort by 3Y Return desc by default
        categories.sort(Comparator.comparing(CategoryMonitorResponse::getAvgReturn3Y,
                Comparator.nullsLast(Comparator.reverseOrder())));

        return categories;
    }

    @Override
    public List<BenchmarkMonitorResponse> getBenchmarkMonitor() {
        List<BenchmarkMonitorResponse> benchmarks = researchRepository.getBenchmarkMonitor();

        // Sort by 1Y Return by default to show current movers
        benchmarks.sort(Comparator.comparing(BenchmarkMonitorResponse::getReturn1Y,
                Comparator.nullsLast(Comparator.reverseOrder())));

        return benchmarks;
    }

    @Override
    public RollingReturnsResponse calculateRollingReturns(RollingReturnsRequest request) {
        List<RollingReturnsResponse.RollingFundData> fundsData = new ArrayList<>();
        int years = parsePeriodToYears(request.getPeriod()); // Helper: "3Y" -> 3

        for (Long schemeCode : request.getSchemeCodes()) {
            SchemeMaster scheme = schemeMasterRepository.findById(schemeCode).orElse(null);
            if (scheme == null) continue;

            // 1. Fetch ALL History (Sorted Date ASC)
            List<NavHistory> history = navHistoryRepository.findAllBySchemeCodeOrderByNavDateAsc(schemeCode);
            if (history.size() < 365 * years) continue; // Not enough data

            List<RollingReturnsResponse.RollingPoint> points = new ArrayList<>();
            BigDecimal sum = BigDecimal.ZERO;
            BigDecimal min = BigDecimal.valueOf(Double.MAX_VALUE);
            BigDecimal max = BigDecimal.valueOf(Double.MIN_VALUE);
            int positiveCount = 0;
            int negativeCount = 0;

            // 2. Rolling Window Algorithm
            // i represents the "End Date" of the window
            for (int i = 0; i < history.size(); i++) {
                NavHistory endRecord = history.get(i);
                LocalDate endDate = endRecord.getNavDate();

                // Find start record (approx N years ago)
                LocalDate targetStartDate = endDate.minusYears(years);

                // Optimization: In a sorted list, we can search efficiently or keep a sliding window index
                // For simplicity here, we assume daily data or scan back
                NavHistory startRecord = findRecordCloseTo(history, targetStartDate, i);

                if (startRecord != null) {
                    // Calculate CAGR
                    BigDecimal startNav = BigDecimal.valueOf(startRecord.getNavValue());
                    BigDecimal endNav = BigDecimal.valueOf(endRecord.getNavValue());

                    if (startNav.doubleValue() > 0) {
                        double cagrDouble = Math.pow(endNav.doubleValue() / startNav.doubleValue(), 1.0 / years) - 1;
                        BigDecimal cagr = BigDecimal.valueOf(cagrDouble * 100);

                        points.add(RollingReturnsResponse.RollingPoint.builder()
                                .date(endDate)
                                .returnVal(cagr)
                                .build());

                        // Stats Aggregation
                        sum = sum.add(cagr);
                        if (cagr.compareTo(max) > 0) max = cagr;
                        if (cagr.compareTo(min) < 0) min = cagr;
                        if (cagr.doubleValue() > 0) positiveCount++; else negativeCount++;
                    }
                }
            }

            if (points.isEmpty()) continue;

            // 3. Build Stats
            RollingReturnsResponse.RollingStats stats = RollingReturnsResponse.RollingStats.builder()
                    .average(sum.divide(BigDecimal.valueOf(points.size()), 2, RoundingMode.HALF_UP))
                    .max(max)
                    .min(min)
                    .positivePercent((double) positiveCount / points.size() * 100)
                    .negativePercent((double) negativeCount / points.size() * 100)
                    .build();

            fundsData.add(RollingReturnsResponse.RollingFundData.builder()
                    .schemeCode(schemeCode)
                    .schemeName(scheme.getSchemeName())
                    .stats(stats)
                    .dataPoints(points)
                    .build());
        }

        return RollingReturnsResponse.builder().funds(fundsData).build();
    }

    // Helper to find NAV N years ago
    private NavHistory findRecordCloseTo(List<NavHistory> history, LocalDate target, int currentIndex) {
        // Look backwards from current index
        for (int j = currentIndex; j >= 0; j--) {
            NavHistory h = history.get(j);
            // Allow a tolerance of 7 days (for weekends/holidays)
            if (!h.getNavDate().isAfter(target) && h.getNavDate().isAfter(target.minusDays(7))) {
                return h;
            }
            if (h.getNavDate().isBefore(target.minusDays(7))) break; // Too far back
        }
        return null;
    }
    /**
     * Helper to convert period strings (e.g., "1Y", "3Y") into integer years.
     * Used for window calculations in Rolling Returns analysis.
     */
    private int parsePeriodToYears(String period) {
        if (period == null || period.isEmpty()) {
            return 3; // Default fallback
        }
        try {
            // Removes all non-numeric characters (e.g., "Y") and parses the integer
            String numericValue = period.replaceAll("[^0-9]", "");
            return Integer.parseInt(numericValue);
        } catch (NumberFormatException e) {
            return 3; // Default fallback on error
        }
    }

    @Override
    public FdVsDebtResponse compareFdVsDebt(FdVsDebtRequest request) {
        // 1. Fetch Debt Fund Data
        SchemeMaster scheme = schemeMasterRepository.findById(request.getDebtSchemeCode())
                .orElseThrow(() -> new RuntimeException("Scheme not found"));

        // Fetch NAVs close to start and end dates
        NavHistory startNavRecord = navHistoryRepository
                .findTopBySchemeCodeAndNavDateLessThanEqualOrderByNavDateDesc(scheme.getSchemeCode(), request.getStartDate())
                .orElse(null);

        NavHistory endNavRecord = navHistoryRepository
                .findTopBySchemeCodeAndNavDateLessThanEqualOrderByNavDateDesc(scheme.getSchemeCode(), request.getEndDate())
                .orElse(null);

        if (startNavRecord == null || endNavRecord == null) {
            throw new RuntimeException("NAV data not available for the selected period");
        }

        double startNav = startNavRecord.getNavValue();
        double endNav = endNavRecord.getNavValue();
        double amount = request.getInvestmentAmount();

        // 2. Calculate Debt Fund Returns (Actual Historical)
        double units = amount / startNav;
        double debtMaturityValue = units * endNav;
        double debtPreTaxProfit = debtMaturityValue - amount;

        // Tax Logic: As per new rules (April 2023), Debt funds are taxed at slab rate (same as FD)
        // assuming < 35% equity. We apply the user's provided tax slab.
        double debtTaxLiability = debtPreTaxProfit * (request.getTaxRate() / 100.0);
        double debtPostTaxValue = debtMaturityValue - debtTaxLiability;
        double debtPostTaxReturn = ((debtPostTaxValue - amount) / amount) * 100.0;


        // 3. Calculate Fixed Deposit Returns (Compound Interest)
        // Formula: A = P(1 + r/n)^(nt) -> Assuming Annual Compounding (n=1)
        long daysBetween = java.time.temporal.ChronoUnit.DAYS.between(request.getStartDate(), request.getEndDate());
        double years = daysBetween / 365.25;

        double fdMaturityValue = amount * Math.pow((1 + request.getFdInterestRate() / 100.0), years);
        double fdPreTaxProfit = fdMaturityValue - amount;

        // FD Tax: Taxed at slab rate
        double fdTaxLiability = fdPreTaxProfit * (request.getTaxRate() / 100.0);
        double fdPostTaxValue = fdMaturityValue - fdTaxLiability;
        double fdPostTaxReturn = ((fdPostTaxValue - amount) / amount) * 100.0;

        return FdVsDebtResponse.builder()
                .schemeName(scheme.getSchemeName())
                .investmentAmount(amount)

                .fdMaturityValue(Math.round(fdMaturityValue))
                .fdPreTaxProfit(Math.round(fdPreTaxProfit))
                .fdTaxLiability(Math.round(fdTaxLiability))
                .fdPostTaxValue(Math.round(fdPostTaxValue))
                .fdPostTaxReturnPercent(fdPostTaxReturn)

                .debtMaturityValue(Math.round(debtMaturityValue))
                .debtPreTaxProfit(Math.round(debtPreTaxProfit))
                .debtTaxLiability(Math.round(debtTaxLiability))
                .debtPostTaxValue(Math.round(debtPostTaxValue))
                .debtPostTaxReturnPercent(debtPostTaxReturn)

                .wealthDifference(Math.round(debtPostTaxValue - fdPostTaxValue))
                .debtWins(debtPostTaxValue > fdPostTaxValue)
                .build();
    }

    @Override
    public StpResponse calculateStp(StpRequest request) {
        // 1. Fetch Schemes
        SchemeMaster source = schemeMasterRepository.findById(request.getSourceSchemeCode()).orElse(null);
        SchemeMaster target = schemeMasterRepository.findById(request.getTargetSchemeCode()).orElse(null);

        if (source == null || target == null) throw new RuntimeException("Schemes not found");

        List<StpResponse.StpTransactionRow> ledger = new ArrayList<>();

        // 2. Initial Investment in Source Fund
        NavHistory initialNavRec = navHistoryRepository.findTopBySchemeCodeAndNavDateLessThanEqualOrderByNavDateDesc(
                source.getSchemeCode(), request.getStartDate()).orElseThrow(() -> new RuntimeException("NAV missing for start date"));

        BigDecimal initialNav = BigDecimal.valueOf(initialNavRec.getNavValue());
        BigDecimal initialUnits = BigDecimal.valueOf(request.getInitialInvestmentAmount())
                .divide(initialNav, 4, RoundingMode.HALF_UP);

        BigDecimal sourceBalanceUnits = initialUnits;
        BigDecimal targetBalanceUnits = BigDecimal.ZERO;
        BigDecimal totalTransferred = BigDecimal.ZERO;

        ledger.add(StpResponse.StpTransactionRow.builder()
                .date(request.getStartDate())
                .type("INITIAL_INVESTMENT")
                .sourceNav(initialNav)
                .unitsBought(initialUnits) // Technically bought in source
                .sourceBalanceUnits(sourceBalanceUnits)
                .sourceMarketValue(BigDecimal.valueOf(request.getInitialInvestmentAmount()))
                .targetBalanceUnits(BigDecimal.ZERO)
                .targetMarketValue(BigDecimal.ZERO)
                .totalPortfolioValue(BigDecimal.valueOf(request.getInitialInvestmentAmount()))
                .build());

        // 3. STP Loop
        LocalDate nextDate = request.getStpStartDate();
        while (!nextDate.isAfter(request.getEndDate()) && sourceBalanceUnits.doubleValue() > 0.1) { // Stop if source empty

            // Find NAVs for this transfer date
            NavHistory srcNavRec = navHistoryRepository.findTopBySchemeCodeAndNavDateLessThanEqualOrderByNavDateDesc(
                    source.getSchemeCode(), nextDate).orElse(null);
            NavHistory tgtNavRec = navHistoryRepository.findTopBySchemeCodeAndNavDateLessThanEqualOrderByNavDateDesc(
                    target.getSchemeCode(), nextDate).orElse(null);

            if (srcNavRec != null && tgtNavRec != null) {
                BigDecimal srcNav = BigDecimal.valueOf(srcNavRec.getNavValue());
                BigDecimal tgtNav = BigDecimal.valueOf(tgtNavRec.getNavValue());
                BigDecimal transferAmt = BigDecimal.valueOf(request.getTransferAmount());

                // Check if enough money in source
                BigDecimal sourceValue = sourceBalanceUnits.multiply(srcNav);
                if (sourceValue.compareTo(transferAmt) < 0) {
                    transferAmt = sourceValue; // Transfer remaining balance
                }

                // EXECUTE SWP from Source
                BigDecimal unitsSold = transferAmt.divide(srcNav, 4, RoundingMode.HALF_UP);
                sourceBalanceUnits = sourceBalanceUnits.subtract(unitsSold);

                // EXECUTE SIP into Target
                BigDecimal unitsBought = transferAmt.divide(tgtNav, 4, RoundingMode.HALF_UP);
                targetBalanceUnits = targetBalanceUnits.add(unitsBought);
                totalTransferred = totalTransferred.add(transferAmt);

                // Record State
                ledger.add(StpResponse.StpTransactionRow.builder()
                        .date(nextDate)
                        .type("STP_TRANSFER")
                        .sourceNav(srcNav)
                        .unitsSold(unitsSold)
                        .sourceBalanceUnits(sourceBalanceUnits)
                        .sourceMarketValue(sourceBalanceUnits.multiply(srcNav))
                        .targetNav(tgtNav)
                        .unitsBought(unitsBought)
                        .targetBalanceUnits(targetBalanceUnits)
                        .targetMarketValue(targetBalanceUnits.multiply(tgtNav))
                        .totalPortfolioValue(sourceBalanceUnits.multiply(srcNav).add(targetBalanceUnits.multiply(tgtNav)))
                        .build());
            }

            // Increment Date
            if ("Weekly".equalsIgnoreCase(request.getFrequency())) {
                nextDate = nextDate.plusWeeks(1);
            } else {
                nextDate = nextDate.plusMonths(1);
            }
        }

        // 4. Final Valuation
        StpResponse.StpTransactionRow last = ledger.get(ledger.size() - 1);

        return StpResponse.builder()
                .sourceSchemeName(source.getSchemeName())
                .targetSchemeName(target.getSchemeName())
                .totalTransferred(totalTransferred)
                .finalSourceValue(last.getSourceMarketValue())
                .finalTargetValue(last.getTargetMarketValue())
                .totalValue(last.getTotalPortfolioValue())
                .totalProfit(last.getTotalPortfolioValue().subtract(BigDecimal.valueOf(request.getInitialInvestmentAmount())))
                .ledger(ledger)
                .build();
    }

    @Override
    public SwpResponse calculateSwp(SwpRequest request) {
        // 1. Fetch Scheme
        SchemeMaster scheme = schemeMasterRepository.findById(request.getSchemeCode())
                .orElseThrow(() -> new RuntimeException("Scheme not found"));

        List<SwpResponse.SwpTransactionRow> ledger = new ArrayList<>();

        // 2. Initial Lump Sum Investment
        NavHistory initialNavRec = navHistoryRepository.findTopBySchemeCodeAndNavDateLessThanEqualOrderByNavDateDesc(
                        scheme.getSchemeCode(), request.getInvestmentDate())
                .orElseThrow(() -> new RuntimeException("NAV missing for investment date"));

        BigDecimal initialNav = BigDecimal.valueOf(initialNavRec.getNavValue());
        BigDecimal initialUnits = BigDecimal.valueOf(request.getInitialInvestmentAmount())
                .divide(initialNav, 4, RoundingMode.HALF_UP);

        BigDecimal balanceUnits = initialUnits;
        BigDecimal totalWithdrawn = BigDecimal.ZERO;

        // Record Initial Entry
        ledger.add(SwpResponse.SwpTransactionRow.builder()
                .date(request.getInvestmentDate())
                .nav(initialNav)
                .cashFlow(BigDecimal.valueOf(-request.getInitialInvestmentAmount())) // Negative for inflow
                .units(initialUnits)
                .balanceUnits(balanceUnits)
                .currentValue(BigDecimal.valueOf(request.getInitialInvestmentAmount()))
                .build());

        // 3. SWP Loop
        LocalDate nextDate = request.getSwpStartDate();

        // Safety check: Don't process if start date is after end date or balance is zero
        while (!nextDate.isAfter(request.getSwpEndDate()) && balanceUnits.doubleValue() > 0.001) {

            // Find NAV for withdrawal date
            NavHistory navRec = navHistoryRepository.findTopBySchemeCodeAndNavDateLessThanEqualOrderByNavDateDesc(
                    scheme.getSchemeCode(), nextDate).orElse(null);

            if (navRec != null) {
                BigDecimal currentNav = BigDecimal.valueOf(navRec.getNavValue());
                BigDecimal withdrawAmt = BigDecimal.valueOf(request.getWithdrawalAmount());

                // Check if fund has enough value
                BigDecimal currentValue = balanceUnits.multiply(currentNav);
                if (currentValue.compareTo(withdrawAmt) < 0) {
                    withdrawAmt = currentValue; // Withdraw whatever is left
                }

                // Calculate units to sell
                BigDecimal unitsSold = withdrawAmt.divide(currentNav, 4, RoundingMode.HALF_UP);
                balanceUnits = balanceUnits.subtract(unitsSold);
                totalWithdrawn = totalWithdrawn.add(withdrawAmt);

                ledger.add(SwpResponse.SwpTransactionRow.builder()
                        .date(nextDate)
                        .nav(currentNav)
                        .cashFlow(withdrawAmt) // Positive for outflow (money to user)
                        .units(unitsSold.negate())
                        .balanceUnits(balanceUnits)
                        .currentValue(balanceUnits.multiply(currentNav))
                        .build());
            }

            // Increment Date
            if ("Quarterly".equalsIgnoreCase(request.getFrequency())) {
                nextDate = nextDate.plusMonths(3);
            } else {
                nextDate = nextDate.plusMonths(1);
            }
        }

        // 4. Final Valuation
        NavHistory finalNavRec = navHistoryRepository.findTopBySchemeCodeAndNavDateLessThanEqualOrderByNavDateDesc(
                scheme.getSchemeCode(), request.getSwpEndDate()).orElse(initialNavRec);

        BigDecimal finalNav = BigDecimal.valueOf(finalNavRec.getNavValue());
        BigDecimal finalValue = balanceUnits.multiply(finalNav);

        // Total Profit = (Money taken out + Money still in fund) - Initial Money
        BigDecimal totalProfit = (totalWithdrawn.add(finalValue))
                .subtract(BigDecimal.valueOf(request.getInitialInvestmentAmount()));

        return SwpResponse.builder()
                .schemeName(scheme.getSchemeName())
                .totalWithdrawn(totalWithdrawn)
                .finalValue(finalValue)
                .totalProfit(totalProfit)
                .ledger(ledger)
                .build();
    }
}
