package com.engine.mfdengagement.research.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class FundRankerResponse {
    private Long schemeCode;
    private String schemeName;
    private String category;
    private BigDecimal alpha3y;
    private BigDecimal beta3y;
    private BigDecimal return3y;
    private List<Double> sparklineData; // Simplified 1Y history
}
