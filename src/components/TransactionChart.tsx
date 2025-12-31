import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { ChartDataPoint } from '@/types';

const TransactionChart: React.FC = () => {
  const data: ChartDataPoint[] = [
    { date: 'Jan', income: 4000, expenses: 2400 },
    { date: 'Feb', income: 3000, expenses: 1398 },
    { date: 'Mar', income: 2000, expenses: 9800 },
    { date: 'Apr', income: 2780, expenses: 3908 },
    { date: 'May', income: 1890, expenses: 4800 },
    { date: 'Jun', income: 2390, expenses: 3800 },
    { date: 'Jul', income: 3490, expenses: 4300 },
  ];

  return (
    <div 
      className="bg-white rounded-lg shadow-md p-6" 
      role="region" 
      aria-labelledby="chart-heading"
    >
      <h3 id="chart-heading" className="text-lg font-semibold text-gray-900 mb-4">
        Income vs Expenses
      </h3>
      <div 
        className="h-64" 
        role="img" 
        aria-label="Line chart showing income versus expenses over time. Income line in green, expenses line in red."
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart 
            data={data}
            aria-label="Monthly income and expenses data visualization"
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              aria-label="Months"
            />
            <YAxis 
              aria-label="Amount in dollars"
            />
            <Tooltip 
              aria-label="Hover for detailed values"
            />
            <Line 
              type="monotone" 
              dataKey="income" 
              stroke="#10b981" 
              strokeWidth={2}
              name="Income"
              aria-label="Income trend line"
            />
            <Line 
              type="monotone" 
              dataKey="expenses" 
              stroke="#ef4444" 
              strokeWidth={2}
              name="Expenses"
              aria-label="Expenses trend line"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TransactionChart;