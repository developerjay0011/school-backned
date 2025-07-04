CREATE TABLE IF NOT EXISTS `positions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `position` VARCHAR(255) NOT NULL,
  `responsibility_authority` TEXT NOT NULL,
  `internal_external` ENUM('Internal', 'External') NOT NULL,
  `hierarchically_assigned_to` INT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `admin_users`(`id`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `trainings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `topic` VARCHAR(255) NOT NULL,
  `quarter` ENUM('Q1', 'Q2', 'Q3', 'Q4') NOT NULL,
  `year` YEAR NOT NULL,
  `actual_date` DATE NOT NULL,
  `participation` VARCHAR(255),
  `reason_non_participation` TEXT,
  `effectiveness` TEXT,
  `feedback_assessment` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `admin_users`(`id`) ON DELETE CASCADE
);
