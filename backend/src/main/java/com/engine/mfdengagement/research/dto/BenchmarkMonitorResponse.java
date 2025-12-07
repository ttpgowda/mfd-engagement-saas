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
public class BenchmarkMonitorResponse {
    private String benchmarkName;
    private String nseSymbol;       // Useful for UI badges (e.g., NIFTY 50)

    // Returns
    private BigDecimal return1Y;
    private BigDecimal return3Y;
    private BigDecimal return5Y;
    private BigDecimal returnInception;

    // Risk Metrics
    private BigDecimal stdDev;
    private BigDecimal sharpeRatio;

    // JPQL Constructor (Matches Query below)
    public BenchmarkMonitorResponse(String benchmarkName, String nseSymbol,
                                    Double return1Y, Double return3Y, Double return5Y,
                                    Double returnInception, Double stdDev, Double sharpeRatio) {
        this.benchmarkName = benchmarkName;
        this.nseSymbol = nseSymbol;
        this.return1Y = return1Y != null ? BigDecimal.valueOf(return1Y) : null;
        this.return3Y = return3Y != null ? BigDecimal.valueOf(return3Y) : null;
        this.return5Y = return5Y != null ? BigDecimal.valueOf(return5Y) : null;
        this.returnInception = returnInception != null ? BigDecimal.valueOf(returnInception) : null;
        this.stdDev = stdDev != null ? BigDecimal.valueOf(stdDev) : null;
        this.sharpeRatio = sharpeRatio != null ? BigDecimal.valueOf(sharpeRatio) : null;
    }
}