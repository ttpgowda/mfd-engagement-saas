package com.engine.mfdengagement.research.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@Builder
public class HistoricalSipResponse {
    private List<SipResultRow> results;

    @Data
    @Builder
    public static class SipResultRow {
        private Long schemeCode;
        private String schemeName;
        private BigDecimal totalInvested;
        private BigDecimal currentValue;
        private BigDecimal absoluteReturn;
        private BigDecimal xirr; // Internal Rate of Return
        private List<DateValuePoint> chartData;
    }

    @Data
    @Builder
    public static class DateValuePoint {
        private LocalDate date;
        private BigDecimal invested; // Cumulative Invested
        private BigDecimal value;    // Current Value
    }
}