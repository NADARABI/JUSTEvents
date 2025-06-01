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
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `approvals`
--

LOCK TABLES `approvals` WRITE;
/*!40000 ALTER TABLE `approvals` DISABLE KEYS */;
INSERT INTO `approvals` VALUES (2,11,'Room Booking',3,'Pending',NULL,NULL),(4,88,'Event',6,'Rejected','Iiiiiii','2025-05-26 17:48:40'),(5,88,'Event',7,'Rejected','llll','2025-05-26 19:08:50'),(8,NULL,'Event',1,'Pending',NULL,NULL),(9,NULL,'Event',2,'Pending',NULL,NULL),(10,88,'Event',7,'Rejected','llll','2025-05-26 19:08:50'),(11,88,'Event',9,'Approved','','2025-05-26 19:08:44');
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
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `buildings`
--

LOCK TABLES `buildings` WRITE;
/*!40000 ALTER TABLE `buildings` DISABLE KEYS */;
INSERT INTO `buildings` VALUES (1,'Engineering Complex','North Campus','{\"x\": 32.4951, \"y\": 35.9912}'),(2,'Library Block','Central Campus','{\"x\": 32.4955, \"y\": 35.9918}'),(3,'Medical Sciences Building','East Wing','{\"x\": 32.4960, \"y\": 35.9925}'),(5,'Engineering Building',NULL,NULL),(6,'IT Building',NULL,NULL),(7,'Science Block',NULL,NULL),(8,'Library',NULL,NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event_rsvps`
--

LOCK TABLES `event_rsvps` WRITE;
/*!40000 ALTER TABLE `event_rsvps` DISABLE KEYS */;
INSERT INTO `event_rsvps` VALUES (1,1,1,'Going','2025-05-15 23:01:44'),(2,2,2,'Going','2025-05-15 23:01:44'),(3,3,3,'Going','2025-05-15 23:01:44'),(4,1,3,'Going','2025-05-15 23:01:44'),(7,87,1,'Not Going','2025-05-16 21:11:22'),(8,87,3,'Not Going','2025-05-17 17:08:04'),(9,87,9,'Not Going','2025-05-30 18:30:36'),(10,85,3,'Not Going','2025-06-01 11:20:19');
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
INSERT INTO `events` VALUES (1,'AI & Healthcare','Exploring how AI is transforming medical practices.','Academic','2025-06-01','10:00:00',6,1,'Pending',NULL),(2,'Hackathon 2025','48-hour coding competition for all majors.','Academic','2025-06-05','09:00:00',6,2,'Pending',NULL),(3,'Book Club Meetup','Discussing the novel of the month.','Social','2025-06-10','14:00:00',7,3,'Approved',NULL),(7,'Test Event','Description','General','2025-05-29','09:58:00',38,2,'Rejected','event-1747767544219.jpg'),(9,'AI Symposium','A deep dive into AI tools','General','2025-06-01','10:00:00',5,1,'Approved',NULL),(10,'Expired Event 1','Old approved event 1','General','2024-06-01','09:00:00',5,1,'Expired',NULL),(11,'Expired Event 2','Old approved event 2','General','2024-05-15','14:00:00',5,1,'Expired',NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feedback`
--

LOCK TABLES `feedback` WRITE;
/*!40000 ALTER TABLE `feedback` DISABLE KEYS */;
INSERT INTO `feedback` VALUES (1,1,1,'Very insightful talk on AI in medicine!',5,'2025-05-15 23:02:27','2025-05-16 17:06:18',0),(2,2,2,'Loved the hackathon energy!',4,'2025-05-15 23:02:27','2025-05-16 17:06:18',0),(3,3,3,'Great discussion in the book club!',5,'2025-05-15 23:02:27','2025-05-16 17:06:18',0),(4,3,1,'Enjoyed sharing thoughts with others.',4,'2025-05-15 23:02:27','2025-05-16 17:06:18',0),(7,1,75,'lovee it ',3,'2025-05-16 14:38:28','2025-05-16 17:06:18',0),(9,1,38,'Perfeeect!!!!!!!',5,'2025-05-16 17:20:07','2025-05-16 17:50:23',1),(10,3,88,'peerfect',5,'2025-05-27 08:42:28','2025-05-27 08:42:28',0),(12,3,87,'naddddaaamn nm  ',5,'2025-05-30 19:39:03','2025-05-30 20:02:43',1);
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
) ENGINE=InnoDB AUTO_INCREMENT=97 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (1,1,'You successfully RSVPed to \"AI & Healthcare\".','success',0,'2025-05-15 23:03:47'),(2,2,'You successfully RSVPed to \"Hackathon 2025\".','success',0,'2025-05-15 23:03:47'),(3,3,'You successfully RSVPed to \"Book Club Meetup\".','success',0,'2025-05-15 23:03:47'),(4,1,'Thank you for your feedback on \"Book Club Meetup\".','info',0,'2025-05-15 23:03:47'),(5,2,'Thank you for your feedback on \"Hackathon 2025\".','info',0,'2025-05-15 23:03:47'),(6,1,'Your booking for Study Room 101 was approved.','success',0,'2025-05-15 23:03:47'),(7,7,'New feedback received on your event \"Book Club Meetup\".','info',0,'2025-05-16 13:07:38'),(8,6,'New feedback received on your event \"AI & Healthcare\".','info',0,'2025-05-16 14:24:28'),(9,6,'New feedback received on your event \"AI & Healthcare\".','info',0,'2025-05-16 14:38:28'),(10,6,'New feedback received on your event \"AI & Healthcare\".','info',0,'2025-05-16 17:00:09'),(11,6,'New feedback received on your event \"AI & Healthcare\".','info',0,'2025-05-16 17:20:08'),(12,6,'A user has RSVP\'d to your event \"AI & Healthcare\".','info',0,'2025-05-16 21:06:08'),(13,87,'You successfully RSVPed to \"AI & Healthcare\".','success',1,'2025-05-16 21:06:08'),(14,87,'You canceled your RSVP for \"AI & Healthcare\".','warning',1,'2025-05-16 21:06:09'),(15,6,'A user canceled their RSVP for \"AI & Healthcare\".','warning',0,'2025-05-16 21:06:09'),(16,6,'A user has RSVP\'d to your event \"AI & Healthcare\".','info',0,'2025-05-16 21:06:43'),(17,87,'You successfully RSVPed to \"AI & Healthcare\".','success',1,'2025-05-16 21:06:43'),(18,87,'You canceled your RSVP for \"AI & Healthcare\".','warning',1,'2025-05-16 21:07:25'),(19,6,'A user canceled their RSVP for \"AI & Healthcare\".','warning',0,'2025-05-16 21:07:25'),(20,6,'A user has RSVP\'d to your event \"AI & Healthcare\".','info',0,'2025-05-16 21:11:22'),(21,87,'You successfully RSVPed to \"AI & Healthcare\".','success',1,'2025-05-16 21:11:22'),(22,87,'You canceled your RSVP for \"AI & Healthcare\".','warning',1,'2025-05-16 21:11:30'),(23,6,'A user canceled their RSVP for \"AI & Healthcare\".','warning',0,'2025-05-16 21:11:30'),(24,3,'Your room booking was approved.','success',0,'2025-05-16 22:13:23'),(25,3,'Your room booking was rejected.','warning',0,'2025-05-16 22:14:24'),(26,3,'Your room booking was rejected.','warning',0,'2025-05-16 22:14:39'),(27,1,'Your room booking was rejected.','warning',0,'2025-05-16 22:21:19'),(28,87,'You canceled your RSVP for \"AI & Healthcare\".','warning',1,'2025-05-17 17:07:58'),(29,6,'A user canceled their RSVP for \"AI & Healthcare\".','warning',0,'2025-05-17 17:07:58'),(30,7,'A user has RSVP\'d to your event \"Book Club Meetup\".','info',0,'2025-05-17 17:08:04'),(31,87,'You successfully RSVPed to \"Book Club Meetup\".','success',1,'2025-05-17 17:08:04'),(32,87,'You canceled your RSVP for \"Book Club Meetup\".','warning',1,'2025-05-17 17:08:16'),(33,7,'A user canceled their RSVP for \"Book Club Meetup\".','warning',0,'2025-05-17 17:08:16'),(34,7,'A user has RSVP\'d to your event \"Book Club Meetup\".','info',0,'2025-05-17 17:08:18'),(35,87,'You successfully RSVPed to \"Book Club Meetup\".','success',1,'2025-05-17 17:08:18'),(36,87,'You canceled your RSVP for \"Book Club Meetup\".','warning',1,'2025-05-17 17:08:20'),(37,7,'A user canceled their RSVP for \"Book Club Meetup\".','warning',0,'2025-05-17 17:08:20'),(38,3,'Your room booking was approved.','success',0,'2025-05-23 22:11:58'),(39,87,'You canceled your RSVP for \"Book Club Meetup\".','warning',1,'2025-05-24 22:32:02'),(40,7,'A user canceled their RSVP for \"Book Club Meetup\".','warning',0,'2025-05-24 22:32:02'),(41,7,'A user has RSVP\'d to your event \"Book Club Meetup\".','info',0,'2025-05-24 22:32:07'),(42,87,'You successfully RSVPed to \"Book Club Meetup\".','success',1,'2025-05-24 22:32:07'),(43,8,'New booking request from undefined for Study Room 101 on 2025-05-27T10:45.','info',0,'2025-05-26 07:45:34'),(44,9,'New booking request from undefined for Study Room 101 on 2025-05-27T10:45.','info',0,'2025-05-26 07:45:34'),(45,75,'New booking request from undefined for Study Room 101 on 2025-05-27T10:45.','info',0,'2025-05-26 07:45:34'),(46,8,'New booking request from undefined for Study Room 101 on 2025-05-27T01:42.','info',0,'2025-05-26 10:42:57'),(47,9,'New booking request from undefined for Study Room 101 on 2025-05-27T01:42.','info',0,'2025-05-26 10:42:57'),(48,75,'New booking request from undefined for Study Room 101 on 2025-05-27T01:42.','info',0,'2025-05-26 10:42:57'),(49,2,'Your room booking was rejected.','warning',0,'2025-05-26 11:04:06'),(50,38,'Your event \"nadnad edited this event\" was rejected.','warning',0,'2025-05-26 17:48:40'),(51,38,'Your event \"Test Event\" was approved.','success',1,'2025-05-26 17:56:26'),(52,5,'Your event \"AI Symposium\" was approved.','success',0,'2025-05-26 19:08:44'),(53,38,'Your event \"Test Event\" was rejected.','warning',0,'2025-05-26 19:08:50'),(54,88,'Your event \"AI Summit\" was approved.','success',1,'2025-05-26 19:55:41'),(55,88,'A new user requested organizer access.','info',0,'2025-05-26 19:55:41'),(57,7,'New feedback received on your event \"Book Club Meetup\".','info',0,'2025-05-27 08:42:28'),(58,87,'You canceled your RSVP for \"Book Club Meetup\".','warning',1,'2025-05-27 09:03:03'),(59,7,'A user canceled their RSVP for \"Book Club Meetup\".','warning',0,'2025-05-27 09:03:03'),(60,7,'A user has RSVP\'d to your event \"Book Club Meetup\".','info',0,'2025-05-27 09:04:05'),(61,87,'You successfully RSVPed to \"Book Club Meetup\".','success',1,'2025-05-27 09:04:05'),(62,87,'You canceled your RSVP for \"Book Club Meetup\".','warning',1,'2025-05-27 09:04:26'),(63,7,'A user canceled their RSVP for \"Book Club Meetup\".','warning',0,'2025-05-27 09:04:26'),(64,8,'New booking request from Organizer Dashboard for Lab A204 on 2025-05-29T11:10.','info',0,'2025-05-27 09:11:39'),(65,9,'New booking request from Organizer Dashboard for Lab A204 on 2025-05-29T11:10.','info',0,'2025-05-27 09:11:39'),(66,75,'New booking request from Organizer Dashboard for Lab A204 on 2025-05-29T11:10.','info',0,'2025-05-27 09:11:39'),(67,8,'New booking request from undefined for Study Room 101 on 2025-05-28T10:48.','info',0,'2025-05-27 19:48:46'),(68,9,'New booking request from undefined for Study Room 101 on 2025-05-28T10:48.','info',0,'2025-05-27 19:48:46'),(69,75,'New booking request from undefined for Study Room 101 on 2025-05-28T10:48.','info',0,'2025-05-27 19:48:46'),(70,5,'A user has RSVP\'d to your event \"AI Symposium\".','info',0,'2025-05-30 18:30:36'),(71,87,'You successfully RSVPed to \"AI Symposium\".','success',0,'2025-05-30 18:30:36'),(72,87,'You canceled your RSVP for \"AI Symposium\".','warning',0,'2025-05-30 18:30:41'),(73,5,'A user canceled their RSVP for \"AI Symposium\".','warning',0,'2025-05-30 18:30:41'),(74,87,'You canceled your RSVP for \"AI Symposium\".','warning',0,'2025-05-30 18:38:02'),(75,5,'A user canceled their RSVP for \"AI Symposium\".','warning',0,'2025-05-30 18:38:02'),(76,5,'A user has RSVP\'d to your event \"AI Symposium\".','info',0,'2025-05-30 18:38:04'),(77,87,'You successfully RSVPed to \"AI Symposium\".','success',0,'2025-05-30 18:38:04'),(78,87,'You canceled your RSVP for \"Book Club Meetup\".','warning',1,'2025-05-30 18:38:11'),(79,7,'A user canceled their RSVP for \"Book Club Meetup\".','warning',0,'2025-05-30 18:38:11'),(80,87,'You canceled your RSVP for \"AI Symposium\".','warning',1,'2025-05-30 18:38:17'),(81,5,'A user canceled their RSVP for \"AI Symposium\".','warning',0,'2025-05-30 18:38:17'),(82,7,'New feedback received on your event \"Book Club Meetup\".','info',0,'2025-05-30 19:17:55'),(83,7,'New feedback received on your event \"Book Club Meetup\".','info',0,'2025-05-30 19:39:03'),(84,5,'New feedback received on your event \"AI Symposium\".','info',0,'2025-05-30 20:02:08'),(85,7,'A user has RSVP\'d to your event \"Book Club Meetup\".','info',0,'2025-06-01 11:20:19'),(86,85,'You successfully RSVPed to \"Book Club Meetup\".','success',0,'2025-06-01 11:20:19'),(87,85,'You canceled your RSVP for \"Book Club Meetup\".','warning',0,'2025-06-01 11:20:24'),(88,7,'A user canceled their RSVP for \"Book Club Meetup\".','warning',0,'2025-06-01 11:20:24'),(89,8,'New booking request from undefined for Study Room 101 on 2025-06-01T16:26.','info',0,'2025-06-01 11:25:24'),(90,9,'New booking request from undefined for Study Room 101 on 2025-06-01T16:26.','info',0,'2025-06-01 11:25:24'),(91,75,'New booking request from undefined for Study Room 101 on 2025-06-01T16:26.','info',0,'2025-06-01 11:25:24'),(92,85,'Your room booking was approved.','success',0,'2025-06-01 11:25:56'),(93,8,'New booking request from undefined for Library Seminar Room on 2025-06-01T16:26.','info',0,'2025-06-01 11:27:01'),(94,9,'New booking request from undefined for Library Seminar Room on 2025-06-01T16:26.','info',0,'2025-06-01 11:27:01'),(95,75,'New booking request from undefined for Library Seminar Room on 2025-06-01T16:26.','info',0,'2025-06-01 11:27:01'),(96,85,'Your room booking was rejected.','warning',0,'2025-06-01 11:27:49');
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
) ENGINE=InnoDB AUTO_INCREMENT=182 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `refresh_tokens`
--

LOCK TABLES `refresh_tokens` WRITE;
/*!40000 ALTER TABLE `refresh_tokens` DISABLE KEYS */;
INSERT INTO `refresh_tokens` VALUES (1,38,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzgsImVtYWlsIjoib3JnZGFzaEBqdXN0LmVkdS5qbyIsImlhdCI6MTc0NzQwMDg0MCwiZXhwIjoxNzQ4MDA1NjQwfQ.n3omQzXoZKKqAJy8KCrpfM1PxvbBo16CYBut38KKJpQ','2025-05-16 13:07:20'),(2,38,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzgsImVtYWlsIjoib3JnZGFzaEBqdXN0LmVkdS5qbyIsImlhdCI6MTc0NzQwMjg2NiwiZXhwIjoxNzQ4MDA3NjY2fQ.-QQLUsLI6xYYjun6TN_-mA3RM5NabHEy0iROr-fOBjQ','2025-05-16 13:41:06'),(3,38,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzgsImVtYWlsIjoib3JnZGFzaEBqdXN0LmVkdS5qbyIsImlhdCI6MTc0NzQwNTQ2MiwiZXhwIjoxNzQ4MDEwMjYyfQ.ixjvm7JCpiOUcOYiIVn5jWDv6EVC51Xs5m9e24N-E5U','2025-05-16 14:24:22'),(4,38,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzgsImVtYWlsIjoib3JnZGFzaEBqdXN0LmVkdS5qbyIsImlhdCI6MTc0NzQwNTk3OCwiZXhwIjoxNzQ4MDEwNzc4fQ.zru_sI8i6oRhNzfSc6U1jqVXmlUBeFfXnU9YhZtdzg8','2025-05-16 14:32:58'),(5,75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoibmFkYUNhbXB1c0BnbWFpbC5jb20iLCJpYXQiOjE3NDc0MDYyOTgsImV4cCI6MTc0ODAxMTA5OH0.ntvdU2da2GAN5zi_xcgfv4q95Uqpudm7NArCqnWASfM','2025-05-16 14:38:18'),(6,38,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzgsImVtYWlsIjoib3JnZGFzaEBqdXN0LmVkdS5qbyIsImlhdCI6MTc0NzQwNjc2NiwiZXhwIjoxNzQ4MDExNTY2fQ.lJ46U6IWNB2_x9wWM6QUpjN4UQyhFJcpGslaXtJnBDk','2025-05-16 14:46:06'),(7,38,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzgsImVtYWlsIjoib3JnZGFzaEBqdXN0LmVkdS5qbyIsImlhdCI6MTc0NzQwNjc3NSwiZXhwIjoxNzQ4MDExNTc1fQ.dh17i-r3Oe6E8lkaR9s4DuUTT609KTQ6PG4n-w3F19w','2025-05-16 14:46:15'),(8,75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoibmFkYUNhbXB1c0BnbWFpbC5jb20iLCJpYXQiOjE3NDc0MDY4MDAsImV4cCI6MTc0ODAxMTYwMH0.S9iCjNDRzLXMuKPog9bAwj1t8eSb-RiiQ3enw4cI1CQ','2025-05-16 14:46:40'),(9,75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoibmFkYUNhbXB1c0BnbWFpbC5jb20iLCJpYXQiOjE3NDc0MDcyNTcsImV4cCI6MTc0ODAxMjA1N30.ObRqSV2wU1O-9vWVW8KCncxW-g9VFv4_2Jz8vPK_Zb4','2025-05-16 14:54:17'),(10,38,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzgsImVtYWlsIjoib3JnZGFzaEBqdXN0LmVkdS5qbyIsImlhdCI6MTc0NzQwNzM3NCwiZXhwIjoxNzQ4MDEyMTc0fQ.ST2akz2UFoKlWMdBc63J3QYhZTlF0iiW-yF-uMKepq4','2025-05-16 14:56:14'),(11,38,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzgsImVtYWlsIjoib3JnZGFzaEBqdXN0LmVkdS5qbyIsImlhdCI6MTc0NzQwNzUwMywiZXhwIjoxNzQ4MDEyMzAzfQ.XIthcjl4Qp2E93PMU4UEfYQpxlvQ6EmVWYK-YPwLPTk','2025-05-16 14:58:23'),(12,38,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzgsImVtYWlsIjoib3JnZGFzaEBqdXN0LmVkdS5qbyIsImlhdCI6MTc0NzQxMTkzMywiZXhwIjoxNzQ4MDE2NzMzfQ.0cUmZMvhbBkOMC8YW4QhTlYxnUPCc4XGgJKGGSfWPYs','2025-05-16 16:12:13'),(13,38,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzgsImVtYWlsIjoib3JnZGFzaEBqdXN0LmVkdS5qbyIsImlhdCI6MTc0NzQxMjE3OSwiZXhwIjoxNzQ4MDE2OTc5fQ.EaE5Yg0CNP3Ix-1NNdAJIKFgWCunoYl2p4DUi1vQoqo','2025-05-16 16:16:19'),(14,38,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzgsImVtYWlsIjoib3JnZGFzaEBqdXN0LmVkdS5qbyIsImlhdCI6MTc0NzQxMjIzMSwiZXhwIjoxNzQ4MDE3MDMxfQ.rKiEkUQ-EFPaCwLYgEnzpokXDVw88VmI5KF11maB1sQ','2025-05-16 16:17:11'),(15,38,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzgsImVtYWlsIjoib3JnZGFzaEBqdXN0LmVkdS5qbyIsImlhdCI6MTc0NzQxMjUwMywiZXhwIjoxNzQ4MDE3MzAzfQ._DDCCiv-MsOIfZ0-5zA1MPhhrmliyoG4PSuyVSOYjeU','2025-05-16 16:21:43'),(16,38,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzgsImVtYWlsIjoib3JnZGFzaEBqdXN0LmVkdS5qbyIsImlhdCI6MTc0NzQxMjY1MSwiZXhwIjoxNzQ4MDE3NDUxfQ.vRGyRllYUdLpmWQbxE07KI3Csc0xXMwh264K49IWu0I','2025-05-16 16:24:11'),(17,38,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzgsImVtYWlsIjoib3JnZGFzaEBqdXN0LmVkdS5qbyIsImlhdCI6MTc0NzQxMzE1OSwiZXhwIjoxNzQ4MDE3OTU5fQ.KLAxuFZ1FqWsguMmmHDpEw5mNAlVtY6AJN3NrptP45o','2025-05-16 16:32:39'),(18,38,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzgsImVtYWlsIjoib3JnZGFzaEBqdXN0LmVkdS5qbyIsImlhdCI6MTc0NzQxMzg5OCwiZXhwIjoxNzQ4MDE4Njk4fQ.jgr2d-wI6tYrmbF0bj6o5Auwll7vl8leHF79lB7_K_E','2025-05-16 16:44:58'),(19,38,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzgsImVtYWlsIjoib3JnZGFzaEBqdXN0LmVkdS5qbyIsImlhdCI6MTc0NzQxNDEzMCwiZXhwIjoxNzQ4MDE4OTMwfQ.8jl0DZ8NTm5K9pukhESVgKFoakQpgeUexhDzoV5j7yo','2025-05-16 16:48:50'),(20,38,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzgsImVtYWlsIjoib3JnZGFzaEBqdXN0LmVkdS5qbyIsImlhdCI6MTc0NzQxNDUyOCwiZXhwIjoxNzQ4MDE5MzI4fQ.SzdC4rLNcruheSG5hEggvXTz90o0Dex9AFnks0PAv1w','2025-05-16 16:55:28'),(21,38,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzgsImVtYWlsIjoib3JnZGFzaEBqdXN0LmVkdS5qbyIsImlhdCI6MTc0NzQxNTk4MSwiZXhwIjoxNzQ4MDIwNzgxfQ.zHE1SF64sHScd-X1uydD6QlmAp7fpwtcmzXf78jpksE','2025-05-16 17:19:41'),(22,38,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzgsImVtYWlsIjoib3JnZGFzaEBqdXN0LmVkdS5qbyIsImlhdCI6MTc0NzQxNjE0NSwiZXhwIjoxNzQ4MDIwOTQ1fQ.iVN5bNVyHPnyfJ9-JFzOJIAxXMMZwufKp6VBDDWfx2o','2025-05-16 17:22:25'),(23,38,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzgsImVtYWlsIjoib3JnZGFzaEBqdXN0LmVkdS5qbyIsImlhdCI6MTc0NzQxNzExMiwiZXhwIjoxNzQ4MDIxOTEyfQ.lyC_Ww907j9ySjTEhcyo04WrnkCxyWaRMM3rG1uns-s','2025-05-16 17:38:32'),(24,75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoibmFkYUNhbXB1c0BnbWFpbC5jb20iLCJpYXQiOjE3NDc0MzE5NTksImV4cCI6MTc0ODAzNjc1OX0.9EyD9OVvhp1thIdYsBF9oEt6YPAJQ5nDu0b3e09_4WQ','2025-05-16 21:45:59'),(25,75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoibmFkYUNhbXB1c0BnbWFpbC5jb20iLCJpYXQiOjE3NDc0MzMwNTAsImV4cCI6MTc0ODAzNzg1MH0.M0JDDV4pX3JA1rHkVAFNlWlbGeQWjUkpcIJ6lSe3mVs','2025-05-16 22:04:10'),(26,38,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzgsImVtYWlsIjoib3JnZGFzaEBqdXN0LmVkdS5qbyIsImlhdCI6MTc0NzQzMzk4MCwiZXhwIjoxNzQ4MDM4NzgwfQ.uJZMmRn17gcNkmzamG0AEBf8S1iCYaa05Yj1OTWf664','2025-05-16 22:19:40'),(27,75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoibmFkYUNhbXB1c0BnbWFpbC5jb20iLCJpYXQiOjE3NDc0MzM5OTMsImV4cCI6MTc0ODAzODc5M30.p8DSbN5rAKZuhyXwyiE7d3Jc7wf0lPjbvMFokXX3QUk','2025-05-16 22:19:53'),(28,75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoibmFkYUNhbXB1c0BnbWFpbC5jb20iLCJpYXQiOjE3NDc0MzU0NTcsImV4cCI6MTc0ODA0MDI1N30.KUtA4qed6KAkWKm5xGqHqLbS3agJ7nlha_6dPypTgdo','2025-05-16 22:44:17'),(29,75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoibmFkYUNhbXB1c0BnbWFpbC5jb20iLCJpYXQiOjE3NDc0MzY0MjgsImV4cCI6MTc0ODA0MTIyOH0.ZwID6PJy9ewhEbUGuWiS4HYyN06tE142LoHsrTFXfwM','2025-05-16 23:00:28'),(30,75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoibmFkYUNhbXB1c0BnbWFpbC5jb20iLCJpYXQiOjE3NDc0OTgxOTAsImV4cCI6MTc0ODEwMjk5MH0.MTUE1WTzEzKt3pg5Jx3-hHPQKflQgq5gBwNm8REcpGU','2025-05-17 16:09:50'),(31,75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoibmFkYUNhbXB1c0BnbWFpbC5jb20iLCJpYXQiOjE3NDc0OTkzNDEsImV4cCI6MTc0ODEwNDE0MX0.oltQHb5niaLJKrNtdJD929WJtxPxVwc8osk68UupeKI','2025-05-17 16:29:01'),(32,75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoibmFkYUNhbXB1c0BnbWFpbC5jb20iLCJpYXQiOjE3NDc1MDAxOTIsImV4cCI6MTc0ODEwNDk5Mn0.AjV6Scz1-OV_Idrpp4IvUPreCR_7csqrwK8gBKxMGNU','2025-05-17 16:43:12'),(33,75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoibmFkYUNhbXB1c0BnbWFpbC5jb20iLCJpYXQiOjE3NDc1MDA3ODYsImV4cCI6MTc0ODEwNTU4Nn0.nBOUDVKAH-9aW3EjWMuIVZjiryxUJd9tP977xguMOkQ','2025-05-17 16:53:06'),(34,75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoibmFkYUNhbXB1c0BnbWFpbC5jb20iLCJpYXQiOjE3NDc1MDcwNDksImV4cCI6MTc0ODExMTg0OX0.kK20sotlyoiWMdYQxsyYSPpR4e1G98NXxajTEIAK6vs','2025-05-17 18:37:29'),(35,38,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzgsImVtYWlsIjoib3JnZGFzaEBqdXN0LmVkdS5qbyIsImlhdCI6MTc0NzY1NjUwNSwiZXhwIjoxNzQ4MjYxMzA1fQ.jk8nghKnmYqabv-YBJx2pWZ3UmkhiyAThO3iVrEqv7U','2025-05-19 12:08:25'),(36,75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoibmFkYUNhbXB1c0BnbWFpbC5jb20iLCJpYXQiOjE3NDc2NTY1MjAsImV4cCI6MTc0ODI2MTMyMH0.erWOd76BO_72sBx-PkbUBiAKD7KOBckSj_fiNM-Aqxw','2025-05-19 12:08:40'),(37,75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoibmFkYUNhbXB1c0BnbWFpbC5jb20iLCJpYXQiOjE3NDc2NjA2MTgsImV4cCI6MTc0ODI2NTQxOH0.OhJ54oetyWbhFviQ0RgGEwp_ReWYoPNKKKu204jH460','2025-05-19 13:16:58'),(38,75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoibmFkYUNhbXB1c0BnbWFpbC5jb20iLCJpYXQiOjE3NDc2NjU5NTYsImV4cCI6MTc0ODI3MDc1Nn0.7niGUnjHfbcl-BuNRvAa4XzoBocu4FzCmqgTo5yIOLk','2025-05-19 14:45:56'),(39,75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoibmFkYUNhbXB1c0BnbWFpbC5jb20iLCJpYXQiOjE3NDc2NzA0NDcsImV4cCI6MTc0ODI3NTI0N30.bGYl1DXkoBasV6e3M9nmjOk0CcWTO9HgcZbYKzR0Hy8','2025-05-19 16:00:47'),(40,75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoibmFkYUNhbXB1c0BnbWFpbC5jb20iLCJpYXQiOjE3NDc2NzI0ODgsImV4cCI6MTc0ODI3NzI4OH0.VS5O2cmVtumUJ71Rm7CBX0iZUDVHG0JuU-5RnrjIrYY','2025-05-19 16:34:48'),(41,75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoibmFkYUNhbXB1c0BnbWFpbC5jb20iLCJpYXQiOjE3NDc2NzM2MjAsImV4cCI6MTc0ODI3ODQyMH0.WbpXSaM5NHKdYei4YsZcKBlal_xS1bdV2T2qIAFUGwk','2025-05-19 16:53:40'),(42,75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoibmFkYUNhbXB1c0BnbWFpbC5jb20iLCJpYXQiOjE3NDc2NzQ4MTcsImV4cCI6MTc0ODI3OTYxN30.CJMm86Er9auHlfAU9WZW_QI61Ek5Hd1b5Xc_mDunkXo','2025-05-19 17:13:37'),(43,75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoibmFkYUNhbXB1c0BnbWFpbC5jb20iLCJpYXQiOjE3NDc2NzU5OTIsImV4cCI6MTc0ODI4MDc5Mn0.lvCsN4tORk-aSxR3RBNDR7IW4NTjiSnQWarFtlFXv2E','2025-05-19 17:33:12'),(44,75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoibmFkYUNhbXB1c0BnbWFpbC5jb20iLCJpYXQiOjE3NDc2NzkwNzksImV4cCI6MTc0ODI4Mzg3OX0.EIJDIZ5fmAd-WafVuvlH4mCMNljxUrjN0Z1OO0jRJV4','2025-05-19 18:24:39'),(45,75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoibmFkYUNhbXB1c0BnbWFpbC5jb20iLCJpYXQiOjE3NDc2ODE0OTgsImV4cCI6MTc0ODI4NjI5OH0.nOOWotTSgeQYSyHanIGA-kO0qSGjsFRMEAOCoDnjv9I','2025-05-19 19:04:58'),(46,75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoibmFkYUNhbXB1c0BnbWFpbC5jb20iLCJpYXQiOjE3NDc2ODI0NDEsImV4cCI6MTc0ODI4NzI0MX0.PH59p98PS7cfKvxtBa_as8XYtRUyqfa9zpxHUqjBvVA','2025-05-19 19:20:41'),(47,75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoibmFkYUNhbXB1c0BnbWFpbC5jb20iLCJpYXQiOjE3NDc2ODI5OTMsImV4cCI6MTc0ODI4Nzc5M30.UxYZVYh_msKvB9y2tSKKRHt-N1P1cvRm7QnjTute1yo','2025-05-19 19:29:53'),(48,75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoibmFkYUNhbXB1c0BnbWFpbC5jb20iLCJpYXQiOjE3NDc2ODMyNDgsImV4cCI6MTc0ODI4ODA0OH0.oZBkJEzTQsuBdgPh_Rap0PPXqv6jEJV_5gyAwVnuSRU','2025-05-19 19:34:08'),(49,75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoibmFkYUNhbXB1c0BnbWFpbC5jb20iLCJpYXQiOjE3NDc2ODQzMTAsImV4cCI6MTc0ODI4OTExMH0.R-p_PQmS_mRNgp5PoxxfI35VsLmxyYjJbp1_ddfrvbY','2025-05-19 19:51:50'),(50,38,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzgsImVtYWlsIjoib3JnZGFzaEBqdXN0LmVkdS5qbyIsImlhdCI6MTc0NzY4NDM0MCwiZXhwIjoxNzQ4Mjg5MTQwfQ.ib6SbiHvyDwUovTrVbiCCAc5qdGRsD7CKESB9WXpNTQ','2025-05-19 19:52:20'),(51,38,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzgsImVtYWlsIjoib3JnZGFzaEBqdXN0LmVkdS5qbyIsImlhdCI6MTc0Nzc2MDM4NiwiZXhwIjoxNzQ4MzY1MTg2fQ.kv-qwOhRgZ-psl4M48nOSYrQe755JRNhW-UJdNyqMcg','2025-05-20 16:59:46'),(52,38,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzgsImVtYWlsIjoib3JnZGFzaEBqdXN0LmVkdS5qbyIsImlhdCI6MTc0Nzc2MDc3MywiZXhwIjoxNzQ4MzY1NTczfQ.lhgx1Jw24K_5ONqa14d8A7frRMvKFIjqF7vVNszc3KE','2025-05-20 17:06:13'),(53,38,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzgsImVtYWlsIjoib3JnZGFzaEBqdXN0LmVkdS5qbyIsImlhdCI6MTc0Nzc2MTc1NCwiZXhwIjoxNzQ4MzY2NTU0fQ.4fKCQpMJ87PEA-Ha28GzgnJGYDZQBH-96-gC9tpFBqA','2025-05-20 17:22:34'),(54,38,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzgsImVtYWlsIjoib3JnZGFzaEBqdXN0LmVkdS5qbyIsImlhdCI6MTc0Nzc2MzIzNywiZXhwIjoxNzQ4MzY4MDM3fQ.LwJ7j8y36P1NVPLg9GTXk0xDrzhRTv0GLizHUuNVNB4','2025-05-20 17:47:17'),(55,38,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzgsImVtYWlsIjoib3JnZGFzaEBqdXN0LmVkdS5qbyIsImlhdCI6MTc0Nzc2NDM0NywiZXhwIjoxNzQ4MzY5MTQ3fQ.GbtChnOan_kIY5wLYFmKVsBH-qZzWmm0ru8yBT3qdok','2025-05-20 18:05:47'),(56,38,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzgsImVtYWlsIjoib3JnZGFzaEBqdXN0LmVkdS5qbyIsImlhdCI6MTc0Nzc2NTU4NSwiZXhwIjoxNzQ4MzcwMzg1fQ.hhyIEFA8tHAhtM7pylxk9iIgtWTkEWLSJaSKhmKyUh8','2025-05-20 18:26:25'),(57,38,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzgsImVtYWlsIjoib3JnZGFzaEBqdXN0LmVkdS5qbyIsImlhdCI6MTc0Nzc2NzQ5NCwiZXhwIjoxNzQ4MzcyMjk0fQ.7p2361yQ0-JxtfY5UVB_lR6sk_ODc4fBINT84PGmkHY','2025-05-20 18:58:14'),(58,38,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzgsImVtYWlsIjoib3JnZGFzaEBqdXN0LmVkdS5qbyIsImlhdCI6MTc0Nzc2ODI3OCwiZXhwIjoxNzQ4MzczMDc4fQ.nJWrAX2LiBrLA5jDujIa22CA0QZMQCZ_LCaZun66GWI','2025-05-20 19:11:18'),(59,38,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzgsImVtYWlsIjoib3JnZGFzaEBqdXN0LmVkdS5qbyIsImlhdCI6MTc0Nzc2ODg3OSwiZXhwIjoxNzQ4MzczNjc5fQ.9mw40YkLFthP6hL61FN63ZZgJk2u9mhBUpba0fF2j14','2025-05-20 19:21:19'),(60,38,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzgsImVtYWlsIjoib3JnZGFzaEBqdXN0LmVkdS5qbyIsImlhdCI6MTc0Nzc2OTYxMywiZXhwIjoxNzQ4Mzc0NDEzfQ.MFmMdZBQR6J3a4shrtxRMBy92jsj6ISsTIVXUa2__do','2025-05-20 19:33:33'),(61,38,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzgsImVtYWlsIjoib3JnZGFzaEBqdXN0LmVkdS5qbyIsImlhdCI6MTc0ODAyNTUyMiwiZXhwIjoxNzQ4NjMwMzIyfQ.zyoLYjdt_vW2Y4RBshm2NPyMLvmVrb_fZIZhl2wnl54','2025-05-23 18:38:42'),(62,38,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzgsImVtYWlsIjoib3JnZGFzaEBqdXN0LmVkdS5qbyIsImlhdCI6MTc0ODAyNjQzOSwiZXhwIjoxNzQ4NjMxMjM5fQ.xEe2Q8RqQ7YhX75nn478zSJiYr8cuL90_PiKrEt_09I','2025-05-23 18:53:59'),(63,38,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzgsImVtYWlsIjoib3JnZGFzaEBqdXN0LmVkdS5qbyIsImlhdCI6MTc0ODAyNjU1OSwiZXhwIjoxNzQ4NjMxMzU5fQ.VP8rBnNGLVxjgpNrhPPJB1eaZefGyZ7SMLpgmqWYF2k','2025-05-23 18:55:59'),(64,75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoibmFkYUNhbXB1c0BnbWFpbC5jb20iLCJpYXQiOjE3NDgwMjcwNDksImV4cCI6MTc0ODYzMTg0OX0.HW_jcnxNN-ZhF2LlayXKq06kHbm14SEzZV7qaMXhhlw','2025-05-23 19:04:09'),(65,38,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzgsImVtYWlsIjoib3JnZGFzaEBqdXN0LmVkdS5qbyIsImlhdCI6MTc0ODAyNzA2NSwiZXhwIjoxNzQ4NjMxODY1fQ.L-hfpcVVCmQwos_dJDMiSCwzAeU83TWHOjjj7Cd2c9M','2025-05-23 19:04:25'),(66,75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoibmFkYUNhbXB1c0BnbWFpbC5jb20iLCJpYXQiOjE3NDgwMjc5NDIsImV4cCI6MTc0ODYzMjc0Mn0.Rrj-fQPGYiSuApDeMg8EfKFanNkf-PLNs2CJ3cv3P14','2025-05-23 19:19:02'),(67,75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoibmFkYUNhbXB1c0BnbWFpbC5jb20iLCJpYXQiOjE3NDgwMjgzNjQsImV4cCI6MTc0ODYzMzE2NH0.lLkjbJ1ybOqQ31JEo02Bxt679-R4X79ayAPGYjsrVAY','2025-05-23 19:26:04'),(68,38,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzgsImVtYWlsIjoib3JnZGFzaEBqdXN0LmVkdS5qbyIsImlhdCI6MTc0ODAyODQ2OSwiZXhwIjoxNzQ4NjMzMjY5fQ.Ai-2HhAqmNGhh4ThLNxV_KfL70FtpLikdm_S53b0_0A','2025-05-23 19:27:49'),(69,38,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzgsImVtYWlsIjoib3JnZGFzaEBqdXN0LmVkdS5qbyIsImlhdCI6MTc0ODAyODY3OSwiZXhwIjoxNzQ4NjMzNDc5fQ.U0a25VHzZGTOGoqmK2qSRwb4C6miwyVpmwCFqfsliJ4','2025-05-23 19:31:19'),(70,38,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzgsImVtYWlsIjoib3JnZGFzaEBqdXN0LmVkdS5qbyIsImlhdCI6MTc0ODAyODcyOCwiZXhwIjoxNzQ4NjMzNTI4fQ.enqTVRMr8xgaeN9BES1KQGx8wxaE8vIkTjzTm8HUg3g','2025-05-23 19:32:08'),(71,38,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzgsImVtYWlsIjoib3JnZGFzaEBqdXN0LmVkdS5qbyIsImlhdCI6MTc0ODAyODgwMiwiZXhwIjoxNzQ4NjMzNjAyfQ.fnkhvQhXMjHMv95ntoXHNuFqsV58wEB0eCs3Af4Frw8','2025-05-23 19:33:22'),(72,38,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzgsImVtYWlsIjoib3JnZGFzaEBqdXN0LmVkdS5qbyIsImlhdCI6MTc0ODAyOTQ5NCwiZXhwIjoxNzQ4NjM0Mjk0fQ.P-nEHQHNvqqoi3gV6UY8ex--B81bspYfpCHlL6fTMtY','2025-05-23 19:44:54'),(73,38,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzgsImVtYWlsIjoib3JnZGFzaEBqdXN0LmVkdS5qbyIsImlhdCI6MTc0ODAyOTU0NiwiZXhwIjoxNzQ4NjM0MzQ2fQ.jenoirCgEBsI-Oo0y_HFK5g5nf0w2D_ohiMlXQou39A','2025-05-23 19:45:46'),(74,38,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzgsImVtYWlsIjoib3JnZGFzaEBqdXN0LmVkdS5qbyIsImlhdCI6MTc0ODAyOTYzNCwiZXhwIjoxNzQ4NjM0NDM0fQ.2qz9wwE0mIrZxBMGTs7Nz_itdLmmJs6rZ-a5a1A0MW4','2025-05-23 19:47:14'),(75,38,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzgsImVtYWlsIjoib3JnZGFzaEBqdXN0LmVkdS5qbyIsImlhdCI6MTc0ODAzMTg1MiwiZXhwIjoxNzQ4NjM2NjUyfQ.2Kbe3j01_lTTiZfgfp95nXAR0TJUAWhONxPmhYvSNQQ','2025-05-23 20:24:12'),(76,75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoibmFkYUNhbXB1c0BnbWFpbC5jb20iLCJpYXQiOjE3NDgwMzI0OTksImV4cCI6MTc0ODYzNzI5OX0.1B8l9sLYDOWQDAvYteQ1emml4318stkoabS4jNevVJs','2025-05-23 20:34:59'),(77,75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoibmFkYUNhbXB1c0BnbWFpbC5jb20iLCJpYXQiOjE3NDgwMzMzMDMsImV4cCI6MTc0ODYzODEwM30.b-d1ACIt9uKtL2p6GYyLrJxPgaVBTYHY6IGxBsWe580','2025-05-23 20:48:23'),(78,75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoibmFkYUNhbXB1c0BnbWFpbC5jb20iLCJpYXQiOjE3NDgwMzM1MTUsImV4cCI6MTc0ODYzODMxNX0.vytJqQWmBLhKKHLXF_GAz5ib84hVSAue4bOKOpB_8SM','2025-05-23 20:51:55'),(79,75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoibmFkYUNhbXB1c0BnbWFpbC5jb20iLCJpYXQiOjE3NDgwMzM4OTcsImV4cCI6MTc0ODYzODY5N30.o1UlFmhryJiPlCd1WLj8FMPNOu-8dk69ortFMgJcbsw','2025-05-23 20:58:17'),(80,75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoibmFkYUNhbXB1c0BnbWFpbC5jb20iLCJpYXQiOjE3NDgwMzQzNzgsImV4cCI6MTc0ODYzOTE3OH0.4pMrnc0BNhAHcpZiDO2pyc1Xhzujxo-DC6FMBqylE-M','2025-05-23 21:06:18'),(81,75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoibmFkYUNhbXB1c0BnbWFpbC5jb20iLCJpYXQiOjE3NDgwMzQ2NTIsImV4cCI6MTc0ODYzOTQ1Mn0.9GQA1qe5O4OWyJEs4eeY_5G3-Qo42JvO0TW8wyUUrzk','2025-05-23 21:10:52'),(82,75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoibmFkYUNhbXB1c0BnbWFpbC5jb20iLCJpYXQiOjE3NDgwMzQ5NzgsImV4cCI6MTc0ODYzOTc3OH0.SYNSkPxVFSjbbQoPKDPo8fXy5eESbr89K7odJ57N1eA','2025-05-23 21:16:18'),(83,75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoibmFkYUNhbXB1c0BnbWFpbC5jb20iLCJpYXQiOjE3NDgwMzUwMTgsImV4cCI6MTc0ODYzOTgxOH0.KlQRWZhEGt4fzehgQGWrF36aynfue2ZjQnnE6-ZEbI0','2025-05-23 21:16:58'),(84,75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoibmFkYUNhbXB1c0BnbWFpbC5jb20iLCJpYXQiOjE3NDgwMzU0MTksImV4cCI6MTc0ODY0MDIxOX0.fMCxFyUgqXrrLHoh7fhYAqJu2n_hKXgzjhgUwBwGd7w','2025-05-23 21:23:39'),(85,75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoibmFkYUNhbXB1c0BnbWFpbC5jb20iLCJpYXQiOjE3NDgwMzgxMzksImV4cCI6MTc0ODAzODE1NH0.e7MmBhpXjpSE-1qkxNvWI4V0O2pAfH5AVnQNE_pKalE','2025-05-23 22:08:59'),(86,75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoibmFkYUNhbXB1c0BnbWFpbC5jb20iLCJpYXQiOjE3NDgwMzgyMzIsImV4cCI6MTc0ODAzODI0N30.Ew9ZCdDH-6-f1Crj1pg2rbGMeLV_afl47KxuPrDa6R0','2025-05-23 22:10:32'),(87,75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoibmFkYUNhbXB1c0BnbWFpbC5jb20iLCJpYXQiOjE3NDgxMDA4NjAsImV4cCI6MTc0ODEwMDg3NX0.Y60fz-VuYKQpMg29z_XoyaWbYAardJL5oWAJu4MDVe0','2025-05-24 15:34:20'),(88,75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoibmFkYUNhbXB1c0BnbWFpbC5jb20iLCJpYXQiOjE3NDgxMDEwNDksImV4cCI6MTc0ODEwMTA2NH0.-SeNtSLlOEUnya_fnZugodeG66rcHEOyA5NuiqwcvdY','2025-05-24 15:37:29'),(89,75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoibmFkYUNhbXB1c0BnbWFpbC5jb20iLCJpYXQiOjE3NDgxMDE1NDcsImV4cCI6MTc0ODEwMTU2Mn0.LGadko2O8fz9h9kyFsHa6OFhkA7r3pH2dZyPciuXKCA','2025-05-24 15:45:47'),(90,75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoibmFkYUNhbXB1c0BnbWFpbC5jb20iLCJpYXQiOjE3NDgxMDE3NTUsImV4cCI6MTc0ODEwMTc3MH0.qC1VouY5QsvT62yDzCg1UtuPywfNMTswKQXdiYuUl-c','2025-05-24 15:49:15'),(91,75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoibmFkYUNhbXB1c0BnbWFpbC5jb20iLCJpYXQiOjE3NDgxMDE4MDIsImV4cCI6MTc0ODEwMTgxN30.YWCbjKUtcyyxJjZophzNMjy-NAewuezERFzJvyo1p7A','2025-05-24 15:50:02'),(92,75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoibmFkYUNhbXB1c0BnbWFpbC5jb20iLCJpYXQiOjE3NDgxMDM4OTcsImV4cCI6MTc0ODEwMzkxMn0.-JAtK4jmP0RrWSn6HVYPzQdT_Jcco_-Zslgoinm-WlY','2025-05-24 16:24:57'),(93,75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoibmFkYUNhbXB1c0BnbWFpbC5jb20iLCJpYXQiOjE3NDgxMDQ4NDcsImV4cCI6MTc0ODEwNDg2Mn0.maEcsFTDRTeBj8kBNd3rlNuaHf4DvkuMkDCbZwfJnIM','2025-05-24 16:40:47'),(94,75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoibmFkYUNhbXB1c0BnbWFpbC5jb20iLCJpYXQiOjE3NDgxMDQ4ODQsImV4cCI6MTc0ODEwNDg5OX0.fsjlOkaRnQS0CFLjmlIWPzxPKcHgK4d9BNK2bcKUP_I','2025-05-24 16:41:24'),(95,75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoibmFkYUNhbXB1c0BnbWFpbC5jb20iLCJpYXQiOjE3NDgxMDQ5OTAsImV4cCI6MTc0ODEwNTAwNX0.5H9GEIFkMNWxqtTWheNyZx4QE-9jlbDx8NwFEISGleM','2025-05-24 16:43:10'),(96,75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoibmFkYUNhbXB1c0BnbWFpbC5jb20iLCJpYXQiOjE3NDgxMDUyNTQsImV4cCI6MTc0ODEwNTI2OX0.aIGL46f7yjSpdVCHeaVZhXiE0b2SUDSR4BvDOOW3fS4','2025-05-24 16:47:34'),(97,75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoibmFkYUNhbXB1c0BnbWFpbC5jb20iLCJpYXQiOjE3NDgxMjM0MzEsImV4cCI6MTc0ODEyMzQ0Nn0.k6lJjaxQPd6lkRWHH4q6bqd6ZUXQJnUHQRJJLpCzJo8','2025-05-24 21:50:31'),(98,75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoibmFkYUNhbXB1c0BnbWFpbC5jb20iLCJpYXQiOjE3NDgxMjM1MDMsImV4cCI6MTc0ODEyMzUxOH0.K-Gwn4spc8A5CjyjUQHEusTDKInKhO_kPoeLBIlqOhc','2025-05-24 21:51:43'),(99,75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoibmFkYUNhbXB1c0BnbWFpbC5jb20iLCJpYXQiOjE3NDgxMjM1NDAsImV4cCI6MTc0ODEyMzU1NX0.YUJPsKkCyUPa-s2ybFeDAKXIcvgzNYKEqlxug5APcaY','2025-05-24 21:52:20'),(100,75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoibmFkYUNhbXB1c0BnbWFpbC5jb20iLCJpYXQiOjE3NDgxMjM5NzQsImV4cCI6MTc0ODEyMzk4OX0.x3wrrqUqJGYFWNe-JD7UtoZo-VWUf7nKvcoUILKWZms','2025-05-24 21:59:34'),(101,75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoibmFkYUNhbXB1c0BnbWFpbC5jb20iLCJpYXQiOjE3NDgxMjQwMjAsImV4cCI6MTc0ODEyNDAzNX0.IzXUbsIYxIbacJkIdA0iqLl8cNYkEbOOmXMVyk82zs0','2025-05-24 22:00:20'),(102,75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoibmFkYUNhbXB1c0BnbWFpbC5jb20iLCJpYXQiOjE3NDgxMjQ2OTYsImV4cCI6MTc0ODEyNDcxMX0.cj6RnfBg3SGJ37rcjvZcTS8ko_TcyDlwt7i4dgBXmE0','2025-05-24 22:11:36'),(103,75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoibmFkYUNhbXB1c0BnbWFpbC5jb20iLCJpYXQiOjE3NDgxMjUzNTYsImV4cCI6MTc0ODEyNTM3MX0.AJ1XQJFyRvR1r9A9TdoUeU2rrXfjjXcqmSTOrdHfPd0','2025-05-24 22:22:36'),(104,75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoibmFkYUNhbXB1c0BnbWFpbC5jb20iLCJpYXQiOjE3NDgxMjU2MTgsImV4cCI6MTc0ODEyNTYzM30._JOTiLOqQMMmuf7L-FE-F4AlVkAJ2_Mw_4Em39tccKs','2025-05-24 22:26:58'),(105,38,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzgsImVtYWlsIjoib3JnZGFzaEBqdXN0LmVkdS5qbyIsImlhdCI6MTc0ODEyNjAxOCwiZXhwIjoxNzQ4MTI2MDMzfQ.masmp0tyCy4tWPG38wvB9JKL-j4XLyXGWnSmCDwis8k','2025-05-24 22:33:38'),(106,75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoibmFkYUNhbXB1c0BnbWFpbC5jb20iLCJpYXQiOjE3NDgxMjYxNTMsImV4cCI6MTc0ODEyNjE2OH0.KdN37lFstnoNF5K9mXilZedUrVkwrBGcv2zVhnuN3N0','2025-05-24 22:35:53'),(107,75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoibmFkYUNhbXB1c0BnbWFpbC5jb20iLCJpYXQiOjE3NDgxNjUzMDIsImV4cCI6MTc0ODE2NTMxN30.nlj0pjIH5SUQ9eo-a0mckDoCEjLVulPsoj5OSgtVHOE','2025-05-25 09:28:22'),(108,75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoibmFkYUNhbXB1c0BnbWFpbC5jb20iLCJpYXQiOjE3NDgxNjU4ODIsImV4cCI6MTc0ODE2NTg5N30.GJidfA65yePRiIszyu6u5XhZpzXtcrzjf38g-XCEwco','2025-05-25 09:38:02'),(109,75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoibmFkYUNhbXB1c0BnbWFpbC5jb20iLCJpYXQiOjE3NDgxNjY0MTUsImV4cCI6MTc0ODE2NjQzMH0.AbBmFis7IZscQYUFJKd-B0-GQpV5hCqO6lpklam4KEo','2025-05-25 09:46:55'),(110,75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoibmFkYUNhbXB1c0BnbWFpbC5jb20iLCJpYXQiOjE3NDgxNjcyOTQsImV4cCI6MTc0ODE2NzMwOX0.MRvQx6ij6f1Ukd9LKl1F6yJHnGo5Qnkg_skoW5AEej0','2025-05-25 10:01:34'),(111,75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoibmFkYUNhbXB1c0BnbWFpbC5jb20iLCJpYXQiOjE3NDgxNjgxNTAsImV4cCI6MTc0ODE2ODE2NX0.3mc372Sfpp3CQQS5_tPzvtr2sNALpzOVaDAIAh8Dht4','2025-05-25 10:15:50'),(112,75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoibmFkYUNhbXB1c0BnbWFpbC5jb20iLCJpYXQiOjE3NDgxNzI5NjUsImV4cCI6MTc0ODE3Mjk4MH0.RRdWrUwfObOjTZct4-fs0AHhoW9xQKVU-K5zl0glZYo','2025-05-25 11:36:05'),(113,75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoibmFkYUNhbXB1c0BnbWFpbC5jb20iLCJpYXQiOjE3NDgxNzkzNDUsImV4cCI6MTc0ODE3OTM2MH0.CdoVinpQn811PRIih_EPg6hx1i1_s30UPakF0TvN2iY','2025-05-25 13:22:25'),(114,75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoibmFkYUNhbXB1c0BnbWFpbC5jb20iLCJpYXQiOjE3NDgxNzk3MjcsImV4cCI6MTc0ODE3OTc0Mn0.HJHoTYJkWKNqxVqhatql54837TJd8JbFUkjxgtiDpDk','2025-05-25 13:28:47'),(115,75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoibmFkYUNhbXB1c0BnbWFpbC5jb20iLCJpYXQiOjE3NDgxODA1MjAsImV4cCI6MTc0ODE4MDUzNX0.vmQOVTZwCeLBUX2lFmwdhNkzc1yvqIbsz9PPz7QJoeY','2025-05-25 13:42:00'),(116,75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoibmFkYUNhbXB1c0BnbWFpbC5jb20iLCJpYXQiOjE3NDgxODA1ODksImV4cCI6MTc0ODE4MDYwNH0.D7UKwL6CWEptSYYlEWRkL_BVxWYkY64Jme0kJxCTsvM','2025-05-25 13:43:09'),(117,75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoibmFkYUNhbXB1c0BnbWFpbC5jb20iLCJpYXQiOjE3NDgxODA5MTEsImV4cCI6MTc0ODE4MDkyNn0.FNWmJ-_QjRiUAgH8Se2aq5alNrNAlv-fDUtT3ShPIA0','2025-05-25 13:48:31'),(118,75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoibmFkYUNhbXB1c0BnbWFpbC5jb20iLCJpYXQiOjE3NDgxODA5MzMsImV4cCI6MTc0ODE4MDk0OH0.ceyykDPv5GLpRXTwQjz0QknNTUrCnawsMnZzQKc6odY','2025-05-25 13:48:53'),(119,38,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzgsImVtYWlsIjoib3JnZGFzaEBqdXN0LmVkdS5qbyIsImlhdCI6MTc0ODIxMTkxNywiZXhwIjoxNzQ4MjExOTMyfQ.zpnUrt6Ux6LWZAietPrKaT4ZoYSu1BcxHji5HN08JNY','2025-05-25 22:25:17'),(120,75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoibmFkYUNhbXB1c0BnbWFpbC5jb20iLCJpYXQiOjE3NDgyNDMyMDksImV4cCI6MTc0ODI0MzIyNH0.rxF23JpecnHWPhCHJAR5_eKAN4C9JVdVLdt74aBQ3Us','2025-05-26 07:06:49'),(121,38,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzgsImVtYWlsIjoib3JnZGFzaEBqdXN0LmVkdS5qbyIsImlhdCI6MTc0ODI0MzI0OCwiZXhwIjoxNzQ4MjQzMjYzfQ.Lyhc9bLRp9bVBfyiWlO4imlFGflqScHYq_5gUhRqT9s','2025-05-26 07:07:28'),(122,38,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzgsImVtYWlsIjoib3JnZGFzaEBqdXN0LmVkdS5qbyIsImlhdCI6MTc0ODI0MzQyOSwiZXhwIjoxNzQ4MjQzNDQ0fQ.yX_BgY5Yzl0kI5TySS7Ft3CTH5bAaTx9c8eTTFnA8RI','2025-05-26 07:10:29'),(123,88,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODgsImVtYWlsIjoibnJhYmVlMjBAZ21haWwuY29tIiwiaWF0IjoxNzQ4MjQzNjMxLCJleHAiOjE3NDgyNDM2NDZ9.X_H1IiscknjpFLHIMimaQDPr5FqL8xS0jUHIcJ470Wc','2025-05-26 07:13:51'),(124,88,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODgsImVtYWlsIjoibnJhYmVlMjBAZ21haWwuY29tIiwiaWF0IjoxNzQ4MjQzOTQzLCJleHAiOjE3NDgyNDM5NTh9.n0gB_476ptuaNuWA9_JnYY-7pQNQg9hEh7tmay9LUVk','2025-05-26 07:19:03'),(125,88,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODgsImVtYWlsIjoibnJhYmVlMjBAZ21haWwuY29tIiwiaWF0IjoxNzQ4MjQ0MDE5LCJleHAiOjE3NDgyNDQwMzR9.gHfvagVT6IZDA9mlJXZc_swO2dWKVb72-dx0utwuscQ','2025-05-26 07:20:19'),(126,38,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzgsImVtYWlsIjoib3JnZGFzaEBqdXN0LmVkdS5qbyIsImlhdCI6MTc0ODI0NDQ2MCwiZXhwIjoxNzQ4MjQ0NDc1fQ.owYWrm1wkMx0GlrnwlQzRs0jStYkGU1_Oi5yElvZiAQ','2025-05-26 07:27:40'),(127,88,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODgsImVtYWlsIjoibnJhYmVlMjBAZ21haWwuY29tIiwiaWF0IjoxNzQ4MjQ0NDg0LCJleHAiOjE3NDgyNDQ0OTl9.f-KkReidE6Q-Dp0ygjhe4rqGTp5OxyUoU5QOToX0cAE','2025-05-26 07:28:04'),(128,38,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzgsImVtYWlsIjoib3JnZGFzaEBqdXN0LmVkdS5qbyIsImlhdCI6MTc0ODI1NjkyMSwiZXhwIjoxNzQ4MjU2OTM2fQ.hSesrBXcQUXoMo21fx4fAIKfJIfdOcWPXBpK2mtiWKA','2025-05-26 10:55:21'),(129,75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoibmFkYUNhbXB1c0BnbWFpbC5jb20iLCJpYXQiOjE3NDgyNTY5NDMsImV4cCI6MTc0ODI1Njk1OH0.uqUvA5qyxEtIBqa0SHNaqdp57wYLBnhZ1ngomGzAmfY','2025-05-26 10:55:43'),(130,75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoibmFkYUNhbXB1c0BnbWFpbC5jb20iLCJpYXQiOjE3NDgyNTcxMzUsImV4cCI6MTc0ODI1NzE1MH0.1MEC_aGqbgE6cf96nuZ0HBHsDQ6VPr2Ju8yTYKtfZXk','2025-05-26 10:58:55'),(131,75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoibmFkYUNhbXB1c0BnbWFpbC5jb20iLCJpYXQiOjE3NDgyNTczMjEsImV4cCI6MTc0ODI1NzMzNn0.fmvX6VfPRJf2VEBLy1aT551auYkUtVcLu4HUh5tfOmw','2025-05-26 11:02:01'),(132,75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoibmFkYUNhbXB1c0BnbWFpbC5jb20iLCJpYXQiOjE3NDgyNTg5MTgsImV4cCI6MTc0ODI1ODkzM30.APTfp2Y8W8KAG2mrcDSFk4RwWri_hWM9DV20lRPaIFQ','2025-05-26 11:28:38'),(133,75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoibmFkYUNhbXB1c0BnbWFpbC5jb20iLCJpYXQiOjE3NDgyNTkyNzMsImV4cCI6MTc0ODI1OTI4OH0.ulpxOCk5RLrqUo3Vo_6IZRYWyU6FpLEmXd5SJjIkESc','2025-05-26 11:34:33'),(134,75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoibmFkYUNhbXB1c0BnbWFpbC5jb20iLCJpYXQiOjE3NDgyNjM4OTAsImV4cCI6MTc0ODI2MzkwNX0.ztt7eVTRhb_zaOb2MzUPggVKZFy7g2TzmI1DgAXWtQo','2025-05-26 12:51:30'),(135,75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoibmFkYUNhbXB1c0BnbWFpbC5jb20iLCJpYXQiOjE3NDgyNjQ4ODcsImV4cCI6MTc0ODI2NDkwMn0.I1h6gy72-crr6vuwswBKLgqWgGR47owXQN7spVsdKGI','2025-05-26 13:08:07'),(136,75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoibmFkYUNhbXB1c0BnbWFpbC5jb20iLCJpYXQiOjE3NDgyNjU0MjEsImV4cCI6MTc0ODI2NTQzNn0.A9c7KBiwor86L8NvtSYXkwxyy7vd7UC-HprGn4pjv8M','2025-05-26 13:17:01'),(137,75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoibmFkYUNhbXB1c0BnbWFpbC5jb20iLCJpYXQiOjE3NDgyNjY2NDAsImV4cCI6MTc0ODI2NjY1NX0.bXlogS9nqWtEKVDRsjCiAcaV81Pd-fvCB8fdl8fxwUQ','2025-05-26 13:37:20'),(138,75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoibmFkYUNhbXB1c0BnbWFpbC5jb20iLCJpYXQiOjE3NDgyNzAyMTUsImV4cCI6MTc0ODI3MDIzMH0.30-X6UfTAiEP1Wz33IVMEwj38MBnqmCBR9vxe1YkQ0U','2025-05-26 14:36:55'),(139,75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoibmFkYUNhbXB1c0BnbWFpbC5jb20iLCJpYXQiOjE3NDgyNzExMTEsImV4cCI6MTc0ODI3MTEyNn0.c90O2PdodI4XIGZ8UhrmGC6SNMwNTxjR3ugEOCMCz1o','2025-05-26 14:51:51'),(140,75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoibmFkYUNhbXB1c0BnbWFpbC5jb20iLCJpYXQiOjE3NDgyNzEyODksImV4cCI6MTc0ODI3MTMwNH0.sMRnP04Popq7LfDirOoEPA51Om4tcfkJkq6hCmH3ZdQ','2025-05-26 14:54:49'),(141,75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoibmFkYUNhbXB1c0BnbWFpbC5jb20iLCJpYXQiOjE3NDgyNzE1OTEsImV4cCI6MTc0ODI3MTYwNn0.lrFfg0tXImbJdMbIXcCU5VLZcfGGhy2z3c4hLF_PiaM','2025-05-26 14:59:51'),(142,75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoibmFkYUNhbXB1c0BnbWFpbC5jb20iLCJpYXQiOjE3NDgyNzIwMjgsImV4cCI6MTc0ODI3MjA0M30.DcAJ6TfxK1l_w-yRv0alGCTB0UaC65KaOruBldD0yhg','2025-05-26 15:07:08'),(143,38,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzgsImVtYWlsIjoib3JnZGFzaEBqdXN0LmVkdS5qbyIsImlhdCI6MTc0ODI3MjIxNCwiZXhwIjoxNzQ4MjcyMjI5fQ.oz7ZJgr8cus9_yVepoTjWtAc9RT5mA2orbwMbtblWJo','2025-05-26 15:10:14'),(144,75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoibmFkYUNhbXB1c0BnbWFpbC5jb20iLCJpYXQiOjE3NDgyNzI3OTcsImV4cCI6MTc0ODI3MjgxMn0.suo-0wU-E9oFfINd52QU4iBsi6J02vB8hpAbFqxftPo','2025-05-26 15:19:57'),(145,88,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODgsImVtYWlsIjoibnJhYmVlMjBAZ21haWwuY29tIiwiaWF0IjoxNzQ4Mjc2MDcwLCJleHAiOjE3NDgyNzYwODV9.DumGTLRY8wVjhm1z7qinjiPUyQtxuqViJMOVwEmoIuc','2025-05-26 16:14:30'),(146,88,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODgsImVtYWlsIjoibnJhYmVlMjBAZ21haWwuY29tIiwiaWF0IjoxNzQ4Mjc2MzU4LCJleHAiOjE3NDgyNzYzNzN9.89cK51_CMKBG1quMZtOOJL5FhoKCGbGHOKBV1YW6p-E','2025-05-26 16:19:18'),(147,88,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODgsImVtYWlsIjoibnJhYmVlMjBAZ21haWwuY29tIiwiaWF0IjoxNzQ4Mjc3MDA0LCJleHAiOjE3NDgyNzcwMTl9.71BMmCAcjkkfC05ofG6sJgB9YIqWEcva95yX361GnyQ','2025-05-26 16:30:04'),(148,88,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODgsImVtYWlsIjoibnJhYmVlMjBAZ21haWwuY29tIiwiaWF0IjoxNzQ4Mjc5OTY2LCJleHAiOjE3NDgyNzk5ODF9.xarYkoT2cGRUYTQhlLWd-O620qtV-TeTmiUCCmVLnqc','2025-05-26 17:19:26'),(149,88,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODgsImVtYWlsIjoibnJhYmVlMjBAZ21haWwuY29tIiwiaWF0IjoxNzQ4MjgwODUxLCJleHAiOjE3NDgyODA4NjZ9.EZ-S9YSeZFTBD_fHCLrAt1t6RKfmuJfjCX2wJBiQ3bs','2025-05-26 17:34:11'),(150,88,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODgsImVtYWlsIjoibnJhYmVlMjBAZ21haWwuY29tIiwiaWF0IjoxNzQ4MjgxNzc2LCJleHAiOjE3NDgyODE3OTF9.hVDG5Uk6c5NKIJEaXWJgHsSLD7US73DCBU1rqhI-9HE','2025-05-26 17:49:36'),(151,88,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODgsImVtYWlsIjoibnJhYmVlMjBAZ21haWwuY29tIiwiaWF0IjoxNzQ4MjgyMjgyLCJleHAiOjE3NDgyODIyOTd9.ZzZGmU95PT-lGY3U7SSw8z1cily1Yt1b3wuPzyKYSZY','2025-05-26 17:58:02'),(152,88,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODgsImVtYWlsIjoibnJhYmVlMjBAZ21haWwuY29tIiwiaWF0IjoxNzQ4Mjg0MTc4LCJleHAiOjE3NDgyODQxOTN9.bsVx58J0h5kNA_KpHNnENRLjuukEycdrxUpx9QKpdbU','2025-05-26 18:29:38'),(153,88,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODgsImVtYWlsIjoibnJhYmVlMjBAZ21haWwuY29tIiwiaWF0IjoxNzQ4Mjg1MTE3LCJleHAiOjE3NDgyODUxMzJ9.NG5jU3hzqGzg7qsr9H8bYa6nOebLKqFuCsG9g15zsV4','2025-05-26 18:45:17'),(154,75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoibmFkYUNhbXB1c0BnbWFpbC5jb20iLCJpYXQiOjE3NDgyODYzMDgsImV4cCI6MTc0ODI4NjMyM30.NT8ZDmGqUEGiRZMJ0WjINkGtpWbKk1iBhJrnbx10HMU','2025-05-26 19:05:08'),(155,88,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODgsImVtYWlsIjoibnJhYmVlMjBAZ21haWwuY29tIiwiaWF0IjoxNzQ4Mjg2MzE4LCJleHAiOjE3NDgyODYzMzN9.fe6tG37_cx3BjQnIGZwsA7mOfmiDfHXBz-4eDruewek','2025-05-26 19:05:18'),(156,88,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODgsImVtYWlsIjoibnJhYmVlMjBAZ21haWwuY29tIiwiaWF0IjoxNzQ4Mjg3MzE1LCJleHAiOjE3NDgyODczMzB9.mWFbWBELRSryoX96jldYgFkagJU-wlFg6zpb9cyYn3E','2025-05-26 19:21:55'),(157,88,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODgsImVtYWlsIjoibnJhYmVlMjBAZ21haWwuY29tIiwiaWF0IjoxNzQ4Mjg4MzQ4LCJleHAiOjE3NDgyODgzNjN9.-W1-QQIbYSQmDqMoP4esZQMII6VbeAbqnkUmrruVqGc','2025-05-26 19:39:08'),(158,88,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODgsImVtYWlsIjoibnJhYmVlMjBAZ21haWwuY29tIiwiaWF0IjoxNzQ4Mjg4NzY3LCJleHAiOjE3NDgyODg3ODJ9.-OhwudR4UI7RAAZL2iyRDbDCJcKtRzhypUdZoiapBVU','2025-05-26 19:46:07'),(159,88,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODgsImVtYWlsIjoibnJhYmVlMjBAZ21haWwuY29tIiwiaWF0IjoxNzQ4Mjg5MjY3LCJleHAiOjE3NDgyODkyODJ9.gQvGfDJCMKGcu19sVMFC7jiLs35e3HPfeNZGpciw7Zo','2025-05-26 19:54:27'),(160,88,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODgsImVtYWlsIjoibnJhYmVlMjBAZ21haWwuY29tIiwiaWF0IjoxNzQ4MzM1MDM0LCJleHAiOjE3NDgzMzUwNDl9.EIKPPNVFy7NzFE0VF4e7KlMPLo-aAh3Gr_bbfs1yGng','2025-05-27 08:37:14'),(161,38,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzgsImVtYWlsIjoib3JnZGFzaEBqdXN0LmVkdS5qbyIsImlhdCI6MTc0ODMzNjk5OCwiZXhwIjoxNzQ4MzM3MDEzfQ.Axh1mxtz67XWa1MAFOv_C2vMd9dh5A6Z1YB2_x0c9uw','2025-05-27 09:09:58'),(162,88,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODgsImVtYWlsIjoibnJhYmVlMjBAZ21haWwuY29tIiwiaWF0IjoxNzQ4MzY4NTM1LCJleHAiOjE3NDgzNjg1NTB9.AzOEML9Q6a-pfaysQ2Y9m0W4azGyknWgVVIuOlm7mKE','2025-05-27 17:55:35'),(163,88,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODgsImVtYWlsIjoibnJhYmVlMjBAZ21haWwuY29tIiwiaWF0IjoxNzQ4MzY4NjM3LCJleHAiOjE3NDgzNjg2NTJ9.Gi6PxSdoBOpC3eiZlfZXmPDJnTkOpylHJSYTUDCrm4c','2025-05-27 17:57:17'),(164,88,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODgsImVtYWlsIjoibnJhYmVlMjBAZ21haWwuY29tIiwiaWF0IjoxNzQ4MzY4NjcwLCJleHAiOjE3NDgzNjg2ODV9.Kgzog9tP33xaoz24mSA5Oio1jnero6wt_b0aFc1w5s0','2025-05-27 17:57:50'),(165,88,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODgsImVtYWlsIjoibnJhYmVlMjBAZ21haWwuY29tIiwiaWF0IjoxNzQ4MzY4NzIyLCJleHAiOjE3NDgzNjg3Mzd9.cgHxo5CJj2rrfVRPt13J1Y5kY5-DKDbgLO_Wsqb_bMs','2025-05-27 17:58:42'),(166,88,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODgsImVtYWlsIjoibnJhYmVlMjBAZ21haWwuY29tIiwiaWF0IjoxNzQ4MzY5MjY0LCJleHAiOjE3NDgzNjkyNzl9.jt0oU0RLM9B4etH3OnnZr13j8taUFUEQMlnGx4cOZwM','2025-05-27 18:07:44'),(167,88,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODgsImVtYWlsIjoibnJhYmVlMjBAZ21haWwuY29tIiwiaWF0IjoxNzQ4MzY5NDIzLCJleHAiOjE3NDgzNjk0Mzh9.1o5x0c9n3CGMvf3qLELjpkwZCtMcy6OBMUgolOULEzc','2025-05-27 18:10:23'),(168,88,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODgsImVtYWlsIjoibnJhYmVlMjBAZ21haWwuY29tIiwiaWF0IjoxNzQ4MzY5NTI3LCJleHAiOjE3NDgzNjk1NDJ9.jrD5R1dntKgUykAgYMUNWsBMv65oHr9OZexrCrTK99I','2025-05-27 18:12:07'),(169,88,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODgsImVtYWlsIjoibnJhYmVlMjBAZ21haWwuY29tIiwiaWF0IjoxNzQ4MzY5NTY0LCJleHAiOjE3NDgzNjk1Nzl9.jkX-WYvL2HF4_Hyr1t4Rt_h0FfF5YNCOx1n5KSJTZN8','2025-05-27 18:12:44'),(170,88,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODgsImVtYWlsIjoibnJhYmVlMjBAZ21haWwuY29tIiwiaWF0IjoxNzQ4MzY5NzUzLCJleHAiOjE3NDgzNjk3Njh9.5Hj7V2OEC1TgKHbay0EOr5-HeOefM3Lr9KDNdOY3dy8','2025-05-27 18:15:53'),(171,75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoibmFkYUNhbXB1c0BnbWFpbC5jb20iLCJpYXQiOjE3NDgzNzExMDAsImV4cCI6MTc0ODM3MTExNX0.rMG4r8m0PfY2OjBlWrwYJte7ETE-52Gxk_fcyVAwP5M','2025-05-27 18:38:20'),(172,88,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODgsImVtYWlsIjoibnJhYmVlMjBAZ21haWwuY29tIiwiaWF0IjoxNzQ4NDQzOTc4LCJleHAiOjE3NDg0NDM5OTN9.XO9J5JZMsXr3WYcyZ0hCdswv1yvLsQDB3J0FEmLxunI','2025-05-28 14:52:58'),(173,38,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzgsImVtYWlsIjoib3JnZGFzaEBqdXN0LmVkdS5qbyIsImlhdCI6MTc0ODYzNTk2MCwiZXhwIjoxNzQ4NjM1OTc1fQ._NzYOq3K3_4-Z74NT-4bUzBhas2FgJ1s1i7n6a3jeFU','2025-05-30 20:12:40'),(174,38,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzgsImVtYWlsIjoib3JnZGFzaEBqdXN0LmVkdS5qbyIsImlhdCI6MTc0ODYzNjM3NSwiZXhwIjoxNzQ4NjM2MzkwfQ.EmrRCLF2AdToANVTPf_0Xi46Vr2p1Wh-ov1n1rvO7yk','2025-05-30 20:19:35'),(175,75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoibmFkYUNhbXB1c0BnbWFpbC5jb20iLCJpYXQiOjE3NDg2MzY0MDYsImV4cCI6MTc0ODYzNjQyMX0.wzz728-usSYgDhNNnJPHggdpuk4XVqam8Rib2hweXdA','2025-05-30 20:20:06'),(176,88,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODgsImVtYWlsIjoibnJhYmVlMjBAZ21haWwuY29tIiwiaWF0IjoxNzQ4NjM2NDI2LCJleHAiOjE3NDg2MzY0NDF9.usuf64y73Jacl2YS4p3z40rlQmARIiHePA5zfVOfNF8','2025-05-30 20:20:26'),(177,91,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OTEsImVtYWlsIjoicmFiaWdoZW5hMTBAZ21haWwuY29tIiwiaWF0IjoxNzQ4NjQxNDk4LCJleHAiOjE3NDg2NDE1MTN9.0hrqQXG1YDp4r0RHpqh5QyDtqdwhc7OCPZRayoBOzoY','2025-05-30 21:44:58'),(178,91,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OTEsImVtYWlsIjoicmFiaWdoZW5hMTBAZ21haWwuY29tIiwiaWF0IjoxNzQ4NjQxNjYxLCJleHAiOjE3NDg2NDE2NzZ9.EakOSdpR1aBDzJLXbbIk7OimseDKQP3gne7lXJwbLXc','2025-05-30 21:47:41'),(179,88,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODgsImVtYWlsIjoibnJhYmVlMjBAZ21haWwuY29tIiwiaWF0IjoxNzQ4NjQxNjczLCJleHAiOjE3NDg2NDE2ODh9.w8QdVLwI1B7KFJ95VqvL_dze02pMLn37rftPs5OWvmQ','2025-05-30 21:47:53'),(180,75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoibmFkYUNhbXB1c0BnbWFpbC5jb20iLCJpYXQiOjE3NDg3NzcxNDMsImV4cCI6MTc0ODc3NzE1OH0.12OPH0mZVE0BtfVfyLYkpfUFeG8qEyLcA9cH477B2SY','2025-06-01 11:25:43'),(181,75,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsImVtYWlsIjoibmFkYUNhbXB1c0BnbWFpbC5jb20iLCJpYXQiOjE3NDg3NzcyMzEsImV4cCI6MTc0ODc3NzI0Nn0.g1w8s2bUlmSt3xmz_uROPAZrwOr01RcAxDIR7GIRlBs','2025-06-01 11:27:11');
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
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `room_bookings`
--

LOCK TABLES `room_bookings` WRITE;
/*!40000 ALTER TABLE `room_bookings` DISABLE KEYS */;
INSERT INTO `room_bookings` VALUES (1,1,1,'Study group for Algorithms','2025-06-02 14:00:00','2025-06-02 16:00:00','Pending','2025-05-16 02:01:23','2025-05-17 01:18:05'),(2,2,2,'Hackathon prep session','2025-06-04 10:00:00','2025-06-04 12:00:00','Rejected','2025-05-16 02:01:23','2025-05-26 14:04:06'),(3,3,3,'Book discussion planning','2025-06-08 13:00:00','2025-06-08 14:30:00','Approved','2025-05-16 02:01:23','2025-05-24 01:11:58'),(5,2,1,'Group Study','2025-05-01 10:00:00','2025-05-01 12:00:00','Approved','2025-05-01 00:00:00','2025-05-17 01:50:32'),(6,2,1,'Presentation Practice','2025-05-02 09:00:00','2025-05-02 10:00:00','Rejected','2025-05-02 00:00:00','2025-05-17 01:50:32'),(7,3,2,'Club Meeting','2025-05-10 14:00:00','2025-05-10 16:00:00','Approved','2025-05-10 00:00:00','2025-05-17 01:50:32'),(8,3,3,'Project Discussion','2025-05-12 11:00:00','2025-05-12 13:00:00','Pending','2025-05-17 01:50:32','2025-05-17 01:50:32'),(9,4,4,'Workshop','2025-05-13 10:00:00','2025-05-13 13:00:00','Approved','2025-05-17 01:50:32','2025-05-17 01:50:32'),(10,4,4,'Presentation','2025-05-14 14:00:00','2025-05-14 15:00:00','Rejected','2025-05-17 01:50:32','2025-05-17 01:50:32'),(13,87,1,'Research Group Meeting','2025-05-26 10:00:00','2025-05-26 12:00:00','Approved','2025-05-26 15:22:08','2025-05-26 15:22:08'),(14,88,2,'Workshop Preparation','2025-05-27 14:00:00','2025-05-27 16:30:00','Approved','2025-05-26 15:22:08','2025-05-26 15:22:08'),(15,87,3,'Startup Pitch Practice','2025-05-28 09:00:00','2025-05-28 11:00:00','Pending','2025-05-26 15:22:08','2025-05-26 15:22:08'),(16,88,4,'Club Committee Meeting','2025-05-29 15:00:00','2025-05-29 17:00:00','Pending','2025-05-26 15:22:08','2025-05-26 15:22:08'),(19,87,1,'Personal Study Session','2025-05-25 13:00:00','2025-05-25 14:30:00','Rejected','2025-05-26 15:24:12','2025-05-26 15:24:12'),(20,88,2,'Unregistered Event','2025-05-24 11:00:00','2025-05-24 12:30:00','Rejected','2025-05-26 15:24:12','2025-05-26 15:24:12'),(22,87,1,'Project Discussion','2025-05-28 10:48:00','2025-05-28 11:48:00','Pending','2025-05-27 22:48:46','2025-05-27 22:48:46'),(23,85,1,'hhhh','2025-06-01 16:26:00','2025-06-01 18:25:00','Approved','2025-06-01 14:25:24','2025-06-01 14:25:56'),(24,85,3,'lmelkmv','2025-06-01 16:26:00','2025-06-01 17:29:00','Rejected','2025-06-01 14:27:01','2025-06-01 14:27:49');
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
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rooms`
--

LOCK TABLES `rooms` WRITE;
/*!40000 ALTER TABLE `rooms` DISABLE KEYS */;
INSERT INTO `rooms` VALUES (1,'Study Room 101',6,'Study Room','Available','Quiet study space with whiteboard',1,1,'{\"x\": 32.4951, \"y\": 35.9913}'),(2,'Lab A204',25,'Lab','Available','Equipped with 25 PCs',1,2,'{\"x\": 32.4952, \"y\": 35.9915}'),(3,'Library Seminar Room',20,'Meeting Room','Available','Used for workshops and seminars',2,1,'{\"x\": 32.4956, \"y\": 35.9919}'),(4,'Auditorium B',100,'Classroom','Available','Large event space for guest lectures',3,0,'{\"x\": 32.4961, \"y\": 35.9926}');
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
INSERT INTO `saved_events` VALUES (1,1,2,'2025-05-15 23:02:47'),(2,2,1,'2025-05-15 23:02:47'),(3,3,3,'2025-05-15 23:02:47'),(7,38,1,'2025-05-16 13:49:03'),(9,75,2,'2025-05-17 16:16:53'),(10,75,1,'2025-05-24 22:30:57'),(12,87,9,'2025-05-27 19:50:41');
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
INSERT INTO `users` VALUES (1,'Nada Samara','nada@college.just.edu.jo','$2b$10$xyz123student1','Student',NULL,1,NULL,'Local',NULL,'2025-04-28 04:37:59',NULL,NULL,NULL),(2,'Ahmad Alhashash','ahmad@college.just.edu.jo','$2b$10$xyz123student2','Student',NULL,1,NULL,'Local',NULL,'2025-04-28 04:37:59',NULL,NULL,NULL),(3,'Amer Rabi','amer@college.just.edu.jo','$2b$10$xyz123student3','Student',NULL,1,NULL,'Local',NULL,'2025-04-28 04:37:59',NULL,NULL,NULL),(4,'Lara Allouh','lara@college.just.edu.jo','$2b$10$xyz123student4','Student',NULL,1,NULL,'Local',NULL,'2025-04-28 04:37:59',NULL,NULL,NULL),(5,'Mohammad Naim','mohammad@college.just.edu.jo','$2b$10$xyz123student5','Student',NULL,1,NULL,'Local',NULL,'2025-04-28 04:37:59',NULL,NULL,NULL),(6,'Engineering Club','engclub@just.edu.jo',NULL,'Organizer',NULL,1,NULL,'Google',NULL,'2025-04-28 04:37:59',NULL,NULL,NULL),(7,'Medical Club','medclub@just.edu.jo',NULL,'Organizer',NULL,1,NULL,'Google',NULL,'2025-04-28 04:37:59',NULL,NULL,NULL),(8,'Dean Office','deanoffice@just.edu.jo',NULL,'Campus Admin',NULL,1,NULL,'Microsoft',NULL,'2025-04-28 04:37:59',NULL,NULL,NULL),(9,'Library Admin','libraryadmin@just.edu.jo',NULL,'Campus Admin',NULL,1,NULL,'Microsoft',NULL,'2025-04-28 04:37:59',NULL,NULL,NULL),(10,'External Visitor','visitor1@gmail.com',NULL,'Visitor',NULL,1,NULL,'Local',NULL,'2025-04-28 04:37:59',NULL,NULL,NULL),(11,'System Super Admin','admin@just.edu.jo','$2b$10$xyz123admin','System Admin',NULL,1,NULL,'Local',NULL,'2025-04-28 04:37:59',NULL,NULL,NULL),(36,'Nada Samara','nrabee02@gmail.com','$2b$10$z9Pp3DIH88RKfzcQma3mIevdzr./Hy6UH.rFhXDhTdI3VbT1La3ZG','Organizer','Organizer',1,NULL,'Local',NULL,'2025-04-29 21:36:59',NULL,NULL,'2025-05-08 22:58:20'),(38,'Organizer Dashboard','orgdash@just.edu.jo','$2b$10$zVd4rEhDvrGbUKHzIlxvH.Bho7yJMScCFIA1gOgeDZeD5iwRoeCGi','Organizer',NULL,1,NULL,'Local',NULL,'2025-05-08 21:40:40',NULL,NULL,'2025-05-30 20:19:35'),(75,'Nada','nadaCampus@gmail.com','$2b$10$qms1A70DYtMAnUdQEiOnNeburJ6o56DhS143AWxjhYrESh0nv22yi','Campus Admin','Campus Admin',1,NULL,'Local',NULL,'2025-05-09 13:51:19',NULL,NULL,'2025-06-01 11:27:11'),(76,'Ali','ali@gmail.com','$2b$10$98koLIHBM2TIu.MRPLXG4ufeJeCdfTrp9NcaiYYIBke3B9qK03LQ6','Student',NULL,1,NULL,'Local',NULL,'2025-05-09 23:26:07',NULL,NULL,'2025-05-11 07:36:55'),(85,'Nada Samara','nrsamara20@gmail.com',NULL,'Visitor',NULL,1,NULL,'Google',NULL,'2025-05-16 19:52:49',NULL,NULL,NULL),(87,'Nada Rabee Samara','nrsamara20@cit.just.edu.jo',NULL,'Student',NULL,1,NULL,'Microsoft',NULL,'2025-05-16 20:19:00',NULL,NULL,'2025-06-01 11:26:06'),(88,'Visitor','nrabee20@gmail.com','$2b$10$hKlSonFotP7E6o.XWGLR6OCMTDS4S/Kp9TJ97fi/Oxc4HSIHbof6m','System Admin','Visitor',1,NULL,'Local',NULL,'2025-05-26 07:12:35',NULL,NULL,'2025-05-30 21:47:53'),(89,'Lara Test','lara@example.com','$2a$10$7QHkXtJG...','Visitor',NULL,1,NULL,'Local',NULL,'2025-05-26 18:44:38',NULL,NULL,NULL),(91,'ghina_student','rabighena10@gmail.com','$2b$10$P4qi9XvCOv/8ALcjDKX22.85iyGfXoWtF.LTb0C17sirXk/6OMLUW','Visitor',NULL,1,NULL,'Local',NULL,'2025-05-30 21:44:17',NULL,NULL,'2025-05-30 21:47:41');
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

-- Dump completed on 2025-06-01 15:47:58
