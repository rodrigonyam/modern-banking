import React, { useState } from 'react';
import AccountCard from '../components/AccountCard';
import AccountDetails from '../components/AccountDetails';

const Accounts = () => {
  const [selectedAccount, setSelectedAccount] = useState(null);

  const mockAccounts = [
    {
      id: 1,
      name: 'Checking Account',
      accountNumber: '****1234',
      balance: 5247.32,
      type: 'checking',
      currency: 'USD',
      routingNumber: '021000021',
      availableBalance: 5247.32,
      pendingTransactions: 150.00
    },
    {
      id: 2,
      name: 'Savings Account',
      accountNumber: '****5678',
      balance: 12543.87,
      type: 'savings',
      currency: 'USD',
      routingNumber: '021000021',
      availableBalance: 12543.87,
      interestRate: 0.45
    },
    {
      id: 3,
      name: 'Credit Card',
      accountNumber: '****9012',
      balance: -1234.56,
      type: 'credit',
      currency: 'USD',
      creditLimit: 5000.00,
      availableCredit: 3765.44,
      dueDate: '2024-02-15',
      minimumPayment: 25.00
    }
  ];

  if (selectedAccount) {
    return (
      <AccountDetails 
        account={selectedAccount} 
        onBack={() => setSelectedAccount(null)} 
      />
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Accounts</h1>
        <p className="text-gray-600 mt-2">Manage all your accounts in one place</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mockAccounts.map((account) => (
          <div 
            key={account.id} 
            className="cursor-pointer hover:scale-105 transition-transform"
            onClick={() => setSelectedAccount(account)}
          >
            <AccountCard account={account} />
          </div>
        ))}
      </div>

      <div className="mt-8 bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Total Assets</h3>
        <p className="text-3xl font-bold text-blue-600">
          $16,556.63
        </p>
        <p className="text-blue-700 mt-1">Across all accounts</p>
      </div>
    </div>
  );
};

export default Accounts;