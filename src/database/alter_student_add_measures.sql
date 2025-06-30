ALTER TABLE student
ADD COLUMN measures_id INT,
ADD CONSTRAINT fk_student_measures
FOREIGN KEY (measures_id) REFERENCES measures(id)
ON DELETE SET NULL
ON UPDATE CASCADE;
