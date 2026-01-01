import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@/test/test-utils';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import Header from '../Header';

import type { User } from '@/types';

// Create mock functions that will be shared across tests
const mockLogout = vi.fn();
const mockLogin = vi.fn();
const mockClearError = vi.fn();

// Create a mock user object
const mockUser = {
  id: 1,
  username: 'testuser',
  name: 'John Doe',
  email: 'john.doe@example.com'
};

// Create the mock auth context return value
const createMockAuthContext = (user = mockUser) => ({
  user,
  isAuthenticated: true,
  isLoading: false,
  error: null,
  login: mockLogin,
  logout: mockLogout,
  clearError: mockClearError
});

// Mock the useAuth hook
const mockUseAuth = vi.fn();
vi.mock('../../contexts/AuthContext', () => ({
  useAuth: mockUseAuth,
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>
}));

describe('Header', () => {

  // Setup follows TESTING.md patterns
  beforeEach(() => {
    vi.clearAllMocks();
    // Set up the default mock return value
    mockUseAuth.mockReturnValue(createMockAuthContext());
    // Reset mock implementations
    mockLogout.mockResolvedValue(undefined);
  });

  const renderHeader = () => {
    return render(<Header />);
  };

  it('renders the app title', () => {
    renderHeader();
    expect(screen.getByText('SecureBank')).toBeInTheDocument();
  });

  it('displays user information correctly', () => {
    renderHeader();
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('J')).toBeInTheDocument(); // User avatar initial
  });

  it('renders notification and settings buttons', () => {
    renderHeader();

    const notificationButton = screen.getByRole('button', { name: /notifications/i });
    const settingsButton = screen.getByRole('button', { name: /settings/i });

    expect(notificationButton).toBeInTheDocument();
    expect(settingsButton).toBeInTheDocument();
  });

  it('displays user avatar with correct initial', () => {
    renderHeader();
    
    const avatarElement = screen.getByText('J');
    expect(avatarElement).toBeInTheDocument();
    expect(avatarElement.closest('div')).toHaveClass('bg-blue-600', 'rounded-full');
  });

  it('renders sign out button', () => {
    renderHeader();
    
    const signOutButton = screen.getByText('Sign out');
    expect(signOutButton).toBeInTheDocument();
  });

  it('calls logout function when sign out button is clicked', async () => {
    const user = userEvent.setup();
    renderHeader();
    
    const signOutButton = screen.getByText('Sign out');
    await user.click(signOutButton);

    expect(mockLogout).toHaveBeenCalledOnce();
  });

  it('handles logout error gracefully', async () => {
    const user = userEvent.setup();
    const logoutError = new Error('Logout failed');
    
    // Mock logout to throw an error
    mockLogout.mockRejectedValueOnce(logoutError);
    
    // Mock console.error for this specific test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    renderHeader();
    
    const signOutButton = screen.getByText('Sign out');
    await user.click(signOutButton);
    
    // Wait for the async operation to complete
    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalledOnce();
      expect(consoleSpy).toHaveBeenCalledWith('Logout failed:', logoutError);
    });
    
    consoleSpy.mockRestore();
  });

  it('renders notification button with proper styling', () => {
    renderHeader();

    const notificationButton = screen.getByRole('button', { name: /notifications/i });
    expect(notificationButton).toHaveClass('p-2', 'text-gray-400', 'hover:text-gray-600', 'transition-colors');
  });

  it('renders settings button with proper styling', () => {
    renderHeader();

    const settingsButton = screen.getByRole('button', { name: /settings/i });
    expect(settingsButton).toHaveClass('p-2', 'text-gray-400', 'hover:text-gray-600', 'transition-colors');
  });

  it('has proper header styling and structure', () => {
    renderHeader();
    
    const header = screen.getByRole('banner');
    expect(header).toHaveClass('bg-white', 'shadow-sm', 'border-b', 'border-gray-200');
    
    const container = header.firstChild as HTMLElement;
    expect(container).toHaveClass('flex', 'items-center', 'justify-between', 'px-6', 'py-4');
  });

  it('displays user name in sign out section', () => {
    renderHeader();
    
    const userNameElement = screen.getByText('John Doe');
    expect(userNameElement).toHaveClass('text-sm', 'font-medium', 'text-gray-900');
  });

  it('handles user with different name initial', () => {
    // Create a new mock context with different user
    const aliceUser = { name: 'Alice Smith', email: 'alice@example.com' };
    mockUseAuth.mockReturnValue(createMockAuthContext(aliceUser));
    
    renderHeader();
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('Alice Smith')).toBeInTheDocument();
  });

  it('handles empty user name gracefully', () => {
    const emptyNameUser = { ...mockUser, name: '' };
    mockUseAuth.mockReturnValue(createMockAuthContext(emptyNameUser));

    renderHeader();
    
    // Should still render without crashing
    expect(screen.getByText('SecureBank')).toBeInTheDocument();
  });

  it('supports keyboard navigation for interactive elements', async () => {
    const user = userEvent.setup();
    renderHeader();
    
    const signOutButton = screen.getByText('Sign out');
    
    // Tab to the sign out button
    await user.tab();
    await user.tab();
    await user.tab();
    
    // Activate with keyboard
    signOutButton.focus();
    await user.keyboard('{Enter}');
    
    expect(mockLogout).toHaveBeenCalledOnce();
  });
});