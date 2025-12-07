package com.engine.mfdengagement.research.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "scheme_analytics")
public class SchemeAnalytics {

    @Id
    @Column(name = "scheme_code")
    private Long schemeCode;

    @Column(name = "last_updated")
    private LocalDate lastUpdated;

    @Column(name = "nav_current")
    private BigDecimal navCurrent;

    @Column(name = "return_1y")
    private BigDecimal return1y;

    @Column(name = "return_3y")
    private BigDecimal return3y;

    @Column(name = "return_5y")
    private BigDecimal return5y;

    @Column(name = "return_inception")
    private BigDecimal returnInception;

    @Column(name = "std_dev")
    private BigDecimal stdDev;

    @Column(name = "sharpe_ratio")
    private BigDecimal sharpeRatio;

    @OneToOne
    @JoinColumn(name = "scheme_code")
    @MapsId
    private SchemeMaster schemeMaster;
}