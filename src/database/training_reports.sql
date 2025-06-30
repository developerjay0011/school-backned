CREATE TABLE IF NOT EXISTS `training_reports` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nr` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `ue` varchar(255) NOT NULL,
  `signature` LONGTEXT NOT NULL,
  `lecturer_id` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `lecturer_id` (`lecturer_id`),
  CONSTRAINT `training_reports_ibfk_1` FOREIGN KEY (`lecturer_id`) REFERENCES `lecturers` (`lecturer_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
