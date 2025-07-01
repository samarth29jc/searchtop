import React, { useEffect, useState } from 'react';
import './NotificationPopup.css';
import Icon from '../../media/icon/icons.jsx';

const NotificationPopup = ({ 
  isOpen, 
  onClose, 
  notifications = [], 
  activeTab = 'unread',
  onTabChange,
  className = '' 
}) => {
  const [show, setShow] = useState(isOpen);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShow(true);
      setAnimating(false);
    } else if (show) {
      setAnimating(true);
      const timer = setTimeout(() => {
        setShow(false);
        setAnimating(false);
      }, 300); // match CSS transition duration
      return () => clearTimeout(timer);
    }
  }, [isOpen, show]);

  if (!show) return null;

  const unreadNotifications = notifications.filter(n => !n.isRead);
  const readNotifications = notifications.filter(n => n.isRead);
  
  const displayNotifications = activeTab === 'unread' ? unreadNotifications : readNotifications;

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleNotificationRemove = (notificationId, e) => {
    e.stopPropagation();
    // Handle notification removal logic here
    console.log('Remove notification:', notificationId);
  };

  return (
    <>
      <div className="notification-overlay" onClick={onClose} />
      <div className={`notification-popup ${className} ${isOpen ? 'open' : 'close'}`}>
        <div className="notification-header">
          <div className="notification-title">
            <div className="notification-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
              </svg>
            </div>
            <span>Notifications</span>
          </div>
          <button className="close-btn" onClick={onClose}>
            <Icon name='cross' width={20} height={20}></Icon>
          </button>
        </div>

        <div className="notification-tabs">
          <button 
            className={`tab-btn ${activeTab === 'unread' ? 'active' : ''}`}
            onClick={() => onTabChange('unread')}
          >
            Un-Read
            {unreadNotifications.length > 0 && (
              <span className="notification-count">{unreadNotifications.length}</span>
            )}
          </button>
          <button 
            className={`tab-btn ${activeTab === 'read' ? 'active' : ''}`}
            onClick={() => onTabChange('read')}
          >
            Read
          </button>
        </div>

        <div className="notification-content">
          {displayNotifications.length === 0 ? (
            <div className="no-notifications">
              <p>No {activeTab} notifications</p>
            </div>
          ) : (
            displayNotifications.map((notification) => (
              <div key={notification.id} className="notification-item">
                <div className="notification-info">
                  <h4 className="notification-type">{notification.type}</h4>
                  <p className="notification-message">{notification.message}</p>
                  <span className="notification-time">{formatTime(notification.timestamp)}</span>
                </div>
                <button 
                  className="remove-btn"
                  onClick={(e) => handleNotificationRemove(notification.id, e)}
                  aria-label="Remove notification"
                >
                 <Icon name="cross" width={16} height={16}></Icon>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default NotificationPopup;