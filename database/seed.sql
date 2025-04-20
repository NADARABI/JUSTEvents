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
INSERT INTO `approvals` VALUES (3,2,'Event',1,'Approved','Meets all criteria','2025-04-10 22:11:48'),(4,2,'Room Booking',2,'Pending','Awaiting confirmation','2025-04-10 22:11:48'),(5,NULL,'Event',9,'Pending',NULL,NULL),(6,15,'Event',10,'Rejected','Incomplete details','2025-04-19 13:56:34'),(7,15,'Event',11,'Rejected','Incomplete details','2025-04-19 15:05:34'),(8,15,'Event',12,'Rejected','Incomplete details','2025-04-19 15:07:19');
/*!40000 ALTER TABLE `approvals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `event_rsvps`
--

LOCK TABLES `event_rsvps` WRITE;
/*!40000 ALTER TABLE `event_rsvps` DISABLE KEYS */;
INSERT INTO `event_rsvps` VALUES (10,1,4,'Going','2025-04-15 21:24:21'),(11,2,5,'Not Going','2025-04-15 21:24:21'),(12,3,6,'Going','2025-04-15 21:24:21'),(17,14,10,'Going','2025-04-19 15:00:00');
/*!40000 ALTER TABLE `event_rsvps` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
INSERT INTO `events` VALUES (4,'Tech Meetup','A discussion about AI advancements.','Tech','2025-05-10','14:00:00',3,1,'Approved',NULL),(5,'Business Seminar','How to start a successful business.','Sports','2025-06-15','10:30:00',3,2,'Pending',NULL),(6,'Science Fair','A showcase of university research projects.','General','2025-07-10','11:00:00',3,3,'Approved',NULL),(7,'Tech Meetup','Discussion on AI tools','General','2025-07-20','14:00:00',11,1,'Pending',NULL),(8,'Tech Meetup','Discussion on AI tools','General','2025-07-20','14:00:00',11,1,'Pending',NULL),(10,'Tech Meetup','Discussion on AI tools','General','2025-07-20','14:00:00',11,1,'Rejected',NULL),(11,'JUST Career Fair','Meet top employers','General','2025-07-25','12:00:00',11,1,'Rejected',NULL),(12,'JUST Career Fair','Meet top employers','General','2025-07-25','12:00:00',11,1,'Rejected','event-1745074913432.jpeg');
/*!40000 ALTER TABLE `events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `feedback`
--

LOCK TABLES `feedback` WRITE;
/*!40000 ALTER TABLE `feedback` DISABLE KEYS */;
INSERT INTO `feedback` VALUES (4,12,14,'Great content, loved the speakers!',5,'2025-04-19 15:22:23'),(5,12,5,'Could use more time for Q&A.',4,'2025-04-19 15:23:17'),(8,8,14,'Room was crowded but well organized.',3,'2025-04-19 15:24:38'),(9,7,14,'Loved the discussion and panel!',5,'2025-04-19 16:41:23');
/*!40000 ALTER TABLE `feedback` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (4,1,'Your event booking has been approved.',0,'2025-04-10 22:11:48'),(5,2,'Reminder: Science Fair starts at 10 AM tomorrow.',0,'2025-04-10 22:11:48'),(6,3,'Your event registration was successful.',1,'2025-04-10 22:11:48'),(7,14,'You successfully RSVPed to Event #10',0,'2025-04-19 15:00:00'),(8,11,'Your event \"JUST Career Fair\" was rejected.',0,'2025-04-19 15:07:19');
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `room_bookings`
--

LOCK TABLES `room_bookings` WRITE;
/*!40000 ALTER TABLE `room_bookings` DISABLE KEYS */;
INSERT INTO `room_bookings` VALUES (4,2,1,'2025-04-01 08:00:00','2025-04-01 10:00:00','Approved'),(5,4,2,'2025-04-02 14:00:00','2025-04-02 16:00:00','Pending'),(6,5,3,'2025-04-03 09:30:00','2025-04-03 11:30:00','Rejected');
/*!40000 ALTER TABLE `room_bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `rooms`
--

LOCK TABLES `rooms` WRITE;
/*!40000 ALTER TABLE `rooms` DISABLE KEYS */;
INSERT INTO `rooms` VALUES (4,'Main Auditorium','Main Building',200,'Available'),(5,'Meeting Room A','Admin Building',50,'Booked'),(6,'Science Lab','Science Faculty',30,'Available');
/*!40000 ALTER TABLE `rooms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `saved_events`
--

LOCK TABLES `saved_events` WRITE;
/*!40000 ALTER TABLE `saved_events` DISABLE KEYS */;
INSERT INTO `saved_events` VALUES (1,14,12,'2025-04-20 07:28:26');
/*!40000 ALTER TABLE `saved_events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Ahmed Alattar','ahmed.alattar@example.com','hashedpassword1','System Admin',NULL,1,NULL,'Local',NULL,'2025-04-10 22:11:48',NULL,NULL,NULL),(2,'Khaled Salem','khaled.salem@example.com','hashedpassword2','Campus Admin',NULL,1,NULL,'Local',NULL,'2025-04-10 22:11:48',NULL,NULL,NULL),(3,'Marwa Khatib','marwa.khatib@example.com','hashedpassword3','Organizer',NULL,1,NULL,'Local','uploads/club-proof.pdf','2025-04-10 22:11:48',NULL,NULL,NULL),(4,'Noor Hassan','noor.hassan@example.com','hashedpassword4','Student',NULL,1,NULL,'Local',NULL,'2025-04-10 22:11:48',NULL,NULL,NULL),(5,'Sara Jundi','sara.jundi@example.com','hashedpassword5','Student',NULL,1,NULL,'Local',NULL,'2025-04-10 22:11:48',NULL,NULL,NULL),(6,'Omar Rashed','omar.rashed@example.com','hashedpassword6','Visitor',NULL,1,NULL,'Google',NULL,'2025-04-10 22:11:48',NULL,NULL,NULL),(7,'Leen Said','leen.said@example.com','$2b$10$enJWqhrTotIsBGrh90QigOTAm5ngyxAIeVAWkTdPu1FGvz.Yo1H4G','Pending','',0,'123456','Local',NULL,'2025-04-10 22:11:48',NULL,NULL,NULL),(8,'Rami Odeh','rami.odeh@example.com','hashedpassword8','Pending','Organizer',1,NULL,'Local','uploads/organizer-proof.pdf','2025-04-10 22:11:48',NULL,NULL,NULL),(9,'Bayan Qasem','bayan.qasem@college.just.edu.jo',NULL,'Student',NULL,1,NULL,'Microsoft',NULL,'2025-04-10 22:11:48',NULL,NULL,NULL),(10,'Test User','test.user@example.com','$2b$10$ntAfCaTgaOt3MvSs1z2U6.iueC50qg7wA9aQwwL.lVfvHPwZKXKcW','Pending',NULL,1,NULL,'Local',NULL,'2025-04-15 15:49:14',NULL,NULL,NULL),(11,'Event Organizer','organizer1@example.com','$2b$10$8KvSEHEUKe7gE/SRLrI6COBuIAexqNiOojT0ITrgiU4t0x0fxzC4K','Organizer',NULL,1,NULL,'Local',NULL,'2025-04-16 15:22:48',NULL,NULL,'2025-04-19 18:59:28'),(12,'Test User','testuser@example.com','$2b$10$il/qN.obgCIfZXDJ265Vx.StWds9mpGI3Nca0aLAvsEEvPVe1L99q','Pending',NULL,1,NULL,'Local',NULL,'2025-04-18 19:57:53',NULL,NULL,'2025-04-19 12:44:11'),(13,'Nada Samara','nrsamara20@gmail.com',NULL,'Pending',NULL,1,NULL,'Google',NULL,'2025-04-18 20:14:52',NULL,NULL,NULL),(14,'RSVP Student','student1@example.com','$2b$10$63BoTykGtsir4faPjI5Fl.3V1XvAs5U7UOpP3uw.c2Kq1TFWNqmGi','Student',NULL,1,NULL,'Local',NULL,'2025-04-19 12:46:53',NULL,NULL,'2025-04-19 13:25:55'),(15,'Campus Reviewer','admin1@just.edu.jo','$2b$10$nm13rkHW0RBTEKsAVlLv.ekbmrQXV.g8Q1X13.3UItJCGnNDB62Vq','Campus Admin',NULL,1,NULL,'Local',NULL,'2025-04-19 13:34:00',NULL,NULL,'2025-04-19 15:04:50');
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

-- Dump completed on 2025-04-20 10:33:03
