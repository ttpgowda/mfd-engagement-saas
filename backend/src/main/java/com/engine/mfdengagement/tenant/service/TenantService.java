package com.engine.mfdengagement.tenant.service;

import com.engine.mfdengagement.tenant.dto.TenantDTO;
import com.engine.mfdengagement.tenant.entity.Tenant;
import com.engine.mfdengagement.tenant.repository.TenantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TenantService {

    private final TenantRepository tenantRepository;

    public Tenant createTenant(TenantDTO dto) {
        Tenant tenant = Tenant.builder()
                .tenantId(dto.getTenantId())
                .name(dto.getName())
                .contactEmail(dto.getContactEmail())
                .phone(dto.getPhone())
                .active(dto.isActive())
                .logoUrl(dto.getLogoUrl())
                .primaryColor(dto.getPrimaryColor())
                .secondaryColor(dto.getSecondaryColor())
                .website(dto.getWebsite())
                .faviconUrl(dto.getFaviconUrl())
                .darkLogoUrl(dto.getDarkLogoUrl())
                .mobileLogoUrl(dto.getMobileLogoUrl())
                .instagramUrl(dto.getInstagramUrl())
                .linkedinUrl(dto.getLinkedinUrl())
                .twitterUrl(dto.getTwitterUrl())
                .build();

        return tenantRepository.save(tenant);
    }

    public List<Tenant> getAllTenants() {
        return tenantRepository.findAll();
    }

    public Tenant getTenantById(Long id) {
        return tenantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tenant not found with id: " + id));
    }

    public Tenant updateTenant(Long id, TenantDTO dto) {
        Tenant existing = getTenantById(id);
        existing.setTenantId(dto.getTenantId());
        existing.setName(dto.getName());
        existing.setContactEmail(dto.getContactEmail());
        existing.setPhone(dto.getPhone());
        existing.setActive(dto.isActive());
        existing.setLogoUrl(dto.getLogoUrl());
        existing.setPrimaryColor(dto.getPrimaryColor());
        existing.setSecondaryColor(dto.getSecondaryColor());
        existing.setWebsite(dto.getWebsite());
        existing.setFaviconUrl(dto.getFaviconUrl());
        existing.setDarkLogoUrl(dto.getDarkLogoUrl());
        existing.setMobileLogoUrl(dto.getMobileLogoUrl());
        existing.setInstagramUrl(dto.getInstagramUrl());
        existing.setLinkedinUrl(dto.getLinkedinUrl());
        existing.setTwitterUrl(dto.getTwitterUrl());

        return tenantRepository.save(existing);
    }

    public void deleteTenant(Long id) {
        tenantRepository.deleteById(id);
    }
}
