-- Migration script to enable Multi-Login (1:M Refresh Tokens)
-- This script removes the unique constraint on the user_id column in the refreshtoken table.

DO $$
DECLARE
    constraint_record RECORD;
BEGIN
    -- unique constraint on user_id usually follows naming convention uk_... or refreshtoken_user_id_key
    -- We want to keep the unique constraint on the 'token' column itself.
    -- We want to DROP the unique constraint on 'user_id' (or user_id + maybe something else if compound, but likely just user_id for OneToOne).
    
    FOR constraint_record IN (
        SELECT tc.constraint_name
        FROM information_schema.table_constraints AS tc
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
          AND tc.table_schema = kcu.table_schema
        WHERE tc.table_name = 'refreshtoken'
          AND tc.constraint_type = 'UNIQUE'
          AND kcu.column_name = 'user_id'
    ) LOOP
        RAISE NOTICE 'Dropping constraint: %', constraint_record.constraint_name;
        EXECUTE 'ALTER TABLE refreshtoken DROP CONSTRAINT ' || constraint_record.constraint_name;
    END LOOP;
END $$;
