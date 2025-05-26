import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../services/api';
import NavBar from '../../components/common/NavBar';
import Footer from '../../components/common/Footer';
import "../../pages/Booking/styles/BookingForm.css";

const BookingForm = () => {
  const [roomId, setRoomId] = useState('');
  const [purpose, setPurpose] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!roomId || !purpose || !startTime || !endTime) {
      toast.error('All fields are required');
      return;
    }

    setLoading(true);
    try {
      await api.post('/booking/bookings', {
        room_id: roomId,
        purpose,
        start_time: startTime,
        end_time: endTime,
      });

      toast.success('Booking created successfully');
      setTimeout(() => navigate('/bookings/me'), 1500);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavBar />

      <div className="booking-form">
        <button className="back-button" onClick={() => navigate(-1)}>← Back</button>
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

      <Footer />
    </>
  );
};

export default BookingForm;
