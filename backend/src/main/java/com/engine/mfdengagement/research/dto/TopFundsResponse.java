package com.engine.mfdengagement.research.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@Builder
public class TopFundsResponse {
    private String category;
    private BenchmarkSummary benchmark;
    private CategoryAverageSummary categoryAverage;
    private List<FundRowDto> funds;
    private int totalPages;
    private long totalElements;
    private LocalDate dataAsOn;

    @Data
    @Builder
    public static class BenchmarkSummary {
        private String name;
        private BigDecimal return1y;
        private BigDecimal return3y;
        private BigDecimal return5y;
        private BigDecimal returnInception;
    }

    @Data
    @Builder
    public static class CategoryAverageSummary {
        private BigDecimal return1y;
        private BigDecimal return3y;
        private BigDecimal return5y;
        private BigDecimal returnInception;
    }

    @Data
    @Builder
    public static class FundRowDto {
        private Long schemeCode;
        private String schemeName;
        private BigDecimal return1y;
        private BigDecimal return3y;
        private BigDecimal return5y;
        private BigDecimal returnInception;
        private BigDecimal stdDev;
    }
}