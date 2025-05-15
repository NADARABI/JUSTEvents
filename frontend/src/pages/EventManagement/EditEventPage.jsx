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
  const [initialValues, setInitialValues] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    venue_id: '',
    image: null,
  });

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await getEventById(id);
        const event = res.data;
        setInitialValues({
          title: event.title,
          description: event.description,
          date: event.date,
          time: event.time,
          venue_id: event.venue_id,
        });
        setImagePreview(event.imageUrl); // Assuming imageUrl is returned
      } catch (err) {
        console.error('Failed to fetch event details:', err);
        toast.error('Failed to load event details');
      }
    };

    fetchEvent();
  }, [id]);

  const handleEdit = async (formData) => {
    try {
      setLoading(true);

      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('date', formData.date);
      data.append('time', formData.time);
      data.append('venue_id', formData.venue_id);

      if (formData.image) {
        data.append('image', formData.image);
      }

      await editEvent(id, data);
      toast.success('Event updated successfully');
      navigate('/organizer/my-events');
    } catch (err) {
      console.error('Update event error:', err);
      toast.error('Failed to update event');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setInitialValues({ ...initialValues, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="edit-event-container">
      <h1 className="edit-event-heading">Edit Event</h1>
      <form
        className="event-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleEdit(initialValues);
        }}
      >
        <input
          type="text"
          placeholder="Event Title"
          className="form-input"
          value={initialValues.title}
          onChange={(e) => setInitialValues({ ...initialValues, title: e.target.value })}
          required
        />
        <textarea
          placeholder="Event Description"
          className="form-input"
          rows="4"
          value={initialValues.description}
          onChange={(e) => setInitialValues({ ...initialValues, description: e.target.value })}
          required
        />
        <input
          type="date"
          className="form-input"
          value={initialValues.date}
          onChange={(e) => setInitialValues({ ...initialValues, date: e.target.value })}
          required
        />
        <input
          type="time"
          className="form-input"
          value={initialValues.time}
          onChange={(e) => setInitialValues({ ...initialValues, time: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Venue ID"
          className="form-input"
          value={initialValues.venue_id}
          onChange={(e) => setInitialValues({ ...initialValues, venue_id: e.target.value })}
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
          {loading ? "Updating..." : "Update Event"}
        </button>
      </form>
    </div>
  );
};

export default EditEventPage;
