package com.engine.mfdengagement.lead.entity;

import com.engine.mfdengagement.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "risk_profile_responses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RiskProfileResponse extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lead_id", nullable = false)
    private Lead lead;

    @Column(name = "risk_score")
    private Integer riskScore;

    @Column(name = "risk_category") // CONSERVATIVE, MODERATE, AGGRESSIVE
    private String riskCategory;

    @Column(columnDefinition = "TEXT")
    private String responsesJson; // Storing full Q&A as JSON

    @Column(columnDefinition = "TEXT")
    private String followUpResponsesJson; // Optional follow-up answers
}
