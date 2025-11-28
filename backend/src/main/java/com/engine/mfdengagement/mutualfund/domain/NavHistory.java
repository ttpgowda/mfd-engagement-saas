package com.engine.mfdengagement.mutualfund.domain;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Table(name = "nav_history")
@IdClass(NavHistoryId.class)
@Data
public class NavHistory {
    @Id
    @Column(name = "scheme_code")
    private Long schemeCode;

    @Id
    @Column(name = "nav_date")
    private LocalDate navDate;

    @Column(name = "nav_value")
    private Double navValue;
}
