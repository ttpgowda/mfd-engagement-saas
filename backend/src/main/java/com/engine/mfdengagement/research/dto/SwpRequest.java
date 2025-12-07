package com.engine.mfdengagement.research.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class SwpRequest {
    private Long schemeCode;
    private double initialInvestmentAmount;
    private LocalDate investmentDate;
    private double withdrawalAmount;
    private LocalDate swpStartDate;
    private LocalDate swpEndDate;
    private String frequency; // "Monthly", "Quarterly"
}