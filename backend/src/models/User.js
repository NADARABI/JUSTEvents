// src/models/User.js
import db from '../utils/db.js';

class User {
  // Utility function to handle database errors
  static handleDBError(error, action) {
    console.error(`Error during ${action}:`, error.message);
    return null;
  }

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
      //return this.handleDBError(error, 'user creation');
      console.error('Error in User.create():', error); 
      throw error; 
    }
  }

  // Find user by email
  static async findByEmail(email) {
    try {
      const [rows] = await db.execute(`SELECT * FROM users WHERE email = ?`, [email]);
      return rows[0] || null;
    } catch (error) {
      return this.handleDBError(error, 'finding user by email');
    }
  }

  // Find user by ID
  static async findById(id) {
    try {
      const [rows] = await db.execute(`SELECT * FROM users WHERE id = ?`, [id]);
      return rows[0] || null;
    } catch (error) {
      return this.handleDBError(error, 'finding user by ID');
    }
  }

  // Get all users
  static async getAllUsers() {
    try {
      const [rows] = await db.execute(`SELECT * FROM users`);
      return rows;
    } catch (error) {
      return this.handleDBError(error, 'fetching all users');
    }
  }

  // Check if email is verified
  static async isEmailVerified(email) {
    try {
      const [rows] = await db.execute(
        `SELECT is_verified FROM users WHERE email = ?`, [email]
      );
      return rows[0]?.is_verified || false;
    } catch (error) {
      return this.handleDBError(error, 'checking email verification');
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
      return this.handleDBError(error, 'verifying email');
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
      return this.handleDBError(error, 'updating verification code');
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
      return this.handleDBError(error, 'resetting password');
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
      return this.handleDBError(error, 'updating password by ID');
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
      return this.handleDBError(error, 'updating user role');
    }
  }

  // Store role request
  static async storeRoleRequest(userId, role, attachment = null) {
    try {
      const [result] = await db.execute(
        `UPDATE users SET requested_role = ?, attachment = ? WHERE id = ?`,
        [role, attachment, userId]
      );
      return result.affectedRows;
    } catch (error) {
      return this.handleDBError(error, 'storing role request');
    }
  }

  // Get users by role
  static async getUsersByRole(role) {
    try {
      const [rows] = await db.execute(`SELECT * FROM users WHERE role = ?`, [role]);
      return rows;
    } catch (error) {
      return this.handleDBError(error, 'fetching users by role');
    }
  }

  // Get list of pending users
  static async getPendingUsers() {
    try {
      const [rows] = await db.execute(`SELECT * FROM users WHERE role = 'Pending'`);
      return rows;
    } catch (error) {
      return this.handleDBError(error, 'fetching pending users');
    }
  }

  // Soft delete user
  static async softDeleteUser(id) {
    try {
      const [result] = await db.execute(
        `UPDATE users SET role = 'Deleted' WHERE id = ?`,
        [id]
      );
      return result.affectedRows;
    } catch (error) {
      return this.handleDBError(error, 'soft deleting user');
    }
  }

  // Update profile fields (name, email, etc.)
  static async updateUserProfile(id, fields) {
    try {
      const updates = [];
      const values = [];

      for (const [key, value] of Object.entries(fields)) {
        updates.push(`${key} = ?`);
        values.push(value);
      }

      values.push(id); // for WHERE clause

      const [result] = await db.execute(
        `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
        values
      );
      return result.affectedRows;
    } catch (error) {
      console.error("Error updating user profile:", error.message);
      return 0;
    }
  }

  // Search users by email fragment (for admin)
  static async searchByEmailFragment(keyword) {
    try {
      const [rows] = await db.execute(
        `SELECT * FROM users WHERE email LIKE ? AND role = 'Pending'`,
        [`%${keyword}%`]
      );
      return rows;
    } catch (error) {
      console.error("Error searching users by email:", error.message);
      return [];
    }
  }

  // Track last login timestamp
  static async updateLastLogin(id) {
    try {
      const [result] = await db.execute(
        `UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?`,
        [id]
      );
      return result.affectedRows;
    } catch (error) {
      console.error("Error updating last login:", error.message);
      return 0;
    }
  }

  // Store both reset tocken and expiry in database
  static async storeResetToken(email, token, expiry) {
    try {
      const [result] = await db.execute(
        `UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE email = ?`,
        [token, expiry, email]
      );
      return result.affectedRows > 0; // Returns true if a row was affected
    } catch (error) {
      console.error('Error storing reset token:', error.message);
      return false;
    }
  }

  // find user by reset token
  static async findByResetToken(token) {
    try {
      const [rows] = await db.execute(
        `SELECT * FROM users WHERE reset_token = ? AND reset_token_expiry > NOW()`,
        [token]
      );
      return rows[0] || null; // Return user if token is valid, else null
    } catch (error) {
      console.error('Error finding user by reset token:', error.message);
      return null;
    }
  }

  //clear reset token and expiry
  static async clearResetToken(email) {
    try {
      const [result] = await db.execute(
        `UPDATE users SET reset_token = NULL, reset_token_expiry = NULL WHERE email = ?`,
        [email]
      );
      return result.affectedRows > 0; // Returns true if the token was cleared
    } catch (error) {
      console.error('Error clearing reset token:', error.message);
      return false;
    }
  }

  //update the password after validation of the reset token
  static async setResetPassword(email, hash) {
    try {
      const [result] = await db.execute(
        `UPDATE users SET password_hash = ? WHERE email = ?`,
        [hash, email]
      );
      return result.affectedRows > 0; // Returns true if the password is updated
    } catch (error) {
      console.error('Error updating password:', error.message);
      return false;
    }
  }
}

export default User;
