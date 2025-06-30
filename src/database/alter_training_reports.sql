-- Modify signature column to MEDIUMTEXT to store base64 images
-- Modify signature column to LONGTEXT to store large base64 images (up to 4GB)
ALTER TABLE training_reports MODIFY COLUMN signature LONGTEXT NOT NULL;
