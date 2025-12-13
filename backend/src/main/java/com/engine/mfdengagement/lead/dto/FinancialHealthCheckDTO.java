package com.engine.mfdengagement.lead.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FinancialHealthCheckDTO {
    private Long id;
    private Long leadId;
    private String leadName;
    private String leadPhone;
    private Integer totalScore;
    private String scoreCategory;
    private String responsesJson;
    private LocalDateTime createdAt;
}
