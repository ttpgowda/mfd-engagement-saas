package com.engine.mfdengagement.research.model;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "benchmark_master", schema = "public")
public class BenchmarkMaster {
    @Id
    @Column(name = "benchmark_code", nullable = false)
    private Long benchmarkCode;

    @Column(name = "benchmark_name", length = 255)
    private String benchmarkName;

    @Column(name = "nse_symbol", length = 255)
    private String nseSymbol;

    @Column(name = "yahoo_ticker", length = 255)
    private String yahooTicker;

    @Column(name = "category_mapping", length = 255)
    private String categoryMapping;
}
