package com.engine.mfdengagement.tenant.controller;

import com.engine.mfdengagement.tenant.entity.Tenant;
import com.engine.mfdengagement.tenant.repository.TenantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/public/tenant")
@RequiredArgsConstructor
public class PublicTenantController {

    private final TenantRepository tenantRepository;

    @GetMapping("/{tenantId}")
    public ResponseEntity<Tenant> getTenantByStringId(@PathVariable String tenantId) {
        System.out.println("PublicTenantController: Fetching tenant with ID: " + tenantId);

        // Check if filter is enabled?
        // We can't easily check session here without injecting EntityManager.

        return tenantRepository.findByTenantId(tenantId)
                .map(tenant -> {
                    System.out.println("PublicTenantController: Found tenant: " + tenant.getName());
                    return ResponseEntity.ok(tenant);
                })
                .orElseGet(() -> {
                    System.out.println("PublicTenantController: Tenant not found for ID: " + tenantId);
                    return ResponseEntity.notFound().build();
                });
    }
}
