-- V1__create_initial_schema.sql
-- Variedades JM POS - Initial Database Schema

CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('ADMIN', 'CAJERO')),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(20) NOT NULL CHECK (category IN ('PAPELERIA', 'REGALOS', 'FOTOCOPIAS', 'DULCES', 'OTRO')),
    price DECIMAL(15,2) NOT NULL,
    stock INT NOT NULL,
    img VARCHAR(500),
    status VARCHAR(20) NOT NULL CHECK (status IN ('SALUDABLE', 'STOCK_BAJO', 'AGOTADO')),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_products_category (category),
    INDEX idx_products_status (status),
    INDEX idx_products_stock (stock)
);

CREATE TABLE sales (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    subtotal DECIMAL(15,2) NOT NULL,
    tax DECIMAL(15,2) NOT NULL DEFAULT 0,
    total DECIMAL(15,2) NOT NULL,
    payment_method VARCHAR(25) NOT NULL CHECK (payment_method IN ('EFECTIVO', 'TRANSFERENCIA', 'TRANSFERENCIA_NEQUI', 'TARJETA', 'OTRO')),
    cashier_id BIGINT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_sales_cashier (cashier_id),
    INDEX idx_sales_created (created_at),
    CONSTRAINT fk_sales_cashier FOREIGN KEY (cashier_id) REFERENCES users(id)
);

CREATE TABLE sale_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    sale_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    product_name VARCHAR(150) NOT NULL,
    price DECIMAL(15,2) NOT NULL,
    quantity INT NOT NULL,
    INDEX idx_sale_items_sale (sale_id),
    INDEX idx_sale_items_product (product_id),
    CONSTRAINT fk_sale_items_sale FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE CASCADE
);

CREATE TABLE services (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    client_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    status VARCHAR(20) NOT NULL CHECK (status IN ('PENDIENTE', 'EN_PROCESO', 'ENTREGADO')),
    budget DECIMAL(15,2) NOT NULL,
    advance DECIMAL(15,2) NOT NULL DEFAULT 0,
    type VARCHAR(20) NOT NULL CHECK (type IN ('ANCHETA', 'IMPRESION', 'PERSONALIZACION', 'OTRO')),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_services_status (status),
    INDEX idx_services_client (client_name)
);

CREATE TABLE service_payments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    service_id BIGINT NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    method VARCHAR(25) NOT NULL CHECK (method IN ('EFECTIVO', 'TRANSFERENCIA', 'TRANSFERENCIA_NEQUI', 'TARJETA', 'OTRO')),
    description VARCHAR(300),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_service_payments_service (service_id),
    CONSTRAINT fk_service_payments_service FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
);

CREATE TABLE affiliates (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    id_document VARCHAR(30) NOT NULL UNIQUE,
    phone VARCHAR(20),
    email VARCHAR(100),
    level VARCHAR(20) NOT NULL CHECK (level IN ('ORO', 'PLATA', 'BRONCE')),
    points INT NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_affiliates_level (level)
);

CREATE TABLE cash_sessions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    opened_at DATETIME NOT NULL,
    closed_at DATETIME,
    opened_by VARCHAR(100) NOT NULL,
    closed_by VARCHAR(100),
    initial_base DECIMAL(15,2) NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('ABIERTA', 'CERRADA')),
    expected_total DECIMAL(15,2),
    actual_total DECIMAL(15,2),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_cash_sessions_status (status)
);

CREATE TABLE cash_transactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    session_id BIGINT NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('INGRESO', 'EGRESO', 'APERTURA', 'CIERRE')),
    amount DECIMAL(15,2) NOT NULL,
    description VARCHAR(300),
    method VARCHAR(25) NOT NULL CHECK (method IN ('EFECTIVO', 'TRANSFERENCIA', 'TARJETA', 'TRANSFERENCIA_NEQUI', 'OTRO')),
    reference_id VARCHAR(50),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_cash_transactions_session (session_id),
    INDEX idx_cash_transactions_type (type),
    CONSTRAINT fk_cash_transactions_session FOREIGN KEY (session_id) REFERENCES cash_sessions(id)
);
