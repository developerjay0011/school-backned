CREATE TABLE success_placement_statistics (
    id INT PRIMARY KEY AUTO_INCREMENT,
    year INT NOT NULL,
    measures_id INT NOT NULL,
    pdf_url VARCHAR(255) NOT NULL,
    description TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (measures_id) REFERENCES measurements(id)
);
