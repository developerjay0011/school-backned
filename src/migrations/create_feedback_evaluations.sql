CREATE TABLE IF NOT EXISTS feedback_evaluations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date_from DATE NOT NULL,
    date_until DATE NOT NULL,
    measures_id INT NOT NULL,
    pdf_url VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (measures_id) REFERENCES measures(id)
);
