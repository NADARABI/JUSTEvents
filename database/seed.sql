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
INSERT INTO approvals (admin_id, entity_type, entity_id, status, decision_reason, reviewed_at)
VALUES
(2, 'Event', 1, 'Approved', 'Meets all criteria', NOW()),
(2, 'Room Booking', 2, 'Pending', 'Awaiting confirmation', NOW());
/*!40000 ALTER TABLE `approvals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `event_rsvps`
--

LOCK TABLES `event_rsvps` WRITE;
/*!40000 ALTER TABLE `event_rsvps` DISABLE KEYS */;
INSERT INTO event_rsvps (event_id, user_id, status, created_at)
VALUES
(4, 1, 'Going', NOW()),
(5, 2, 'Not Going', NOW()),
(6, 3, 'Going', NOW());
/*!40000 ALTER TABLE `event_rsvps` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
INSERT INTO events (title, description, date, time, organizer_id, venue_id, status)
VALUES
('Tech Meetup', 'A discussion about AI advancements.', '2025-05-10', '14:00:00', 3, 1, 'Approved'),
('Business Seminar', 'How to start a successful business.', '2025-06-15', '10:30:00', 3, 2, 'Pending'),
('Science Fair', 'A showcase of university research projects.', '2025-07-10', '11:00:00', 3, 3, 'Approved');
/*!40000 ALTER TABLE `events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO notifications (user_id, message, is_read, created_at)
VALUES
(1, 'Your event booking has been approved.', 0, NOW()),
(2, 'Reminder: Science Fair starts at 10 AM tomorrow.', 0, NOW()),
(3, 'Your event registration was successful.', 1, NOW());
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `room_bookings`
--

LOCK TABLES `room_bookings` WRITE;
/*!40000 ALTER TABLE `room_bookings` DISABLE KEYS */;
INSERT INTO room_bookings (user_id, room_id, start_time, end_time, status)
VALUES
(2, 1, '2025-04-01 08:00:00', '2025-04-01 10:00:00', 'Approved'),
(4, 2, '2025-04-02 14:00:00', '2025-04-02 16:00:00', 'Pending'),
(5, 3, '2025-04-03 09:30:00', '2025-04-03 11:30:00', 'Rejected');
/*!40000 ALTER TABLE `room_bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `rooms`
--

LOCK TABLES `rooms` WRITE;
/*!40000 ALTER TABLE `rooms` DISABLE KEYS */;
INSERT INTO rooms (name, building, capacity, status)
VALUES
('Main Auditorium', 'Main Building', 200, 'Available'),
('Meeting Room A', 'Admin Building', 50, 'Booked'),
('Science Lab', 'Science Faculty', 30, 'Available');
/*!40000 ALTER TABLE `rooms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO users (name, email, password_hash, role, requested_role, is_verified, verification_code, provider, attachment, created_at)
VALUES
-- Verified Users
('Ahmed Alattar', 'ahmed.alattar@example.com', 'hashedpassword1', 'System Admin', NULL, TRUE, NULL, 'Local', NULL, NOW()),
('Khaled Salem', 'khaled.salem@example.com', 'hashedpassword2', 'Campus Admin', NULL, TRUE, NULL, 'Local', NULL, NOW()),
('Marwa Khatib', 'marwa.khatib@example.com', 'hashedpassword3', 'Organizer', NULL, TRUE, NULL, 'Local', 'uploads/club-proof.pdf', NOW()),
('Noor Hassan', 'noor.hassan@example.com', 'hashedpassword4', 'Student', NULL, TRUE, NULL, 'Local', NULL, NOW()),
('Sara Jundi', 'sara.jundi@example.com', 'hashedpassword5', 'Student', NULL, TRUE, NULL, 'Local', NULL, NOW()),
('Omar Rashed', 'omar.rashed@example.com', 'hashedpassword6', 'Visitor', NULL, TRUE, NULL, 'Google', NULL, NOW()),

-- New Users for Testing
('Leen Said', 'leen.said@example.com', 'hashedpassword7', 'Pending', 'Student', FALSE, '123456', 'Local', NULL, NOW()),
('Rami Odeh', 'rami.odeh@example.com', 'hashedpassword8', 'Pending', 'Organizer', TRUE, NULL, 'Local', 'uploads/organizer-proof.pdf', NOW()),
('Bayan Qasem', 'bayan.qasem@college.just.edu.jo', NULL, 'Student', NULL, TRUE, NULL, 'Microsoft', NULL, NOW());

UPDATE users
SET reset_token = 'test-token-123',
    reset_token_expiry = NOW() + INTERVAL 1 HOUR
WHERE email = 'test.user@example.com';
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

-- Dump completed on 2025-03-19  3:38:12
