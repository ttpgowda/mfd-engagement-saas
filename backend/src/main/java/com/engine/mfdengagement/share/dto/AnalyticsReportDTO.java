package com.engine.mfdengagement.share.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsReportDTO {

    private GlobalStatsDTO summary;
    private List<DailyTrendDTO> trafficTrend;
    private List<ToolPerformanceDTO> topTools;
    private List<LinkPerformanceDTO> topLinks;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class GlobalStatsDTO {
        private Long totalViews;
        private Long totalLeads;
        private Double conversionRate;
        private Double avgEngagementTimeSeconds;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class DailyTrendDTO {
        private LocalDate date;
        private Long views;
        private Long leads;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ToolPerformanceDTO {
        private String toolSlug;
        private Long views;
        private Long leads;
        private Double conversionRate;
        private Double avgDurationSeconds;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class LinkPerformanceDTO {
        private Long linkId;
        private String title;
        private String toolSlug;
        private String shortCode;
        private Long views;
        private Long leads;
        private Double conversionRate;
        private Double avgDurationSeconds;
        private LocalDateTime lastActive;
    }
}
