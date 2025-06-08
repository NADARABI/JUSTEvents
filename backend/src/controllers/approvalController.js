import Approval from '../models/Approval.js';
import Event from '../models/Event.js';
import { createNotification } from '../utils/notificationHelper.js';
import { sendResponse } from '../utils/sendResponse.js';

// GET /admin/pending-events
export const getPendingEvents = async (req, res) => {
  try {
    const approvals = await Approval.getPending('Event');
    sendResponse(res, 200, 'Pending event approvals fetched successfully', approvals);
  } catch (err) {
    console.error('getPendingEvents error:', err.message);
    sendResponse(res, 500, 'Failed to fetch event approvals');
  }
};
export const reviewEvent = async (req, res) => {
  try {
    const { event_id } = req.params;
    const { status, reason } = req.body;
    const admin_id = req.user.id;

    if (!['Approved', 'Rejected'].includes(status)) {
      return sendResponse(res, 400, 'Invalid approval status');
    }

    const event = await Event.findById(event_id);
    if (!event) {
      return sendResponse(res, 404, 'Event not found');
    }

    if (event.status !== 'Pending') {
      return sendResponse(res, 409, `Event is already ${event.status.toLowerCase()} and cannot be reviewed again`);
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

    await createNotification(
      event.organizer_id,
      `Your event "${event.title}" was ${status.toLowerCase()}.`,
      status === 'Approved' ? 'success' : 'warning'
    );

    sendResponse(res, 200, `Event ${status.toLowerCase()} successfully`);
  } catch (err) {
    console.error('reviewEvent error:', err.message);
    sendResponse(res, 500, 'Failed to process event approval');
  }
};