package com.engine.mfdengagement.lead.repository;

import com.engine.mfdengagement.lead.entity.Lead;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LeadRepository extends JpaRepository<Lead, Long> {

        @Query("SELECT COUNT(l) FROM Lead l WHERE l.sharedLink IS NOT NULL")
        Long countTotalSharedLinkLeads();

        // Returns [toolSlug, leadCount]
        @Query("SELECT sl.toolSlug, COUNT(l) " +
                        "FROM Lead l JOIN l.sharedLink sl " +
                        "GROUP BY sl.toolSlug")
        List<Object[]> getLeadsByTool();

        // Returns [linkId, leadCount]
        @Query("SELECT sl.id, COUNT(l) " +
                        "FROM Lead l JOIN l.sharedLink sl " +
                        "GROUP BY sl.id")
        List<Object[]> getLeadsByLink();

        // Returns [date, leadCount]
        // Returns [date, leadCount]
        @Query("SELECT FUNCTION('DATE', l.createdAt), COUNT(l) " +
                        "FROM Lead l " +
                        "WHERE l.sharedLink IS NOT NULL " +
                        "GROUP BY FUNCTION('DATE', l.createdAt) " +
                        "ORDER BY FUNCTION('DATE', l.createdAt) DESC")
        List<Object[]> getDailyLeads(org.springframework.data.domain.Pageable pageable);

        @Query("SELECT sl.id, COUNT(l) " +
                        "FROM Lead l JOIN l.sharedLink sl " +
                        "WHERE l.createdAt BETWEEN :startDate AND :endDate " +
                        "GROUP BY sl.id")
        List<Object[]> getLeadsByLinkBetweenDates(
                        @org.springframework.data.repository.query.Param("startDate") java.time.Instant startDate,
                        @org.springframework.data.repository.query.Param("endDate") java.time.Instant endDate);
}

// 1. give it what resource it is going to take to win. the nex 3months. to make
// this one more reliable and perfect.