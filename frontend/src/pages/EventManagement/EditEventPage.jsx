import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { editEvent, getEventById } from '../../services/eventService';
import { toast } from 'react-toastify';
import './EditEventPage.css';

const EditEventPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  // Form state
  const [formValues, setFormValues] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    venue_id: '',
    image: null,
  });

  /**
   * Fetch Event Details on Mount
   */
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await getEventById(id);
        const event = res.data.data;

        setFormValues({
          title: event.title,
          description: event.description,
          date: event.date,
          time: event.time,
          venue_id: event.venue_id,
          image: null, // Image will be updated if changed
        });

        // Display the existing image preview if available
        if (event.image_url) {
          setImagePreview(`/images/${event.image_url}`);
        }
      } catch (err) {
        console.error('Failed to fetch event details:', err.message);
        toast.error('Failed to load event details');
      }
    };

    fetchEvent();
  }, [id]);

  /**
   * Handle Image Change
   */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormValues({ ...formValues, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  /**
   * Handle Input Changes
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  /**
   * Handle Edit Submission
   */
  const handleEdit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('title', formValues.title);
      formData.append('description', formValues.description);
      formData.append('date', formValues.date);
      formData.append('time', formValues.time);
      formData.append('venue_id', formValues.venue_id);

      if (formValues.image) {
        formData.append('image', formValues.image);
      }

      await editEvent(id, formData);
      toast.success('Event updated successfully');
      navigate('/organizer/my-events');
    } catch (err) {
      console.error('Update event error:', err.message);
      toast.error('Failed to update event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-event-container">
      <h1 className="edit-event-heading">Edit Event</h1>
      <form className="event-form" onSubmit={handleEdit}>
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
          className="form-input"
          accept="image/*"
          onChange={handleImageChange}
        />

        {/* Image Preview */}
        {imagePreview && (
          <div className="image-preview">
            <img src={imagePreview} alt="Preview" />
          </div>
        )}

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Updating..." : "Update Event"}
        </button>
      </form>
    </div>
  );
};

export default EditEventPage;
