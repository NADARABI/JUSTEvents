import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import axios from 'axios';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import "./styles/RoomCalendarView.css";

const localizer = momentLocalizer(moment);

const RoomCalendarView = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        //Get the token from localStorage
        const token = localStorage.getItem('token');
        
        if (!token) {
          console.error("Token not found. Please login first.");
          alert("You must be logged in to view this page.");
          setLoading(false);
          return;
        }

        // Call the API with Authorization header
        const response = await axios.get('http://localhost:5000/booking/bookings/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Print the data for debugging
        console.log("Response Data from API:", response.data);

        // Check if the data is an array
        if (Array.isArray(response.data.data)) {
          // Filter out the events and format them for the calendar
          const formattedEvents = response.data.data
            .filter((booking) => booking.start_time && booking.end_time)
            .map((booking) => ({
              id: booking.id,
              title: `${booking.room_name || "No Room"} - ${booking.purpose || "No Purpose"}`,
              start: new Date(booking.start_time),
              end: new Date(booking.end_time),
              allDay: false,
            }));

          // Debugging: Check formatted events
          console.log("Formatted Events for Calendar:", formattedEvents);

          // Update the state with formatted events
          setEvents(formattedEvents);
        } else {
          console.error("The data returned is not an array:", response.data.data);
          alert("Failed to load bookings. Please try again later.");
        }
      } catch (error) {
        console.error('Failed to fetch bookings for calendar view:', error.message);
        alert("Failed to fetch bookings. Please check the console for errors.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="room-calendar">
      <h1>Room Booking Calendar</h1>
      <div className="calendar-container">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
        />
      </div>
    </div>
  );
};

export default RoomCalendarView;
