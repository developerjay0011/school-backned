-- Modify signature_image column in assessment_links table to use MEDIUMTEXT
ALTER TABLE assessment_links
MODIFY COLUMN signature_image MEDIUMTEXT;
