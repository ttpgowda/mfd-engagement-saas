package com.engine.mfdengagement.lead.dto;

import com.engine.mfdengagement.lead.entity.LeadStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LeadDTO {
    private Long id;
    private String name;
    private String phone;
    private String email;
    private String source;
    private LeadStatus status;
    private Long assignedToId;
    private String assignedToName;
    private String notes;
    private String tenantId;
}
