package com.engine.mfdengagement.lead.entity;

import com.engine.mfdengagement.common.entity.BaseEntity;
import com.engine.mfdengagement.tenant.entity.Tenant;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Filter;
import org.hibernate.annotations.FilterDef;
import org.hibernate.annotations.ParamDef;

@Entity
@Table(name = "leads")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Filter(name = "tenantFilter", condition = "tenant_id IN (SELECT t.id FROM tenants t WHERE t.tenantid = :tenantIdentifier)")
public class Lead extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tenant_id", nullable = false)
    private Tenant tenant;

    private String name;

    private String phone;

    private String email;

    private String source; // e.g., "SIP Calculator", "WhatsApp"

    private String status; // e.g., "NEW", "CONTACTED", "CONVERTED"
}
