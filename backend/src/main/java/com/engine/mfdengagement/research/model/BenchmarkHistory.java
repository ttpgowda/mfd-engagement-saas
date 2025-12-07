package com.engine.mfdengagement.research.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "benchmark_history")
@Data
@IdClass(BenchmarkHistoryId.class)
public class BenchmarkHistory {

    @Id
    @Column(name = "benchmark_code")
    private Long benchmarkCode;

    @Id
    @Column(name = "nav_date")
    private LocalDate navDate;

    @Column(name = "close_value")
    private BigDecimal closeValue;
}
