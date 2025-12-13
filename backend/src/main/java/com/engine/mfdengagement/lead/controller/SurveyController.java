package com.engine.mfdengagement.lead.controller;

import com.engine.mfdengagement.lead.dto.FinancialHealthCheckDTO;
import com.engine.mfdengagement.lead.dto.SurveySubmissionRequest;
import com.engine.mfdengagement.lead.service.SurveyService;
import com.engine.mfdengagement.tenant.config.TenantContext;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class SurveyController {

    private final SurveyService surveyService;

    // Public Endpoint - No Authorization header required (Should be configured in
    // SecurityConfig)
    @PostMapping("/api/public/surveys/financial-health-check")
    public ResponseEntity<Long> submitResponse(@RequestBody SurveySubmissionRequest request) {
        Long leadId = surveyService.submitFinancialHealthCheck(request);
        return ResponseEntity.ok(leadId);
    }

    // Admin Endpoint
    @GetMapping("/api/surveys/financial-health-check")
    public ResponseEntity<List<FinancialHealthCheckDTO>> getResponses() {
        Long tenantId = Long.parseLong(TenantContext.getTenantId());
        return ResponseEntity.ok(surveyService.getResponsesForTenant(tenantId));
    }
}
