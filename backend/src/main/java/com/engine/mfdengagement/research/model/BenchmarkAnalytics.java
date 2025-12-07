package com.engine.mfdengagement.research.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "benchmark_analytics")
@Data
public class BenchmarkAnalytics {

    @Id
    @Column(name = "benchmark_code")
    private Long benchmarkCode;

    @Column(name = "last_updated")
    private LocalDate lastUpdated;

    @Column(name = "close_current")
    private BigDecimal closeCurrent;

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

    @Column(name = "std_dev_1y")
    private BigDecimal stdDev1y;

    @Column(name = "std_dev_3y")
    private BigDecimal stdDev3y;

    @Column(name = "std_dev_5y")
    private BigDecimal stdDev5y;
}
