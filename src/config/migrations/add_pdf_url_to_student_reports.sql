-- Add pdf_url column to student_reports table
ALTER TABLE student_reports
ADD COLUMN pdf_url VARCHAR(255) DEFAULT NULL COMMENT 'URL path to the generated PDF file';

-- Update existing records to have a default value if needed
-- UPDATE student_reports SET pdf_url = CONCAT('/uploads/legacy_report_', id, '.pdf') WHERE pdf_url IS NULL;
