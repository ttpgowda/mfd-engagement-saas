package com.engine.mfdengagement.report.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LinkReportItemDTO {
    private Long linkId;
    private String title;
    private String toolSlug;
    private String shortCode;
    private LocalDateTime createdAt;

    // Aggregates for the selected period
    private Long views;
    private Long leads;
    private Double conversionRate;
    private Double avgEngagementTime;
    private LocalDateTime lastActive;
}
