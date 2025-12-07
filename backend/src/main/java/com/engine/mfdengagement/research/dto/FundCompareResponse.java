package com.engine.mfdengagement.research.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@Builder
public class FundCompareResponse {
    private List<CompareFundData> funds;
    private LocalDate dataAsOn;

    @Data
    @Builder
    public static class CompareFundData {
        private Long schemeCode;
        private String schemeName;
        private String fundHouse;
        private String category;
        private String benchmarkName;

        // Returns
        private BigDecimal return1y;
        private BigDecimal return3y;
        private BigDecimal return5y;
        private BigDecimal returnInception;

        // Risk Metrics
        private BigDecimal stdDev;
        private BigDecimal alpha3y;
        private BigDecimal beta3y;
        private BigDecimal sharpeRatio;
    }
}