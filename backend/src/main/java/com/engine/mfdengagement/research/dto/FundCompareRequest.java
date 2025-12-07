package com.engine.mfdengagement.research.dto;

import lombok.Data;
import java.util.List;

@Data
public class FundCompareRequest {
    private List<Long> schemeCodes;
}