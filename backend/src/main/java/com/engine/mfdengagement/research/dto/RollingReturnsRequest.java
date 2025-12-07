package com.engine.mfdengagement.research.dto;

import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class RollingReturnsRequest {
    private List<Long> schemeCodes; // Support comparing up to 3 funds
    private String period;          // "1Y", "3Y", "5Y", "10Y"
    private LocalDate startDate;    // Optional: Filter graph start date
    private LocalDate endDate;      // Optional: Filter graph end date
}