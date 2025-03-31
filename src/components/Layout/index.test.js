import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Layout from './index';

// Mock the Header component
jest.mock('../Header', () => {
  return function MockHeader() {
    return <div data-testid="mock-header">Header Component</div>;
  };
});

// Mock the Outlet component from react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Outlet: () => <div data-testid="mock-outlet">Outlet Content</div>
}));

describe('Layout Component', () => {
  it('renders Header component', () => {
    render(
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    );
    
    expect(screen.getByTestId('mock-header')).toBeInTheDocument();
  });

  it('renders Outlet component', () => {
    render(
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    );
    
    expect(screen.getByTestId('mock-outlet')).toBeInTheDocument();
  });

  it('renders with correct container class', () => {
    render(
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    );
    
    const containerElement = screen.getByTestId('mock-header').parentElement;
    expect(containerElement).toHaveClass('container');
  });
});