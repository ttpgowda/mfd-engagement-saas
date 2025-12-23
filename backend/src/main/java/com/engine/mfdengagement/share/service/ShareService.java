package com.engine.mfdengagement.share.service;

import com.engine.mfdengagement.share.entity.SharedLink;
import com.engine.mfdengagement.share.repository.SharedLinkRepository;
import com.engine.mfdengagement.tenant.config.TenantContext;
import com.engine.mfdengagement.tenant.entity.Tenant;
import com.engine.mfdengagement.tenant.repository.TenantRepository;
import com.engine.mfdengagement.user.entity.User;
import com.engine.mfdengagement.user.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.util.Base64;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ShareService {

    private final SharedLinkRepository sharedLinkRepository;
    private final com.engine.mfdengagement.lead.repository.LeadRepository leadRepository;
    private final TenantRepository tenantRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;

    private static final SecureRandom random = new SecureRandom();

    @Transactional
    public SharedLink createLink(String toolSlug, Map<String, Object> config, String title, String description,
            String username) {
        String tenantId = TenantContext.getTenantId();
        Tenant tenant = tenantRepository.findByTenantId(tenantId)
                .orElseThrow(() -> new RuntimeException("Tenant not found: " + tenantId));

        User user = null;
        if (username != null) {
            user = userRepository.findByUsername(username)
                    .orElse(null);
        }

        String shortCode = generateUniqueShortCode();

        String configStr;
        try {
            configStr = objectMapper.writeValueAsString(config);
        } catch (Exception e) {
            throw new RuntimeException("Error serializing config", e);
        }

        SharedLink link = SharedLink.builder()
                .shortCode(shortCode)
                .toolSlug(toolSlug)
                .configJson(configStr)
                .title(title)
                .description(description)
                .tenant(tenant)
                .createdByUser(user)
                .build();

        return sharedLinkRepository.save(link);
    }

    @PersistenceContext
    private EntityManager entityManager;

    @Transactional(readOnly = true)
    public Optional<SharedLink> getLink(String shortCode) {
        // We must perform a global lookup because shared links are public resources.
        // A link created by Tenant A must be resolvable even if the request comes
        // to a generic domain or a specific Tenant B subdomain (common in social
        // sharing).

        org.hibernate.Session session = entityManager.unwrap(org.hibernate.Session.class);
        boolean filterWasEnabled = session.getEnabledFilter("tenantFilter") != null;

        if (filterWasEnabled) {
            session.disableFilter("tenantFilter");
        }

        try {
            return sharedLinkRepository.findByShortCode(shortCode);
        } finally {
            if (filterWasEnabled) {
                String tenantId = TenantContext.getTenantId();
                if (tenantId != null) {
                    session.enableFilter("tenantFilter").setParameter("tenantIdentifier", tenantId);
                }
            }
        }
    }

    private String generateUniqueShortCode() {
        String code;
        do {
            byte[] bytes = new byte[6]; // 6 bytes -> 8 base64 chars
            random.nextBytes(bytes);
            code = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
        } while (sharedLinkRepository.existsByShortCode(code));
        return code;
    }

    @Transactional
    public void captureLead(String shortCode, String toolSlug, String name, String email, String phone) {
        SharedLink link;

        if ("demo".equals(shortCode) && toolSlug != null) {
            link = getOrCreateDemoLink(toolSlug);
        } else {
            // Global lookup reuse
            Optional<SharedLink> linkOpt = getLink(shortCode);
            link = linkOpt.orElseThrow(() -> new RuntimeException("Link not found"));
        }

        com.engine.mfdengagement.lead.entity.Lead lead = com.engine.mfdengagement.lead.entity.Lead.builder()
                .name(name)
                .email(email)
                .phone(phone)
                .source("Shared Link")
                .sharedLink(link)
                .tenant(link.getTenant())
                .status(com.engine.mfdengagement.lead.entity.LeadStatus.NEW)
                .build();

        leadRepository.save(lead);
    }

    @Transactional(propagation = org.springframework.transaction.annotation.Propagation.REQUIRES_NEW)
    public SharedLink getOrCreateDemoLink(String toolSlug) {
        String demoShortCode = "demo-" + toolSlug;

        // Optimistic check
        Optional<SharedLink> existing = sharedLinkRepository.findByShortCode(demoShortCode);
        if (existing.isPresent()) {
            return existing.get();
        }

        // Find a system tenant (fallback to any tenant)
        Tenant systemTenant = entityManager
                .createQuery("FROM Tenant", Tenant.class)
                .setMaxResults(1)
                .getResultList()
                .stream()
                .findFirst()
                .orElse(null);

        return sharedLinkRepository.save(SharedLink.builder()
                .shortCode(demoShortCode)
                .toolSlug(toolSlug)
                .title("Demo: " + toolSlug)
                .tenant(systemTenant)
                .configJson("{}")
                .build());
    }
}
