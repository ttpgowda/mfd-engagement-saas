package com.engine.mfdengagement.tenant.entity;

import com.engine.mfdengagement.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tenants")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Tenant extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String tenantId;  // Used in @TenantId

    private String name;

    private String contactEmail;

    private String phone;

    private boolean active = true;

    private String subDomain;
}
