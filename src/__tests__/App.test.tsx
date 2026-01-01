import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '../test/test-utils';
import App from '../App';

// Mock the child components to avoid complex rendering
vi.mock('../pages/Login', () => ({
  default: () => <div data-testid="login-page">Login Page</div>,
}));

vi.mock('../pages/Dashboard', () => ({
  default: () => <div data-testid="dashboard-page">Dashboard Page</div>,
}));

vi.mock('../../contexts/AuthContext', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
  useAuth: () => ({
    user: null,
    loading: false,
    error: null,
  }),
}));

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
    
    // Should render either login or dashboard based on auth state
    // Since we mocked user as null, it should show login
    expect(screen.getByTestId('login-page')).toBeInTheDocument();
  });

  it('wraps content with providers', () => {
    render(<App />);
    
    // The app should render and not throw errors about missing context
    expect(screen.getByTestId('login-page')).toBeInTheDocument();
  });
});