package com.engine.mfdengagement.user.preference.entity;

import com.engine.mfdengagement.common.entity.BaseEntity;
import com.engine.mfdengagement.tenant.entity.Tenant;
import com.engine.mfdengagement.user.entity.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.Map;

@Entity
@Table(name = "user_template_preferences", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "user_id", "aspect_ratio" })
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserTemplatePreference extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tenant_id", nullable = false)
    private Tenant tenant;

    @Column(name = "aspect_ratio", nullable = false) // SQUARE, PORTRAIT, STORY, LANDSCAPE
    private String aspectRatio;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private Map<String, Object> frameConfig; // Stores the relative % zones
}
