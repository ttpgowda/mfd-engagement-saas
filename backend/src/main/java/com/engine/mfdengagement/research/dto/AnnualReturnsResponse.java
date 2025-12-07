package com.engine.mfdengagement.research.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Builder
public class AnnualReturnsResponse {
    private Integer year;
    private BigDecimal returnPercentage;
}
