USE schooldb;

CREATE TABLE IF NOT EXISTS student_attendance (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id VARCHAR(10) NOT NULL,
    attendance_date DATE NOT NULL,
    morning_attendance BOOLEAN DEFAULT FALSE,
    morning_attendance_time TIMESTAMP NULL,
    afternoon_attendance BOOLEAN DEFAULT FALSE,
    afternoon_attendance_time TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES student(student_id),
    UNIQUE KEY unique_student_date (student_id, attendance_date)
);

-- Add indexes for better query performance
CREATE INDEX idx_student_attendance_date ON student_attendance(attendance_date);
CREATE INDEX idx_student_attendance_student ON student_attendance(student_id);