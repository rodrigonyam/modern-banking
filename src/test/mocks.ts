import { vi } from 'vitest';
import type { User } from '@/types';

// Auth Context Mocks
export const mockAuthContext = {
  user: null as User | null,
  login: vi.fn(),
  logout: vi.fn(),
  loading: false,
  error: null,
  clearError: vi.fn(),
  refreshUser: vi.fn(),
};

export const mockAuthContextLoggedIn = {
  ...mockAuthContext,
  user: {
    id: 1,
    username: 'test@example.com',
    name: 'Test User',
  },
};

// Notification Context Mocks
export const mockNotificationContext = {
  notifications: [],
  addNotification: vi.fn(),
  removeNotification: vi.fn(),
  clearNotifications: vi.fn(),
  showSuccess: vi.fn(),
  showError: vi.fn(),
  showWarning: vi.fn(),
  showInfo: vi.fn(),
};

// Router Mocks
export const mockNavigate = vi.fn();

// Mock useAuth hook
export const mockUseAuth = (loggedIn = true) => {
  return loggedIn ? mockAuthContextLoggedIn : mockAuthContext;
};

// Mock useNotification hook
export const mockUseNotification = () => mockNotificationContext;

// React Router mocks
export const mockLocation = {
  pathname: '/dashboard',
  search: '',
  hash: '',
  state: null,
  key: 'default',
};

// Local Storage mocks
export const createLocalStorageMock = () => {
  const store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      Object.keys(store).forEach(key => delete store[key]);
    }),
    length: Object.keys(store).length,
    key: vi.fn((index: number) => Object.keys(store)[index] || null),
  };
};

// API Response mocks
export const mockSuccessResponse = (data: any) => ({
  data,
  message: 'Success',
  status: 200,
  success: true,
});

export const mockErrorResponse = (message = 'Error', status = 400) => ({
  message,
  status,
  success: false,
  errors: {},
});

// Account mocks
export const mockAccounts = [
  {
    id: 1,
    name: 'Checking Account',
    accountNumber: '****1234',
    balance: 5247.32,
    type: 'checking' as const,
    currency: 'USD',
  },
  {
    id: 2,
    name: 'Savings Account',
    accountNumber: '****5678',
    balance: 12543.87,
    type: 'savings' as const,
    currency: 'USD',
  },
];

// Transaction mocks
export const mockTransactions = [
  {
    id: 'txn-1',
    accountId: 1,
    amount: -85.43,
    type: 'debit' as const,
    status: 'completed' as const,
    description: 'Grocery Store',
    category: 'Food',
    date: '2024-01-15',
  },
  {
    id: 'txn-2',
    accountId: 1,
    amount: 3500.00,
    type: 'credit' as const,
    status: 'completed' as const,
    description: 'Salary Deposit',
    category: 'Income',
    date: '2024-01-14',
  },
];

// Reset all mocks helper
export const resetAllMocks = () => {
  Object.values(mockAuthContext).forEach(mock => {
    if (typeof mock === 'function') mock.mockClear();
  });
  Object.values(mockNotificationContext).forEach(mock => {
    if (typeof mock === 'function') mock.mockClear();
  });
  mockNavigate.mockClear();
};