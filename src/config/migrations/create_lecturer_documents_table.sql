USE meteorin_test_db;

CREATE TABLE IF NOT EXISTS lecturer_documents (
    id INT PRIMARY KEY AUTO_INCREMENT,
    lecturer_id VARCHAR(20) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    FOREIGN KEY (lecturer_id) REFERENCES lecturers(lecturer_id)
);
