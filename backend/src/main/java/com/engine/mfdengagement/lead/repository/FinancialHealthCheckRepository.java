package com.engine.mfdengagement.lead.repository;

import com.engine.mfdengagement.lead.entity.FinancialHealthCheckResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FinancialHealthCheckRepository extends JpaRepository<FinancialHealthCheckResponse, Long> {
    List<FinancialHealthCheckResponse> findByLeadTenantId(Long tenantId);

    @Query("SELECT r FROM FinancialHealthCheckResponse r WHERE r.lead.tenant.id = :tenantId ORDER BY r.createdAt DESC")
    List<FinancialHealthCheckResponse> findAllByTenantIdOrderByCreatedAtDesc(Long tenantId);
}
