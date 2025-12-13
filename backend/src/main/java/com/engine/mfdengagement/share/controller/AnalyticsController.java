package com.engine.mfdengagement.share.controller;

import com.engine.mfdengagement.share.service.AnalyticsService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/public/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/patterns")
    public ResponseEntity<List<PatternDTO>> getPatterns() {
        return ResponseEntity.ok(analyticsService.getPatterns());
    }

    @PostMapping("/heartbeat")
    public ResponseEntity<Void> heartbeat(@RequestBody HeartbeatRequest request) {
        analyticsService.trackHeartbeat(
                request.getShortCode(),
                request.getToolSlug(),
                request.getSessionId(),
                request.getDurationDelta(),
                request.getEventType() != null ? request.getEventType() : "HEARTBEAT",
                request.getParentShortCode());
        return ResponseEntity.ok().build();
    }

    // ... DTOs ...

    @Data
    public static class HeartbeatRequest {
        private String shortCode;
        private String toolSlug; // New Field
        private String sessionId;
        private Integer durationDelta;
        private String eventType;
        private String parentShortCode;
    }

    @GetMapping("/funnel")
    public ResponseEntity<List<FunnelDTO>> getFunnel() {
        return ResponseEntity.ok(analyticsService.getFunnelMetrics());
    }

    @GetMapping("/heatmap")
    public ResponseEntity<List<HeatmapDTO>> getHeatmap() {
        return ResponseEntity.ok(analyticsService.getHeatmapMetrics());
    }

    @Data
    @AllArgsConstructor
    public static class FunnelDTO {
        private String stage;
        private Long count;
        private Double dropoffPercentage;
    }

    @Data
    @AllArgsConstructor
    public static class HeatmapDTO {
        private Integer dayOfWeek; // 1-7 (Sun-Sat)
        private Integer hourOfDay; // 0-23
        private Long intensity;
    }

    @Data
    @AllArgsConstructor
    public static class PatternDTO {
        private String sourceTool;
        private String targetTool;
        private Long count;
    }

}
