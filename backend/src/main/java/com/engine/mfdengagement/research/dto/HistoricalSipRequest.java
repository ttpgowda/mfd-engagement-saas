package com.engine.mfdengagement.research.dto;

import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class HistoricalSipRequest {
    private List<Long> schemeCodes;
    private double amount;          // Monthly Installment Amount
    private String frequency;       // "Monthly", "Quarterly"
    private LocalDate startDate;
    private LocalDate endDate;
    private double stepUpPercentage; // Optional: 10% yearly increase
}