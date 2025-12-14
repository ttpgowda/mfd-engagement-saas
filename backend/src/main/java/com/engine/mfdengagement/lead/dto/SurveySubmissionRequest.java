package com.engine.mfdengagement.lead.dto;

import lombok.Data;
import com.fasterxml.jackson.databind.JsonNode;

@Data
public class SurveySubmissionRequest {
    private String surveyType; // e.g. "RISK_PROFILER"
    private String sessionId;
    private String sharedCode;

    // The core data (answers, scores)
    private JsonNode responseData;

    // Behavioral metadata (time spent, user agent)
    private JsonNode metadata;

    // Optional Lead details for conversion
    private String name;
    private String phone;
    private String email;
}
