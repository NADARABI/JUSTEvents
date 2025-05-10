// src/pages/EventManagement/CreateEventPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createEvent } from '../../services/eventService';
import { toast } from 'react-toastify';
import './CreateEventPage.css';

const CreateEventPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  // State for form values
  const [formValues, setFormValues] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    venue_id: '',
    image: null,
  });

  // ===  Handle Input Changes (Including File Upload) ===
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      const file = files[0];
      if (file) {
        setFormValues({ ...formValues, image: file });
        setImagePreview(URL.createObjectURL(file));
      }
    } else {
      setFormValues({ ...formValues, [name]: value });
    }
  };

  // === Handle Form Submission ===
  const handleCreate = async (e) => {
    e.preventDefault();

    // === Validation for Date & Time ===
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    const timeRegex = /^\d{2}:\d{2}$/;

    if (!dateRegex.test(formValues.date)) {
      toast.error('Invalid date format. Use YYYY-MM-DD');
      return;
    }

    if (!timeRegex.test(formValues.time)) {
      toast.error('Invalid time format. Use HH:MM');
      return;
    }

    // === Prepare FormData ===
    const formData = new FormData();
    Object.entries(formValues).forEach(([key, value]) => {
      formData.append(key, value);
    });

    try {
      setLoading(true);
      await createEvent(formData);
      toast.success('Event created and pending approval');
      navigate('/organizer/my-events');
    } catch (err) {
      console.error('Create event error:', err);
      if (err.response && err.response.data) {
        toast.error(`${err.response.data.message}`);
      } else {
        toast.error('Failed to create event');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-event-container">
      <h1 className="create-event-heading">Create New Event</h1>

      <form className="event-form" onSubmit={handleCreate}>
        <input
          type="text"
          name="title"
          placeholder="Event Title"
          className="form-input"
          value={formValues.title}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Event Description"
          className="form-input"
          rows="4"
          value={formValues.description}
          onChange={handleChange}
          required
        />

        <input
          type="date"
          name="date"
          className="form-input"
          value={formValues.date}
          onChange={handleChange}
          required
        />

        <input
          type="time"
          name="time"
          className="form-input"
          value={formValues.time}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="venue_id"
          placeholder="Venue ID"
          className="form-input"
          value={formValues.venue_id}
          onChange={handleChange}
          required
        />

        <input
          type="file"
          name="image"
          className="form-input"
          accept="image/*"
          onChange={handleChange}
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
