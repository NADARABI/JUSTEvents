// src/pages/EventManagement/EventsPage.jsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAllEvents } from '../../services/eventService.js';
import EventCard from '../../components/Events/EventCard.jsx';
import SearchBar from '../../components/Landing/SearchBar';
import CategoryFilterStrip from '../../components/Landing/CategoryFilterStrip';
import Footer from '../../components/common/Footer.jsx';
import './eventsPage.css';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('latest');
  const [upcomingActive, setUpcomingActive] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Get the search query, category, and upcoming flag from the URL
  const searchQuery = new URLSearchParams(location.search).get('search');
  const categoryQuery = new URLSearchParams(location.search).get('category') || 'All';
  const isUpcoming = new URLSearchParams(location.search).get('upcoming') === 'true';

  // Restore the dynamic title
  const capitalize = (str) =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  const title = isUpcoming
    ? 'Upcoming Events at JUST'
    : categoryQuery === 'All'
    ? 'Discover Events at JUST'
    : `Explore ${capitalize(categoryQuery)} Events at JUST`;

  // Fetch events from backend
  useEffect(() => {
    setUpcomingActive(isUpcoming);

    const fetchEvents = async () => {
      try {
        const categoryFilter = categoryQuery === 'All' ? '' : `&category=${categoryQuery}`;
        const searchParam = searchQuery ? `&search=${searchQuery}` : '';
        const upcomingParam = isUpcoming ? `&upcoming=true` : '';

        const query = `?status=Approved${categoryFilter}&sort=${sort}${searchParam}${upcomingParam}`;
        
        console.log("Query sent:", query);
        const res = await getAllEvents(query);
        console.log('Filtered events:', res.data);
        setEvents(res.data?.data || []);
      } catch (err) {
        console.error('Failed to fetch events:', err);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [categoryQuery, sort, searchQuery, isUpcoming]);

  // Handle Sort Change
  const handleSortChange = (e) => {
    setSort(e.target.value);
  };

  // Handle Category Change
  const handleCategoryClick = (category) => {
    console.log("Category clicked:", category);
    const query = category === 'All' ? '' : `?category=${category}`;
    navigate(`/events${query}`);
  };

  // Handle Upcoming Toggle Click
  const toggleUpcoming = () => {
    if (upcomingActive) {
      navigate('/events');
    } else {
      navigate('/events?upcoming=true');
    }
    setUpcomingActive(!upcomingActive);
  };

  return (
    <>
      <div className="events-page-container">
        <h1 className="events-title">{title}</h1>

        {/* Search + Filter Bar */}
        <div className="filter-bar">
          <SearchBar fromNav={false} />

          <select value={sort} onChange={handleSortChange} className="filter-dropdown">
            <option value="latest">Latest</option>
            <option value="popular">Most Popular</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>

        {/* Category Strip */}
        <CategoryFilterStrip onCategoryClick={handleCategoryClick} />

        {/* Upcoming Events Toggle Button */}
        <button 
          className={`upcoming-events-button ${upcomingActive ? 'active' : ''}`}
          onClick={toggleUpcoming}
        >
          {upcomingActive ? 'Show All Events' : 'View Upcoming Events'}
        </button>

        {loading ? (
          <p className="loading-text">Loading events...</p>
        ) : events.length === 0 ? (
          <p className="empty-text">No events available at this time.</p>
        ) : (
          <div className="events-grid">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default EventsPage;
