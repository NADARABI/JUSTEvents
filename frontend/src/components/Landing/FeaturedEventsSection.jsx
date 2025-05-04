import React, { useEffect, useState } from 'react';
import EventCard from '../Events/EventCard';
import eventService from '../../services/eventService';
import './featuredEventsSection.css';
const mockEvents = [
    {
      id: 1,
      title: "AI & Machine Learning Workshop",
      date: "2025-05-20",
      description: "Join us for a deep dive into modern AI tools and ML techniques.",
      category: "Tech",
      image_url: "ai_workshop.jpg", // add this image to /public/uploads/
    },
    {
      id: 2,
      title: "JUST Marathon 2025",
      date: "2025-06-02",
      description: "Run with students, staff, and faculty in our annual JUST marathon!",
      category: "Sports",
      image_url: "marathon.webp",
    },
    {
      id: 3,
      title: "Medical Club First Aid Training",
      date: "2025-05-28",
      description: "Certified hands-on training in emergency response and first aid.",
      category: "Health",
      image_url: "first_aid.jpeg",
    },
  ];
  
  
const FeaturedEventsSection = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchFeatured = async () => {
//       try {
//         const response = await eventService.getPopularEvents();
//         setEvents(response.data || []);
//       } catch (error) {
//         console.error('Failed to fetch popular events:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchFeatured();
//   }, []);
useEffect(() => {
    setTimeout(() => {
      setEvents(mockEvents);
      setLoading(false);
    }, 500); // Simulate fetch delay
  }, []);
  

  return (
    <section className="featured-events-section">
      <h2 className="section-title"> Featured Events</h2>
      {loading ? (
        <p className="loading-text">Loading featured events...</p>
      ) : events.length > 0 ? (
        <div className="event-card-grid">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <p className="empty-text">No featured events available right now.</p>
      )}
    </section>
  );
};

export default FeaturedEventsSection;
