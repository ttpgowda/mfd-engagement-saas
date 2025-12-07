package com.engine.mfdengagement.research.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class SipRequest {
    private Long schemeCode;
    private Double monthlyAmount;
    private LocalDate startDate;
    private LocalDate endDate;
}
