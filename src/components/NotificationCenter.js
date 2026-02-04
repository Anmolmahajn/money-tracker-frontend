import React, { useState, useEffect } from 'react';
import { notificationAPI } from '../services/api';
import { Bell, CheckCircle } from 'lucide-react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

function NotificationCenter() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    loadNotifications();
    connectWebSocket();
  }, []);

  const loadNotifications = async () => {
    try {
      const response = await notificationAPI.getUnread();
      setNotifications(response.data);
      setUnreadCount(response.data.length);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const connectWebSocket = () => {
    const socket = new SockJS('http://localhost:8080/ws');
    const stompClient = Stomp.over(socket);
    
    stompClient.connect({}, () => {
      stompClient.subscribe('/user/queue/notifications', (message) => {
        const notification = JSON.parse(message.body);
        setNotifications(prev => [notification, ...prev]);
        setUnreadCount(prev => prev + 1);
        showToast(notification);
      });
    });
  };

  const showToast = (notification) => {
    // Toast notification logic
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <strong>${notification.title}</strong>
      <p>${notification.message}</p>
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 5000);
  };

  const markAsRead = async (id) => {
    try {
      await notificationAPI.markAsRead(id);
      loadNotifications();
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  return (
    <div className="notification-center">
      <button className="notification-bell" onClick={() => setShowDropdown(!showDropdown)}>
        <Bell size={24} />
        {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
      </button>

      {showDropdown && (
        <div className="notification-dropdown">
          <h3>Notifications</h3>
          {notifications.map(notif => (
            <div key={notif.id} className="notification-item">
              <strong>{notif.title}</strong>
              <p>{notif.message}</p>
              <button onClick={() => markAsRead(notif.id)}>
                <CheckCircle size={16} /> Mark as read
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default NotificationCenter;