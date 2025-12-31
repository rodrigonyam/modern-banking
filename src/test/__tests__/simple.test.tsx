import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

// Simple component for testing
const SimpleButton = ({ onClick, children }: { onClick?: () => void; children: React.ReactNode }) => (
  <button onClick={onClick} data-testid="simple-button">
    {children}
  </button>
);

describe('Simple Component Test', () => {
  it('renders a simple button', () => {
    render(<SimpleButton>Click me</SimpleButton>);
    expect(screen.getByTestId('simple-button')).toBeInTheDocument();
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('handles click events', async () => {
    const handleClick = vi.fn();
    render(<SimpleButton onClick={handleClick}>Click me</SimpleButton>);
    
    await userEvent.click(screen.getByTestId('simple-button'));
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('demonstrates basic testing capabilities', () => {
    // Test that our testing environment works
    expect(1 + 1).toBe(2);
    expect('hello').toContain('ell');
    expect([1, 2, 3]).toHaveLength(3);
  });
});