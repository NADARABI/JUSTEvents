import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEventById, editEvent } from '../../services/eventService';
import EventForm from '../../components/Events/EventForm';
import { toast } from 'react-toastify';
import './EditEventPage.css';

const EditEventPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [initialValues, setInitialValues] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data } = await getEventById(id);
        setInitialValues({
          title: data.title,
          description: data.description,
          date: data.date,
          time: data.time,
          venue_id: data.venue_id,
          image: null,
        });
      } catch (err) {
        console.error('Failed to load event', err);
        toast.error('Error loading event data');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleEdit = async (formData) => {
    try {
      await editEvent(id, formData);
      toast.success('Event updated successfully');
      navigate('/organizer/my-events');
    } catch (err) {
      console.error('Edit event error:', err);
      toast.error('Failed to update event');
    }
  };

  if (loading) return <div className="text-center text-[#113A5D] mt-10">Loading...</div>;
  if (!initialValues) return null;

  return (
    <div className="edit-event-container">
      <h1 className="edit-event-heading">Edit Event</h1>
      <EventForm
        initialValues={initialValues}
        onSubmit={handleEdit}
        isEditing={true}
        buttonLabel="Update Event"
      />
    </div>
  );
};

export default EditEventPage;
