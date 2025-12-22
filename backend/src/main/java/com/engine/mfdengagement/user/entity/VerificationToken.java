package com.engine.mfdengagement.user.entity;

import com.engine.mfdengagement.common.entity.BaseEntity;
import com.engine.mfdengagement.tenant.entity.Tenant;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Filter;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Filter(name = "tenantFilter", condition = "tenant_id IN (SELECT t.id FROM tenants t WHERE t.tenantid = :tenantIdentifier)")
public class VerificationToken extends BaseEntity {

    private static final int EXPIRATION = 60 * 24; // 24 hours

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tenant_id", nullable = false)
    private Tenant tenant;

    private String token;

    @OneToOne(targetEntity = User.class, fetch = FetchType.EAGER)
    @JoinColumn(nullable = false, name = "user_id")
    private User user;

    private LocalDateTime expiryDate;

    public VerificationToken(User user) {
        this.user = user;
        this.tenant = user.getTenant();
        this.token = UUID.randomUUID().toString();
        this.expiryDate = LocalDateTime.now().plusMinutes(EXPIRATION);
    }
}
