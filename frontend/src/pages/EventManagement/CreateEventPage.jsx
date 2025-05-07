import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createEvent } from '../../services/eventService';
import { toast } from 'react-toastify';
import './CreateEventPage.css';

const CreateEventPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const handleCreate = async (formData) => {
    try {
      setLoading(true);
      const res = await createEvent(formData);
      toast.success('Event created and pending approval');
      navigate('/organizer/my-events');
    } catch (err) {
      console.error('Create event error:', err);
      toast.error('Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  const initialValues = {
    title: '',
    description: '',
    date: '',
    time: '',
    venue_id: '',
    image: null,
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      initialValues.image = file;
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="create-event-container">
      <h1 className="create-event-heading">Create New Event</h1>
      <form className="event-form" onSubmit={(e) => {
        e.preventDefault();
        handleCreate(initialValues);
      }}>
        <input
          type="text"
          placeholder="Event Title"
          className="form-input"
          onChange={(e) => (initialValues.title = e.target.value)}
          required
        />
        <textarea
          placeholder="Event Description"
          className="form-input"
          rows="4"
          onChange={(e) => (initialValues.description = e.target.value)}
          required
        />
        <input
          type="date"
          className="form-input"
          onChange={(e) => (initialValues.date = e.target.value)}
          required
        />
        <input
          type="time"
          className="form-input"
          onChange={(e) => (initialValues.time = e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Venue ID"
          className="form-input"
          onChange={(e) => (initialValues.venue_id = e.target.value)}
          required
        />
        <input
          type="file"
          className="form-input"
          accept="image/*"
          onChange={handleImageChange}
        />

        {imagePreview && (
          <div className="image-preview">
            <img src={imagePreview} alt="Preview" />
          </div>
        )}

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Creating..." : "Create Event"}
        </button>
      </form>
    </div>
  );
};

export default CreateEventPage;
