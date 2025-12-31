import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  HomeIcon,
  CreditCardIcon,
  ArrowTrendingUpIcon,
  CurrencyDollarIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Accounts', href: '/accounts', icon: CreditCardIcon },
  { name: 'Transactions', href: '/transactions', icon: ArrowTrendingUpIcon },
  { name: 'Transfer', href: '/transfer', icon: CurrencyDollarIcon },
];

const Sidebar = () => {
  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="flex items-center justify-center h-16 bg-blue-600">
        <BanknotesIcon className="h-8 w-8 text-white" />
        <span className="ml-2 text-white text-xl font-bold">SecureBank</span>
      </div>
      
      <nav className="mt-8">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-colors ${
                isActive ? 'bg-gray-100 text-blue-600 border-r-4 border-blue-600' : ''
              }`
            }
          >
            <item.icon className="h-5 w-5 mr-3" />
            {item.name}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;