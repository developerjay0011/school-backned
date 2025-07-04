USE meteorin_test_db;

ALTER TABLE student
ADD COLUMN lecturer_remark TEXT NULL,
ADD COLUMN remark_updated_at TIMESTAMP NULL;
