package com.engine.mfdengagement.research.repository;

import com.engine.mfdengagement.research.model.BenchmarkAnalytics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BenchmarkAnalyticsRepository extends JpaRepository<BenchmarkAnalytics, Long> {
}
