package com.engine.mfdengagement.research.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Builder
public class FdVsDebtResponse {
    private String schemeName;
    private double investmentAmount;

    // Fixed Deposit Metrics
    private double fdMaturityValue;
    private double fdPreTaxProfit;
    private double fdTaxLiability;
    private double fdPostTaxValue;
    private double fdPostTaxReturnPercent;

    // Debt Fund Metrics
    private double debtMaturityValue;
    private double debtPreTaxProfit;
    private double debtTaxLiability;
    private double debtPostTaxValue;
    private double debtPostTaxReturnPercent;

    // Comparison
    private double wealthDifference; // Debt Value - FD Value
    private boolean debtWins;
}