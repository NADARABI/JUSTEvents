import React, { useEffect, useState } from 'react';
import { fetchNotifications, markAllAsRead } from '../../services/notificationService';
import NotificationItem from '../../components/notifications/NotificationItem';
import './notificationsPage.css';
import { toast } from 'react-toastify';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    try {
      const data = await fetchNotifications();
      setNotifications(data);
    } catch {
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAll = async () => {
    try {
      await markAllAsRead();
      toast.success('All notifications marked as read');
      loadNotifications();
    } catch {
      toast.error('Failed to mark notifications as read');
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  return (
    <div className="notifications-page">
      <h2>🔔 Notifications</h2>
      <button className="mark-all-btn" onClick={handleMarkAll}>
        Mark All as Read
      </button>

      {loading ? (
        <p>Loading...</p>
      ) : notifications.length === 0 ? (
        <p>🎉 You're all caught up!</p>
      ) : (
        notifications.map((n) => (
          <NotificationItem key={n.id} notification={n} />
        ))
      )}
    </div>
  );
};

export default NotificationsPage;
