package com.engine.mfdengagement.share.service;

import com.engine.mfdengagement.share.entity.AnalyticsLog;
import com.engine.mfdengagement.share.entity.SharedLink;
import com.engine.mfdengagement.share.repository.AnalyticsLogRepository;
import com.engine.mfdengagement.share.repository.SharedLinkRepository;

import com.engine.mfdengagement.tenant.config.TenantContext;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final AnalyticsLogRepository analyticsLogRepository;
    private final SharedLinkRepository sharedLinkRepository;

    @PersistenceContext
    private EntityManager entityManager;

    @org.springframework.beans.factory.annotation.Autowired
    @org.springframework.context.annotation.Lazy
    private AnalyticsService self;

    // Removed @Transactional to allow manual transaction boundaries
    public void trackHeartbeat(String shortCode, String toolSlug, String sessionId, Integer durationDelta,
            String eventType,
            String parentShortCode) {
        // We must perform a global lookup because a shared link might be accessed
        // from a different domain/tenant context than the one that created it,
        // especially during local testing or cross-tenant sharing.

        org.hibernate.Session session = entityManager.unwrap(org.hibernate.Session.class);
        boolean filterWasEnabled = session.getEnabledFilter("tenantFilter") != null;
        if (filterWasEnabled) {
            session.disableFilter("tenantFilter");
        }

        try {
            SharedLink link;

            if ("demo".equals(shortCode) && toolSlug != null) {
                // Handle Demo Pages: Create/Find a system shared link
                try {
                    link = self.getOrCreateDemoLink(toolSlug);
                } catch (Exception e) {
                    // If creation failed (race condition), try fetching one last time
                    String demoShortCode = "demo-" + toolSlug;
                    link = self.findLinkIgnoringTenancy(demoShortCode);
                    if (link == null) {
                        throw new RuntimeException(
                                "Link creation failed and recovery failed for: " + demoShortCode, e);
                    }
                }
            } else {
                // Regular Shared Link
                link = sharedLinkRepository.findByShortCode(shortCode)
                        .orElseThrow(() -> new RuntimeException("Link not found"));
            }

            if (link != null) {
                self.updateAnalyticsLog(link, sessionId, durationDelta, eventType, parentShortCode);
            }

        } finally {
            if (filterWasEnabled) {
                String tenantId = TenantContext.getTenantId();
                if (tenantId != null) {
                    session.enableFilter("tenantFilter").setParameter("tenantIdentifier", tenantId);
                }
            }
        }
    }

    @Transactional(propagation = org.springframework.transaction.annotation.Propagation.REQUIRES_NEW)
    public SharedLink getOrCreateDemoLink(String toolSlug) {
        String demoShortCode = "demo-" + toolSlug;

        // Optimistic check
        java.util.Optional<SharedLink> existing = sharedLinkRepository.findByShortCode(demoShortCode);
        if (existing.isPresent()) {
            return existing.get();
        }

        // Find a system tenant (fallback to any tenant)
        com.engine.mfdengagement.tenant.entity.Tenant systemTenant = entityManager
                .createQuery("FROM Tenant", com.engine.mfdengagement.tenant.entity.Tenant.class)
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

    @Transactional
    public void updateAnalyticsLog(SharedLink link, String sessionId, Integer durationDelta, String eventType,
            String parentShortCode) {
        // Disable tenant filter for analytics logging
        org.hibernate.Session session = entityManager.unwrap(org.hibernate.Session.class);
        boolean filterWasEnabled = session.getEnabledFilter("tenantFilter") != null;
        if (filterWasEnabled) {
            session.disableFilter("tenantFilter");
        }

        try {
            List<AnalyticsLog> logs = analyticsLogRepository.findBySessionId(sessionId);

            // Find existing log for this session AND link
            AnalyticsLog log = logs.stream()
                    .filter(l -> l.getSharedLink().getId().equals(link.getId()))
                    .findFirst()
                    .orElse(null);

            if (log == null) {
                log = AnalyticsLog.builder()
                        .sessionId(sessionId)
                        .sharedLink(link)
                        .eventType("VIEW") // Initial state
                        .durationSeconds(0)
                        .interactionCount(0)
                        .converted(false)
                        .parentShortCode(parentShortCode) // Track referrer journey
                        .tenant(link.getTenant())
                        .build();
            }

            // Update metrics based on event type
            if ("HEARTBEAT".equals(eventType)) {
                log.setDurationSeconds(log.getDurationSeconds() + durationDelta);
            } else if ("INTERACTION".equals(eventType)) {
                log.setInteractionCount(log.getInteractionCount() + 1);
            } else if ("CONVERSION".equals(eventType)) {
                log.setConverted(true);
            }

            analyticsLogRepository.save(log);
        } finally {
            if (filterWasEnabled) {
                String tenantId = TenantContext.getTenantId();
                if (tenantId != null) {
                    session.enableFilter("tenantFilter").setParameter("tenantIdentifier", tenantId);
                }
            }
        }
    }

    @Transactional(readOnly = true)
    public SharedLink findLinkIgnoringTenancy(String shortCode) {
        org.hibernate.Session session = entityManager.unwrap(org.hibernate.Session.class);
        boolean filterWasEnabled = session.getEnabledFilter("tenantFilter") != null;
        if (filterWasEnabled) {
            session.disableFilter("tenantFilter");
        }
        try {
            return sharedLinkRepository.findByShortCode(shortCode).orElse(null);
        } finally {
            // Technically read-only tx will close, but good practice if in same session
            if (filterWasEnabled) {
                String tenantId = TenantContext.getTenantId();
                if (tenantId != null) {
                    session.enableFilter("tenantFilter").setParameter("tenantIdentifier", tenantId);
                }
            }
        }
    }

}
