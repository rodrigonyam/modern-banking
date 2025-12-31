import React from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const AccountDetails = ({ account, onBack }) => {
  const getAccountSpecificInfo = () => {
    switch (account.type) {
      case 'checking':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Routing Number</p>
              <p className="font-semibold">{account.routingNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending Transactions</p>
              <p className="font-semibold">${account.pendingTransactions?.toFixed(2)}</p>
            </div>
          </div>
        );
      case 'savings':
        return (
          <div>
            <p className="text-sm text-gray-500">Interest Rate</p>
            <p className="font-semibold">{account.interestRate}% APY</p>
          </div>
        );
      case 'credit':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Credit Limit</p>
              <p className="font-semibold">${account.creditLimit?.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Available Credit</p>
              <p className="font-semibold">${account.availableCredit?.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Due Date</p>
              <p className="font-semibold">{account.dueDate}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Minimum Payment</p>
              <p className="font-semibold">${account.minimumPayment?.toFixed(2)}</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      <button
        onClick={onBack}
        className="flex items-center text-blue-600 hover:text-blue-700 mb-6"
      >
        <ArrowLeftIcon className="h-5 w-5 mr-2" />
        Back to Accounts
      </button>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{account.name}</h2>
            <p className="text-gray-500">{account.accountNumber}</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-gray-900">
              ${Math.abs(account.balance).toFixed(2)}
            </p>
            <p className="text-gray-500">Current Balance</p>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Account Type</p>
                <p className="font-semibold capitalize">{account.type} Account</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Available Balance</p>
                <p className="font-semibold">${account.availableBalance?.toFixed(2) || Math.abs(account.balance).toFixed(2)}</p>
              </div>
            </div>
            {getAccountSpecificInfo()}
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex space-x-4">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
              Transfer Money
            </button>
            <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors">
              Download Statement
            </button>
            <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors">
              Set Up Alerts
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountDetails;