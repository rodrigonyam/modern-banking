# Testing Infrastructure Documentation

## Overview
This project now has a comprehensive testing infrastructure set up using **Vitest** and **React Testing Library**. The testing setup is optimized for TypeScript, React components, and modern development practices.

## 🛠️ Testing Stack

### Core Testing Tools
- **Vitest 4.0.16** - Fast test runner optimized for Vite
- **@testing-library/react** - Component testing with user-centric approach
- **@testing-library/jest-dom** - Extended matchers for DOM assertions
- **@testing-library/user-event** - Realistic user interaction simulation
- **@vitest/ui** - Interactive test UI for development
- **@vitest/coverage-v8** - Code coverage reporting

### Environment
- **jsdom** - DOM simulation for Node.js testing
- **TypeScript** support with path aliases
- **Hot reload** and watch mode for development

## 📁 Project Structure

```
src/
├── test/
│   ├── __tests__/
│   │   ├── simple.test.tsx       # Basic working test example
│   │   └── ...                   # Additional test files
│   ├── setup.ts                  # Global test setup and mocks
│   ├── test-utils.tsx           # Custom render functions and utilities
│   └── mocks.ts                 # Centralized mock implementations
├── components/
│   └── __tests__/               # Component-specific tests
├── contexts/
│   └── __tests__/               # Context and hook tests
└── pages/
    └── __tests__/               # Page component tests
```

## ⚙️ Configuration Files

### vitest.config.ts
- Main test configuration with TypeScript support
- Path aliases matching your Vite config
- Global test setup and coverage configuration
- jsdom environment for DOM testing

### src/test/setup.ts
- Global test environment setup
- Browser API mocks (localStorage, sessionStorage, matchMedia)
- IntersectionObserver mock
- Cleanup between tests

### src/test/test-utils.tsx
- Custom render functions with providers
- Mock data factories
- Provider wrappers (AuthContext, NotificationContext, Router)

### src/test/mocks.ts
- Centralized mock implementations
- Context mocks
- API response mocks
- localStorage utilities

## 🚀 Available Scripts

```bash
# Run tests in watch mode (development)
npm test

# Run all tests once
npm run test:run

# Run tests with UI interface
npm run test:ui

# Run tests with coverage report
npm run test:coverage

# Run specific test file
npm test simple.test.tsx
npx vitest run src/test/__tests__/simple.test.tsx
```

## 📝 Test Examples

### Basic Component Test
```typescript
import { render, screen } from '@testing-library/react';
import { expect, it, describe } from 'vitest';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });
});
```

### User Interaction Test
```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, expect, it } from 'vitest';

it('handles click events', async () => {
  const handleClick = vi.fn();
  render(<Button onClick={handleClick}>Click me</Button>);
  
  await userEvent.click(screen.getByRole('button'));
  expect(handleClick).toHaveBeenCalledOnce();
});
```

### Context Testing
```typescript
import { renderHook } from '@testing-library/react';
import { useAuth } from '../contexts/AuthContext';
import { createWrapper } from '../test/test-utils';

it('provides auth context', () => {
  const wrapper = createWrapper();
  const { result } = renderHook(() => useAuth(), { wrapper });
  
  expect(result.current).toBeDefined();
});
```

## 📊 Coverage Configuration

The coverage is configured with v8 provider and includes:
- **HTML reports** in `coverage/` directory
- **JSON and text** output formats
- **80% threshold** for statements, branches, functions, and lines
- **Excludes** test files, config files, and build outputs

Coverage thresholds:
- Statements: 80%
- Branches: 80%
- Functions: 80%
- Lines: 80%

## 🎯 Working Test Example

A simple working test is available at `src/test/__tests__/simple.test.tsx` that demonstrates:
- Basic component rendering
- User interaction testing
- DOM assertions
- Mock function usage

Run it with: `npm test simple.test.tsx`

## 🔧 Development Workflow

1. **Write tests** alongside your components
2. **Use watch mode** during development: `npm test`
3. **Run coverage** before commits: `npm run test:coverage`
4. **Use test UI** for debugging: `npm run test:ui`
5. **Follow testing patterns** from the examples

## 🛡️ Best Practices

### Test Organization
- Place tests near the code they test
- Use descriptive test names
- Group related tests with `describe` blocks
- Keep tests focused and isolated

### Component Testing
- Test user-visible behavior, not implementation
- Use accessible queries (getByRole, getByLabelText)
- Mock external dependencies
- Test error states and edge cases

### Mocking
- Mock at the boundary (API calls, external libraries)
- Use realistic mock data
- Keep mocks simple and maintainable
- Reset mocks between tests

## 📚 Additional Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Library Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## 🚨 Known Issues

Some example tests may need updates for:
- Component accessibility attributes
- Context provider setup
- Import path resolution
- Mock implementations

The testing infrastructure is ready - focus on writing tests that match your actual components and use cases.