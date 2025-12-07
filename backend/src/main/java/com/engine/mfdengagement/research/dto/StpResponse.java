package com.engine.mfdengagement.research.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@Builder
public class StpResponse {
    private String sourceSchemeName;
    private String targetSchemeName;

    // Summary
    private BigDecimal totalTransferred;
    private BigDecimal finalSourceValue;
    private BigDecimal finalTargetValue;
    private BigDecimal totalValue;
    private BigDecimal totalProfit;
    private BigDecimal xirr; // Internal Rate of Return

    private List<StpTransactionRow> ledger;

    @Data
    @Builder
    public static class StpTransactionRow {
        private LocalDate date;
        private String type; // "INVESTMENT", "TRANSFER", "VALUATION"

        // Source Leg
        private BigDecimal sourceNav;
        private BigDecimal unitsSold;
        private BigDecimal sourceBalanceUnits;
        private BigDecimal sourceMarketValue;

        // Target Leg
        private BigDecimal targetNav;
        private BigDecimal unitsBought;
        private BigDecimal targetBalanceUnits;
        private BigDecimal targetMarketValue;

        // Combined
        private BigDecimal totalPortfolioValue;
    }
}