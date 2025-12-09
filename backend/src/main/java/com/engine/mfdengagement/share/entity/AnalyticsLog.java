package com.engine.mfdengagement.share.entity;

import com.engine.mfdengagement.common.entity.BaseEntity;
import com.engine.mfdengagement.tenant.entity.Tenant;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Filter;

@Entity
@Table(name = "analytics_logs", indexes = {
        @Index(name = "idx_analytics_session_id", columnList = "sessionId")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Filter(name = "tenantFilter", condition = "tenant_id IN (SELECT t.id FROM tenants t WHERE t.tenantid = :tenantIdentifier)")
public class AnalyticsLog extends BaseEntity {

    @Column(nullable = false, length = 64)
    private String sessionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "link_id", nullable = false)
    private SharedLink sharedLink;

    @Column(nullable = false, length = 32)
    private String eventType; // VIEW, HEARTBEAT, CONVERSION

    @Builder.Default
    @Column(nullable = false)
    private Integer durationSeconds = 0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tenant_id", nullable = false)
    private Tenant tenant;
}
