import React from 'react';
import { CreditCardIcon, BanknotesIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import type { AccountCardProps, AccountType } from '@/types';

const AccountCard: React.FC<AccountCardProps> = ({ account, onClick }) => {
  const getAccountIcon = (type: AccountType) => {
    switch (type) {
      case 'checking':
        return CreditCardIcon;
      case 'savings':
        return BanknotesIcon;
      case 'credit':
        return ShieldCheckIcon;
      default:
        return CreditCardIcon;
    }
  };

  const Icon = getAccountIcon(account.type);
  const isNegative = account.balance < 0;

  const handleClick = () => {
    if (onClick) {
      onClick(account);
    }
  };

  return (
    <div 
      className={`bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow ${
        onClick ? 'cursor-pointer' : ''
      }`}
      onClick={handleClick}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Icon className="h-6 w-6 text-blue-600" />
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-semibold text-gray-900">{account.name}</h3>
            <p className="text-sm text-gray-500">{account.accountNumber}</p>
          </div>
        </div>
      </div>
      
      <div className="mt-4">
        <p className="text-2xl font-bold text-gray-900">
          {isNegative ? '-' : ''}${Math.abs(account.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </p>
        <p className="text-sm text-gray-500 mt-1">Available balance</p>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <button 
          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          onClick={(e) => {
            e.stopPropagation();
            // Handle view details click
          }}
        >
          View Details →
        </button>
      </div>
    </div>
  );
};

export default AccountCard;