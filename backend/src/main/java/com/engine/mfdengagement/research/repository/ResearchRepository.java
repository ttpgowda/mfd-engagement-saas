package com.engine.mfdengagement.research.repository;

import com.engine.mfdengagement.research.dto.BenchmarkMonitorResponse;
import com.engine.mfdengagement.research.dto.CategoryMonitorResponse;
import com.engine.mfdengagement.research.model.SchemeMaster;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResearchRepository extends JpaRepository<SchemeMaster, Long> {

    // Note: ensure the package path in 'new com.engine...' matches your DTO exactly
    @Query("SELECT new com.engine.mfdengagement.research.dto.CategoryMonitorResponse(" +
            "s.schemeCategory, " +
            "COUNT(s), " +
            "AVG(COALESCE(r.return1m, 0)), " + // Use COALESCE to handle nulls if needed, or stick to 'a' table if returns are there
            "AVG(COALESCE(r.return6m, 0)), " +
            "AVG(COALESCE(a.return1y, 0)), " +
            "AVG(COALESCE(a.return3y, 0)), " +
            "AVG(COALESCE(a.return5y, 0)), " +
            "AVG(COALESCE(a.stdDev, 0)), " +
            "AVG(COALESCE(r.alpha3y, 0))) " +
            "FROM SchemeMaster s " +
            "LEFT JOIN SchemeAnalytics a ON s.schemeCode = a.schemeCode " +
            "LEFT JOIN SchemeResearch r ON s.schemeCode = r.schemeCode " +
            "WHERE s.isTracked = true " +
            "GROUP BY s.schemeCategory")
    List<CategoryMonitorResponse> getCategoryAverages();

    // Add inside ResearchRepository interface

    @Query("SELECT new com.engine.mfdengagement.research.dto.BenchmarkMonitorResponse(" +
            "b.benchmarkName, b.nseSymbol, " +
            "a.return1y, a.return3y, a.return5y, a.returnInception, " +
            "a.stdDev, a.sharpeRatio) " +
            "FROM BenchmarkMaster b " +
            "JOIN BenchmarkAnalytics a ON b.benchmarkCode = a.benchmarkCode")
    List<BenchmarkMonitorResponse> getBenchmarkMonitor();
}