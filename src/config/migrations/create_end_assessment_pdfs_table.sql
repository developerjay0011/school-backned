USE meteorin_test_db;

CREATE TABLE IF NOT EXISTS end_assessment_pdfs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    assessment_id INT NOT NULL,
    student_id VARCHAR(20) NOT NULL,
    lecturer_id VARCHAR(20) NOT NULL,
    pdf_url VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    FOREIGN KEY (assessment_id) REFERENCES end_assessment(id),
    FOREIGN KEY (student_id) REFERENCES student(student_id),
    FOREIGN KEY (lecturer_id) REFERENCES lecturers(lecturer_id)
);
