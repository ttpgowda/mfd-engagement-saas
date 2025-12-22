package com.engine.mfdengagement.lead.entity;

import com.engine.mfdengagement.common.entity.BaseEntity;
import com.engine.mfdengagement.tenant.entity.Tenant;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.Filter;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;

@Entity
@Table(name = "survey_responses", indexes = {
        @Index(name = "idx_survey_session_id", columnList = "sessionId"),
        @Index(name = "idx_survey_type", columnList = "surveyType")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Filter(name = "tenantFilter", condition = "tenant_id IN (SELECT t.id FROM tenants t WHERE t.tenantid = :tenantIdentifier)")
public class SurveyResponse extends BaseEntity {

    @Column(nullable = false, length = 50)
    private String surveyType; // e.g., "RISK_PROFILER", "FINANCIAL_HEALTH"

    @Column(nullable = false, length = 64)
    private String sessionId; // Browser Session UUID

    @Column(length = 64)
    private String sharedLinkShortCode; // Source tracking

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lead_id") // Nullable
    private Lead lead;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tenant_id", nullable = false)
    private Tenant tenant;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private SurveyStatus status; // STARTED, COMPLETED, ABANDONED

    @Column
    private LocalDateTime completedAt;

    // JSON Data Fields

    @Column(columnDefinition = "jsonb")
    @JdbcTypeCode(SqlTypes.JSON)
    private String responseData; // Answers, Scores, Calculations

    @Column(columnDefinition = "jsonb")
    @JdbcTypeCode(SqlTypes.JSON)
    private String metadata; // UserAgent, TimeSpent, etc.
}
