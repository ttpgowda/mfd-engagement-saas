package com.engine.mfdengagement.report.service;

import com.engine.mfdengagement.lead.repository.LeadRepository;
import com.engine.mfdengagement.report.dto.LinkReportItemDTO;
import com.engine.mfdengagement.report.dto.TrafficLogDTO;
import com.engine.mfdengagement.share.entity.AnalyticsLog;
import com.engine.mfdengagement.share.entity.SharedLink;
import com.engine.mfdengagement.share.repository.AnalyticsLogRepository;
import com.engine.mfdengagement.share.repository.SharedLinkRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final SharedLinkRepository sharedLinkRepository;
    private final AnalyticsLogRepository analyticsLogRepository;
    private final LeadRepository leadRepository;

    @Transactional(readOnly = true)
    public Page<LinkReportItemDTO> getDetailedLinksReport(LocalDateTime startDate, LocalDateTime endDate,
            Pageable pageable) {
        Page<SharedLink> linksPage = sharedLinkRepository.findAll(pageable);

        if (linksPage.isEmpty()) {
            return Page.empty();
        }

        List<Long> linkIds = new ArrayList<>();
        for (SharedLink link : linksPage.getContent()) {
            linkIds.add(link.getId());
        }

        List<Object[]> viewStats = analyticsLogRepository.getViewsAndDurationByLinkBetweenDates(
                startDate.atZone(ZoneId.systemDefault()).toInstant(),
                endDate.atZone(ZoneId.systemDefault()).toInstant());
        List<Object[]> leadStats = leadRepository.getLeadsByLinkBetweenDates(
                startDate.atZone(ZoneId.systemDefault()).toInstant(),
                endDate.atZone(ZoneId.systemDefault()).toInstant());

        Map<Long, Long> viewsMap = new HashMap<>();
        Map<Long, Double> durationMap = new HashMap<>();
        Map<Long, LocalDateTime> lastActiveMap = new HashMap<>();

        for (Object[] row : viewStats) {
            if (row == null || row.length < 3)
                continue;
            Long id = (Long) row[0];
            if (linkIds.contains(id)) {
                viewsMap.put(id, (Long) row[1]);
                durationMap.put(id, (Double) row[2]);

                if (row.length > 3 && row[3] != null) {
                    Object dateObj = row[3];
                    if (dateObj instanceof java.sql.Timestamp) {
                        lastActiveMap.put(id, ((java.sql.Timestamp) dateObj).toLocalDateTime());
                    } else if (dateObj instanceof LocalDateTime) {
                        lastActiveMap.put(id, (LocalDateTime) dateObj);
                    } else if (dateObj instanceof Instant) {
                        lastActiveMap.put(id, LocalDateTime.ofInstant((Instant) dateObj, ZoneId.systemDefault()));
                    }
                }
            }
        }

        Map<Long, Long> leadsMap = new HashMap<>();
        for (Object[] row : leadStats) {
            if (row == null || row.length < 2)
                continue;
            Long id = (Long) row[0];
            if (linkIds.contains(id)) {
                leadsMap.put(id, (Long) row[1]);
            }
        }

        List<LinkReportItemDTO> dtos = new ArrayList<>();
        for (SharedLink link : linksPage.getContent()) {
            Long v = viewsMap.getOrDefault(link.getId(), 0L);
            Long l = leadsMap.getOrDefault(link.getId(), 0L);
            Double dur = durationMap.getOrDefault(link.getId(), 0.0);
            Double rate = 0.0;
            if (v > 0) {
                rate = ((double) l / v) * 100;
            }

            LocalDateTime lastActive;
            if (lastActiveMap.containsKey(link.getId())) {
                lastActive = lastActiveMap.get(link.getId());
            } else {
                lastActive = LocalDateTime.ofInstant(link.getUpdatedAt(), ZoneId.systemDefault());
            }

            LinkReportItemDTO dto = LinkReportItemDTO.builder()
                    .linkId(link.getId())
                    .title(link.getTitle())
                    .toolSlug(link.getToolSlug())
                    .shortCode(link.getShortCode())
                    .createdAt(LocalDateTime.ofInstant(link.getCreatedAt(), ZoneId.systemDefault()))
                    .views(v)
                    .leads(l)
                    .conversionRate(rate)
                    .avgEngagementTime(dur)
                    .lastActive(lastActive)
                    .build();
            dtos.add(dto);
        }

        return new PageImpl<>(dtos, pageable, linksPage.getTotalElements());
    }

    @Transactional(readOnly = true)
    public Page<TrafficLogDTO> getTrafficLogs(LocalDateTime startDate, LocalDateTime endDate, Pageable pageable) {
        Page<AnalyticsLog> logs = analyticsLogRepository.findLogsBetweenDates(
                startDate.atZone(ZoneId.systemDefault()).toInstant(),
                endDate.atZone(ZoneId.systemDefault()).toInstant(),
                pageable);

        return logs.map(log -> {
            String tool = "direct";
            String title = null;
            if (log.getSharedLink() != null) {
                tool = log.getSharedLink().getToolSlug();
                title = log.getSharedLink().getTitle();
            }

            return TrafficLogDTO.builder()
                    .sessionId(log.getSessionId())
                    .timestamp(LocalDateTime.ofInstant(log.getCreatedAt(), ZoneId.systemDefault()))
                    .toolSlug(tool)
                    .linkTitle(title)
                    .durationSeconds(log.getDurationSeconds() != null ? Double.valueOf(log.getDurationSeconds()) : 0.0)
                    .ipAddress("XXX.XXX.XXX.XXX")
                    .deviceType("Desktop")
                    .city("Unknown")
                    .build();
        });
    }
}
