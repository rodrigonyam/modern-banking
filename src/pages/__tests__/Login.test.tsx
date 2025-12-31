import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../../test/test-utils';
import Login from '../Login';
import { mockAuthContext, mockNotificationContext } from '../../test/mocks';

// Mock the contexts
vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => mockAuthContext,
}));

vi.mock('../../contexts/NotificationContext', () => ({
  useNotification: () => mockNotificationContext,
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

describe('Login', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
    mockAuthContext.login.mockClear();
    mockNotificationContext.showError.mockClear();
  });

  it('renders login form correctly', () => {
    render(<Login />);
    
    expect(screen.getByText('Welcome to SecureBank')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('displays demo credentials', () => {
    render(<Login />);
    
    expect(screen.getByText('Demo Credentials:')).toBeInTheDocument();
    expect(screen.getByText('demo@bank.com / demo123')).toBeInTheDocument();
  });

  it('handles form submission with valid data', async () => {
    mockAuthContext.login.mockResolvedValue({ success: true });
    
    render(<Login />);
    
    await user.type(screen.getByLabelText('Email'), 'demo@bank.com');
    await user.type(screen.getByLabelText('Password'), 'demo123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));
    
    expect(mockAuthContext.login).toHaveBeenCalledWith('demo@bank.com', 'demo123');
  });

  it('displays validation errors for empty fields', async () => {
    render(<Login />);
    
    await user.click(screen.getByRole('button', { name: /sign in/i }));
    
    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeInTheDocument();
      expect(screen.getByText('Password is required')).toBeInTheDocument();
    });
  });

  it('displays validation error for invalid email', async () => {
    render(<Login />);
    
    await user.type(screen.getByLabelText('Email'), 'invalid-email');
    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));
    
    await waitFor(() => {
      expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
    });
  });

  it('displays validation error for short password', async () => {
    render(<Login />);
    
    await user.type(screen.getByLabelText('Email'), 'test@example.com');
    await user.type(screen.getByLabelText('Password'), '123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));
    
    await waitFor(() => {
      expect(screen.getByText('Password must be at least 6 characters long')).toBeInTheDocument();
    });
  });

  it('handles login failure', async () => {
    mockAuthContext.login.mockResolvedValue({ 
      success: false, 
      error: 'Invalid credentials' 
    });
    
    render(<Login />);
    
    await user.type(screen.getByLabelText('Email'), 'wrong@example.com');
    await user.type(screen.getByLabelText('Password'), 'wrongpass');
    await user.click(screen.getByRole('button', { name: /sign in/i }));
    
    await waitFor(() => {
      expect(mockNotificationContext.showError).toHaveBeenCalledWith('Invalid credentials');
    });
  });

  it('fills demo credentials when demo button is clicked', async () => {
    render(<Login />);
    
    await user.click(screen.getByRole('button', { name: /use demo account/i }));
    
    expect(screen.getByDisplayValue('demo@bank.com')).toBeInTheDocument();
    expect(screen.getByDisplayValue('demo123')).toBeInTheDocument();
  });

  it('shows loading state during login', async () => {
    mockAuthContext.loading = true;
    
    render(<Login />);
    
    expect(screen.getByText('Signing in...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /signing in/i })).toBeDisabled();
  });
});