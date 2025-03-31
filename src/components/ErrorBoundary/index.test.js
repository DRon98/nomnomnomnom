import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorBoundary from './index';

// Create a component that will throw an error when rendered
const ErrorThrowingComponent = () => {
  throw new Error('Test error');
  return <div>This will not render</div>;
};

// Create a component that will not throw an error
const NormalComponent = () => {
  return <div data-testid="normal-component">Normal Component</div>;
};

// Mock console.error to prevent test output pollution
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
});

describe('ErrorBoundary Component', () => {
  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <NormalComponent />
      </ErrorBoundary>
    );
    
    expect(screen.getByTestId('normal-component')).toBeInTheDocument();
  });

  it('renders fallback UI when child component throws an error', () => {
    // We need to suppress the error boundary console output for this test
    jest.spyOn(console, 'error').mockImplementation(() => {});
    
    render(
      <ErrorBoundary>
        <ErrorThrowingComponent />
      </ErrorBoundary>
    );
    
    // Check if the error message is displayed
    expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
    expect(screen.getByText('Error Details')).toBeInTheDocument();
    
    // Restore console.error
    console.error.mockRestore();
  });

  it('provides a reload button that calls window.location.reload', () => {
    // Mock window.location.reload
    const mockReload = jest.fn();
    Object.defineProperty(window, 'location', {
      value: { reload: mockReload },
      writable: true
    });
    
    // Render with error
    jest.spyOn(console, 'error').mockImplementation(() => {});
    
    render(
      <ErrorBoundary>
        <ErrorThrowingComponent />
      </ErrorBoundary>
    );
    
    // Click the reload button
    const reloadButton = screen.getByText('Reload Page');
    fireEvent.click(reloadButton);
    
    // Check if reload was called
    expect(mockReload).toHaveBeenCalledTimes(1);
    
    // Restore mocks
    console.error.mockRestore();
  });
});