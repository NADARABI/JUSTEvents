// src/utils/sendResponse.js

// Utility function to send standardized responses
export const sendResponse = (res, statusCode, message, data = null) => {
    res.status(statusCode).json({
      success: statusCode >= 200 && statusCode < 300,
      message,
      data,
    });
  };
  