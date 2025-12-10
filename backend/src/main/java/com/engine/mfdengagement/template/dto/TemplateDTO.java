package com.engine.mfdengagement.template.dto;

import com.engine.mfdengagement.template.entity.TemplateCategory;
import lombok.*;

import java.time.Instant;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TemplateDTO {
    private Long id;
    private String name;
    private String description;
    private TemplateCategory category;
    private String subCategory;
    private Map<String, Object> templateData;
    private String logoUrl;
    private Boolean isPublic;

    // Customization fields
    private String companyName;
    private String phone;
    private String email;
    private String website;
    private String address;

    // Design customization
    private String primaryColor;
    private String secondaryColor;
    private String fontFamily;

    private String previewImageUrl;

    // Audit fields
    private Instant createdAt;
    private Instant updatedAt;
    private String createdBy;
    private String updatedBy;
}
