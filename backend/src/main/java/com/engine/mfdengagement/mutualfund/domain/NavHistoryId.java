package com.engine.mfdengagement.mutualfund.domain;

import java.io.Serializable;
import java.time.LocalDate;
import lombok.Data;

@Data
public class NavHistoryId implements Serializable {
    private Long schemeCode;
    private LocalDate navDate;
}
