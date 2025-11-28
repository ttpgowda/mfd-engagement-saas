package com.engine.mfdengagement.tenant.config;

import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.hibernate.Session;
import org.hibernate.Filter;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Aspect
@Component
@RequiredArgsConstructor
public class TenantAspect {

    private final EntityManager entityManager;

    @Before("execution(* com.engine.mfdengagement..service..*(..))")
    public void enableTenantFilter() {
        Session session = entityManager.unwrap(Session.class);

        // Check if session is valid
        if (session == null || !session.isOpen()) {
            return;
        }

        String tenantId = TenantContext.getTenantId();

        // Check if user is SUPER_ADMIN
        boolean isSuperAdmin = false;
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            isSuperAdmin = authentication.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ROLE_SUPER_ADMIN"));
        }

        if (isSuperAdmin) {
            // Disable filter for Super Admin
            session.disableFilter("tenantFilter");
            // System.out.println("SUPER_ADMIN detected in Aspect: Bypassing tenant
            // filter.");
        } else {
            // Enable filter for others
            if (tenantId != null) {
                Filter filter = session.enableFilter("tenantFilter");
                filter.setParameter("tenantIdentifier", tenantId);
                // System.out.println("TenantAspect: Enabled tenantFilter for tenant: " +
                // tenantId);
            } else {
                // If no tenantId, maybe we should disable the filter to be safe?
                // Or leave it as is (disabled by default)
                // System.out.println("TenantAspect: No tenantId found in context.");
            }
        }
    }
}
