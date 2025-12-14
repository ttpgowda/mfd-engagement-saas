package com.engine.mfdengagement.lead.repository;

import com.engine.mfdengagement.lead.entity.RiskProfileResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RiskProfileRepository extends JpaRepository<RiskProfileResponse, Long> {

    @Query("SELECT r FROM RiskProfileResponse r JOIN FETCH r.lead l WHERE l.tenant.id = :tenantId ORDER BY r.createdAt DESC")
    List<RiskProfileResponse> findAllByTenantId(@Param("tenantId") Long tenantId);
}
