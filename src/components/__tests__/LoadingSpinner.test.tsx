import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/test-utils';
import LoadingSpinner from '../LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders with default props', () => {
    render(<LoadingSpinner />);
    
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    
    // Check for spinner element with default size
    const container = screen.getByRole('status');
    expect(container).toHaveClass('flex', 'flex-col', 'items-center', 'justify-center', 'space-y-3');
    
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('h-8', 'w-8', 'border-2', 'border-gray-300', 'border-t-blue-600');
  });

  it('renders with custom text', () => {
    render(<LoadingSpinner text="Please wait..." />);
    
    expect(screen.getByText('Please wait...')).toBeInTheDocument();
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });

  it('renders without text when text is empty', () => {
    render(<LoadingSpinner text="" />);
    
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    
    // Should still render spinner with role
    const container = screen.getByRole('status');
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('applies small size classes correctly', () => {
    render(<LoadingSpinner size="small" text="Small loader" />);
    
    const container = screen.getByRole('status');
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toHaveClass('h-4', 'w-4');
    
    const textElement = screen.getByText('Small loader');
    expect(textElement).toHaveClass('text-sm');
  });

  it('applies medium size classes correctly', () => {
    render(<LoadingSpinner size="medium" text="Medium loader" />);
    
    const container = screen.getByRole('status');
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toHaveClass('h-8', 'w-8');
    
    const textElement = screen.getByText('Medium loader');
    expect(textElement).toHaveClass('text-base');
  });

  it('applies large size classes correctly', () => {
    render(<LoadingSpinner size="large" text="Large loader" />);
    
    const container = screen.getByRole('status');
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toHaveClass('h-12', 'w-12');
    
    const textElement = screen.getByText('Large loader');
    expect(textElement).toHaveClass('text-lg');
  });

  it('applies custom className', () => {
    render(<LoadingSpinner className="custom-class" text="Custom styled" />);
    
    const container = screen.getByRole('status');
    expect(container).toHaveClass('custom-class');
    expect(container).toHaveClass('flex', 'flex-col', 'items-center', 'justify-center', 'space-y-3');
  });

  it('has proper accessibility attributes', () => {
    render(<LoadingSpinner />);
    
    const container = screen.getByRole('status');
    expect(container).toHaveAttribute('aria-live', 'polite');
    expect(container).toHaveAttribute('aria-label', 'Loading...');
  });

  it('has custom aria-label when text is provided', () => {
    render(<LoadingSpinner text="Processing data..." />);
    
    const container = screen.getByRole('status');
    expect(container).toHaveAttribute('aria-label', 'Processing data...');
  });

  it('has consistent styling across all sizes', () => {
    const sizes: Array<'small' | 'medium' | 'large'> = ['small', 'medium', 'large'];
    
    sizes.forEach((size) => {
      const { unmount } = render(<LoadingSpinner size={size} text={`${size} test`} />);
      
      const container = screen.getByRole('status');
      const spinner = container.querySelector('.animate-spin');
      
      expect(spinner).toHaveClass(
        'animate-spin',
        'rounded-full',
        'border-2',
        'border-gray-300',
        'border-t-blue-600'
      );
      
      unmount();
    });
  });

  it('renders spinner with animation', () => {
    render(<LoadingSpinner />);
    
    const container = screen.getByRole('status');
    const spinner = container.querySelector('.animate-spin');
    
    expect(spinner).toHaveClass('animate-spin');
  });

  it('maintains proper spacing between spinner and text', () => {
    render(<LoadingSpinner text="Test spacing" />);
    
    const container = screen.getByRole('status');
    expect(container).toHaveClass('space-y-3');
  });

  it('combines custom className with default classes', () => {
    render(<LoadingSpinner className="my-custom-class another-class" />);
    
    const container = screen.getByRole('status');
    expect(container).toHaveClass('my-custom-class', 'another-class');
    expect(container).toHaveClass('flex', 'flex-col', 'items-center', 'justify-center', 'space-y-3');
  });
});