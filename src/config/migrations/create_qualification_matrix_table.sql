CREATE TABLE qualification_matrix (
    id INT PRIMARY KEY AUTO_INCREMENT,
    description VARCHAR(255),
    pdf_url VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
