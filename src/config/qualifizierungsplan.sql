DROP TABLE IF EXISTS qualifizierungsplan;

CREATE TABLE qualifizierungsplan (
    id INT PRIMARY KEY AUTO_INCREMENT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    description TEXT,
    pdf_url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
