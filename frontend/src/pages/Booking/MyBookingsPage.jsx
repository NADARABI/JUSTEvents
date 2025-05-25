import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import "../../pages/Booking/styles/MyBookingsPage.css";

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        // Get the token from localStorage
        const token = localStorage.getItem('token');
        
        if (!token) {
          console.error("Token not found. Please login first.");
          toast.error("Unauthorized. Please login.");
          setLoading(false);
          return;
        }

        // Make API call with Authorization header
        const response = await axios.get('http://localhost:5000/api/bookings/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("My Bookings Response:", response.data);

        setBookings(response.data.data);
      } catch (error) {
        console.error('Failed to fetch your bookings:', error.message);
        toast.error('Failed to fetch your bookings.');
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const handleCancel = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error("Unauthorized. Please login.");
        return;
      }

      await axios.delete(`http://localhost:5000/api/bookings/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success('Booking canceled successfully');
      setBookings((prev) => prev.filter((booking) => booking.id !== id));
    } catch (error) {
      toast.error('Failed to cancel the booking');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="my-bookings">
      <h1>My Room Bookings</h1>
      <div className="booking-grid">
        {bookings.map((booking) => (
          <div key={booking.id} className="booking-card">
            <h2>{booking.room_name}</h2>
            <p><strong>Purpose:</strong> {booking.purpose}</p>
            <p><strong>Start Time:</strong> {new Date(booking.start_time).toLocaleString()}</p>
            <p><strong>End Time:</strong> {new Date(booking.end_time).toLocaleString()}</p>
            <p><strong>Status:</strong> {booking.status}</p>
            {booking.status === 'Pending' && (
              <button onClick={() => handleCancel(booking.id)} className="cancel-button">
                Cancel Booking
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBookingsPage;
