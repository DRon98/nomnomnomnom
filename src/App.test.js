import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import App from './App';

// Mock the components used in App
jest.mock('./components/Layout', () => {
  return function MockLayout() {
    return <div data-testid="mock-layout">Layout Component</div>;
  };
});

jest.mock('./pages/Home', () => {
  return function MockHome() {
    return <div data-testid="mock-home">Home Component</div>;
  };
});

jest.mock('./pages/NotFound', () => {
  return function MockNotFound() {
    return <div data-testid="mock-not-found">NotFound Component</div>;
  };
});

jest.mock('./components/ErrorBoundary', () => {
  return function MockErrorBoundary({ children }) {
    return <div data-testid="mock-error-boundary">{children}</div>;
  };
});

// Mock BrowserRouter to avoid actual routing
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  BrowserRouter: ({ children }) => <div data-testid="mock-browser-router">{children}</div>,
  Routes: ({ children }) => <div data-testid="mock-routes">{children}</div>,
  Route: ({ path, element, index }) => (
    <div data-testid={`mock-route-${path || (index === true ? 'index' : '')}`}>
      {element}
    </div>
  ),
}));

const mockStore = configureStore([]);

describe('App Component', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      user: {
        dietaryRestrictions: {}
      }
    });
  });

  it('renders without crashing', () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    
    // Check if ErrorBoundary is rendered
    expect(screen.getByTestId('mock-error-boundary')).toBeInTheDocument();
    
    // Check if BrowserRouter is rendered
    expect(screen.getByTestId('mock-browser-router')).toBeInTheDocument();
    
    // Check if Routes component is rendered
    expect(screen.getByTestId('mock-routes')).toBeInTheDocument();
  });

//   it('renders the correct route structure', () => {
//     render(
//       <Provider store={store}>
//         <App />
//       </Provider>
//     );
    
//     // Check if the root route is rendered
//     expect(screen.getByTestId('mock-route-/')).toBeInTheDocument();
    
//     // Check if the index route is rendered
//   //  expect(screen.getByTestId('mock-route-index')).toBeInTheDocument();
    
//     // Check if the wildcard route is rendered
//     expect(screen.getByTestId('mock-route-*')).toBeInTheDocument();
//   });
 });