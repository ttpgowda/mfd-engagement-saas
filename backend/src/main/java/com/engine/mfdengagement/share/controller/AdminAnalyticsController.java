package com.engine.mfdengagement.share.controller;

import com.engine.mfdengagement.share.dto.AnalyticsReportDTO;
import com.engine.mfdengagement.share.service.AdminAnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/analytics")
@RequiredArgsConstructor
public class AdminAnalyticsController {

    private final AdminAnalyticsService analyticsService;

    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('COMPANY_ADMIN')")
    public ResponseEntity<AnalyticsReportDTO> getDashboardAnalytics() {
        return ResponseEntity.ok(analyticsService.getDashboardAnalytics());
    }

    @GetMapping("/funnel")
    @PreAuthorize("hasRole('COMPANY_ADMIN')")
    public ResponseEntity<java.util.List<AnalyticsReportDTO.FunnelDTO>> getFunnel() {
        return ResponseEntity.ok(analyticsService.getFunnelMetrics());
    }

    @GetMapping("/heatmap")
    @PreAuthorize("hasRole('COMPANY_ADMIN')")
    public ResponseEntity<java.util.List<AnalyticsReportDTO.HeatmapDTO>> getHeatmap() {
        return ResponseEntity.ok(analyticsService.getHeatmapMetrics());
    }

    @GetMapping("/patterns")
    @PreAuthorize("hasRole('COMPANY_ADMIN')")
    public ResponseEntity<java.util.List<AnalyticsReportDTO.PatternDTO>> getPatterns() {
        return ResponseEntity.ok(analyticsService.getPatterns());
    }
}
