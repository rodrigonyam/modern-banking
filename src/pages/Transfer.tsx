import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpTrayIcon, UserIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';

const Transfer = () => {
  const navigate = useNavigate();
  const [transferType, setTransferType] = useState('internal');
  const [fromAccount, setFromAccount] = useState('');
  const [toAccount, setToAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [recipientAccount, setRecipientAccount] = useState('');
  const [routingNumber, setRoutingNumber] = useState('');
  const [description, setDescription] = useState('');

  const accounts = [
    { id: 1, name: 'Checking Account', accountNumber: '****1234', balance: 5247.32 },
    { id: 2, name: 'Savings Account', accountNumber: '****5678', balance: 12543.87 },
    { id: 3, name: 'Credit Card', accountNumber: '****9012', balance: -1234.56 }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Mock transfer processing
    alert(`Transfer of $${amount} initiated successfully!`);
    navigate('/dashboard');
  };

  const isFormValid = () => {
    if (transferType === 'internal') {
      return fromAccount && toAccount && amount && fromAccount !== toAccount;
    } else {
      return fromAccount && recipientName && recipientAccount && routingNumber && amount;
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Transfer Money</h1>
        <p className="text-gray-600 mt-2">Send money between your accounts or to external accounts</p>
      </div>

      {/* Transfer Type Selection */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Transfer Type</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => setTransferType('internal')}
            className={`p-4 border-2 rounded-lg flex items-center justify-center space-x-3 transition-colors ${
              transferType === 'internal' 
                ? 'border-blue-500 bg-blue-50 text-blue-700' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <ArrowUpTrayIcon className="h-6 w-6" />
            <span className="font-medium">Between My Accounts</span>
          </button>
          <button
            onClick={() => setTransferType('external')}
            className={`p-4 border-2 rounded-lg flex items-center justify-center space-x-3 transition-colors ${
              transferType === 'external' 
                ? 'border-blue-500 bg-blue-50 text-blue-700' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <UserIcon className="h-6 w-6" />
            <span className="font-medium">To External Account</span>
          </button>
        </div>
      </div>

      {/* Transfer Form */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* From Account */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              From Account
            </label>
            <select
              value={fromAccount}
              onChange={(e) => setFromAccount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select an account</option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name} ({account.accountNumber}) - ${account.balance.toFixed(2)}
                </option>
              ))}
            </select>
          </div>

          {/* To Account (Internal) */}
          {transferType === 'internal' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To Account
              </label>
              <select
                value={toAccount}
                onChange={(e) => setToAccount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select an account</option>
                {accounts
                  .filter(account => account.id.toString() !== fromAccount)
                  .map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.name} ({account.accountNumber}) - ${account.balance.toFixed(2)}
                    </option>
                  ))}
              </select>
            </div>
          )}

          {/* External Transfer Fields */}
          {transferType === 'external' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recipient Name
                </label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="John Doe"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recipient Account Number
                </label>
                <input
                  type="text"
                  value={recipientAccount}
                  onChange={(e) => setRecipientAccount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="1234567890"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Routing Number
                </label>
                <input
                  type="text"
                  value={routingNumber}
                  onChange={(e) => setRoutingNumber(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="021000021"
                  required
                />
              </div>
            </>
          )}

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500">$</span>
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (Optional)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="What's this transfer for?"
            />
          </div>

          {/* Transfer Summary */}
          {amount && fromAccount && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Transfer Summary</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-medium">${parseFloat(amount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">From:</span>
                  <span className="font-medium">
                    {accounts.find(a => a.id.toString() === fromAccount)?.name}
                  </span>
                </div>
                {transferType === 'internal' && toAccount && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">To:</span>
                    <span className="font-medium">
                      {accounts.find(a => a.id.toString() === toAccount)?.name}
                    </span>
                  </div>
                )}
                {transferType === 'external' && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">To:</span>
                    <span className="font-medium">{recipientName || 'External Account'}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isFormValid()}
            className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
              isFormValid()
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Initiate Transfer
          </button>
        </form>
      </div>
    </div>
  );
};

export default Transfer;