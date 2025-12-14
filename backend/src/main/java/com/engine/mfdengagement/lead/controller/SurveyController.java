package com.engine.mfdengagement.lead.controller;

import com.engine.mfdengagement.lead.dto.SurveySubmissionRequest;
import com.engine.mfdengagement.lead.service.SurveyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class SurveyController {

    private final SurveyService surveyService;

    // Unified Endpoint for generic progress saving / anonymous submission
    @PostMapping("/api/public/surveys/submit")
    public ResponseEntity<Long> submitResponse(@RequestBody SurveySubmissionRequest request) {
        Long responseId = surveyService.submitResponse(request);
        return ResponseEntity.ok(responseId);
    }

    // Endpoint to link a specific survey response to a Lead
    @PostMapping("/api/public/surveys/{id}/link-lead")
    public ResponseEntity<Long> linkLead(@PathVariable Long id, @RequestBody SurveySubmissionRequest request) {
        Long leadId = surveyService.linkLead(id, request);
        return ResponseEntity.ok(leadId);
    }
}
