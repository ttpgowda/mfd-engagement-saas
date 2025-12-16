package com.engine.mfdengagement.tenant.dto;

import lombok.Data;

@Data
public class TenantDTO {
    private String tenantId;
    private String name;
    private String contactEmail;
    private String phone;
    private boolean active = true;
    private String logoUrl;
    private String primaryColor;
    private String secondaryColor;
    private String website;
    private String faviconUrl;
    private String darkLogoUrl;
    private String mobileLogoUrl;
    private String instagramUrl;
    private String linkedinUrl;
    private String twitterUrl;
}
