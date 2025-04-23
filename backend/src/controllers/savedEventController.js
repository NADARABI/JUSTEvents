import SavedEvent from '../models/SavedEvent.js';

export const saveEvent = async (req, res) => {
  const user_id = req.user.id;
  const { id: event_id } = req.params;

  try {
    const success = await SavedEvent.save(user_id, event_id);
    if (!success) {
      return res.status(409).json({ success: false, message: 'Event already saved' });
    }
    res.status(201).json({ success: true, message: 'Event saved' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to save event' });
  }
};

export const getSavedEvents = async (req, res) => {
  const user_id = req.user.id;
  try {
    const saved = await SavedEvent.getSavedByUser(user_id);
    res.status(200).json({ success: true, data: saved });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch saved events' });
  }
};

export const unsaveEvent = async (req, res) => {
  const user_id = req.user.id;
  const { id: event_id } = req.params;

  try {
    const removed = await SavedEvent.remove(user_id, event_id);
    if (!removed) {
      return res.status(404).json({ success: false, message: 'Save not found' });
    }
    res.status(200).json({ success: true, message: 'Event unsaved' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to unsave event' });
  }
};
