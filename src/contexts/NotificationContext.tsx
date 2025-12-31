import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import Toast from '../components/Toast';
import type { NotificationContextType, Notification } from '@/types';

interface NotificationProviderProps {
  children: ReactNode;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((notification: Omit<Notification, 'id'>): string => {
    const id = `${Date.now()}-${Math.random()}`;
    const newNotification: Notification = {
      id,
      type: 'info',
      duration: 5000,
      ...notification
    };

    setNotifications(prev => [...prev, newNotification]);

    // Auto-remove notification after duration
    if (newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }

    return id;
  }, []);

  const removeNotification = useCallback((id: string): void => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const clearNotifications = useCallback((): void => {
    setNotifications([]);
  }, []);

  const showSuccess = useCallback((message: string, options: Partial<Omit<Notification, 'id' | 'type' | 'message'>> = {}): string => {
    return addNotification({ ...options, type: 'success', title: message });
  }, [addNotification]);

  const showError = useCallback((message: string, options: Partial<Omit<Notification, 'id' | 'type' | 'message'>> = {}): string => {
    return addNotification({ ...options, type: 'error', title: message, duration: 7000 });
  }, [addNotification]);

  const showWarning = useCallback((message: string, options: Partial<Omit<Notification, 'id' | 'type' | 'message'>> = {}): string => {
    return addNotification({ ...options, type: 'warning', title: message });
  }, [addNotification]);

  const showInfo = useCallback((message: string, options: Partial<Omit<Notification, 'id' | 'type' | 'message'>> = {}): string => {
    return addNotification({ ...options, type: 'info', title: message });
  }, [addNotification]);

  const value: NotificationContextType = {
    notifications,
    addNotification,
    removeNotification,
    clearNotifications,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map((notification) => (
          <Toast
            key={notification.id}
            {...notification}
            onClose={() => removeNotification(notification.id)}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  );
};