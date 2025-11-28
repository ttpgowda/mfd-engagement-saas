package com.engine.mfdengagement.mutualfund.domain;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "scheme_analytics")
@Data
public class SchemeAnalytics {
    @Id
    @Column(name = "scheme_code")
    private Long schemeCode;

    @OneToOne
    @MapsId
    @JoinColumn(name = "scheme_code")
    private SchemeMaster schemeMaster;

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
}
