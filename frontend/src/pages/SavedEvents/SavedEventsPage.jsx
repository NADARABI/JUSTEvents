import React, { useEffect, useState } from 'react';
import { getSavedEvents, unsaveEvent } from '../../services/savedEventsService';
import { toast } from 'react-toastify';
import SavedEventCard from '../../components/SavedEvents/SavedEventCard';
import Footer from '../../components/common/Footer';
import './savedEvents.css';

const SavedEventsPage = () => {
  const [savedEvents, setSavedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedEvents = async () => {
      try {
        const res = await getSavedEvents();
        setSavedEvents(res.data);
      } catch (error) {
        toast.error('Failed to load saved events');
      } finally {
        setLoading(false);
      }
    };

    fetchSavedEvents();
  }, []);

  const handleUnsave = async (eventId) => {
    try {
      await unsaveEvent(eventId);
      setSavedEvents((prev) => prev.filter((event) => event.id !== eventId));
      toast.success('Removed from saved events');
    } catch {
      toast.error('Failed to unsave event');
    }
  };

  return (
    <>
      <div className="saved-events-container">
        <h2 className="saved-title">Your Saved Events</h2>

        {loading ? (
          <p className="text-center">Loading...</p>
        ) : savedEvents.length === 0 ? (
          <p className="text-center">No saved events yet.</p>
        ) : (
          <div className="saved-grid">
            {savedEvents.map((event) => (
              <SavedEventCard key={event.id} event={event} onUnsave={handleUnsave} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default SavedEventsPage;
