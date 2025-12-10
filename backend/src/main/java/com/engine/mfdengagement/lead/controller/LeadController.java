package com.engine.mfdengagement.lead.controller;

import com.engine.mfdengagement.lead.dto.LeadDTO;
import com.engine.mfdengagement.lead.service.LeadService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leads")
@RequiredArgsConstructor
public class LeadController {

    private final LeadService leadService;

    @PostMapping
    @PreAuthorize("hasAuthority('LEAD_WRITE') or hasAnyRole('ADMIN', 'COMPANY_ADMIN', 'MANAGER')")
    public ResponseEntity<LeadDTO> createLead(@RequestBody LeadDTO leadDTO) {
        return ResponseEntity.ok(leadService.createLead(leadDTO));
    }

    @GetMapping
    @PreAuthorize("hasAuthority('LEAD_READ') or hasAnyRole('ADMIN', 'COMPANY_ADMIN', 'MANAGER', 'SUPPORT')")
    public ResponseEntity<List<LeadDTO>> getAllLeads() {
        return ResponseEntity.ok(leadService.getAllLeads());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('LEAD_READ') or hasAnyRole('ADMIN', 'COMPANY_ADMIN', 'MANAGER', 'SUPPORT')")
    public ResponseEntity<LeadDTO> getLeadById(@PathVariable Long id) {
        return ResponseEntity.ok(leadService.getLeadById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('LEAD_WRITE') or hasAnyRole('ADMIN', 'COMPANY_ADMIN', 'MANAGER')")
    public ResponseEntity<LeadDTO> updateLead(@PathVariable Long id, @RequestBody LeadDTO leadDTO) {
        return ResponseEntity.ok(leadService.updateLead(id, leadDTO));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('LEAD_WRITE') or hasAnyRole('ADMIN', 'COMPANY_ADMIN', 'MANAGER')")
    public ResponseEntity<Void> deleteLead(@PathVariable Long id) {
        leadService.deleteLead(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/assign/{userId}")
    @PreAuthorize("hasAuthority('LEAD_WRITE') or hasAnyRole('ADMIN', 'COMPANY_ADMIN', 'MANAGER')")
    public ResponseEntity<LeadDTO> assignLead(@PathVariable Long id, @PathVariable Long userId) {
        return ResponseEntity.ok(leadService.assignLead(id, userId));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAuthority('LEAD_WRITE') or hasAnyRole('ADMIN', 'COMPANY_ADMIN', 'MANAGER')")
    public ResponseEntity<LeadDTO> updateStatus(@PathVariable Long id,
            @RequestParam com.engine.mfdengagement.lead.entity.LeadStatus status) {
        return ResponseEntity.ok(leadService.updateStatus(id, status));
    }
}
