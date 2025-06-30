CREATE DATABASE IF NOT EXISTS schooldb;
USE schooldb;

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
