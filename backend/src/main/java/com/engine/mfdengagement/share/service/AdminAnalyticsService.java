package com.engine.mfdengagement.share.service;

import com.engine.mfdengagement.lead.repository.LeadRepository;
import com.engine.mfdengagement.share.dto.AnalyticsReportDTO;
import com.engine.mfdengagement.share.dto.AnalyticsReportDTO.*;
import com.engine.mfdengagement.share.entity.SharedLink;
import com.engine.mfdengagement.share.repository.AnalyticsLogRepository;
import com.engine.mfdengagement.share.repository.SharedLinkRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminAnalyticsService {

    private final AnalyticsLogRepository analyticsLogRepository;
    private final LeadRepository leadRepository;
    private final SharedLinkRepository sharedLinkRepository;

    @Transactional(readOnly = true)
    public AnalyticsReportDTO getDashboardAnalytics() {
        AnalyticsReportDTO report = new AnalyticsReportDTO();

        // 1. Global Stats
        Long totalViews = analyticsLogRepository.countTotalUniqueSessions();
        if (totalViews == null)
            totalViews = 0L;

        Long totalLeads = leadRepository.countTotalSharedLinkLeads();
        if (totalLeads == null)
            totalLeads = 0L;

        Double avgDuration = analyticsLogRepository.getAverageSessionDuration();
        if (avgDuration == null)
            avgDuration = 0.0;

        Double conversionRate = (totalViews > 0) ? ((double) totalLeads / totalViews) * 100 : 0.0;

        report.setSummary(new GlobalStatsDTO(totalViews, totalLeads, conversionRate, avgDuration));

        // 2. Traffic Trends (Merge Views and Leads by Date)
        List<Object[]> dailyViews = analyticsLogRepository.getDailyUniqueViews(PageRequest.of(0, 30));
        List<Object[]> dailyLeads = leadRepository.getDailyLeads(PageRequest.of(0, 30));
        report.setTrafficTrend(mergeDailyTrends(dailyViews, dailyLeads));

        // 3. Tool Performance (Merge Views and Leads by Tool Slug)
        List<Object[]> toolViews = analyticsLogRepository.getViewsAndDurationByTool();
        List<Object[]> toolLeads = leadRepository.getLeadsByTool();
        report.setTopTools(mergeToolStats(toolViews, toolLeads));

        // 4. Top Links (Top 10 by Views) - This logic can be expanded for full
        // pagination later
        // We need Leads by Link too

        report.setTopLinks(mergeLinkStats(10));

        return report;
    }

    private List<DailyTrendDTO> mergeDailyTrends(List<Object[]> views, List<Object[]> leads) {
        Map<LocalDate, DailyTrendDTO> map = new HashMap<>();

        // Process Views (Native Query)
        for (Object[] row : views) {
            LocalDate date = toLocalDate(row[0]);
            Long count = toLong(row[1]);
            map.put(date, new DailyTrendDTO(date, count, 0L));
        }

        // Process Leads (Native Query)
        for (Object[] row : leads) {
            LocalDate date = toLocalDate(row[0]);
            Long count = toLong(row[1]);
            DailyTrendDTO dto = map.getOrDefault(date, new DailyTrendDTO(date, 0L, 0L));
            dto.setLeads(count);
            map.put(date, dto);
        }

        return map.values().stream()
                .sorted(Comparator.comparing(DailyTrendDTO::getDate))
                .collect(Collectors.toList());
    }

    private List<ToolPerformanceDTO> mergeToolStats(List<Object[]> views, List<Object[]> leads) {
        Map<String, ToolPerformanceDTO> map = new HashMap<>();

        // Views (JPQL)
        for (Object[] row : views) {
            String slug = (String) row[0];
            Long count = toLong(row[1]);
            Double duration = toDouble(row[2]);
            map.put(slug, new ToolPerformanceDTO(slug, count, 0L, 0.0, duration));
        }

        // Leads (JPQL)
        for (Object[] row : leads) {
            String slug = (String) row[0];
            Long count = toLong(row[1]);
            ToolPerformanceDTO dto = map.getOrDefault(slug, new ToolPerformanceDTO(slug, 0L, 0L, 0.0, 0.0));
            dto.setLeads(count);
            map.put(slug, dto);
        }

        // Calculation Conversion Rate
        for (ToolPerformanceDTO dto : map.values()) {
            if (dto.getViews() > 0) {
                dto.setConversionRate(((double) dto.getLeads() / dto.getViews()) * 100);
            }
        }

        return map.values().stream()
                .sorted(Comparator.comparing(ToolPerformanceDTO::getViews).reversed())
                .collect(Collectors.toList());
    }

    private List<LinkPerformanceDTO> mergeLinkStats(int limit) {
        // 1. Fetch recent links first (Driver)
        List<SharedLink> links = sharedLinkRepository.findAll(
                PageRequest.of(0, limit, org.springframework.data.domain.Sort.by("createdAt").descending()))
                .getContent();

        if (links.isEmpty())
            return new ArrayList<>();

        // 2. Fetch Views for these specific links
        // We need to update Repository to filter by IDs, or just fetch all and filter
        // in memory (inefficient but safe for now if list is small)
        // Better: Update repository to take ID list.
        // For now: Fetch all aggregates (as before) and map. Optimizable later.
        List<Object[]> views = analyticsLogRepository.getViewsAndDurationByLink();
        List<Object[]> leads = leadRepository.getLeadsByLink();

        Map<Long, Long> viewsMap = new HashMap<>();
        Map<Long, Double> durationMap = new HashMap<>();
        for (Object[] row : views) {
            viewsMap.put(toLong(row[0]), toLong(row[1]));
            durationMap.put(toLong(row[0]), toDouble(row[2]));
        }

        Map<Long, Long> leadsMap = new HashMap<>();
        for (Object[] row : leads) {
            leadsMap.put(toLong(row[0]), toLong(row[1]));
        }

        List<LinkPerformanceDTO> result = new ArrayList<>();
        for (SharedLink link : links) {
            Long v = viewsMap.getOrDefault(link.getId(), 0L);
            Long l = leadsMap.getOrDefault(link.getId(), 0L);
            Double dur = durationMap.getOrDefault(link.getId(), 0.0);
            Double rate = (v > 0) ? ((double) l / v) * 100 : 0.0;

            result.add(new LinkPerformanceDTO(
                    link.getId(),
                    link.getTitle(),
                    link.getToolSlug(),
                    link.getShortCode(),
                    v, l, rate,
                    dur,
                    link.getUpdatedAt() != null ? LocalDateTime.ofInstant(link.getUpdatedAt(), ZoneId.systemDefault())
                            : null));
        }

        return result;
    }

    // Helper methods for safe casting
    private LocalDate toLocalDate(Object obj) {
        if (obj == null)
            return LocalDate.now();
        if (obj instanceof java.sql.Date)
            return ((java.sql.Date) obj).toLocalDate();
        if (obj instanceof java.sql.Timestamp)
            return ((java.sql.Timestamp) obj).toLocalDateTime().toLocalDate();
        return LocalDate.now();
    }

    private Long toLong(Object obj) {
        if (obj == null)
            return 0L;
        if (obj instanceof Number)
            return ((Number) obj).longValue();
        return 0L;
    }

    private Double toDouble(Object obj) {
        if (obj == null)
            return 0.0;
        if (obj instanceof Number)
            return ((Number) obj).doubleValue();
        return 0.0;
    }
}
