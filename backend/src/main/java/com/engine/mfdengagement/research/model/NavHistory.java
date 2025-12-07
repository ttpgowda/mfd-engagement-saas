package com.engine.mfdengagement.research.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Table(name = "nav_history")
@Data
@IdClass(NavHistoryId.class)
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
