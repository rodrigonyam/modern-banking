import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import type { User } from '@/types';

// Mock contexts
vi.mock('../contexts/NotificationContext', () => ({
  useNotification: () => ({
    addNotification: vi.fn(),
    removeNotification: vi.fn(),
    clearAllNotifications: vi.fn(),
    notifications: []
  }),
  NotificationProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>
}));

vi.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    login: vi.fn(),
    logout: vi.fn(),
    clearError: vi.fn()
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>
}));

import { AuthProvider } from '../contexts/AuthContext';
import { NotificationProvider } from '../contexts/NotificationContext';

// Mock user data for testing
export const mockUser: User = {
  id: 1,
  username: 'test@example.com',
  name: 'Test User',
};

// All the providers wrapper
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <BrowserRouter>
      <NotificationProvider>
        <AuthProvider>
          {children}
        </AuthProvider>
      </NotificationProvider>
    </BrowserRouter>
  );
};

// Custom render function that includes providers
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => {
  return render(ui, { wrapper: AllTheProviders, ...options });
};

// Re-export everything from testing library
export * from '@testing-library/react';
export { customRender as render };

// Custom render with auth context (logged in user)
export const renderWithAuth = (
  ui: ReactElement,
  { user = mockUser, ...options }: { user?: User } & Omit<RenderOptions, 'wrapper'> = {}
) => {
  const AuthWrapper = ({ children }: { children: React.ReactNode }) => (
    <BrowserRouter>
      <NotificationProvider>
        <AuthProvider>
          {children}
        </AuthProvider>
      </NotificationProvider>
    </BrowserRouter>
  );

  // Mock localStorage to simulate logged in user
  vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(JSON.stringify(user));

  return render(ui, { wrapper: AuthWrapper, ...options });
};

// Helper function to create mock accounts
export const createMockAccount = (overrides = {}) => ({
  id: 1,
  name: 'Test Account',
  accountNumber: '****1234',
  balance: 1000.00,
  type: 'checking' as const,
  currency: 'USD',
  ...overrides,
});

// Helper function to create mock transactions
export const createMockTransaction = (overrides = {}) => ({
  id: 'txn-1',
  accountId: 1,
  amount: -50.00,
  type: 'debit' as const,
  status: 'completed' as const,
  description: 'Test Transaction',
  category: 'Food',
  date: '2024-01-15',
  ...overrides,
});

// Helper to wait for async operations
export const waitForLoadingToFinish = () =>
  new Promise(resolve => setTimeout(resolve, 0));

// Mock API responses
export function mockApiResponse<T>(data: T, delay = 100): Promise<T> {
  return new Promise<T>((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
}

// Mock API error
export function mockApiError(message = 'API Error', delay = 100): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error(message)), delay);
  });
}