package com.engine.mfdengagement.lead.service;

import com.engine.mfdengagement.lead.dto.SurveySubmissionRequest;
import com.engine.mfdengagement.lead.entity.Lead;
import com.engine.mfdengagement.lead.entity.LeadStatus;
import com.engine.mfdengagement.lead.entity.SurveyResponse;
import com.engine.mfdengagement.lead.entity.SurveyStatus;
import com.engine.mfdengagement.lead.repository.LeadRepository;
import com.engine.mfdengagement.lead.repository.SurveyResponseRepository;
import com.engine.mfdengagement.share.entity.SharedLink;
import com.engine.mfdengagement.share.repository.SharedLinkRepository;
import com.engine.mfdengagement.tenant.entity.Tenant;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SurveyService {

        private final SurveyResponseRepository repository;
        private final SharedLinkRepository sharedLinkRepository;
        private final LeadRepository leadRepository;
        private final ObjectMapper objectMapper;

        /**
         * Starts or Updates a survey session.
         * This handles Anonymous, Started, and Completed states.
         */
        @Transactional
        public Long submitResponse(SurveySubmissionRequest request) {
                // 1. Resolve Tenant via Shared Link (Source)
                SharedLink link = sharedLinkRepository.findByShortCode(request.getSharedCode())
                                .orElseThrow(() -> new EntityNotFoundException("Invalid Link"));
                Tenant tenant = link.getTenant();

                // 2. Find existing session or create new
                SurveyResponse response = repository
                                .findBySessionIdAndSurveyType(request.getSessionId(), request.getSurveyType())
                                .orElseGet(() -> SurveyResponse.builder()
                                                .sessionId(request.getSessionId())
                                                .surveyType(request.getSurveyType())
                                                .tenant(tenant)
                                                .sharedLinkShortCode(request.getSharedCode())
                                                .status(SurveyStatus.STARTED)
                                                .build());

                // 3. Update Data
                try {
                        if (request.getResponseData() != null) {
                                response.setResponseData(objectMapper.writeValueAsString(request.getResponseData()));
                        }
                        if (request.getMetadata() != null) {
                                response.setMetadata(objectMapper.writeValueAsString(request.getMetadata()));
                        }
                } catch (JsonProcessingException e) {
                        throw new RuntimeException("Error processing JSON", e);
                }

                // 4. Update Status logic
                // If we received a "completed" flag in metadata or implied by progress, update
                // status.
                // For now, let's assume if responseData is present, it's at least In Progress
                if (response.getStatus() == SurveyStatus.STARTED && request.getResponseData() != null) {
                        response.setStatus(SurveyStatus.IN_PROGRESS);
                }

                // 5. Auto-Link Lead if phone provided in this request (Direct conversion)
                if (request.getPhone() != null && !request.getPhone().isEmpty()) {
                        Lead lead = findOrCreateLead(request, tenant, link);
                        response.setLead(lead);
                        response.setStatus(SurveyStatus.COMPLETED); // Lead connection implies completion usually
                        response.setCompletedAt(LocalDateTime.now());
                }

                repository.save(response);
                return response.getId();
        }

        /**
         * Explicitly links a session to a lead (triggered by Lead Form).
         */
        @Transactional
        public Long linkLead(Long surveyId, SurveySubmissionRequest request) {
                SurveyResponse response = repository.findById(surveyId)
                                .orElseThrow(() -> new EntityNotFoundException("Survey Response not found"));

                SharedLink link = sharedLinkRepository.findByShortCode(response.getSharedLinkShortCode())
                                .orElseThrow(() -> new EntityNotFoundException("Link context lost"));

                Lead lead = findOrCreateLead(request, response.getTenant(), link);

                response.setLead(lead);
                response.setStatus(SurveyStatus.COMPLETED);
                response.setCompletedAt(LocalDateTime.now());
                repository.save(response);

                return lead.getId();
        }

        private Lead findOrCreateLead(SurveySubmissionRequest request, Tenant tenant, SharedLink link) {
                return leadRepository.findByPhoneAndTenantId(request.getPhone(), tenant.getId())
                                .orElseGet(() -> {
                                        Lead newLead = Lead.builder()
                                                        .name(request.getName())
                                                        .phone(request.getPhone())
                                                        .email(request.getEmail())
                                                        .tenant(tenant)
                                                        .sharedLink(link)
                                                        .notes("Generated via " + request.getSurveyType())
                                                        .status(LeadStatus.NEW)
                                                        .source("Survey Tool")
                                                        .build();
                                        return leadRepository.save(newLead);
                                });
        }
}
