-- Ensure product codes are unique per company, not globally.

ALTER TABLE products
    DROP INDEX code,
    ADD UNIQUE INDEX uk_products_company_code (company_id, code);