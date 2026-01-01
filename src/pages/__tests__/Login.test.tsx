import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor, render as rtlRender } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Login from '../Login';

// Create mock functions
const mockLogin = vi.fn();
const mockShowError = vi.fn();
const mockShowSuccess = vi.fn();
const mockNavigate = vi.fn();
const mockClearError = vi.fn();

// Mock the auth context
vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    login: mockLogin,
    loading: false,
    error: null,
    clearError: mockClearError,
    user: null,
    logout: vi.fn(),
    isAuthenticated: false,
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>
}));

// Mock the notification context
vi.mock('../../contexts/NotificationContext', () => ({
  useNotification: () => ({
    showSuccess: mockShowSuccess,
    showError: mockShowError,
    showWarning: vi.fn(),
    showInfo: vi.fn(),
    addNotification: vi.fn(),
    removeNotification: vi.fn(),
    clearAllNotifications: vi.fn(),
    notifications: []
  }),
  NotificationProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>
}));

// Mock react-router-dom navigate
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Login', () => {
  const user = userEvent.setup();

  // Helper function to render Login with providers
  const render = (ui: React.ReactElement) => {
    return rtlRender(
      <BrowserRouter>
        {ui}
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigate.mockClear();
    mockLogin.mockClear();
    mockShowError.mockClear();
    mockShowSuccess.mockClear();
    mockClearError.mockClear();
  });

  it('renders login form correctly', () => {
    render(<Login />);
    
    expect(screen.getByText('Welcome to SecureBank')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('demo@bank.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('displays demo credentials', () => {
    render(<Login />);
    
    expect(screen.getByText('Demo credentials - Click to auto-fill:')).toBeInTheDocument();
    expect(screen.getByText('Demo User: demo@bank.com / demo123')).toBeInTheDocument();
  });

  it('handles form submission with valid data', async () => {
    mockLogin.mockResolvedValue({ success: true });
    
    render(<Login />);
    
    const emailInput = screen.getByPlaceholderText('demo@bank.com');
    const passwordInput = screen.getByPlaceholderText('Enter your password');
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(mockShowSuccess).toHaveBeenCalledWith('Successfully signed in! Welcome back.');
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('displays validation errors for empty fields', async () => {
    render(<Login />);
    
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeInTheDocument();
      expect(screen.getByText('Password is required')).toBeInTheDocument();
    });
  });

  it('displays validation error for invalid email', async () => {
    render(<Login />);
    
    const emailInput = screen.getByPlaceholderText('demo@bank.com');
    const passwordInput = screen.getByPlaceholderText('Enter your password');
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    
    await user.type(emailInput, 'invalid-email');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
    });
  });

  it('displays validation error for short password', async () => {
    render(<Login />);
    
    const emailInput = screen.getByPlaceholderText('demo@bank.com');
    const passwordInput = screen.getByPlaceholderText('Enter your password');
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, '123');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Password must be at least 6 characters long')).toBeInTheDocument();
    });
  });

  it('handles login failure', async () => {
    const error = new Error('Invalid credentials');
    mockLogin.mockRejectedValue(error);
    
    render(<Login />);
    
    const emailInput = screen.getByPlaceholderText('demo@bank.com');
    const passwordInput = screen.getByPlaceholderText('Enter your password');
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'wrongpassword');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'wrongpassword');
      expect(mockShowError).toHaveBeenCalledWith('An unexpected error occurred. Please try again.');
    });
  });

  it('handles login failure with error response', async () => {
    mockLogin.mockResolvedValue({ success: false, error: 'Invalid credentials' });
    
    render(<Login />);
    
    const emailInput = screen.getByPlaceholderText('demo@bank.com');
    const passwordInput = screen.getByPlaceholderText('Enter your password');
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'wrongpassword');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'wrongpassword');
      expect(mockShowError).toHaveBeenCalledWith('Invalid credentials');
    });
  });

  it('fills demo credentials when demo button is clicked', async () => {
    render(<Login />);
    
    const demoButton = screen.getByText('Demo User: demo@bank.com / demo123');
    await user.click(demoButton);
    
    const emailInput = screen.getByPlaceholderText('demo@bank.com');
    const passwordInput = screen.getByPlaceholderText('Enter your password');
    
    expect(emailInput).toHaveValue('demo@bank.com');
    expect(passwordInput).toHaveValue('demo123');
  });
});