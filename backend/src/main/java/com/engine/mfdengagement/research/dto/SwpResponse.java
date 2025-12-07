package com.engine.mfdengagement.research.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@Builder
public class SwpResponse {
    private String schemeName;

    // Summary
    private BigDecimal totalWithdrawn;
    private BigDecimal finalValue;
    private BigDecimal totalProfit; // (Final Value + Total Withdrawn) - Initial Investment
    private BigDecimal xirr;

    private List<SwpTransactionRow> ledger;

    @Data
    @Builder
    public static class SwpTransactionRow {
        private LocalDate date;
        private BigDecimal nav;
        private BigDecimal cashFlow; // Positive for withdrawal, Negative for investment
        private BigDecimal units; // Units added or removed
        private BigDecimal balanceUnits;
        private BigDecimal currentValue;
    }
}