package com.engine.mfdengagement.mutualfund.repository;

import com.engine.mfdengagement.mutualfund.domain.NavHistory;
import com.engine.mfdengagement.mutualfund.domain.NavHistoryId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NavHistoryRepository extends JpaRepository<NavHistory, NavHistoryId> {
    Page<NavHistory> findBySchemeCodeOrderByNavDateAsc(Long schemeCode, Pageable pageable);
}
