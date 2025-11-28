package com.engine.mfdengagement.config;

import com.engine.mfdengagement.user.repository.UserRepository;
import com.engine.mfdengagement.tenant.repository.TenantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class DiagnosticRunner implements CommandLineRunner {

    private final UserRepository userRepository;
    private final TenantRepository tenantRepository;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        System.out.println("=== DIAGNOSTIC START ===");

        System.out.println("--- Tenants ---");
        tenantRepository.findAll().forEach(t -> {
            System.out.println("ID: " + t.getId() + ", TenantID: " + t.getTenantId() + ", Name: " + t.getName());
        });

        System.out.println("--- Users ---");
        userRepository.findAll().forEach(u -> {
            System.out.println("ID: " + u.getId() + ", Username: " + u.getUsername() + ", Tenant: "
                    + (u.getTenant() != null ? u.getTenant().getTenantId() + " (ID: " + u.getTenant().getId() + ")"
                            : "NULL"));
        });

        System.out.println("=== DIAGNOSTIC END ===");
    }
}
