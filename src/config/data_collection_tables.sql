-- Table for storing data collection forms
CREATE TABLE data_collection_forms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    token VARCHAR(255) NOT NULL UNIQUE,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    expiry_date TIMESTAMP NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table for storing form sections
CREATE TABLE form_sections (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    order_number INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for storing form fields
CREATE TABLE form_fields (
    id INT AUTO_INCREMENT PRIMARY KEY,
    section_id INT NOT NULL,
    field_type ENUM('text', 'number', 'date', 'select', 'radio', 'checkbox', 'textarea', 'signature') NOT NULL,
    label VARCHAR(255) NOT NULL,
    placeholder VARCHAR(255),
    options TEXT,  -- JSON array for select/radio/checkbox options
    is_required BOOLEAN DEFAULT FALSE,
    order_number INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (section_id) REFERENCES form_sections(id)
);

-- Table for storing form responses
CREATE TABLE form_responses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    form_id INT NOT NULL,
    field_id INT NOT NULL,
    response_value TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (form_id) REFERENCES data_collection_forms(id),
    FOREIGN KEY (field_id) REFERENCES form_fields(id)
);
