USE meteorin_test_db;

CREATE TABLE IF NOT EXISTS end_assessment (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id VARCHAR(20) NOT NULL,
    lecturer_id VARCHAR(20) NOT NULL,
    greatest_success_experience TEXT,
    personal_development TEXT,
    biggest_challenge TEXT,
    oral_participation TEXT,
    written_performance TEXT,
    handling_learning_difficulties TEXT,
    development_weaker_areas TEXT,
    utilization_support_services TEXT,
    overall_assessment TEXT,
    instructor_signature LONGTEXT,  -- For base64 image
    participant_name VARCHAR(255),  -- Student's name as signature
    assessment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    FOREIGN KEY (student_id) REFERENCES student(student_id),
    FOREIGN KEY (lecturer_id) REFERENCES lecturers(lecturer_id)
);
