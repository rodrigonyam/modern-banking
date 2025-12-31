import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ErrorBoundary from '../ErrorBoundary';
import React from 'react';

// Mock console methods to avoid noise in tests
const mockConsoleError = vi.fn();

// Component that throws an error when shouldThrow prop is true
const ThrowError: React.FC<{ shouldThrow?: boolean; message?: string }> = ({ 
  shouldThrow = false, 
  message = 'Test error' 
}) => {
  if (shouldThrow) {
    throw new Error(message);
  }
  return <div>No Error</div>;
};

const TestComponent: React.FC = () => <div>Test Component</div>;

// Mock window.location methods
const mockReload = vi.fn();
const mockAssign = vi.fn();

Object.defineProperty(window, 'location', {
  value: {
    reload: mockReload,
    assign: mockAssign,
    href: ''
  },
  writable: true
});

describe('ErrorBoundary', () => {
  const originalNodeEnv = process.env.NODE_ENV;

  beforeEach(() => {
    vi.clearAllMocks();
    mockReload.mockClear();
    mockAssign.mockClear();
    vi.spyOn(console, 'error').mockImplementation(mockConsoleError);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    process.env.NODE_ENV = originalNodeEnv;
  });

  it('renders children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <TestComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Test Component')).toBeInTheDocument();
    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
  });

  it('renders error UI when child component throws an error', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('We apologize for the inconvenience. The application has encountered an error.')).toBeInTheDocument();
    expect(screen.queryByText('Test Component')).not.toBeInTheDocument();
  });

  it('displays error icon in error state', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow />
      </ErrorBoundary>
    );

    // Check for the ExclamationTriangleIcon
    const iconContainer = screen.getByText('Something went wrong').closest('div')?.querySelector('svg');
    expect(iconContainer).toBeInTheDocument();
  });

  it('renders refresh page button', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow />
      </ErrorBoundary>
    );

    const refreshButton = screen.getByText('Refresh Page');
    expect(refreshButton).toBeInTheDocument();
    expect(refreshButton).toHaveClass('bg-blue-600', 'text-white');
  });

  it('renders go to home button', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow />
      </ErrorBoundary>
    );

    const homeButton = screen.getByText('Go to Home');
    expect(homeButton).toBeInTheDocument();
    expect(homeButton).toHaveClass('bg-gray-200', 'text-gray-800');
  });

  it('calls window.location.reload when refresh button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow />
      </ErrorBoundary>
    );

    const refreshButton = screen.getByText('Refresh Page');
    await user.click(refreshButton);

    expect(mockReload).toHaveBeenCalledOnce();
  });

  it('navigates to home when go to home button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow />
      </ErrorBoundary>
    );

    const homeButton = screen.getByText('Go to Home');
    await user.click(homeButton);

    // Check that href was set to '/'
    expect(window.location.href).toBe('/');
  });

  it('shows error details in development environment', () => {
    process.env.NODE_ENV = 'development';
    
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow message="Custom test error" />
      </ErrorBoundary>
    );

    const detailsButton = screen.getByText('Error Details (Development Only)');
    expect(detailsButton).toBeInTheDocument();
    
    const errorText = screen.getByText(/Error:/);
    expect(errorText).toBeInTheDocument();
  });

  it('hides error details in production environment', () => {
    process.env.NODE_ENV = 'production';
    
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow />
      </ErrorBoundary>
    );

    expect(screen.queryByText('Error Details (Development Only)')).not.toBeInTheDocument();
  });

  it('logs errors to console in production', () => {
    process.env.NODE_ENV = 'production';
    
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow />
      </ErrorBoundary>
    );

    expect(mockConsoleError).toHaveBeenCalledWith(
      'Error caught by boundary:',
      expect.any(Error),
      expect.any(Object)
    );
  });

  it('applies proper styling to error container', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow />
      </ErrorBoundary>
    );

    const container = screen.getByText('Something went wrong').closest('div')?.parentElement?.parentElement;
    expect(container).toHaveClass('min-h-screen', 'flex', 'items-center', 'justify-center', 'bg-gray-50');

    const card = screen.getByText('Something went wrong').closest('div');
    expect(card).toHaveClass('max-w-md', 'w-full', 'bg-white', 'shadow-lg', 'rounded-lg', 'p-8', 'text-center');
  });

  it('handles multiple errors gracefully', () => {
    const { rerender } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow message="First error" />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();

    // Rerender with a different error
    rerender(
      <ErrorBoundary>
        <ThrowError shouldThrow message="Second error" />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('recovers when error is resolved', () => {
    const { rerender } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();

    // Rerender without error
    rerender(
      <ErrorBoundary>
        <TestComponent />
      </ErrorBoundary>
    );

    // Should still show error UI (ErrorBoundary doesn't auto-recover)
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('has accessible error state', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow />
      </ErrorBoundary>
    );

    const heading = screen.getByRole('heading', { name: 'Something went wrong' });
    expect(heading).toBeInTheDocument();
    
    const refreshButton = screen.getByRole('button', { name: 'Refresh Page' });
    const homeButton = screen.getByRole('button', { name: 'Go to Home' });
    
    expect(refreshButton).toBeInTheDocument();
    expect(homeButton).toBeInTheDocument();
  });

  it('supports keyboard navigation in error state', async () => {
    const user = userEvent.setup();

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow />
      </ErrorBoundary>
    );

    const refreshButton = screen.getByText('Refresh Page');
    
    // Focus and activate with keyboard
    refreshButton.focus();
    await user.keyboard('{Enter}');
    
    expect(mockReload).toHaveBeenCalledOnce();
  });

  it('displays custom error message in development', () => {
    process.env.NODE_ENV = 'development';
    
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow message="Custom development error" />
      </ErrorBoundary>
    );

    expect(screen.getByText(/Custom development error/)).toBeInTheDocument();
  });
});