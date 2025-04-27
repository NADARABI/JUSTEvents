// src/controllers/adminController.js
import User from '../models/User.js';

// GET /admin/pending-users
export const getPendingUsers = async (req, res) => {
  try {
    const users = await User.getPendingUsers();
    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error('Error fetching pending users:', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// PATCH /admin/approve/:id
export const approveUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user || user.role !== 'Pending') {
      return res.status(404).json({ success: false, message: 'Pending user not found' });
    }

    if (!user.requested_role) {
      return res.status(400).json({ success: false, message: 'User has no requested role' });
    }

    await User.updateRole(id, user.requested_role);
    res.status(200).json({ success: true, message: `User approved as ${user.requested_role}` });
  } catch (error) {
    console.error('Error approving user:', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// PATCH /admin/reject/:id
export const rejectUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user || user.role !== 'Pending') {
      return res.status(404).json({ success: false, message: 'Pending user not found' });
    }

    await User.updateRole(id, 'Visitor');
    res.status(200).json({ success: true, message: 'User rejected and set as Visitor' });
  } catch (error) {
    console.error('Error rejecting user:', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
