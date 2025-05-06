import React from 'react';
import { useNavigate } from 'react-router-dom';
import { createEvent } from '../../services/eventService';
import EventForm from '../../components/Events/EventForm';
import { toast } from 'react-toastify';
import './CreateEventPage.css';

const CreateEventPage = () => {
  const navigate = useNavigate();

  const handleCreate = async (formData) => {
    try {
      const res = await createEvent(formData);
      toast.success('Event created and pending approval');
      navigate('/organizer/my-events');
    } catch (err) {
      console.error('Create event error:', err);
      toast.error('Failed to create event');
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

  return (
    <div className="create-event-container">
      <h1 className="create-event-heading">Create New Event</h1>
      <EventForm
        initialValues={initialValues}
        onSubmit={handleCreate}
        buttonLabel="Create Event"
      />
    </div>
  );
};

export default CreateEventPage;
