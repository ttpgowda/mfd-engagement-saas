package com.engine.mfdengagement.research.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@Builder
public class LumpsumResponse {
    private List<LumpsumFundRow> funds;
    private long totalElements;
    private int totalPages;
    private LocalDate dataAsOn;

    @Data
    @Builder
    public static class LumpsumFundRow {
        private Long schemeCode;
        private String schemeName;
        private BigDecimal startNav;
        private LocalDate startDate;
        private BigDecimal currentNav;
        private LocalDate currentDate;
        private BigDecimal investedAmount;
        private BigDecimal currentValue;
        private BigDecimal absoluteReturn;
        private BigDecimal cagr; // Annualized Return
    }
}