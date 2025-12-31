import React from 'react';
import { format } from 'date-fns';
import type { Transaction } from '@/types';

interface RecentTransaction extends Omit<Transaction, 'id' | 'accountId' | 'status'> {
  id: number;
  type: 'credit' | 'debit';
}

const RecentTransactions: React.FC = () => {
  const transactions: RecentTransaction[] = [
    {
      id: 1,
      description: 'Grocery Store',
      amount: -85.43,
      date: '2024-01-15',
      category: 'Food',
      type: 'debit'
    },
    {
      id: 2,
      description: 'Salary Deposit',
      amount: 3500.00,
      date: '2024-01-14',
      category: 'Income',
      type: 'credit'
    },
    {
      id: 3,
      description: 'Electric Bill',
      amount: -125.00,
      date: '2024-01-13',
      category: 'Utilities',
      type: 'debit'
    },
    {
      id: 4,
      description: 'Online Shopping',
      amount: -234.99,
      date: '2024-01-12',
      category: 'Shopping',
      type: 'debit'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
          View All
        </button>
      </div>
      
      <div className="space-y-3">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                transaction.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
              }`}>
                <span className={`text-sm font-medium ${
                  transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'credit' ? '+' : '-'}
                </span>
              </div>
              <div className="ml-3">
                <p className="font-medium text-gray-900">{transaction.description}</p>
                <p className="text-sm text-gray-500">{transaction.category}</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`font-semibold ${
                transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
              }`}>
                {transaction.type === 'credit' ? '+' : '-'}${Math.abs(transaction.amount).toFixed(2)}
              </p>
              <p className="text-sm text-gray-500">
                {format(new Date(transaction.date), 'MMM d')}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentTransactions;