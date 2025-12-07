package com.engine.mfdengagement.research.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SchemeDropdownDto {
    private Long schemeCode;
    private String schemeName;
}