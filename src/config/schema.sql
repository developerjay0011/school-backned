CREATE DATABASE IF NOT EXISTS schooldb;
USE schooldb;

-- Interim Assessment Table
CREATE TABLE IF NOT EXISTS interim_assessment (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id int(6) UNSIGNED ZEROFILL DEFAULT NULL,
    lecturer_id int(11) NOT NULL,
    learning_status TEXT,
    test_results TEXT,
    lecturer_rating TEXT,
    oral_participation TEXT,
    handling_learning_difficulties TEXT,
    absences TEXT,
    current_learning_progress TEXT,
    is_measure_at_risk BOOLEAN NOT NULL DEFAULT FALSE,
    support_measures TEXT,
    assessment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    lecturer_signature TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    FOREIGN KEY (student_id) REFERENCES student(student_id),
    FOREIGN KEY (lecturer_id) REFERENCES lecturer(id)
);

-- Interim Assessment PDFs Table
CREATE TABLE IF NOT EXISTS interim_assessment_pdfs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    assessment_id INT NOT NULL,
    student_id VARCHAR(255) NOT NULL,
    lecturer_id INT NOT NULL,
    pdf_url VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    FOREIGN KEY (assessment_id) REFERENCES interim_assessment(id),
    FOREIGN KEY (student_id) REFERENCES student(student_id),
    FOREIGN KEY (lecturer_id) REFERENCES lecturer(id)
);

-- Measures Zoom Links Table
CREATE TABLE IF NOT EXISTS measures_zoom_links (
    id INT AUTO_INCREMENT PRIMARY KEY,
    measures_id INT NOT NULL,
    lecturer_id INT(11) NOT NULL,
    zoom_link TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    FOREIGN KEY (measures_id) REFERENCES measurements(id),
    FOREIGN KEY (lecturer_id) REFERENCES lecturer(id)
);

CREATE TABLE IF NOT EXISTS admin_users (
  id INT(6) ZEROFILL AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  street VARCHAR(255) NOT NULL,
  pincode VARCHAR(10) NOT NULL,
  city VARCHAR(100) NOT NULL,
  country VARCHAR(100) NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('super_admin', 'admin') NOT NULL DEFAULT 'admin',
  status ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create Super Admin User (password: SuperAdmin@123)
INSERT INTO admin_users (
  username, 
  first_name, 
  last_name, 
  phone_number, 
  email, 
  street,
  pincode,
  city,
  country,
  password,
  role, 
  status
) VALUES (
  'superadmin',
  'Super',
  'Admin',
  '+1234567890',
  'superadmin@school.com',
  '123 Main Street',
  '380015',
  'Ahmedabad',
  'India',
  '$2b$10$IYHp4EaKvXaOPwHUWePwZOYnmBhXpZqjGzRQEEjYW6GGKmAZhP2Vy',
  'super_admin',
  'Active'
);

-- Create Measurements table
CREATE TABLE IF NOT EXISTS measurements (
  id INT PRIMARY KEY AUTO_INCREMENT,
  measures_number VARCHAR(50) NOT NULL UNIQUE,
  measures_title VARCHAR(255) NOT NULL,
  months INT NOT NULL,
  according_to_paragraph TEXT NOT NULL,
  show_in_documents BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create Intermediaries table
CREATE TABLE IF NOT EXISTS intermediaries (
    id INT PRIMARY KEY AUTO_INCREMENT,
    intermediary VARCHAR(255) NOT NULL,
    agent_email VARCHAR(255) NOT NULL,
    agent_tel BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create Examinations table
CREATE TABLE IF NOT EXISTS examinations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    examination VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create Bridge Days table
CREATE TABLE IF NOT EXISTS bridge_days (
    id INT PRIMARY KEY AUTO_INCREMENT,
    bridge_days VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_bridge_date (bridge_days, date)
);

-- Create According to Paragraph table
CREATE TABLE IF NOT EXISTS according_to_paragraph (
    id INT PRIMARY KEY AUTO_INCREMENT,
    options VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
