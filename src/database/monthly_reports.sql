CREATE TABLE IF NOT EXISTS `monthly_reports` (
  `id` int NOT NULL AUTO_INCREMENT,
  `lecturer_id` varchar(50) NOT NULL,
  `description` varchar(255) NOT NULL,
  `pdf_url` varchar(255) NOT NULL,
  `month` int NOT NULL,
  `year` int NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `lecturer_id` (`lecturer_id`),
  CONSTRAINT `monthly_reports_ibfk_1` FOREIGN KEY (`lecturer_id`) REFERENCES `lecturers` (`lecturer_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
