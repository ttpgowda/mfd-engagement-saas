package com.engine.mfdengagement.lead.entity;

import com.engine.mfdengagement.common.entity.BaseEntity;
import com.engine.mfdengagement.tenant.entity.Tenant;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Filter;

@Entity
@Table(name = "financial_health_check_responses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Filter(name = "tenantFilter", condition = "tenant_id IN (SELECT t.id FROM tenants t WHERE t.tenantid = :tenantIdentifier)")
public class FinancialHealthCheckResponse extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tenant_id", nullable = false)
    private Tenant tenant;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lead_id", nullable = false)
    private Lead lead;

    @Column(name = "total_score")
    private Integer totalScore;

    @Column(name = "score_category") // RED, ORANGE, GREEN
    private String scoreCategory;

    @Column(columnDefinition = "TEXT")
    private String responsesJson; // Storing full Q&A as JSON for flexibility

}
