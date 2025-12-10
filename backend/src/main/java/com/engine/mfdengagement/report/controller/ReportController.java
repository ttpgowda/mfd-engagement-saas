package com.engine.mfdengagement.report.controller;

import com.engine.mfdengagement.report.dto.LinkReportItemDTO;
import com.engine.mfdengagement.report.dto.TrafficLogDTO;
import com.engine.mfdengagement.report.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/admin/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/links")
    @PreAuthorize("hasAnyRole('ADMIN', 'COMPANY_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<Page<LinkReportItemDTO>> getDetailedLinksReport(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            Pageable pageable) {
        return ResponseEntity.ok(reportService.getDetailedLinksReport(startDate, endDate, pageable));
    }

    @GetMapping("/logs")
    @PreAuthorize("hasAnyRole('ADMIN', 'COMPANY_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<Page<TrafficLogDTO>> getTrafficLogs(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            Pageable pageable) {
        return ResponseEntity.ok(reportService.getTrafficLogs(startDate, endDate, pageable));
    }
}
