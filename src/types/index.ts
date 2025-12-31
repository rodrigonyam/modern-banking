// User types
export interface User {
  id: number;
  username: string;
  name: string;
  email?: string;
  avatar?: string;
  createdAt?: string;
  lastLogin?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  error?: string;
  user?: User;
  token?: string;
}

// Account types
export type AccountType = 'checking' | 'savings' | 'credit' | 'investment';

export interface Account {
  id: number;
  name: string;
  accountNumber: string;
  balance: number;
  type: AccountType;
  currency: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Transaction types
export type TransactionType = 'credit' | 'debit' | 'transfer' | 'payment' | 'deposit' | 'withdrawal';
export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'cancelled';

export interface Transaction {
  id: string;
  accountId: number;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  description: string;
  category?: string;
  date: string;
  merchant?: string;
  location?: string;
  reference?: string;
  balance?: number;
}

// Transfer types
export interface TransferRequest {
  fromAccountId: number;
  toAccountId: number;
  amount: number;
  description: string;
  reference?: string;
}

export interface TransferResponse {
  success: boolean;
  transactionId?: string;
  error?: string;
}

// Chart data types
export interface ChartDataPoint {
  date: string;
  income: number;
  expenses: number;
  balance?: number;
}

// API Response types
export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  status: number;
  success: boolean;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Error types
export interface AppError extends Error {
  type: string;
  code?: string | number;
  details?: any;
  timestamp?: string;
}

// Component prop types
export interface AccountCardProps {
  account: Account;
  onClick?: (account: Account) => void;
}

export interface TransactionItemProps {
  transaction: Transaction;
  onClick?: (transaction: Transaction) => void;
}

export interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
  className?: string;
}

// Form types
export interface LoginFormData {
  username: string;
  password: string;
}

export interface ValidationErrors {
  [key: string]: string;
}

// Demo/Mock types
export interface DemoUser {
  id: number;
  username: string;
  password: string;
  name: string;
}

// Context types
export interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  loading: boolean;
  error: string | null;
  clearError: () => void;
  refreshUser: () => Promise<void>;
}

// Notification types
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
}

export interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => string;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  showSuccess: (message: string, options?: Partial<Omit<Notification, 'id' | 'type' | 'message'>>) => string;
  showError: (message: string, options?: Partial<Omit<Notification, 'id' | 'type' | 'message'>>) => string;
  showWarning: (message: string, options?: Partial<Omit<Notification, 'id' | 'type' | 'message'>>) => string;
  showInfo: (message: string, options?: Partial<Omit<Notification, 'id' | 'type' | 'message'>>) => string;
}

// Hook types
export interface UseAsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: (...args: any[]) => Promise<T>;
  reset: () => void;
}

export interface UseErrorState {
  error: string | null;
  setError: (error: string | null) => void;
  clearError: () => void;
  hasError: boolean;
}