package com.engine.mfdengagement.research.dto;

import lombok.Data;

@Data
public class LumpsumRequest {
    private String category;
    private int years; // Period in years (e.g., 1 to 22)
    private double amount; // Investment Amount
    private int page = 0;
    private int size = 20;
}