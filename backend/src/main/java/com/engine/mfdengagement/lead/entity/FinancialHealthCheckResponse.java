package com.engine.mfdengagement.lead.entity;

import com.engine.mfdengagement.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "financial_health_check_responses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FinancialHealthCheckResponse extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

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
