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
    <div className="bg-white rounded-lg shadow-md p-6" role="region" aria-labelledby="recent-transactions-heading">
      <div className="flex items-center justify-between mb-4">
        <h3 id="recent-transactions-heading" className="text-lg font-semibold text-gray-900">
          Recent Transactions
        </h3>
        <button 
          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          aria-label="View all transactions"
        >
          View All
        </button>
      </div>
      
      <div className="space-y-3" role="list" aria-label="List of recent transactions">
        {transactions.map((transaction) => (
          <div 
            key={transaction.id} 
            className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg"
            role="listitem"
            aria-label={`Transaction: ${transaction.description}, ${transaction.type === 'credit' ? 'credit' : 'debit'} of $${Math.abs(transaction.amount).toFixed(2)} on ${format(new Date(transaction.date), 'MMMM d, yyyy')}`}
          >
            <div className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                transaction.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
              }`} aria-hidden="true">
                <span className={`text-sm font-medium ${
                  transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'credit' ? '+' : '-'}
                </span>
              </div>
              <div className="ml-3">
                <p className="font-medium text-gray-900" aria-label={`Description: ${transaction.description}`}>
                  {transaction.description}
                </p>
                <p className="text-sm text-gray-500" aria-label={`Category: ${transaction.category}`}>
                  {transaction.category}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className={`font-semibold ${
                transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
              }`} aria-label={`Amount: ${transaction.type === 'credit' ? 'credit' : 'debit'} of $${Math.abs(transaction.amount).toFixed(2)}`}>
                {transaction.type === 'credit' ? '+' : '-'}${Math.abs(transaction.amount).toFixed(2)}
              </p>
              <p className="text-sm text-gray-500" aria-label={`Date: ${format(new Date(transaction.date), 'MMMM d')}`}>
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