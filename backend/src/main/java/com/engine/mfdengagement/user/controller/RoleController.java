package com.engine.mfdengagement.user.controller;

import com.engine.mfdengagement.user.entity.Permission;
import com.engine.mfdengagement.user.entity.Role;
import com.engine.mfdengagement.user.repository.PermissionRepository;
import com.engine.mfdengagement.user.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/roles")
@RequiredArgsConstructor
public class RoleController {

    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;

    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_READ')")
    public ResponseEntity<List<Role>> getAllRoles() {
        return ResponseEntity.ok(roleRepository.findAll());
    }

    @GetMapping("/permissions")
    @PreAuthorize("hasAuthority('ROLE_READ')")
    public ResponseEntity<List<Permission>> getAllPermissions() {
        return ResponseEntity.ok(permissionRepository.findAll());
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_WRITE')")
    public ResponseEntity<Role> createRole(@RequestBody Role role) {
        // Ensure permissions are fetched from DB to avoid transient instances
        Set<Permission> permissions = new HashSet<>();
        if (role.getPermissions() != null) {
            for (Permission p : role.getPermissions()) {
                permissionRepository.findById(p.getId()).ifPresent(permissions::add);
            }
        }
        role.setPermissions(permissions);
        return ResponseEntity.ok(roleRepository.save(role));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_WRITE')")
    public ResponseEntity<Role> updateRole(@PathVariable Long id, @RequestBody Role roleDetails) {
        return roleRepository.findById(id).map(role -> {
            role.setName(roleDetails.getName());
            role.setDescription(roleDetails.getDescription());

            Set<Permission> permissions = new HashSet<>();
            if (roleDetails.getPermissions() != null) {
                for (Permission p : roleDetails.getPermissions()) {
                    permissionRepository.findById(p.getId()).ifPresent(permissions::add);
                }
            }
            role.setPermissions(permissions);

            return ResponseEntity.ok(roleRepository.save(role));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_WRITE')")
    public ResponseEntity<Void> deleteRole(@PathVariable Long id) {
        roleRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
