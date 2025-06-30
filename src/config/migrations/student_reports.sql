CREATE TABLE IF NOT EXISTS student_reports (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    report_type ENUM('discharge', 'termination') NOT NULL,
    first_day_attendance DATE NOT NULL,
    last_day_attendance DATE NOT NULL,
    early_exam_success BOOLEAN DEFAULT FALSE,
    exam_not_passed BOOLEAN DEFAULT FALSE,
    employment_date DATE,
    is_employment BOOLEAN DEFAULT FALSE,
    insufficient_performance BOOLEAN DEFAULT FALSE,
    longer_periods_absence BOOLEAN DEFAULT FALSE,
    other_reasons BOOLEAN DEFAULT FALSE,
    reasons TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES student(id) ON DELETE CASCADE
);
