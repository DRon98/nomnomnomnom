import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import NotFound from './NotFound';

describe('NotFound Component', () => {
  it('renders the not found message', () => {
    render(
      <BrowserRouter>
        <NotFound />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Page Not Found')).toBeInTheDocument();
    expect(screen.getByText('The page you are looking for does not exist.')).toBeInTheDocument();
  });

  it('renders a link back to home page', () => {
    render(
      <BrowserRouter>
        <NotFound />
      </BrowserRouter>
    );
    
    const homeLink = screen.getByText('Go back to Home');
    expect(homeLink).toBeInTheDocument();
    expect(homeLink.getAttribute('href')).toBe('/');
  });

  it('applies correct CSS classes', () => {
    render(
      <BrowserRouter>
        <NotFound />
      </BrowserRouter>
    );
    
    const container = screen.getByText('Page Not Found').closest('div');
    expect(container).toHaveClass('not-found-page');
    
    const homeLink = screen.getByText('Go back to Home');
    expect(homeLink).toHaveClass('home-link');
  });
});