package com.engine.mfdengagement.lead.controller;

import com.engine.mfdengagement.lead.dto.LeadDTO;
import com.engine.mfdengagement.lead.service.LeadService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leads")
@RequiredArgsConstructor
public class LeadController {

    private final LeadService leadService;

    @PostMapping
    public ResponseEntity<LeadDTO> createLead(@RequestBody LeadDTO leadDTO) {
        return ResponseEntity.ok(leadService.createLead(leadDTO));
    }

    @GetMapping
    public ResponseEntity<List<LeadDTO>> getAllLeads() {
        return ResponseEntity.ok(leadService.getAllLeads());
    }

    @GetMapping("/{id}")
    public ResponseEntity<LeadDTO> getLeadById(@PathVariable Long id) {
        return ResponseEntity.ok(leadService.getLeadById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<LeadDTO> updateLead(@PathVariable Long id, @RequestBody LeadDTO leadDTO) {
        return ResponseEntity.ok(leadService.updateLead(id, leadDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLead(@PathVariable Long id) {
        leadService.deleteLead(id);
        return ResponseEntity.noContent().build();
    }
}
