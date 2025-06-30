-- Add password field to student table
ALTER TABLE student
ADD COLUMN password VARCHAR(255) DEFAULT NULL;
