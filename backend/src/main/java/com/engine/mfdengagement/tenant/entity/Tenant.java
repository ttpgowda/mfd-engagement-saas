package com.engine.mfdengagement.tenant.entity;

import com.engine.mfdengagement.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Filter;

@Entity
@Table(name = "tenants")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Filter(name = "tenantFilter", condition = "tenantid = :tenantIdentifier")
public class Tenant extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tenantid", unique = true, nullable = false)
    private String tenantId; // Used in @TenantId

    private String name;

    private String contactEmail;

    private String phone;

    private boolean active = true;

    private String subDomain;

    private String logoUrl;

    private String primaryColor;

    private String secondaryColor;

    private String website;

    private String faviconUrl;

    private String darkLogoUrl;

    private String mobileLogoUrl;

    private String instagramUrl;

    private String linkedinUrl;

    private String twitterUrl;
}
