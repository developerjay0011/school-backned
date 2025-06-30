CREATE TABLE IF NOT EXISTS student_files (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id VARCHAR(255) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    description TEXT,
    uploaded_by VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    FOREIGN KEY (student_id) REFERENCES student(student_id),
    FOREIGN KEY (uploaded_by) REFERENCES lecturers(lecturer_id)
);
