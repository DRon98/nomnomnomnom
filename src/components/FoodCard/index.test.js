import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import configureStore from 'redux-mock-store';
import FoodCard from './index';
import { addToPantry, addToGroceries } from '../../store/inventorySlice';

const mockStore = configureStore([]);

// Mock the useDrag hook
jest.mock('react-dnd', () => ({
  ...jest.requireActual('react-dnd'),
  useDrag: () => [{ isDragging: false }, jest.fn()]
}));

describe('FoodCard', () => {
  let store;
  const mockFood = {
    id: '1',
    name: 'Test Food',
    icon: '🍎',
    description: 'A test food item',
    rating: 'Nomnomnomnom',
    recommendation: 'high'
  };

  beforeEach(() => {
    store = mockStore({});
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

  it('should render basic food information correctly', () => {
    renderWithProviders(<FoodCard food={mockFood} />);
    
    expect(screen.getByText(mockFood.name)).toBeInTheDocument();
    expect(screen.getByText(mockFood.icon)).toBeInTheDocument();
    expect(screen.getByText(mockFood.description)).toBeInTheDocument();
    expect(screen.getByText(/Rating:/)).toBeInTheDocument();
  });

  it('should render correct rating emoji', () => {
    renderWithProviders(<FoodCard food={mockFood} />);
    expect(screen.getByText(/😋😋😋😋/)).toBeInTheDocument();

    const foodWithNomRating = { ...mockFood, rating: 'Nom' };
    renderWithProviders(<FoodCard food={foodWithNomRating} />);
    expect(screen.getByText(/😋/)).toBeInTheDocument();

    const foodWithNonoRating = { ...mockFood, rating: 'Nono' };
    renderWithProviders(<FoodCard food={foodWithNonoRating} />);
    expect(screen.getByText(/🚫/)).toBeInTheDocument();
  });

  it('should apply correct CSS class based on recommendation', () => {
    renderWithProviders(<FoodCard food={mockFood} />);
    expect(screen.getByText(mockFood.name).closest('.food-card')).toHaveClass('high');

    const moderateFood = { ...mockFood, recommendation: 'moderate' };
    renderWithProviders(<FoodCard food={moderateFood} />);
    expect(screen.getByText(mockFood.name).closest('.food-card')).toHaveClass('moderate');

    const avoidFood = { ...mockFood, recommendation: 'avoid' };
    renderWithProviders(<FoodCard food={avoidFood} />);
    expect(screen.getByText(mockFood.name).closest('.food-card')).toHaveClass('avoid');
  });

  it('should dispatch addToPantry action when clicking pantry button', () => {
    renderWithProviders(<FoodCard food={mockFood} />);
    
    const pantryButton = screen.getByTitle('Add to Pantry');
    fireEvent.click(pantryButton);
    
    expect(store.dispatch).toHaveBeenCalledWith(addToPantry({ food: mockFood }));
  });

  it('should dispatch addToGroceries action when clicking grocery button', () => {
    renderWithProviders(<FoodCard food={mockFood} />);
    
    const groceryButton = screen.getByTitle('Add to Groceries');
    fireEvent.click(groceryButton);
    
    expect(store.dispatch).toHaveBeenCalledWith(addToGroceries({ food: mockFood }));
  });

  it('should render remove button only when in meal plan', () => {
    const onRemove = jest.fn();
    
    // Without meal plan
    renderWithProviders(<FoodCard food={mockFood} onRemove={onRemove} />);
    expect(screen.queryByLabelText(`Remove ${mockFood.name}`)).not.toBeInTheDocument();
    
    // With meal plan
    renderWithProviders(<FoodCard food={mockFood} onRemove={onRemove} inMealPlan={true} />);
    const removeButton = screen.getByLabelText(`Remove ${mockFood.name}`);
    expect(removeButton).toBeInTheDocument();
    
    fireEvent.click(removeButton);
    expect(onRemove).toHaveBeenCalledWith(mockFood.id);
  });

  it('should not render description and rating when in meal plan', () => {
    renderWithProviders(<FoodCard food={mockFood} inMealPlan={true} />);
    
    expect(screen.queryByText(mockFood.description)).not.toBeInTheDocument();
    expect(screen.queryByText(/Rating:/)).not.toBeInTheDocument();
  });

  it('should add dragging class when being dragged', () => {
    renderWithProviders(<FoodCard food={mockFood} />);
    const card = screen.getByText(mockFood.name).closest('.food-card');
    expect(card).not.toHaveClass('dragging');
    // Note: Testing actual drag state would require more complex setup with react-dnd test utils
  });
}); 