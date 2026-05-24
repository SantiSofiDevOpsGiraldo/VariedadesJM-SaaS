-- V2__seed_data.sql
-- Variedades JM POS - Seed Data

-- Admin user: password = BCrypt hash of "admin123"
INSERT INTO users (username, email, password, full_name, role, active, created_at)
VALUES ('admin', 'admin@variedadesjm.com', '$2a$10$MXKGQRMvtdSLgOcPzhRtFuoeYehsXACNSr6wSwuU/pL5b9AzFCh9K', 'Admin Principal', 'ADMIN', TRUE, NOW());

-- Cashier user: password = BCrypt hash of "cajero123"
INSERT INTO users (username, email, password, full_name, role, active, created_at)
VALUES ('cajero', 'cajero@variedadesjm.com', '$2a$10$csqlIEOJnYbf5IU1IE8V4ODXABJbvANHIYuaspDr.nEE7NBnvy98G', 'Cajero 1', 'CAJERO', TRUE, NOW());

-- 10 sample products
INSERT INTO products (code, name, category, price, stock, status, created_at)
VALUES
    ('PAP-001', 'Cuaderno Universitario', 'PAPELERIA', 4500.00, 50, 'SALUDABLE', NOW()),
    ('PAP-002', 'Bolígrafo BIC', 'PAPELERIA', 1500.00, 100, 'SALUDABLE', NOW()),
    ('PAP-003', 'Resma Papel A4', 'PAPELERIA', 12000.00, 25, 'SALUDABLE', NOW()),
    ('REG-001', 'Tarjeta de Cumpleaños', 'REGALOS', 3500.00, 30, 'SALUDABLE', NOW()),
    ('REG-002', 'Caja para Regalo Grande', 'REGALOS', 8000.00, 15, 'SALUDABLE', NOW()),
    ('FOT-001', 'Fotocopia Blanco y Negro', 'FOTOCOPIAS', 200.00, 500, 'SALUDABLE', NOW()),
    ('FOT-002', 'Impresión Color A4', 'FOTOCOPIAS', 1500.00, 200, 'SALUDABLE', NOW()),
    ('DUL-001', 'Chocoramo', 'DULCES', 2500.00, 40, 'SALUDABLE', NOW()),
    ('DUL-002', 'Galletas Festival', 'DULCES', 1800.00, 35, 'SALUDABLE', NOW()),
    ('OTR-001', 'Sobre Manila', 'OTRO', 500.00, 8, 'STOCK_BAJO', NOW());

-- 3 sample affiliates
INSERT INTO affiliates (name, id_document, phone, email, level, points, created_at)
VALUES
    ('María García', '1098765432', '3001234567', 'maria@email.com', 'ORO', 5500, NOW()),
    ('Carlos López', '1087654321', '3009876543', 'carlos@email.com', 'PLATA', 2500, NOW()),
    ('Ana Martínez', '1076543210', '3005551234', 'ana@email.com', 'BRONCE', 800, NOW());

-- 1 open cash session
INSERT INTO cash_sessions (opened_at, opened_by, initial_base, status, expected_total, created_at)
VALUES (NOW(), 'admin', 200000.00, 'ABIERTA', 200000.00, NOW());

-- Opening transaction for the session
INSERT INTO cash_transactions (session_id, type, amount, description, method, created_at)
VALUES (1, 'APERTURA', 200000.00, 'Apertura de caja', 'EFECTIVO', NOW());
