-- Make product code uniqueness tenant-scoped.

SET @drop_code_index = (
    SELECT COUNT(1)
    FROM information_schema.statistics
    WHERE table_schema = DATABASE()
      AND table_name = 'products'
      AND index_name = 'code'
);

SET @sql_statement = IF(
    @drop_code_index > 0,
    'ALTER TABLE products DROP INDEX code',
    'SELECT 1'
);

PREPARE stmt FROM @sql_statement;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @composite_index_exists = (
    SELECT COUNT(1)
    FROM information_schema.statistics
    WHERE table_schema = DATABASE()
      AND table_name = 'products'
      AND index_name = 'uk_products_company_code'
);

SET @sql_statement = IF(
    @composite_index_exists = 0,
    'ALTER TABLE products ADD UNIQUE INDEX uk_products_company_code (company_id, code)',
    'SELECT 1'
);

PREPARE stmt FROM @sql_statement;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;