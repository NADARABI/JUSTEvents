import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import "../../pages/Booking/styles/BookingForm.css";

const BookingForm = () => {
  const [roomId, setRoomId] = useState('');
  const [purpose, setPurpose] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!roomId || !purpose || !startTime || !endTime) {
      toast.error('All fields are required');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error("Token not found. Please login first.");
        setLoading(false);
        return;
      }

      await axios.post('http://localhost:5000/api/bookings', {
        room_id: roomId,
        purpose,
        start_time: startTime,
        end_time: endTime,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      toast.success('Booking created successfully');
    } catch (error) {
      toast.error('Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-form">
      <h1>Create New Booking</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          placeholder="Room ID"
        />
        <input
          type="text"
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          placeholder="Purpose"
        />
        <input
          type="datetime-local"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
        <input
          type="datetime-local"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export default BookingForm;
