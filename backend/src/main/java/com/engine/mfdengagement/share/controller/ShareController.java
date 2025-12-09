package com.engine.mfdengagement.share.controller;

import com.engine.mfdengagement.share.entity.SharedLink;
import com.engine.mfdengagement.share.service.ShareService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ShareController {

    private final ShareService shareService;
    private final ObjectMapper objectMapper;

    @PostMapping("/links")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<SharedLinkResponse> createLink(@RequestBody CreateLinkRequest request,
            Authentication authentication) {
        SharedLink link = shareService.createLink(request.getToolSlug(), request.getConfig(), request.getTitle(),
                request.getDescription(), authentication.getName());
        return ResponseEntity.ok(new SharedLinkResponse(link.getShortCode(), link.getToolSlug()));
    }

    @GetMapping("/public/links/{shortCode}")
    public ResponseEntity<PublicLinkResponse> getLink(@PathVariable String shortCode) {
        return shareService.getLink(shortCode)
                .map(link -> {
                    Map<String, Object> config = null;
                    try {
                        config = objectMapper.readValue(link.getConfigJson(), new TypeReference<Map<String, Object>>() {
                        });
                    } catch (Exception e) {
                        // ignore or handle
                    }

                    return ResponseEntity.ok(new PublicLinkResponse(
                            link.getToolSlug(),
                            config,
                            link.getTenant().getTenantId()));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @Data
    public static class CreateLinkRequest {
        private String toolSlug;
        private Map<String, Object> config;
        private String title;
        private String description;
    }

    @Data
    @RequiredArgsConstructor
    public static class SharedLinkResponse {
        private final String shortCode;
        private final String toolSlug;
    }

    @Data
    @RequiredArgsConstructor
    public static class PublicLinkResponse {
        private final String toolSlug;
        private final Map<String, Object> config;
        private final String tenantId;
        // Add branding fields here later
    }
}
