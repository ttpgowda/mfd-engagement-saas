package com.engine.mfdengagement.research.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@Builder
public class SipResponse {
    private BigDecimal totalInvested;
    private BigDecimal currentValue;
    private BigDecimal profit;
    private Double xirr;
    private List<SipPoint> chartData;

    @Data
    @Builder
    public static class SipPoint {
        private LocalDate date;
        private BigDecimal investedAmount;
        private BigDecimal currentValue;
    }
}
