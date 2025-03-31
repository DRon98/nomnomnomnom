import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Home from './Home';

// Mock the child components
jest.mock('../components/StateSelector', () => {
  return function MockStateSelector({ type, options, question }) {
    return (
      <div data-testid={`mock-state-selector-${type}`}>
        <div data-testid="question">{question}</div>
      </div>
    );
  };
});

jest.mock('../components/FoodTabs', () => {
  return function MockFoodTabs() {
    return <div data-testid="mock-food-tabs">Food Tabs</div>;
  };
});

jest.mock('../components/MealPlanner', () => {
  return function MockMealPlanner() {
    return <div data-testid="mock-meal-planner">Meal Planner</div>;
  };
});

const mockStore = configureStore([]);

describe('Home Component', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      user: {
        dietaryRestrictions: {
          vegetarian: true,
          glutenFree: false,
          dairyFree: true
        }
      }
    });
  });

  it('renders both StateSelector components with correct props', () => {
    render(
      <Provider store={store}>
        <Home />
      </Provider>
    );
    
    // Check current state selector
    const currentStateSelector = screen.getByTestId('mock-state-selector-current');
    expect(currentStateSelector).toBeInTheDocument();
    expect(screen.getByText('How do you feel today?')).toBeInTheDocument();
    
    // Check desired state selector
    const desiredStateSelector = screen.getByTestId('mock-state-selector-desired');
    expect(desiredStateSelector).toBeInTheDocument();
    expect(screen.getByText('How do you want to feel today?')).toBeInTheDocument();
  });

  it('renders the FoodTabs component', () => {
    render(
      <Provider store={store}>
        <Home />
      </Provider>
    );
    
    expect(screen.getByTestId('mock-food-tabs')).toBeInTheDocument();
  });

  it('renders the MealPlanner component', () => {
    render(
      <Provider store={store}>
        <Home />
      </Provider>
    );
    
    expect(screen.getByTestId('mock-meal-planner')).toBeInTheDocument();
  });

  it('displays dietary restrictions from the Redux store', () => {
    render(
      <Provider store={store}>
        <Home />
      </Provider>
    );
    
    expect(screen.getByText(/Dietary restrictions applied:/)).toBeInTheDocument();
    expect(screen.getByText(/vegetarian, dairyFree/)).toBeInTheDocument();
  });
});