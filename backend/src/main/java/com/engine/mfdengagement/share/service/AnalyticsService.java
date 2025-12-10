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

    @Transactional
    public void trackHeartbeat(String shortCode, String sessionId, Integer durationDelta, String eventType) {
        // We must perform a global lookup because a shared link might be accessed
        // from a different domain/tenant context than the one that created it,
        // especially during local testing or cross-tenant sharing.

        org.hibernate.Session session = entityManager.unwrap(org.hibernate.Session.class);
        boolean filterWasEnabled = session.getEnabledFilter("tenantFilter") != null;
        if (filterWasEnabled) {
            session.disableFilter("tenantFilter");
        }

        try {
            SharedLink link = sharedLinkRepository.findByShortCode(shortCode)
                    .orElseThrow(() -> new RuntimeException("Link not found"));

            List<AnalyticsLog> logs = analyticsLogRepository.findBySessionId(sessionId);

            // Simple logic: If existing VIEW log exists for this session/link, update
            // duration.
            // Else create new.
            AnalyticsLog log = logs.stream()
                    .filter(l -> l.getSharedLink().getId().equals(link.getId()))
                    .findFirst()
                    .orElse(null);

            if (log == null) {
                log = AnalyticsLog.builder()
                        .sessionId(sessionId)
                        .sharedLink(link)
                        .eventType("VIEW") // Initial event is always VIEW if created during heartbeat fallback
                        .durationSeconds(0)
                        .tenant(link.getTenant())
                        .build();
            }

            if ("HEARTBEAT".equals(eventType)) {
                log.setDurationSeconds(log.getDurationSeconds() + durationDelta);
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
}
