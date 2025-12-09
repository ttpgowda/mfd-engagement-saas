package com.engine.mfdengagement.share.controller;

import com.engine.mfdengagement.share.service.AnalyticsService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @PostMapping("/heartbeat")
    public ResponseEntity<Void> heartbeat(@RequestBody HeartbeatRequest request) {
        analyticsService.trackHeartbeat(
                request.getShortCode(),
                request.getSessionId(),
                request.getDurationDelta(),
                "HEARTBEAT");
        return ResponseEntity.ok().build();
    }

    @Data
    public static class HeartbeatRequest {
        private String shortCode;
        private String sessionId;
        private Integer durationDelta;
    }
}
