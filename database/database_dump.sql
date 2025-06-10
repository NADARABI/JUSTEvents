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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `approvals`
--

LOCK TABLES `approvals` WRITE;
/*!40000 ALTER TABLE `approvals` DISABLE KEYS */;
INSERT INTO `approvals` VALUES (1,1,'Room Booking',1,'Approved','All good, approved.','2025-06-08 21:20:51'),(2,1,'Room Booking',2,'Rejected','Lab not available at requested time.','2025-06-08 21:20:51'),(3,NULL,'Event',12,'Pending',NULL,NULL),(4,NULL,'Event',13,'Pending',NULL,NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event_rsvps`
--

LOCK TABLES `event_rsvps` WRITE;
/*!40000 ALTER TABLE `event_rsvps` DISABLE KEYS */;
INSERT INTO `event_rsvps` VALUES (1,6,1,'Going','2025-06-08 21:08:24'),(2,7,2,'Going','2025-06-08 21:08:24'),(3,8,3,'Not Going','2025-06-08 21:08:24'),(4,5,1,'Going','2025-06-08 21:20:30'),(5,6,1,'Going','2025-06-08 21:20:30'),(6,7,2,'Not Going','2025-06-08 21:20:30'),(7,5,3,'Going','2025-06-08 21:20:30'),(8,6,5,'Going','2025-06-08 21:20:30'),(9,7,6,'Going','2025-06-08 21:20:30'),(10,87,2,'Not Going','2025-06-09 14:31:45'),(31,6,2,'Going','2025-06-01 06:00:00'),(32,6,4,'Going','2025-06-03 07:00:00'),(33,6,5,'Not Going','2025-06-05 08:00:00'),(34,7,1,'Going','2025-06-02 09:00:00'),(35,7,6,'Going','2025-06-06 10:00:00'),(36,7,10,'Not Going','2025-06-07 11:00:00'),(37,87,5,'Going','2025-06-02 13:00:00'),(38,87,6,'Going','2025-06-04 14:00:00'),(39,87,10,'Going','2025-06-05 15:00:00'),(40,87,7,'Not Going','2025-06-08 16:00:00'),(41,87,1,'Going','2025-06-10 10:23:10'),(42,8,1,'Going','2025-06-10 10:23:10'),(43,6,2,'Going','2025-06-10 10:23:10'),(44,5,2,'Not Going','2025-06-10 10:23:10'),(45,5,5,'Going','2025-06-10 10:23:10'),(46,7,5,'Not Going','2025-06-10 10:23:10'),(47,8,6,'Going','2025-06-10 10:23:10'),(48,87,6,'Going','2025-06-10 10:23:10'),(49,6,9,'Going','2025-06-10 10:23:10'),(50,5,9,'Not Going','2025-06-10 10:23:10');
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
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
INSERT INTO `events` VALUES (1,'AI in Healthcare','Explore how AI is transforming modern medicine.','Technology','2025-06-10','11:00:00',3,3,'Approved',NULL),(2,'Embedded Systems Workshop','Hands-on training on microcontrollers.','Engineering','2025-06-12','13:30:00',5,1,'Approved',NULL),(3,'Open Discussion: Climate Change','Student debate on climate challenges.','Environment','2025-06-15','10:00:00',4,4,'Pending',NULL),(4,'Resume Writing Tips','Career center session on crafting strong resumes.','Career','2025-06-09','14:00:00',2,6,'Expired',NULL),(5,'Tech Talk: AI & Future','Join us for a deep dive into AI advancements.','Tech','2025-06-12','14:00:00',2,1,'Approved',NULL),(6,'Social Gathering: Pizza Night','Meet and mingle over pizza!','Social','2025-06-11','18:30:00',3,3,'Approved',NULL),(7,'Health Awareness Session','Learn about mental wellness and stress relief.','Health','2025-06-14','11:00:00',4,4,'Approved',NULL),(8,'Rejected Tech Seminar','This event was not approved due to scheduling conflict.','Tech','2025-06-10','10:00:00',2,1,'Rejected',NULL),(9,'Workshop: Resume Building','Improve your CV with expert tips.','Workshop','2025-05-30','13:00:00',3,2,'Expired',NULL),(10,'Sports Day 2025','Annual sports competitions and fun!','Sports','2025-06-02','09:00:00',4,5,'Expired',NULL),(11,'Academic Talk: Quantum Physics','Explore quantum theory fundamentals.','Academic','2025-06-16','15:00:00',2,1,'Pending',NULL),(12,'Event ','Desc','General','2025-06-13','17:29:00',38,3,'Pending','event-1749479409232.jpg'),(13,'Test Event','Test Description','General','2025-06-20','16:34:00',38,1,'Pending',NULL),(14,'Expired Workshop: AI Basics','Intro workshop that concluded last week.','Tech','2025-06-01','10:00:00',3,1,'Expired',NULL),(15,'Expired Social Mixer','Casual networking for students.','Social','2025-05-28','18:00:00',6,3,'Expired',NULL),(16,'Expired Career Fair','Annual job fair with companies.','Career','2025-05-25','09:00:00',2,4,'Expired',NULL),(17,'Expired Hackathon','24h coding event concluded.','Technology','2025-05-30','10:00:00',7,2,'Expired',NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feedback`
--

LOCK TABLES `feedback` WRITE;
/*!40000 ALTER TABLE `feedback` DISABLE KEYS */;
INSERT INTO `feedback` VALUES (1,1,6,'Very informative session with great insights.',5,'2025-06-08 21:08:17','2025-06-08 21:08:17',0),(2,2,7,'Enjoyed the hands-on part but room was small.',4,'2025-06-08 21:08:17','2025-06-08 21:08:17',0),(3,1,8,'Would like more examples in future.',3,'2025-06-08 21:08:17','2025-06-08 21:08:17',0),(4,1,5,'Amazing talk, very informative!',5,'2025-06-08 21:20:37','2025-06-08 21:20:37',0),(5,1,6,'Well organized but could improve visuals.',4,'2025-06-08 21:20:37','2025-06-08 21:20:37',0),(6,3,5,'Loved the stress relief tips.',5,'2025-06-08 21:20:37','2025-06-08 21:20:37',0),(7,5,6,'Useful tips on resume writing.',4,'2025-06-08 21:20:37','2025-06-08 21:20:37',1),(8,6,7,'Had a great time at Sports Day!',5,'2025-06-08 21:20:37','2025-06-08 21:20:37',0),(9,5,6,'Fantastic session on future tech trends!',5,'2025-06-05 12:00:00','2025-06-05 12:00:00',0),(10,5,7,'Great speaker, learned a lot.',4,'2025-06-06 07:30:00','2025-06-06 07:30:00',0),(11,6,87,'Pizza Night was so fun!',5,'2025-06-06 16:00:00','2025-06-06 16:00:00',0),(12,1,87,'AI in Healthcare was insightful!',4,'2025-06-07 08:30:00','2025-06-07 08:30:00',0),(13,10,5,'Loved the sports events!',5,'2025-06-08 09:00:00','2025-06-08 09:00:00',0),(14,1,6,'Follow-up on AI topic was helpful.',4,'2025-06-09 11:00:00','2025-06-09 11:00:00',1),(15,1,5,'Loved the practical examples!',5,'2025-06-10 10:21:55','2025-06-10 10:21:55',0),(16,1,6,'Informative but a bit long.',4,'2025-06-10 10:21:55','2025-06-10 10:21:55',0),(17,1,7,'Excellent speaker and visuals!',5,'2025-06-10 10:21:55','2025-06-10 10:21:55',0),(18,2,8,'Great hands-on workshop.',5,'2025-06-10 10:21:55','2025-06-10 10:21:55',0),(19,2,5,'Wish we had more time for Q&A.',4,'2025-06-10 10:21:55','2025-06-10 10:21:55',0),(20,5,6,'Engaging and forward-looking.',4,'2025-06-10 10:21:55','2025-06-10 10:21:55',1),(21,6,7,'Delicious pizza! Loved it.',5,'2025-06-10 10:21:55','2025-06-10 10:21:55',0),(22,6,87,'Best social event so far!',5,'2025-06-10 10:21:55','2025-06-10 10:21:55',0),(23,7,8,'Very calming and helpful session.',4,'2025-06-10 10:21:55','2025-06-10 10:21:55',0),(24,9,5,'Basic resume tips, nothing new.',3,'2025-06-10 10:21:55','2025-06-10 10:21:55',0);
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
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (1,5,'Your booking for ENG101 has been approved.','success',0,'2025-06-08 21:20:58'),(2,6,'Your lab booking was rejected due to time conflict.','error',0,'2025-06-08 21:20:58'),(3,7,'Reminder: Upcoming Study Session in MED301.','info',0,'2025-06-08 21:20:58'),(4,5,'New event added: Quantum Physics Talk.','info',1,'2025-06-08 21:20:58'),(5,6,'You have successfully RSVPed for Health Awareness Session.','success',1,'2025-06-08 21:20:58'),(6,5,'A user has RSVP\'d to your event \"Embedded Systems Workshop\".','info',0,'2025-06-09 14:31:45'),(7,87,'You successfully RSVPed to \"Embedded Systems Workshop\".','success',1,'2025-06-09 14:31:45'),(8,87,'You canceled your RSVP for \"Embedded Systems Workshop\".','warning',1,'2025-06-09 14:31:52'),(9,5,'A user canceled their RSVP for \"Embedded Systems Workshop\".','warning',0,'2025-06-09 14:31:52'),(10,8,'New booking request from undefined for MED301 on 2025-06-09T17:33.','info',0,'2025-06-09 14:33:46'),(11,9,'New booking request from undefined for MED301 on 2025-06-09T17:33.','info',0,'2025-06-09 14:33:46'),(12,75,'New booking request from undefined for MED301 on 2025-06-09T17:33.','info',0,'2025-06-09 14:33:46'),(13,87,'Your room booking was approved.','success',0,'2025-06-09 14:35:01'),(14,11,'New role request: Organizer from undefined.','info',0,'2025-06-09 23:12:27'),(15,88,'New role request: Organizer from undefined.','info',1,'2025-06-09 23:12:27'),(16,88,'New pending user: nada has requested Campus Admin role.','info',1,'2025-06-09 23:33:18'),(17,88,'New event titled \"Test Event\" is pending approval.','info',1,'2025-06-09 23:35:02'),(18,75,'New booking request from Organizer Dashboard for ENG101 on 2025-06-11T04:35.','info',0,'2025-06-09 23:35:57'),(19,75,'New booking request from Organizer Dashboard for ENG101 on 2025-06-11T14:00:00.','info',0,'2025-06-09 23:37:42'),(20,75,'New booking request from Organizer Dashboard for ENG101 on 2025-06-11T10:00:00.','info',0,'2025-06-09 23:38:15'),(21,75,'New booking request from Organizer Dashboard for ENG101 on 2025-06-11T11:00:00.','info',0,'2025-06-09 23:38:24'),(22,75,'New booking request from Organizer Dashboard for ENG101 on 2025-06-11T12:00:00.','info',0,'2025-06-09 23:38:49'),(23,75,'New booking request from Organizer Dashboard for ENG101 on 2025-06-11T13:00:00.','info',0,'2025-06-09 23:39:00'),(24,88,'User Organizer Dashboard} submitted 6 booking requests in the past hour.','warning',0,'2025-06-09 23:47:59'),(25,75,'New booking request from Organizer Dashboard for ENG101 on 2025-06-11T09:00:00.','info',0,'2025-06-09 23:47:59'),(26,88,'User Organizer Dashboard submitted 7 \n booking requests in the past hour.','warning',0,'2025-06-09 23:50:06'),(27,75,'New booking request from Organizer Dashboard for ENG101 on 2025-06-12T09:00:00.','info',0,'2025-06-09 23:50:06'),(28,88,'New role request: Organizer from unknown user.','info',0,'2025-06-10 09:44:28'),(29,88,'New role request: Organizer from unknown user.','info',0,'2025-06-10 12:09:47');
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
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `refresh_tokens`
--

LOCK TABLES `refresh_tokens` WRITE;
/*!40000 ALTER TABLE `refresh_tokens` DISABLE KEYS */;
INSERT INTO `refresh_tokens` VALUES (1,75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoibmFkYUNhbXB1c0BnbWFpbC5jb20iLCJpYXQiOjE3NDk0MjE5MjgsImV4cCI6MTc0OTQyMTk0M30.R0mdvd9d9LtQ5Msp0rrQlyZTAheJeE3Hdh5ETnNsi7Q','2025-06-08 22:32:08'),(2,75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoibmFkYUNhbXB1c0BnbWFpbC5jb20iLCJpYXQiOjE3NDk0MjE5NjgsImV4cCI6MTc0OTQyMTk4M30.7Z2O57eKevZTU50rtySWlkXoe98vpKGD7r9S6Qcfqe4','2025-06-08 22:32:48'),(3,75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoibmFkYUNhbXB1c0BnbWFpbC5jb20iLCJpYXQiOjE3NDk0MjIwODUsImV4cCI6MTc0OTQyMjEwMH0.ivciXsTY27KLctnqH7UDT9WRSk0Ufd5twx_NTtj-Hfg','2025-06-08 22:34:45'),(4,75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoibmFkYUNhbXB1c0BnbWFpbC5jb20iLCJpYXQiOjE3NDk0MjIxNTMsImV4cCI6MTc0OTQyMjE2OH0.979bXJUMc5zruzZxiWCT1RJB5eN4ujhtf1gHByf-Vm4','2025-06-08 22:35:53'),(5,75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoibmFkYUNhbXB1c0BnbWFpbC5jb20iLCJpYXQiOjE3NDk0MjIxODQsImV4cCI6MTc0OTQyMjE5OX0.0Bs2IHqjjUT8KfQtjG_Jt4j0RAsjrBsKgVt984Bn1bo','2025-06-08 22:36:24'),(6,75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoibmFkYUNhbXB1c0BnbWFpbC5jb20iLCJpYXQiOjE3NDk0MjIyMzEsImV4cCI6MTc0OTQyMjI0Nn0.eNEQ3tPJqRN119XiZZZOF0oJzE_X4RWXXlsd2m2Pngg','2025-06-08 22:37:11'),(7,75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoibmFkYUNhbXB1c0BnbWFpbC5jb20iLCJpYXQiOjE3NDk0MjUwNTIsImV4cCI6MTc0OTQyNTA2N30.o3Vibae1jMRPXtiRiXwt4n3x3L_6B5MlmxyxNC5YBOA','2025-06-08 23:24:12'),(8,75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoibmFkYUNhbXB1c0BnbWFpbC5jb20iLCJpYXQiOjE3NDk0NTgwMTUsImV4cCI6MTc0OTQ1ODAzMH0.JkHUagfkTq7dRqqJVXg9XB0Y57a_l-idhFSltvECCQk','2025-06-09 08:33:35'),(9,75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoibmFkYUNhbXB1c0BnbWFpbC5jb20iLCJpYXQiOjE3NDk0NTgxMTIsImV4cCI6MTc0OTQ1ODEyN30.xExlihD5xE1ilbZXFX7ZDstJkaetNJknV_E5I6f_MF8','2025-06-09 08:35:12'),(10,75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoibmFkYUNhbXB1c0BnbWFpbC5jb20iLCJpYXQiOjE3NDk0NTgyODAsImV4cCI6MTc0OTQ1ODI5NX0.t0IEhpCXrEZSgjvw3fD_Ez7XqqZ8WMnnIYJhGYXhlT8','2025-06-09 08:38:00'),(11,75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoibmFkYUNhbXB1c0BnbWFpbC5jb20iLCJpYXQiOjE3NDk0NTg0MjEsImV4cCI6MTc0OTQ1ODQzNn0.WsftY18ACBhBOUl1I1RlONLex2-M38FyzWI8MVvxXCo','2025-06-09 08:40:21'),(12,75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoibmFkYUNhbXB1c0BnbWFpbC5jb20iLCJpYXQiOjE3NDk0NTg1NTYsImV4cCI6MTc1MDA2MzM1Nn0.FomF9K7ZEhj0YY76ujuxNaSPP_gUbieX9YkenH0zkb0','2025-06-09 08:42:36'),(13,75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoibmFkYUNhbXB1c0BnbWFpbC5jb20iLCJpYXQiOjE3NDk0NTg5MjUsImV4cCI6MTc1MDA2MzcyNX0.xeW48JedY1LYk0tWF_9m0xEeOUeWC0WUCcUXbQKXTMo','2025-06-09 08:48:45'),(14,75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoibmFkYUNhbXB1c0BnbWFpbC5jb20iLCJpYXQiOjE3NDk0NTkxMzcsImV4cCI6MTc1MDA2MzkzN30.0V_b9sBXDalab_D7YxymlQMfs5J1wFQOQTuTgxmDo3k','2025-06-09 08:52:17'),(15,75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoibmFkYUNhbXB1c0BnbWFpbC5jb20iLCJpYXQiOjE3NDk0NTk4MzcsImV4cCI6MTc1MDA2NDYzN30.fKS2hy9AlS0KuXbXDgWV13y3atbOezJi-t79-xV_jLM','2025-06-09 09:03:57'),(16,75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoibmFkYUNhbXB1c0BnbWFpbC5jb20iLCJpYXQiOjE3NDk0NTk4NTEsImV4cCI6MTc1MDA2NDY1MX0.-KCIndjArxFe_XJV_gtDX5gDPX941yRxbqwYYDeivbc','2025-06-09 09:04:11'),(17,75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoibmFkYUNhbXB1c0BnbWFpbC5jb20iLCJpYXQiOjE3NDk0NjAwMzMsImV4cCI6MTc1MDA2NDgzM30.fs1VYBYKLJU7Ro5fkfIiGoUQxbUAF8Ihf0zLeDHo7lk','2025-06-09 09:07:13'),(18,75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoibmFkYUNhbXB1c0BnbWFpbC5jb20iLCJpYXQiOjE3NDk0NjA0ODEsImV4cCI6MTc1MDA2NTI4MX0.QSPvNTZgHZMsDVUN9SBb2yRRM4ijQbPfKsCgDYaMf0w','2025-06-09 09:14:41'),(19,88,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODgsImVtYWlsIjoibnJhYmVlMjBAZ21haWwuY29tIiwiaWF0IjoxNzQ5NDY0NjQ3LCJleHAiOjE3NTAwNjk0NDd9.fvKZnTFvGK43bPQysNCmIq5yXznPHXzFvM_BpdiGpkA','2025-06-09 10:24:07'),(20,88,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODgsImVtYWlsIjoibnJhYmVlMjBAZ21haWwuY29tIiwiaWF0IjoxNzQ5NDY2MDE1LCJleHAiOjE3NTAwNzA4MTV9.gjk6bvAiWMszexF7o3lfKqoSKCMykHsTxNC5HZ8crCE','2025-06-09 10:46:55'),(21,88,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODgsImVtYWlsIjoibnJhYmVlMjBAZ21haWwuY29tIiwiaWF0IjoxNzQ5NDY2MTA3LCJleHAiOjE3NTAwNzA5MDd9.b65082oYGcEuFFEiA43E04sfWGeHeXBjusoyN2FChB8','2025-06-09 10:48:27'),(23,88,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODgsImVtYWlsIjoibnJhYmVlMjBAZ21haWwuY29tIiwiaWF0IjoxNzQ5NDY2Mzc1LCJleHAiOjE3NTAwNzExNzV9.G8X7-mKOkj5edSYUAImNjt4Z0xyUCwsD-FxgQ9WZO7k','2025-06-09 10:52:55'),(24,88,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODgsImVtYWlsIjoibnJhYmVlMjBAZ21haWwuY29tIiwiaWF0IjoxNzQ5NDY2NjE3LCJleHAiOjE3NTAwNzE0MTd9.SLTjDBFyKAlVk5AWd9XLuxuj6oQLPlNukw0HcFNsDho','2025-06-09 10:56:57'),(25,93,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OTMsImVtYWlsIjoicmFiaWdoZW5hMTBAZ21haWwuY29tIiwiaWF0IjoxNzQ5NDY2NjgxLCJleHAiOjE3NTAwNzE0ODF9.XG3N-xrpXeSIRiEAxNWdDoVp32b5vX4_WSle5LCOVcE','2025-06-09 10:58:01'),(26,88,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODgsImVtYWlsIjoibnJhYmVlMjBAZ21haWwuY29tIiwiaWF0IjoxNzQ5NDY2Njk5LCJleHAiOjE3NTAwNzE0OTl9.sAKWclBxWT6Khwh__mLb3CLr4WBlsq2HKO1UfmmE654','2025-06-09 10:58:19'),(27,38,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzgsImVtYWlsIjoib3JnZGFzaEBqdXN0LmVkdS5qbyIsImlhdCI6MTc0OTQ3OTMxMywiZXhwIjoxNzUwMDg0MTEzfQ.Clvdk_do0iTmSdswwHKSdu6mJA7DnxeurEndmmL164s','2025-06-09 14:28:33'),(28,75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoibmFkYUNhbXB1c0BnbWFpbC5jb20iLCJpYXQiOjE3NDk0Nzk2NzgsImV4cCI6MTc1MDA4NDQ3OH0.SiILEzLTnv-Y22IYWd86IAj2jaPLBWy0zkwSQE-qBho','2025-06-09 14:34:38'),(29,93,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OTMsImVtYWlsIjoicmFiaWdoZW5hMTBAZ21haWwuY29tIiwiaWF0IjoxNzQ5NTExNDUzLCJleHAiOjE3NTAxMTYyNTN9.NjgXMYAWrh8bXAIb6YoVv7o6dCYWtWo71M8lEkPuGyY','2025-06-09 23:24:13'),(30,93,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OTMsImVtYWlsIjoicmFiaWdoZW5hMTBAZ21haWwuY29tIiwiaWF0IjoxNzQ5NTExODY4LCJleHAiOjE3NTAxMTY2Njh9.tV5ZxzJtlSxcTEmP5EDmMJOD0jO1zw7P6bxCwGqjV1A','2025-06-09 23:31:08'),(31,93,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OTMsImVtYWlsIjoicmFiaWdoZW5hMTBAZ21haWwuY29tIiwiaWF0IjoxNzQ5NTExOTIzLCJleHAiOjE3NTAxMTY3MjN9.j2djADwj_2ryp3etvWUAbDuyxNU9vhEWRz4MBxD9eYE','2025-06-09 23:32:03'),(32,94,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OTQsImVtYWlsIjoibnJhYmVlMDJAZ21haWwuY29tIiwiaWF0IjoxNzQ5NTEyMDMwLCJleHAiOjE3NTAxMTY4MzB9.SfnkDeSkuAD6oaDAcgIYXU-vRQ9Yst_3eWH3Lut2_RY','2025-06-09 23:33:50'),(33,38,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzgsImVtYWlsIjoib3JnZGFzaEBqdXN0LmVkdS5qbyIsImlhdCI6MTc0OTUxMjA0NiwiZXhwIjoxNzUwMTE2ODQ2fQ.XkkvzUEcfLMX4e3Ij4NrwKu3qoynneWOZqs8BiUCKMY','2025-06-09 23:34:06'),(34,88,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODgsImVtYWlsIjoibnJhYmVlMjBAZ21haWwuY29tIiwiaWF0IjoxNzQ5NTEyMzc0LCJleHAiOjE3NTAxMTcxNzR9.sZ6XNJmN79lqvWkjg81BJS_k0quR3Pf0gcAvhDgq8M0','2025-06-09 23:39:34'),(35,88,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODgsImVtYWlsIjoibnJhYmVlMjBAZ21haWwuY29tIiwiaWF0IjoxNzQ5NTEyNTc0LCJleHAiOjE3NTAxMTczNzR9.bwGUlaxirvHgwzHpZH5Zl28yDacxgjkUnPnT6Dclm24','2025-06-09 23:42:54'),(36,88,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODgsImVtYWlsIjoibnJhYmVlMjBAZ21haWwuY29tIiwiaWF0IjoxNzQ5NTEyNzI5LCJleHAiOjE3NTAxMTc1Mjl9.jvwyCsLtfEU5N_Po_A_MLnLbEFbn1merzvAlVp0eF7I','2025-06-09 23:45:29'),(37,88,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODgsImVtYWlsIjoibnJhYmVlMjBAZ21haWwuY29tIiwiaWF0IjoxNzQ5NTEyODAzLCJleHAiOjE3NTAxMTc2MDN9.zepZcF57xNtzOy_05spTDA8BL023gW9lY9S3Jq4xY_0','2025-06-09 23:46:43'),(38,38,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzgsImVtYWlsIjoib3JnZGFzaEBqdXN0LmVkdS5qbyIsImlhdCI6MTc0OTUxMjg2NywiZXhwIjoxNzUwMTE3NjY3fQ.CIfqfxbU8PxegC8Uaa19bgJdGaIKoD6Qfs6wbhNgBgE','2025-06-09 23:47:47'),(39,88,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODgsImVtYWlsIjoibnJhYmVlMjBAZ21haWwuY29tIiwiaWF0IjoxNzQ5NTEyOTQ1LCJleHAiOjE3NTAxMTc3NDV9.IVNwkB8kxJwyoMOg0pJsEgwHVl510jkO3mzz6cuT5RU','2025-06-09 23:49:05'),(40,88,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODgsImVtYWlsIjoibnJhYmVlMjBAZ21haWwuY29tIiwiaWF0IjoxNzQ5NTEyOTg0LCJleHAiOjE3NTAxMTc3ODR9.9Qw1vMjszfpg1tSZaNo4Lb_9zlQcv3bnnXt-c01f6sA','2025-06-09 23:49:44'),(41,88,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODgsImVtYWlsIjoibnJhYmVlMjBAZ21haWwuY29tIiwiaWF0IjoxNzQ5NTEzMDIwLCJleHAiOjE3NTAxMTc4MjB9.PCMv_z6J9fEmSL2-RMTMckkBEstXkvu1HEJOlJFO_QQ','2025-06-09 23:50:20'),(42,88,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODgsImVtYWlsIjoibnJhYmVlMjBAZ21haWwuY29tIiwiaWF0IjoxNzQ5NTEzOTk0LCJleHAiOjE3NTAxMTg3OTR9.HON4WUgaLFpToL_SI_RvfGzSiWkOmF608W7fQnlyZpk','2025-06-10 00:06:34'),(43,88,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODgsImVtYWlsIjoibnJhYmVlMjBAZ21haWwuY29tIiwiaWF0IjoxNzQ5NTE0MDM1LCJleHAiOjE3NTAxMTg4MzV9.8M3GfPq8ZBup3L5xx00b5D9WeD4a6dXjxTt4b72cBj4','2025-06-10 00:07:15'),(44,88,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODgsImVtYWlsIjoibnJhYmVlMjBAZ21haWwuY29tIiwiaWF0IjoxNzQ5NTE1OTQ0LCJleHAiOjE3NTAxMjA3NDR9.EDqDNvOUtmeVdvQXZP95i44lj_iZhsSjuJq8zl0o6pk','2025-06-10 00:39:04'),(45,88,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODgsImVtYWlsIjoibnJhYmVlMjBAZ21haWwuY29tIiwiaWF0IjoxNzQ5NTQ4OTgwLCJleHAiOjE3NTAxNTM3ODB9.9MM14vPCDArQTkelz08hc8DJx-JmmZgRgC02v2JnKP8','2025-06-10 09:49:40'),(46,88,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODgsImVtYWlsIjoibnJhYmVlMjBAZ21haWwuY29tIiwiaWF0IjoxNzQ5NTQ5MTE3LCJleHAiOjE3NTAxNTM5MTd9.Ml0zuB69xc-bPcWPuMyasoTr7FOufLJvUWfWWOacpmQ','2025-06-10 09:51:57'),(47,88,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODgsImVtYWlsIjoibnJhYmVlMjBAZ21haWwuY29tIiwiaWF0IjoxNzQ5NTUwMDU1LCJleHAiOjE3NTAxNTQ4NTV9.1WifwaGwhdhR-UiTnPO0Da0SK39nrkQ96zbf7oWtha8','2025-06-10 10:07:35'),(48,88,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODgsImVtYWlsIjoibnJhYmVlMjBAZ21haWwuY29tIiwiaWF0IjoxNzQ5NTUxMTc4LCJleHAiOjE3NTAxNTU5Nzh9.4xwCjDa1_fv_fObo9uXc3pohLJH9p3O0mIOgsUBXzOY','2025-06-10 10:26:18'),(49,38,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzgsImVtYWlsIjoib3JnZGFzaEBqdXN0LmVkdS5qbyIsImlhdCI6MTc0OTU1MTQyNywiZXhwIjoxNzUwMTU2MjI3fQ.oUISgUwQw_rw0aq2i2OOj_ANdoEJFesKTjMyQ8z0EhQ','2025-06-10 10:30:27'),(50,88,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODgsImVtYWlsIjoibnJhYmVlMjBAZ21haWwuY29tIiwiaWF0IjoxNzQ5NTUxNDc1LCJleHAiOjE3NTAxNTYyNzV9.mlbAC-v_yGBGLq9hCgE3-3BdepQDBWf_3mpk514XaRc','2025-06-10 10:31:15'),(51,88,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODgsImVtYWlsIjoibnJhYmVlMjBAZ21haWwuY29tIiwiaWF0IjoxNzQ5NTUzMTI0LCJleHAiOjE3NTAxNTc5MjR9.1rqnZs2Odfq5HBH20pGhnl4AKC06tGr9vSHOZWChMBM','2025-06-10 10:58:44'),(52,88,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODgsImVtYWlsIjoibnJhYmVlMjBAZ21haWwuY29tIiwiaWF0IjoxNzQ5NTUzOTkzLCJleHAiOjE3NTAxNTg3OTN9.9S-oM0hWS-HJcQVC8v0SeNYfAc_Vfgg1UmtCnShjGv0','2025-06-10 11:13:13'),(53,88,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODgsImVtYWlsIjoibnJhYmVlMjBAZ21haWwuY29tIiwiaWF0IjoxNzQ5NTU5NzQyLCJleHAiOjE3NTAxNjQ1NDJ9.zNPo-8PUxuKkQ_JXh-scsj-LEW2DOOG5YV098d5ELLg','2025-06-10 12:49:02'),(54,88,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODgsImVtYWlsIjoibnJhYmVlMjBAZ21haWwuY29tIiwiaWF0IjoxNzQ5NTYwODQ4LCJleHAiOjE3NTAxNjU2NDh9.Ci56GdbS4T73UWIpwL1p5MKY7jHbn5-trQanJzOuFT0','2025-06-10 13:07:28'),(55,88,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODgsImVtYWlsIjoibnJhYmVlMjBAZ21haWwuY29tIiwiaWF0IjoxNzQ5NTYyNTI3LCJleHAiOjE3NTAxNjczMjd9.56xu2oPkP2Lh_74UNoYqkH8QSSx8kZ2qoAcKVjjn2pk','2025-06-10 13:35:27'),(56,88,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODgsImVtYWlsIjoibnJhYmVlMjBAZ21haWwuY29tIiwiaWF0IjoxNzQ5NTY1MjY0LCJleHAiOjE3NTAxNzAwNjR9.wBpH-R7IdIb8iCF0cvfjM2R0ERoCC6hOL272vfUb9us','2025-06-10 14:21:04');
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
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `room_bookings`
--

LOCK TABLES `room_bookings` WRITE;
/*!40000 ALTER TABLE `room_bookings` DISABLE KEYS */;
INSERT INTO `room_bookings` VALUES (1,6,2,'Lab exam for embedded systems','2025-06-10 09:00:00','2025-06-10 11:00:00','Approved','2025-06-09 00:08:11','2025-06-09 00:08:11'),(2,7,6,'Weekly committee meeting','2025-06-11 15:00:00','2025-06-11 16:30:00','Pending','2025-06-09 00:08:11','2025-06-09 00:08:11'),(3,8,3,'Study group session','2025-06-12 12:00:00','2025-06-12 14:00:00','Rejected','2025-06-09 00:08:11','2025-06-09 00:08:11'),(4,5,1,'Team Project Meeting','2025-06-15 10:00:00','2025-06-15 12:00:00','Approved','2025-06-09 00:20:45','2025-06-09 00:20:45'),(5,6,2,'Circuit Lab Practice','2025-06-16 14:00:00','2025-06-16 16:00:00','Rejected','2025-06-09 00:20:45','2025-06-09 00:20:45'),(6,7,3,'Study Group Session','2025-06-17 09:00:00','2025-06-17 11:00:00','Pending','2025-06-09 00:20:45','2025-06-09 00:20:45'),(7,87,3,'Project Discussion ','2025-06-09 17:33:00','2025-06-09 19:33:00','Approved','2025-06-09 17:33:46','2025-06-09 17:35:01'),(8,38,1,'jjjjj','2025-06-11 04:35:00','2025-06-11 05:35:00','Pending','2025-06-10 02:35:57','2025-06-10 02:35:57'),(9,38,1,'Testing','2025-06-11 14:00:00','2025-06-11 15:00:00','Pending','2025-06-10 02:37:42','2025-06-10 02:37:42'),(10,38,1,'Testing Slot 1','2025-06-11 10:00:00','2025-06-11 11:00:00','Pending','2025-06-10 02:38:15','2025-06-10 02:38:15'),(11,38,1,'Testing Slot 2','2025-06-11 11:00:00','2025-06-11 12:00:00','Pending','2025-06-10 02:38:24','2025-06-10 02:38:24'),(12,38,1,'Testing Slot 3','2025-06-11 12:00:00','2025-06-11 13:00:00','Pending','2025-06-10 02:38:49','2025-06-10 02:38:49'),(13,38,1,'Testing Slot 4','2025-06-11 13:00:00','2025-06-11 14:00:00','Pending','2025-06-10 02:39:00','2025-06-10 02:39:00'),(14,38,1,'Spam Test 1','2025-06-11 09:00:00','2025-06-11 10:00:00','Pending','2025-06-10 02:47:59','2025-06-10 02:47:59'),(15,38,1,'Spam Date Test 1','2025-06-12 09:00:00','2025-06-12 10:00:00','Pending','2025-06-10 02:50:06','2025-06-10 02:50:06'),(16,6,1,'AI Project Planning','2025-06-10 13:00:00','2025-06-10 14:30:00','Approved','2025-06-10 13:19:39','2025-06-10 13:19:39'),(17,7,1,'Resume Workshop Prep','2025-06-11 09:00:00','2025-06-11 10:00:00','Approved','2025-06-10 13:19:39','2025-06-10 13:19:39'),(18,87,1,'System Design Session','2025-06-12 10:00:00','2025-06-12 11:30:00','Rejected','2025-06-10 13:19:39','2025-06-10 13:19:39'),(19,6,2,'Lab Repair Review','2025-06-13 11:00:00','2025-06-13 12:00:00','Pending','2025-06-10 13:19:39','2025-06-10 13:19:39'),(20,7,3,'Group Study','2025-06-14 08:00:00','2025-06-14 10:00:00','Approved','2025-06-10 13:19:39','2025-06-10 13:19:39'),(21,6,3,'Q&A Session','2025-06-14 11:00:00','2025-06-14 12:00:00','Approved','2025-06-10 13:19:39','2025-06-10 13:19:39'),(22,87,4,'Workshop Debrief','2025-06-15 13:00:00','2025-06-15 14:00:00','Rejected','2025-06-10 13:19:39','2025-06-10 13:19:39'),(23,5,5,'Coding Bootcamp','2025-06-16 14:00:00','2025-06-16 16:00:00','Approved','2025-06-10 13:19:39','2025-06-10 13:19:39'),(24,6,5,'Hackathon Prep','2025-06-17 10:00:00','2025-06-17 12:00:00','Approved','2025-06-10 13:19:39','2025-06-10 13:19:39'),(25,5,1,'AI Club Planning','2025-06-18 09:00:00','2025-06-18 10:30:00','Approved','2025-06-10 13:26:05','2025-06-10 13:26:05'),(26,6,1,'Guest Speaker Session','2025-06-19 13:00:00','2025-06-19 14:30:00','Pending','2025-06-10 13:26:05','2025-06-10 13:26:05'),(27,7,5,'Software Demo','2025-06-18 15:00:00','2025-06-18 17:00:00','Approved','2025-06-10 13:26:05','2025-06-10 13:26:05'),(28,8,5,'Bug Bash','2025-06-19 12:00:00','2025-06-19 14:00:00','Rejected','2025-06-10 13:26:05','2025-06-10 13:26:05'),(29,87,3,'Study Group - Physics','2025-06-18 11:00:00','2025-06-18 13:00:00','Approved','2025-06-10 13:26:05','2025-06-10 13:26:05'),(30,5,3,'Exam Prep','2025-06-19 14:00:00','2025-06-19 16:00:00','Pending','2025-06-10 13:26:05','2025-06-10 13:26:05'),(31,6,1,'Slot X1','2025-06-20 08:00:00','2025-06-20 09:00:00','Rejected','2025-06-10 13:26:05','2025-06-10 13:26:05'),(32,6,1,'Slot X2','2025-06-20 09:00:00','2025-06-20 10:00:00','Rejected','2025-06-10 13:26:05','2025-06-10 13:26:05');
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
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `saved_events`
--

LOCK TABLES `saved_events` WRITE;
/*!40000 ALTER TABLE `saved_events` DISABLE KEYS */;
INSERT INTO `saved_events` VALUES (1,6,1,'2025-06-08 21:08:30'),(2,6,2,'2025-06-08 21:08:30'),(3,7,3,'2025-06-08 21:08:30'),(4,87,5,'2025-06-09 14:33:04'),(5,5,1,'2025-06-10 10:20:19'),(6,7,1,'2025-06-10 10:20:19'),(7,8,2,'2025-06-10 10:20:19'),(8,87,2,'2025-06-10 10:20:19'),(9,5,6,'2025-06-10 10:20:19'),(10,6,6,'2025-06-10 10:20:19'),(11,7,5,'2025-06-10 10:20:19'),(12,87,9,'2025-06-10 10:20:19');
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
) ENGINE=InnoDB AUTO_INCREMENT=95 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Nada Samara','nada@college.just.edu.jo','$2b$10$xyz123student1','Visitor',NULL,1,NULL,'Local',NULL,'2025-04-28 04:37:59',NULL,NULL,NULL),(2,'Ahmad Alhashash','ahmad@college.just.edu.jo','$2b$10$xyz123student2','Visitor',NULL,1,NULL,'Local',NULL,'2025-04-28 04:37:59',NULL,NULL,NULL),(3,'Amer Rabi','amer@college.just.edu.jo','$2b$10$xyz123student3','Visitor',NULL,1,NULL,'Local',NULL,'2025-04-28 04:37:59',NULL,NULL,NULL),(4,'Lara Allouh','lara@college.just.edu.jo','$2b$10$xyz123student4','Visitor',NULL,1,NULL,'Local',NULL,'2025-04-28 04:37:59',NULL,NULL,NULL),(5,'Mohammad Naim','mohammad@college.just.edu.jo','$2b$10$xyz123student5','Visitor',NULL,1,NULL,'Local',NULL,'2025-04-28 04:37:59',NULL,NULL,NULL),(6,'Engineering Club','engclub@just.edu.jo',NULL,'Visitor',NULL,1,NULL,'Google',NULL,'2025-04-28 04:37:59',NULL,NULL,NULL),(7,'Medical Club','medclub@just.edu.jo',NULL,'Visitor',NULL,1,NULL,'Google',NULL,'2025-04-28 04:37:59',NULL,NULL,NULL),(8,'Dean Office','deanoffice@just.edu.jo',NULL,'Visitor',NULL,1,NULL,'Microsoft',NULL,'2025-04-28 04:37:59',NULL,NULL,NULL),(9,'Library Admin','libraryadmin@just.edu.jo',NULL,'Visitor',NULL,1,NULL,'Microsoft',NULL,'2025-04-28 04:37:59',NULL,NULL,NULL),(10,'External Visitor','visitor1@gmail.com',NULL,'Visitor',NULL,1,NULL,'Local',NULL,'2025-04-28 04:37:59',NULL,NULL,NULL),(11,'System Super Admin','admin@just.edu.jo','$2b$10$xyz123admin','Visitor',NULL,1,NULL,'Local',NULL,'2025-04-28 04:37:59',NULL,NULL,NULL),(38,'Organizer Dashboard','orgdash@just.edu.jo','$2b$10$zVd4rEhDvrGbUKHzIlxvH.Bho7yJMScCFIA1gOgeDZeD5iwRoeCGi','Organizer',NULL,1,NULL,'Local',NULL,'2025-05-08 21:40:40',NULL,NULL,'2025-06-10 10:30:27'),(75,'Nada','nadaCampus@gmail.com','$2b$10$qms1A70DYtMAnUdQEiOnNeburJ6o56DhS143AWxjhYrESh0nv22yi','Campus Admin','Campus Admin',1,NULL,'Local',NULL,'2025-05-09 13:51:19',NULL,NULL,'2025-06-09 14:34:38'),(76,'Ali','ali@gmail.com','$2b$10$98koLIHBM2TIu.MRPLXG4ufeJeCdfTrp9NcaiYYIBke3B9qK03LQ6','Visitor',NULL,1,NULL,'Local',NULL,'2025-05-09 23:26:07',NULL,NULL,'2025-05-11 07:36:55'),(85,'Nada Samara','nrsamara20@gmail.com',NULL,'Visitor',NULL,1,NULL,'Google',NULL,'2025-05-16 19:52:49',NULL,NULL,NULL),(87,'Nada Rabee Samara','nrsamara20@cit.just.edu.jo',NULL,'Student',NULL,1,NULL,'Microsoft',NULL,'2025-05-16 20:19:00',NULL,NULL,'2025-06-10 14:42:42'),(88,'System Admin','nrabee20@gmail.com','$2b$10$hKlSonFotP7E6o.XWGLR6OCMTDS4S/Kp9TJ97fi/Oxc4HSIHbof6m','System Admin','Visitor',1,NULL,'Local',NULL,'2025-05-26 07:12:35',NULL,NULL,'2025-06-10 14:21:04'),(89,'Lara Test','lara@example.com','$2a$10$7QHkXtJG...','Visitor',NULL,1,NULL,'Local',NULL,'2025-05-26 18:44:38',NULL,NULL,NULL),(93,'ghina_student','rabighena10@gmail.com','$2b$10$oaeC7mDyM5vSR2vgq3ILfOpWtkVAA.5PCjYjVrW28BqQw3Bhqkkoy','Pending','Organizer',1,NULL,'Local',NULL,'2025-06-09 10:57:29',NULL,NULL,'2025-06-09 23:32:03'),(94,'nada','nrabee02@gmail.com','$2b$10$KgoHY.8rPdlLlFIEsB4YCu4j56RF/3OzutolrmpNlSJpgOywJM7Wi','Pending','Campus Admin',1,NULL,'Local',NULL,'2025-06-09 23:33:16',NULL,NULL,'2025-06-09 23:33:50');
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

-- Dump completed on 2025-06-10 18:12:54
