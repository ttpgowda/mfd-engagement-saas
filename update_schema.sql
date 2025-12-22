-- Manually handle the migration to avoid NOT NULL violations on existing data

-- 1. RefreshToken (Assuming table name is 'refreshtoken' based on error, but trying 'refresh_token' just in case)
DO $$
BEGIN
    -- Add columns as nullable first
    BEGIN
        ALTER TABLE refreshtoken ADD COLUMN IF NOT EXISTS createdat TIMESTAMP;
        ALTER TABLE refreshtoken ADD COLUMN IF NOT EXISTS updatedat TIMESTAMP;
        ALTER TABLE refreshtoken ADD COLUMN IF NOT EXISTS createdby VARCHAR(255);
        ALTER TABLE refreshtoken ADD COLUMN IF NOT EXISTS updatedby VARCHAR(255);
        ALTER TABLE refreshtoken ADD COLUMN IF NOT EXISTS deleted BOOLEAN DEFAULT FALSE;
        ALTER TABLE refreshtoken ADD COLUMN IF NOT EXISTS version BIGINT DEFAULT 0;
        ALTER TABLE refreshtoken ADD COLUMN IF NOT EXISTS tenant_id BIGINT;
    EXCEPTION WHEN undefined_table THEN
        -- Try snake_case if table names were previously consistently snake_case
        NULL;
    END;
END $$;

-- Populate default values for existing rows
UPDATE refreshtoken SET createdat = CURRENT_TIMESTAMP WHERE createdat IS NULL;
UPDATE refreshtoken SET updatedat = CURRENT_TIMESTAMP WHERE updatedat IS NULL;
UPDATE refreshtoken SET deleted = FALSE WHERE deleted IS NULL;
UPDATE refreshtoken SET version = 0 WHERE version IS NULL;
-- Note: You might need to manually update tenant_id if you have multiple tenants

-- Now Apply NOT NULL constraints
ALTER TABLE refreshtoken ALTER COLUMN createdat SET NOT NULL;
ALTER TABLE refreshtoken ALTER COLUMN updatedat SET NOT NULL;


-- 2. VerificationToken
DO $$
BEGIN
    BEGIN
        ALTER TABLE verificationtoken ADD COLUMN IF NOT EXISTS createdat TIMESTAMP;
        ALTER TABLE verificationtoken ADD COLUMN IF NOT EXISTS updatedat TIMESTAMP;
        ALTER TABLE verificationtoken ADD COLUMN IF NOT EXISTS createdby VARCHAR(255);
        ALTER TABLE verificationtoken ADD COLUMN IF NOT EXISTS updatedby VARCHAR(255);
        ALTER TABLE verificationtoken ADD COLUMN IF NOT EXISTS deleted BOOLEAN DEFAULT FALSE;
        ALTER TABLE verificationtoken ADD COLUMN IF NOT EXISTS version BIGINT DEFAULT 0;
        ALTER TABLE verificationtoken ADD COLUMN IF NOT EXISTS tenant_id BIGINT;
    EXCEPTION WHEN undefined_table THEN NULL; END;
END $$;

UPDATE verificationtoken SET createdat = CURRENT_TIMESTAMP WHERE createdat IS NULL;
UPDATE verificationtoken SET updatedat = CURRENT_TIMESTAMP WHERE updatedat IS NULL;
UPDATE verificationtoken SET deleted = FALSE WHERE deleted IS NULL;
UPDATE verificationtoken SET version = 0 WHERE version IS NULL;

ALTER TABLE verificationtoken ALTER COLUMN createdat SET NOT NULL;
ALTER TABLE verificationtoken ALTER COLUMN updatedat SET NOT NULL;


-- 3. PasswordResetToken
DO $$
BEGIN
    BEGIN
        ALTER TABLE passwordresettoken ADD COLUMN IF NOT EXISTS createdat TIMESTAMP;
        ALTER TABLE passwordresettoken ADD COLUMN IF NOT EXISTS updatedat TIMESTAMP;
        ALTER TABLE passwordresettoken ADD COLUMN IF NOT EXISTS createdby VARCHAR(255);
        ALTER TABLE passwordresettoken ADD COLUMN IF NOT EXISTS updatedby VARCHAR(255);
        ALTER TABLE passwordresettoken ADD COLUMN IF NOT EXISTS deleted BOOLEAN DEFAULT FALSE;
        ALTER TABLE passwordresettoken ADD COLUMN IF NOT EXISTS version BIGINT DEFAULT 0;
        ALTER TABLE passwordresettoken ADD COLUMN IF NOT EXISTS tenant_id BIGINT;
    EXCEPTION WHEN undefined_table THEN NULL; END;
END $$;

UPDATE passwordresettoken SET createdat = CURRENT_TIMESTAMP WHERE createdat IS NULL;
UPDATE passwordresettoken SET updatedat = CURRENT_TIMESTAMP WHERE updatedat IS NULL;
UPDATE passwordresettoken SET deleted = FALSE WHERE deleted IS NULL;
UPDATE passwordresettoken SET version = 0 WHERE version IS NULL;

ALTER TABLE passwordresettoken ALTER COLUMN createdat SET NOT NULL;
ALTER TABLE passwordresettoken ALTER COLUMN updatedat SET NOT NULL;
