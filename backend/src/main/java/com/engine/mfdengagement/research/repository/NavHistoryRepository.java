package com.engine.mfdengagement.research.repository;

import com.engine.mfdengagement.research.model.NavHistory;
import com.engine.mfdengagement.research.model.NavHistoryId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface NavHistoryRepository extends JpaRepository<NavHistory, NavHistoryId> {
    List<NavHistory> findBySchemeCodeAndNavDateBetweenOrderByNavDateAsc(Long schemeCode, LocalDate startDate,
            LocalDate endDate);

    List<NavHistory> findBySchemeCodeAndNavDateGreaterThanEqualOrderByNavDateAsc(Long schemeCode, LocalDate startDate);

    Optional<NavHistory> findTopBySchemeCodeAndNavDateLessThanEqualOrderByNavDateDesc(Long schemeCode, LocalDate targetStartDate);

    List<NavHistory> findAllBySchemeCodeOrderByNavDateAsc(Long schemeCode);
}
