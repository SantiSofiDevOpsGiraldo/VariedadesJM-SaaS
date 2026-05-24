-- V3__multi_tenant_onboarding.sql
-- Multi-tenant SaaS onboarding and tenant segregation

CREATE TABLE companies (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL UNIQUE,
    legal_name VARCHAR(180),
    tax_id VARCHAR(40) UNIQUE,
    email VARCHAR(120),
    phone VARCHAR(30),
    address VARCHAR(200),
    city VARCHAR(100),
    country VARCHAR(100),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO companies (id, name, legal_name, tax_id, email, phone, address, city, country, active, created_at)
VALUES (1, 'Variedades JM', 'Variedades JM SAS', 'DEFAULT-001', 'contacto@variedadesjm.com', NULL, NULL, NULL, 'Colombia', TRUE, NOW());

CREATE TABLE users_new (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    auth_provider VARCHAR(20) NOT NULL DEFAULT 'EMAIL',
    company_id BIGINT NULL,
    onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE,
    full_name VARCHAR(100) NOT NULL,
    role ENUM('OWNER', 'ADMIN', 'EMPLOYEE') NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_users_company FOREIGN KEY (company_id) REFERENCES companies(id)
);

INSERT INTO users_new (id, username, email, password, auth_provider, company_id, onboarding_completed, full_name, role, active, created_at, updated_at)
SELECT
    id,
    username,
    email,
    password,
    'EMAIL',
    1,
    TRUE,
    full_name,
    CASE
        WHEN role = 'ADMIN' THEN 'OWNER'
        WHEN role = 'CAJERO' THEN 'EMPLOYEE'
        ELSE role
    END,
    active,
    created_at,
    updated_at
FROM users;

ALTER TABLE sales DROP FOREIGN KEY fk_sales_cashier;

RENAME TABLE users TO users_legacy, users_new TO users;

ALTER TABLE sales
    ADD CONSTRAINT fk_sales_cashier FOREIGN KEY (cashier_id) REFERENCES users(id);

ALTER TABLE products
    ADD COLUMN company_id BIGINT NOT NULL DEFAULT 1,
    ADD INDEX idx_products_company (company_id),
    ADD CONSTRAINT fk_products_company FOREIGN KEY (company_id) REFERENCES companies(id);

ALTER TABLE services
    ADD COLUMN company_id BIGINT NOT NULL DEFAULT 1,
    ADD INDEX idx_services_company (company_id),
    ADD CONSTRAINT fk_services_company FOREIGN KEY (company_id) REFERENCES companies(id);

ALTER TABLE affiliates
    ADD COLUMN company_id BIGINT NOT NULL DEFAULT 1,
    ADD INDEX idx_affiliates_company (company_id),
    ADD CONSTRAINT fk_affiliates_company FOREIGN KEY (company_id) REFERENCES companies(id);

ALTER TABLE cash_sessions
    ADD COLUMN company_id BIGINT NOT NULL DEFAULT 1,
    ADD INDEX idx_cash_sessions_company (company_id),
    ADD CONSTRAINT fk_cash_sessions_company FOREIGN KEY (company_id) REFERENCES companies(id);

ALTER TABLE sales
    ADD COLUMN company_id BIGINT NOT NULL DEFAULT 1,
    ADD INDEX idx_sales_company (company_id),
    ADD CONSTRAINT fk_sales_company FOREIGN KEY (company_id) REFERENCES companies(id);

UPDATE users
SET auth_provider = 'EMAIL',
    onboarding_completed = TRUE
WHERE company_id = 1;

UPDATE products SET company_id = 1 WHERE company_id IS NULL;
UPDATE services SET company_id = 1 WHERE company_id IS NULL;
UPDATE affiliates SET company_id = 1 WHERE company_id IS NULL;
UPDATE cash_sessions SET company_id = 1 WHERE company_id IS NULL;
UPDATE sales SET company_id = 1 WHERE company_id IS NULL;

