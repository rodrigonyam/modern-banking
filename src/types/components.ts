import { ReactNode } from 'react';
import { User, Account, Transaction } from './index';

// Context types
export interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  loading: boolean;
  error: string | null;
  clearError: () => void;
  refreshUser: () => Promise<void>;
}

export interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => string;
  removeNotification: (id: string) => void;
  showSuccess: (message: string, options?: Partial<NotificationOptions>) => string;
  showError: (message: string, options?: Partial<NotificationOptions>) => string;
  showWarning: (message: string, options?: Partial<NotificationOptions>) => string;
  showInfo: (message: string, options?: Partial<NotificationOptions>) => string;
}

// Component prop types
export interface ProviderProps {
  children: ReactNode;
}

export interface ProtectedRouteProps {
  children: ReactNode;
}

export interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
  className?: string;
}

export interface AccountCardProps {
  account: Account;
  onClick?: (account: Account) => void;
}

export interface ToastProps extends Notification {
  onClose: (id: string) => void;
}

// Notification types
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  title?: string;
  duration?: number;
}

export interface NotificationOptions {
  title: string;
  duration: number;
  persistent: boolean;
}

// Hook types
export interface UseErrorReturn {
  error: string | null;
  isError: boolean;
  showError: (message: string, duration?: number) => void;
  clearError: () => void;
  handleError: (error: any) => void;
}

export interface UseAsyncReturn<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  execute: (...args: any[]) => Promise<T>;
  reset: () => void;
}

// Form types
export interface LoginFormData {
  username: string;
  password: string;
}

export interface ValidationErrors {
  [key: string]: string;
}

export interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  value: string;
  onChange: (value: string) => void;
}

// Layout types
export interface SidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}

export interface HeaderProps {
  onMenuClick?: () => void;
}

// Dashboard types
export interface DashboardStats {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  savingsGoal?: number;
}

export interface QuickAction {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
  disabled?: boolean;
}