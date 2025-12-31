import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  HomeIcon,
  CreditCardIcon,
  ArrowTrendingUpIcon,
  CurrencyDollarIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Accounts', href: '/accounts', icon: CreditCardIcon },
  { name: 'Transactions', href: '/transactions', icon: ArrowTrendingUpIcon },
  { name: 'Transfer', href: '/transfer', icon: CurrencyDollarIcon },
];

const Sidebar: React.FC = () => {
  return (
    <div className="w-64 bg-white shadow-lg" role="navigation" aria-label="Main navigation">
      <div className="flex items-center justify-center h-16 bg-blue-600">
        <BanknotesIcon className="h-8 w-8 text-white" aria-hidden="true" />
        <span className="ml-2 text-white text-xl font-bold" aria-label="SecureBank logo">
          SecureBank
        </span>
      </div>
      
      <nav className="mt-8" aria-label="Primary navigation">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-colors ${
                isActive ? 'bg-gray-100 text-blue-600 border-r-4 border-blue-600' : ''
              }`
            }
            aria-label={`Navigate to ${item.name}`}
            aria-current={({ isActive }) => isActive ? 'page' : undefined}
          >
            <item.icon className="h-5 w-5 mr-3" aria-hidden="true" />
            {item.name}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;