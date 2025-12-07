package com.engine.mfdengagement.research.controller;

import com.engine.mfdengagement.research.dto.*;
import com.engine.mfdengagement.research.service.ResearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ResearchController {

    private final ResearchService researchService;

    @GetMapping("/funds/{schemeCode}/trailing-returns")
    public ResponseEntity<TrailingReturnsResponse> getTrailingReturns(@PathVariable Long schemeCode) {
        return ResponseEntity.ok(researchService.getTrailingReturns(schemeCode));
    }

    @GetMapping("/funds/{schemeCode}/annual-returns")
    public ResponseEntity<List<AnnualReturnsResponse>> getAnnualReturns(@PathVariable Long schemeCode) {
        return ResponseEntity.ok(researchService.getAnnualReturns(schemeCode));
    }

    @PostMapping("/simulate/sip")
    public ResponseEntity<SipResponse> simulateSip(@RequestBody SipRequest request) {
        return ResponseEntity.ok(researchService.simulateSip(request));
    }

    @GetMapping("/funds/ranker")
    public ResponseEntity<List<FundRankerResponse>> getTopFunds(
            @RequestParam(defaultValue = "Equity") String category,
            @RequestParam(defaultValue = "alpha_3y") String sortBy) {
        return ResponseEntity.ok(researchService.getTopFunds(category, sortBy));
    }

    @GetMapping("/funds/categories")
    public ResponseEntity<List<String>> getCategories() {
        return ResponseEntity.ok(researchService.getAllCategories());
    }

    @GetMapping("/funds/schemes")
    public ResponseEntity<List<SchemeDropdownDto>> getSchemesByCategory(@RequestParam String category) {
        return ResponseEntity.ok(researchService.getSchemesByCategory(category));
    }

    @PostMapping("/funds/top-performing")
    public ResponseEntity<TopFundsResponse> getTopPerformingFunds(@RequestBody TopFundsRequest request) {
        return ResponseEntity.ok(researchService.getTopPerformingFunds(request));
    }

    @PostMapping("/funds/compare")
    public ResponseEntity<FundCompareResponse> getFundComparison(@RequestBody FundCompareRequest request) {
        return ResponseEntity.ok(researchService.getFundComparison(request));
    }
    @PostMapping("/funds/lumpsum-ranking")
    public ResponseEntity<LumpsumResponse> getTopLumpsumFunds(@RequestBody LumpsumRequest request) {
        return ResponseEntity.ok(researchService.getTopLumpsumFunds(request));
    }

    @PostMapping("/calculators/sip-historical")
    public ResponseEntity<HistoricalSipResponse> calculateHistoricalSip(@RequestBody HistoricalSipRequest request) {
        return ResponseEntity.ok(researchService.calculateHistoricalSip(request));
    }

    @GetMapping("/funds/category-monitor")
    public ResponseEntity<List<CategoryMonitorResponse>> getCategoryMonitor() {
        return ResponseEntity.ok(researchService.getCategoryMonitor());
    }

    @GetMapping("/funds/benchmark-monitor")
    public ResponseEntity<List<BenchmarkMonitorResponse>> getBenchmarkMonitor() {
        return ResponseEntity.ok(researchService.getBenchmarkMonitor());
    }

    @PostMapping("/funds/rolling-returns-analysis")
    public ResponseEntity<RollingReturnsResponse> calculateRollingReturns(@RequestBody RollingReturnsRequest request) {
        return ResponseEntity.ok(researchService.calculateRollingReturns(request));
    }

    @PostMapping("/calculators/fd-vs-debt")
    public ResponseEntity<FdVsDebtResponse> compareFdVsDebt(@RequestBody FdVsDebtRequest request) {
        return ResponseEntity.ok(researchService.compareFdVsDebt(request));
    }

    @PostMapping("/calculators/stp")
    public ResponseEntity<StpResponse> calculateStp(@RequestBody StpRequest request) {
        return ResponseEntity.ok(researchService.calculateStp(request));
    }

    @PostMapping("/calculators/swp")
    public ResponseEntity<SwpResponse> calculateSwp(@RequestBody SwpRequest request) {
        return ResponseEntity.ok(researchService.calculateSwp(request));
    }
}
