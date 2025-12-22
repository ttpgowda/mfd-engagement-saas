-- Fix duplicate key violation by ensuring existing tokens have correct tenant_id
-- This allows the application to find them (via tenant filter) and update them instead of trying to insert duplicates.

-- Backfill tenant_id for RefreshToken from Users table
UPDATE refreshtoken rt
SET tenant_id = u.tenant_id
FROM users u
WHERE rt.user_id = u.id
AND rt.tenant_id IS NULL;

-- Backfill tenant_id for VerificationToken
UPDATE verificationtoken vt
SET tenant_id = u.tenant_id
FROM users u
WHERE vt.user_id = u.id
AND vt.tenant_id IS NULL;

-- Backfill tenant_id for PasswordResetToken
UPDATE passwordresettoken prt
SET tenant_id = u.tenant_id
FROM users u
WHERE prt.user_id = u.id
AND prt.tenant_id IS NULL;
