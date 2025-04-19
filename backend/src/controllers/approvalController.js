import Approval from '../models/Approval.js';
import Event from '../models/Event.js';
import Notification from '../models/Notification.js';

const sendResponse = (res, status, message, data = null) => {
  res.status(status).json({ success: status < 400, message, data });
};

// Get all pending event approvals
export const getPendingEvents = async (req, res) => {
  try {
    const approvals = await Approval.getPending('Event');
    sendResponse(res, 200, 'Pending event approvals fetched', approvals);
  } catch (err) {
    console.error('getPendingEvents error:', err);
    sendResponse(res, 500, 'Failed to fetch pending approvals');
  }
};

// Review (approve/reject) a specific event
export const reviewEvent = async (req, res) => {
  try {
    const { event_id } = req.params;
    const { status, reason } = req.body;
    const admin_id = req.user.id;

    if (!['Approved', 'Rejected'].includes(status)) {
      return sendResponse(res, 400, 'Invalid approval status');
    }

    const affected = await Approval.updateStatus({
      entity_type: 'Event',
      entity_id: event_id,
      admin_id,
      status,
      reason
    });

    if (!affected) {
      return sendResponse(res, 404, 'Approval record not found');
    }

    await Event.updateStatus(event_id, status);
    const event = await Event.findById(event_id);
    await Notification.create(event.organizer_id, `Your event "${event.title}" was ${status.toLowerCase()}.`);

    sendResponse(res, 200, `Event ${status.toLowerCase()} successfully`);
  } catch (err) {
    console.error('reviewEvent error:', err);
    sendResponse(res, 500, 'Failed to process event approval');
  }
};
