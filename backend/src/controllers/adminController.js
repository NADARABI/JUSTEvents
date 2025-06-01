// src/controllers/adminController.js
import User from '../models/User.js';
import { sendResponse } from '../utils/sendResponse.js'; 

// GET /admin/pending-users
export const getPendingUsers = async (req, res) => {
  try {
    const users = await User.getPendingUsers();
    sendResponse(res, 200, 'Pending users fetched successfully', users);
  } catch (err) {
    console.error('getPendingUsers error:', err.message);
    sendResponse(res, 500, 'Failed to fetch pending users');
  }
};

// PATCH /admin/approve/:id
export const approveUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return sendResponse(res, 404, 'User not found');
    }
    if (user.role !== 'Pending') {
      return sendResponse(res, 400, 'User is not pending approval');
    }

    if (!user.requested_role) {
      return sendResponse(res, 400, 'User has no requested role');
    }

    await User.updateRole(id, user.requested_role);
    sendResponse(res, 200, `User approved as ${user.requested_role}`);
  } catch (err) {
    console.error('approveUser error:', err.message);
    sendResponse(res, 500, 'Failed to approve user');
  }
};

// PATCH /admin/reject/:id
export const rejectUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    
    if (!user) {
      return sendResponse(res, 404, 'User not found');
    }
    if (user.role !== 'Pending') {
      return sendResponse(res, 400, 'User is not pending approval');
    }

    await User.updateRole(id, 'Visitor');
    sendResponse(res, 200, 'User rejected and set as Visitor');
  } catch (err) {
    console.error('rejectUser error:', err.message);
    sendResponse(res, 500, 'Failed to reject user');
  }
};
