package com.engine.mfdengagement.research.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategoryMonitorResponse {
    private String categoryName;
    private Long schemeCount; // Changed to Long to match COUNT() return type

    private BigDecimal avgReturn1M;
    private BigDecimal avgReturn6M;
    private BigDecimal avgReturn1Y;
    private BigDecimal avgReturn3Y;
    private BigDecimal avgReturn5Y;

    private BigDecimal avgStdDev;
    private BigDecimal avgAlpha;

    private BigDecimal outperformance3Y; // Calculated in service, not query

    // Special Constructor for JPQL Query
    public CategoryMonitorResponse(String categoryName, Long schemeCount,
                                   Double avgReturn1M, Double avgReturn6M, Double avgReturn1Y,
                                   Double avgReturn3Y, Double avgReturn5Y,
                                   Double avgStdDev, Double avgAlpha) {
        this.categoryName = categoryName;
        this.schemeCount = schemeCount;
        // Handle nulls and convert Double to BigDecimal safely
        this.avgReturn1M = avgReturn1M != null ? BigDecimal.valueOf(avgReturn1M) : null;
        this.avgReturn6M = avgReturn6M != null ? BigDecimal.valueOf(avgReturn6M) : null;
        this.avgReturn1Y = avgReturn1Y != null ? BigDecimal.valueOf(avgReturn1Y) : null;
        this.avgReturn3Y = avgReturn3Y != null ? BigDecimal.valueOf(avgReturn3Y) : null;
        this.avgReturn5Y = avgReturn5Y != null ? BigDecimal.valueOf(avgReturn5Y) : null;
        this.avgStdDev = avgStdDev != null ? BigDecimal.valueOf(avgStdDev) : null;
        this.avgAlpha = avgAlpha != null ? BigDecimal.valueOf(avgAlpha) : null;
    }
}