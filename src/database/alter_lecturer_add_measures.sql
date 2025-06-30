-- Add measures_id column to lecturer table
ALTER TABLE lecturer
ADD COLUMN measures_id INT,
ADD CONSTRAINT fk_lecturer_measures
FOREIGN KEY (measures_id) REFERENCES measurements(id);
