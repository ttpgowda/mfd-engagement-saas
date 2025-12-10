-- Migration for User Template Preferences

CREATE TABLE IF NOT EXISTS user_template_preferences (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    tenant_id BIGINT NOT NULL,
    aspect_ratio VARCHAR(50) NOT NULL,
    frame_config JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_utp_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_utp_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id),
    CONSTRAINT uq_utp_user_ratio UNIQUE (user_id, aspect_ratio)
);

-- Index for faster lookup
CREATE INDEX idx_utp_user_ratio ON user_template_preferences(user_id, aspect_ratio);
