package com.engine.mfdengagement.lead.dto;

import lombok.Data;

@Data
public class LeadDTO {
    private Long id;
    private String name;
    private String phone;
    private String email;
    private String source;
    private String status;
    private String tenantId; // Optional, usually inferred from context
}
