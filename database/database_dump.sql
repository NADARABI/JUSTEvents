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
INSERT INTO `approvals` VALUES (1,11,'Event',4,'Pending',NULL,NULL),(2,11,'Room Booking',3,'Pending',NULL,NULL);
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
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `buildings`
--

LOCK TABLES `buildings` WRITE;
/*!40000 ALTER TABLE `buildings` DISABLE KEYS */;
INSERT INTO `buildings` VALUES (1,'Engineering Complex','North Campus','{\"x\": 32.4951, \"y\": 35.9912}'),(2,'Library Block','Central Campus','{\"x\": 32.4955, \"y\": 35.9918}'),(3,'Medical Sciences Building','East Wing','{\"x\": 32.4960, \"y\": 35.9925}'),(4,'IT Faculty','West Campus','{\"x\": 32.4948, \"y\": 35.9904}');
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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event_rsvps`
--

LOCK TABLES `event_rsvps` WRITE;
/*!40000 ALTER TABLE `event_rsvps` DISABLE KEYS */;
INSERT INTO `event_rsvps` VALUES (1,1,1,'Going','2025-05-15 23:01:44'),(2,2,2,'Going','2025-05-15 23:01:44'),(3,3,3,'Going','2025-05-15 23:01:44'),(4,1,3,'Going','2025-05-15 23:01:44');
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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
INSERT INTO `events` VALUES (1,'AI & Healthcare','Exploring how AI is transforming medical practices.','Academic','2025-06-01','10:00:00',6,1,'Approved',NULL),(2,'Hackathon 2025','48-hour coding competition for all majors.','Academic','2025-06-05','09:00:00',6,2,'Approved',NULL),(3,'Book Club Meetup','Discussing the novel of the month.','Social','2025-06-10','14:00:00',7,3,'Approved',NULL),(4,'TechTalk: Cloud Computing','Intro to cloud tech for beginners.','Workshop','2025-06-15','12:00:00',6,5,'Pending',NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feedback`
--

LOCK TABLES `feedback` WRITE;
/*!40000 ALTER TABLE `feedback` DISABLE KEYS */;
INSERT INTO `feedback` VALUES (1,1,1,'Very insightful talk on AI in medicine!',5,'2025-05-15 23:02:27','2025-05-16 17:06:18',0),(2,2,2,'Loved the hackathon energy!',4,'2025-05-15 23:02:27','2025-05-16 17:06:18',0),(3,3,3,'Great discussion in the book club!',5,'2025-05-15 23:02:27','2025-05-16 17:06:18',0),(4,3,1,'Enjoyed sharing thoughts with others.',4,'2025-05-15 23:02:27','2025-05-16 17:06:18',0),(7,1,75,'lovee it ',3,'2025-05-16 14:38:28','2025-05-16 17:06:18',0),(9,1,38,'Perfeeect!!!!!!!',5,'2025-05-16 17:20:07','2025-05-16 17:50:23',1);
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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `map_coordinates`
--

LOCK TABLES `map_coordinates` WRITE;
/*!40000 ALTER TABLE `map_coordinates` DISABLE KEYS */;
INSERT INTO `map_coordinates` VALUES (1,1,32.4951,35.9912,0),(2,1,32.4952,35.9913,1),(3,1,32.4953,35.9914,2);
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
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (1,1,'You successfully RSVPed to \"AI & Healthcare\".','success',0,'2025-05-15 23:03:47'),(2,2,'You successfully RSVPed to \"Hackathon 2025\".','success',0,'2025-05-15 23:03:47'),(3,3,'You successfully RSVPed to \"Book Club Meetup\".','success',0,'2025-05-15 23:03:47'),(4,1,'Thank you for your feedback on \"Book Club Meetup\".','info',0,'2025-05-15 23:03:47'),(5,2,'Thank you for your feedback on \"Hackathon 2025\".','info',0,'2025-05-15 23:03:47'),(6,1,'Your booking for Study Room 101 was approved.','success',0,'2025-05-15 23:03:47'),(7,7,'New feedback received on your event \"Book Club Meetup\".','info',0,'2025-05-16 13:07:38'),(8,6,'New feedback received on your event \"AI & Healthcare\".','info',0,'2025-05-16 14:24:28'),(9,6,'New feedback received on your event \"AI & Healthcare\".','info',0,'2025-05-16 14:38:28'),(10,6,'New feedback received on your event \"AI & Healthcare\".','info',0,'2025-05-16 17:00:09'),(11,6,'New feedback received on your event \"AI & Healthcare\".','info',0,'2025-05-16 17:20:08');
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
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `refresh_tokens`
--

LOCK TABLES `refresh_tokens` WRITE;
/*!40000 ALTER TABLE `refresh_tokens` DISABLE KEYS */;
INSERT INTO `refresh_tokens` VALUES (1,38,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzgsImVtYWlsIjoib3JnZGFzaEBqdXN0LmVkdS5qbyIsImlhdCI6MTc0NzQwMDg0MCwiZXhwIjoxNzQ4MDA1NjQwfQ.n3omQzXoZKKqAJy8KCrpfM1PxvbBo16CYBut38KKJpQ','2025-05-16 13:07:20'),(2,38,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzgsImVtYWlsIjoib3JnZGFzaEBqdXN0LmVkdS5qbyIsImlhdCI6MTc0NzQwMjg2NiwiZXhwIjoxNzQ4MDA3NjY2fQ.-QQLUsLI6xYYjun6TN_-mA3RM5NabHEy0iROr-fOBjQ','2025-05-16 13:41:06'),(3,38,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzgsImVtYWlsIjoib3JnZGFzaEBqdXN0LmVkdS5qbyIsImlhdCI6MTc0NzQwNTQ2MiwiZXhwIjoxNzQ4MDEwMjYyfQ.ixjvm7JCpiOUcOYiIVn5jWDv6EVC51Xs5m9e24N-E5U','2025-05-16 14:24:22'),(4,38,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzgsImVtYWlsIjoib3JnZGFzaEBqdXN0LmVkdS5qbyIsImlhdCI6MTc0NzQwNTk3OCwiZXhwIjoxNzQ4MDEwNzc4fQ.zru_sI8i6oRhNzfSc6U1jqVXmlUBeFfXnU9YhZtdzg8','2025-05-16 14:32:58'),(5,75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoibmFkYUNhbXB1c0BnbWFpbC5jb20iLCJpYXQiOjE3NDc0MDYyOTgsImV4cCI6MTc0ODAxMTA5OH0.ntvdU2da2GAN5zi_xcgfv4q95Uqpudm7NArCqnWASfM','2025-05-16 14:38:18'),(6,38,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzgsImVtYWlsIjoib3JnZGFzaEBqdXN0LmVkdS5qbyIsImlhdCI6MTc0NzQwNjc2NiwiZXhwIjoxNzQ4MDExNTY2fQ.lJ46U6IWNB2_x9wWM6QUpjN4UQyhFJcpGslaXtJnBDk','2025-05-16 14:46:06'),(7,38,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzgsImVtYWlsIjoib3JnZGFzaEBqdXN0LmVkdS5qbyIsImlhdCI6MTc0NzQwNjc3NSwiZXhwIjoxNzQ4MDExNTc1fQ.dh17i-r3Oe6E8lkaR9s4DuUTT609KTQ6PG4n-w3F19w','2025-05-16 14:46:15'),(8,75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoibmFkYUNhbXB1c0BnbWFpbC5jb20iLCJpYXQiOjE3NDc0MDY4MDAsImV4cCI6MTc0ODAxMTYwMH0.S9iCjNDRzLXMuKPog9bAwj1t8eSb-RiiQ3enw4cI1CQ','2025-05-16 14:46:40'),(9,75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoibmFkYUNhbXB1c0BnbWFpbC5jb20iLCJpYXQiOjE3NDc0MDcyNTcsImV4cCI6MTc0ODAxMjA1N30.ObRqSV2wU1O-9vWVW8KCncxW-g9VFv4_2Jz8vPK_Zb4','2025-05-16 14:54:17'),(10,38,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzgsImVtYWlsIjoib3JnZGFzaEBqdXN0LmVkdS5qbyIsImlhdCI6MTc0NzQwNzM3NCwiZXhwIjoxNzQ4MDEyMTc0fQ.ST2akz2UFoKlWMdBc63J3QYhZTlF0iiW-yF-uMKepq4','2025-05-16 14:56:14'),(11,38,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzgsImVtYWlsIjoib3JnZGFzaEBqdXN0LmVkdS5qbyIsImlhdCI6MTc0NzQwNzUwMywiZXhwIjoxNzQ4MDEyMzAzfQ.XIthcjl4Qp2E93PMU4UEfYQpxlvQ6EmVWYK-YPwLPTk','2025-05-16 14:58:23'),(12,38,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzgsImVtYWlsIjoib3JnZGFzaEBqdXN0LmVkdS5qbyIsImlhdCI6MTc0NzQxMTkzMywiZXhwIjoxNzQ4MDE2NzMzfQ.0cUmZMvhbBkOMC8YW4QhTlYxnUPCc4XGgJKGGSfWPYs','2025-05-16 16:12:13'),(13,38,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzgsImVtYWlsIjoib3JnZGFzaEBqdXN0LmVkdS5qbyIsImlhdCI6MTc0NzQxMjE3OSwiZXhwIjoxNzQ4MDE2OTc5fQ.EaE5Yg0CNP3Ix-1NNdAJIKFgWCunoYl2p4DUi1vQoqo','2025-05-16 16:16:19'),(14,38,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzgsImVtYWlsIjoib3JnZGFzaEBqdXN0LmVkdS5qbyIsImlhdCI6MTc0NzQxMjIzMSwiZXhwIjoxNzQ4MDE3MDMxfQ.rKiEkUQ-EFPaCwLYgEnzpokXDVw88VmI5KF11maB1sQ','2025-05-16 16:17:11'),(15,38,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzgsImVtYWlsIjoib3JnZGFzaEBqdXN0LmVkdS5qbyIsImlhdCI6MTc0NzQxMjUwMywiZXhwIjoxNzQ4MDE3MzAzfQ._DDCCiv-MsOIfZ0-5zA1MPhhrmliyoG4PSuyVSOYjeU','2025-05-16 16:21:43'),(16,38,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzgsImVtYWlsIjoib3JnZGFzaEBqdXN0LmVkdS5qbyIsImlhdCI6MTc0NzQxMjY1MSwiZXhwIjoxNzQ4MDE3NDUxfQ.vRGyRllYUdLpmWQbxE07KI3Csc0xXMwh264K49IWu0I','2025-05-16 16:24:11'),(17,38,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzgsImVtYWlsIjoib3JnZGFzaEBqdXN0LmVkdS5qbyIsImlhdCI6MTc0NzQxMzE1OSwiZXhwIjoxNzQ4MDE3OTU5fQ.KLAxuFZ1FqWsguMmmHDpEw5mNAlVtY6AJN3NrptP45o','2025-05-16 16:32:39'),(18,38,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzgsImVtYWlsIjoib3JnZGFzaEBqdXN0LmVkdS5qbyIsImlhdCI6MTc0NzQxMzg5OCwiZXhwIjoxNzQ4MDE4Njk4fQ.jgr2d-wI6tYrmbF0bj6o5Auwll7vl8leHF79lB7_K_E','2025-05-16 16:44:58'),(19,38,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzgsImVtYWlsIjoib3JnZGFzaEBqdXN0LmVkdS5qbyIsImlhdCI6MTc0NzQxNDEzMCwiZXhwIjoxNzQ4MDE4OTMwfQ.8jl0DZ8NTm5K9pukhESVgKFoakQpgeUexhDzoV5j7yo','2025-05-16 16:48:50'),(20,38,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzgsImVtYWlsIjoib3JnZGFzaEBqdXN0LmVkdS5qbyIsImlhdCI6MTc0NzQxNDUyOCwiZXhwIjoxNzQ4MDE5MzI4fQ.SzdC4rLNcruheSG5hEggvXTz90o0Dex9AFnks0PAv1w','2025-05-16 16:55:28'),(21,38,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzgsImVtYWlsIjoib3JnZGFzaEBqdXN0LmVkdS5qbyIsImlhdCI6MTc0NzQxNTk4MSwiZXhwIjoxNzQ4MDIwNzgxfQ.zHE1SF64sHScd-X1uydD6QlmAp7fpwtcmzXf78jpksE','2025-05-16 17:19:41'),(22,38,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzgsImVtYWlsIjoib3JnZGFzaEBqdXN0LmVkdS5qbyIsImlhdCI6MTc0NzQxNjE0NSwiZXhwIjoxNzQ4MDIwOTQ1fQ.iVN5bNVyHPnyfJ9-JFzOJIAxXMMZwufKp6VBDDWfx2o','2025-05-16 17:22:25'),(23,38,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzgsImVtYWlsIjoib3JnZGFzaEBqdXN0LmVkdS5qbyIsImlhdCI6MTc0NzQxNzExMiwiZXhwIjoxNzQ4MDIxOTEyfQ.lyC_Ww907j9ySjTEhcyo04WrnkCxyWaRMM3rG1uns-s','2025-05-16 17:38:32');
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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `room_bookings`
--

LOCK TABLES `room_bookings` WRITE;
/*!40000 ALTER TABLE `room_bookings` DISABLE KEYS */;
INSERT INTO `room_bookings` VALUES (1,1,1,'Study group for Algorithms','2025-06-02 14:00:00','2025-06-02 16:00:00','Approved','2025-05-16 02:01:23','2025-05-16 02:01:23'),(2,2,2,'Hackathon prep session','2025-06-04 10:00:00','2025-06-04 12:00:00','Approved','2025-05-16 02:01:23','2025-05-16 02:01:23'),(3,3,3,'Book discussion planning','2025-06-08 13:00:00','2025-06-08 14:30:00','Pending','2025-05-16 02:01:23','2025-05-16 02:01:23'),(4,1,5,'Project meeting','2025-06-10 15:00:00','2025-06-10 16:30:00','Rejected','2025-05-16 02:01:23','2025-05-16 02:01:23');
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
  PRIMARY KEY (`id`),
  KEY `fk_room_building` (`building_id`),
  CONSTRAINT `fk_room_building` FOREIGN KEY (`building_id`) REFERENCES `buildings` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rooms`
--

LOCK TABLES `rooms` WRITE;
/*!40000 ALTER TABLE `rooms` DISABLE KEYS */;
INSERT INTO `rooms` VALUES (1,'Study Room 101',6,'Study Room','Available','Quiet study space with whiteboard',1,1,'{\"x\": 32.4951, \"y\": 35.9913}'),(2,'Lab A204',25,'Lab','Available','Equipped with 25 PCs',1,2,'{\"x\": 32.4952, \"y\": 35.9915}'),(3,'Library Seminar Room',20,'Meeting Room','Available','Used for workshops and seminars',2,1,'{\"x\": 32.4956, \"y\": 35.9919}'),(4,'Auditorium B',100,'Classroom','Available','Large event space for guest lectures',3,0,'{\"x\": 32.4961, \"y\": 35.9926}'),(5,'IT Conference Room',12,'Meeting Room','Available','Used for departmental meetings',4,1,'{\"x\": 32.4949, \"y\": 35.9906}');
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
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `saved_events`
--

LOCK TABLES `saved_events` WRITE;
/*!40000 ALTER TABLE `saved_events` DISABLE KEYS */;
INSERT INTO `saved_events` VALUES (1,1,2,'2025-05-15 23:02:47'),(2,2,1,'2025-05-15 23:02:47'),(3,3,3,'2025-05-15 23:02:47'),(7,38,1,'2025-05-16 13:49:03');
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
) ENGINE=InnoDB AUTO_INCREMENT=78 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Nada Samara','nada@college.just.edu.jo','$2b$10$xyz123student1','Student',NULL,1,NULL,'Local',NULL,'2025-04-28 04:37:59',NULL,NULL,NULL),(2,'Ahmad Alhashash','ahmad@college.just.edu.jo','$2b$10$xyz123student2','Student',NULL,1,NULL,'Local',NULL,'2025-04-28 04:37:59',NULL,NULL,NULL),(3,'Amer Rabi','amer@college.just.edu.jo','$2b$10$xyz123student3','Student',NULL,1,NULL,'Local',NULL,'2025-04-28 04:37:59',NULL,NULL,NULL),(4,'Lara Allouh','lara@college.just.edu.jo','$2b$10$xyz123student4','Student',NULL,1,NULL,'Local',NULL,'2025-04-28 04:37:59',NULL,NULL,NULL),(5,'Mohammad Naim','mohammad@college.just.edu.jo','$2b$10$xyz123student5','Student',NULL,1,NULL,'Local',NULL,'2025-04-28 04:37:59',NULL,NULL,NULL),(6,'Engineering Club','engclub@just.edu.jo',NULL,'Organizer',NULL,1,NULL,'Google',NULL,'2025-04-28 04:37:59',NULL,NULL,NULL),(7,'Medical Club','medclub@just.edu.jo',NULL,'Organizer',NULL,1,NULL,'Google',NULL,'2025-04-28 04:37:59',NULL,NULL,NULL),(8,'Dean Office','deanoffice@just.edu.jo',NULL,'Campus Admin',NULL,1,NULL,'Microsoft',NULL,'2025-04-28 04:37:59',NULL,NULL,NULL),(9,'Library Admin','libraryadmin@just.edu.jo',NULL,'Campus Admin',NULL,1,NULL,'Microsoft',NULL,'2025-04-28 04:37:59',NULL,NULL,NULL),(10,'External Visitor','visitor1@gmail.com',NULL,'Visitor',NULL,1,NULL,'Local',NULL,'2025-04-28 04:37:59',NULL,NULL,NULL),(11,'System Super Admin','admin@just.edu.jo','$2b$10$xyz123admin','System Admin',NULL,1,NULL,'Local',NULL,'2025-04-28 04:37:59',NULL,NULL,NULL),(35,'testStudent','nrabee20@gmail.com','$2b$10$iJCAKtpzPy2zeVe4X8.JWuvC9UI.E0YlciNJvIEnOIGMrkX31DjA2','System Admin',NULL,1,NULL,'Local',NULL,'2025-04-29 16:08:50',NULL,NULL,'2025-04-30 23:16:22'),(36,'Nada Samara','nrabee02@gmail.com','$2b$10$z9Pp3DIH88RKfzcQma3mIevdzr./Hy6UH.rFhXDhTdI3VbT1La3ZG','Organizer','Organizer',1,NULL,'Local',NULL,'2025-04-29 21:36:59',NULL,NULL,'2025-05-08 22:58:20'),(38,'Organizer Dashboard','orgdash@just.edu.jo','$2b$10$zVd4rEhDvrGbUKHzIlxvH.Bho7yJMScCFIA1gOgeDZeD5iwRoeCGi','Organizer',NULL,1,NULL,'Local',NULL,'2025-05-08 21:40:40',NULL,NULL,'2025-05-16 17:38:32'),(75,'Nada','nadaCampus@gmail.com','$2b$10$qms1A70DYtMAnUdQEiOnNeburJ6o56DhS143AWxjhYrESh0nv22yi','Campus Admin','Campus Admin',1,NULL,'Local',NULL,'2025-05-09 13:51:19',NULL,NULL,'2025-05-16 14:54:17'),(76,'Ali','ali@gmail.com','$2b$10$98koLIHBM2TIu.MRPLXG4ufeJeCdfTrp9NcaiYYIBke3B9qK03LQ6','Student',NULL,1,NULL,'Local',NULL,'2025-05-09 23:26:07',NULL,NULL,'2025-05-11 07:36:55'),(77,'Nada Samara','nrsamara20@gmail.com',NULL,'Pending',NULL,1,NULL,'Google',NULL,'2025-05-11 07:54:27',NULL,NULL,NULL);
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

-- Dump completed on 2025-05-16 21:00:41
