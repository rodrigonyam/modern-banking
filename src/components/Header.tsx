import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { BellIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = async (): Promise<void> => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-gray-900">SecureBank</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <button 
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Notifications"
          >
            <BellIcon className="h-6 w-6" />
          </button>
          <button 
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Settings"
          >
            <Cog6ToothIcon className="h-6 w-6" />
          </button>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {user?.name?.charAt(0)}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <button
                onClick={handleLogout}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;