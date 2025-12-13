package com.engine.mfdengagement.lead.dto;

import lombok.Data;

@Data
public class SurveySubmissionRequest {
    private String sharedCode; // The shortCode from the URL
    private String responsesJson;
    private Integer totalScore;
    private String scoreCategory;

    // Lead details
    private String name;
    private String phone;
    private String email;
}
