

-- Create table for form links
CREATE TABLE form_links (
    id INT PRIMARY KEY AUTO_INCREMENT,
    token VARCHAR(255) NOT NULL UNIQUE,
    expiry_date DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create table for form responses
CREATE TABLE form_responses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    form_link_id INT,
    
    -- Basic Information
    basic_info JSON NOT NULL,
    
    -- Languages
    languages JSON NOT NULL,

    -- Special Knowledge
    special_knowledge JSON NOT NULL,

    -- Professional suitability
    professional_suitability JSON NOT NULL,

    -- Personal suitability
    personal_suitability JSON NOT NULL,
    
    -- Personal information
    personal_information JSON NOT NULL,
    
    -- Signatures
    personal_suitability_applicant_signature LONGTEXT,
    professional_information_applicant_signature1 LONGTEXT,
    professional_information_applicant_signature2 LONGTEXT,

    -- Assessment
    assessment JSON NOT NULL,

    -- Notes
    notes JSON NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        
    FOREIGN KEY (form_link_id) REFERENCES form_links(id) ON DELETE SET NULL,
    
    -- Ensure valid JSON in columns
    CHECK (JSON_VALID(basic_info)),
    CHECK (JSON_VALID(languages)),
    CHECK (JSON_VALID(special_knowledge)),
    CHECK (JSON_VALID(professional_suitability)),
    CHECK (JSON_VALID(personal_information)),
    CHECK (JSON_VALID(assessment)),
    CHECK (JSON_VALID(notes))
);
