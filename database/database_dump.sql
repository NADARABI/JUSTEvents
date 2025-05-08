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
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `approvals`
--

LOCK TABLES `approvals` WRITE;
/*!40000 ALTER TABLE `approvals` DISABLE KEYS */;
INSERT INTO `approvals` VALUES (1,8,'Room Booking',1,'Approved','Booking looks good.','2025-04-28 04:45:35'),(2,8,'Room Booking',2,'Approved','Approved for Hackathon prep.','2025-04-28 04:45:35'),(3,9,'Event',1,'Approved','AI Seminar meets university goals.','2025-04-28 04:45:35'),(9,NULL,'Event',9,'Pending',NULL,NULL),(10,NULL,'Event',10,'Pending',NULL,NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event_rsvps`
--

LOCK TABLES `event_rsvps` WRITE;
/*!40000 ALTER TABLE `event_rsvps` DISABLE KEYS */;
INSERT INTO `event_rsvps` VALUES (1,1,1,'Going','2025-04-28 04:42:52'),(2,2,2,'Going','2025-04-28 04:42:52'),(3,3,4,'Going','2025-04-28 04:42:52'),(4,5,3,'Going','2025-04-28 04:42:52'),(7,35,4,'Going','2025-04-29 21:52:53');
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
  CONSTRAINT `events_ibfk_1` FOREIGN KEY (`organizer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
INSERT INTO `events` VALUES (1,'AI in Healthcare Seminar','A seminar discussing the future of AI in medical fields.','Academic','2025-04-29','10:00:00',6,4,'Approved',NULL),(2,'Engineering Hackathon','48-hour coding competition for engineering students.','Academic','2025-05-25','09:00:00',6,1,'Approved',NULL),(3,'Medical Awareness Campaign','Campaign to raise awareness about common diseases.','Social','2025-05-22','11:00:00',7,5,'Approved',NULL),(4,'Student Clubs Fair','An event where new students can meet and join campus clubs.','Social','2025-04-29','13:00:00',7,7,'Approved',NULL),(5,'Career Development Workshop','Workshop on CV writing and interview preparation.','Workshop','2025-06-01','14:00:00',6,2,'Approved',NULL),(8,'Pending Test Event','This event is for testing pending status.','General','2025-06-15','12:00:00',1,1,'Pending',NULL),(10,'Hi','Short','General','2025-05-03','10:00:00',36,4,'Pending',NULL),(11,'Hi','Short','General','2025-05-01','09:00:00',36,1,'Approved',NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feedback`
--

LOCK TABLES `feedback` WRITE;
/*!40000 ALTER TABLE `feedback` DISABLE KEYS */;
INSERT INTO `feedback` VALUES (1,1,1,'Very informative seminar, loved it!',5,'2025-04-28 04:45:20'),(2,2,2,'Hackathon was very competitive and fun!',4,'2025-04-28 04:45:20'),(3,4,3,'Nice opportunity to meet clubs.',5,'2025-04-28 04:45:20'),(4,5,35,'Amazing event! Learned a lot!',5,'2025-04-29 16:14:15');
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
  `type` enum('info','success','warning','error') DEFAULT 'info',
  `is_read` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (5,35,'Your RSVP was successful for Event #10','info',1,'2025-04-29 18:45:20'),(6,35,'Your feedback was received','info',1,'2025-04-29 18:45:20'),(7,35,'An event you saved has been updated','info',1,'2025-04-29 18:45:20'),(8,35,'You successfully RSVPed to Event #4','info',1,'2025-04-29 21:50:18'),(9,35,'You successfully RSVPed to Event #4','info',1,'2025-04-29 21:52:53'),(10,1,'Old test notification','success',0,'2025-03-01 23:23:35'),(11,35,'Welcome to JUSTEvents!','info',0,'2025-04-30 23:25:30'),(12,35,'Your room booking was approved.','success',1,'2025-04-29 23:25:30'),(13,35,'Old notification A','warning',0,'2025-03-16 23:25:30'),(14,35,'Old notification B','info',1,'2025-03-01 23:25:30'),(15,35,'Old notification C','success',0,'2025-01-30 23:25:30');
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
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `refresh_tokens`
--

LOCK TABLES `refresh_tokens` WRITE;
/*!40000 ALTER TABLE `refresh_tokens` DISABLE KEYS */;
INSERT INTO `refresh_tokens` VALUES (1,1,'token_nada','2025-04-28 04:41:57'),(2,2,'token_ahmad','2025-04-28 04:41:57'),(3,3,'token_amer','2025-04-28 04:41:57'),(4,4,'token_lara','2025-04-28 04:41:57'),(5,5,'token_mohammad','2025-04-28 04:41:57'),(6,6,'token_engclub','2025-04-28 04:41:57'),(7,7,'token_medclub','2025-04-28 04:41:57'),(8,8,'token_dean','2025-04-28 04:41:57'),(9,9,'token_library','2025-04-28 04:41:57'),(10,10,'token_visitor','2025-04-28 04:41:57'),(11,11,'token_admin','2025-04-28 04:41:57'),(15,35,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzUsImVtYWlsIjoibnJhYmVlMjBAZ21haWwuY29tIiwiaWF0IjoxNzQ1OTQzMDg4LCJleHAiOjE3NDY1NDc4ODh9.LdDA4k0R6SvCb9k62Kc3pn6GDOnQVLbJkEzn40V7Xa0','2025-04-29 16:11:28'),(16,35,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzUsImVtYWlsIjoibnJhYmVlMjBAZ21haWwuY29tIiwiaWF0IjoxNzQ1OTQ0MTAwLCJleHAiOjE3NDY1NDg5MDB9.70gu7Ui1P_DLbW_QV4rvbfXCYdVASSHAfSc7Yczfx9w','2025-04-29 16:28:20'),(17,35,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzUsImVtYWlsIjoibnJhYmVlMjBAZ21haWwuY29tIiwiaWF0IjoxNzQ1OTQ0OTg0LCJleHAiOjE3NDY1NDk3ODR9.pVdCsDBxxXcE-yx0iJdwdPm_AzwVwriN8uVpsq72BnU','2025-04-29 16:43:04'),(18,35,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzUsImVtYWlsIjoibnJhYmVlMjBAZ21haWwuY29tIiwiaWF0IjoxNzQ1OTUwMzM4LCJleHAiOjE3NDY1NTUxMzh9.KjFpg-PZaE6BTcBZQBClGj1M8ZL_vZVYaqL1fGTsErc','2025-04-29 18:12:18'),(19,35,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzUsImVtYWlsIjoibnJhYmVlMjBAZ21haWwuY29tIiwiaWF0IjoxNzQ1OTUwNDUwLCJleHAiOjE3NDY1NTUyNTB9.BuB_lbb2VOR69KrHTiLVkst0T4wfeeg4_9A_TDjMKps','2025-04-29 18:14:10'),(20,35,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzUsImVtYWlsIjoibnJhYmVlMjBAZ21haWwuY29tIiwiaWF0IjoxNzQ1OTUwODcxLCJleHAiOjE3NDY1NTU2NzF9.h5IFJqEVEF6LYbKup2VC2TJOdmHN-vEZpLZQwVLOcfE','2025-04-29 18:21:11'),(21,35,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzUsImVtYWlsIjoibnJhYmVlMjBAZ21haWwuY29tIiwiaWF0IjoxNzQ1OTUyMDc1LCJleHAiOjE3NDY1NTY4NzV9.CS1N-9ZBxiW0BCnpAC9cIG0l7tvX7VWRN_nWyFG624w','2025-04-29 18:41:15'),(22,36,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzYsImVtYWlsIjoibnJhYmVlMDJAZ21haWwuY29tIiwiaWF0IjoxNzQ1OTYyNjU2LCJleHAiOjE3NDY1Njc0NTZ9.0tHpT6YUqp8p3PbUvLeXKGse9l7X8zxO-HmybQZhANc','2025-04-29 21:37:36'),(23,36,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzYsImVtYWlsIjoibnJhYmVlMDJAZ21haWwuY29tIiwiaWF0IjoxNzQ1OTYyOTI4LCJleHAiOjE3NDY1Njc3Mjh9.UjHvjvJmuNKNlYC6SxEakBqh3p9jdf0gYa-DoTuAvlM','2025-04-29 21:42:08'),(24,35,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzUsImVtYWlsIjoibnJhYmVlMjBAZ21haWwuY29tIiwiaWF0IjoxNzQ1OTYzMjgyLCJleHAiOjE3NDY1NjgwODJ9.3bNIf_9GKamRQxseK-yBuHLSTAmSXhgGGrTuH-m6jss','2025-04-29 21:48:02'),(25,35,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzUsImVtYWlsIjoibnJhYmVlMjBAZ21haWwuY29tIiwiaWF0IjoxNzQ1OTYzMzY3LCJleHAiOjE3NDY1NjgxNjd9.laWDOelAKMSWPhvQNpvxCsiYbjJdNSqgRhEcHQGkVhg','2025-04-29 21:49:27'),(26,36,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzYsImVtYWlsIjoibnJhYmVlMDJAZ21haWwuY29tIiwiaWF0IjoxNzQ1OTYzOTk1LCJleHAiOjE3NDY1Njg3OTV9.UHd92KRbmb3zyJOZ4Kc7ZMd0c-e3x0G5zwELJCZJn3o','2025-04-29 21:59:55'),(27,36,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzYsImVtYWlsIjoibnJhYmVlMDJAZ21haWwuY29tIiwiaWF0IjoxNzQ1OTY0NDcwLCJleHAiOjE3NDY1NjkyNzB9.3eISl-e5AeS87JIlCn4GEh_MMAxnA3sR0CyyCQIGbOE','2025-04-29 22:07:50'),(28,36,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzYsImVtYWlsIjoibnJhYmVlMDJAZ21haWwuY29tIiwiaWF0IjoxNzQ1OTY0NTc4LCJleHAiOjE3NDY1NjkzNzh9.oWgLUhiTL-p7qt7uAWoYrD-AndFO_kySTLqHHU7tHDw','2025-04-29 22:09:38'),(29,36,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzYsImVtYWlsIjoibnJhYmVlMDJAZ21haWwuY29tIiwiaWF0IjoxNzQ1OTY0OTQwLCJleHAiOjE3NDY1Njk3NDB9.epHQSNRPY0VmB0w3O0IcrwLAB3_PSuLYeJihCDbMyrM','2025-04-29 22:15:40'),(30,35,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzUsImVtYWlsIjoibnJhYmVlMjBAZ21haWwuY29tIiwiaWF0IjoxNzQ1OTY4MDAwLCJleHAiOjE3NDY1NzI4MDB9.7WLuhWKYGRbiUI3EACIpHinXiUXB0w1eP93QGXBAcJs','2025-04-29 23:06:40'),(31,35,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzUsImVtYWlsIjoibnJhYmVlMjBAZ21haWwuY29tIiwiaWF0IjoxNzQ1OTY4MjE4LCJleHAiOjE3NDY1NzMwMTh9.JnaoGhNCE54IjKUMXSemlZiRhGbqba_X7Z_UmFeIIME','2025-04-29 23:10:18'),(32,35,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzUsImVtYWlsIjoibnJhYmVlMjBAZ21haWwuY29tIiwiaWF0IjoxNzQ1OTY4MjkxLCJleHAiOjE3NDY1NzMwOTF9.bGFyMF10_oYw5b2UsuZOMRqg8L-dMue_JbfOvlO12DI','2025-04-29 23:11:31'),(33,35,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzUsImVtYWlsIjoibnJhYmVlMjBAZ21haWwuY29tIiwiaWF0IjoxNzQ1OTY4NDIxLCJleHAiOjE3NDY1NzMyMjF9.MpYXncK5NQ6kYJZvbLbqdd7hUrIbP0SuGXPvztTY3no','2025-04-29 23:13:41'),(34,37,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzcsImVtYWlsIjoibnJzYW1hcmEyMEBnbWFpbC5jb20iLCJpYXQiOjE3NDU5Njk0NDQsImV4cCI6MTc0NjU3NDI0NH0.I7jm4MRK90NpLiCGrXPJvXL8tFsCW08K1kTHmlJPGqA','2025-04-29 23:30:44'),(35,35,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzUsImVtYWlsIjoibnJhYmVlMjBAZ21haWwuY29tIiwiaWF0IjoxNzQ2MDEzNjE0LCJleHAiOjE3NDY2MTg0MTR9.e3cJjp_3n7pKHX0kXFvzrgP5v06TULH0SLrTkLWOjWw','2025-04-30 11:46:54'),(36,35,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzUsImVtYWlsIjoibnJhYmVlMjBAZ21haWwuY29tIiwiaWF0IjoxNzQ2MDE0NTY0LCJleHAiOjE3NDY2MTkzNjR9.l-um4N6QLV8Gj97-AzEouFdFvbWvBI01hXfUeQbI7FM','2025-04-30 12:02:44'),(37,35,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzUsImVtYWlsIjoibnJhYmVlMjBAZ21haWwuY29tIiwiaWF0IjoxNzQ2MDE1MDEyLCJleHAiOjE3NDY2MTk4MTJ9.SWabiSSIUedu-iCPMsrsnfOUKAg8ujIY-i8J3awFYgA','2025-04-30 12:10:12'),(38,35,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzUsImVtYWlsIjoibnJhYmVlMjBAZ21haWwuY29tIiwiaWF0IjoxNzQ2MDE1MDkxLCJleHAiOjE3NDY2MTk4OTF9.M3w667jLB5m8TAe5R1_g8KSp5qaOG4nZvMf1FRNAqk8','2025-04-30 12:11:31'),(39,35,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzUsImVtYWlsIjoibnJhYmVlMjBAZ21haWwuY29tIiwiaWF0IjoxNzQ2MDE1MjczLCJleHAiOjE3NDY2MjAwNzN9.dum80F_lTW0lVEv4209haUgFnqAxuTECWZHY9WvSbhE','2025-04-30 12:14:33'),(40,37,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzcsImVtYWlsIjoibnJzYW1hcmEyMEBnbWFpbC5jb20iLCJpYXQiOjE3NDYwMTU0NTgsImV4cCI6MTc0NjYyMDI1OH0.vnXoaqO_CJlqQA-liOmSgjgf4MYMxtZ8bITefCz7oa8','2025-04-30 12:17:38'),(41,37,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzcsImVtYWlsIjoibnJzYW1hcmEyMEBnbWFpbC5jb20iLCJpYXQiOjE3NDYwMTU4MTcsImV4cCI6MTc0NjYyMDYxN30.Q4FPFBnFHVXFH4_Ze3YNy0vkpYwTnueTGMxw38ItOts','2025-04-30 12:23:37'),(42,37,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzcsImVtYWlsIjoibnJzYW1hcmEyMEBnbWFpbC5jb20iLCJpYXQiOjE3NDYwMTU5MDgsImV4cCI6MTc0NjYyMDcwOH0.rDHf_JzjBc-l8BgdWZ5_EbIkm036HPovVQg4cRJGoEg','2025-04-30 12:25:08'),(43,37,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzcsImVtYWlsIjoibnJzYW1hcmEyMEBnbWFpbC5jb20iLCJpYXQiOjE3NDYwMTU5MTUsImV4cCI6MTc0NjYyMDcxNX0.LlI3pzXF6z9n1mWpjqbQEeGCtVPmeQMyimUw6vvuwlY','2025-04-30 12:25:15'),(44,35,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzUsImVtYWlsIjoibnJhYmVlMjBAZ21haWwuY29tIiwiaWF0IjoxNzQ2MDE1OTI5LCJleHAiOjE3NDY2MjA3Mjl9.nzUwOjo12PC-psYnMMVbsGFKB0oI0Y9TaQLDr08lRno','2025-04-30 12:25:29'),(45,35,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzUsImVtYWlsIjoibnJhYmVlMjBAZ21haWwuY29tIiwiaWF0IjoxNzQ2MDIxNzUzLCJleHAiOjE3NDY2MjY1NTN9.oxpJhWELmjL9RqwDUXXx4oce6y27ZhawzGreMz0kFjo','2025-04-30 14:02:33'),(46,37,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzcsImVtYWlsIjoibnJzYW1hcmEyMEBnbWFpbC5jb20iLCJpYXQiOjE3NDYwMjIxMDMsImV4cCI6MTc0NjYyNjkwM30.KE50xoTfHjxLR8VBkMsk06EHtaMVxbFbkVnbEMweN2Y','2025-04-30 14:08:23'),(47,37,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzcsImVtYWlsIjoibnJzYW1hcmEyMEBnbWFpbC5jb20iLCJpYXQiOjE3NDYwMjI0OTYsImV4cCI6MTc0NjYyNzI5Nn0.ERV8XeXG3UpHpPP9BUkvDFmjdqySE2CUQug-KQbtOOs','2025-04-30 14:14:56'),(48,37,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzcsImVtYWlsIjoibnJzYW1hcmEyMEBnbWFpbC5jb20iLCJpYXQiOjE3NDYwMjMyNzUsImV4cCI6MTc0NjYyODA3NX0.6abmUeZ-T9GVXn_PrKFPk9ZFi2LWyxGMS1VFYfGSD44','2025-04-30 14:27:55'),(49,37,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzcsImVtYWlsIjoibnJzYW1hcmEyMEBnbWFpbC5jb20iLCJpYXQiOjE3NDYwMzg1OTksImV4cCI6MTc0NjY0MzM5OX0.Od08KuENI6pSXNjrWQlBGWz1INIZsdwWi_--Sw_J5bw','2025-04-30 18:43:19'),(50,36,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzYsImVtYWlsIjoibnJhYmVlMDJAZ21haWwuY29tIiwiaWF0IjoxNzQ2MDM5NDMzLCJleHAiOjE3NDY2NDQyMzN9.9VZo-BJaZZzx7P4jDB6v7QHQEkwVo7iLsVXmqKOutIU','2025-04-30 18:57:13'),(51,36,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzYsImVtYWlsIjoibnJhYmVlMDJAZ21haWwuY29tIiwiaWF0IjoxNzQ2MDQwNDQwLCJleHAiOjE3NDY2NDUyNDB9.lKC1mhDEMBa2jCvVVYUQnLXGVv5O_HUbhXBZK8K-SkI','2025-04-30 19:14:00'),(52,36,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzYsImVtYWlsIjoibnJhYmVlMDJAZ21haWwuY29tIiwiaWF0IjoxNzQ2MDQxMTU1LCJleHAiOjE3NDY2NDU5NTV9.T433kBZJepkJrR9gOYfZBr03bptVokRQ5IdRpLHdAfM','2025-04-30 19:25:55'),(53,36,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzYsImVtYWlsIjoibnJhYmVlMDJAZ21haWwuY29tIiwiaWF0IjoxNzQ2MDQxMjgzLCJleHAiOjE3NDY2NDYwODN9.yXR-h7504GIJMY4sMPfqGWAUuoS0dpB8aRutgej3R_Q','2025-04-30 19:28:03'),(54,36,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzYsImVtYWlsIjoibnJhYmVlMDJAZ21haWwuY29tIiwiaWF0IjoxNzQ2MDQxMzg2LCJleHAiOjE3NDY2NDYxODZ9.M7D5B62b-6TaI3uIxOjq1Kcu0lyiFnd02_wy620bjHg','2025-04-30 19:29:46'),(55,37,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzcsImVtYWlsIjoibnJzYW1hcmEyMEBnbWFpbC5jb20iLCJpYXQiOjE3NDYwNDIyMzYsImV4cCI6MTc0NjY0NzAzNn0.XCtLcglUiIEs7xx4BIFbYtLO23fS037snlTsGjVltfA','2025-04-30 19:43:56'),(56,37,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzcsImVtYWlsIjoibnJzYW1hcmEyMEBnbWFpbC5jb20iLCJpYXQiOjE3NDYwNDIyOTEsImV4cCI6MTc0NjY0NzA5MX0.oKHllv1TutoF93fB3JSuvaV6O8LykO65am33dod6rj8','2025-04-30 19:44:51'),(57,37,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzcsImVtYWlsIjoibnJzYW1hcmEyMEBnbWFpbC5jb20iLCJpYXQiOjE3NDYwNDIzNzUsImV4cCI6MTc0NjY0NzE3NX0.M8IK_kEdDkQNq_gth_oH6Zx3aMpijgxsY75nM5tPkeE','2025-04-30 19:46:15'),(58,35,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzUsImVtYWlsIjoibnJhYmVlMjBAZ21haWwuY29tIiwiaWF0IjoxNzQ2MDUwNTk2LCJleHAiOjE3NDY2NTUzOTZ9.nH77AZkP74f_TB4p41uRVbdRywx-B-7imft1ZC0CmGU','2025-04-30 22:03:16'),(59,35,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzUsImVtYWlsIjoibnJhYmVlMjBAZ21haWwuY29tIiwiaWF0IjoxNzQ2MDU0MDExLCJleHAiOjE3NDY2NTg4MTF9.H4l4jQxOKp2-w1SBMhVCUbzP4BOQ9wFjGdKwp2cNo34','2025-04-30 23:00:11'),(60,35,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzUsImVtYWlsIjoibnJhYmVlMjBAZ21haWwuY29tIiwiaWF0IjoxNzQ2MDU0MTEzLCJleHAiOjE3NDY2NTg5MTN9.fqex7oUQVAVhOH0KnlBI0NSqHKh8F3PXZWaqo0ITdrc','2025-04-30 23:01:53'),(61,35,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzUsImVtYWlsIjoibnJhYmVlMjBAZ21haWwuY29tIiwiaWF0IjoxNzQ2MDU0MzQ3LCJleHAiOjE3NDY2NTkxNDd9.zjKYo3tnhd6CDxZkFGIlX9NJUhAg1-EYVPU-GAInPXU','2025-04-30 23:05:47'),(62,35,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzUsImVtYWlsIjoibnJhYmVlMjBAZ21haWwuY29tIiwiaWF0IjoxNzQ2MDU0OTgyLCJleHAiOjE3NDY2NTk3ODJ9.9kCPB3IIZeyO3CvkYP3p67LA2zeCIeOXJ7O4v2qJz4o','2025-04-30 23:16:22'),(63,38,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzgsImVtYWlsIjoib3JnZGFzaEBqdXN0LmVkdS5qbyIsImlhdCI6MTc0Njc0MDY0MiwiZXhwIjoxNzQ3MzQ1NDQyfQ.BioBOwH5vFUJ2Kbbo1_dC844zK_fKlxkacPUBBRjNDo','2025-05-08 21:44:02');
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
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `room_bookings`
--

LOCK TABLES `room_bookings` WRITE;
/*!40000 ALTER TABLE `room_bookings` DISABLE KEYS */;
INSERT INTO `room_bookings` VALUES (1,1,1,'Group study for AI course','2025-05-21 12:00:00','2025-05-21 14:00:00','Rejected','2025-04-30 01:53:36','2025-04-30 17:15:29'),(2,2,2,'Software Engineering project work','2025-05-22 10:00:00','2025-05-22 12:00:00','Approved','2025-04-30 01:53:36','2025-04-30 17:28:20'),(3,3,3,'Medical club seminar','2025-05-23 13:00:00','2025-05-23 15:00:00','Pending','2025-04-30 01:53:36','2025-04-30 17:10:29'),(4,4,5,'Research team weekly meeting','2025-05-24 09:00:00','2025-05-24 11:00:00','Pending','2025-04-30 01:53:36','2025-04-30 17:10:29'),(10,35,3,'Project discussion','2025-05-21 12:00:00','2025-05-21 14:00:00','Pending','2025-04-30 17:06:26','2025-04-30 17:10:29');
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
  `type` enum('Study Room','Lab','Classroom','Meeting Room') DEFAULT 'Study Room',
  `status` enum('Available','Unavailable') DEFAULT 'Available',
  `description` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rooms`
--

LOCK TABLES `rooms` WRITE;
/*!40000 ALTER TABLE `rooms` DISABLE KEYS */;
INSERT INTO `rooms` VALUES (1,'Library Study Room 1','Library',6,'Study Room','Available','Small study room for groups up to 6 people.'),(2,'Engineering Lab 204','Engineering Building',30,'Lab','Available','Computer lab equipped with 30 machines.'),(3,'Medical Seminar Room','Medical Faculty',20,'Meeting Room','Available','Room suitable for seminars and discussions.'),(4,'Auditorium A','Main Auditorium',200,'Classroom','Available','Large auditorium used for lectures and events.'),(5,'Research Meeting Room','Research Center',10,'Meeting Room','Available','Reserved for research team meetings.');
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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Nada Samara','nada@college.just.edu.jo','$2b$10$xyz123student1','Student',NULL,1,NULL,'Local',NULL,'2025-04-28 04:37:59',NULL,NULL,NULL),(2,'Ahmad Alhashash','ahmad@college.just.edu.jo','$2b$10$xyz123student2','Student',NULL,1,NULL,'Local',NULL,'2025-04-28 04:37:59',NULL,NULL,NULL),(3,'Amer Rabi','amer@college.just.edu.jo','$2b$10$xyz123student3','Student',NULL,1,NULL,'Local',NULL,'2025-04-28 04:37:59',NULL,NULL,NULL),(4,'Lara Allouh','lara@college.just.edu.jo','$2b$10$xyz123student4','Student',NULL,1,NULL,'Local',NULL,'2025-04-28 04:37:59',NULL,NULL,NULL),(5,'Mohammad Naim','mohammad@college.just.edu.jo','$2b$10$xyz123student5','Student',NULL,1,NULL,'Local',NULL,'2025-04-28 04:37:59',NULL,NULL,NULL),(6,'Engineering Club','engclub@just.edu.jo',NULL,'Organizer',NULL,1,NULL,'Google',NULL,'2025-04-28 04:37:59',NULL,NULL,NULL),(7,'Medical Club','medclub@just.edu.jo',NULL,'Organizer',NULL,1,NULL,'Google',NULL,'2025-04-28 04:37:59',NULL,NULL,NULL),(8,'Dean Office','deanoffice@just.edu.jo',NULL,'Campus Admin',NULL,1,NULL,'Microsoft',NULL,'2025-04-28 04:37:59',NULL,NULL,NULL),(9,'Library Admin','libraryadmin@just.edu.jo',NULL,'Campus Admin',NULL,1,NULL,'Microsoft',NULL,'2025-04-28 04:37:59',NULL,NULL,NULL),(10,'External Visitor','visitor1@gmail.com',NULL,'Visitor',NULL,1,NULL,'Local',NULL,'2025-04-28 04:37:59',NULL,NULL,NULL),(11,'System Super Admin','admin@just.edu.jo','$2b$10$xyz123admin','System Admin',NULL,1,NULL,'Local',NULL,'2025-04-28 04:37:59',NULL,NULL,NULL),(34,'Nada Rabee Samara','nrsamara20@cit.just.edu.jo',NULL,'Student',NULL,1,NULL,'Microsoft',NULL,'2025-04-29 16:05:27',NULL,NULL,'2025-04-29 16:06:02'),(35,'testStudent','nrabee20@gmail.com','$2b$10$iJCAKtpzPy2zeVe4X8.JWuvC9UI.E0YlciNJvIEnOIGMrkX31DjA2','System Admin',NULL,1,NULL,'Local',NULL,'2025-04-29 16:08:50',NULL,NULL,'2025-04-30 23:16:22'),(36,'Nada Samara','nrabee02@gmail.com','$2b$10$z9Pp3DIH88RKfzcQma3mIevdzr./Hy6UH.rFhXDhTdI3VbT1La3ZG','Organizer','Organizer',1,NULL,'Local',NULL,'2025-04-29 21:36:59',NULL,NULL,'2025-04-30 19:29:46'),(37,'CA_test','nrsamara20@gmail.com','$2b$10$.5JnUzmvG8K.uMl.Rs1DlOXdes5EzKj6NLL.JbH4bqV4lxooD2o0W','Campus Admin','Campus Admin',1,NULL,'Local',NULL,'2025-04-29 23:27:43',NULL,NULL,'2025-04-30 19:46:15'),(38,'Organizer Dashboard','orgdash@just.edu.jo','$2b$10$zVd4rEhDvrGbUKHzIlxvH.Bho7yJMScCFIA1gOgeDZeD5iwRoeCGi','Organizer',NULL,1,NULL,'Local',NULL,'2025-05-08 21:40:40',NULL,NULL,'2025-05-08 21:44:02');
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

-- Dump completed on 2025-05-09  0:49:28
