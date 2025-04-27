import Notification from '../models/Notification.js';

export const getUserNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const notifications = await Notification.getByUser(userId);
    res.status(200).json({ success: true, data: notifications });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch notifications' });
  }
};
