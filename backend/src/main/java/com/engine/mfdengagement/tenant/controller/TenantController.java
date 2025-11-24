package com.engine.mfdengagement.tenant.controller;


import com.engine.mfdengagement.tenant.dto.TenantDTO;
import com.engine.mfdengagement.tenant.entity.Tenant;
import com.engine.mfdengagement.tenant.service.TenantService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tenants")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ROLE_SUPER_ADMIN')")
public class TenantController {

    private final TenantService tenantService;

    @PostMapping
    public ResponseEntity<Tenant> createTenant(@RequestBody TenantDTO tenantDTO) {
        return ResponseEntity.ok(tenantService.createTenant(tenantDTO));
    }

    @GetMapping
    public ResponseEntity<List<Tenant>> getAllTenants() {
        return ResponseEntity.ok(tenantService.getAllTenants());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Tenant> getTenantById(@PathVariable Long id) {
        return ResponseEntity.ok(tenantService.getTenantById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Tenant> updateTenant(@PathVariable Long id, @RequestBody TenantDTO tenantDTO) {
        return ResponseEntity.ok(tenantService.updateTenant(id, tenantDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTenant(@PathVariable Long id) {
        tenantService.deleteTenant(id);
        return ResponseEntity.noContent().build();
    }
}
