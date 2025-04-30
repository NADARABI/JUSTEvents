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
-- Dumping data for table `approvals`
--

LOCK TABLES `approvals` WRITE;
/*!40000 ALTER TABLE `approvals` DISABLE KEYS */;
INSERT INTO `approvals` VALUES (1,8,'Room Booking',1,'Approved','Booking looks good.','2025-04-28 04:45:35'),(2,8,'Room Booking',2,'Approved','Approved for Hackathon prep.','2025-04-28 04:45:35'),(3,9,'Event',1,'Approved','AI Seminar meets university goals.','2025-04-28 04:45:35'),(9,NULL,'Event',9,'Pending',NULL,NULL),(10,NULL,'Event',10,'Pending',NULL,NULL);
/*!40000 ALTER TABLE `approvals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `event_rsvps`
--

LOCK TABLES `event_rsvps` WRITE;
/*!40000 ALTER TABLE `event_rsvps` DISABLE KEYS */;
INSERT INTO `event_rsvps` VALUES (1,1,1,'Going','2025-04-28 04:42:52'),(2,2,2,'Going','2025-04-28 04:42:52'),(3,3,4,'Going','2025-04-28 04:42:52'),(4,5,3,'Going','2025-04-28 04:42:52'),(7,35,4,'Going','2025-04-29 21:52:53');
/*!40000 ALTER TABLE `event_rsvps` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
INSERT INTO `events` VALUES (1,'AI in Healthcare Seminar','A seminar discussing the future of AI in medical fields.','Academic','2025-05-20','10:00:00',6,4,'Approved',NULL),(2,'Engineering Hackathon','48-hour coding competition for engineering students.','Academic','2025-05-25','09:00:00',6,1,'Approved',NULL),(3,'Medical Awareness Campaign','Campaign to raise awareness about common diseases.','Social','2025-05-22','11:00:00',7,5,'Approved',NULL),(4,'Student Clubs Fair','An event where new students can meet and join campus clubs.','Social','2025-05-30','13:00:00',7,7,'Approved',NULL),(5,'Career Development Workshop','Workshop on CV writing and interview preparation.','Workshop','2025-06-01','14:00:00',6,2,'Approved',NULL),(8,'Pending Test Event','This event is for testing pending status.','General','2025-06-15','12:00:00',1,1,'Pending',NULL),(10,'Hi','Short','General','2025-05-20','10:00:00',36,4,'Pending',NULL),(11,'Hi','Short','General','2025-05-25','09:00:00',36,1,'Pending',NULL);
/*!40000 ALTER TABLE `events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `feedback`
--

LOCK TABLES `feedback` WRITE;
/*!40000 ALTER TABLE `feedback` DISABLE KEYS */;
INSERT INTO `feedback` VALUES (1,1,1,'Very informative seminar, loved it!',5,'2025-04-28 04:45:20'),(2,2,2,'Hackathon was very competitive and fun!',4,'2025-04-28 04:45:20'),(3,4,3,'Nice opportunity to meet clubs.',5,'2025-04-28 04:45:20'),(4,5,35,'Amazing event! Learned a lot!',5,'2025-04-29 16:14:15');
/*!40000 ALTER TABLE `feedback` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (5,35,'Your RSVP was successful for Event #10',0,'2025-04-29 18:45:20'),(6,35,'Your feedback was received',0,'2025-04-29 18:45:20'),(7,35,'An event you saved has been updated',0,'2025-04-29 18:45:20'),(8,35,'You successfully RSVPed to Event #4',0,'2025-04-29 21:50:18'),(9,35,'You successfully RSVPed to Event #4',0,'2025-04-29 21:52:53');
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `refresh_tokens`
--

LOCK TABLES `refresh_tokens` WRITE;
/*!40000 ALTER TABLE `refresh_tokens` DISABLE KEYS */;
INSERT INTO `refresh_tokens` VALUES (1,1,'token_nada','2025-04-28 04:41:57'),(2,2,'token_ahmad','2025-04-28 04:41:57'),(3,3,'token_amer','2025-04-28 04:41:57'),(4,4,'token_lara','2025-04-28 04:41:57'),(5,5,'token_mohammad','2025-04-28 04:41:57'),(6,6,'token_engclub','2025-04-28 04:41:57'),(7,7,'token_medclub','2025-04-28 04:41:57'),(8,8,'token_dean','2025-04-28 04:41:57'),(9,9,'token_library','2025-04-28 04:41:57'),(10,10,'token_visitor','2025-04-28 04:41:57'),(11,11,'token_admin','2025-04-28 04:41:57'),(15,35,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzUsImVtYWlsIjoibnJhYmVlMjBAZ21haWwuY29tIiwiaWF0IjoxNzQ1OTQzMDg4LCJleHAiOjE3NDY1NDc4ODh9.LdDA4k0R6SvCb9k62Kc3pn6GDOnQVLbJkEzn40V7Xa0','2025-04-29 16:11:28'),(16,35,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzUsImVtYWlsIjoibnJhYmVlMjBAZ21haWwuY29tIiwiaWF0IjoxNzQ1OTQ0MTAwLCJleHAiOjE3NDY1NDg5MDB9.70gu7Ui1P_DLbW_QV4rvbfXCYdVASSHAfSc7Yczfx9w','2025-04-29 16:28:20'),(17,35,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzUsImVtYWlsIjoibnJhYmVlMjBAZ21haWwuY29tIiwiaWF0IjoxNzQ1OTQ0OTg0LCJleHAiOjE3NDY1NDk3ODR9.pVdCsDBxxXcE-yx0iJdwdPm_AzwVwriN8uVpsq72BnU','2025-04-29 16:43:04'),(18,35,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzUsImVtYWlsIjoibnJhYmVlMjBAZ21haWwuY29tIiwiaWF0IjoxNzQ1OTUwMzM4LCJleHAiOjE3NDY1NTUxMzh9.KjFpg-PZaE6BTcBZQBClGj1M8ZL_vZVYaqL1fGTsErc','2025-04-29 18:12:18'),(19,35,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzUsImVtYWlsIjoibnJhYmVlMjBAZ21haWwuY29tIiwiaWF0IjoxNzQ1OTUwNDUwLCJleHAiOjE3NDY1NTUyNTB9.BuB_lbb2VOR69KrHTiLVkst0T4wfeeg4_9A_TDjMKps','2025-04-29 18:14:10'),(20,35,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzUsImVtYWlsIjoibnJhYmVlMjBAZ21haWwuY29tIiwiaWF0IjoxNzQ1OTUwODcxLCJleHAiOjE3NDY1NTU2NzF9.h5IFJqEVEF6LYbKup2VC2TJOdmHN-vEZpLZQwVLOcfE','2025-04-29 18:21:11'),(21,35,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzUsImVtYWlsIjoibnJhYmVlMjBAZ21haWwuY29tIiwiaWF0IjoxNzQ1OTUyMDc1LCJleHAiOjE3NDY1NTY4NzV9.CS1N-9ZBxiW0BCnpAC9cIG0l7tvX7VWRN_nWyFG624w','2025-04-29 18:41:15'),(22,36,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzYsImVtYWlsIjoibnJhYmVlMDJAZ21haWwuY29tIiwiaWF0IjoxNzQ1OTYyNjU2LCJleHAiOjE3NDY1Njc0NTZ9.0tHpT6YUqp8p3PbUvLeXKGse9l7X8zxO-HmybQZhANc','2025-04-29 21:37:36'),(23,36,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzYsImVtYWlsIjoibnJhYmVlMDJAZ21haWwuY29tIiwiaWF0IjoxNzQ1OTYyOTI4LCJleHAiOjE3NDY1Njc3Mjh9.UjHvjvJmuNKNlYC6SxEakBqh3p9jdf0gYa-DoTuAvlM','2025-04-29 21:42:08'),(24,35,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzUsImVtYWlsIjoibnJhYmVlMjBAZ21haWwuY29tIiwiaWF0IjoxNzQ1OTYzMjgyLCJleHAiOjE3NDY1NjgwODJ9.3bNIf_9GKamRQxseK-yBuHLSTAmSXhgGGrTuH-m6jss','2025-04-29 21:48:02'),(25,35,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzUsImVtYWlsIjoibnJhYmVlMjBAZ21haWwuY29tIiwiaWF0IjoxNzQ1OTYzMzY3LCJleHAiOjE3NDY1NjgxNjd9.laWDOelAKMSWPhvQNpvxCsiYbjJdNSqgRhEcHQGkVhg','2025-04-29 21:49:27'),(26,36,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzYsImVtYWlsIjoibnJhYmVlMDJAZ21haWwuY29tIiwiaWF0IjoxNzQ1OTYzOTk1LCJleHAiOjE3NDY1Njg3OTV9.UHd92KRbmb3zyJOZ4Kc7ZMd0c-e3x0G5zwELJCZJn3o','2025-04-29 21:59:55'),(27,36,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzYsImVtYWlsIjoibnJhYmVlMDJAZ21haWwuY29tIiwiaWF0IjoxNzQ1OTY0NDcwLCJleHAiOjE3NDY1NjkyNzB9.3eISl-e5AeS87JIlCn4GEh_MMAxnA3sR0CyyCQIGbOE','2025-04-29 22:07:50'),(28,36,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzYsImVtYWlsIjoibnJhYmVlMDJAZ21haWwuY29tIiwiaWF0IjoxNzQ1OTY0NTc4LCJleHAiOjE3NDY1NjkzNzh9.oWgLUhiTL-p7qt7uAWoYrD-AndFO_kySTLqHHU7tHDw','2025-04-29 22:09:38'),(29,36,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzYsImVtYWlsIjoibnJhYmVlMDJAZ21haWwuY29tIiwiaWF0IjoxNzQ1OTY0OTQwLCJleHAiOjE3NDY1Njk3NDB9.epHQSNRPY0VmB0w3O0IcrwLAB3_PSuLYeJihCDbMyrM','2025-04-29 22:15:40');
/*!40000 ALTER TABLE `refresh_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `room_bookings`
--

LOCK TABLES `room_bookings` WRITE;
/*!40000 ALTER TABLE `room_bookings` DISABLE KEYS */;
INSERT INTO `room_bookings` VALUES (1,1,1,'Group study for AI course','2025-05-21 12:00:00','2025-05-21 14:00:00','Approved','2025-04-30 01:53:36','2025-04-30 01:53:36'),(2,2,2,'Software Engineering project work','2025-05-22 10:00:00','2025-05-22 12:00:00','Pending','2025-04-30 01:53:36','2025-04-30 01:53:36'),(3,3,3,'Medical club seminar','2025-05-23 13:00:00','2025-05-23 15:00:00','Approved','2025-04-30 01:53:36','2025-04-30 01:53:36'),(4,4,5,'Research team weekly meeting','2025-05-24 09:00:00','2025-05-24 11:00:00','Pending','2025-04-30 01:53:36','2025-04-30 01:53:36');
/*!40000 ALTER TABLE `room_bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `rooms`
--

LOCK TABLES `rooms` WRITE;
/*!40000 ALTER TABLE `rooms` DISABLE KEYS */;
INSERT INTO `rooms` VALUES (1,'Library Study Room 1','Library',6,'Study Room','Available','Small study room for groups up to 6 people.'),(2,'Engineering Lab 204','Engineering Building',30,'Lab','Available','Computer lab equipped with 30 machines.'),(3,'Medical Seminar Room','Medical Faculty',20,'Meeting Room','Available','Room suitable for seminars and discussions.'),(4,'Auditorium A','Main Auditorium',200,'Classroom','Available','Large auditorium used for lectures and events.'),(5,'Research Meeting Room','Research Center',10,'Meeting Room','Available','Reserved for research team meetings.');
/*!40000 ALTER TABLE `rooms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `saved_events`
--

LOCK TABLES `saved_events` WRITE;
/*!40000 ALTER TABLE `saved_events` DISABLE KEYS */;
INSERT INTO `saved_events` VALUES (1,1,2,'2025-04-28 04:42:07'),(2,2,1,'2025-04-28 04:42:07'),(3,3,4,'2025-04-28 04:42:07');
/*!40000 ALTER TABLE `saved_events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Nada Samara','nada@college.just.edu.jo','$2b$10$xyz123student1','Student',NULL,1,NULL,'Local',NULL,'2025-04-28 04:37:59',NULL,NULL,NULL),(2,'Ahmad Alhashash','ahmad@college.just.edu.jo','$2b$10$xyz123student2','Student',NULL,1,NULL,'Local',NULL,'2025-04-28 04:37:59',NULL,NULL,NULL),(3,'Amer Rabi','amer@college.just.edu.jo','$2b$10$xyz123student3','Student',NULL,1,NULL,'Local',NULL,'2025-04-28 04:37:59',NULL,NULL,NULL),(4,'Lara Allouh','lara@college.just.edu.jo','$2b$10$xyz123student4','Student',NULL,1,NULL,'Local',NULL,'2025-04-28 04:37:59',NULL,NULL,NULL),(5,'Mohammad Naim','mohammad@college.just.edu.jo','$2b$10$xyz123student5','Student',NULL,1,NULL,'Local',NULL,'2025-04-28 04:37:59',NULL,NULL,NULL),(6,'Engineering Club','engclub@just.edu.jo',NULL,'Organizer',NULL,1,NULL,'Google',NULL,'2025-04-28 04:37:59',NULL,NULL,NULL),(7,'Medical Club','medclub@just.edu.jo',NULL,'Organizer',NULL,1,NULL,'Google',NULL,'2025-04-28 04:37:59',NULL,NULL,NULL),(8,'Dean Office','deanoffice@just.edu.jo',NULL,'Campus Admin',NULL,1,NULL,'Microsoft',NULL,'2025-04-28 04:37:59',NULL,NULL,NULL),(9,'Library Admin','libraryadmin@just.edu.jo',NULL,'Campus Admin',NULL,1,NULL,'Microsoft',NULL,'2025-04-28 04:37:59',NULL,NULL,NULL),(10,'External Visitor','visitor1@gmail.com',NULL,'Visitor',NULL,1,NULL,'Local',NULL,'2025-04-28 04:37:59',NULL,NULL,NULL),(11,'System Super Admin','admin@just.edu.jo','$2b$10$xyz123admin','System Admin',NULL,1,NULL,'Local',NULL,'2025-04-28 04:37:59',NULL,NULL,NULL),(34,'Nada Rabee Samara','nrsamara20@cit.just.edu.jo',NULL,'Student',NULL,1,NULL,'Microsoft',NULL,'2025-04-29 16:05:27',NULL,NULL,'2025-04-29 16:06:02'),(35,'testStudent','nrabee20@gmail.com','$2b$10$S5yr1dxW08kqf4uxqqccC.YIPKAKbFr9s/GWjpIUaakOQ3M9BcFEa','Student',NULL,1,NULL,'Local',NULL,'2025-04-29 16:08:50',NULL,NULL,'2025-04-29 21:49:27'),(36,'Nada Samara','nrabee02@gmail.com','$2b$10$z9Pp3DIH88RKfzcQma3mIevdzr./Hy6UH.rFhXDhTdI3VbT1La3ZG','Organizer','Organizer',1,NULL,'Local',NULL,'2025-04-29 21:36:59',NULL,NULL,'2025-04-29 22:15:40');
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

-- Dump completed on 2025-04-30  1:55:08
