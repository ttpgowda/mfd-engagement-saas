package com.engine.mfdengagement.share.repository;

import com.engine.mfdengagement.share.entity.AnalyticsLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnalyticsLogRepository extends JpaRepository<AnalyticsLog, Long> {
        List<AnalyticsLog> findBySessionId(String sessionId);

        @Query("SELECT COUNT(DISTINCT a.sessionId) FROM AnalyticsLog a")
        Long countTotalUniqueSessions();

        @Query("SELECT AVG(a.durationSeconds) FROM AnalyticsLog a")
        Double getAverageSessionDuration();

        // Returns [toolSlug, viewCount, avgDuration]
        @Query("SELECT l.toolSlug, COUNT(DISTINCT a.sessionId), AVG(a.durationSeconds) " +
                        "FROM AnalyticsLog a JOIN a.sharedLink l " +
                        "GROUP BY l.toolSlug")
        List<Object[]> getViewsAndDurationByTool();

        // Returns [linkId, viewCount, avgDuration]
        @Query("SELECT l.id, COUNT(DISTINCT a.sessionId), AVG(a.durationSeconds) " +
                        "FROM AnalyticsLog a JOIN a.sharedLink l " +
                        "GROUP BY l.id")
        List<Object[]> getViewsAndDurationByLink();

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
                        "FROM AnalyticsLog a " +
                        "GROUP BY FUNCTION('DATE', a.createdAt) " +
                        "ORDER BY FUNCTION('DATE', a.createdAt) DESC")
        List<Object[]> getDailyUniqueViews(org.springframework.data.domain.Pageable pageable);
}
