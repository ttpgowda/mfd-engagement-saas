package com.engine.mfdengagement.research.repository;

import com.engine.mfdengagement.research.model.BenchmarkHistory;
import com.engine.mfdengagement.research.model.BenchmarkHistoryId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BenchmarkHistoryRepository extends JpaRepository<BenchmarkHistory, BenchmarkHistoryId> {
    List<BenchmarkHistory> findByBenchmarkCodeAndNavDateBetweenOrderByNavDateAsc(Long benchmarkCode,
            LocalDate startDate, LocalDate endDate);
}
