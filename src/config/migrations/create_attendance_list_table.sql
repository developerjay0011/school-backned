CREATE TABLE IF NOT EXISTS attendance_list (
    id INT PRIMARY KEY AUTO_INCREMENT,
    datetime DATETIME NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    pdf_url VARCHAR(255) NOT NULL,
    student_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
