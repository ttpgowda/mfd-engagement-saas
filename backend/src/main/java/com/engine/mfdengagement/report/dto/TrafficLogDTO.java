package com.engine.mfdengagement.report.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TrafficLogDTO {
    private String sessionId;
    private LocalDateTime timestamp;
    private String toolSlug;
    private String linkTitle; // Optional
    private Double durationSeconds;
    private String ipAddress; // Masked
    private String deviceType; // Use UserAgent if available, else null
    private String city; // If we add GeoLocation later
}
