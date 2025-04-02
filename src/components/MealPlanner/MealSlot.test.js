import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MealSlot from './MealSlot';
import { MEAL_TYPES } from '../../constants';

const mockFood = {
  id: '1',
  name: 'Test Food',
  category: 'protein',
  calories: 100,
  protein: 10,
  carbs: 5,
  fat: 2,
};

describe('MealSlot', () => {
  const defaultProps = {
    mealType: MEAL_TYPES.BREAKFAST,
    foods: [],
    onAddFood: jest.fn(),
    onRemoveFood: jest.fn(),
  };

  it('renders with empty state', () => {
    render(<MealSlot {...defaultProps} />);
    expect(screen.getByText('No foods added yet')).toBeInTheDocument();
  });

  it('renders with foods', () => {
    render(<MealSlot {...defaultProps} foods={[mockFood]} />);
    expect(screen.getByText('Test Food')).toBeInTheDocument();
    expect(screen.getByText('protein')).toBeInTheDocument();
  });

  it('calls onAddFood when Add Food button is clicked', () => {
    render(<MealSlot {...defaultProps} />);
    fireEvent.click(screen.getByText('Add Food'));
    expect(defaultProps.onAddFood).toHaveBeenCalledWith(MEAL_TYPES.BREAKFAST);
  });

  it('calls onRemoveFood when a food card is clicked', () => {
    render(<MealSlot {...defaultProps} foods={[mockFood]} />);
    fireEvent.click(screen.getByText('Test Food'));
    expect(defaultProps.onRemoveFood).toHaveBeenCalledWith(MEAL_TYPES.BREAKFAST, mockFood);
  });

  it('displays correct meal type', () => {
    render(<MealSlot {...defaultProps} />);
    expect(screen.getByText('breakfast')).toBeInTheDocument();
  });
}); 