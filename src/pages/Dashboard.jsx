import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import AccountCard from '../components/AccountCard';
import TransactionChart from '../components/TransactionChart';
import RecentTransactions from '../components/RecentTransactions';
import QuickActions from '../components/QuickActions';

const Dashboard = () => {
  const { user } = useAuth();

  const mockAccounts = [
    {
      id: 1,
      name: 'Checking Account',
      accountNumber: '****1234',
      balance: 5247.32,
      type: 'checking',
      currency: 'USD'
    },
    {
      id: 2,
      name: 'Savings Account',
      accountNumber: '****5678',
      balance: 12543.87,
      type: 'savings',
      currency: 'USD'
    },
    {
      id: 3,
      name: 'Credit Card',
      accountNumber: '****9012',
      balance: -1234.56,
      type: 'credit',
      currency: 'USD'
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.name?.split(' ')[0]}!
        </h1>
        <p className="text-gray-600 mt-2">Here's your financial overview</p>
      </div>

      {/* Account Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {mockAccounts.map((account) => (
          <AccountCard key={account.id} account={account} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2">
          <TransactionChart />
        </div>
        
        {/* Quick Actions */}
        <div>
          <QuickActions />
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="mt-8">
        <RecentTransactions />
      </div>
    </div>
  );
};

export default Dashboard;