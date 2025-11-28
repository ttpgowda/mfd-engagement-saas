package com.engine.mfdengagement.mutualfund.domain;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "scheme_master")
@Data
public class SchemeMaster {
    @Id
    @Column(name = "\"schemeCode\"")
    private Long schemeCode;

    @Column(name = "\"schemeName\"")
    private String schemeName;

    @Column(name = "is_tracked")
    private Boolean isTracked;

    @Column(name = "is_backfilled")
    private Boolean isBackfilled;

    @Column(name = "fund_house")
    private String fundHouse;

    @Column(name = "scheme_category")
    private String schemeCategory;

    @Column(name = "isin_growth")
    private String isinGrowth;

    @Column(name = "isin_div_reinvestment")
    private String isinDivReinvestment;
}
