-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jul 04, 2025 at 03:09 PM
-- Server version: 10.11.11-MariaDB-cll-lve
-- PHP Version: 8.3.17

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `meteorin_test_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `according_to_paragraph`
--

CREATE TABLE `according_to_paragraph` (
  `id` int(11) NOT NULL,
  `options` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `according_to_paragraph`
--

INSERT INTO `according_to_paragraph` (`id`, `options`, `created_at`, `updated_at`) VALUES
(1, '§34a Sachkunde', '2025-03-28 03:35:56', '2025-03-28 03:35:56'),
(2, '§45 Coaching', '2025-03-28 03:35:56', '2025-03-28 03:35:56'),
(3, '§81 Weiterbildung', '2025-03-28 03:35:56', '2025-03-28 03:35:56');

-- --------------------------------------------------------

--
-- Table structure for table `admin_users`
--

CREATE TABLE `admin_users` (
  `id` int(6) UNSIGNED ZEROFILL NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `street` varchar(255) DEFAULT NULL,
  `pincode` varchar(10) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('super_admin','admin') NOT NULL DEFAULT 'admin',
  `status` enum('Active','Inactive') NOT NULL DEFAULT 'Active',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL,
  `reason_non_participation` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `admin_users`
--

INSERT INTO `admin_users` (`id`, `first_name`, `last_name`, `phone_number`, `email`, `street`, `pincode`, `city`, `country`, `password`, `role`, `status`, `created_at`, `updated_at`, `deleted_at`, `reason_non_participation`) VALUES
(000001, 'Super', 'Admin', '+1234567890', 'superadmin@school.com', '123 Main Street', '380015', 'Ahmedabad', 'India', '$2a$10$RvVW.Ea.d3/IS9VOmCdL2ehtxzCUgCofXHkv8VapO7St5cjn1GEha', 'super_admin', 'Active', '2025-03-28 13:18:11', '2025-03-28 13:18:50', NULL, NULL),
(000002, 'Daniel', 'Fard', '+4917682395120', 'fard@bildungsakademie-deutschland.com', 'Neue Hochstr. 50', '13347', 'Berlin', 'Deutschland', '$2a$10$ev6JGWO4tNB/hIMAYqvlBuwl/EWrLhxt1397qxbN/GFWVWp.R4UUq', 'admin', 'Active', '2025-03-28 13:43:48', '2025-06-15 19:30:16', NULL, NULL),
(000003, 'Dhimmar', 'Jay', '7990088388', 'test@gmail.com', '19/20 Maninagar Satyam Shivam Sudaram Appartment', '394327', 'Dist. - Surat', 'superadmin@school.com', '$2a$10$5X8ZOVCLt/iyPUr2LYc6m.IpeonDy.jTdCL.gu5ElLxNgvM1qzL5e', 'admin', 'Active', '2025-04-14 13:41:57', '2025-07-02 15:23:54', NULL, NULL),
(000004, 'Dhimmar', 'Yash', '7990088388', 'yash@gmail.com', '19/20 Maninagar Satyam Shivam Sudaram Appartment', '394327', 'Dist. - Surat', 'India', '$2a$10$P6RjP1ALOzI54RtJupmrq.pmG0vWwBe20RoW1/etcI0CamLgbQy6O', 'admin', 'Active', '2025-05-20 07:44:35', '2025-05-20 07:44:57', NULL, NULL),
(000005, 'Narendra', 'vibhu', '+12345678906', 'modi@gmail.com', '19/20 Maninagar Satyam Shivam Sudaram Appartment', '394327', 'Dist. - Surat', 'India', '$2a$10$HPSxvSPR7N7JFiaRAubE.eiBdZOt.kiRT7M7VLxJy0iM.LisbTNNa', 'admin', 'Active', '2025-05-20 07:45:53', '2025-06-13 13:27:46', NULL, NULL),
(000007, 'Kristin', 'Delitzscher', '+4917665111935', 'delitzscher@bildungsakademie-deutschland.com', 'Neue Hochstraße 50', '13347', 'Berlin', 'Deutschland', '$2a$10$qqrFHAV9R.PSkMXAnEqE..GIwxz2Gb3LlYxZPWVJZ1UYtDwjoQ28q', 'admin', 'Active', '2025-06-16 20:47:34', '2025-06-16 20:50:34', NULL, NULL),
(000009, 'Pamela', 'Zimmermann', '+4915202607875', 'info@bildungsakademie-deutschland.com', 'Neue Hochstraße 50', '13347', 'Berlin', 'Deutschland', '$2a$10$UIBKHz0uiYRoHE5tk0gW0ueBs2vufx4uRH2ewyHy6puClcS3oRFUm', 'admin', 'Active', '2025-06-16 20:49:50', '2025-06-23 09:30:43', '2025-06-23 09:30:43', NULL),
(000011, 'Pamela', 'Zimmermann', '0000000000', 'pamela.zimmermann@placeholder.com', 'N/A', '000000', 'N/A', 'N/A', '$2a$10$5gHPJKSox7nbDl9LvPt4teB9XrRwLH8ENSw5k9.dNOkWiRfLJHo7W', 'admin', 'Active', '2025-06-23 09:31:02', '2025-06-24 11:59:22', '2025-06-24 11:59:22', NULL),
(000012, 'Pamela', 'Zim', '0000000000', 'pamela.zim@placeholder.com', 'N/A', '000000', 'N/A', 'N/A', '$2a$10$G1kDUIzCXQ2Ma4sTjWvxe.Xzpv5QnctW1nBIL/QeFHNTlUEZiCzKS', 'admin', 'Active', '2025-06-23 09:31:28', '2025-06-24 11:59:37', '2025-06-24 11:59:37', NULL),
(000013, 'John', 'Vishal', '0000000000', 'john.vishal@placeholder.com', 'N/A', '000000', 'N/A', 'N/A', '$2a$10$wncJwfZeChPiSonctmU5I.ZuQHmGgyaLFm7nvruTSt5aa09fs8my.', 'admin', 'Active', '2025-06-23 13:43:05', '2025-06-23 15:30:31', '2025-06-23 15:30:31', NULL),
(000014, 'John', 'Vishal', '0000000000', 'john.vishal_1750686227374@placeholder.com', 'N/A', '000000', 'N/A', 'N/A', '$2a$10$nDwV2vnbPeUSvWaZTgorvepaMx2LdSr5HtAd020fCAcFDbP.k7ssu', 'admin', 'Active', '2025-06-23 13:43:47', '2025-06-23 15:30:27', '2025-06-23 15:30:27', NULL),
(000015, 'John', 'Vishal', '0000000000', 'john.vishal_1750686231639@placeholder.com', 'N/A', '000000', 'N/A', 'N/A', '$2a$10$J9Sto9.8XATdNtBU/5Tucu68UmoZBv1aRmvrIRP6lVyQupgFoQiPy', 'admin', 'Active', '2025-06-23 13:43:51', '2025-06-23 15:30:24', '2025-06-23 15:30:24', NULL),
(000016, 'John', 'Vishal', '0000000000', 'john.vishal_1750686239518@placeholder.com', 'N/A', '000000', 'N/A', 'N/A', '$2a$10$9fai5S2tRmSE03IgXuT/Me5sf0m3UUi4qSGfpD/aeMEsbTKYKUVWG', 'admin', 'Active', '2025-06-23 13:43:59', '2025-06-23 15:30:21', '2025-06-23 15:30:21', NULL),
(000017, 'Dhimmar', 'Jay', '0000000000', 'dhimmar.jay@placeholder.com', 'N/A', '000000', 'N/A', 'N/A', '$2a$10$jwUtD0Yu339cIbP6bDPEguhtlzKlZsRA9b9iSy794QMef/PFGSLcy', 'admin', 'Active', '2025-06-23 13:44:58', '2025-06-23 15:30:10', '2025-06-23 15:30:10', NULL),
(000018, 'Dhimmar', 'Jay', '0000000000', 'dhimmar.jay_1750686307662@placeholder.com', 'N/A', '000000', 'N/A', 'N/A', '$2a$10$0xSFVZ84m8T7rwdZdCHOAu3LY4/GxkAyA2yaFiB2AKwXryuKoFrfC', 'admin', 'Active', '2025-06-23 13:45:07', '2025-06-23 15:30:05', '2025-06-23 15:30:05', NULL),
(000019, 'jignasha', 'padaliya', '0176856476465', 'jignasha.padaliya@gmail.com', 'Paul-Zobel-Str., 23', '10367', 'Berlin', 'Deuschland', '$2a$10$F45zhgyir/zm8M96b2jxkuu8bzjqAsditJeM7AowxRdmDOA0qzUX6', 'admin', 'Active', '2025-06-30 10:50:24', '2025-06-30 12:29:31', NULL, NULL),
(000020, 'Janine', 'Emmert', '015226345802', 'j.emmert@bildungsakademie-deutschland.com', 'Neue Hochstraße 50', '13347', 'Berlin', 'Deutschland', '$2a$10$pHUOQEBBzlbuNV8v2qtqseMgniINDJ1K3FMfjbNK0.FLyfsD4Q2Fy', 'admin', 'Active', '2025-06-30 14:22:19', '2025-06-30 14:22:19', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `assessment_links`
--

CREATE TABLE `assessment_links` (
  `id` int(11) NOT NULL,
  `token` varchar(255) NOT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `expiry_date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `is_completed` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `signature_image` mediumtext DEFAULT NULL,
  `comment` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `assessment_links`
--

INSERT INTO `assessment_links` (`id`, `token`, `first_name`, `last_name`, `expiry_date`, `is_completed`, `created_at`, `updated_at`, `signature_image`, `comment`) VALUES
(2, 'e514cc752fd92eb40c25f6828fc0ed9df0a0a54dbae88e9f56bcd48e6017b30d', NULL, NULL, '2025-05-04 05:44:05', 0, '2025-04-27 05:44:05', '2025-04-27 05:44:05', NULL, NULL),
(12, 'da3f4ebf6f64d23a6c04191f0225759df90ca836bcd5c65927c8247e408a0b90', NULL, NULL, '2025-05-09 12:04:37', 0, '2025-05-02 12:04:37', '2025-05-02 12:04:37', NULL, NULL),
(13, '467f94aa2bfcd91a39dd13457719646a64be3590f0b9e374cbe8374caaf24ad7', NULL, NULL, '2025-05-15 04:42:24', 0, '2025-05-08 04:42:24', '2025-05-08 04:42:24', NULL, NULL),
(15, 'fb60d73e67d24691ac28b485b54fb757d4f63a65363817167d302f34285f2a51', NULL, NULL, '2025-06-20 09:22:11', 0, '2025-06-13 09:22:11', '2025-06-13 09:22:11', NULL, NULL),
(16, 'a6937eeeca3259a9fd2daa49eb3b90fbb99c5cd31dca91d44979617708608049', NULL, NULL, '2025-06-27 12:39:38', 0, '2025-06-20 12:39:38', '2025-06-20 12:39:38', NULL, NULL),
(17, 'db88572fb12f5190997be4bd5db31007f57a03ebafc0842a6d2e1cf0162b33e3', NULL, NULL, '2025-07-08 09:39:10', 0, '2025-07-01 09:39:10', '2025-07-01 09:39:10', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `assessment_options`
--

CREATE TABLE `assessment_options` (
  `id` int(11) NOT NULL,
  `question_id` int(11) NOT NULL,
  `option_text` text NOT NULL,
  `is_correct` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `assessment_options`
--

INSERT INTO `assessment_options` (`id`, `question_id`, `option_text`, `is_correct`, `created_at`) VALUES
(1, 1, 'dürfen keine Fahrräder mit zur Schule bringen.', 0, '2025-04-27 05:36:05'),
(2, 1, 'dürfen ihre Fahrräder auf den Schulhof stellen.', 0, '2025-04-27 05:36:05'),
(3, 1, 'müssen ihre Fahrräder in einen speziellen Raum stellen.', 1, '2025-04-27 05:36:05'),
(4, 2, 'Schüler dürfen keine Poster aufhängen.', 0, '2025-04-27 05:36:05'),
(5, 2, 'Schüler müssen dort selber aufräumen.', 1, '2025-04-27 05:36:05'),
(6, 2, 'Schüler können dort nach dem Unterricht lernen.', 0, '2025-04-27 05:36:05'),
(7, 3, 'einen Schlüssel im Sekretariat verlangen.', 1, '2025-04-27 05:36:05'),
(8, 3, 'einmalig 50,- Euro zahlen.', 0, '2025-04-27 05:36:05'),
(9, 3, 'Schüler sein oder bei BAD Bildungsakademie Deutschland GmbH arbeiten.\n', 0, '2025-04-27 05:36:05'),
(10, 4, 'kann von der Schulleitung genehmigt werden.', 0, '2025-04-27 05:36:05'),
(11, 4, 'muss der Lehrperson gemeldet werden.', 0, '2025-04-27 05:36:05'),
(12, 4, 'ist ohne Ausnahme verboten.', 1, '2025-04-27 05:36:05'),
(13, 5, 'Gelassenheit', 1, '2025-04-27 05:36:05'),
(14, 5, 'Zufriedenheit', 0, '2025-04-27 05:36:05'),
(15, 5, 'Aggression', 1, '2025-04-27 05:36:05'),
(16, 6, 'Steigende Konzentrationsfähigkeit', 0, '2025-04-27 05:36:05'),
(17, 6, 'Soziales Engagement', 0, '2025-04-27 05:36:05'),
(18, 6, 'Erweiterte Pupillen, Verfärbungen der Haut', 1, '2025-04-27 05:36:05'),
(19, 7, 'Sich provozieren lassen', 0, '2025-04-27 05:36:05'),
(20, 7, 'Sich mit der Gruppe verbünden', 1, '2025-04-27 05:36:05'),
(21, 7, 'Sich neutral verhalten', 0, '2025-04-27 05:36:05'),
(22, 8, 'Essen', 1, '2025-04-27 05:36:05'),
(23, 8, 'Selbstverwirklichung', 0, '2025-04-27 05:36:05'),
(24, 8, 'Freundschaft', 0, '2025-04-27 05:36:05'),
(25, 9, 'Sind immer freundlich', 0, '2025-04-27 05:36:05'),
(26, 9, 'Probleme mit der Motorik (Gehen, Stehen etc.)', 0, '2025-04-27 05:36:05'),
(27, 9, 'Haben ein erhöhtes Schmerzempfinden', 1, '2025-04-27 05:36:05'),
(28, 10, '16 Prozent', 1, '2025-04-27 05:36:05'),
(29, 10, '18 Prozent', 0, '2025-04-27 05:36:05'),
(30, 10, '19 Prozent', 0, '2025-04-27 05:36:05'),
(31, 11, 'Reinigungskraft', 0, '2025-04-27 05:36:05'),
(32, 11, 'Sicherheitsmitarbeiter im Objektschutz', 1, '2025-04-27 05:36:05'),
(33, 11, 'Busfahrer', 0, '2025-04-27 05:36:05'),
(34, 12, 'Die Polizei', 0, '2025-04-27 05:36:05'),
(35, 12, 'Die Gerichte', 1, '2025-04-27 05:36:05'),
(36, 12, 'Die Sicherheitsdienste', 0, '2025-04-27 05:36:05'),
(37, 13, '5', 0, '2025-04-27 05:36:05'),
(38, 13, '16', 1, '2025-04-27 05:36:05'),
(39, 13, '23', 0, '2025-04-27 05:36:05'),
(40, 14, 'Frau Merkel', 0, '2025-04-27 05:36:05'),
(41, 14, 'Herr Adenauer', 0, '2025-04-27 05:36:05'),
(42, 14, 'Herr Scholz', 1, '2025-04-27 05:36:05'),
(43, 15, 'Hamburg', 1, '2025-04-27 05:27:44'),
(44, 15, 'München', 0, '2025-04-27 05:27:44'),
(45, 15, 'Berlin', 0, '2025-04-27 05:27:44');

-- --------------------------------------------------------

--
-- Table structure for table `assessment_questions`
--

CREATE TABLE `assessment_questions` (
  `id` int(11) NOT NULL,
  `task_number` int(11) NOT NULL,
  `question_text` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `assessment_questions`
--

INSERT INTO `assessment_questions` (`id`, `task_number`, `question_text`, `created_at`) VALUES
(1, 1, 'Schüler …', '2025-04-24 01:56:59'),
(2, 1, 'Für die Klassenräume der BAD Bildungsakademie Deutschland GmbH gilt:', '2025-04-24 01:56:59'),
(3, 1, 'Um die verschließbaren Fächer benutzen zu können, muss man …', '2025-04-24 01:56:59'),
(4, 1, 'Das Trinken von Alkohol …', '2025-04-24 01:56:59'),
(5, 2, 'Frage: Was sind Reaktionen auf Frustration?', '2025-04-24 01:56:59'),
(6, 2, 'Frage: Welche Anzeichen können für Drogenkonsum sprechen?', '2025-04-24 01:56:59'),
(7, 2, 'Frage: Was sollte im Umgang mit Gruppen beachtet werden?', '2025-04-24 01:56:59'),
(8, 2, 'Frage: Welches ist ein Grundbedürfnis eines Menschen?', '2025-04-24 01:56:59'),
(9, 2, 'Frage: Mit welchem Verhalten muss man bei alkoholisierten Personen rechnen?', '2025-04-24 01:56:59'),
(10, 3, 'Frage: Wie hoch ist die Mehrwertsteuer in Deutschland?', '2025-04-24 01:56:59'),
(11, 3, 'Frage: Welchen Tätigkeiten können Sie mit der Sachkundeprüfung nach §34a gemäß GewO nachgehen?', '2025-04-24 01:56:59'),
(12, 3, 'Frage: Wer ist in Deutschland für die Einhaltung der Gesetze Verantwortlich', '2025-04-24 01:56:59'),
(13, 3, 'Frage: Wie viele Bundesländer hat Deutschland', '2025-04-24 01:56:59'),
(14, 3, 'Frage: Wie heißt der aktuelle Bundeskanzler in Deutschland', '2025-04-24 01:56:59'),
(15, 3, 'Frage: Wie heißt die Hauptstadt von Deutschland', '2025-04-24 01:56:59');

-- --------------------------------------------------------

--
-- Table structure for table `assessment_responses`
--

CREATE TABLE `assessment_responses` (
  `id` int(11) NOT NULL,
  `assessment_link_id` int(11) NOT NULL,
  `question_id` int(11) NOT NULL,
  `selected_option_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `pdf_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `attendance_list`
--

CREATE TABLE `attendance_list` (
  `id` int(11) NOT NULL,
  `datetime` datetime NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `pdf_url` varchar(255) NOT NULL,
  `student_id` int(6) UNSIGNED ZEROFILL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `attendance_list`
--

INSERT INTO `attendance_list` (`id`, `datetime`, `start_date`, `end_date`, `pdf_url`, `student_id`, `created_at`) VALUES
(1, '2025-05-24 18:13:58', '2025-05-01', '2025-05-24', 'https://testapi.meteorinfotech.com/uploads/attendance/attendance_1748090636.pdf', 100001, '2025-05-24 12:43:58'),
(2, '2025-05-27 13:46:45', '2025-05-24', '2025-05-27', 'https://testapi.meteorinfotech.com/uploads/attendance/attendance_1748333788.pdf', 100001, '2025-05-27 08:16:45'),
(3, '2025-05-31 17:54:19', '2025-05-01', '2025-05-31', 'https://testapi.meteorinfotech.com/uploads/attendance/attendance_1748694256.pdf', 100001, '2025-05-31 12:24:19'),
(4, '2025-06-17 16:19:52', '2025-06-01', '2025-06-17', 'https://testapi.meteorinfotech.com/uploads/attendance/attendance_1750157392.pdf', 100006, '2025-06-17 10:49:52'),
(5, '2025-06-17 16:22:44', '2025-06-16', '2025-06-17', 'https://testapi.meteorinfotech.com/uploads/attendance/attendance_1750157564.pdf', 100005, '2025-06-17 10:52:44');

-- --------------------------------------------------------

--
-- Table structure for table `authorities`
--

CREATE TABLE `authorities` (
  `id` int(11) NOT NULL,
  `student_id` int(6) UNSIGNED ZEROFILL DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `bg_number` varchar(50) DEFAULT NULL,
  `team` varchar(100) DEFAULT NULL,
  `contact_person` varchar(100) DEFAULT NULL,
  `routing_id` int(11) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `tel` varchar(20) DEFAULT NULL,
  `street` varchar(255) DEFAULT NULL,
  `postal_code` varchar(10) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `authorities`
--

INSERT INTO `authorities` (`id`, `student_id`, `name`, `bg_number`, `team`, `contact_person`, `routing_id`, `email`, `tel`, `street`, `postal_code`, `city`) VALUES
(1, 100001, 'Test', 'DE12423433', 'Daniel', 'sdasd', 3212323, 'info@storeindia.live', '7990088388', '19/20 Maninagar Satyam Shivam Sudaram Appartment', '394327', 'Dist. - Surat'),
(2, 100002, 'Test', 'DE12423433', 'Test', 'fdgfhgfj', 3212323, 'vishal@gmail.com', '7984810153', '19/20 Maninagar Satyam Shivam Sudaram Appartment', '394327', 'Dist. - Surat'),
(3, 100003, 'Test', 'DE12345654', 'Daniel', 'Test', NULL, 'test@agentur-berlin.de', '1234545676', '19/20 Maninagar Satyam Shivam Sudaram Appartment', '394327', 'Dist. - Surat'),
(4, 100004, 'Agentur für Arbeit Marzahn-Hellersdorf', '922D497371', '', 'Frau Losse', NULL, 'Berlin-Mitte.524-Vermittlung@arbeitsagentur.de', '', 'Janusz-Korczak-Straße 32', '12627', 'Berlin'),
(5, 100005, 'Agentur Spandau', 'DE12423433', '', 'Frau Losse', NULL, 'Berlin.mitte@agentur.de', '123456234', 'Janus str. 52', '12676', 'Berlin'),
(6, 100006, 'Agentur für Arbeit Pfarrkirchen', '022P243882', '', 'Frau Stechl', NULL, 'Pfarrkirchen@arbeitsagentur.de', '', ' Max-Breiherr-Straße 3', '844347', 'Pfarrkirchen'),
(7, 100007, 'Agentur für Arbeit Gelsenkirchen', '345D048247', '', 'Herr Celik', NULL, 'gelsenkirchen@arbeitsagentur.de', '+491590140121', 'Vattmannstr. 12', '45879', 'Gelsenkirchen'),
(8, 100008, 'Agentur für Arbeit Hanau', '962D297776', '125', ' Frau Hagest', NULL, 'hanau.125-vermittlung@arbeitsagentur.de', '', 'Hauptbahnhof 1', '63452', 'Hanau'),
(9, 100009, NULL, 'DE12423433', 'Test', 'Dhimmar Jay', NULL, 'info@storeindia.live', '7984810153', NULL, NULL, NULL),
(10, 100010, 'Agentur für Arbeit Pfarrkirchen', '022P243882', '', 'Frau Stechl', NULL, 'Pfarrkirchen@arbeitsagentur.de', '', ' Max-Breiherr-Straße 3', '844347', 'Pfarrkirchen'),
(11, 100011, 'Agentur für Arbeit Herford', '093D035058', '121', 'Frau Hanke', NULL, 'Herford.121-vermittlung@arbeitsagentur.de', '', 'Hansastraße 33', '32049', 'Herford'),
(12, 100012, 'Agentur für Arbeit Rastatt', '657A801261', '', 'Herr Longerich', NULL, 'Rastatt@arbeitsagentur.de', '', 'Karlstr. 18', '76437', 'Rastatt'),
(13, 100013, 'Agentur für Arbeit Rüsselsheim ', '415D082330', '123', 'Frau Lamprecht', NULL, 'badhomburg.123-vermittlung2@arbeitsagentur.de', '', ' Im Eichsfeld 3', '65428', 'Rüsselsheim'),
(14, 100014, 'Agentur für Arbeit Düsseldorf', '337D039133', '', 'Herr Hillus', NULL, 'Duesseldorf@arbeitsagentur.de', '', 'Grafenberger Allee 300', '40237', 'Düsseldorf'),
(15, 100015, 'Agentur für Arbeit Bremen-Bremerhaven', '214D293168', '', 'Frau Banisch', NULL, 'Bremen-Bremerhaven.224-Vermittlung@arbeitsagentur.de', '', 'Doventorszeinweg 48-52', '28195', 'Bremen'),
(16, 100016, 'Agentur für Arbeit Bonn', '323D548780', '', 'Frau Rönn', NULL, 'Stephanie.Roenn@arbeitsagentur.de', '', ' Villemombler Str. 101', '53123', 'Bonn'),
(17, 100017, ' Agentur für Arbeit Stralsund', '034D038236', '', 'Frau Rudolph', NULL, 'Stralsund@arbeitsagentur.de', '', 'Carl-Heydemann-Ring 98', '18437', 'Stralsund'),
(18, 100018, 'Agentur für Arbeit Berlin', '962D495959', '', 'Herr Feriduni', NULL, 'Beuthstrasse@arbeitsagentur.de', '', 'Beuthstraße 7', '10117', ' Berlin'),
(19, 100019, 'Agentur für Arbeit Sigmaringen', '614D112077', '', 'Frau Mittelbach-Schaal', NULL, 'Balingen.190-Inga@arbeitsagentur.de', '', 'Gartenstr. 12', '72488', 'Sigmaringen'),
(20, 100020, 'Jobcenter Kreis Segeberg- Standort Norderstedt,', '111D127540', '', 'Herr Clasen', NULL, 'elmshorn.uebergang-fbw@arbeitsagentur.de', '', 'Rathausallee 92', '22846', 'Norderstedt'),
(21, 100021, 'Agentur für Arbeit Berlin Reinickendorf', '075D244192', '', 'Frau Ulrich', NULL, 'Reinickendorf@arbeitsagentur.de', '', 'Innungsstr. 40', '13509', 'Berlin'),
(22, 100022, 'Agentur für Arbeit Mitte', '035A384976', '', '', NULL, 'Berlin-Mitte@arbeitsagentur.de', '', 'Charlottenstr. 87-90', '10969', 'Berlin'),
(23, 100023, 'Agentur für Arbeit Rathenow', '038D63235', '', 'Herr Huxdorf', NULL, 'Rathenow@arbeitsagentur.de', '', 'Friedrich-Ebert-Ring 63', '14712', 'Rathenow'),
(24, 100024, 'Agentur für Arbeit Schwäbisch Gmünd', '021D006858', '', 'Herr Horner', NULL, 'SchwaebischGmuend@arbeitsagentur.de', '', 'Goethestr. 18', '73525', 'Schwäbisch Gmünd'),
(25, 100025, NULL, '123', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(26, 100026, 'Agentur für Arbeit Limburg-Wetzlar', '443D167326', '', ' Herr Jung', NULL, 'Limburg-Wetzlar.121-Vermittlung@arbeitsagentur.de', '', 'Ste-Foy-Straße 23', '65549', 'Limburg'),
(27, 100027, 'Agentur für Arbeit Bad Kreuznach', '511D028512', '', '', NULL, 'bad-kreuznach@arbeitsagentur.de', '', 'Bosenheimer Str. 16 / 26', '55543', 'Bad Kreuznach'),
(28, 100028, 'WUI ', 'Firmenintern1', '', 'Frau Nicole Wilhelm ', NULL, 'nicole.wilhelm@ugl-sicherheit.de', '068979194956', 'An der Grube Camphausen 1', '66287', 'Quierschied'),
(29, 100029, 'WUI ', 'Firmenintern2', 'WUI', 'Frau Nicole Wilhelm ', NULL, 'nicole.wilhelm@ugl-sicherheit.de', '068979194956', 'An der Grube Camphausen 1', '66287', 'Quierschied'),
(30, 100030, 'WUI ', 'Firmenintern3', 'WUI', 'Frau Nicole Wilhelm ', NULL, 'nicole.wilhelm@ugl-sicherheit.de', '068979194956', 'An der Grube Camphausen 1', '66287', 'Quierschied'),
(31, 100031, 'WUI ', 'Firmenintern4', 'WUI', 'Frau Nicole Wilhelm ', NULL, 'nicole.wilhelm@ugl-sicherheit.de', '068979194956', 'An der Grube Camphausen 1', '66287', 'Quierschied'),
(32, 100032, 'WUI ', 'Firmenintern5', 'WUI', 'Frau Nicole Wilhelm ', NULL, 'nicole.wilhelm@ugl-sicherheit.de', '068979194956', 'An der Grube Camphausen 1', '66287', 'Quierschied'),
(33, 100033, 'WUI ', 'Firmenintern6', 'WUI', 'Frau Nicole Wilhelm ', NULL, 'nicole.wilhelm@ugl-sicherheit.de', '068979194956', 'An der Grube Camphausen 1', '66287', 'Quierschied'),
(34, 100034, 'WUI ', 'Firmenintern9', 'WUI', 'Frau Nicole Wilhelm ', NULL, 'nicole.wilhelm@ugl-sicherheit.de', '068979194956', 'An der Grube Camphausen 1', '66287', 'Quierschied'),
(35, 100035, 'WUI ', 'Firmenintern7', 'WUI', 'Frau Nicole Wilhelm', NULL, 'nicole.wilhelm@ugl-sicherheit.de', '068979194956', 'An der Grube Camphausen 1', '66287', 'Quierschied'),
(36, 100036, 'WUI ', 'Firmenintern8', 'WUI', 'Frau Nicole Wilhelm ', NULL, 'nicole.wilhelm@ugl-sicherheit.de', '068979194956', 'An der Grube Camphausen 1', '66287', 'Quierschied'),
(37, 100037, 'WUI ', 'Firmenintern10', 'WUI', 'Frau Nicole Wilhelm ', NULL, 'nicole.wilhelm@ugl-sicherheit.de', '068979194956', 'An der Grube Camphausen 1', '66287', 'Quierschied'),
(38, 100038, 'WUI ', 'Firmenintern11', 'WUI', 'Frau Nicole Wilhelm ', NULL, 'nicole.wilhelm@ugl-sicherheit.de', '068979194956', 'An der Grube Camphausen 1', '66287', 'Quierschied'),
(39, 100039, 'WUI ', 'Firmenintern12', 'WUI', 'Frau Nicole Wilhelm ', NULL, 'nicole.wilhelm@ugl-sicherheit.de', '068979194956', 'An der Grube Camphausen 1', '66287', 'Quierschied'),
(40, 100040, 'WUI ', 'Firmenintern13', 'WUI', 'Frau Nicole Wilhelm ', NULL, 'nicole.wilhelm@ugl-sicherheit.de', '068979194956', 'An der Grube Camphausen 1', '66287', 'Quierschied'),
(41, 100041, 'WUI ', 'Firmenintern14', 'WUI', 'Frau Nicole Wilhelm ', NULL, 'nicole.wilhelm@ugl-sicherheit.de', '068979194956', 'An der Grube Camphausen 1', '66287', 'Quierschied'),
(42, 100042, 'WUI ', 'Firmenintern15', 'WUI', 'Frau Nicole Wilhelm ', NULL, 'nicole.wilhelm@ugl-sicherheit.de', '068979194956', 'An der Grube Camphausen 1', '66287', 'Quierschied'),
(43, 100043, 'WUI ', 'Firmenintern16', 'WUI', 'Frau Nicole Wilhelm ', NULL, 'nicole.wilhelm@ugl-sicherheit.de', '068979194956', 'An der Grube Camphausen 1', '66287', 'Quierschied'),
(44, 100044, 'WUI ', 'Firmenintern17', 'WUI', 'Frau Nicole Wilhelm ', NULL, 'nicole.wilhelm@ugl-sicherheit.de', '068979194956', 'An der Grube Camphausen 1', '66287', 'Quierschied'),
(45, 100045, 'WUI ', 'Firmenintern18', 'WUI', 'Frau Nicole Wilhelm ', NULL, 'nicole.wilhelm@ugl-sicherheit.de', '068979194956', 'An der Grube Camphausen 1', '66287', 'Quierschied'),
(46, 100046, ' Agentur für Arbeit Sundern', '355D069270', '', '', NULL, 'arnsberg.126-vermittlung@arbeitsagentur.de', '', 'Freiheitsmühle 1', '59846', 'Sundern'),
(47, 100047, 'Agentur für Arbeit Lahr', '651D070654', '122', 'Herr Mann', NULL, 'lahr.122-vermittlung@arbeitsagentur.de', '', 'Otto-Hahn-Str. 1', '77933', 'Lahr'),
(48, 100048, 'Agentur für Arbeit Hannover', '237D051793', '', ' Frau Tola', NULL, 'hannover.121-vermittlung@arbeitsagentur.de', '', 'Brühlstraße 4', '30169', 'Hannover'),
(49, 100049, 'Agentur für Arbeit Hamburg-Mitte', '843D017177', '', 'Frau Thaysen', NULL, 'Hamburg@arbeitsagentur.de', '', 'Kurt-Schuhmacher-Allee 16', '20097', 'Hamburg'),
(50, 100050, 'Agentur für Arbeit Hamburg-Wandsbek', '042A185079', '727', 'Frau Kobs', NULL, 'hamburg.mitte-727-arbeitsvermittlung@arbeitsagentur.de', '040 24853333', 'Pappelallee 30', '22089', 'Hamburg'),
(51, 100051, NULL, '651D070654', '122', 'Herr Mann', NULL, 'lahr.122-vermittlung@arbeitsagentur.de', NULL, NULL, NULL, NULL),
(52, 100052, 'Agentur für Arbeit Duisburg', '341A079644', '261', 'Frau Wüsten', NULL, 'Duisburg.Mitte-261-Reha@arbeitsagentur.de', '', 'Wintgensstr. 29-33', '47058', 'Duisburg'),
(53, 100053, 'Agentur für Arbeit Treptow-Köpenick', '922D034826', '', 'Frau Schleuß', NULL, 'treptow-koepenick.220-vermittlung@arbeitsagentur.de', '', 'Pfarrer-Goosmann-Str. 19', '12489', 'Berlin');

-- --------------------------------------------------------

--
-- Table structure for table `bridge_days`
--

CREATE TABLE `bridge_days` (
  `id` int(11) NOT NULL,
  `bridge_days` varchar(255) NOT NULL,
  `date` date NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `bridge_days`
--

INSERT INTO `bridge_days` (`id`, `bridge_days`, `date`, `created_at`, `updated_at`) VALUES
(1, 'Ascension Day', '2025-05-29', '2025-03-28 13:21:41', '2025-05-26 17:06:01'),
(2, 'Whit Monday', '2025-06-09', '2025-05-26 17:06:20', '2025-05-26 17:07:07'),
(3, 'Day of German Unity', '2025-10-03', '2025-05-26 17:07:24', '2025-05-26 17:07:24'),
(4, 'Christmas Day', '2025-12-25', '2025-05-26 17:07:56', '2025-05-26 17:07:56'),
(5, '2nd Day of Christmas', '2025-12-26', '2025-05-26 17:08:15', '2025-05-26 17:08:15');

-- --------------------------------------------------------

--
-- Table structure for table `certificate_of_absence`
--

CREATE TABLE `certificate_of_absence` (
  `id` int(11) NOT NULL,
  `date` datetime NOT NULL,
  `description` varchar(255) NOT NULL,
  `sent_to` varchar(255) NOT NULL,
  `pdf_url` varchar(255) NOT NULL,
  `student_id` int(6) UNSIGNED ZEROFILL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `certificate_of_absence`
--

INSERT INTO `certificate_of_absence` (`id`, `date`, `description`, `sent_to`, `pdf_url`, `student_id`, `created_at`) VALUES
(1, '2025-05-24 18:13:25', 'Certificate of absence Mai 2025', 'info@storeindia.live', 'https://testapi.meteorinfotech.com/uploads/certificate-of-absence/certificate-of-absence_1748090605.pdf', 100001, '2025-05-24 12:43:25'),
(2, '2025-06-17 16:28:49', 'Certificate of absence Juni 2025', 'Berlin.mitte@agentur.de', 'https://testapi.meteorinfotech.com/uploads/certificate-of-absence/certificate-of-absence_1750157929.pdf', 100005, '2025-06-17 10:58:49');

-- --------------------------------------------------------

--
-- Table structure for table `course_feedback`
--

CREATE TABLE `course_feedback` (
  `id` int(11) NOT NULL,
  `student_id` varchar(255) NOT NULL,
  `course_id` varchar(255) NOT NULL,
  `feedback_date` date NOT NULL,
  `responses` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`responses`)),
  `remarks` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `course_feedback`
--

INSERT INTO `course_feedback` (`id`, `student_id`, `course_id`, `feedback_date`, `responses`, `remarks`, `created_at`, `updated_at`) VALUES
(2, '100001', '4', '2025-05-28', '{\"1\":\"Satisfied\",\"2\":\"Neutral\",\"3\":\"Not Satisfied\",\"4\":\"Neutral\",\"5\":\"Satisfied\",\"6\":\"Neutral\",\"7\":\"Not Satisfied\",\"8\":\"Neutral\",\"9\":\"Satisfied\",\"10\":\"Neutral\",\"11\":\"Not Satisfied\",\"12\":\"Neutral\",\"13\":\"Satisfied\",\"14\":\"Neutral\",\"15\":\"Not Satisfied\",\"16\":\"Neutral\",\"17\":\"Satisfied\",\"18\":\"Partial\",\"19\":\"My chances of getting a job have not changed\",\"20\":\"I can\'t say yet\",\"21\":\"Neutral\"}', 'ioyhiuuyfyf', '2025-05-28 14:49:26', '2025-05-28 15:36:42');

-- --------------------------------------------------------

--
-- Table structure for table `end_assessment`
--

CREATE TABLE `end_assessment` (
  `id` int(11) NOT NULL,
  `student_id` int(6) UNSIGNED ZEROFILL NOT NULL,
  `lecturer_id` int(11) NOT NULL,
  `greatest_success_experience` text DEFAULT NULL,
  `personal_development` text DEFAULT NULL,
  `biggest_challenge` text DEFAULT NULL,
  `oral_participation` text DEFAULT NULL,
  `written_performance` text DEFAULT NULL,
  `handling_learning_difficulties` text DEFAULT NULL,
  `development_weaker_areas` text DEFAULT NULL,
  `utilization_support_services` text DEFAULT NULL,
  `overall_assessment` text DEFAULT NULL,
  `instructor_signature` longtext DEFAULT NULL,
  `participant_name` varchar(255) DEFAULT NULL,
  `assessment_date` timestamp NULL DEFAULT current_timestamp(),
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `end_assessment_pdfs`
--

CREATE TABLE `end_assessment_pdfs` (
  `id` int(11) NOT NULL,
  `assessment_id` int(11) NOT NULL,
  `student_id` int(6) UNSIGNED ZEROFILL DEFAULT NULL,
  `lecturer_id` int(11) NOT NULL,
  `pdf_url` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `examinations`
--

CREATE TABLE `examinations` (
  `id` int(11) NOT NULL,
  `examination` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `examinations`
--

INSERT INTO `examinations` (`id`, `examination`, `created_at`, `updated_at`) VALUES
(1, 'Ersthelfer', '2025-03-28 13:22:21', '2025-05-26 17:00:34'),
(2, 'Brandschutz & Evakuierungshelfer gem. 10 ArbSchG', '2025-04-21 05:48:15', '2025-05-26 17:00:20'),
(3, 'Mündliche IHK Sachkunde gem. 34a GewO', '2025-05-26 16:59:31', '2025-05-26 16:59:31'),
(4, 'Schriftliche IHK Sachkunde gem. 34a GewO', '2025-05-26 16:59:47', '2025-05-26 16:59:47'),
(5, 'Waffensachkunde Vorbereitung gem. § 7 WaffG', '2025-05-26 17:00:07', '2025-05-26 17:00:07');

-- --------------------------------------------------------

--
-- Table structure for table `feedback_evaluations`
--

CREATE TABLE `feedback_evaluations` (
  `id` int(11) NOT NULL,
  `date_from` date NOT NULL,
  `date_until` date NOT NULL,
  `measures_id` int(11) NOT NULL,
  `pdf_url` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `feedback_evaluations`
--

INSERT INTO `feedback_evaluations` (`id`, `date_from`, `date_until`, `measures_id`, `pdf_url`, `description`, `created_at`) VALUES
(1, '2025-06-01', '2025-06-13', 2, 'https://testapi.meteorinfotech.com/uploads/feedbackbogen-auswertung_1749808098.pdf', '3 Monatige Maßnahmen Sicherheit Kontrolle 31 GWO Unterricht 09:00 bis 16:15 Uhr', '2025-06-13 09:48:18');

-- --------------------------------------------------------

--
-- Table structure for table `form_links`
--

CREATE TABLE `form_links` (
  `id` int(11) NOT NULL,
  `token` varchar(255) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `expiry_date` datetime NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `form_links`
--

INSERT INTO `form_links` (`id`, `token`, `name`, `email`, `expiry_date`, `created_at`, `updated_at`) VALUES
(11, '60bf0816b0e7d86aa9bfddb99e3624ff4c0c17894c72fb7ab909a514bbb83a15', NULL, NULL, '2025-05-06 22:06:14', '2025-04-29 16:36:14', '2025-04-29 16:36:14'),
(12, '538d841d24fe797f4e1ae352a28f481558e41d311ec3df34e76f2949e859e193', NULL, NULL, '2025-05-07 09:06:43', '2025-04-30 03:36:43', '2025-04-30 03:36:43'),
(13, 'ec343d08820fc06caa0d22a4749c1b73f7381985b06da88ce1bdb6f320b9e774', NULL, NULL, '2025-05-07 22:39:59', '2025-04-30 17:09:59', '2025-04-30 17:09:59'),
(14, '5609fd384e083c615f907f4677daa8c938b9e0ba49d6d8b583f2986d60b21657', NULL, NULL, '2025-06-19 15:53:57', '2025-06-12 10:23:57', '2025-06-12 10:23:57'),
(15, 'aef7a7a9ef5edc845aa18806c3ae9b69749db46818d52532ecf590b97f982ea2', NULL, NULL, '2025-06-26 21:25:31', '2025-06-19 15:55:31', '2025-06-19 15:55:31'),
(16, '3a3ce1ad17dddb8ca63c0bf59c9a8ebd44b926ba23cdabb93175bb895393feef', NULL, NULL, '2025-06-27 18:13:15', '2025-06-20 12:43:15', '2025-06-20 12:43:15');

-- --------------------------------------------------------

--
-- Table structure for table `form_responses`
--

CREATE TABLE `form_responses` (
  `id` int(11) NOT NULL,
  `form_link_id` int(11) DEFAULT NULL,
  `basic_info` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`basic_info`)),
  `languages` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`languages`)),
  `special_knowledge` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`special_knowledge`)),
  `professional_suitability` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`professional_suitability`)),
  `personal_suitability` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `personal_information` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`personal_information`)),
  `personal_suitability_applicant_signature` longtext NOT NULL,
  `professional_information_applicant_signature1` longtext NOT NULL,
  `professional_information_applicant_signature2` longtext NOT NULL,
  `assessment` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`assessment`)),
  `notes` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`notes`)),
  `pdf_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `interim_assessment`
--

CREATE TABLE `interim_assessment` (
  `id` int(11) NOT NULL,
  `student_id` int(6) UNSIGNED ZEROFILL DEFAULT NULL,
  `lecturer_id` int(11) NOT NULL,
  `learning_status` text DEFAULT NULL,
  `test_results` text DEFAULT NULL,
  `lecturer_rating` text DEFAULT NULL,
  `oral_participation` text DEFAULT NULL,
  `handling_learning_difficulties` text DEFAULT NULL,
  `absences` text DEFAULT NULL,
  `current_learning_progress` text DEFAULT NULL,
  `is_measure_at_risk` tinyint(1) NOT NULL DEFAULT 0,
  `support_measures` text DEFAULT NULL,
  `assessment_date` timestamp NULL DEFAULT current_timestamp(),
  `lecturer_signature` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `interim_assessment_pdfs`
--

CREATE TABLE `interim_assessment_pdfs` (
  `id` int(11) NOT NULL,
  `assessment_id` int(11) NOT NULL,
  `student_id` int(6) UNSIGNED ZEROFILL DEFAULT NULL,
  `lecturer_id` int(11) NOT NULL,
  `pdf_url` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `intermediaries`
--

CREATE TABLE `intermediaries` (
  `id` int(11) NOT NULL,
  `intermediary` varchar(255) NOT NULL,
  `agent_email` varchar(255) DEFAULT NULL,
  `agent_tel` bigint(20) DEFAULT NULL,
  `internal_external` enum('Internal','External') NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `intermediaries`
--

INSERT INTO `intermediaries` (`id`, `intermediary`, `agent_email`, `agent_tel`, `internal_external`, `created_at`, `updated_at`) VALUES
(1, 'Sibel Demirci', 'demirci@bildungsakademie-deutschland.com', 4915237380899, 'Internal', '2025-03-28 13:22:15', '2025-06-15 20:06:33'),
(6, 'Feran Kadrija', 'kadrija@bildungsakademie-deutschland.com', 4917674872540, 'External', '2025-06-15 20:05:45', '2025-06-15 20:06:41'),
(7, 'Mick Gastorf', 'gastorf@bildungsakademie-deutschland.com', 4915679514669, 'External', '2025-06-15 20:07:32', '2025-06-15 20:07:32'),
(8, 'Resit Demir', 'demir@bildungsakademie-deutschland.com', 4915158144971, 'External', '2025-06-15 20:08:20', '2025-06-15 20:08:20'),
(9, 'Janine Emmert', 'j.emmert@bildungsakademie-deutschland.com', 4915226345802, 'Internal', '2025-06-15 20:08:55', '2025-06-15 20:08:55'),
(10, 'Stefan Emmert', 'Emmert@bildungsakademie-deutschland.com', 4917659649913, 'Internal', '2025-06-15 20:09:31', '2025-06-15 20:09:31'),
(11, 'Lavdrim Kadrija', 'l.kadrija@bildungsakademie-deutschland.com', 4915221572101, 'External', '2025-06-15 20:10:17', '2025-06-15 20:10:17'),
(12, 'Laura Schütz', 'schuetz@bildungsakademie-deutschland.com', 4915209205907, 'Internal', '2025-06-15 20:10:52', '2025-06-15 20:10:52'),
(13, 'Dieter Emmert', 'd.emmert@bildungsakademie-deutschland.com', 4917674669844, 'External', '2025-06-15 20:11:48', '2025-06-15 20:11:48'),
(14, 'Ali Nikjoo', 'nikjoo@bildungsakademie-deutschland.com', 4915229376278, 'External', '2025-06-15 20:12:13', '2025-06-15 20:12:13');

-- --------------------------------------------------------

--
-- Table structure for table `invoice_recipients`
--

CREATE TABLE `invoice_recipients` (
  `id` int(11) NOT NULL,
  `student_id` int(6) UNSIGNED ZEROFILL DEFAULT NULL,
  `company` varchar(255) DEFAULT NULL,
  `contact_person` varchar(100) DEFAULT NULL,
  `routing_id` varchar(50) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `street` varchar(255) DEFAULT NULL,
  `postal_code` varchar(10) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `invoice_recipients`
--

INSERT INTO `invoice_recipients` (`id`, `student_id`, `company`, `contact_person`, `routing_id`, `email`, `street`, `postal_code`, `city`) VALUES
(2, 100001, 'Test', 'dsds', '3212323', 'info@storeindia.live', '302, Shyam Market, maninagar , kadodara', '394327', 'surat'),
(3, 100002, '', '', NULL, '', '', '', ''),
(4, 100003, 'Test2', 'Dhimmar Jay', '3212310', 'info@gmail.com', '19/20 M', '394325', 'Dist. '),
(5, 100005, '', '', '', '', NULL, '', ''),
(6, 100006, '', '', '', '', NULL, '', ''),
(7, 100004, '', '', '', '', NULL, '', ''),
(8, 100010, '', '', '', '', NULL, '', ''),
(9, 100011, '', '', '', '', NULL, '', ''),
(10, 100012, '', '', '', '', NULL, '', ''),
(11, 100013, '', '', '', '', NULL, '', ''),
(12, 100014, '', '', '', '', NULL, '', ''),
(13, 100015, '', '', '', '', NULL, '', ''),
(14, 100016, '', '', '', '', NULL, '', ''),
(15, 100017, '', '', '', '', NULL, '', ''),
(16, 100018, '', '', '', '', NULL, '', ''),
(17, 100019, '', '', '', '', NULL, '', ''),
(18, 100021, '', '', '', '', NULL, '', ''),
(19, 100023, '', '', '', '', NULL, '', ''),
(20, 100024, '', '', '', '', NULL, '', ''),
(21, 100026, '', '', '', '', NULL, '', ''),
(22, 100034, '', '', '', '', NULL, '', ''),
(23, 100035, '', '', '', '', NULL, '', ''),
(24, 100043, '', '', '', '', NULL, '', ''),
(25, 100028, '', '', '', '', NULL, '', ''),
(26, 100029, '', '', '', '', NULL, '', ''),
(27, 100030, '', '', '', '', NULL, '', ''),
(28, 100031, '', '', '', '', NULL, '', ''),
(29, 100032, '', '', '', '', NULL, '', ''),
(30, 100033, '', '', '', '', NULL, '', ''),
(31, 100036, '', '', '', '', NULL, '', ''),
(32, 100037, '', '', '', '', NULL, '', ''),
(33, 100038, '', '', '', '', NULL, '', ''),
(34, 100039, '', '', '', '', NULL, '', ''),
(35, 100040, '', '', '', '', NULL, '', ''),
(36, 100041, '', '', '', '', NULL, '', ''),
(37, 100042, '', '', '', '', NULL, '', ''),
(38, 100044, '', '', '', '', NULL, '', ''),
(39, 100045, '', '', '', '', NULL, '', ''),
(40, 100046, '', '', '', '', NULL, '', ''),
(41, 100047, '', '', '', '', NULL, '', ''),
(42, 100048, '', '', '', '', NULL, '', ''),
(43, 100049, '', '', '', '', NULL, '', ''),
(44, 100008, '', '', '', '', NULL, '', ''),
(45, 100007, '', '', '', '', NULL, '', ''),
(46, 100022, '', '', '', '', NULL, '', ''),
(47, 100020, '', '', '', '', NULL, '', ''),
(48, 100050, '', '', '', '', NULL, '', ''),
(49, 100027, '', '', '', '', NULL, '', ''),
(50, 100052, '', '', '', '', NULL, '', ''),
(51, 100053, '', '', '', '', NULL, '', '');

-- --------------------------------------------------------

--
-- Table structure for table `invoice_reminders`
--

CREATE TABLE `invoice_reminders` (
  `id` int(11) NOT NULL,
  `invoice_id` int(11) NOT NULL,
  `reminder_number` int(11) NOT NULL,
  `reminder_date` date NOT NULL,
  `pdf_path` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `invoice_reminders`
--

INSERT INTO `invoice_reminders` (`id`, `invoice_id`, `reminder_number`, `reminder_date`, `pdf_path`) VALUES
(1, 6, 1, '2025-06-03', '/uploads/bad/Rechnung_orrektur_1748936583.pdf'),
(2, 12, 1, '2025-06-06', '/uploads/bad/Mahnung_1749195877.pdf'),
(3, 12, 2, '2025-06-09', '/uploads/bad/Mahnung_1749465575.pdf'),
(4, 6, 2, '2025-06-09', '/uploads/bad/Mahnung_1749465590.pdf'),
(5, 13, 1, '2025-06-09', '/uploads/bad/Mahnung_1749466503.pdf'),
(6, 13, 2, '2025-06-09', '/uploads/bad/Mahnung_1749467175.pdf'),
(7, 13, 3, '2025-06-09', '/uploads/bad/Mahnung_1749468250.pdf'),
(8, 14, 1, '2025-06-09', '/uploads/mahnung/Mahnung_1749468315.pdf'),
(9, 11, 1, '2025-06-16', '/uploads/bad/Mahnung_1750083346.pdf');

-- --------------------------------------------------------

--
-- Table structure for table `lecturers`
--

CREATE TABLE `lecturers` (
  `lecturer_id` int(11) NOT NULL,
  `first_name` varchar(255) NOT NULL COMMENT 'Vorname (First name)',
  `last_name` varchar(255) NOT NULL COMMENT 'Nachname (Last name)',
  `start_time` datetime NOT NULL COMMENT 'Zeit Von (Start time)',
  `end_time` datetime NOT NULL COMMENT 'Zeit Bis (End time)',
  `course` varchar(255) NOT NULL COMMENT 'Maßnahme (Course/Program)',
  `joining_date` date NOT NULL,
  `photo` varchar(255) NOT NULL COMMENT 'Foto (Image file path)',
  `certificates` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Qualifikationsnachweise/Zertifikate (Array of PDF paths)' CHECK (json_valid(`certificates`)),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL DEFAULT '' COMMENT 'Password for lecturer login',
  `measures_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `lecturers`
--

INSERT INTO `lecturers` (`lecturer_id`, `first_name`, `last_name`, `start_time`, `end_time`, `course`, `joining_date`, `photo`, `certificates`, `created_at`, `updated_at`, `deleted_at`, `password`, `measures_id`) VALUES
(112201, 'Chintan', 'Patel', '2025-05-15 09:00:00', '2025-05-15 16:15:00', '955/123/2025 - Sicherheit Kontrolle 31 GWO', '0000-00-00', '', '[]', '2025-05-15 14:08:05', '2025-06-11 18:56:57', '2025-06-11 18:56:57', 'BAD112201', NULL),
(112202, 'Patrick', 'Koch', '2025-06-11 09:00:00', '2025-06-11 16:15:00', '955/234/2023 - IHK geprüfte Sicherheitsfachkraft gem. §34a GewO', '2025-07-01', '', '[]', '2025-06-11 18:57:13', '2025-06-15 19:33:23', '2025-06-15 19:33:23', 'BAD112202', 1),
(112203, 'Max', 'Mustermann', '2025-06-13 09:00:00', '2025-06-13 16:15:00', '955/123/2025 - Sicherheit Kontrolle 31 GWO', '2025-06-01', '', '[]', '2025-06-13 09:26:07', '2025-06-13 13:28:10', '2025-06-13 13:28:10', 'BAD112203', 2),
(112204, 'Dhimmar', 'Jay 1', '2025-06-16 05:30:00', '2025-06-16 12:45:00', '124/124/2344 - Testing 1234', '2025-06-15', '/uploads/photos/photo-1750080785725-850556083.jpg', '[]', '2025-06-16 01:55:34', '2025-06-16 20:45:18', '2025-06-16 20:45:18', '$2b$10$4QUPXRgryBQNNtJWEBHKVexm0gEktceM607Vir.t4gYJRLcb4Zf3y', 7),
(112205, 'Patrick', 'Koch', '2025-06-30 05:30:00', '2025-06-30 12:45:00', '955/234/2023 - IHK geprüfte Sicherheitsfachkraft gem. §34a GewO', '2025-06-27', '/uploads/photos/photo-1751293280128-626141778.png', '[]', '2025-06-16 20:45:41', '2025-06-30 14:21:20', NULL, '$2b$10$Vm84g5ia0J0.4aAKzsoz5OZSxQ9iCUXbdD157QGAM0NA8YoSmZeRm', 1),
(112206, 'Frank', 'Winzer', '2025-06-30 21:30:00', '2025-06-30 05:30:00', '0 - GSSK (Geprüften Schutz- und Sicherheitskraft)', '2025-06-28', '/uploads/photos/photo-1751305497991-880224385.jpeg', '[\"/uploads/certificates/certificates-1751304965368-458672519.pdf\",\"/uploads/certificates/certificates-1751304965399-419189839.pdf\",\"/uploads/certificates/certificates-1751305476680-741059937.pdf\",\"/uploads/certificates/certificates-1751305476684-100596206.pdf\",\"/uploads/certificates/certificates-1751305476686-662300474.pdf\"]', '2025-06-30 17:36:05', '2025-07-03 12:46:56', NULL, '$2b$10$RN4iwbdmMBt1.am2TF1dOOhxTRUtFtwjF.5w5NDI/GkHmj.Z2coCe', 9),
(112207, 'Viktoria ', 'Engelmann', '2025-07-03 09:00:00', '2025-07-03 16:15:00', '955/231/2023 - IHK geprüfte Sicherheitsfachkraft gem. §34a GewO mit Bearbeitung von Sprach -und Lernhindernissen Online', '2025-07-06', '', '[]', '2025-07-03 19:54:34', '2025-07-03 19:55:07', NULL, 'BAD112207', 4);

-- --------------------------------------------------------

--
-- Table structure for table `lecturer_documents`
--

CREATE TABLE `lecturer_documents` (
  `id` int(11) NOT NULL,
  `lecturer_id` int(11) NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `measurements`
--

CREATE TABLE `measurements` (
  `id` int(11) NOT NULL,
  `measures_number` varchar(50) NOT NULL,
  `measures_title` varchar(255) NOT NULL,
  `months` int(11) NOT NULL,
  `according_to_paragraph` text NOT NULL,
  `show_in_documents` tinyint(1) DEFAULT 1,
  `deleted_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `measurements`
--

INSERT INTO `measurements` (`id`, `measures_number`, `measures_title`, `months`, `according_to_paragraph`, `show_in_documents`, `deleted_at`, `created_at`, `updated_at`) VALUES
(1, '962/365/2025', 'IHK geprüfte Sicherheitsfachkraft gem. §34a GewO', 3, '§34a Sachkunde', 1, NULL, '2025-03-28 13:23:39', '2025-07-02 09:23:46'),
(2, '955/123/2025', 'Sicherheit Kontrolle 31 GWO', 3, '§81 Weiterbildung', 1, '2025-06-17 02:21:25', '2025-04-21 05:46:59', '2025-06-16 20:51:25'),
(4, '955/231/2023', 'IHK geprüfte Sicherheitsfachkraft gem. §34a GewO mit Bearbeitung von Sprach -und Lernhindernissen Online', 6, '§34a Sachkunde', 1, NULL, '2025-06-11 19:01:34', '2025-06-11 19:01:34'),
(6, '962/220/2025', 'Teilqualifizierung Fachkraft für Schutz und Sicherheit Online: Personen und Objekte schutzen (TQ1) Online	', 6, '§34a Sachkunde', 1, NULL, '2025-06-12 10:15:42', '2025-06-12 10:16:32'),
(7, '124/124/23', 'Testing 1234', 7, '§34a Sachkunde', 1, '2025-06-17 02:21:20', '2025-06-15 20:15:13', '2025-06-16 20:51:20'),
(8, '1233', 'Test', 4, '§34a Sachkunde', 1, '2025-06-19 04:56:54', '2025-06-18 23:26:40', '2025-06-18 23:26:54'),
(9, '0', 'GSSK (Geprüften Schutz- und Sicherheitskraft)', 7, '§34a Sachkunde', 1, NULL, '2025-06-27 12:37:20', '2025-06-27 12:37:20');

-- --------------------------------------------------------

--
-- Table structure for table `measures_zoom_links`
--

CREATE TABLE `measures_zoom_links` (
  `id` int(11) NOT NULL,
  `measures_id` int(11) NOT NULL,
  `lecturer_id` int(11) NOT NULL,
  `zoom_link` text NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `measures_zoom_links`
--

INSERT INTO `measures_zoom_links` (`id`, `measures_id`, `lecturer_id`, `zoom_link`, `start_date`, `end_date`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 1, 112205, 'adcasf', '2025-07-07', '2025-09-26', '2025-07-04 06:57:35', '2025-07-04 06:58:30', '2025-07-04 06:58:30'),
(2, 1, 112205, 'safggh', '2025-07-07', '2025-09-26', '2025-07-04 06:58:35', '2025-07-04 07:13:01', '2025-07-04 07:13:01'),
(3, 1, 112205, 'wrfey', '2025-07-07', '2025-09-26', '2025-07-04 07:00:57', '2025-07-04 07:13:04', '2025-07-04 07:13:04'),
(4, 1, 112205, 'gfhj', '2025-07-07', '2025-09-26', '2025-07-04 07:13:10', '2025-07-04 07:13:10', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `monthly_reports`
--

CREATE TABLE `monthly_reports` (
  `id` int(11) NOT NULL,
  `lecturer_id` int(11) NOT NULL,
  `description` varchar(255) NOT NULL,
  `pdf_url` varchar(255) NOT NULL,
  `month` int(11) NOT NULL,
  `year` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `monthly_reports`
--

INSERT INTO `monthly_reports` (`id`, `lecturer_id`, `description`, `pdf_url`, `month`, `year`, `created_at`) VALUES
(1, 112201, 'Schulungsreport Monat: Juni 2025 Dozent: Fr. Große Elbert', 'https://testapi.meteorinfotech.com/uploads/schulungsreport/schulungsreport_1748877990.pdf', 6, 2025, '2025-06-02 15:26:44');

-- --------------------------------------------------------

--
-- Table structure for table `positions`
--

CREATE TABLE `positions` (
  `id` int(11) NOT NULL,
  `user_id` int(6) UNSIGNED ZEROFILL NOT NULL,
  `position` varchar(255) NOT NULL,
  `responsibility_authority` text DEFAULT NULL,
  `internal_external` enum('Internal','External') NOT NULL,
  `hierarchically_assigned_to` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `positions`
--

INSERT INTO `positions` (`id`, `user_id`, `position`, `responsibility_authority`, `internal_external`, `hierarchically_assigned_to`, `created_at`, `updated_at`) VALUES
(27, 000001, 'Team Lead', 'Leading the development team', 'Internal', 1, '2025-05-21 07:19:03', '2025-05-21 07:19:03'),
(38, 000005, 'Team Lead', 'Leading the development team', 'Internal', 2, '2025-05-22 13:41:33', '2025-05-22 13:41:33'),
(39, 000003, 'Team Lead', 'Leading the development team', 'Internal', 2, '2025-05-22 13:41:44', '2025-05-22 13:41:44'),
(41, 000004, 'Team Lead', 'Leading the development team', 'External', 1, '2025-05-23 14:03:04', '2025-05-23 14:03:04'),
(44, 000002, 'CEO', 'Global Admin', 'Internal', 2, '2025-06-15 19:30:33', '2025-06-15 19:30:33'),
(45, 000007, 'Abteilungsleiterin Büro', 'Admin', 'Internal', 2, '2025-06-16 20:47:34', '2025-06-16 20:47:34'),
(46, 000009, 'Bürokraft', 'Admin', 'Internal', 2, '2025-06-16 20:49:50', '2025-06-16 20:49:50'),
(48, 000011, 'Bürokraft', 'Admin', 'Internal', 7, '2025-06-23 09:31:02', '2025-06-23 09:31:02'),
(49, 000012, 'Bürokraft', 'Admin', 'Internal', 7, '2025-06-23 09:31:28', '2025-06-23 09:31:28'),
(50, 000019, 'Member', '', 'Internal', 2, '2025-06-30 10:50:24', '2025-06-30 10:50:24'),
(51, 000020, 'Vertriebsleitung', 'Admin', 'Internal', 2, '2025-06-30 14:22:19', '2025-06-30 14:22:19');

-- --------------------------------------------------------

--
-- Table structure for table `qualification_matrix`
--

CREATE TABLE `qualification_matrix` (
  `id` int(11) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `pdf_url` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `qualification_matrix`
--

INSERT INTO `qualification_matrix` (`id`, `description`, `pdf_url`, `created_at`) VALUES
(10, 'Qualifizierungsmatrix', 'https://testapi.meteorinfotech.com/uploads/qualifizierungsmatrix/qualifizierungsmatrix_1749466469.pdf', '2025-06-09 10:54:29'),
(11, 'Qualifizierungsmatrix', 'https://testapi.meteorinfotech.com/uploads/qualifizierungsmatrix/qualifizierungsmatrix_1749724120.pdf', '2025-06-12 10:28:55');

-- --------------------------------------------------------

--
-- Table structure for table `qualifizierungsplan`
--

CREATE TABLE `qualifizierungsplan` (
  `id` int(11) NOT NULL,
  `start_date` varchar(10) NOT NULL,
  `end_date` varchar(10) NOT NULL,
  `description` text DEFAULT NULL,
  `pdf_url` text NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `qualifizierungsplan`
--

INSERT INTO `qualifizierungsplan` (`id`, `start_date`, `end_date`, `description`, `pdf_url`, `created_at`, `updated_at`) VALUES
(1, '2025-01-01', '2025-05-24', '3 Monatige Maßnahmen Unterricht 09:00 bis 16:15 Uhr', 'https://testapi.meteorinfotech.com/uploads/qualifizierrungsplan_1747926960.pdf', '2025-05-22 15:16:03', '2025-05-22 15:16:03'),
(2, '2025-01-01', '2025-12-18', '3 Monatige Maßnahmen Unterricht 09:00 bis 16:15 Uhr', 'https://testapi.meteorinfotech.com/uploads/qualifizierrungsplan_1747927011.pdf', '2025-05-22 15:16:53', '2025-05-22 15:16:53'),
(3, '2025-05-01', '2025-05-31', '3 Monatige Maßnahmen Unterricht 09:00 bis 16:15 Uhr', 'https://testapi.meteorinfotech.com/uploads/qualifizierrungsplan_1747976136.pdf', '2025-05-23 04:55:42', '2025-05-23 04:55:42'),
(4, '2024', '2025', 'Qualifizierungsplan 2024 - 2025', 'https://testapi.meteorinfotech.com/uploads/qualifizierrungsplan_1748066614.pdf', '2025-05-24 06:03:37', '2025-05-24 06:03:37'),
(5, '2024', '2025', 'Qualifizierungsplan 2024 - 2025', 'https://testapi.meteorinfotech.com/uploads/qualifizierrungsplan_1748693536.pdf', '2025-05-31 12:12:23', '2025-05-31 12:12:23');

-- --------------------------------------------------------

--
-- Table structure for table `result_sheet_pdf`
--

CREATE TABLE `result_sheet_pdf` (
  `id` int(11) NOT NULL,
  `student_id` int(6) UNSIGNED ZEROFILL DEFAULT NULL,
  `description` varchar(255) DEFAULT 'Ergebnisbogen / Bewerberprofil',
  `sent_to` varchar(255) DEFAULT NULL,
  `sent_on` datetime DEFAULT NULL,
  `pdf_url` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `result_sheet_pdf`
--

INSERT INTO `result_sheet_pdf` (`id`, `student_id`, `description`, `sent_to`, `sent_on`, `pdf_url`, `created_at`) VALUES
(6, 100001, 'Ergebnisbogen / Bewerberprofil', NULL, NULL, '/uploads/ergebnisbogen-bewerberprofil_1746613790.pdf', '2025-05-07 10:29:50');

-- --------------------------------------------------------

--
-- Table structure for table `student`
--

CREATE TABLE `student` (
  `student_id` int(6) UNSIGNED ZEROFILL NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `voucher_type` enum('BGS','AVGS','PRIVAT') DEFAULT NULL,
  `salutation` enum('Herr','Frau','Drivers') DEFAULT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `date_of_entry` date DEFAULT NULL,
  `date_of_exit` date DEFAULT NULL,
  `measures` varchar(255) DEFAULT NULL,
  `intermediary_internal` varchar(100) DEFAULT NULL,
  `lecturer` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL,
  `measures_id` int(11) DEFAULT NULL,
  `lecturer_remark` text DEFAULT NULL,
  `remark_updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `student`
--

INSERT INTO `student` (`student_id`, `password`, `voucher_type`, `salutation`, `first_name`, `last_name`, `date_of_entry`, `date_of_exit`, `measures`, `intermediary_internal`, `lecturer`, `created_at`, `updated_at`, `deleted_at`, `measures_id`, `lecturer_remark`, `remark_updated_at`) VALUES
(100001, '$2b$10$nC7iWvK4JK7Ena9U2OeReuI6xG92G/GAt5aJE4cqMPtcgqWmSb6Gi', 'BGS', 'Herr', 'Dhimmar', 'Jay', '2025-05-07', '2025-05-31', '955/123/2025 - Sicherheit Kontrolle 31 GWO', 'Max', '112201', '2025-05-07 06:35:15', '2025-06-16 20:51:00', '2025-06-16 20:51:00', 2, NULL, NULL),
(100002, '$2b$10$nC7iWvK4JK7Ena9U2OeReuI6xG92G/GAt5aJE4cqMPtcgqWmSb6Gi', 'BGS', 'Frau', 'Dhimmar', 'Vishal', '2025-05-05', '2025-06-30', '955/234/2023 - Partial qualification as a specialist in protection and security online: Protecting people and objects (TQ1) online', 'Max', '112201', '2025-05-07 12:52:32', '2025-06-15 20:13:19', '2025-06-15 20:13:19', NULL, NULL, NULL),
(100003, '$2b$10$g/9hY.NbQWqTrBJ6yBFjyuWhQNOLxhvkMa2N4oUqKUbp79g2bFklK', 'BGS', 'Herr', 'Muster', 'Mann', '2025-06-01', '2025-07-31', '955/123/2025 - Sicherheit Kontrolle 31 GWO', 'Ali Nikjoo', '', '2025-06-08 13:10:58', '2025-06-16 20:51:12', '2025-06-16 20:51:12', 2, NULL, NULL),
(100004, '$2b$10$AJWcpoXvUKwIJCO1gSI8NetejRIWsJuZ0w3ZnVDT.29M7cYPxZxpS', 'BGS', 'Herr', 'Ali', 'Ahmadi', '2025-07-08', '2025-12-20', '955/231/2023 - IHK geprüfte Sicherheitsfachkraft gem. §34a GewO mit Bearbeitung von Sprach -und Lernhindernissen Online', 'Feran Kadrija', '0112205', '2025-06-16 21:00:00', '2025-07-02 11:31:44', NULL, 4, NULL, NULL),
(100005, '$2b$10$exjLwl9AuFfxJ.QfkJ1OiefVedyX1lIN.MFrYY8l1ss6fFSxFKV/.', 'BGS', 'Herr', 'Chintankumar', 'Padaliya', '2025-06-15', '2025-08-31', '955/231/2023 - IHK geprüfte Sicherheitsfachkraft gem. §34a GewO mit Bearbeitung von Sprach -und Lernhindernissen Online', 'Ali Nikjoo', '', '2025-06-16 21:06:28', '2025-06-30 14:37:25', '2025-06-30 14:37:25', 4, NULL, NULL),
(100006, '$2b$10$XobE/nKqiob/78VQbqyImeW7Bi1ElI0lygNhtTTn9k9/DxgCm.U56', 'BGS', 'Herr', 'Ahmad', 'Navid Mohammadi', '2025-06-22', '2025-09-25', '955/234/2023 - IHK geprüfte Sicherheitsfachkraft gem. §34a GewO', 'Lavdrim Kadrija', '0112205', '2025-06-16 21:11:28', '2025-06-27 11:18:53', '2025-06-27 11:18:53', 1, NULL, NULL),
(100007, '$2b$10$ViepaLIHDYpFbA8Emyxf3.6m50v8JBty68a5rwI0fmGgzrspsOKye', 'BGS', 'Herr', 'Danijel', 'Smakoli Javornik', '2025-07-08', '2025-12-19', '962/220/2025 - Teilqualifizierung Fachkraft für Schutz und Sicherheit Online: Personen und Objekte schutzen (TQ1) Online	', 'Laura Schütz', '0112205', '2025-06-16 21:38:29', '2025-07-02 11:30:23', NULL, 6, NULL, NULL),
(100008, '$2b$10$yHTIM1hXaliuMUMDgPVryuca7guTcs45cpAr0tsldEZWLx1vzwVdW', 'BGS', 'Herr', 'Abdulrahim', 'Zarabi', '2025-07-08', '2025-09-23', '962/365/2025 - IHK geprüfte Sicherheitsfachkraft gem. §34a GewO', 'Ali Nikjoo', '0112205', '2025-06-16 21:40:45', '2025-07-02 11:24:23', NULL, 1, NULL, NULL),
(100009, '$2b$10$60daQuC373ulobh0ajTVOekfrx53u/86ItCwEh9bO0fKSnoTLKrti', 'BGS', 'Herr', 'Chintankumar', 'Padaliya', '2025-06-19', '2025-06-30', '955/231/2023 - IHK geprüfte Sicherheitsfachkraft gem. §34a GewO mit Bearbeitung von Sprach -und Lernhindernissen Online', 'Lavdrim Kadrija', NULL, '2025-06-19 05:02:04', '2025-06-30 14:37:29', '2025-06-30 14:37:29', 4, NULL, NULL),
(100010, '$2b$10$Py/JZO7yaCzgHwAX94Ix1eCuTcqxwmxy6RTsBZjvFxxRvZDVbPiRy', 'BGS', 'Herr', 'Ahmad', 'Navid Mohammadi', '2025-07-08', '2025-09-25', '962/365/2025 - IHK geprüfte Sicherheitsfachkraft gem. §34a GewO', 'Lavdrim Kadrija', '0112205', '2025-06-27 10:53:00', '2025-07-02 11:24:42', NULL, 1, NULL, NULL),
(100011, '$2b$10$SsFNBjKZNv2zWMfSW2OowuwlmyhnuIqXtykETaHwNNxtu2j.N7XX2', 'BGS', 'Frau', 'Seda', 'Özel', '2025-07-08', '2025-09-24', '962/365/2025 - IHK geprüfte Sicherheitsfachkraft gem. §34a GewO', 'Laura Schütz', '0112205', '2025-06-27 11:22:36', '2025-07-02 11:24:03', NULL, 1, NULL, NULL),
(100012, '$2b$10$8ep6BdTxEOWWvzyvC3dkMuZpi3NNLKh9HEWCKOeZZn8KAPOroYWqm', 'BGS', 'Frau', 'Sabine', 'Montesano', '2025-07-08', '2025-09-24', '962/365/2025 - IHK geprüfte Sicherheitsfachkraft gem. §34a GewO', 'Janine Emmert', '0112205', '2025-06-27 11:25:01', '2025-07-02 11:23:50', NULL, 1, NULL, NULL),
(100013, '$2b$10$sNkx3JFTyAAbDhzcRPBsiO8QQvzha6At/CmL34e./OmBn1qYqmDQW', 'BGS', 'Herr', 'Erkan', 'Kioutsouk', '2025-07-08', '2025-09-24', '962/365/2025 - IHK geprüfte Sicherheitsfachkraft gem. §34a GewO', 'Laura Schütz', '0112205', '2025-06-27 11:29:00', '2025-07-02 11:23:34', NULL, 1, NULL, NULL),
(100014, '$2b$10$/OIfVrf8ecIv.bWjqjAxqOb8Eu4V.sphWBM2ZXfpYBK2XOzyHJFnO', 'BGS', 'Herr', 'Mervin', 'Mamutovski', '2025-07-08', '2025-09-24', '962/365/2025 - IHK geprüfte Sicherheitsfachkraft gem. §34a GewO', 'Ali Nikjoo', '0112205', '2025-06-27 11:31:15', '2025-07-02 11:23:20', NULL, 1, NULL, NULL),
(100015, '$2b$10$ChER6v6Kpra5E7kqyNZ2LOzGpQ4et2hek01GMu1oCiLDAbempDh/u', 'BGS', 'Herr', 'Hamsa', 'Pisit', '2025-07-08', '2025-09-24', '962/365/2025 - IHK geprüfte Sicherheitsfachkraft gem. §34a GewO', 'Mick Gastorf', '0112205', '2025-06-27 11:33:05', '2025-07-02 11:22:57', NULL, 1, NULL, NULL),
(100016, '$2b$10$rHuo1cKoZB1MX9XTWlCyC.7ibytd/qMXSoz8HRbxsaSdOwZ/vpH/S', 'BGS', 'Herr', 'Mohamad', 'Hanan', '2025-07-08', '2025-09-23', '962/365/2025 - IHK geprüfte Sicherheitsfachkraft gem. §34a GewO', 'Resit Demir', '0112205', '2025-06-27 11:34:42', '2025-07-02 11:22:21', NULL, 1, NULL, NULL),
(100017, '$2b$10$tcPzLYMvy.kSYBk1OKbCteD3p09MGOGCrFHMIpvd8F3htTyB3cIRW', 'BGS', 'Herr', 'Ersan', 'Gasi', '2025-07-08', '2025-09-22', '962/365/2025 - IHK geprüfte Sicherheitsfachkraft gem. §34a GewO', 'Lavdrim Kadrija', '0112205', '2025-06-27 11:36:19', '2025-07-02 11:21:05', NULL, 1, NULL, NULL),
(100018, '$2b$10$YLpmcnUuJ/LsX36Mz0OyuuyCnTrXwSVf8yioAcL42BJiSsSiqb92S', 'BGS', 'Herr', 'Mehran', 'Shahin Yamchi', '2025-07-08', '2025-09-24', '962/365/2025 - IHK geprüfte Sicherheitsfachkraft gem. §34a GewO', 'Ali Nikjoo', '0112205', '2025-06-27 11:38:32', '2025-07-02 11:25:46', NULL, 1, NULL, NULL),
(100019, '$2b$10$8jcQ7q9nJIz1rxJv47kpm.0/tXPbEcdI8M7h6xPUdJbg1SAPQQOji', 'BGS', 'Frau', 'Kristina', 'Valeev', '2025-07-08', '2025-09-27', '962/365/2025 - IHK geprüfte Sicherheitsfachkraft gem. §34a GewO', 'Janine Emmert', '0112205', '2025-06-27 11:40:08', '2025-07-02 11:27:58', NULL, 1, NULL, NULL),
(100020, '$2b$10$t42SA84vnOJ8Y9o3ri2lC.8KAkvxiSq.b8UTsXmDSiAzlc3Dnjy.u', 'BGS', 'Frau', 'Josefine', 'Rahlf', '2025-07-08', '2025-12-10', '955/231/2023 - IHK geprüfte Sicherheitsfachkraft gem. §34a GewO mit Bearbeitung von Sprach -und Lernhindernissen Online', 'Feran Kadrija', '0112205', '2025-06-27 11:42:03', '2025-07-02 11:31:26', NULL, 4, NULL, NULL),
(100021, '$2b$10$UbipkJLg2PBcnrBcTCs9aO..hnwFBeEvj5hgk7.cH6G0U9zJkWWma', 'BGS', 'Herr', 'Para', 'Ndombasi Kiala', '2025-07-08', '2025-12-23', '955/231/2023 - IHK geprüfte Sicherheitsfachkraft gem. §34a GewO mit Bearbeitung von Sprach -und Lernhindernissen Online', 'Feran Kadrija', '0112205', '2025-06-27 11:48:07', '2025-07-02 11:31:42', NULL, 4, NULL, NULL),
(100022, '$2b$10$qBvas5a5fUPs3e3BflydEO1lXnCAMy3G9zPgUM4M/XLN/4C/hmGP6', 'BGS', 'Herr', 'Dirk', 'Klatt', '2025-07-08', '2025-12-10', '955/231/2023 - IHK geprüfte Sicherheitsfachkraft gem. §34a GewO mit Bearbeitung von Sprach -und Lernhindernissen Online', 'Lavdrim Kadrija', '0112205', '2025-06-27 11:50:18', '2025-07-02 11:31:06', NULL, 4, NULL, NULL),
(100023, '$2b$10$CmPxSqeyeVnWIyqyViqWKeIK3URo0XB0P2QVbuRyx/7frIAhXg2ae', 'BGS', 'Herr', 'Elias', 'Schugardt', '2025-07-08', '2025-12-24', '955/231/2023 - IHK geprüfte Sicherheitsfachkraft gem. §34a GewO mit Bearbeitung von Sprach -und Lernhindernissen Online', 'Feran Kadrija', '0112205', '2025-06-27 11:52:41', '2025-07-02 11:30:45', NULL, 4, NULL, NULL),
(100024, '$2b$10$JKnf.0gAYM964NXXYrYxpudHHUrz4nufD42ousujSD65nAxUMrnsy', 'BGS', 'Herr', 'Ronald', 'Oprea', '2025-07-08', '2025-12-10', '955/231/2023 - IHK geprüfte Sicherheitsfachkraft gem. §34a GewO mit Bearbeitung von Sprach -und Lernhindernissen Online', 'Laura Schütz', '0112205', '2025-06-27 11:54:22', '2025-07-02 11:29:51', NULL, 4, NULL, NULL),
(100025, '$2b$10$Vp1gpE25TmvI8bnnli9HEeLFsGM0ryaiLiq9Ho73ig5.U1dSNyYj.', 'BGS', 'Herr', 'Max', 'Mustermann', '2025-07-01', '2026-02-26', '0 - GSSK (Geprüften Schutz- und Sicherheitskraft)', 'Janine Emmert', NULL, '2025-06-27 12:38:36', '2025-06-30 17:07:37', '2025-06-30 17:07:37', 9, NULL, NULL),
(100026, '$2b$10$tXNQprf7mt1DBsJErIEBg.pskorjOktRw/WUTSbZRRQ4yLudxoiLK', 'BGS', 'Herr', 'Nasir Ahmad', 'Rauf', '2025-07-08', '2025-12-21', '955/231/2023 - IHK geprüfte Sicherheitsfachkraft gem. §34a GewO mit Bearbeitung von Sprach -und Lernhindernissen Online', 'Feran Kadrija', '0112205', '2025-06-30 10:42:42', '2025-07-02 11:28:52', NULL, 4, NULL, NULL),
(100027, '$2b$10$HKnU42fGPSHK3/Qnpu6lxuW1pnoYjzCo0ikl0TY9tB0WIzJ2MH7Ge', 'BGS', 'Frau', 'Christin', 'Heuer', '2025-08-05', '2025-10-29', '962/365/2025 - IHK geprüfte Sicherheitsfachkraft gem. §34a GewO', 'Laura Schütz', '0112205', '2025-06-30 12:01:35', '2025-07-02 11:37:34', NULL, 1, NULL, NULL),
(100028, '$2b$10$Q2d1avP/vET.xVD2sNQLIe2DgDKQyb9.1xUjw7MCXiWUTYopXMhKK', 'PRIVAT', 'Herr', 'Michael', 'Krüger', '2025-07-01', '2026-02-28', '0 - GSSK (Geprüften Schutz- und Sicherheitskraft)', 'Janine Emmert', '0112206', '2025-06-30 14:31:58', '2025-07-03 20:10:50', NULL, 9, NULL, NULL),
(100029, '$2b$10$f/mRML9mVknfdQ.m9C..h.SngFgBs2pQgJiArHsRA3YAQadNQutMu', 'BGS', 'Herr', 'Alexander', 'Mairer', '2025-07-01', '2026-02-28', '0 - GSSK (Geprüften Schutz- und Sicherheitskraft)', 'Janine Emmert', '0112206', '2025-06-30 14:39:57', '2025-07-03 20:04:38', NULL, 9, NULL, NULL),
(100030, '$2b$10$PFlMAqLqu6lh9gxSD2umM.IO1eO4ptpOeLI92/z1ysoMOZCxgburC', 'BGS', 'Herr', 'Agron', 'Bujupaj', '2025-07-01', '2026-02-28', '0 - GSSK (Geprüften Schutz- und Sicherheitskraft)', 'Janine Emmert', '0112206', '2025-06-30 14:43:04', '2025-07-03 20:02:48', NULL, 9, NULL, NULL),
(100031, '$2b$10$0HdsJHotJ/6CxMEKL1vSjery9QYT.J59bTu/6fh9ohZbCO9OlZ0jS', 'BGS', 'Herr', 'Antonio', 'Karamatic', '2025-07-01', '2026-02-28', '0 - GSSK (Geprüften Schutz- und Sicherheitskraft)', 'Janine Emmert', '0112206', '2025-06-30 14:45:43', '2025-07-03 20:02:14', NULL, 9, NULL, NULL),
(100032, '$2b$10$Ozx6twyjPh7PMqKX1ZQ5ceQReeJzoJA1NB8/GGTD//0Rj0jMkGfWi', 'BGS', 'Herr', 'Zarif Shah', 'Zadran', '2025-07-01', '2026-02-28', '0 - GSSK (Geprüften Schutz- und Sicherheitskraft)', 'Janine Emmert', '0112206', '2025-06-30 14:49:53', '2025-07-03 20:01:45', NULL, 9, NULL, NULL),
(100033, '$2b$10$Gn6Lgj55OLmC/Fqjsr/b1uhBOMkylLONvL5e0jk7Km1bdCcBkqjDS', 'BGS', 'Herr', 'Yasin Mohamad', 'Farhan', '2025-07-01', '2026-02-28', '0 - GSSK (Geprüften Schutz- und Sicherheitskraft)', 'Janine Emmert', '0112206', '2025-06-30 17:08:56', '2025-07-03 20:01:04', NULL, 9, NULL, NULL),
(100034, '$2b$10$UMZ4fApYumkIcqOJ/lIZueOaaQds7/rOEuZBTSPVa0noKkWeI8vhK', 'BGS', 'Herr', 'Abedellatif', 'Bouchareb', '2025-07-01', '2026-02-28', '0 - GSSK (Geprüften Schutz- und Sicherheitskraft)', 'Janine Emmert', '0112206', '2025-06-30 17:10:10', '2025-07-03 19:56:43', NULL, 9, NULL, NULL),
(100035, '$2b$10$iMz17I4fI6cN1hPT02gjQuO7RMa6ibdNvCPaqBFdujfUvV.XTeyEi', 'BGS', 'Herr', 'Oguz', 'Caner', '2025-07-01', '2026-02-28', '0 - GSSK (Geprüften Schutz- und Sicherheitskraft)', 'Janine Emmert', '0112206', '2025-06-30 17:11:13', '2025-07-03 20:00:32', NULL, 9, NULL, NULL),
(100036, '$2b$10$ORZM8xF0guV0UTsfQ0667.NEpgN0BMfeVAbM4GzVKZpdwVJq35zby', 'BGS', 'Herr', 'Stephan', 'Schulze', '2025-07-01', '2026-02-28', '0 - GSSK (Geprüften Schutz- und Sicherheitskraft)', 'Janine Emmert', '0112206', '2025-06-30 17:12:24', '2025-07-03 19:59:38', NULL, 9, NULL, NULL),
(100037, '$2b$10$jiOK88/OtUtQJKZd7A82ke0HNf6gQVFdxnUArJcsg.KghV5wDZl2i', 'BGS', 'Herr', 'Stephan', 'Herzog', '2025-07-01', '2026-02-28', '0 - GSSK (Geprüften Schutz- und Sicherheitskraft)', 'Janine Emmert', '0112206', '2025-06-30 17:13:58', '2025-07-03 20:10:23', NULL, 9, NULL, NULL),
(100038, '$2b$10$56KsNMHkaOOB8wyqr5XdwOLqezps04Ho0Re3ZOp4nnLC7c56dtICO', 'BGS', 'Herr', 'Adnan', 'Muhemed', '2025-07-01', '2026-02-28', '0 - GSSK (Geprüften Schutz- und Sicherheitskraft)', 'Janine Emmert', '0112206', '2025-06-30 17:16:35', '2025-07-03 20:09:35', NULL, 9, NULL, NULL),
(100039, '$2b$10$336ToNnFRt/kd9z7YLIkBOt2Rs8LjB3zMZCgrPurMKX4Ee4lttqdK', 'BGS', 'Herr', 'Yasser ', 'Albahri ', '2025-07-01', '2026-02-28', '0 - GSSK (Geprüften Schutz- und Sicherheitskraft)', 'Janine Emmert', '0112206', '2025-06-30 17:17:29', '2025-07-03 20:09:00', NULL, 9, NULL, NULL),
(100040, '$2b$10$8VfvZgjzCpND8OR603bCW.EPx.hqayF82fcOw230FEqNZ8CONTYp2', 'BGS', 'Herr', 'Alaa ', 'Kadhim Moamal ', '2025-07-01', '2026-02-28', '0 - GSSK (Geprüften Schutz- und Sicherheitskraft)', 'Janine Emmert', '0112206', '2025-06-30 17:18:33', '2025-07-03 20:08:25', NULL, 9, NULL, NULL),
(100041, '$2b$10$jkopX0hABEFA4BSJ8lpieOa4VzBt.9XKCKcAVX9i1wrgsCj8gJ/RS', 'BGS', 'Herr', 'Umut', 'Kartal', '2025-07-01', '2026-02-28', '0 - GSSK (Geprüften Schutz- und Sicherheitskraft)', 'Janine Emmert', '0112206', '2025-06-30 17:19:41', '2025-07-03 20:07:54', NULL, 9, NULL, NULL),
(100042, '$2b$10$NStONNHua5egFbB0.6rG1Oxp4udn5iCLsyZKsfdsexwH8EtolOOSC', 'BGS', 'Herr', 'Michael', 'Schacher', '2025-07-01', '2026-02-28', '0 - GSSK (Geprüften Schutz- und Sicherheitskraft)', 'Janine Emmert', '0112206', '2025-06-30 17:20:28', '2025-07-03 20:07:19', NULL, 9, NULL, NULL),
(100043, '$2b$10$52/TMi1Z4DQpu7Lsyt3/huMu6yfc2TXF3CrHAAqJOT.ww9gX2mBNy', 'BGS', 'Herr', 'Michael', 'Harlfinger', '2025-07-01', '2026-02-28', '0 - GSSK (Geprüften Schutz- und Sicherheitskraft)', 'Janine Emmert', '0112206', '2025-06-30 17:21:20', '2025-07-03 20:06:37', NULL, 9, NULL, NULL),
(100044, '$2b$10$0ECN2mQ2N5ZJ7pHTmJUVi.mVLlskkJ5n4zj09H.4U4NIsqoD8Ue0K', 'BGS', 'Herr', 'Nico', 'Bauer', '2025-07-01', '2026-02-28', '0 - GSSK (Geprüften Schutz- und Sicherheitskraft)', 'Janine Emmert', '0112206', '2025-06-30 17:22:07', '2025-07-03 20:06:08', NULL, 9, NULL, NULL),
(100045, '$2b$10$3/TQ.8rSFPB7r/Kq8XR0wuV1NWzjQatfdKPSZoARPM7HXX5Y54g1G', 'BGS', 'Frau', 'Maria', 'Tsolakidis', '2025-07-01', '2026-02-28', '0 - GSSK (Geprüften Schutz- und Sicherheitskraft)', 'Janine Emmert', '0112206', '2025-06-30 17:23:09', '2025-07-03 20:05:13', NULL, 9, NULL, NULL),
(100046, '$2b$10$nNhVceHWNcGlJnZzvd7rHO2PAsZjTBtlBN7ryr5800E2pchW3xXr.', 'BGS', 'Herr', ' Steve Manfred', 'Baankreis', '2025-07-08', '2025-09-27', '962/365/2025 - IHK geprüfte Sicherheitsfachkraft gem. §34a GewO', 'Janine Emmert', '0112205', '2025-07-01 10:45:57', '2025-07-02 11:23:35', NULL, 1, NULL, NULL),
(100047, '$2b$10$ycKdm43ffzrTZJD/ajQqgOQ4An7bRdOYRBLty1k/.JWcKtmYfLZya', 'BGS', 'Herr', 'Inzimam', 'Ullah', '2025-08-04', '2025-10-29', '955/234/2023 - IHK geprüfte Sicherheitsfachkraft gem. §34a GewO', 'Laura Schütz', '', '2025-07-01 11:05:30', '2025-07-01 11:09:02', NULL, 1, NULL, NULL),
(100048, '$2b$10$iufEHOkRmmWkh1rTZHhfcud8RWTgkDIifP0oO71aW0FGkJCd9IB8a', 'BGS', 'Frau', 'Saskia ', 'Jux', '2025-07-08', '2025-09-27', '962/365/2025 - IHK geprüfte Sicherheitsfachkraft gem. §34a GewO', 'Dieter Emmert', '0112205', '2025-07-01 11:34:44', '2025-07-02 11:22:10', NULL, 1, NULL, NULL),
(100049, '$2b$10$MwEyDE6etUHxh.8uRTD8P.SbZJ2A15gSWSpxOV9oiXWYjdGNmU2PW', 'BGS', 'Herr', 'David', 'Ampartsidis', '2025-07-08', '2025-09-24', '962/365/2025 - IHK geprüfte Sicherheitsfachkraft gem. §34a GewO', 'Laura Schütz', '0112205', '2025-07-02 07:51:24', '2025-07-02 11:32:07', NULL, 1, NULL, NULL),
(100050, '$2b$10$Nx23sj9lWl5hKv5vFyJ5m.Sk2dV2I.rIzyMthztCPIn0Hsf71ael2', 'BGS', 'Frau', 'Anja', 'Koßmann', '2025-07-08', '2025-09-27', '962/365/2025 - IHK geprüfte Sicherheitsfachkraft gem. §34a GewO', 'Stefan Emmert', '0112205', '2025-07-02 11:19:13', '2025-07-02 11:19:52', NULL, 1, NULL, NULL),
(100051, '$2b$10$boM8slgHTDQfhgYsaNnw.Os7NbLXuWRedHZjdrLMLdvz1rb/Yoquq', 'BGS', 'Herr', 'Inzinam', 'Ullah', '2025-08-05', '2025-10-29', '962/365/2025 - IHK geprüfte Sicherheitsfachkraft gem. §34a GewO', 'Laura Schütz', NULL, '2025-07-02 11:41:25', '2025-07-02 11:41:50', '2025-07-02 11:41:50', 1, NULL, NULL),
(100052, '$2b$10$0Njcn3ztSnubZdBpGCmLQuPUDf6yFJLPv6vtoaNyf8DRwRz.i.p42', 'BGS', 'Herr', 'Ayhan', 'Uslu', '2025-07-07', '2025-09-26', '962/365/2025 - IHK geprüfte Sicherheitsfachkraft gem. §34a GewO', 'Lavdrim Kadrija', '0112205', '2025-07-03 08:59:17', '2025-07-03 10:52:39', NULL, 1, NULL, NULL),
(100053, '$2b$10$RHAuMKf5YZpBJapouJnFguy.k96Wxa8XgppFHM3GA0t.Bx3aSXPsm', 'BGS', 'Herr', 'Ole Sven ', 'Franken', '2025-07-08', '2025-09-26', '962/365/2025 - IHK geprüfte Sicherheitsfachkraft gem. §34a GewO', 'Feran Kadrija', '0112205', '2025-07-03 12:20:03', '2025-07-03 12:21:28', NULL, 1, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `student_attendance`
--

CREATE TABLE `student_attendance` (
  `id` int(11) NOT NULL,
  `student_id` int(6) UNSIGNED ZEROFILL DEFAULT NULL,
  `attendance_date` date NOT NULL,
  `morning_attendance` tinyint(1) DEFAULT 0,
  `morning_attendance_time` timestamp NULL DEFAULT NULL,
  `afternoon_attendance` tinyint(1) DEFAULT 0,
  `afternoon_attendance_time` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `student_attendance`
--

INSERT INTO `student_attendance` (`id`, `student_id`, `attendance_date`, `morning_attendance`, `morning_attendance_time`, `afternoon_attendance`, `afternoon_attendance_time`, `created_at`, `updated_at`) VALUES
(1, 100002, '2025-05-23', 0, NULL, 1, '2025-05-22 10:19:18', '2025-05-22 10:12:10', '2025-05-22 13:51:30'),
(2, 100001, '2025-05-23', 1, '2025-05-23 05:00:10', 0, NULL, '2025-05-23 05:00:10', '2025-05-23 05:00:10'),
(3, 100001, '2025-05-26', 1, '2025-05-26 03:31:00', 1, '2025-05-26 03:31:00', '2025-05-26 08:57:45', '2025-05-26 08:57:45'),
(4, 100001, '2025-05-21', 1, '2025-05-21 03:31:00', 0, NULL, '2025-05-26 08:57:49', '2025-05-26 08:57:49'),
(5, 100001, '2025-05-31', 0, NULL, 1, '2025-05-31 12:38:30', '2025-05-31 12:38:30', '2025-05-31 12:38:30'),
(6, 100004, '2025-07-01', 1, '2025-07-01 07:24:27', 1, '2025-07-01 12:24:30', '2025-07-01 07:24:11', '2025-07-01 12:24:30'),
(7, 100029, '2025-07-01', 1, '2025-07-01 07:26:03', 0, NULL, '2025-07-01 07:26:03', '2025-07-01 07:26:03'),
(8, 100035, '2025-07-02', 1, '2025-07-02 07:15:27', 0, NULL, '2025-07-02 07:15:27', '2025-07-02 07:15:27'),
(9, 100048, '2025-07-02', 1, '2025-07-02 08:11:40', 0, NULL, '2025-07-02 08:11:40', '2025-07-02 08:11:40'),
(10, 100027, '2025-07-03', 0, NULL, 1, '2025-07-03 12:50:10', '2025-07-03 12:50:10', '2025-07-03 12:50:10'),
(11, 100027, '2025-07-04', 1, '2025-07-04 09:05:47', 0, NULL, '2025-07-04 09:05:47', '2025-07-04 09:05:47');

-- --------------------------------------------------------

--
-- Table structure for table `student_contact_details`
--

CREATE TABLE `student_contact_details` (
  `id` int(11) NOT NULL,
  `student_id` int(6) UNSIGNED ZEROFILL DEFAULT NULL,
  `street_name` varchar(255) DEFAULT NULL,
  `street_number` varchar(20) DEFAULT NULL,
  `postal_code` varchar(10) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `birth_date` date DEFAULT NULL,
  `place_of_birth` varchar(100) DEFAULT NULL,
  `country_of_birth` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `remarks` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `student_contact_details`
--

INSERT INTO `student_contact_details` (`id`, `student_id`, `street_name`, `street_number`, `postal_code`, `city`, `birth_date`, `place_of_birth`, `country_of_birth`, `phone`, `email`, `remarks`) VALUES
(2, 100001, 'Shyam Market, maninagar , kadodara', '302', '394327', 'Dist. - Surat', '1998-05-14', 'surat', 'India', '7984810153', 'info@storeindia.live', 'bhkb '),
(3, 100002, 'Shyam Market, maninagar , kadodara', '302', '394327', 'Dist. - Surat', '2025-05-26', 'surat', 'India', '7984810151', 'ja@gmail.com', ''),
(4, 100003, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(5, 100004, 'Flämingstraße', '70', '12689', 'Berlin', '0000-00-00', '', '', '+49 176 31653066', 'sam.amd@web.de', ''),
(6, 100005, 'Neue Hochstr.', '9', '12524', 'BERLIN', '2025-06-02', 'Berlin', 'Germany', '+4915758151958', 'test.muster@gmail.com', ''),
(7, 100006, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(8, 100007, 'Schemannstraße', '5', '45884', 'Gelsenkirchen', '0000-00-00', '', '', '+49 1590 1401210', 'Danijel.smk.j@gmail.com', ''),
(9, 100008, ' Ahornweg', '6', '63452', 'Hanau', '0000-00-00', '', '', '017630678334', 'rahimzarabi8@gmail.com', ''),
(10, 100009, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(11, 100010, 'Gabelsbergerstraße', '27', '84307', 'Eggenfelden', '0000-00-00', '', '', '+49 1573 3911364', 'hamido1716@icloud.com', ''),
(12, 100011, 'Münsterstraße', '31', '49525', 'Lengerich', '0000-00-00', '', '', '+49 176 72979992', 'Sedaoezel1995@outlook.de', ''),
(13, 100012, 'Rehackerstr.', '23', '76593', 'Gernsbach', '0000-00-00', '', '', '+49 1575 7517162', 'montesanosabine@gmail.com', ''),
(14, 100013, 'Hauptstraße', '1', '12345', 'Berlin', '0000-00-00', '', '', '+49 176 56988562', 'erkankioutsouk0@gmail.com', ''),
(15, 100014, 'Kettwiger Straße', '48', '40233', 'Düsseldorf', '0000-00-00', '', '', '01741889353', 'Mervin.Mamutovski@gmail.com', ''),
(16, 100015, 'Harzer Str.', '6b', '28307', 'Bremen', '0000-00-00', '', '', '017632196525', 'Hamsafakhro4@gmail.com', ''),
(17, 100016, 'Pater-Müller-Str', '15a', '53340', 'Meckenheim', '0000-00-00', '', '', '0176 64300048', 'mohamad.hanan1997@gmail.com', ''),
(18, 100017, ' Arnold-Zweig-Str.', '79', '18435', 'Stralsund', '0000-00-00', '', '', '+49 1575 7225817', 'ersan.gasi@gmx.de', ''),
(19, 100018, 'Bredowstr', '4', '10551', 'Berlin', '0000-00-00', '', '', '017658876266', 'Mehranshahin8@gmail.com', ''),
(20, 100019, 'Ablacherstr', '4/1', '72488', 'Sigmaringen', '0000-00-00', '', '', '+49 15566 331419', 'Kristina.valeev@gmail.com', ''),
(21, 100020, 'Kösliner Weg', '4b', '22850', 'Norderstedt', '0000-00-00', '', '', '+49 176 23979900', 'Joesie483@gmail.com', ''),
(22, 100021, 'Senftenberger Ring', '58', '13435', 'Berlin', '0000-00-00', '', '', '0157 58017762', 'parakiala@yahoo.com', ''),
(23, 100022, 'Raoul-Wallenberg-Straße', '47', '12679', 'Berlin', '0000-00-00', '', '', '+49 176 13866655', 'beutegermane@msn.com', ''),
(24, 100023, 'Bützer Havelstraße ', '10', '14715', 'Milower Land', '0000-00-00', '', '', '+49 1522 2426458', 'elias_schugardt@web.de', ''),
(25, 100024, 'Hardtstraße', '100', '73525', ' Schwäbisch Gmünd', '0000-00-00', '', '', '+49 177 3194546', 'ronnyoprea@web.de', ''),
(26, 100025, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(27, 100026, 'Horst Weg', '31', '65520', 'Bad Camberg ', '0000-00-00', '', '', '+49 1573 4444816', 'nasirrauf19@gmail.com', ''),
(28, 100027, 'Dr. Herrmann Str. ', '2', '55566', 'Bad Sobernheim', '2025-06-27', '', '', '+49 172 7291388', 'christinheuer9@gmail.com', ''),
(29, 100028, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(30, 100029, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(31, 100030, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(32, 100031, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(33, 100032, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(34, 100033, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(35, 100034, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(36, 100035, '', '', '', '', '0000-00-00', '', '', '', '', ''),
(37, 100036, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(38, 100037, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(39, 100038, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(40, 100039, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(41, 100040, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(42, 100041, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(43, 100042, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(44, 100043, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(45, 100044, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(46, 100045, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(47, 100046, 'Unter´m Himmel', '6', '59846', 'Sundern', '0000-00-00', '', '', '+49 176 22782953', 'stevebaankreis@gmx.de', ''),
(48, 100047, 'Hildastraße', '24', '77948', 'Friesenheim', '1981-08-19', 'Berlin', 'Deutschland', '+49 176 67382812', 'inziullah@outlook.com', ''),
(49, 100048, 'Henckellweg ', '15', ' 30459', 'Hannover', '0000-00-00', '', '', '0155 61659156', 'saskiajux@yahoo.de', ''),
(50, 100049, 'Alte Wöhr', '9B', '22307', 'Hamburg', '0000-00-00', '', '', '+49 162 2547536', 'david.basicag@yahoo.de', ''),
(51, 100050, 'Greifenberger Straße', '95', '22147', 'Hamburg', '0000-00-00', '', '', '01575 3383387', 'melinaanja2017@gmail.com', ''),
(52, 100051, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(53, 100052, 'Heynen Str', '9', '47229', 'Duisburg', '0000-00-00', '', '', '+49 163 6841319', 'ayhan.uslu@outlook.de', ''),
(54, 100053, 'Schönefelder Chaussee', '175', '12524', 'Berlin', '0000-00-00', '', '', '0176 61540950', 'frankenole978@gmail.com', '');

-- --------------------------------------------------------

--
-- Table structure for table `student_exam_dates`
--

CREATE TABLE `student_exam_dates` (
  `id` int(11) NOT NULL,
  `student_id` int(6) UNSIGNED ZEROFILL DEFAULT NULL,
  `exam_from` date DEFAULT NULL,
  `exam_to` date DEFAULT NULL,
  `exam_type` varchar(100) DEFAULT NULL,
  `exam_result` varchar(255) DEFAULT NULL,
  `certificate_url` varchar(255) DEFAULT NULL,
  `done_on` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `student_exam_dates`
--

INSERT INTO `student_exam_dates` (`id`, `student_id`, `exam_from`, `exam_to`, `exam_type`, `exam_result`, `certificate_url`, `done_on`, `created_at`, `updated_at`) VALUES
(2, 100003, '2025-06-08', '2025-06-09', 'Ersthelfer', 'pass', NULL, NULL, '2025-06-08 13:36:52', '2025-06-12 12:48:07'),
(3, 100005, '2025-06-17', '2025-06-18', 'Schriftliche IHK Sachkunde gem. 34a GewO', 'pass', NULL, NULL, '2025-06-18 06:47:47', '2025-06-18 06:47:51'),
(4, 100005, '2025-06-17', '2025-06-18', 'Mündliche IHK Sachkunde gem. 34a GewO', 'pass', NULL, NULL, '2025-06-18 06:48:22', '2025-06-18 06:48:28');

-- --------------------------------------------------------

--
-- Table structure for table `student_files`
--

CREATE TABLE `student_files` (
  `id` int(11) NOT NULL,
  `student_id` int(6) UNSIGNED ZEROFILL DEFAULT NULL,
  `file_name` varchar(255) NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `file_type` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  `uploaded_by` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `student_files`
--

INSERT INTO `student_files` (`id`, `student_id`, `file_name`, `file_path`, `file_type`, `description`, `uploaded_by`, `created_at`, `deleted_at`) VALUES
(0, 100003, 'DrLabike App Bugs - Google Docs.pdf', 'student-files/1750079722524-892251068.pdf', '.pdf', 'fgdghdhfghfghfghfghfg', '1', '2025-06-16 13:15:22', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `student_invoices`
--

CREATE TABLE `student_invoices` (
  `id` int(11) NOT NULL,
  `student_id` int(6) DEFAULT NULL,
  `invoice_number` varchar(50) DEFAULT NULL,
  `invoice_date` date DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `invoice_type` varchar(20) DEFAULT NULL,
  `reminder_sent` tinyint(1) DEFAULT 0,
  `reminder_auto_dispatch` tinyint(1) DEFAULT 0,
  `paid` tinyint(1) DEFAULT 0,
  `paid_date` date DEFAULT NULL,
  `pdf_url` varchar(255) DEFAULT NULL,
  `xml_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `student_invoices`
--

INSERT INTO `student_invoices` (`id`, `student_id`, `invoice_number`, `invoice_date`, `amount`, `invoice_type`, `reminder_sent`, `reminder_auto_dispatch`, `paid`, `paid_date`, `pdf_url`, `xml_url`, `created_at`, `updated_at`) VALUES
(6, 100001, 'INV-2025-001', '2025-05-27', 100.00, '1/3', 0, 0, 1, '2025-05-27', 'https://example.com/invoices/INV-2025-001.pdf', NULL, '2025-05-27 14:34:52', '2025-05-27 14:34:52'),
(7, 100001, '1220/15', '2025-05-30', 1000.00, '1/3', 0, 0, 1, '2025-05-31', '/uploads/bad/Rechnung_orrektur_1748696042.pdf', NULL, '2025-05-31 12:49:08', '2025-05-31 12:54:02'),
(8, 100001, '1234/10', '2025-05-10', 1000.00, 'Schlussrechnung', 1, 0, 0, NULL, '/uploads/bad/Rechnung_orrektur_1748696102.pdf', NULL, '2025-05-31 12:55:02', '2025-05-31 12:55:02'),
(9, 100001, '291/2025', '2025-06-02', 1000000.00, '1/3', 0, 0, 1, '2025-06-02', '/uploads/bad/Rechnung_orrektur_1748852746.pdf', NULL, '2025-06-02 08:25:46', '2025-06-02 08:25:46'),
(10, 100001, 'INV-2025-001', '2025-06-02', 1000.00, '1/3', 0, 0, 0, NULL, '/uploads/bad/Rechnung_orrektur_1748878147.pdf', NULL, '2025-06-02 15:29:07', '2025-06-02 15:29:07'),
(11, 100001, 'INV-2025-001', '2025-06-02', 1000.00, '1/3', 0, 0, 0, NULL, '/uploads/bad/Rechnung_orrektur_1748878157.pdf', NULL, '2025-06-02 15:29:17', '2025-06-02 15:29:17'),
(12, 100001, 'INV-2025-001', '2025-06-02', 1000.00, '1/3', 0, 0, 0, NULL, '/uploads/bad/Rechnung_orrektur_1748878306.pdf', NULL, '2025-06-02 15:31:46', '2025-06-06 07:44:57'),
(13, 100003, '1220/12', '2025-06-08', 1000.00, '1/3', 0, 0, 1, '2025-06-08', '/uploads/bad/Rechnung_orrektur_1749388430.pdf', NULL, '2025-06-08 13:13:50', '2025-06-08 13:14:15'),
(14, 100003, '291/2025', '2025-06-09', 200.00, '1/1', 0, 0, 1, '2025-06-09', '/uploads/bad/Rechnung_orrektur_1749468310.pdf', NULL, '2025-06-09 11:25:10', '2025-06-09 11:25:10'),
(15, 100003, '291/2025', '2025-06-16', 5456454.00, '1/1', 0, 0, 1, '2025-06-16', '/uploads/bad/Rechnung_orrektur_1750079954.pdf', '/uploads/bad/BAD_291/2025_1750079954354.xml', '2025-06-16 13:19:14', '2025-06-16 13:19:14'),
(16, 100006, '01/2025', '2025-06-19', 1.47, '1/3', 0, 0, 1, '2025-06-19', '/uploads/bad/Rechnung_orrektur_1750289696.pdf', '/uploads/bad/BAD_01/2025_1750289695866.xml', '2025-06-18 23:34:56', '2025-06-18 23:34:56'),
(17, 100009, '1234/123', '2025-06-16', 123.34, '1/1', 0, 0, 1, '2025-06-19', '/uploads/bad/Rechnung_orrektur_1750316510.pdf', '/uploads/bad/BAD_1234/123_1750316510899.xml', '2025-06-19 07:00:25', '2025-06-19 07:01:50'),
(18, 100008, '01/2025', '2025-06-19', 147.00, '1/3', 0, 0, 0, NULL, '/uploads/bad/Rechnung_orrektur_1750408860.pdf', '/uploads/bad/BAD_01/2025_1750408860809.xml', '2025-06-19 15:51:44', '2025-06-20 08:41:00'),
(19, 100008, '291/2025', '2025-06-20', 1111111.11, '1/1', 0, 0, 1, '2025-06-20', '/uploads/bad/Rechnung_orrektur_1750409389.pdf', '/uploads/bad/BAD_291/2025_1750409389060.xml', '2025-06-20 08:35:23', '2025-06-20 08:49:49'),
(20, 100023, '01/2025', '2025-07-10', 1000.00, '1/1', 0, 0, 0, NULL, '/uploads/bad/Rechnung_orrektur_1751362671.pdf', '/uploads/bad/BAD_01/2025_1751362670722.xml', '2025-07-01 09:37:51', '2025-07-01 09:37:51');

-- --------------------------------------------------------

--
-- Table structure for table `student_reports`
--

CREATE TABLE `student_reports` (
  `id` int(11) NOT NULL,
  `student_id` int(6) UNSIGNED ZEROFILL DEFAULT NULL,
  `report_type` enum('discharge','termination') NOT NULL,
  `first_day_attendance` date NOT NULL,
  `last_day_attendance` date NOT NULL,
  `early_exam_success` tinyint(1) DEFAULT 0,
  `exam_not_passed` tinyint(1) DEFAULT 0,
  `employment_date` date DEFAULT NULL,
  `is_employment` tinyint(1) DEFAULT 0,
  `insufficient_performance` tinyint(1) DEFAULT 0,
  `longer_periods_absence` tinyint(1) DEFAULT 0,
  `other_reasons` tinyint(1) DEFAULT 0,
  `reasons` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `pdf_url` varchar(255) DEFAULT NULL COMMENT 'URL path to the generated PDF file',
  `authority_email` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `student_reports`
--

INSERT INTO `student_reports` (`id`, `student_id`, `report_type`, `first_day_attendance`, `last_day_attendance`, `early_exam_success`, `exam_not_passed`, `employment_date`, `is_employment`, `insufficient_performance`, `longer_periods_absence`, `other_reasons`, `reasons`, `created_at`, `pdf_url`, `authority_email`) VALUES
(1, 100001, 'discharge', '2025-05-17', '2025-05-18', 1, 0, NULL, 0, 0, 0, 0, NULL, '2025-05-17 07:57:46', NULL, NULL),
(8, 100001, 'discharge', '2025-05-26', '2025-05-27', 1, 1, NULL, 0, 0, 0, 0, NULL, '2025-05-26 08:58:08', 'https://testapi.meteorinfotech.com/uploads/discharge-report/discharge-report_1748249888.pdf', 'info@storeindia.live'),
(9, 100001, 'termination', '2025-05-26', '2025-05-28', 0, 0, '2025-05-21', 1, 0, 0, 1, 'dsd', '2025-05-26 08:58:33', 'https://testapi.meteorinfotech.com/uploads/termination-report/termination-report_1748249913.pdf', 'info@storeindia.live'),
(10, 100002, 'discharge', '2025-05-04', '2025-05-31', 1, 0, NULL, 0, 0, 0, 0, NULL, '2025-05-31 12:19:36', 'https://testapi.meteorinfotech.com/uploads/discharge-report/discharge-report_1748693976.pdf', 'vishal@gmail.com');

-- --------------------------------------------------------

--
-- Table structure for table `student_result_sheet`
--

CREATE TABLE `student_result_sheet` (
  `id` int(11) NOT NULL,
  `student_id` int(6) UNSIGNED ZEROFILL DEFAULT NULL,
  `skills` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`skills`)),
  `it_skills` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `language_skills` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `mobility` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`mobility`)),
  `internships` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`internships`)),
  `applications` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`applications`)),
  `future_application` text DEFAULT NULL,
  `alternatives` text DEFAULT NULL,
  `other_comments` text DEFAULT NULL,
  `pdf_url` varchar(255) DEFAULT NULL,
  `signature` longtext NOT NULL,
  `date_of_participation` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `reference_no` varchar(30) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `student_result_sheet`
--

INSERT INTO `student_result_sheet` (`id`, `student_id`, `skills`, `it_skills`, `language_skills`, `mobility`, `internships`, `applications`, `future_application`, `alternatives`, `other_comments`, `pdf_url`, `signature`, `date_of_participation`, `reference_no`, `created_at`, `updated_at`) VALUES
(3, 100001, '[{\"id\":0,\"label\":\"Fertigkeiten\",\"value\":\"Grund-Kenntnisse\"},{\"id\":0,\"label\":\"dfds\",\"value\":\"Grund-Kenntnisse\"}]', '[{\"id\":0,\"label\":\"dfds\",\"value\":\"Experten-Kenntnisse\"},{\"id\":0,\"label\":\"fdfd\",\"value\":\"Erweiterte-Kenntnisse\"}]', '[{\"id\":0,\"language\":\"fdsf\",\"level\":\"Erweiterte-Kenntnisse\"},{\"id\":0,\"language\":\"dsfsf\",\"level\":\"Experten-Kenntnisse\"}]', '{\"id\":0,\"willing_to_be_mobile\":\"international\",\"maximum_commuting_time\":\"sdfsd\",\"regional_wishes\":\"dsfsdf\"}', '[{\"id\":0,\"from\":\"2025-05-07\",\"to\":\"2025-05-08\",\"activity_as\":\"fdsfs\",\"at\":\"dfs\"}]', '[{\"id\":0,\"application_to\":\"fdsf\",\"to\":\"dsfsd\",\"status\":\"Ergebnis Offen\"}]', 'dfsdf', 'dfsdf', 'fdsf', '/uploads/ergebnisbogen-bewerberprofil_1746613790.pdf', 'data:image/png;base64,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', '2025-05-30 18:30:00', '', '2025-05-07 06:38:23', '2025-05-31 12:41:54');

-- --------------------------------------------------------

--
-- Table structure for table `student_settings`
--

CREATE TABLE `student_settings` (
  `id` int(11) NOT NULL,
  `student_id` int(6) UNSIGNED ZEROFILL DEFAULT NULL,
  `permission_to_sign_retroactively` tinyint(1) DEFAULT NULL,
  `receive_teaching_materials` tinyint(1) DEFAULT NULL,
  `face_to_face_instruction` tinyint(1) DEFAULT NULL,
  `online_instruction` tinyint(1) DEFAULT NULL,
  `surveyed_after_6_months` tinyint(1) DEFAULT NULL,
  `mediated` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `student_settings`
--

INSERT INTO `student_settings` (`id`, `student_id`, `permission_to_sign_retroactively`, `receive_teaching_materials`, `face_to_face_instruction`, `online_instruction`, `surveyed_after_6_months`, `mediated`) VALUES
(2, 100001, 1, 1, 0, 0, 0, 0),
(3, 100002, 0, 1, 1, 0, 0, 0),
(4, 100003, 0, 0, 0, 1, 0, 0),
(5, 100004, 0, 0, 0, 1, 0, 0),
(6, 100005, 0, 0, 0, 1, 0, 0),
(7, 100006, 0, 0, 0, 1, 0, 0),
(8, 100007, 0, 0, 0, 1, 0, 0),
(9, 100008, 0, 0, 0, 1, 0, 0),
(10, 100009, 0, 1, 0, 0, 0, 0),
(11, 100010, 0, 0, 0, 1, 0, 0),
(12, 100011, 0, 0, 0, 1, 0, 0),
(13, 100012, 0, 0, 0, 1, 0, 0),
(14, 100013, 0, 0, 0, 1, 0, 0),
(15, 100014, 0, 0, 0, 1, 0, 0),
(16, 100015, 0, 0, 0, 1, 0, 0),
(17, 100016, 0, 0, 0, 1, 0, 0),
(18, 100017, 0, 0, 0, 1, 0, 0),
(19, 100018, 0, 0, 0, 1, 0, 0),
(20, 100019, 0, 0, 0, 1, 0, 0),
(21, 100020, 0, 0, 0, 1, 0, 0),
(22, 100021, 0, 0, 0, 1, 0, 0),
(23, 100022, 0, 0, 0, 1, 0, 0),
(24, 100023, 0, 0, 0, 1, 0, 0),
(25, 100024, 0, 0, 0, 1, 0, 0),
(26, 100025, 0, 0, 0, 0, 0, 0),
(27, 100026, 0, 0, 0, 1, 0, 0),
(28, 100027, 0, 0, 0, 1, 0, 0),
(29, 100028, 0, 0, 0, 1, 0, 0),
(30, 100029, 0, 0, 0, 1, 0, 0),
(31, 100030, 0, 0, 0, 1, 0, 0),
(32, 100031, 0, 0, 0, 1, 0, 0),
(33, 100032, 0, 0, 0, 1, 0, 0),
(34, 100033, 0, 0, 0, 1, 0, 0),
(35, 100034, 0, 0, 0, 1, 0, 0),
(36, 100035, 0, 0, 0, 1, 0, 0),
(37, 100036, 0, 0, 0, 1, 0, 0),
(38, 100037, 0, 0, 0, 1, 0, 0),
(39, 100038, 0, 0, 0, 1, 0, 0),
(40, 100039, 0, 0, 0, 1, 0, 0),
(41, 100040, 0, 0, 0, 1, 0, 0),
(42, 100041, 0, 0, 0, 1, 0, 0),
(43, 100042, 0, 0, 0, 1, 0, 0),
(44, 100043, 0, 0, 0, 1, 0, 0),
(45, 100044, 0, 0, 0, 1, 0, 0),
(46, 100045, 0, 0, 0, 1, 0, 0),
(47, 100046, 0, 0, 0, 1, 0, 0),
(48, 100047, 0, 0, 0, 1, 0, 0),
(49, 100048, 0, 0, 0, 1, 0, 0),
(50, 100049, 0, 0, 0, 1, 0, 0),
(51, 100050, 0, 0, 0, 1, 0, 0),
(52, 100051, 0, 0, 0, 1, 0, 0),
(53, 100052, 0, 0, 0, 1, 0, 0),
(54, 100053, 0, 0, 0, 0, 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `student_sick_leave`
--

CREATE TABLE `student_sick_leave` (
  `id` int(11) NOT NULL,
  `student_id` int(6) UNSIGNED ZEROFILL DEFAULT NULL,
  `date_from` date NOT NULL,
  `date_until` date NOT NULL,
  `status` enum('E','UE','K','S') NOT NULL COMMENT 'E: entschuldigt (excused), UE: unentschuldigt (unexcused), K: Krankheit (sick), S: Sonstiges (other)',
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `student_sick_leave`
--

INSERT INTO `student_sick_leave` (`id`, `student_id`, `date_from`, `date_until`, `status`, `description`, `created_at`, `updated_at`) VALUES
(2, 100001, '2025-05-22', '2025-05-24', 'UE', 'test', '2025-05-22 05:41:41', '2025-05-22 05:41:41'),
(3, 100005, '2025-06-17', '2025-06-17', 'K', 'test', '2025-06-17 10:58:30', '2025-06-17 10:58:30');

-- --------------------------------------------------------

--
-- Table structure for table `success_placement_statistics`
--

CREATE TABLE `success_placement_statistics` (
  `id` int(11) NOT NULL,
  `year` int(11) NOT NULL,
  `measures_id` int(11) NOT NULL,
  `pdf_url` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `success_placement_statistics`
--

INSERT INTO `success_placement_statistics` (`id`, `year`, `measures_id`, `pdf_url`, `description`, `created_at`) VALUES
(4, 2025, 1, 'https://testapi.meteorinfotech.com/uploads/erfolgsstatistik_1751609366.pdf', 'Success and Placement Statistics for IHK geprüfte Sicherheitsfachkraft gem. §34a GewO (2025)', '2025-07-04 06:09:42');

-- --------------------------------------------------------

--
-- Table structure for table `trainings`
--

CREATE TABLE `trainings` (
  `id` int(11) NOT NULL,
  `user_id` int(6) UNSIGNED ZEROFILL NOT NULL,
  `topic` varchar(255) NOT NULL,
  `quarter` enum('Q1','Q2','Q3','Q4') NOT NULL,
  `year` year(4) NOT NULL,
  `actual_date` date NOT NULL,
  `participation` varchar(255) DEFAULT NULL,
  `reason_non_participation` text DEFAULT NULL,
  `effectiveness` text DEFAULT NULL,
  `feedback_assessment` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `trainings`
--

INSERT INTO `trainings` (`id`, `user_id`, `topic`, `quarter`, `year`, `actual_date`, `participation`, `reason_non_participation`, `effectiveness`, `feedback_assessment`, `created_at`, `updated_at`) VALUES
(8, 000005, 'Leadership Training', 'Q2', '0000', '2025-06-09', 'yes', 'Completed', 'Completed', 'Completed', '2025-06-09 07:05:47', '2025-06-09 07:05:47');

-- --------------------------------------------------------

--
-- Table structure for table `training_reports`
--

CREATE TABLE `training_reports` (
  `id` int(11) NOT NULL,
  `nr` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `ue` varchar(255) NOT NULL,
  `signature` longtext NOT NULL,
  `lecturer_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `training_reports`
--

INSERT INTO `training_reports` (`id`, `nr`, `title`, `description`, `ue`, `signature`, `lecturer_id`, `created_at`, `updated_at`) VALUES
(1, 2, 'dgdfh', 'ferfe', '3', 'data:image/png;base64,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', 112201, '2025-06-02 15:26:15', '2025-06-02 15:26:15'),
(2, 2, 'dgdfh', 'sas', '3', 'data:image/png;base64,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', 112204, '2025-06-16 09:22:30', '2025-06-16 09:22:30');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `according_to_paragraph`
--
ALTER TABLE `according_to_paragraph`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `options` (`options`);

--
-- Indexes for table `admin_users`
--
ALTER TABLE `admin_users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `assessment_links`
--
ALTER TABLE `assessment_links`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `token` (`token`);

--
-- Indexes for table `assessment_options`
--
ALTER TABLE `assessment_options`
  ADD PRIMARY KEY (`id`),
  ADD KEY `question_id` (`question_id`);

--
-- Indexes for table `assessment_questions`
--
ALTER TABLE `assessment_questions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `assessment_responses`
--
ALTER TABLE `assessment_responses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `assessment_link_id` (`assessment_link_id`),
  ADD KEY `question_id` (`question_id`),
  ADD KEY `selected_option_id` (`selected_option_id`);

--
-- Indexes for table `attendance_list`
--
ALTER TABLE `attendance_list`
  ADD PRIMARY KEY (`id`),
  ADD KEY `student_id` (`student_id`);

--
-- Indexes for table `authorities`
--
ALTER TABLE `authorities`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_authorities_student_id` (`student_id`);

--
-- Indexes for table `bridge_days`
--
ALTER TABLE `bridge_days`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_bridge_date` (`bridge_days`,`date`);

--
-- Indexes for table `certificate_of_absence`
--
ALTER TABLE `certificate_of_absence`
  ADD PRIMARY KEY (`id`),
  ADD KEY `student_id` (`student_id`);

--
-- Indexes for table `course_feedback`
--
ALTER TABLE `course_feedback`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_id` (`student_id`),
  ADD KEY `idx_course_id` (`course_id`);

--
-- Indexes for table `end_assessment`
--
ALTER TABLE `end_assessment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `student_id` (`student_id`),
  ADD KEY `lecturer_id` (`lecturer_id`);

--
-- Indexes for table `end_assessment_pdfs`
--
ALTER TABLE `end_assessment_pdfs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `assessment_id` (`assessment_id`),
  ADD KEY `student_id` (`student_id`),
  ADD KEY `lecturer_id` (`lecturer_id`);

--
-- Indexes for table `examinations`
--
ALTER TABLE `examinations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `feedback_evaluations`
--
ALTER TABLE `feedback_evaluations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `measures_id` (`measures_id`);

--
-- Indexes for table `form_links`
--
ALTER TABLE `form_links`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `token` (`token`);

--
-- Indexes for table `form_responses`
--
ALTER TABLE `form_responses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `form_link_id` (`form_link_id`);

--
-- Indexes for table `interim_assessment`
--
ALTER TABLE `interim_assessment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `student_id` (`student_id`),
  ADD KEY `lecturer_id` (`lecturer_id`);

--
-- Indexes for table `interim_assessment_pdfs`
--
ALTER TABLE `interim_assessment_pdfs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `assessment_id` (`assessment_id`),
  ADD KEY `student_id` (`student_id`),
  ADD KEY `lecturer_id` (`lecturer_id`);

--
-- Indexes for table `intermediaries`
--
ALTER TABLE `intermediaries`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `invoice_recipients`
--
ALTER TABLE `invoice_recipients`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_invoice_recipients_student_id` (`student_id`);

--
-- Indexes for table `invoice_reminders`
--
ALTER TABLE `invoice_reminders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `invoice_id` (`invoice_id`);

--
-- Indexes for table `lecturers`
--
ALTER TABLE `lecturers`
  ADD PRIMARY KEY (`lecturer_id`),
  ADD KEY `fk_lecturer_measures` (`measures_id`);

--
-- Indexes for table `lecturer_documents`
--
ALTER TABLE `lecturer_documents`
  ADD PRIMARY KEY (`id`),
  ADD KEY `lecturer_id` (`lecturer_id`);

--
-- Indexes for table `measurements`
--
ALTER TABLE `measurements`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `measures_zoom_links`
--
ALTER TABLE `measures_zoom_links`
  ADD PRIMARY KEY (`id`),
  ADD KEY `measures_id` (`measures_id`),
  ADD KEY `lecturer_id` (`lecturer_id`);

--
-- Indexes for table `monthly_reports`
--
ALTER TABLE `monthly_reports`
  ADD PRIMARY KEY (`id`),
  ADD KEY `lecturer_id` (`lecturer_id`);

--
-- Indexes for table `positions`
--
ALTER TABLE `positions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `qualification_matrix`
--
ALTER TABLE `qualification_matrix`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `qualifizierungsplan`
--
ALTER TABLE `qualifizierungsplan`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `result_sheet_pdf`
--
ALTER TABLE `result_sheet_pdf`
  ADD PRIMARY KEY (`id`),
  ADD KEY `student_id` (`student_id`);

--
-- Indexes for table `student`
--
ALTER TABLE `student`
  ADD PRIMARY KEY (`student_id`),
  ADD KEY `fk_student_measures` (`measures_id`);

--
-- Indexes for table `student_attendance`
--
ALTER TABLE `student_attendance`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_student_date` (`student_id`,`attendance_date`),
  ADD KEY `idx_student_attendance_date` (`attendance_date`),
  ADD KEY `idx_student_attendance_student` (`student_id`);

--
-- Indexes for table `student_contact_details`
--
ALTER TABLE `student_contact_details`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_student_contact_details_student_id` (`student_id`);

--
-- Indexes for table `student_exam_dates`
--
ALTER TABLE `student_exam_dates`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_student_exam_dates_student_id` (`student_id`);

--
-- Indexes for table `student_invoices`
--
ALTER TABLE `student_invoices`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `student_reports`
--
ALTER TABLE `student_reports`
  ADD PRIMARY KEY (`id`),
  ADD KEY `student_id` (`student_id`);

--
-- Indexes for table `student_result_sheet`
--
ALTER TABLE `student_result_sheet`
  ADD PRIMARY KEY (`id`),
  ADD KEY `student_id` (`student_id`);

--
-- Indexes for table `student_settings`
--
ALTER TABLE `student_settings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_student_settings_student_id` (`student_id`);

--
-- Indexes for table `student_sick_leave`
--
ALTER TABLE `student_sick_leave`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_student_sick_leave_student_id` (`student_id`);

--
-- Indexes for table `success_placement_statistics`
--
ALTER TABLE `success_placement_statistics`
  ADD PRIMARY KEY (`id`),
  ADD KEY `measures_id` (`measures_id`);

--
-- Indexes for table `trainings`
--
ALTER TABLE `trainings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `training_reports`
--
ALTER TABLE `training_reports`
  ADD PRIMARY KEY (`id`),
  ADD KEY `lecturer_id` (`lecturer_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `according_to_paragraph`
--
ALTER TABLE `according_to_paragraph`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `admin_users`
--
ALTER TABLE `admin_users`
  MODIFY `id` int(6) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `assessment_links`
--
ALTER TABLE `assessment_links`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `assessment_options`
--
ALTER TABLE `assessment_options`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

--
-- AUTO_INCREMENT for table `assessment_questions`
--
ALTER TABLE `assessment_questions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `assessment_responses`
--
ALTER TABLE `assessment_responses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=163;

--
-- AUTO_INCREMENT for table `attendance_list`
--
ALTER TABLE `attendance_list`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `authorities`
--
ALTER TABLE `authorities`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=54;

--
-- AUTO_INCREMENT for table `bridge_days`
--
ALTER TABLE `bridge_days`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `certificate_of_absence`
--
ALTER TABLE `certificate_of_absence`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `course_feedback`
--
ALTER TABLE `course_feedback`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `end_assessment`
--
ALTER TABLE `end_assessment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `end_assessment_pdfs`
--
ALTER TABLE `end_assessment_pdfs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `examinations`
--
ALTER TABLE `examinations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `feedback_evaluations`
--
ALTER TABLE `feedback_evaluations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `form_links`
--
ALTER TABLE `form_links`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `form_responses`
--
ALTER TABLE `form_responses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `interim_assessment`
--
ALTER TABLE `interim_assessment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `interim_assessment_pdfs`
--
ALTER TABLE `interim_assessment_pdfs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `intermediaries`
--
ALTER TABLE `intermediaries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `invoice_recipients`
--
ALTER TABLE `invoice_recipients`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

--
-- AUTO_INCREMENT for table `invoice_reminders`
--
ALTER TABLE `invoice_reminders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `lecturers`
--
ALTER TABLE `lecturers`
  MODIFY `lecturer_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=112208;

--
-- AUTO_INCREMENT for table `lecturer_documents`
--
ALTER TABLE `lecturer_documents`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `measurements`
--
ALTER TABLE `measurements`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `measures_zoom_links`
--
ALTER TABLE `measures_zoom_links`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `monthly_reports`
--
ALTER TABLE `monthly_reports`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `positions`
--
ALTER TABLE `positions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

--
-- AUTO_INCREMENT for table `qualification_matrix`
--
ALTER TABLE `qualification_matrix`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `qualifizierungsplan`
--
ALTER TABLE `qualifizierungsplan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `result_sheet_pdf`
--
ALTER TABLE `result_sheet_pdf`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `student`
--
ALTER TABLE `student`
  MODIFY `student_id` int(6) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=100054;

--
-- AUTO_INCREMENT for table `student_attendance`
--
ALTER TABLE `student_attendance`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `student_contact_details`
--
ALTER TABLE `student_contact_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=55;

--
-- AUTO_INCREMENT for table `student_exam_dates`
--
ALTER TABLE `student_exam_dates`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `student_invoices`
--
ALTER TABLE `student_invoices`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `student_reports`
--
ALTER TABLE `student_reports`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `student_result_sheet`
--
ALTER TABLE `student_result_sheet`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `student_settings`
--
ALTER TABLE `student_settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=55;

--
-- AUTO_INCREMENT for table `student_sick_leave`
--
ALTER TABLE `student_sick_leave`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `success_placement_statistics`
--
ALTER TABLE `success_placement_statistics`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `trainings`
--
ALTER TABLE `trainings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `training_reports`
--
ALTER TABLE `training_reports`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `attendance_list`
--
ALTER TABLE `attendance_list`
  ADD CONSTRAINT `attendance_list_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`);

--
-- Constraints for table `authorities`
--
ALTER TABLE `authorities`
  ADD CONSTRAINT `fk_authorities_student_id` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`) ON DELETE CASCADE;

--
-- Constraints for table `certificate_of_absence`
--
ALTER TABLE `certificate_of_absence`
  ADD CONSTRAINT `certificate_of_absence_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`);

--
-- Constraints for table `end_assessment`
--
ALTER TABLE `end_assessment`
  ADD CONSTRAINT `end_assessment_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`),
  ADD CONSTRAINT `end_assessment_ibfk_2` FOREIGN KEY (`lecturer_id`) REFERENCES `lecturers` (`lecturer_id`);

--
-- Constraints for table `end_assessment_pdfs`
--
ALTER TABLE `end_assessment_pdfs`
  ADD CONSTRAINT `end_assessment_pdfs_ibfk_1` FOREIGN KEY (`assessment_id`) REFERENCES `end_assessment` (`id`),
  ADD CONSTRAINT `end_assessment_pdfs_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`),
  ADD CONSTRAINT `end_assessment_pdfs_ibfk_3` FOREIGN KEY (`lecturer_id`) REFERENCES `lecturers` (`lecturer_id`);

--
-- Constraints for table `feedback_evaluations`
--
ALTER TABLE `feedback_evaluations`
  ADD CONSTRAINT `feedback_evaluations_ibfk_1` FOREIGN KEY (`measures_id`) REFERENCES `measurements` (`id`);

--
-- Constraints for table `form_responses`
--
ALTER TABLE `form_responses`
  ADD CONSTRAINT `form_responses_ibfk_1` FOREIGN KEY (`form_link_id`) REFERENCES `form_links` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `interim_assessment`
--
ALTER TABLE `interim_assessment`
  ADD CONSTRAINT `interim_assessment_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`),
  ADD CONSTRAINT `interim_assessment_ibfk_2` FOREIGN KEY (`lecturer_id`) REFERENCES `lecturers` (`lecturer_id`);

--
-- Constraints for table `interim_assessment_pdfs`
--
ALTER TABLE `interim_assessment_pdfs`
  ADD CONSTRAINT `interim_assessment_pdfs_ibfk_1` FOREIGN KEY (`assessment_id`) REFERENCES `interim_assessment` (`id`),
  ADD CONSTRAINT `interim_assessment_pdfs_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`),
  ADD CONSTRAINT `interim_assessment_pdfs_ibfk_3` FOREIGN KEY (`lecturer_id`) REFERENCES `lecturers` (`lecturer_id`);

--
-- Constraints for table `invoice_recipients`
--
ALTER TABLE `invoice_recipients`
  ADD CONSTRAINT `fk_invoice_recipients_student_id` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`) ON DELETE CASCADE;

--
-- Constraints for table `lecturers`
--
ALTER TABLE `lecturers`
  ADD CONSTRAINT `fk_lecturer_measures` FOREIGN KEY (`measures_id`) REFERENCES `measurements` (`id`);

--
-- Constraints for table `lecturer_documents`
--
ALTER TABLE `lecturer_documents`
  ADD CONSTRAINT `lecturer_documents_ibfk_1` FOREIGN KEY (`lecturer_id`) REFERENCES `lecturers` (`lecturer_id`);

--
-- Constraints for table `measures_zoom_links`
--
ALTER TABLE `measures_zoom_links`
  ADD CONSTRAINT `measures_zoom_links_ibfk_1` FOREIGN KEY (`measures_id`) REFERENCES `measurements` (`id`),
  ADD CONSTRAINT `measures_zoom_links_ibfk_2` FOREIGN KEY (`lecturer_id`) REFERENCES `lecturers` (`lecturer_id`);

--
-- Constraints for table `monthly_reports`
--
ALTER TABLE `monthly_reports`
  ADD CONSTRAINT `monthly_reports_ibfk_1` FOREIGN KEY (`lecturer_id`) REFERENCES `lecturers` (`lecturer_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `positions`
--
ALTER TABLE `positions`
  ADD CONSTRAINT `positions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `admin_users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `result_sheet_pdf`
--
ALTER TABLE `result_sheet_pdf`
  ADD CONSTRAINT `result_sheet_pdf_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`) ON DELETE CASCADE;

--
-- Constraints for table `student`
--
ALTER TABLE `student`
  ADD CONSTRAINT `fk_student_measures` FOREIGN KEY (`measures_id`) REFERENCES `measurements` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `student_attendance`
--
ALTER TABLE `student_attendance`
  ADD CONSTRAINT `student_attendance_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`);

--
-- Constraints for table `student_contact_details`
--
ALTER TABLE `student_contact_details`
  ADD CONSTRAINT `fk_student_contact_details_student_id` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`) ON DELETE CASCADE;

--
-- Constraints for table `student_exam_dates`
--
ALTER TABLE `student_exam_dates`
  ADD CONSTRAINT `fk_student_exam_dates_student_id` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`) ON DELETE CASCADE;

--
-- Constraints for table `student_reports`
--
ALTER TABLE `student_reports`
  ADD CONSTRAINT `student_reports_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`) ON DELETE CASCADE;

--
-- Constraints for table `student_result_sheet`
--
ALTER TABLE `student_result_sheet`
  ADD CONSTRAINT `student_result_sheet_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`);

--
-- Constraints for table `student_settings`
--
ALTER TABLE `student_settings`
  ADD CONSTRAINT `fk_student_settings_student_id` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`) ON DELETE CASCADE;

--
-- Constraints for table `student_sick_leave`
--
ALTER TABLE `student_sick_leave`
  ADD CONSTRAINT `fk_student_sick_leave_student_id` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`) ON DELETE CASCADE;

--
-- Constraints for table `success_placement_statistics`
--
ALTER TABLE `success_placement_statistics`
  ADD CONSTRAINT `success_placement_statistics_ibfk_1` FOREIGN KEY (`measures_id`) REFERENCES `measurements` (`id`);

--
-- Constraints for table `trainings`
--
ALTER TABLE `trainings`
  ADD CONSTRAINT `trainings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `admin_users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `training_reports`
--
ALTER TABLE `training_reports`
  ADD CONSTRAINT `training_reports_ibfk_1` FOREIGN KEY (`lecturer_id`) REFERENCES `lecturers` (`lecturer_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
