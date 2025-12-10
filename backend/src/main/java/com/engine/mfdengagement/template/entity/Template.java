package com.engine.mfdengagement.template.entity;

import com.engine.mfdengagement.common.entity.BaseEntity;
import com.engine.mfdengagement.tenant.entity.Tenant;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Filter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.Map;

@Entity
@Table(name = "templates")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Filter(name = "tenantFilter", condition = "tenant_id IN (SELECT t.id FROM tenants t WHERE t.tenantid = :tenantIdentifier)")
public class Template extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tenant_id", nullable = false)
    private Tenant tenant;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TemplateCategory category;

    @Column(length = 100)
    private String subCategory;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private Map<String, Object> templateData;

    @Column(length = 500)
    private String logoUrl;

    @Builder.Default
    @Column(nullable = false)
    private Boolean isPublic = false;

    // Customization fields
    private String companyName;
    private String phone;
    private String email;
    private String website;
    private String address;

    // Design customization
    private String primaryColor;
    private String secondaryColor;
    private String fontFamily;

    @Column(length = 500)
    private String previewImageUrl;
}
