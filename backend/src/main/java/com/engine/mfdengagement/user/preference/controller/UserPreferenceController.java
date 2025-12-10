package com.engine.mfdengagement.user.preference.controller;

import com.engine.mfdengagement.tenant.entity.Tenant;
import com.engine.mfdengagement.tenant.repository.TenantRepository;
import com.engine.mfdengagement.user.entity.User;
import com.engine.mfdengagement.user.repository.UserRepository;
import com.engine.mfdengagement.user.preference.entity.UserTemplatePreference;
import com.engine.mfdengagement.user.preference.repository.UserTemplatePreferenceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/user/preferences")
@RequiredArgsConstructor
public class UserPreferenceController {

    private final UserTemplatePreferenceRepository preferenceRepository;
    private final UserRepository userRepository;
    private final TenantRepository tenantRepository;

    @PostMapping("/{aspectRatio}")
    public ResponseEntity<?> savePreference(
            @PathVariable String aspectRatio,
            @RequestBody Map<String, Object> frameConfig,
            Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getTenant() == null) {
            throw new RuntimeException("User has no tenant");
        }
        Tenant tenant = user.getTenant();

        Optional<UserTemplatePreference> existing = preferenceRepository.findByUserIdAndAspectRatio(user.getId(),
                aspectRatio);

        UserTemplatePreference preference;
        if (existing.isPresent()) {
            preference = existing.get();
            preference.setFrameConfig(frameConfig);
        } else {
            preference = UserTemplatePreference.builder()
                    .user(user)
                    .tenant(tenant)
                    .aspectRatio(aspectRatio)
                    .frameConfig(frameConfig)
                    .build();
        }

        preferenceRepository.save(preference);
        return ResponseEntity.ok("Preference saved");
    }

    @GetMapping("/{aspectRatio}")
    public ResponseEntity<?> getPreference(
            @PathVariable String aspectRatio,
            Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Optional<UserTemplatePreference> preference = preferenceRepository.findByUserIdAndAspectRatio(user.getId(),
                aspectRatio);

        if (preference.isPresent()) {
            return ResponseEntity.ok(preference.get().getFrameConfig());
        } else {
            return ResponseEntity.noContent().build();
        }
    }
}
