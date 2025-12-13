package com.engine.mfdengagement.lead.service;

import com.engine.mfdengagement.lead.dto.FinancialHealthCheckDTO;
import com.engine.mfdengagement.lead.dto.SurveySubmissionRequest;
import com.engine.mfdengagement.lead.entity.FinancialHealthCheckResponse;
import com.engine.mfdengagement.lead.entity.Lead;
import com.engine.mfdengagement.lead.entity.LeadStatus;
import com.engine.mfdengagement.lead.repository.FinancialHealthCheckRepository;
import com.engine.mfdengagement.lead.repository.LeadRepository;
import com.engine.mfdengagement.share.entity.SharedLink;
import com.engine.mfdengagement.share.repository.SharedLinkRepository;
import com.engine.mfdengagement.tenant.entity.Tenant;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SurveyService {

        private final FinancialHealthCheckRepository repository;
        private final SharedLinkRepository sharedLinkRepository;
        private final LeadRepository leadRepository;

        @Transactional
        public Long submitFinancialHealthCheck(SurveySubmissionRequest request) {
                // 1. Find Shared Link to identify Tenant
                SharedLink link = sharedLinkRepository.findByShortCode(request.getSharedCode())
                                .orElseThrow(() -> new EntityNotFoundException("Invalid Link"));

                Tenant tenant = link.getTenant();

                // 2. Create or Find Lead
                Lead lead = leadRepository.findByPhoneAndTenantId(request.getPhone(), tenant.getId())
                                .orElseGet(() -> {
                                        Lead newLead = Lead.builder()
                                                        .name(request.getName())
                                                        .phone(request.getPhone())
                                                        .email(request.getEmail())
                                                        .tenant(tenant)
                                                        .sharedLink(link)
                                                        .notes("Generated via Financial Health Check Survey")
                                                        .status(LeadStatus.NEW)
                                                        .source("Financial Health Check")
                                                        .build();
                                        return leadRepository.save(newLead);
                                });

                // 3. Save Response
                FinancialHealthCheckResponse response = FinancialHealthCheckResponse.builder()
                                .lead(lead)
                                .responsesJson(request.getResponsesJson())
                                .totalScore(request.getTotalScore())
                                .scoreCategory(request.getScoreCategory())
                                .build();

                repository.save(response);

                return lead.getId(); // Return ID for frontend reference
        }

        public List<FinancialHealthCheckDTO> getResponsesForTenant(Long tenantId) {
                return repository.findAllByTenantIdOrderByCreatedAtDesc(tenantId).stream()
                                .map(this::mapToDTO)
                                .collect(Collectors.toList());
        }

        private FinancialHealthCheckDTO mapToDTO(FinancialHealthCheckResponse r) {
                return FinancialHealthCheckDTO.builder()
                                .id(r.getId())
                                .leadId(r.getLead().getId())
                                .leadName(r.getLead().getName())
                                .leadPhone(r.getLead().getPhone())
                                .totalScore(r.getTotalScore())
                                .scoreCategory(r.getScoreCategory())
                                .responsesJson(r.getResponsesJson())
                                .createdAt(java.time.LocalDateTime.ofInstant(r.getCreatedAt(),
                                                java.time.ZoneId.systemDefault()))
                                .build();
        }
}
