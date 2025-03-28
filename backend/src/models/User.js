// src/models/User.js
import db from '../utils/db.js';

class User {
  // Register user (form or SSO)
  static async create(userData) {
    try {
      const {
        name,
        email,
        password_hash,
        role = 'Pending',
        requested_role = null,
        is_verified = false,
        verification_code = null,
        provider = 'Local',
        attachment = null,
      } = userData;

      const [result] = await db.execute(
        `INSERT INTO users 
          (name, email, password_hash, role, requested_role, is_verified, verification_code, provider, attachment)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          name,
          email,
          password_hash,
          role,
          requested_role,
          is_verified,
          verification_code,
          provider,
          attachment,
        ]
      );

      return result.insertId;
    } catch (error) {
      console.error("Error creating user:", error.message);
      return null;
    }
  }

  // Find user by email
  static async findByEmail(email) {
    try {
      const [rows] = await db.execute(`SELECT * FROM users WHERE email = ?`, [email]);
      return rows[0] || null;
    } catch (error) {
      console.error("Error finding user by email:", error.message);
      return null;
    }
  }

  // Find user by ID
  static async findById(id) {
    try {
      const [rows] = await db.execute(`SELECT * FROM users WHERE id = ?`, [id]);
      return rows[0] || null;
    } catch (error) {
      console.error("Error finding user by ID:", error.message);
      return null;
    }
  }

  // Verify user's email
  static async verifyEmail(email) {
    try {
      const [result] = await db.execute(
        `UPDATE users SET is_verified = 1, verification_code = NULL WHERE email = ?`,
        [email]
      );
      return result.affectedRows;
    } catch (error) {
      console.error("Error verifying email:", error.message);
      return 0;
    }
  }

  // Update verification code
  static async updateVerificationCode(email, code) {
    try {
      const [result] = await db.execute(
        `UPDATE users SET verification_code = ? WHERE email = ?`, 
        [code, email]
      );
      return result.affectedRows;
    } catch (error) {
      console.error("Error updating verification code:", error.message);
      return 0;
    }
  }

  // Reset password
  static async setResetPassword(email, hash) {
    try {
      const [result] = await db.execute(
        `UPDATE users SET password_hash = ? WHERE email = ?`, 
        [hash, email]
      );
      return result.affectedRows;
    } catch (error) {
      console.error("Error resetting password:", error.message);
      return 0;
    }
  }

  // Update password by user ID
  static async updatePasswordById(id, hash) {
    try {
      const [result] = await db.execute(
        `UPDATE users SET password_hash = ? WHERE id = ?`,
        [hash, id]
      );
      return result.affectedRows;
    } catch (error) {
      console.error("Error updating password by ID:", error.message);
      return 0;
    }
  }

  // Update role after admin approval
  static async updateRole(userId, newRole) {
    try {
      const [result] = await db.execute(
        `UPDATE users SET role = ?, requested_role = NULL WHERE id = ?`,
        [newRole, userId]
      );
      return result.affectedRows;
    } catch (error) {
      console.error("Error updating role:", error.message);
      return 0;
    }
  }

  // Store role request (Organizer/Admin)
  static async storeRoleRequest(userId, role, attachment = null) {
    try {
      const [result] = await db.execute(
        `UPDATE users SET requested_role = ?, attachment = ? WHERE id = ?`,
        [role, attachment, userId]
      );
      return result.affectedRows;
    } catch (error) {
      console.error("Error storing role request:", error.message);
      return 0;
    }
  }

  // Get list of pending users (for admin approval)
  static async getPendingUsers() {
    try {
      const [rows] = await db.execute(`SELECT * FROM users WHERE role = 'Pending'`);
      return rows;
    } catch (error) {
      console.error("Error fetching pending users:", error.message);
      return [];
    }
  }

  // Soft delete or completely remove user by ID
  static async deleteUser(id) {
    try {
      const [result] = await db.execute(`DELETE FROM users WHERE id = ?`, [id]);
      return result.affectedRows;
    } catch (error) {
      console.error("Error deleting user:", error.message);
      return 0;
    }
  }
}

export default User;
