-- Add product image URL column.

SET @image_url_exists = (
    SELECT COUNT(1)
    FROM information_schema.columns
    WHERE table_schema = DATABASE()
      AND table_name = 'products'
      AND column_name = 'image_url'
);

SET @sql_statement = IF(
    @image_url_exists = 0,
    'ALTER TABLE products ADD COLUMN image_url VARCHAR(500) NULL AFTER img',
    'SELECT 1'
);

PREPARE stmt FROM @sql_statement;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;