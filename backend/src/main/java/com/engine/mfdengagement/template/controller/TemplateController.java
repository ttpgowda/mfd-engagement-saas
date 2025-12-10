package com.engine.mfdengagement.template.controller;

import com.engine.mfdengagement.template.dto.TemplateDTO;
import com.engine.mfdengagement.template.entity.TemplateCategory;
import com.engine.mfdengagement.template.service.TemplateService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/templates")
@RequiredArgsConstructor
public class TemplateController {

    private final TemplateService templateService;

    @PostMapping
    @PreAuthorize("hasAuthority('TEMPLATE_WRITE')")
    public ResponseEntity<TemplateDTO> createTemplate(@RequestBody TemplateDTO templateDTO) {
        return ResponseEntity.ok(templateService.createTemplate(templateDTO));
    }

    @GetMapping
    @PreAuthorize("hasAuthority('TEMPLATE_READ')")
    public ResponseEntity<List<TemplateDTO>> getAllTemplates() {
        return ResponseEntity.ok(templateService.getAllTemplates());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('TEMPLATE_READ')")
    public ResponseEntity<TemplateDTO> getTemplateById(@PathVariable Long id) {
        return ResponseEntity.ok(templateService.getTemplateById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('TEMPLATE_WRITE')")
    public ResponseEntity<TemplateDTO> updateTemplate(@PathVariable Long id, @RequestBody TemplateDTO templateDTO) {
        return ResponseEntity.ok(templateService.updateTemplate(id, templateDTO));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('TEMPLATE_WRITE')")
    public ResponseEntity<Void> deleteTemplate(@PathVariable Long id) {
        templateService.deleteTemplate(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/public")
    public ResponseEntity<List<TemplateDTO>> getPublicTemplates() {
        return ResponseEntity.ok(templateService.getPublicTemplates());
    }

    @GetMapping("/category/{category}")
    @PreAuthorize("hasAuthority('TEMPLATE_READ')")
    public ResponseEntity<List<TemplateDTO>> getTemplatesByCategory(@PathVariable TemplateCategory category) {
        return ResponseEntity.ok(templateService.getTemplatesByCategory(category));
    }

    @GetMapping("/search")
    @PreAuthorize("hasAuthority('TEMPLATE_READ')")
    public ResponseEntity<List<TemplateDTO>> searchTemplates(@RequestParam String query) {
        return ResponseEntity.ok(templateService.searchTemplates(query));
    }

    @PostMapping("/upload-logo")
    @PreAuthorize("hasAuthority('TEMPLATE_WRITE')")
    public ResponseEntity<Map<String, String>> uploadLogo(@RequestParam("file") MultipartFile file) {
        try {
            String logoUrl = templateService.uploadLogo(file);
            Map<String, String> response = new HashMap<>();
            response.put("logoUrl", logoUrl);
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
