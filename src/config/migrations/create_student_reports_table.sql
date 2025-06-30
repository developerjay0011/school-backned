-- Create student_reports table
CREATE TABLE IF NOT EXISTS `student_reports` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `student_id` int(11) NOT NULL,
  `report_type` enum('discharge','termination') NOT NULL,
  `first_day_attendance` date DEFAULT NULL,
  `last_day_attendance` date DEFAULT NULL,
  `early_exam_success` tinyint(1) DEFAULT 0,
  `exam_not_passed` tinyint(1) DEFAULT 0,
  `insufficient_performance` tinyint(1) DEFAULT 0,
  `longer_periods_absence` tinyint(1) DEFAULT 0,
  `other_reasons` tinyint(1) DEFAULT 0,
  `reasons` text DEFAULT NULL,
  `employment_date` date DEFAULT NULL,
  `pdf_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `student_id` (`student_id`),
  CONSTRAINT `student_reports_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
