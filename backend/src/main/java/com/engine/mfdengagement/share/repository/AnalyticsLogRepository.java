package com.engine.mfdengagement.share.repository;

import com.engine.mfdengagement.share.entity.AnalyticsLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnalyticsLogRepository extends JpaRepository<AnalyticsLog, Long> {
        List<AnalyticsLog> findBySessionId(String sessionId);

        @Query("SELECT COUNT(DISTINCT a.sessionId) FROM AnalyticsLog a JOIN a.tenant t WHERE t.tenantId = :tenantId")
        Long countTotalUniqueSessions(@org.springframework.data.repository.query.Param("tenantId") String tenantId);

        @Query("SELECT AVG(a.durationSeconds) FROM AnalyticsLog a JOIN a.tenant t WHERE t.tenantId = :tenantId")
        Double getAverageSessionDuration(@org.springframework.data.repository.query.Param("tenantId") String tenantId);

        // Returns [toolSlug, viewCount, avgDuration]
        @Query("SELECT l.toolSlug, COUNT(DISTINCT a.sessionId), AVG(a.durationSeconds) " +
                        "FROM AnalyticsLog a JOIN a.sharedLink l JOIN a.tenant t " +
                        "WHERE t.tenantId = :tenantId " +
                        "GROUP BY l.toolSlug")
        List<Object[]> getViewsAndDurationByTool(
                        @org.springframework.data.repository.query.Param("tenantId") String tenantId);

        // Returns [linkId, viewCount, avgDuration]
        @Query("SELECT l.id, COUNT(DISTINCT a.sessionId), AVG(a.durationSeconds) " +
                        "FROM AnalyticsLog a JOIN a.sharedLink l JOIN a.tenant t " +
                        "WHERE t.tenantId = :tenantId " +
                        "GROUP BY l.id")
        List<Object[]> getViewsAndDurationByLink(
                        @org.springframework.data.repository.query.Param("tenantId") String tenantId);

        // Date Range Aggregations
        @Query("SELECT l.id, COUNT(DISTINCT a.sessionId), AVG(a.durationSeconds), MAX(a.createdAt) " +
                        "FROM AnalyticsLog a JOIN a.sharedLink l " +
                        "WHERE a.createdAt BETWEEN :startDate AND :endDate " +
                        "GROUP BY l.id")
        List<Object[]> getViewsAndDurationByLinkBetweenDates(
                        @org.springframework.data.repository.query.Param("startDate") java.time.Instant startDate,
                        @org.springframework.data.repository.query.Param("endDate") java.time.Instant endDate);

        @Query("SELECT a FROM AnalyticsLog a WHERE a.createdAt BETWEEN :startDate AND :endDate ORDER BY a.createdAt DESC")
        org.springframework.data.domain.Page<AnalyticsLog> findLogsBetweenDates(
                        @org.springframework.data.repository.query.Param("startDate") java.time.Instant startDate,
                        @org.springframework.data.repository.query.Param("endDate") java.time.Instant endDate,
                        org.springframework.data.domain.Pageable pageable);

        @Query("SELECT FUNCTION('DATE', a.createdAt), COUNT(DISTINCT a.sessionId) " +
                        "FROM AnalyticsLog a JOIN a.tenant t " +
                        "WHERE t.tenantId = :tenantId " +
                        "GROUP BY FUNCTION('DATE', a.createdAt) " +
                        "ORDER BY FUNCTION('DATE', a.createdAt) DESC")
        List<Object[]> getDailyUniqueViews(@org.springframework.data.repository.query.Param("tenantId") String tenantId,
                        org.springframework.data.domain.Pageable pageable);

        @Query("SELECT a.parentShortCode, l.toolSlug, COUNT(a) " +
                        "FROM AnalyticsLog a JOIN a.sharedLink l JOIN a.tenant t " +
                        "WHERE a.parentShortCode IS NOT NULL AND a.parentShortCode <> '' AND t.tenantId = :tenantId " +
                        "GROUP BY a.parentShortCode, l.toolSlug " +
                        "ORDER BY COUNT(a) DESC")
        List<Object[]> findPatterns(@org.springframework.data.repository.query.Param("tenantId") String tenantId);

        @Query("SELECT " +
                        "COUNT(a), " + // Total Views
                        "SUM(CASE WHEN a.durationSeconds > 10 OR a.interactionCount > 0 THEN 1 ELSE 0 END), " + // Engaged
                        "SUM(CASE WHEN a.converted = true THEN 1 ELSE 0 END) " + // Converted
                        "FROM AnalyticsLog a JOIN a.tenant t WHERE t.tenantId = :tenantId")
        List<Object[]> getFunnelMetrics(@org.springframework.data.repository.query.Param("tenantId") String tenantId);

        @Query(value = "SELECT " +
                        "CAST(EXTRACT(DOW FROM a.createdat) AS INTEGER) as dow, " +
                        "CAST(EXTRACT(HOUR FROM a.createdat) AS INTEGER) as hour, " +
                        "COUNT(a.*) " +
                        "FROM analytics_logs a " +
                        "JOIN tenants t ON a.tenant_id = t.id " +
                        "WHERE t.tenantid = :tenantId " +
                        "GROUP BY EXTRACT(DOW FROM a.createdat), EXTRACT(HOUR FROM a.createdat)", nativeQuery = true)
        List<Object[]> getHourlyActivity(@org.springframework.data.repository.query.Param("tenantId") String tenantId);
}
