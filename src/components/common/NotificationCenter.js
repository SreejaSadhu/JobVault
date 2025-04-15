import React, { useState, useEffect } from 'react';
import { onMessage } from 'firebase/messaging';
import { messaging } from '../../firebase/firebaseInit.js';
import './NotificationCenter.css';

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log('Message received in foreground:', payload);
      
      // Add new notification to the list
      const newNotification = {
        id: Date.now(),
        title: payload.notification.title,
        body: payload.notification.body,
        timestamp: new Date(),
        read: false
      };
      
      setNotifications(prev => [newNotification, ...prev]);
      
      // Show notification panel when new notification arrives
      setShowNotifications(true);
      
      // Auto-hide after 5 seconds
      setTimeout(() => {
        setShowNotifications(false);
      }, 5000);
    });
    
    return () => unsubscribe();
  }, []);
  
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };
  
  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };
  
  const clearNotifications = () => {
    setNotifications([]);
  };
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  return (
    <div className="notification-center">
      <button 
        className="notification-bell" 
        onClick={toggleNotifications}
      >
        {/* Replace Font Awesome icon with a simple text or emoji */}
        🔔
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </button>
      
      {showNotifications && (
        <div className="notification-panel">
          <div className="notification-header">
            <h3>Notifications</h3>
            {notifications.length > 0 && (
              <button 
                className="clear-notifications" 
                onClick={clearNotifications}
              >
                Clear All
              </button>
            )}
          </div>
          
          <div className="notification-list">
            {notifications.length === 0 ? (
              <p className="no-notifications">No notifications</p>
            ) : (
              notifications.map(notification => (
                <div 
                  key={notification.id} 
                  className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <h4>{notification.title}</h4>
                  <p>{notification.body}</p>
                  <span className="notification-time">
                    {notification.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;