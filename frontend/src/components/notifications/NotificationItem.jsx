import React from 'react';
import './notifications.css';

const NotificationItem = ({ notification }) => {
  const { message, type, created_at, is_read } = notification;

  return (
    <div className={`notification-card ${type} ${is_read ? 'read' : 'unread'}`}>
      <div className="message">{message}</div>
      <div className="timestamp">{new Date(created_at).toLocaleString()}</div>
    </div>
  );
};

export default NotificationItem;
