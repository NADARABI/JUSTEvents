-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: justevents_db
-- ------------------------------------------------------
-- Server version	8.0.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `approvals`
--

DROP TABLE IF EXISTS `approvals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `approvals` (
  `id` int NOT NULL AUTO_INCREMENT,
  `admin_id` int DEFAULT NULL,
  `entity_type` enum('Event','Room Booking') NOT NULL,
  `entity_id` int NOT NULL,
  `status` enum('Pending','Approved','Rejected') DEFAULT 'Pending',
  `decision_reason` text,
  `reviewed_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `admin_id` (`admin_id`),
  CONSTRAINT `approvals_ibfk_1` FOREIGN KEY (`admin_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `approvals`
--

LOCK TABLES `approvals` WRITE;
/*!40000 ALTER TABLE `approvals` DISABLE KEYS */;
INSERT INTO `approvals` VALUES (1,NULL,'Event',1,'Approved',NULL,NULL),(2,NULL,'Event',2,'Approved',NULL,NULL),(3,NULL,'Event',3,'Approved',NULL,NULL),(4,NULL,'Event',4,'Approved',NULL,NULL),(5,4,'Room Booking',1,'Approved',NULL,NULL),(6,NULL,'Event',5,'Pending',NULL,NULL);
/*!40000 ALTER TABLE `approvals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `event_rsvps`
--

DROP TABLE IF EXISTS `event_rsvps`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `event_rsvps` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `event_id` int NOT NULL,
  `status` enum('Going','Not Going') NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `event_id` (`event_id`),
  CONSTRAINT `event_rsvps_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `event_rsvps_ibfk_2` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event_rsvps`
--

LOCK TABLES `event_rsvps` WRITE;
/*!40000 ALTER TABLE `event_rsvps` DISABLE KEYS */;
INSERT INTO `event_rsvps` VALUES (1,1,1,'Going','2025-04-24 08:03:24'),(2,2,2,'Going','2025-04-24 08:03:24'),(3,3,3,'Going','2025-04-24 08:03:24'),(4,2,4,'Not Going','2025-04-24 08:03:24');
/*!40000 ALTER TABLE `event_rsvps` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `events` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `category` varchar(100) DEFAULT 'General',
  `date` date NOT NULL,
  `time` time NOT NULL,
  `organizer_id` int NOT NULL,
  `venue_id` int NOT NULL,
  `status` enum('Pending','Approved','Rejected') DEFAULT 'Pending',
  `image_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `organizer_id` (`organizer_id`),
  CONSTRAINT `events_ibfk_1` FOREIGN KEY (`organizer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
INSERT INTO `events` VALUES (1,'AI in Engineering','Explore how Artificial Intelligence is being used in electrical and mechanical systems.','Technology','2025-05-28','11:00:00',5,1,'Approved',NULL),(2,'Web Dev 101','Introductory hands-on session for HTML/CSS and JS for all students.','Technology','2025-05-30','13:00:00',6,9,'Approved',NULL),(3,'ChatGPT in Education','Panel discussion on how LLMs are transforming student workflows and classroom experience.','Seminar','2025-06-01','14:00:00',6,13,'Approved',NULL),(4,'Engineering Day Expo','Annual showcase of graduation projects and student startups.','Exhibition','2025-06-05','10:00:00',5,3,'Approved',NULL),(5,'AI Workshop','Intro to Artificial Intelligence and its campus applications.','General','2025-05-15','10:30:00',9,1,'Pending',NULL);
/*!40000 ALTER TABLE `events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `feedback`
--

DROP TABLE IF EXISTS `feedback`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `feedback` (
  `id` int NOT NULL AUTO_INCREMENT,
  `event_id` int NOT NULL,
  `user_id` int NOT NULL,
  `comment` text NOT NULL,
  `rating` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `event_id` (`event_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `feedback_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE,
  CONSTRAINT `feedback_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `feedback_chk_1` CHECK ((`rating` between 1 and 5))
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feedback`
--

LOCK TABLES `feedback` WRITE;
/*!40000 ALTER TABLE `feedback` DISABLE KEYS */;
INSERT INTO `feedback` VALUES (1,1,1,'Amazing session! Loved the AI applications.',5,'2025-04-24 08:03:32'),(2,2,2,'Good intro for beginners in web development.',4,'2025-04-24 08:03:32'),(3,3,3,'Very informative. I learned about ChatGPT?s role in education.',5,'2025-04-24 08:03:32');
/*!40000 ALTER TABLE `feedback` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (1,1,'Your RSVP to AI in Engineering is confirmed.',0,'2025-04-24 08:04:16'),(2,2,'Thanks for attending Web Dev 101!',0,'2025-04-24 08:04:16'),(3,3,'Your feedback on ChatGPT in Education was submitted.',0,'2025-04-24 08:04:16');
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `room_bookings`
--

DROP TABLE IF EXISTS `room_bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `room_bookings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `room_id` int NOT NULL,
  `start_time` datetime NOT NULL,
  `end_time` datetime NOT NULL,
  `status` enum('Pending','Approved','Rejected') DEFAULT 'Pending',
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `room_id` (`room_id`),
  CONSTRAINT `room_bookings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `room_bookings_ibfk_2` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `room_bookings`
--

LOCK TABLES `room_bookings` WRITE;
/*!40000 ALTER TABLE `room_bookings` DISABLE KEYS */;
INSERT INTO `room_bookings` VALUES (1,1,13,'2025-06-10 10:00:00','2025-06-10 12:00:00','Approved'),(2,2,10,'2025-06-11 14:00:00','2025-06-11 16:00:00','Pending');
/*!40000 ALTER TABLE `room_bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rooms`
--

DROP TABLE IF EXISTS `rooms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rooms` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `building` varchar(100) NOT NULL,
  `capacity` int NOT NULL,
  `status` enum('Available','Booked') DEFAULT 'Available',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rooms`
--

LOCK TABLES `rooms` WRITE;
/*!40000 ALTER TABLE `rooms` DISABLE KEYS */;
INSERT INTO `rooms` VALUES (1,'E1-201','Engineering Building E1',60,'Available'),(2,'E1-202','Engineering Building E1',50,'Available'),(3,'E2-101','Engineering Building E2',55,'Available'),(4,'E2-Lab 1','Engineering Building E2',35,'Available'),(5,'E3-102','Engineering Building E3',70,'Available'),(6,'E3-Lab 3','Engineering Building E3',30,'Available'),(7,'E4-001','Engineering Building E4',80,'Available'),(8,'E4-Lab 2','Engineering Building E4',40,'Available'),(9,'C4-Lab 1','Computer Center C4',30,'Available'),(10,'C4-Lab 2','Computer Center C4',35,'Available'),(11,'C4-Lab 3','Computer Center C4',25,'Available'),(12,'L2-101','Lecture Hall L2',120,'Available'),(13,'L2-102','Lecture Hall L2',100,'Available'),(14,'Library Seminar Room','Main Library',25,'Available'),(15,'Library Hall A','Main Library',80,'Available');
/*!40000 ALTER TABLE `rooms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `saved_events`
--

DROP TABLE IF EXISTS `saved_events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `saved_events` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `event_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_save` (`user_id`,`event_id`),
  KEY `event_id` (`event_id`),
  CONSTRAINT `saved_events_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `saved_events_ibfk_2` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `saved_events`
--

LOCK TABLES `saved_events` WRITE;
/*!40000 ALTER TABLE `saved_events` DISABLE KEYS */;
INSERT INTO `saved_events` VALUES (1,1,2,'2025-04-24 08:03:40'),(2,2,3,'2025-04-24 08:03:40'),(3,3,1,'2025-04-24 08:03:40');
/*!40000 ALTER TABLE `saved_events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) DEFAULT NULL,
  `role` enum('System Admin','Campus Admin','Organizer','Student','Visitor','Pending') NOT NULL DEFAULT 'Pending',
  `requested_role` enum('Campus Admin','Organizer','Visitor') DEFAULT NULL,
  `is_verified` tinyint(1) DEFAULT '0',
  `verification_code` varchar(10) DEFAULT NULL,
  `provider` enum('Local','Google','Microsoft') DEFAULT 'Local',
  `attachment` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_token_expiry` datetime DEFAULT NULL,
  `last_login` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Nada Rabee Samara','nrsamara20@cit.just.edu.jo',NULL,'Student',NULL,1,NULL,'Microsoft',NULL,'2025-04-23 20:45:22',NULL,NULL,NULL),(2,'AMER MUTLEQ RABI','amrabi21@cit.just.edu.jo',NULL,'Student',NULL,1,NULL,'Microsoft',NULL,'2025-04-23 20:50:45',NULL,NULL,NULL),(3,'Nada Samara','nrsamara20@gmail.com',NULL,'Pending',NULL,1,NULL,'Google',NULL,'2025-04-24 07:41:37',NULL,NULL,NULL),(4,'Dr. Rami Qasem','rami.qasem@just.edu.jo','$2b$10$js3hd/8oKTyxXYuDz1W5j.6YNQGZ8HaTuAQUFRlGGRS6kAnvKhJ6a','Campus Admin',NULL,1,NULL,'Local',NULL,'2025-04-24 07:54:27',NULL,NULL,NULL),(5,'IEEE JUST','ieee@just.edu.jo','$2b$10$js3hd/8oKTyxXYuDz1W5j.6YNQGZ8HaTuAQUFRlGGRS6kAnvKhJ6a','Organizer',NULL,1,NULL,'Local',NULL,'2025-04-24 07:54:27',NULL,NULL,NULL),(6,'Tech Club','tech.club@just.edu.jo','$2b$10$js3hd/8oKTyxXYuDz1W5j.6YNQGZ8HaTuAQUFRlGGRS6kAnvKhJ6a','Organizer',NULL,1,NULL,'Local',NULL,'2025-04-24 07:54:27',NULL,NULL,NULL),(7,'Nada Samara','admin@just.edu.jo','$2b$10$js3hd/8oKTyxXYuDz1W5j.6YNQGZ8HaTuAQUFRlGGRS6kAnvKhJ6a','System Admin',NULL,1,NULL,'Local',NULL,'2025-04-24 07:54:27',NULL,NULL,NULL),(8,'Jana Saba','jana.saba@gmail.com','$2b$10$js3hd/8oKTyxXYuDz1W5j.6YNQGZ8HaTuAQUFRlGGRS6kAnvKhJ6a','Visitor',NULL,1,NULL,'Local',NULL,'2025-04-24 07:54:28',NULL,NULL,NULL),(9,'Nada Samara','nada@gmail.com','$2b$10$.sTwovIGIyhdt9X42FySWeNyAT3JNAk0USrRq0xn87siMR4FboK4.','Organizer','Organizer',1,NULL,'Local',NULL,'2025-04-24 08:06:29',NULL,NULL,'2025-04-24 08:11:55');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-24 19:31:40
