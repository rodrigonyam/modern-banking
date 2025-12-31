import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@/test/test-utils';
import userEvent from '@testing-library/user-event';
import AccountCard from '../AccountCard';
import type { Account } from '@/types';

// Mock account factory following TESTING.md patterns
const createMockAccount = (overrides: Partial<Account> = {}): Account => ({
  id: 1,
  name: 'Main Checking',
  accountNumber: '****1234',
  balance: 2500.75,
  type: 'checking',
  currency: 'USD',
  isActive: true,
  ...overrides,
});

describe('AccountCard', () => {
  // Setup follows TESTING.md patterns
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders account information correctly', () => {
      const mockAccount = createMockAccount();
      render(<AccountCard account={mockAccount} />);

      // Test user-visible content following accessibility patterns
      expect(screen.getByText('Main Checking')).toBeInTheDocument();
      expect(screen.getByText('****1234')).toBeInTheDocument();
      expect(screen.getByText('$2,500.75')).toBeInTheDocument();
      expect(screen.getByText('Available balance')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /view detailed information/i })).toBeInTheDocument();
    });

    it('displays different account types correctly', () => {
      const checkingAccount = createMockAccount({ type: 'checking' });
      const { rerender } = render(<AccountCard account={checkingAccount} />);
      expect(screen.getByText('Main Checking')).toBeInTheDocument();

      const savingsAccount = createMockAccount({ 
        id: 2,
        name: 'High Yield Savings',
        accountNumber: '****5678',
        balance: 10000.00,
        type: 'savings'
      });
      rerender(<AccountCard account={savingsAccount} />);
      expect(screen.getByText('High Yield Savings')).toBeInTheDocument();
      expect(screen.getByText('$10,000.00')).toBeInTheDocument();

      const creditAccount = createMockAccount({
        id: 3,
        name: 'Credit Card',
        accountNumber: '****9999',
        balance: -1250.50,
        type: 'credit'
      });
      rerender(<AccountCard account={creditAccount} />);
      expect(screen.getByText('Credit Card')).toBeInTheDocument();
      expect(screen.getByText('-$1,250.50')).toBeInTheDocument();
    });

    it('formats balance with proper currency formatting', () => {
      const largeBalanceAccount = createMockAccount({ balance: 123456.78 });
      render(<AccountCard account={largeBalanceAccount} />);
      expect(screen.getByText('$123,456.78')).toBeInTheDocument();
    });

    it('displays correct styling for different account types', () => {
      const checkingAccount = createMockAccount({ type: 'checking' });
      const { rerender, container } = render(<AccountCard account={checkingAccount} />);
      
      let card = container.querySelector('div.bg-white');
      expect(card).toHaveClass('border-blue-200');

      const savingsAccount = createMockAccount({ type: 'savings' });
      rerender(<AccountCard account={savingsAccount} />);
      card = container.querySelector('div.bg-white');
      expect(card).toHaveClass('border-green-200');

      const creditAccount = createMockAccount({ type: 'credit' });
      rerender(<AccountCard account={creditAccount} />);
      card = container.querySelector('div.bg-white');
      expect(card).toHaveClass('border-red-200');
    });
  });

  describe('User Interactions', () => {
    it('calls onClick handler when card is clicked', async () => {
      const handleClick = vi.fn();
      const mockAccount = createMockAccount();
      const user = userEvent.setup();

      render(<AccountCard account={mockAccount} onClick={handleClick} />);

      // Use accessible queries following TESTING.md patterns
      const card = screen.getByRole('button', { name: /view details for main checking account/i });
      await user.click(card);

      expect(handleClick).toHaveBeenCalledOnce();
      expect(handleClick).toHaveBeenCalledWith(mockAccount);
    });

    it('supports keyboard navigation when clickable', async () => {
      const handleClick = vi.fn();
      const mockAccount = createMockAccount();
      const user = userEvent.setup();

      render(<AccountCard account={mockAccount} onClick={handleClick} />);

      const card = screen.getByRole('button', { name: /view details for main checking account/i });
      card.focus();
      await user.keyboard('{Enter}');

      expect(handleClick).toHaveBeenCalledOnce();
      expect(handleClick).toHaveBeenCalledWith(mockAccount);
    });

    it('prevents card click when View Details button is clicked', async () => {
      const handleClick = vi.fn();
      const mockAccount = createMockAccount();
      const user = userEvent.setup();

      render(<AccountCard account={mockAccount} onClick={handleClick} />);

      const viewDetailsButton = screen.getByText('View Details →');
      await user.click(viewDetailsButton);

      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Styling and Layout', () => {
    it('applies clickable styling when onClick prop is provided', () => {
      const handleClick = vi.fn();
      const mockAccount = createMockAccount();
      render(<AccountCard account={mockAccount} onClick={handleClick} />);

      const card = screen.getByRole('button', { name: /view details for main checking account/i });
      expect(card).toHaveClass('cursor-pointer');
      expect(card).toHaveAttribute('tabIndex', '0');
    });

    it('does not apply clickable styling when onClick prop is not provided', () => {
      const mockAccount = createMockAccount();
      render(<AccountCard account={mockAccount} />);

      const cardElement = screen.getByText('Main Checking').closest('div');
      expect(cardElement).not.toHaveAttribute('role', 'button');
    });

    it('applies hover effects correctly', () => {
      const mockAccount = createMockAccount();
      render(<AccountCard account={mockAccount} />);

      const cardContainer = screen.getByText('Main Checking').closest('div.bg-white');
      expect(cardContainer).toHaveClass('hover:shadow-lg');
      expect(cardContainer).toHaveClass('transition-shadow');
    });
  });

  describe('Balance Display', () => {
    it('displays positive balance correctly', () => {
      const mockAccount = createMockAccount({ balance: 2500.75 });
      render(<AccountCard account={mockAccount} />);
      
      const balance = screen.getByLabelText(/account balance/i);
      expect(balance).toBeInTheDocument();
      expect(balance).toHaveTextContent('$2,500.75');
    });

    it('displays negative balance correctly', () => {
      const mockAccount = createMockAccount({ balance: -1250.50 });
      render(<AccountCard account={mockAccount} />);
      
      const balance = screen.getByLabelText(/account balance/i);
      expect(balance).toHaveTextContent('-$1,250.50');
    });

    it('displays zero balance correctly', () => {
      const mockAccount = createMockAccount({ balance: 0 });
      render(<AccountCard account={mockAccount} />);
      
      const balance = screen.getByLabelText(/account balance/i);
      expect(balance).toHaveTextContent('$0.00');
    });
  });

  describe('Accessibility', () => {
    it('has proper accessibility attributes when clickable', () => {
      const handleClick = vi.fn();
      const mockAccount = createMockAccount();
      render(<AccountCard account={mockAccount} onClick={handleClick} />);

      const card = screen.getByRole('button', { name: /view details for main checking account/i });
      expect(card).toBeInTheDocument();
      expect(card).toHaveAttribute('tabIndex', '0');
    });

    it('has proper ARIA labels for screen readers', () => {
      const mockAccount = createMockAccount();
      render(<AccountCard account={mockAccount} />);
      
      // Check for balance accessibility following TESTING.md accessible queries
      const balance = screen.getByLabelText(/account balance/i);
      expect(balance).toBeInTheDocument();
      
      // Check for account name accessibility
      const accountName = screen.getByLabelText(/account name/i);
      expect(accountName).toBeInTheDocument();
      
      // Check for account number accessibility
      const accountNumber = screen.getByLabelText(/account number/i);
      expect(accountNumber).toBeInTheDocument();
    });
  });
});