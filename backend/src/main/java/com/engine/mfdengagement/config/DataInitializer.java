package com.engine.mfdengagement.config;

import com.engine.mfdengagement.tenant.entity.Tenant;
import com.engine.mfdengagement.tenant.repository.TenantRepository;
import com.engine.mfdengagement.user.entity.Role;
import com.engine.mfdengagement.user.entity.User;
import com.engine.mfdengagement.user.repository.RoleRepository;
import com.engine.mfdengagement.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.HashSet;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final TenantRepository tenantRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        initializeTenants();
        initializeSuperAdmin();
    }

    private void initializeTenants() {
        // Default Dev Tenant
        String defaultTenantId = "dev-tenant";
        if (tenantRepository.findByTenantId(defaultTenantId).isEmpty()) {
            Tenant tenant = new Tenant();
            tenant.setTenantId(defaultTenantId);
            tenant.setName("Development Tenant");
            tenant.setContactEmail("admin@devtenant.com");
            tenant.setActive(true);
            tenantRepository.save(tenant);
            System.out.println("Initialized default tenant: " + defaultTenantId);
        }

        // SaaS Provider Tenant (for Super Admin)
        String saasTenantId = "saas-provider";
        if (tenantRepository.findByTenantId(saasTenantId).isEmpty()) {
            Tenant tenant = new Tenant();
            tenant.setTenantId(saasTenantId);
            tenant.setName("SaaS Provider");
            tenant.setContactEmail("admin@saasprovider.com");
            tenant.setActive(true);
            tenantRepository.save(tenant);
            System.out.println("Initialized SaaS Provider tenant: " + saasTenantId);
        }
    }

    private void initializeSuperAdmin() {
        String superAdminUsername = "superadmin";
        if (userRepository.findByUsername(superAdminUsername).isEmpty()) {
            Tenant saasTenant = tenantRepository.findByTenantId("saas-provider")
                    .orElseThrow(() -> new RuntimeException("SaaS Provider tenant not found"));

            // RoleInitializer should have created this, but we handle potential race
            // condition or missing role
            Role superAdminRole = roleRepository.findByName("SUPER_ADMIN")
                    .orElseGet(() -> {
                        Role role = new Role();
                        role.setName("SUPER_ADMIN");
                        role.setDescription("Super Administrator");
                        return roleRepository.save(role);
                    });

            User user = User.builder()
                    .username(superAdminUsername)
                    .password(passwordEncoder.encode("admin123")) // Change this in production!
                    .email("admin@saasprovider.com")
                    .fullName("Super Admin")
                    .enabled(true)
                    .tenant(saasTenant)
                    .roles(new HashSet<>(Collections.singletonList(superAdminRole)))
                    .build();

            userRepository.save(user);
            System.out.println("Initialized Super Admin user: " + superAdminUsername);
        }
    }
}
