import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AccountCard from '../AccountCard';
import type { Account } from '@/types';

const mockAccount: Account = {
  id: 1,
  name: 'Main Checking',
  accountNumber: '****1234',
  balance: 2500.75,
  type: 'checking',
  currency: 'USD',
  isActive: true,
};

const mockSavingsAccount: Account = {
  id: 2,
  name: 'High Yield Savings',
  accountNumber: '****5678',
  balance: 10000.00,
  type: 'savings',
  currency: 'USD',
  isActive: true,
};

const mockCreditAccount: Account = {
  id: 3,
  name: 'Credit Card',
  accountNumber: '****9999',
  balance: -1250.50,
  type: 'credit',
  currency: 'USD',
  isActive: true,
};

describe('AccountCard', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders account information correctly', () => {
    render(<AccountCard account={mockAccount} />);

    expect(screen.getByText('Main Checking')).toBeInTheDocument();
    expect(screen.getByText('****1234')).toBeInTheDocument();
    expect(screen.getByText('$2,500.75')).toBeInTheDocument();
    expect(screen.getByText('Available balance')).toBeInTheDocument();
    expect(screen.getByText('View Details →')).toBeInTheDocument();
  });

  it('displays different account types correctly', () => {
    const { rerender } = render(<AccountCard account={mockAccount} />);
    expect(screen.getByText('Main Checking')).toBeInTheDocument();

    rerender(<AccountCard account={mockSavingsAccount} />);
    expect(screen.getByText('High Yield Savings')).toBeInTheDocument();
    expect(screen.getByText('$10,000.00')).toBeInTheDocument();

    rerender(<AccountCard account={mockCreditAccount} />);
    expect(screen.getByText('Credit Card')).toBeInTheDocument();
    expect(screen.getByText('-$1,250.50')).toBeInTheDocument();
  });

  it('formats balance with proper currency formatting', () => {
    const largeBalanceAccount: Account = {
      ...mockAccount,
      balance: 123456.78,
    };

    render(<AccountCard account={largeBalanceAccount} />);
    expect(screen.getByText('$123,456.78')).toBeInTheDocument();
  });

  it('applies clickable styling when onClick prop is provided', () => {
    const handleClick = vi.fn();
    render(<AccountCard account={mockAccount} onClick={handleClick} />);

    const card = screen.getByRole('button');
    expect(card).toHaveClass('cursor-pointer');
    expect(card).toHaveAttribute('tabIndex', '0');
  });

  it('does not apply clickable styling when onClick prop is not provided', () => {
    render(<AccountCard account={mockAccount} />);

    const cardElement = screen.getByText('Main Checking').closest('div');
    expect(cardElement).not.toHaveAttribute('role', 'button');
  });

  it('calls onClick handler when card is clicked', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<AccountCard account={mockAccount} onClick={handleClick} />);

    const card = screen.getByRole('button');
    await user.click(card);

    expect(handleClick).toHaveBeenCalledOnce();
    expect(handleClick).toHaveBeenCalledWith(mockAccount);
  });

  it('prevents card click when View Details button is clicked', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<AccountCard account={mockAccount} onClick={handleClick} />);

    const viewDetailsButton = screen.getByText('View Details →');
    await user.click(viewDetailsButton);

    expect(handleClick).not.toHaveBeenCalled();
  });

  it('supports keyboard navigation when clickable', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<AccountCard account={mockAccount} onClick={handleClick} />);

    const card = screen.getByRole('button');
    card.focus();
    await user.keyboard('{Enter}');

    expect(handleClick).toHaveBeenCalledOnce();
    expect(handleClick).toHaveBeenCalledWith(mockAccount);
  });

  it('applies hover effects correctly', () => {
    render(<AccountCard account={mockAccount} />);

    const card = screen.getByText('Main Checking').closest('div');
    expect(card).toHaveClass('hover:shadow-lg', 'transition-shadow');
  });

  it('has proper accessibility attributes when clickable', () => {
    const handleClick = vi.fn();
    render(<AccountCard account={mockAccount} onClick={handleClick} />);

    const card = screen.getByRole('button');
    expect(card).toBeInTheDocument();
    expect(card).toHaveAttribute('tabIndex', '0');
  });
});
    render(<AccountCard account={mockAccount} />);
    
    const card = screen.getByText('Test Account').closest('div');
    expect(card).not.toHaveClass('cursor-pointer');
  });

  it('shows cursor pointer when onClick is provided', () => {
    render(<AccountCard account={mockAccount} onClick={mockOnClick} />);
    
    const card = screen.getByRole('button');
    expect(card).toHaveClass('cursor-pointer');
  });

  describe('Different Account Types', () => {
    it('renders savings account correctly', () => {
      const savingsAccount = createMockAccount({ type: 'savings', name: 'Savings Account' });
      render(<AccountCard account={savingsAccount} />);
      
      expect(screen.getByText('Savings Account')).toBeInTheDocument();
    });

    it('renders credit account correctly', () => {
      const creditAccount = createMockAccount({ 
        type: 'credit', 
        name: 'Credit Card',
        balance: -1234.56 
      });
      render(<AccountCard account={creditAccount} />);
      
      expect(screen.getByText('Credit Card')).toBeInTheDocument();
      expect(screen.getByText('-$1,234.56')).toBeInTheDocument();
    });
  });
});