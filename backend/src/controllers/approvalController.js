import Approval from '../models/Approval.js';
import Event from '../models/Event.js';

export const getPendingEvents = async (req, res) => {
  try {
    const approvals = await Approval.getPending('Event');
    res.json(approvals);
  } catch (err) {
    console.error('getPendingEvents:', err);
    res.status(500).json({ message: 'Failed to fetch pending approvals' });
  }
};

export const reviewEvent = async (req, res) => {
  try {
    const { event_id } = req.params;
    const { status, reason } = req.body;
    const admin_id = req.user.id;

    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid approval status' });
    }

    const affected = await Approval.updateStatus({
      entity_type: 'Event',
      entity_id: event_id,
      admin_id,
      status,
      reason,
    });

    if (!affected) {
      return res.status(404).json({ message: 'Approval record not found' });
    }

    await Event.updateStatus(event_id, status);

    res.json({ message: `Event ${status.toLowerCase()} successfully` });
  } catch (err) {
    console.error('reviewEvent:', err);
    res.status(500).json({ message: 'Failed to process event approval' });
  }
};
