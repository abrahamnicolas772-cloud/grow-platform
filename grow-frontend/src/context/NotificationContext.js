import React, { createContext, useState, useContext, useEffect } from 'react';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Charger les notifications depuis localStorage au démarrage
  useEffect(() => {
    const saved = localStorage.getItem('grow_notifications');
    if (saved) {
      const parsed = JSON.parse(saved);
      setNotifications(parsed);
      setUnreadCount(parsed.filter(n => !n.read).length);
    } else {
      // Notifications par défaut
      const defaultNotifications = [
        {
          id: 1,
          title: 'Welcome to GROW!',
          message: 'Start your learning journey today. Explore our courses and earn certificates.',
          type: 'info',
          read: false,
          date: new Date().toISOString(),
          link: '/courses'
        },
        {
          id: 2,
          title: 'New Course Available',
          message: 'Check out our new "Advanced React" course with hands-on projects!',
          type: 'success',
          read: false,
          date: new Date().toISOString(),
          link: '/courses'
        }
      ];
      setNotifications(defaultNotifications);
      setUnreadCount(defaultNotifications.length);
      localStorage.setItem('grow_notifications', JSON.stringify(defaultNotifications));
    }
  }, []);

  // Sauvegarder les notifications dans localStorage
  useEffect(() => {
    if (notifications.length > 0) {
      localStorage.setItem('grow_notifications', JSON.stringify(notifications));
    }
  }, [notifications]);

  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now(),
      read: false,
      date: new Date().toISOString(),
      ...notification
    };
    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);
  };

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
    setUnreadCount(0);
  };

  const clearNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
    localStorage.removeItem('grow_notifications');
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    const wasUnread = notifications.find(n => n.id === id)?.read === false;
    if (wasUnread) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      clearNotifications,
      removeNotification
    }}>
      {children}
    </NotificationContext.Provider>
  );
};