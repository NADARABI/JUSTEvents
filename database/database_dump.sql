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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `approvals`
--

LOCK TABLES `approvals` WRITE;
/*!40000 ALTER TABLE `approvals` DISABLE KEYS */;
INSERT INTO `approvals` VALUES (1,1,'Room Booking',1,'Approved','All good, approved.','2025-06-08 21:20:51'),(2,1,'Room Booking',2,'Rejected','Lab not available at requested time.','2025-06-08 21:20:51');
/*!40000 ALTER TABLE `approvals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `buildings`
--

DROP TABLE IF EXISTS `buildings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `buildings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `map_coordinates` json DEFAULT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `buildings`
--

LOCK TABLES `buildings` WRITE;
/*!40000 ALTER TABLE `buildings` DISABLE KEYS */;
INSERT INTO `buildings` VALUES (1,'Engineering Complex','North Zone','{\"x\": 32.49695, \"y\": 35.9913}',32.49695000,35.99130000),(2,'Medical Sciences Center','Central Zone','{\"x\": 32.4974, \"y\": 35.9921}',32.49740000,35.99210000),(3,'Library & Study Halls','Main Square','{\"x\": 32.4982, \"y\": 35.9907}',32.49820000,35.99070000),(4,'Computer Science Block','East Sector','{\"x\": 32.4961, \"y\": 35.9931}',32.49610000,35.99310000);
/*!40000 ALTER TABLE `buildings` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event_rsvps`
--

LOCK TABLES `event_rsvps` WRITE;
/*!40000 ALTER TABLE `event_rsvps` DISABLE KEYS */;
INSERT INTO `event_rsvps` VALUES (1,6,1,'Going','2025-06-08 21:08:24'),(2,7,2,'Going','2025-06-08 21:08:24'),(3,8,3,'Not Going','2025-06-08 21:08:24'),(4,5,1,'Going','2025-06-08 21:20:30'),(5,6,1,'Going','2025-06-08 21:20:30'),(6,7,2,'Not Going','2025-06-08 21:20:30'),(7,5,3,'Going','2025-06-08 21:20:30'),(8,6,5,'Going','2025-06-08 21:20:30'),(9,7,6,'Going','2025-06-08 21:20:30');
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
  `status` enum('Pending','Approved','Rejected','Expired') DEFAULT 'Pending',
  `image_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `organizer_id` (`organizer_id`),
  KEY `fk_event_venue` (`venue_id`),
  CONSTRAINT `events_ibfk_1` FOREIGN KEY (`organizer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_event_venue` FOREIGN KEY (`venue_id`) REFERENCES `rooms` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
INSERT INTO `events` VALUES (1,'AI in Healthcare','Explore how AI is transforming modern medicine.','Technology','2025-06-10','11:00:00',3,3,'Approved','https://example.com/img1.jpg'),(2,'Embedded Systems Workshop','Hands-on training on microcontrollers.','Engineering','2025-06-12','13:30:00',5,1,'Approved','https://example.com/img2.jpg'),(3,'Open Discussion: Climate Change','Student debate on climate challenges.','Environment','2025-06-15','10:00:00',4,4,'Pending','https://example.com/img3.jpg'),(4,'Resume Writing Tips','Career center session on crafting strong resumes.','Career','2025-06-09','14:00:00',2,6,'Approved','https://example.com/img4.jpg'),(5,'Tech Talk: AI & Future','Join us for a deep dive into AI advancements.','Tech','2025-06-12','14:00:00',2,1,'Approved','ai_event.jpg'),(6,'Social Gathering: Pizza Night','Meet and mingle over pizza!','Social','2025-06-11','18:30:00',3,3,'Approved','pizza_night.jpg'),(7,'Health Awareness Session','Learn about mental wellness and stress relief.','Health','2025-06-14','11:00:00',4,4,'Approved','health_talk.jpg'),(8,'Rejected Tech Seminar','This event was not approved due to scheduling conflict.','Tech','2025-06-10','10:00:00',2,1,'Rejected','rejected.jpg'),(9,'Workshop: Resume Building','Improve your CV with expert tips.','Workshop','2025-05-30','13:00:00',3,2,'Expired','resume_workshop.jpg'),(10,'Sports Day 2025','Annual sports competitions and fun!','Sports','2025-06-02','09:00:00',4,5,'Expired','sports_day.jpg'),(11,'Academic Talk: Quantum Physics','Explore quantum theory fundamentals.','Academic','2025-06-16','15:00:00',2,1,'Pending','quantum_talk.jpg');
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
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_edited` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `event_id` (`event_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `feedback_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE,
  CONSTRAINT `feedback_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `feedback_chk_1` CHECK ((`rating` between 1 and 5))
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feedback`
--

LOCK TABLES `feedback` WRITE;
/*!40000 ALTER TABLE `feedback` DISABLE KEYS */;
INSERT INTO `feedback` VALUES (1,1,6,'Very informative session with great insights.',5,'2025-06-08 21:08:17','2025-06-08 21:08:17',0),(2,2,7,'Enjoyed the hands-on part but room was small.',4,'2025-06-08 21:08:17','2025-06-08 21:08:17',0),(3,1,8,'Would like more examples in future.',3,'2025-06-08 21:08:17','2025-06-08 21:08:17',0),(4,1,5,'Amazing talk, very informative!',5,'2025-06-08 21:20:37','2025-06-08 21:20:37',0),(5,1,6,'Well organized but could improve visuals.',4,'2025-06-08 21:20:37','2025-06-08 21:20:37',0),(6,3,5,'Loved the stress relief tips.',5,'2025-06-08 21:20:37','2025-06-08 21:20:37',0),(7,5,6,'Useful tips on resume writing.',4,'2025-06-08 21:20:37','2025-06-08 21:20:37',1),(8,6,7,'Had a great time at Sports Day!',5,'2025-06-08 21:20:37','2025-06-08 21:20:37',0);
/*!40000 ALTER TABLE `feedback` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `map_coordinates`
--

DROP TABLE IF EXISTS `map_coordinates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `map_coordinates` (
  `id` int NOT NULL AUTO_INCREMENT,
  `building_id` int NOT NULL,
  `x` float NOT NULL,
  `y` float NOT NULL,
  `level` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_map_building` (`building_id`),
  CONSTRAINT `fk_map_building` FOREIGN KEY (`building_id`) REFERENCES `buildings` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `map_coordinates`
--

LOCK TABLES `map_coordinates` WRITE;
/*!40000 ALTER TABLE `map_coordinates` DISABLE KEYS */;
/*!40000 ALTER TABLE `map_coordinates` ENABLE KEYS */;
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
  `type` enum('info','success','warning','error') DEFAULT 'info',
  `is_read` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (1,5,'Your booking for ENG101 has been approved.','success',0,'2025-06-08 21:20:58'),(2,6,'Your lab booking was rejected due to time conflict.','error',0,'2025-06-08 21:20:58'),(3,7,'Reminder: Upcoming Study Session in MED301.','info',0,'2025-06-08 21:20:58'),(4,5,'New event added: Quantum Physics Talk.','info',1,'2025-06-08 21:20:58'),(5,6,'You have successfully RSVPed for Health Awareness Session.','success',1,'2025-06-08 21:20:58');
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `refresh_tokens`
--

LOCK TABLES `refresh_tokens` WRITE;
/*!40000 ALTER TABLE `refresh_tokens` DISABLE KEYS */;
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
  `purpose` varchar(255) NOT NULL,
  `start_time` datetime NOT NULL,
  `end_time` datetime NOT NULL,
  `status` enum('Pending','Approved','Rejected') DEFAULT 'Pending',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `room_id` (`room_id`),
  CONSTRAINT `room_bookings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `room_bookings_ibfk_2` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `room_bookings`
--

LOCK TABLES `room_bookings` WRITE;
/*!40000 ALTER TABLE `room_bookings` DISABLE KEYS */;
INSERT INTO `room_bookings` VALUES (1,6,2,'Lab exam for embedded systems','2025-06-10 09:00:00','2025-06-10 11:00:00','Approved','2025-06-09 00:08:11','2025-06-09 00:08:11'),(2,7,6,'Weekly committee meeting','2025-06-11 15:00:00','2025-06-11 16:30:00','Pending','2025-06-09 00:08:11','2025-06-09 00:08:11'),(3,8,3,'Study group session','2025-06-12 12:00:00','2025-06-12 14:00:00','Rejected','2025-06-09 00:08:11','2025-06-09 00:08:11'),(4,5,1,'Team Project Meeting','2025-06-15 10:00:00','2025-06-15 12:00:00','Approved','2025-06-09 00:20:45','2025-06-09 00:20:45'),(5,6,2,'Circuit Lab Practice','2025-06-16 14:00:00','2025-06-16 16:00:00','Rejected','2025-06-09 00:20:45','2025-06-09 00:20:45'),(6,7,3,'Study Group Session','2025-06-17 09:00:00','2025-06-17 11:00:00','Pending','2025-06-09 00:20:45','2025-06-09 00:20:45');
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
  `capacity` int NOT NULL,
  `type` enum('Study Room','Lab','Classroom','Meeting Room') DEFAULT 'Study Room',
  `status` enum('Available','Unavailable') DEFAULT 'Available',
  `description` text,
  `building_id` int DEFAULT NULL,
  `floor` int DEFAULT NULL,
  `map_coordinates` json DEFAULT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_room_building` (`building_id`),
  CONSTRAINT `fk_room_building` FOREIGN KEY (`building_id`) REFERENCES `buildings` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rooms`
--

LOCK TABLES `rooms` WRITE;
/*!40000 ALTER TABLE `rooms` DISABLE KEYS */;
INSERT INTO `rooms` VALUES (1,'ENG101',120,'Classroom','Available','Main lecture hall for engineering freshmen.',1,1,'{\"x\": 32.49697, \"y\": 35.99135}',32.49697000,35.99135000),(2,'ENG202',40,'Lab','Unavailable','Circuits & electronics laboratory.',1,2,'{\"x\": 32.49692, \"y\": 35.99128}',32.49692000,35.99128000),(3,'MED301',15,'Study Room','Available','Quiet study room for group work.',2,3,'{\"x\": 32.49745, \"y\": 35.99215}',32.49745000,35.99215000),(4,'LIB-Reading',60,'Classroom','Available','Reading room in the central library.',3,1,'{\"x\": 32.4983, \"y\": 35.99065}',32.49830000,35.99065000),(5,'CS-LAB1',30,'Lab','Available','Intro to programming computer lab.',4,2,'{\"x\": 32.49615, \"y\": 35.99315}',32.49615000,35.99315000),(6,'CS-Meeting',12,'Meeting Room','Unavailable','Department committee meeting space.',4,1,'{\"x\": 32.49605, \"y\": 35.99305}',32.49605000,35.99305000);
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
INSERT INTO `saved_events` VALUES (1,6,1,'2025-06-08 21:08:30'),(2,6,2,'2025-06-08 21:08:30'),(3,7,3,'2025-06-08 21:08:30');
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
) ENGINE=InnoDB AUTO_INCREMENT=92 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Nada Samara','nada@college.just.edu.jo','$2b$10$xyz123student1','Student',NULL,1,NULL,'Local',NULL,'2025-04-28 04:37:59',NULL,NULL,NULL),(2,'Ahmad Alhashash','ahmad@college.just.edu.jo','$2b$10$xyz123student2','Student',NULL,1,NULL,'Local',NULL,'2025-04-28 04:37:59',NULL,NULL,NULL),(3,'Amer Rabi','amer@college.just.edu.jo','$2b$10$xyz123student3','Student',NULL,1,NULL,'Local',NULL,'2025-04-28 04:37:59',NULL,NULL,NULL),(4,'Lara Allouh','lara@college.just.edu.jo','$2b$10$xyz123student4','Student',NULL,1,NULL,'Local',NULL,'2025-04-28 04:37:59',NULL,NULL,NULL),(5,'Mohammad Naim','mohammad@college.just.edu.jo','$2b$10$xyz123student5','Student',NULL,1,NULL,'Local',NULL,'2025-04-28 04:37:59',NULL,NULL,NULL),(6,'Engineering Club','engclub@just.edu.jo',NULL,'Organizer',NULL,1,NULL,'Google',NULL,'2025-04-28 04:37:59',NULL,NULL,NULL),(7,'Medical Club','medclub@just.edu.jo',NULL,'Organizer',NULL,1,NULL,'Google',NULL,'2025-04-28 04:37:59',NULL,NULL,NULL),(8,'Dean Office','deanoffice@just.edu.jo',NULL,'Campus Admin',NULL,1,NULL,'Microsoft',NULL,'2025-04-28 04:37:59',NULL,NULL,NULL),(9,'Library Admin','libraryadmin@just.edu.jo',NULL,'Campus Admin',NULL,1,NULL,'Microsoft',NULL,'2025-04-28 04:37:59',NULL,NULL,NULL),(10,'External Visitor','visitor1@gmail.com',NULL,'Visitor',NULL,1,NULL,'Local',NULL,'2025-04-28 04:37:59',NULL,NULL,NULL),(11,'System Super Admin','admin@just.edu.jo','$2b$10$xyz123admin','System Admin',NULL,1,NULL,'Local',NULL,'2025-04-28 04:37:59',NULL,NULL,NULL),(36,'Nada Samara','nrabee02@gmail.com','$2b$10$z9Pp3DIH88RKfzcQma3mIevdzr./Hy6UH.rFhXDhTdI3VbT1La3ZG','Organizer','Organizer',1,NULL,'Local',NULL,'2025-04-29 21:36:59',NULL,NULL,'2025-05-08 22:58:20'),(38,'Organizer Dashboard','orgdash@just.edu.jo','$2b$10$zVd4rEhDvrGbUKHzIlxvH.Bho7yJMScCFIA1gOgeDZeD5iwRoeCGi','Organizer',NULL,1,NULL,'Local',NULL,'2025-05-08 21:40:40',NULL,NULL,'2025-06-02 09:33:46'),(75,'Nada','nadaCampus@gmail.com','$2b$10$qms1A70DYtMAnUdQEiOnNeburJ6o56DhS143AWxjhYrESh0nv22yi','Campus Admin','Campus Admin',1,NULL,'Local',NULL,'2025-05-09 13:51:19',NULL,NULL,'2025-06-02 09:30:55'),(76,'Ali','ali@gmail.com','$2b$10$98koLIHBM2TIu.MRPLXG4ufeJeCdfTrp9NcaiYYIBke3B9qK03LQ6','Student',NULL,1,NULL,'Local',NULL,'2025-05-09 23:26:07',NULL,NULL,'2025-05-11 07:36:55'),(85,'Nada Samara','nrsamara20@gmail.com',NULL,'Visitor',NULL,1,NULL,'Google',NULL,'2025-05-16 19:52:49',NULL,NULL,NULL),(87,'Nada Rabee Samara','nrsamara20@cit.just.edu.jo',NULL,'Student',NULL,1,NULL,'Microsoft',NULL,'2025-05-16 20:19:00',NULL,NULL,'2025-06-02 09:25:27'),(88,'Visitor','nrabee20@gmail.com','$2b$10$hKlSonFotP7E6o.XWGLR6OCMTDS4S/Kp9TJ97fi/Oxc4HSIHbof6m','System Admin','Visitor',1,NULL,'Local',NULL,'2025-05-26 07:12:35',NULL,NULL,'2025-06-02 09:30:19'),(89,'Lara Test','lara@example.com','$2a$10$7QHkXtJG...','Visitor',NULL,1,NULL,'Local',NULL,'2025-05-26 18:44:38',NULL,NULL,NULL),(91,'ghina_student','rabighena10@gmail.com','$2b$10$P4qi9XvCOv/8ALcjDKX22.85iyGfXoWtF.LTb0C17sirXk/6OMLUW','Visitor',NULL,1,NULL,'Local',NULL,'2025-05-30 21:44:17',NULL,NULL,'2025-05-30 21:47:41');
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

-- Dump completed on 2025-06-09  0:21:25
