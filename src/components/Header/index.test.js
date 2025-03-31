import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from './index';

// Mock the child components
jest.mock('../InventoryDropdowns', () => {
  return function MockInventoryDropdowns() {
    return <div data-testid="mock-inventory-dropdowns">Inventory Dropdowns</div>;
  };
});

jest.mock('../FoodJournal', () => {
  return function MockFoodJournal() {
    return <div data-testid="mock-food-journal">Food Journal</div>;
  };
});

describe('Header Component', () => {
  it('renders the logo with correct text', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
    
    expect(screen.getByText('nomnomnomnom')).toBeInTheDocument();
  });

  it('renders the logo with a link to home page', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
    
    const logoLink = screen.getByText('nomnomnomnom').closest('a');
    expect(logoLink).toBeInTheDocument();
    expect(logoLink.getAttribute('href')).toBe('/');
  });

  it('renders the InventoryDropdowns component', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
    
    expect(screen.getByTestId('mock-inventory-dropdowns')).toBeInTheDocument();
  });

  it('renders the FoodJournal component', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
    
    expect(screen.getByTestId('mock-food-journal')).toBeInTheDocument();
  });

  it('renders the profile link with correct href', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
    
    const profileLink = screen.getByText('👤');
    expect(profileLink).toBeInTheDocument();
    expect(profileLink.getAttribute('href')).toBe('/profile');
  });

  it('applies the correct CSS class to the header', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
    
    const headerElement = screen.getByText('nomnomnomnom').closest('header');
    expect(headerElement).toHaveClass('header');
  });
});