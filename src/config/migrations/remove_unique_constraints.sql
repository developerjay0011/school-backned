-- Remove unique constraints to allow multiple entries with same name

-- admin_users table
ALTER TABLE admin_users
DROP INDEX username,
DROP INDEX email;

-- examinations table
ALTER TABLE examinations
DROP INDEX examination;

-- intermediaries table (if any unique constraints exist)
ALTER TABLE intermediaries
DROP INDEX IF EXISTS intermediary;

-- lecturers table (if any unique constraints exist)
ALTER TABLE lecturers
DROP INDEX IF EXISTS username,
DROP INDEX IF EXISTS email;
