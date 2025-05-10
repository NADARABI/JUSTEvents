import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import "../../pages/Booking/styles/PendingBookingsPage.css";

const PendingBookingsPage = () => {
  const [pendingBookings, setPendingBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPendingBookings = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error("Token not found. Please login first.");
          setLoading(false);
          return;
        }

        const response = await axios.get('http://localhost:5000/api/bookings/pending', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setPendingBookings(response.data.data);
      } catch (error) {
        toast.error('Failed to fetch pending bookings');
      } finally {
        setLoading(false);
      }
    };
    fetchPendingBookings();
  }, []);

  const handleReview = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:5000/api/bookings/${id}`, { status }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(`Booking ${status} successfully`);
      setPendingBookings((prev) => prev.filter((booking) => booking.id !== id));
    } catch (error) {
      toast.error('Failed to update booking status');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="pending-bookings">
      <h1>Pending Room Bookings</h1>
      <div className="booking-grid">
        {pendingBookings.map((booking) => (
          <div key={booking.id} className="booking-card">
            <h2>{booking.room_name}</h2>
            <p><strong>Purpose:</strong> {booking.purpose}</p>
            <p><strong>Start Time:</strong> {new Date(booking.start_time).toLocaleString()}</p>
            <p><strong>End Time:</strong> {new Date(booking.end_time).toLocaleString()}</p>
            <div className="buttons">
              <button onClick={() => handleReview(booking.id, 'Approved')} className="approve-button">
                Approve
              </button>
              <button onClick={() => handleReview(booking.id, 'Rejected')} className="reject-button">
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PendingBookingsPage;
