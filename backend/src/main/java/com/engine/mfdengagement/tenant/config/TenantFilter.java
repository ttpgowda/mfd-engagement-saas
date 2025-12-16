package com.engine.mfdengagement.tenant.config;

import com.engine.mfdengagement.Util.TenantUtil;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;

import java.io.IOException;

@Component
@Order(2)
public class TenantFilter implements Filter {

    private static final String TENANT_HEADER = "X-Tenant-ID";

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${app.domain:localhost}")
    private String appDomain;

    // Cache the SecretKey for performance
    private SecretKey cachedSecretKey;

    private SecretKey getSecretKey() {
        if (cachedSecretKey == null) {
            cachedSecretKey = Keys.hmacShaKeyFor(jwtSecret.getBytes());
        }
        return cachedSecretKey;
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest httpRequest = (HttpServletRequest) request;
        String tenantId = null;

        try {
            // 1. Try to resolve tenant from JWT
            tenantId = extractTenantFromJWT(httpRequest);

            // 2. Fallback to Header/Subdomain
            if (tenantId == null) {
                tenantId = resolveTenantFromHeaderAndSubdomain(httpRequest);
            }

            // 3. Fallback to default
            if (tenantId == null || tenantId.isBlank()) {
                tenantId = "saas-provider";
            }

            // Skip setting tenant context for public endpoints to avoid filtering
            String path = httpRequest.getRequestURI();
            if (path.startsWith("/api/public/")) {
                // Do not set tenantId in context, so Aspect won't enable filter
                TenantContext.clear();
            } else {
                // Set tenant ID in context
                TenantContext.setTenantId(tenantId);
            }

            chain.doFilter(request, response);

        } finally {
            // Clear the tenant context
            TenantContext.clear();
        }
    }

    private String resolveTenantFromHeaderAndSubdomain(HttpServletRequest request) {
        // 1. Header
        String headerTenant = request.getHeader(TENANT_HEADER);
        if (headerTenant != null && !headerTenant.isBlank())
            return headerTenant.trim();

        // 2. Subdomain
        return extractTenantFromSubdomain(request.getServerName());
    }

    private String extractTenantFromJWT(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            try {
                String token = authHeader.substring(7);
                Claims claims = Jwts.parserBuilder()
                        .setSigningKey(getSecretKey())
                        .build()
                        .parseClaimsJws(token)
                        .getBody();

                if (claims.containsKey("tenantId")) {
                    return claims.get("tenantId", String.class);
                }
            } catch (Exception e) {
                System.err.println("JWT parsing failed during tenant extraction: " + e.getMessage());
            }
        }
        return null;
    }

    private String extractTenantFromSubdomain(String host) {
        if (host == null)
            return null;

        // Remove port if present (e.g. tenant1.localhost:3000)
        if (host.contains(":")) {
            host = host.split(":")[0];
        }

        if (host.endsWith(appDomain)) {
            String[] parts = host.split("\\.");
            // Check if we have a subdomain
            // e.g. tenant1.thewealthweb.in -> parts length 3 (tenant1, thewealthweb, in)
            // e.g. tenant1.localhost -> parts length 2 (tenant1, localhost)

            int domainParts = appDomain.split("\\.").length;
            if (parts.length > domainParts) {
                String subdomain = parts[0];
                if (!subdomain.equalsIgnoreCase("www")) {
                    return subdomain;
                }
            }
        }
        return null;
    }
}