import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import "../../pages/Booking/styles/BookingDetails.css";

const BookingDetails = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error("Token not found. Please login first.");
          setLoading(false);
          return;
        }

        const response = await axios.get(`http://localhost:5000/api/bookings/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setBooking(response.data.data);
      } catch (error) {
        toast.error('Failed to fetch booking details');
      } finally {
        setLoading(false);
      }
    };
    fetchBookingDetails();
  }, [id]);

  if (loading) return <div>Loading...</div>;

  if (!booking) return <div>No booking found.</div>;

  return (
    <div className="booking-details">
      <h1>Booking Details</h1>

      <div className="details-card">
        <h2>{booking.room_name}</h2>
        <p><strong>Purpose:</strong> {booking.purpose}</p>
        <p><strong>Start Time:</strong> {new Date(booking.start_time).toLocaleString()}</p>
        <p><strong>End Time:</strong> {new Date(booking.end_time).toLocaleString()}</p>
        <p><strong>Status:</strong> {booking.status}</p>
        <p><strong>Booked By:</strong> {booking.user_name}</p>
        <p><strong>Email:</strong> {booking.user_email}</p>
        <p><strong>Created At:</strong> {new Date(booking.created_at).toLocaleString()}</p>
      </div>
    </div>
  );
};

export default BookingDetails;
