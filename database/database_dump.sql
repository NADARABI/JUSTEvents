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
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `approvals`
--

LOCK TABLES `approvals` WRITE;
/*!40000 ALTER TABLE `approvals` DISABLE KEYS */;
INSERT INTO `approvals` VALUES (1,8,'Room Booking',1,'Approved','Booking looks good.','2025-04-28 04:45:35'),(2,8,'Room Booking',2,'Approved','Approved for Hackathon prep.','2025-04-28 04:45:35'),(3,9,'Event',1,'Approved','AI Seminar meets university goals.','2025-04-28 04:45:35');
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
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event_rsvps`
--

LOCK TABLES `event_rsvps` WRITE;
/*!40000 ALTER TABLE `event_rsvps` DISABLE KEYS */;
INSERT INTO `event_rsvps` VALUES (1,1,1,'Going','2025-04-28 04:42:52'),(2,2,2,'Going','2025-04-28 04:42:52'),(3,3,4,'Going','2025-04-28 04:42:52'),(4,5,3,'Going','2025-04-28 04:42:52');
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
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
INSERT INTO `events` VALUES (1,'AI in Healthcare Seminar','A seminar discussing the future of AI in medical fields.','Academic','2025-05-20','10:00:00',6,4,'Approved',NULL),(2,'Engineering Hackathon','48-hour coding competition for engineering students.','Academic','2025-05-25','09:00:00',6,1,'Approved',NULL),(3,'Medical Awareness Campaign','Campaign to raise awareness about common diseases.','Social','2025-05-22','11:00:00',7,5,'Approved',NULL),(4,'Student Clubs Fair','An event where new students can meet and join campus clubs.','Social','2025-05-30','13:00:00',7,7,'Approved',NULL),(5,'Career Development Workshop','Workshop on CV writing and interview preparation.','Workshop','2025-06-01','14:00:00',6,2,'Approved',NULL);
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
INSERT INTO `feedback` VALUES (1,1,1,'Very informative seminar, loved it!',5,'2025-04-28 04:45:20'),(2,2,2,'Hackathon was very competitive and fun!',4,'2025-04-28 04:45:20'),(3,4,3,'Nice opportunity to meet clubs.',5,'2025-04-28 04:45:20');
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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `refresh_tokens`
--

DROP TABLE IF EXISTS `refresh_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `refresh_tokens` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `token` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `refresh_tokens_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `refresh_tokens`
--

LOCK TABLES `refresh_tokens` WRITE;
/*!40000 ALTER TABLE `refresh_tokens` DISABLE KEYS */;
INSERT INTO `refresh_tokens` VALUES (1,1,'token_nada','2025-04-28 04:41:57'),(2,2,'token_ahmad','2025-04-28 04:41:57'),(3,3,'token_amer','2025-04-28 04:41:57'),(4,4,'token_lara','2025-04-28 04:41:57'),(5,5,'token_mohammad','2025-04-28 04:41:57'),(6,6,'token_engclub','2025-04-28 04:41:57'),(7,7,'token_medclub','2025-04-28 04:41:57'),(8,8,'token_dean','2025-04-28 04:41:57'),(9,9,'token_library','2025-04-28 04:41:57'),(10,10,'token_visitor','2025-04-28 04:41:57'),(11,11,'token_admin','2025-04-28 04:41:57');
/*!40000 ALTER TABLE `refresh_tokens` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `room_bookings`
--

LOCK TABLES `room_bookings` WRITE;
/*!40000 ALTER TABLE `room_bookings` DISABLE KEYS */;
INSERT INTO `room_bookings` VALUES (1,1,7,'2025-05-21 12:00:00','2025-05-21 14:00:00','Approved'),(2,2,8,'2025-05-22 10:00:00','2025-05-22 12:00:00','Approved'),(3,3,5,'2025-05-23 13:00:00','2025-05-23 15:00:00','Approved');
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
INSERT INTO `rooms` VALUES (1,'E201','Engineering Building A',50,'Available'),(2,'E301','Engineering Building A',40,'Available'),(3,'E401','Engineering Building A',100,'Available'),(4,'M101','Medical Building B',60,'Available'),(5,'M201','Medical Building B',35,'Available'),(6,'M301','Medical Building B',45,'Available'),(7,'Library Study Room 1','Main Library',20,'Available'),(8,'Library Study Room 2','Main Library',25,'Available');
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
INSERT INTO `saved_events` VALUES (1,1,2,'2025-04-28 04:42:07'),(2,2,1,'2025-04-28 04:42:07'),(3,3,4,'2025-04-28 04:42:07');
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
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Nada Samara','nada@college.just.edu.jo','$2b$10$xyz123student1','Student',NULL,1,NULL,'Local',NULL,'2025-04-28 04:37:59',NULL,NULL,NULL),(2,'Ahmad Alhashash','ahmad@college.just.edu.jo','$2b$10$xyz123student2','Student',NULL,1,NULL,'Local',NULL,'2025-04-28 04:37:59',NULL,NULL,NULL),(3,'Amer Rabi','amer@college.just.edu.jo','$2b$10$xyz123student3','Student',NULL,1,NULL,'Local',NULL,'2025-04-28 04:37:59',NULL,NULL,NULL),(4,'Lara Allouh','lara@college.just.edu.jo','$2b$10$xyz123student4','Student',NULL,1,NULL,'Local',NULL,'2025-04-28 04:37:59',NULL,NULL,NULL),(5,'Mohammad Naim','mohammad@college.just.edu.jo','$2b$10$xyz123student5','Student',NULL,1,NULL,'Local',NULL,'2025-04-28 04:37:59',NULL,NULL,NULL),(6,'Engineering Club','engclub@just.edu.jo',NULL,'Organizer',NULL,1,NULL,'Google',NULL,'2025-04-28 04:37:59',NULL,NULL,NULL),(7,'Medical Club','medclub@just.edu.jo',NULL,'Organizer',NULL,1,NULL,'Google',NULL,'2025-04-28 04:37:59',NULL,NULL,NULL),(8,'Dean Office','deanoffice@just.edu.jo',NULL,'Campus Admin',NULL,1,NULL,'Microsoft',NULL,'2025-04-28 04:37:59',NULL,NULL,NULL),(9,'Library Admin','libraryadmin@just.edu.jo',NULL,'Campus Admin',NULL,1,NULL,'Microsoft',NULL,'2025-04-28 04:37:59',NULL,NULL,NULL),(10,'External Visitor','visitor1@gmail.com',NULL,'Visitor',NULL,1,NULL,'Local',NULL,'2025-04-28 04:37:59',NULL,NULL,NULL),(11,'System Super Admin','admin@just.edu.jo','$2b$10$xyz123admin','System Admin',NULL,1,NULL,'Local',NULL,'2025-04-28 04:37:59',NULL,NULL,NULL);
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

-- Dump completed on 2025-04-28  7:46:48
