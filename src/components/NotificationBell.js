import { useState, useEffect, useRef } from 'react';
import { Bell, X, CheckCircle, Info, AlertCircle, Award, BookOpen, Calendar, ChevronRight } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import { Link } from 'react-router-dom';

function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification } = useNotifications();
  const dropdownRef = useRef(null);

  // Fermer le dropdown quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getIconByType = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={16} color="#10b981" />;
      case 'warning':
        return <AlertCircle size={16} color="#f59e0b" />;
      case 'info':
        return <Info size={16} color="#3b82f6" />;
      case 'certificate':
        return <Award size={16} color="#8b5cf6" />;
      case 'course':
        return <BookOpen size={16} color="#60a5fa" />;
      case 'reminder':
        return <Calendar size={16} color="#f59e0b" />;
      default:
        return <Info size={16} color="#94a3b8" />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    setIsOpen(false);
    if (notification.link) {
      window.location.href = notification.link;
    }
  };

  const bellStyle = {
    position: 'relative',
    cursor: 'pointer',
    background: 'transparent',
    border: 'none',
    padding: '0.5rem',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background 0.2s',
  };

  const badgeStyle = {
    position: 'absolute',
    top: '-2px',
    right: '-2px',
    background: '#ef4444',
    color: 'white',
    fontSize: '0.6rem',
    fontWeight: '600',
    minWidth: '16px',
    height: '16px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 3px',
  };

  const dropdownStyle = {
    position: 'absolute',
    top: '45px',
    right: '0',
    width: '380px',
    maxHeight: '450px',
    background: 'white',
    borderRadius: '0.75rem',
    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.02)',
    border: '1px solid #e2e8f0',
    overflow: 'hidden',
    zIndex: 1000,
  };

  const headerStyle = {
    padding: '0.75rem 1rem',
    borderBottom: '1px solid #e2e8f0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: '#f8fafc',
  };

  const headerTitleStyle = {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#1e293b',
  };

  const markAllButtonStyle = {
    fontSize: '0.7rem',
    color: '#3b82f6',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
  };

  const notificationListStyle = {
    maxHeight: '380px',
    overflowY: 'auto',
  };

  const notificationItemStyle = (read) => ({
    padding: '0.75rem 1rem',
    borderBottom: '1px solid #f1f5f9',
    cursor: 'pointer',
    transition: 'background 0.2s',
    background: read ? 'white' : '#f0f9ff',
  });

  const emptyStyle = {
    padding: '2rem',
    textAlign: 'center',
    color: '#94a3b8',
    fontSize: '0.8rem',
  };

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      <button
        style={bellStyle}
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
      >
        <Bell size={20} color="#1e293b" />
        {unreadCount > 0 && (
          <span style={badgeStyle}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div style={dropdownStyle}>
          <div style={headerStyle}>
            <span style={headerTitleStyle}>Notifications</span>
            {unreadCount > 0 && (
              <button style={markAllButtonStyle} onClick={markAllAsRead}>
                Mark all as read
              </button>
            )}
          </div>

          <div style={notificationListStyle}>
            {notifications.length === 0 ? (
              <div style={emptyStyle}>
                <Bell size={32} style={{ marginBottom: '0.5rem', opacity: 0.5 }} />
                <p>No notifications yet</p>
                <p style={{ fontSize: '0.7rem' }}>We'll notify you when something important happens</p>
              </div>
            ) : (
              notifications.map(notif => (
                <div
                  key={notif.id}
                  style={notificationItemStyle(notif.read)}
                  onClick={() => handleNotificationClick(notif)}
                  onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                  onMouseLeave={e => e.currentTarget.style.background = notif.read ? 'white' : '#f0f9ff'}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <div style={{ marginTop: '0.2rem' }}>
                      {getIconByType(notif.type)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '600', fontSize: '0.8rem', color: '#1e293b' }}>
                        {notif.title}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.25rem', lineHeight: '1.4' }}>
                        {notif.message}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                        <span style={{ fontSize: '0.6rem', color: '#94a3b8' }}>
                          {formatDate(notif.date)}
                        </span>
                        {notif.link && (
                          <span style={{ fontSize: '0.6rem', color: '#3b82f6', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                            View <ChevronRight size={10} />
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeNotification(notif.id);
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#94a3b8',
                        padding: '0.2rem',
                      }}
                      onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                      onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}
                    >
                      <X size={12} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;