package com.engine.mfdengagement.research.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class FdVsDebtRequest {
    private double investmentAmount;
    private double fdInterestRate; // Annual Interest Rate for FD (e.g., 7.0)
    private Long debtSchemeCode;   // Selected Debt Fund
    private LocalDate startDate;
    private LocalDate endDate;
    private double taxRate;        // Investor's Tax Slab (e.g., 30.0)
}