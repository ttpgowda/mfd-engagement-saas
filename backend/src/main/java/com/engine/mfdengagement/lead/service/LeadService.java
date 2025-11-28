package com.engine.mfdengagement.lead.service;

import com.engine.mfdengagement.lead.dto.LeadDTO;
import com.engine.mfdengagement.lead.entity.Lead;
import com.engine.mfdengagement.lead.repository.LeadRepository;
import com.engine.mfdengagement.security.CustomUserDetails;
import com.engine.mfdengagement.tenant.entity.Tenant;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LeadService {

    private final LeadRepository leadRepository;

    public LeadDTO createLead(LeadDTO dto) {
        CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication()
                .getPrincipal();
        Tenant tenant = userDetails.getUser().getTenant();

        Lead lead = Lead.builder()
                .name(dto.getName())
                .email(dto.getEmail())
                .phone(dto.getPhone())
                .source(dto.getSource())
                .status(dto.getStatus() != null ? dto.getStatus() : "NEW")
                .tenant(tenant)
                .build();

        Lead savedLead = leadRepository.save(lead);
        return mapToDTO(savedLead);
    }

    public List<LeadDTO> getAllLeads() {
        return leadRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public LeadDTO getLeadById(Long id) {
        Lead lead = leadRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lead not found with id: " + id));
        return mapToDTO(lead);
    }

    public LeadDTO updateLead(Long id, LeadDTO dto) {
        Lead lead = leadRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lead not found with id: " + id));

        lead.setName(dto.getName());
        lead.setEmail(dto.getEmail());
        lead.setPhone(dto.getPhone());
        lead.setSource(dto.getSource());
        if (dto.getStatus() != null) {
            lead.setStatus(dto.getStatus());
        }

        Lead updatedLead = leadRepository.save(lead);
        return mapToDTO(updatedLead);
    }

    public void deleteLead(Long id) {
        leadRepository.deleteById(id);
    }

    private LeadDTO mapToDTO(Lead lead) {
        LeadDTO dto = new LeadDTO();
        dto.setId(lead.getId());
        dto.setName(lead.getName());
        dto.setEmail(lead.getEmail());
        dto.setPhone(lead.getPhone());
        dto.setSource(lead.getSource());
        dto.setStatus(lead.getStatus());
        dto.setTenantId(lead.getTenant().getTenantId());
        return dto;
    }
}
