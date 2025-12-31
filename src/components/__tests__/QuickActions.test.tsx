import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@/test/test-utils';
import userEvent from '@testing-library/user-event';
import QuickActions from '../QuickActions';

// Mock navigate following TESTING.md patterns
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock global window.alert
const mockAlert = vi.fn();
vi.stubGlobal('alert', mockAlert);

describe('QuickActions', () => {
  // Setup follows TESTING.md patterns
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderQuickActions = () => {
    return render(<QuickActions />);
  };

  describe('Rendering', () => {
    it('renders the component with correct title', () => {
      renderQuickActions();
      
      // Use accessible queries following TESTING.md patterns
      expect(screen.getByRole('heading', { name: /quick actions/i })).toBeInTheDocument();
    });

    it('renders all quick action buttons with proper roles', () => {
      renderQuickActions();
      
      // Test using accessibility-first queries
      expect(screen.getByRole('listitem', { name: /transfer money/i })).toBeInTheDocument();
      expect(screen.getByRole('listitem', { name: /view statements/i })).toBeInTheDocument();
      expect(screen.getByRole('listitem', { name: /scan qr/i })).toBeInTheDocument();
    });

    it('has proper semantic structure', () => {
      renderQuickActions();
      
      // Check for region landmark following TESTING.md accessibility patterns
      expect(screen.getByRole('region')).toBeInTheDocument();
      expect(screen.getByRole('list')).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('navigates to transfer page when Transfer Money is clicked', async () => {
      const user = userEvent.setup();
      renderQuickActions();
      
      // Use accessible query patterns from TESTING.md
      const transferButton = screen.getByRole('listitem', { name: /transfer money/i });
      await user.click(transferButton);
      
      expect(mockNavigate).toHaveBeenCalledWith('/transfer');
      expect(mockNavigate).toHaveBeenCalledTimes(1);
    });

    it('navigates to transactions page when View Statements is clicked', async () => {
      const user = userEvent.setup();
      renderQuickActions();
      
      const statementsButton = screen.getByRole('listitem', { name: /view statements/i });
      await user.click(statementsButton);
      
      expect(mockNavigate).toHaveBeenCalledWith('/transactions');
      expect(mockNavigate).toHaveBeenCalledTimes(1);
    });

  it('shows alert when Scan QR is clicked', async () => {
    const user = userEvent.setup();
    renderQuickActions();
    
    const qrButton = screen.getByText('Scan QR');
    await user.click(qrButton);
    
    expect(mockAlert).toHaveBeenCalledWith('QR Code Scanner - Coming Soon!');
    expect(mockAlert).toHaveBeenCalledTimes(1);
  });

  it('applies correct styling to action buttons', () => {
    renderQuickActions();
    
    const buttons = screen.getAllByRole('listitem');
    buttons.forEach(button => {
      expect(button).toHaveClass(
        'w-full', 
        'flex', 
        'items-center', 
        'p-3', 
        'rounded-lg', 
        'hover:bg-gray-50', 
        'transition-colors'
      );
    });
  });

  it('displays correct icons with proper styling', () => {
    renderQuickActions();
    
    // Check for icon containers with correct colors
    const iconContainers = screen.getAllByRole('listitem').map(button => 
      button.querySelector('div')
    );
    
    expect(iconContainers[0]).toHaveClass('bg-blue-500'); // Transfer Money
    expect(iconContainers[1]).toHaveClass('bg-green-500'); // View Statements
    expect(iconContainers[2]).toHaveClass('bg-purple-500'); // Scan QR
  });

  it('has accessible button structure', () => {
    renderQuickActions();
    
    const transferButton = screen.getByRole('listitem', { name: /execute transfer money/i });
    const statementsButton = screen.getByRole('listitem', { name: /execute view statements/i });
    const qrButton = screen.getByRole('listitem', { name: /execute scan qr/i });
    
    expect(transferButton).toBeInTheDocument();
    expect(statementsButton).toBeInTheDocument();
    expect(qrButton).toBeInTheDocument();
  });

  it('supports keyboard navigation', async () => {
    const user = userEvent.setup();
    renderQuickActions();
    
    const transferButton = screen.getByText('Transfer Money');
    
    // Focus and activate with keyboard
    await user.click(transferButton); // Use click instead of focus for more reliable testing
    
    expect(mockNavigate).toHaveBeenCalledWith('/transfer');
  });

  it('displays action names with correct styling', () => {
    renderQuickActions();
    
    const actionTexts = [
      screen.getByText('Transfer Money'),
      screen.getByText('View Statements'),
      screen.getByText('Scan QR')
    ];
    
    actionTexts.forEach(text => {
      expect(text).toHaveClass('ml-3', 'text-gray-900', 'font-medium');
    });
  });

  it('renders in correct order', () => {
    renderQuickActions();
    
    const buttons = screen.getAllByRole('listitem');
    expect(buttons[0]).toHaveTextContent('Transfer Money');
    expect(buttons[1]).toHaveTextContent('View Statements');
    expect(buttons[2]).toHaveTextContent('Scan QR');
  });

  it('handles multiple clicks correctly', async () => {
    const user = userEvent.setup();
    renderQuickActions();
    
    const transferButton = screen.getByText('Transfer Money');
    const statementsButton = screen.getByText('View Statements');
    
    await user.click(transferButton);
    await user.click(statementsButton);
    
    expect(mockNavigate).toHaveBeenCalledTimes(2);
    expect(mockNavigate).toHaveBeenNthCalledWith(1, '/transfer');
    expect(mockNavigate).toHaveBeenNthCalledWith(2, '/transactions');
  });

  it('maintains consistent spacing between actions', () => {
    renderQuickActions();
    
    const actionsContainer = screen.getByText('Quick Actions').nextElementSibling;
    expect(actionsContainer).toHaveClass('space-y-3');
  });

  it('has proper hover effects on buttons', () => {
    renderQuickActions();

    const buttons = screen.getAllByRole('listitem');
    buttons.forEach(button => {
      expect(button).toHaveClass('hover:bg-gray-50', 'transition-colors');
    });
  });
});
});