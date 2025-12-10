package com.engine.mfdengagement.lead.service;

import com.engine.mfdengagement.lead.dto.LeadDTO;
import com.engine.mfdengagement.lead.entity.Lead;
import com.engine.mfdengagement.lead.entity.LeadStatus;
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
@org.springframework.transaction.annotation.Transactional
public class LeadService {

    private final LeadRepository leadRepository;
    private final com.engine.mfdengagement.user.repository.UserRepository userRepository;
    private final com.engine.mfdengagement.tenant.repository.TenantRepository tenantRepository;

    public LeadDTO createLead(LeadDTO dto) {
        Lead lead = new Lead();
        lead.setName(dto.getName());
        lead.setPhone(dto.getPhone());
        lead.setEmail(dto.getEmail());
        lead.setSource(dto.getSource());
        lead.setStatus(dto.getStatus() != null ? dto.getStatus() : LeadStatus.NEW);
        lead.setNotes(dto.getNotes());

        String tenantId = com.engine.mfdengagement.tenant.config.TenantContext.getTenantId();
        Tenant tenant = tenantRepository.findByTenantId(tenantId)
                .orElseThrow(() -> new RuntimeException("Tenant not found"));
        lead.setTenant(tenant);

        if (dto.getAssignedToId() != null) {
            userRepository.findById(dto.getAssignedToId()).ifPresent(lead::setAssignedTo);
        }

        Lead savedLead = leadRepository.save(lead);
        return mapToDTO(savedLead);
    }

    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public List<LeadDTO> getAllLeads() {
        return leadRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public LeadDTO getLeadById(Long id) {
        Lead lead = leadRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lead not found"));
        return mapToDTO(lead);
    }

    public LeadDTO updateLead(Long id, LeadDTO dto) {
        Lead lead = leadRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lead not found"));

        lead.setName(dto.getName());
        lead.setPhone(dto.getPhone());
        lead.setEmail(dto.getEmail());
        lead.setSource(dto.getSource());
        if (dto.getStatus() != null) {
            lead.setStatus(dto.getStatus());
        }
        lead.setNotes(dto.getNotes());

        Lead updatedLead = leadRepository.save(lead);
        return mapToDTO(updatedLead);
    }

    public void deleteLead(Long id) {
        leadRepository.deleteById(id);
    }

    public LeadDTO updateStatus(Long id, LeadStatus status) {
        Lead lead = leadRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lead not found"));
        lead.setStatus(status);
        return mapToDTO(leadRepository.save(lead));
    }

    public LeadDTO assignLead(Long leadId, Long userId) {
        Lead lead = leadRepository.findById(leadId)
                .orElseThrow(() -> new RuntimeException("Lead not found"));
        com.engine.mfdengagement.user.entity.User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        lead.setAssignedTo(user);
        return mapToDTO(leadRepository.save(lead));
    }

    private LeadDTO mapToDTO(Lead lead) {
        return LeadDTO.builder()
                .id(lead.getId())
                .name(lead.getName())
                .phone(lead.getPhone())
                .email(lead.getEmail())
                .source(lead.getSource())
                .status(lead.getStatus())
                .notes(lead.getNotes())
                .assignedToId(lead.getAssignedTo() != null ? lead.getAssignedTo().getId() : null)
                .assignedToName(lead.getAssignedTo() != null ? lead.getAssignedTo().getUsername() : null)
                .build();
    }
}
