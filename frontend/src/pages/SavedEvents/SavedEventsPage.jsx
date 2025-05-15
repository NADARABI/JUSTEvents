import React, { useEffect, useState } from 'react';
import { getSavedEvents, unsaveEvent } from '../../services/savedEventsService';
import { toast } from 'react-toastify';
import SavedEventCard from '../../components/SavedEvents/SavedEventCard';
import Footer from '../../components/common/Footer';
import './savedEvents.css';

const SavedEventsPage = () => {
  const [savedEvents, setSavedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  /**
   * Fetch Saved Events on Mount
   */
  useEffect(() => {
    const fetchSavedEvents = async () => {
      try {
        const events = await getSavedEvents();
        
        if (Array.isArray(events)) {
          setSavedEvents(events);
        } else {
          console.error('Expected an array but got:', events);
          toast.error('Failed to load saved events');
          setSavedEvents([]); // Set it to an empty array if it fails
        }
      } catch (error) {
        console.error(error.message);
        toast.error('Failed to load saved events');
        setSavedEvents([]); // Set it to an empty array if it fails
      } finally {
        setLoading(false);
      }
    };

    fetchSavedEvents();
  }, []);

  /**
   * Handle Unsave Event
   */
  const handleUnsave = async (eventId) => {
    try {
      await unsaveEvent(eventId);
      setSavedEvents((prev) => prev.filter((event) => event.id !== eventId));
      toast.success('Removed from saved events');
    } catch (error) {
      console.error(error.message);
      toast.error('Failed to unsave event');
    }
  };

  /**
   * Render Logic
   */
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
              <SavedEventCard
                key={event.id}
                event={event}
                onUnsave={handleUnsave}
              />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default SavedEventsPage;
