package com.engine.mfdengagement.research.dto;

import lombok.Data;

@Data
public class TopFundsRequest {
    private String category;
    private int page = 0;
    private int size = 20;
    private String sortBy = "return_3y"; // Options: return_1y, return_3y, return_5y, return_inception
    private String sortDirection = "DESC";
}