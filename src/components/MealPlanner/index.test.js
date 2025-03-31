import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import configureStore from 'redux-mock-store';
import MealPlanner from './index';
import { clearMealPlan, generateRandomPlan } from '../../store/mealPlanSlice';

const mockStore = configureStore([]);

// Mock the useDrop hook
jest.mock('react-dnd', () => ({
  ...jest.requireActual('react-dnd'),
  useDrop: () => [{ isOver: false }, jest.fn()]
}));

// Mock the generateMealPlan function
jest.mock('../../utils/foodGenerator', () => ({
  generateMealPlan: jest.fn().mockReturnValue({
    breakfast: [{ id: 'breakfast1', name: 'Oatmeal', icon: '🥣' }],
    lunch: [{ id: 'lunch1', name: 'Salad', icon: '🥗' }],
    dinner: [{ id: 'dinner1', name: 'Salmon', icon: '🐟' }],
    snacks: [{ id: 'snack1', name: 'Apple', icon: '🍎' }]
  })
}));

describe('MealPlanner Component', () => {
  let store;
  const mockMealPlan = {
    breakfast: [{ id: 'breakfast1', name: 'Oatmeal', icon: '🥣' }],
    lunch: [{ id: 'lunch1', name: 'Salad', icon: '🥗' }],
    dinner: [{ id: 'dinner1', name: 'Salmon', icon: '🐟' }],
    snacks: [{ id: 'snack1', name: 'Apple', icon: '🍎' }],
    mealTimes: {
      breakfast: '08:00',
      lunch: '12:00',
      dinner: '18:00',
      snacks: '15:00'
    }
  };

  const mockRecommendedFoods = [
    { id: 'food1', name: 'Oatmeal', icon: '🥣' },
    { id: 'food2', name: 'Salad', icon: '🥗' },
    { id: 'food3', name: 'Salmon', icon: '🐟' },
    { id: 'food4', name: 'Apple', icon: '🍎' }
  ];

  beforeEach(() => {
    store = mockStore({
      mealPlan: mockMealPlan,
      foods: {
        recommendedFoods: mockRecommendedFoods
      }
    });
    store.dispatch = jest.fn();
  });

  const renderWithProviders = (component) => {
    return render(
      <Provider store={store}>
        <DndProvider backend={HTML5Backend}>
          {component}
        </DndProvider>
      </Provider>
    );
  };

  it('renders the meal planner title correctly', () => {
    renderWithProviders(<MealPlanner />);
    expect(screen.getByText('Plan Your Day')).toBeInTheDocument();
  });

  it('renders all meal slots with correct titles', () => {
    renderWithProviders(<MealPlanner />);
    
    expect(screen.getByText('Breakfast')).toBeInTheDocument();
    expect(screen.getByText('Lunch')).toBeInTheDocument();
    expect(screen.getByText('Dinner')).toBeInTheDocument();
    expect(screen.getByText('Snacks')).toBeInTheDocument();
  });

  it('renders meal times correctly', () => {
    renderWithProviders(<MealPlanner />);
    
    expect(screen.getByText('08:00')).toBeInTheDocument();
    expect(screen.getByText('12:00')).toBeInTheDocument();
    expect(screen.getByText('18:00')).toBeInTheDocument();
    expect(screen.getByText('15:00')).toBeInTheDocument();
  });

  it('renders food cards in meal slots', () => {
    renderWithProviders(<MealPlanner />);
    
    expect(screen.getAllByText('Oatmeal')).toHaveLength(1);
    expect(screen.getAllByText('Salad')).toHaveLength(1);
    expect(screen.getAllByText('Salmon')).toHaveLength(1);
    expect(screen.getAllByText('Apple')).toHaveLength(1);
  });

  it('dispatches generateRandomPlan action when clicking Generate Plan button', () => {
    renderWithProviders(<MealPlanner />);
    
    const generateButton = screen.getByText('Generate Plan');
    fireEvent.click(generateButton);
    
    expect(store.dispatch).toHaveBeenCalledWith(
      generateRandomPlan(expect.objectContaining({
        breakfast: expect.any(Array),
        lunch: expect.any(Array),
        dinner: expect.any(Array),
        snacks: expect.any(Array)
      }))
    );
  });

  it('dispatches clearMealPlan action when clicking Clear Plan button', () => {
    renderWithProviders(<MealPlanner />);
    
    const clearButton = screen.getByText('Clear Plan');
    fireEvent.click(clearButton);
    
    expect(store.dispatch).toHaveBeenCalledWith(clearMealPlan());
  });

  it('disables Generate Plan button when no recommended foods are available', () => {
    store = mockStore({
      mealPlan: mockMealPlan,
      foods: {
        recommendedFoods: []
      }
    });
    
    renderWithProviders(<MealPlanner />);
    
    const generateButton = screen.getByText('Generate Plan');
    expect(generateButton).toBeDisabled();
  });

  it('shows placeholder text when no foods in meal slot', () => {
    store = mockStore({
      mealPlan: {
        ...mockMealPlan,
        breakfast: [],
        lunch: [],
        dinner: [],
        snacks: []
      },
      foods: {
        recommendedFoods: mockRecommendedFoods
      }
    });
    
    renderWithProviders(<MealPlanner />);
    
    const placeholders = screen.getAllByText('Drag a food here');
    expect(placeholders).toHaveLength(4);
  });
});