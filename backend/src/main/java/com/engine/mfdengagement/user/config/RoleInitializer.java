package com.engine.mfdengagement.user.config;

import com.engine.mfdengagement.user.entity.Permission;
import com.engine.mfdengagement.user.entity.Role;
import com.engine.mfdengagement.user.repository.PermissionRepository;
import com.engine.mfdengagement.user.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class RoleInitializer implements CommandLineRunner {

    private final PermissionRepository permissionRepository;
    private final RoleRepository roleRepository;

    @Override
    public void run(String... args) {
        // 1. Create Permissions
        createPermissionIfNotFound("USER_READ", "Read user details");
        createPermissionIfNotFound("USER_WRITE", "Create or update users");
        createPermissionIfNotFound("TENANT_MANAGE", "Manage tenants (Super Admin only)");
        createPermissionIfNotFound("TEAM_MANAGE", "Manage teams and projects");
        createPermissionIfNotFound("MUTUAL_FUND_READ", "Read mutual fund data");
        createPermissionIfNotFound("LEAD_READ", "Read leads");
        createPermissionIfNotFound("LEAD_WRITE", "Create or update leads");
        createPermissionIfNotFound("ROLE_READ", "Read roles and permissions");
        createPermissionIfNotFound("ROLE_WRITE", "Manage roles and permissions");
        createPermissionIfNotFound("TEMPLATE_READ", "Read templates");
        createPermissionIfNotFound("TEMPLATE_WRITE", "Manage templates");

        // 2. Define Roles and Assign Permissions
        createRoleIfNotFound("SUPER_ADMIN", List.of(
                "USER_READ", "USER_WRITE", "TENANT_MANAGE", "TEAM_MANAGE",
                "MUTUAL_FUND_READ", "LEAD_READ", "LEAD_WRITE", "ROLE_READ", "ROLE_WRITE",
                "TEMPLATE_READ", "TEMPLATE_WRITE"));
        createRoleIfNotFound("COMPANY_ADMIN", List.of(
                "USER_READ", "USER_WRITE", "TEAM_MANAGE",
                "MUTUAL_FUND_READ", "LEAD_READ", "LEAD_WRITE", "ROLE_READ", "ROLE_WRITE",
                "TEMPLATE_READ", "TEMPLATE_WRITE"));
        createRoleIfNotFound("MANAGER", List.of("USER_READ", "TEAM_MANAGE", "LEAD_READ", "LEAD_WRITE"));
        createRoleIfNotFound("SUPPORT", List.of("USER_READ", "LEAD_READ"));
        createRoleIfNotFound("USER", List.of("USER_READ"));
    }

    private void createPermissionIfNotFound(String name, String description) {
        permissionRepository.findByName(name).orElseGet(() -> {
            Permission permission = Permission.builder()
                    .name(name)
                    .description(description)
                    .build();
            return permissionRepository.save(permission);
        });
    }

    private void createRoleIfNotFound(String roleName, List<String> permissionNames) {
        Role role = roleRepository.findByName(roleName).orElse(null);
        if (role == null) {
            role = Role.builder().name(roleName).build();
        }

        Set<Permission> permissions = new HashSet<>();
        for (String permName : permissionNames) {
            permissionRepository.findByName(permName).ifPresent(permissions::add);
        }
        role.setPermissions(permissions);
        roleRepository.save(role);
    }
}
