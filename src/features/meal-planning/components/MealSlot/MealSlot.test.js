import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import configureStore from 'redux-mock-store';
import MealSlot from './MealSlot';

const mockStore = configureStore([]);

const mockFood = {
  id: '1',
  name: 'Test Food',
  icon: '🥗',
  category: 'protein',
  calories: 100,
  protein: 10,
  carbs: 5,
  fat: 2,
};

describe('MealSlot', () => {
  const defaultProps = {
    title: 'Breakfast',
    icon: '☀️',
    mealType: 'breakfast',
    foods: [],
  };

  const renderWithProviders = (props = {}) => {
    const store = mockStore({
      mealPlan: {
        mealTimes: {
          breakfast: '08:00',
          lunch: '12:30',
          dinner: '19:00',
          snacks: '15:00'
        }
      }
    });

    return render(
      <Provider store={store}>
        <DndProvider backend={HTML5Backend}>
          <MealSlot {...defaultProps} {...props} />
        </DndProvider>
      </Provider>
    );
  };

  describe('Simple View', () => {
    it('renders with empty state', () => {
      renderWithProviders({ isSimpleView: true });
      expect(screen.getByText('No foods added yet')).toBeInTheDocument();
    });

    it('renders with foods', () => {
      renderWithProviders({
        isSimpleView: true,
        foods: [mockFood]
      });
      expect(screen.getByText('Test Food')).toBeInTheDocument();
    });

    it('calls onAddFood when Add Food button is clicked', () => {
      const onAddFood = jest.fn();
      renderWithProviders({
        isSimpleView: true,
        onAddFood
      });
      
      fireEvent.click(screen.getByText('Add Food'));
      expect(onAddFood).toHaveBeenCalledWith('breakfast');
    });

    it('calls onRemoveFood when remove button is clicked', () => {
      const onRemoveFood = jest.fn();
      renderWithProviders({
        isSimpleView: true,
        foods: [mockFood],
        onRemoveFood
      });
      
      const removeButton = screen.getByRole('button', { name: /remove/i });
      fireEvent.click(removeButton);
      expect(onRemoveFood).toHaveBeenCalledWith('breakfast', '1');
    });
  });

  describe('Complex View (Drag & Drop)', () => {
    it('renders with empty state', () => {
      renderWithProviders();
      expect(screen.getByText('Drag a food here')).toBeInTheDocument();
    });

    it('renders with foods', () => {
      renderWithProviders({
        foods: [{
          ...mockFood,
          mealId: 'meal-1'
        }]
      });
      expect(screen.getByText('Test Food')).toBeInTheDocument();
    });

    it('shows time editor on time click', () => {
      renderWithProviders();
      const timeElement = screen.getByText('08:00');
      fireEvent.click(timeElement);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('shows copy button when foods exist and onCopyToDay is provided', () => {
      const onCopyToDay = jest.fn();
      renderWithProviders({
        foods: [{ ...mockFood, mealId: 'meal-1' }],
        onCopyToDay
      });
      
      const copyButton = screen.getByText('Copy to Other Days');
      expect(copyButton).toBeInTheDocument();
      
      fireEvent.click(copyButton);
      expect(onCopyToDay).toHaveBeenCalled();
    });
  });

  describe('Common Functionality', () => {
    it('renders title and icon', () => {
      renderWithProviders();
      expect(screen.getByText('Breakfast')).toBeInTheDocument();
      expect(screen.getByText('☀️')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      const { container } = renderWithProviders({
        className: 'custom-class'
      });
      expect(container.firstChild).toHaveClass('custom-class');
    });
  });
}); 