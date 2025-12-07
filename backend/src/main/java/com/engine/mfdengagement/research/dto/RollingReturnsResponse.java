package com.engine.mfdengagement.research.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@Builder
public class RollingReturnsResponse {
    private List<RollingFundData> funds;

    @Data
    @Builder
    public static class RollingFundData {
        private Long schemeCode;
        private String schemeName;
        private RollingStats stats;
        private List<RollingPoint> dataPoints;
    }

    @Data
    @Builder
    public static class RollingStats {
        private BigDecimal average;  // Avg rolling return
        private BigDecimal max;      // Best period
        private BigDecimal min;      // Worst period
        private double positivePercent; // % of times return was > 0
        private double negativePercent; // % of times return was < 0
    }

    @Data
    @Builder
    public static class RollingPoint {
        private LocalDate date;      // The End Date of the rolling window
        private BigDecimal returnVal;
    }
}