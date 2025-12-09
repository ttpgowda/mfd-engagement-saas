package com.engine.mfdengagement.share.repository;

import com.engine.mfdengagement.share.entity.AnalyticsLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnalyticsLogRepository extends JpaRepository<AnalyticsLog, Long> {
    List<AnalyticsLog> findBySessionId(String sessionId);
}
