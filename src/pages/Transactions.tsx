import React, { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';

const Transactions = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [dateRange, setDateRange] = useState('all');

  const mockTransactions = [
    {
      id: 1,
      description: 'Grocery Store',
      amount: -85.43,
      date: new Date('2024-01-15'),
      category: 'Food',
      type: 'debit',
      account: 'Checking ****1234'
    },
    {
      id: 2,
      description: 'Salary Deposit',
      amount: 3500.00,
      date: new Date('2024-01-14'),
      category: 'Income',
      type: 'credit',
      account: 'Checking ****1234'
    },
    {
      id: 3,
      description: 'Electric Bill',
      amount: -125.00,
      date: new Date('2024-01-13'),
      category: 'Utilities',
      type: 'debit',
      account: 'Checking ****1234'
    },
    {
      id: 4,
      description: 'Online Shopping',
      amount: -234.99,
      date: new Date('2024-01-12'),
      category: 'Shopping',
      type: 'debit',
      account: 'Credit Card ****9012'
    },
    {
      id: 5,
      description: 'Gas Station',
      amount: -45.67,
      date: new Date('2024-01-11'),
      category: 'Transportation',
      type: 'debit',
      account: 'Checking ****1234'
    },
    {
      id: 6,
      description: 'Restaurant',
      amount: -78.50,
      date: new Date('2024-01-10'),
      category: 'Food',
      type: 'debit',
      account: 'Credit Card ****9012'
    }
  ];

  const categories = ['all', ...new Set(mockTransactions.map(t => t.category))];

  const filteredTransactions = useMemo(() => {
    return mockTransactions.filter(transaction => {
      const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'all' || transaction.category === filterCategory;
      
      let matchesDate = true;
      if (dateRange !== 'all') {
        const now = new Date();
        const transactionDate = new Date(transaction.date);
        const daysAgo = parseInt(dateRange);
        const cutoffDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
        matchesDate = transactionDate >= cutoffDate;
      }
      
      return matchesSearch && matchesCategory && matchesDate;
    });
  }, [searchTerm, filterCategory, dateRange]);

  const totalAmount = filteredTransactions.reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Transaction History</h1>
        <p className="text-gray-600 mt-2">View and search your transaction history</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>

          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Time</option>
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 90 Days</option>
          </select>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Showing {filteredTransactions.length} transactions</p>
            <p className="text-2xl font-bold text-gray-900">
              {totalAmount >= 0 ? '+' : '-'}${Math.abs(totalAmount).toFixed(2)}
            </p>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
            Export to CSV
          </button>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Account
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {format(transaction.date, 'MMM d, yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {transaction.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transaction.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transaction.account}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-right ${
                    transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'credit' ? '+' : '-'}${Math.abs(transaction.amount).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Transactions;