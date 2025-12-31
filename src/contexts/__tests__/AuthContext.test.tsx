import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext';
import { createLocalStorageMock } from '../../test/mocks';

// Mock localStorage
const mockLocalStorage = createLocalStorageMock();
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

// Mock wrapper component
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllTimers();
    vi.useFakeTimers();
    mockLocalStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('provides initial auth state', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    expect(result.current.user).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(typeof result.current.login).toBe('function');
    expect(typeof result.current.logout).toBe('function');
  });

  it('handles successful login with valid credentials', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    let loginResult;
    await act(async () => {
      loginResult = await result.current.login('demo@bank.com', 'demo123');
      // Fast forward timers for async operations
      vi.advanceTimersByTime(1100);
    });
    
    expect(loginResult).toEqual({ success: true });
    expect(result.current.user).toEqual({
      id: 1,
      username: 'demo@bank.com',
      name: 'John Doe',
    });
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      'user',
      JSON.stringify({
        id: 1,
        username: 'demo@bank.com',
        name: 'John Doe',
      })
    );
  });

  it('handles login failure with invalid credentials', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    let loginResult;
    await act(async () => {
      loginResult = await result.current.login('wrong@email.com', 'wrongpass');
      vi.advanceTimersByTime(1100);
    });
    
    expect(loginResult).toEqual({
      success: false,
      error: 'Invalid email or password. Please check your credentials and try again.',
    });
    expect(result.current.user).toBeNull();
    expect(result.current.error).toBe(
      'Invalid email or password. Please check your credentials and try again.'
    );
  });

  it('validates email format', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    let loginResult;
    await act(async () => {
      loginResult = await result.current.login('invalid-email', 'password');
    });
    
    expect(loginResult).toEqual({
      success: false,
      error: 'Please enter a valid email address',
    });
  });

  it('validates required fields', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    let loginResult;
    await act(async () => {
      loginResult = await result.current.login('', '');
    });
    
    expect(loginResult).toEqual({
      success: false,
      error: 'Username and password are required',
    });
  });

  it('validates password length', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    let loginResult;
    await act(async () => {
      loginResult = await result.current.login('test@example.com', '123');
    });
    
    expect(loginResult).toEqual({
      success: false,
      error: 'Password must be at least 6 characters long',
    });
  });

  it('handles logout correctly', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    // First login
    await act(async () => {
      await result.current.login('demo@bank.com', 'demo123');
      vi.advanceTimersByTime(1100);
    });
    
    expect(result.current.user).not.toBeNull();
    
    // Then logout
    await act(async () => {
      await result.current.logout();
      vi.advanceTimersByTime(600);
    });
    
    expect(result.current.user).toBeNull();
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('user');
  });

  it('auto-clears errors after 5 seconds', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    act(() => {
      result.current.login('', '');
    });
    
    expect(result.current.error).toBeTruthy();
    
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    
    expect(result.current.error).toBeNull();
  });

  it('clears error manually', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    await act(async () => {
      await result.current.login('', '');
    });
    
    expect(result.current.error).toBeTruthy();
    
    act(() => {
      result.current.clearError();
    });
    
    expect(result.current.error).toBeNull();
  });

  it('refreshes user from localStorage on mount', () => {
    const userData = {
      id: 1,
      username: 'test@example.com',
      name: 'Test User',
    };
    
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(userData));
    
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    // Should eventually load user from localStorage
    expect(mockLocalStorage.getItem).toHaveBeenCalledWith('user');
  });
});