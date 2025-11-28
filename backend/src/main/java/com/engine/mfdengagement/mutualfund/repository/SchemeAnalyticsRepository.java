package com.engine.mfdengagement.mutualfund.repository;

import com.engine.mfdengagement.mutualfund.domain.SchemeAnalytics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SchemeAnalyticsRepository extends JpaRepository<SchemeAnalytics, Long> {
}
