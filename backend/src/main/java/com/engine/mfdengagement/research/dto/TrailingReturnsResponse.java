package com.engine.mfdengagement.research.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class TrailingReturnsResponse {
    private String schemeName;
    private String benchmarkName;
    private List<PeriodReturn> periods;

    @Data
    @Builder
    public static class PeriodReturn {
        private String period; // 1Y, 3Y, 5Y, etc.
        private BigDecimal fundReturn;
        private BigDecimal benchmarkReturn;
        private BigDecimal alpha;
    }
}
