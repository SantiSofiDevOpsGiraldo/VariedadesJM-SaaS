-- V7__google_identities.sql
-- Add linked identities for federated login and allow passwordless Google-only users

ALTER TABLE users
    MODIFY password VARCHAR(255) NULL;

CREATE TABLE user_identities (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    provider VARCHAR(20) NOT NULL,
    provider_user_id VARCHAR(120) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_identities_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT uk_user_identities_provider_user UNIQUE (provider, provider_user_id),
    CONSTRAINT uk_user_identities_user_provider UNIQUE (user_id, provider)
);
