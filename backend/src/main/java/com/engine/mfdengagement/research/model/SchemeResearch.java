package com.engine.mfdengagement.research.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "scheme_research")
@Data
public class SchemeResearch {

    @Id
    @Column(name = "scheme_code")
    private Long schemeCode;

    @Column(name = "benchmark_code")
    private Long benchmarkCode;

    @Column(name = "last_updated")
    private LocalDate lastUpdated;

    @Column(name = "alpha_3y", precision = 10, scale = 2)
    private BigDecimal alpha3y;

    @Column(name = "beta_3y", precision = 10, scale = 2)
    private BigDecimal beta3y;

    @Column(name = "r_squared_3y", precision = 10, scale = 2)
    private BigDecimal rSquared3y;

    @Column(name = "sortino_3y", precision = 10, scale = 2)
    private BigDecimal sortino3y;

    @Column(name = "upside_capture_3y", precision = 10, scale = 2)
    private BigDecimal upsideCapture3y;

    @Column(name = "downside_capture_3y", precision = 10, scale = 2)
    private BigDecimal downsideCapture3y;

    @Column(name = "treynor_ratio_3y", precision = 10, scale = 2)
    private BigDecimal treynorRatio3y;

    @Column(name = "info_ratio_3y", precision = 10, scale = 2)
    private BigDecimal infoRatio3y;

    @Column(name = "tracking_error_3y", precision = 10, scale = 2)
    private BigDecimal trackingError3y;

    @Column(name = "max_drawdown_3y", precision = 10, scale = 2)
    private BigDecimal maxDrawdown3y;

    @Column(name = "best_month_3y", precision = 10, scale = 2)
    private BigDecimal bestMonth3y;

    @Column(name = "worst_month_3y", precision = 10, scale = 2)
    private BigDecimal worstMonth3y;

    @Column(name = "return_ytd", precision = 10, scale = 2)
    private BigDecimal returnYtd;

    @Column(name = "return_2024", precision = 10, scale = 2)
    private BigDecimal return2024;

    @Column(name = "return_2023", precision = 10, scale = 2)
    private BigDecimal return2023;

    @Column(name = "return_2022", precision = 10, scale = 2)
    private BigDecimal return2022;

    @Column(name = "return_2021", precision = 10, scale = 2)
    private BigDecimal return2021;

    @Column(name = "return_2020", precision = 10, scale = 2)
    private BigDecimal return2020;

    @Column(name = "return_1m", precision = 10, scale = 2)
    private BigDecimal return1m;

    @Column(name = "return_6m", precision = 10, scale = 2)
    private BigDecimal return6m;

    @OneToOne
    @JoinColumn(name = "scheme_code", referencedColumnName = "schemeCode", insertable = false, updatable = false)
    private SchemeMaster schemeMaster;
}
