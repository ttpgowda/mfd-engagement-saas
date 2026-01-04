# Migration Guide: Multi-Tenant to Single-Tenant (B2C)

This guide outlines the steps to convert the current Multi-Tenant SaaS application into a Single-Tenant B2C application.

## Strategy: Functional Single-Tenancy
This strategy "locks" the application to a single default tenant without requiring complex database schema migrations. The `tenant_id` column remains in the database but is automatically populated and filtered by the backend with a fixed value.

### Prerequisites
1. Ensure the `tenants` table has **one row** that will act as the single tenant.
   - Example: `id=1`, `tenantid='default'`, `name='My B2C App'`.

---

## Step 1: Backend Changes (Java / Spring Boot)

### 1. Hardcode Tenant Resolution
**File:** `backend/src/main/java/com/engine/mfdengagement/tenant/config/TenantFilter.java`

**Action:** implementation of `doFilter` should disable dynamic resolution and force a default ID.

```java
// REPLACE the existing resolution logic with this:
String tenantId = "default"; // The hardcoded ID of your single tenant
TenantContext.setTenantId(tenantId);
chain.doFilter(request, response);
```

### 2. (Optional) Simplify Aspect
The `TenantAspect` will continue to work as is, filtering data for "default". You don't *need* to change it, but you could disable it if you want to see standard behavior without filters (ensure you remove `@Filter` from entities if you do this). For the "Functional" approach, **leave it alone**.

---

## Step 2: Frontend Changes (Next.js)

### 1. Hardcode Tenant Configuration
**File:** `frontend/src/lib/tenant.ts`

**Action:** Simplify `getTenantConfig` to assume a single identity.

```typescript
export async function getTenantConfig(): Promise<TenantConfig | null> {
    // Return your static Single Tenant configuration directly
    return {
        id: 1,
        tenantId: 'default', // Matches backend
        name: 'My B2C App',
        contactEmail: 'support@myapp.com',
        phone: '123-456-7890',
        // ... other branding assets
    };
}
```

### 2. Simplify Middleware
**File:** `frontend/src/middleware.ts`

**Action:** Remove subdomain parsing logic for refresh tokens.

```typescript
// Old: const headerTenant = resolveTenantFromHeaderAndSubdomain(httpRequest);
// New:
const headerTenant = 'default';
```

---

## Step 3: Cleanup (Optional / Phase 2)
Once the app is running as single-tenant, you can perform a deeper cleanup:
1.  **Database:** Drop the `tenants` table and remove `tenant_id` columns from all tables.
2.  **Code:** Remove `TenantFilter`, `TenantAspect`, `TenantContext` entirely.
3.  **Entities:** Remove `@Filter` annotations from all entities (User, Lead, etc.).

## Time Estimate
- **Option A (Functional Lock):** < 1 hour
- **Option B (Deep Cleanup):** 1-2 Days
