import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpTrayIcon, DocumentTextIcon, QrCodeIcon } from '@heroicons/react/24/outline';

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      name: 'Transfer Money',
      icon: ArrowUpTrayIcon,
      action: () => navigate('/transfer'),
      color: 'bg-blue-500'
    },
    {
      name: 'View Statements',
      icon: DocumentTextIcon,
      action: () => navigate('/transactions'),
      color: 'bg-green-500'
    },
    {
      name: 'Scan QR',
      icon: QrCodeIcon,
      action: () => alert('QR Code Scanner - Coming Soon!'),
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
      <div className="space-y-3">
        {actions.map((action) => (
          <button
            key={action.name}
            onClick={action.action}
            className="w-full flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className={`p-2 ${action.color} rounded-lg`}>
              <action.icon className="h-5 w-5 text-white" />
            </div>
            <span className="ml-3 text-gray-900 font-medium">{action.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;