package com.engine.mfdengagement.research.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class StpRequest {
    private double initialInvestmentAmount;
    private double transferAmount;
    private Long sourceSchemeCode;
    private Long targetSchemeCode;
    private LocalDate startDate; // Investment Date in Source
    private LocalDate stpStartDate; // Date when first transfer happens
    private LocalDate endDate;   // End of simulation
    private String frequency;    // "Monthly", "Weekly"
}