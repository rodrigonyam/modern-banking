import React, { useEffect } from 'react';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  InformationCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import type { ToastProps, NotificationType } from '@/types/components';

const Toast: React.FC<ToastProps> = ({ id, type = 'info', message, title, duration = 5000, onClose }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose(id);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, id, onClose]);

  const getTypeStyles = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return {
          containerClass: 'bg-green-50 border-green-200',
          iconClass: 'text-green-500',
          titleClass: 'text-green-800',
          messageClass: 'text-green-700',
          icon: CheckCircleIcon
        };
      case 'error':
        return {
          containerClass: 'bg-red-50 border-red-200',
          iconClass: 'text-red-500',
          titleClass: 'text-red-800',
          messageClass: 'text-red-700',
          icon: XCircleIcon
        };
      case 'warning':
        return {
          containerClass: 'bg-yellow-50 border-yellow-200',
          iconClass: 'text-yellow-500',
          titleClass: 'text-yellow-800',
          messageClass: 'text-yellow-700',
          icon: ExclamationTriangleIcon
        };
      case 'info':
      default:
        return {
          containerClass: 'bg-blue-50 border-blue-200',
          iconClass: 'text-blue-500',
          titleClass: 'text-blue-800',
          messageClass: 'text-blue-700',
          icon: InformationCircleIcon
        };
    }
  };

  const { containerClass, iconClass, titleClass, messageClass, icon: Icon } = getTypeStyles(type);

  return (
    <div className={`max-w-sm w-full border rounded-lg shadow-lg p-4 ${containerClass} animate-slide-in`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <Icon className={`h-5 w-5 ${iconClass}`} />
        </div>
        <div className="ml-3 flex-1">
          {title && (
            <p className={`text-sm font-medium ${titleClass}`}>
              {title}
            </p>
          )}
          <p className={`text-sm ${messageClass} ${title ? 'mt-1' : ''}`}>
            {message}
          </p>
        </div>
        <div className="ml-4 flex-shrink-0">
          <button
            onClick={() => onClose(id)}
            className="inline-flex rounded-md p-1.5 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-gray-600"
            aria-label="Close notification"
          >
            <XMarkIcon className="h-4 w-4 text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toast;