import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import InventoryDropdowns from './index';
import {
  removeFromPantry,
  updatePantryAmount,
  removeFromGroceries,
  updateGroceryAmount,
  clearGroceries,
  clearPantry
} from '../../store/inventorySlice';

const mockStore = configureStore([]);

describe('InventoryDropdowns Component', () => {
  let store;
  const mockPantryItems = [
    {
      foodId: 'food1',
      amount: 2,
      food: { id: 'food1', name: 'Apples', icon: '🍎' }
    },
    {
      foodId: 'food2',
      amount: 1,
      food: { id: 'food2', name: 'Bread', icon: '🍞' }
    }
  ];

  const mockGroceryItems = [
    {
      foodId: 'food3',
      amount: 3,
      food: { id: 'food3', name: 'Milk', icon: '🥛' }
    },
    {
      foodId: 'food4',
      amount: 2,
      food: { id: 'food4', name: 'Eggs', icon: '🥚' }
    }
  ];

  beforeEach(() => {
    store = mockStore({
      inventory: {
        pantry: mockPantryItems,
        groceries: mockGroceryItems
      }
    });
    store.dispatch = jest.fn();
  });

  const renderWithProviders = (component) => {
    return render(
      <Provider store={store}>
        {component}
      </Provider>
    );
  };

  it('renders pantry and grocery buttons', () => {
    renderWithProviders(<InventoryDropdowns />);
    
    expect(screen.getByText('🗄️')).toBeInTheDocument();
    expect(screen.getByText('🛒')).toBeInTheDocument();
  });

  it('toggles pantry dropdown when clicking pantry button', () => {
    renderWithProviders(<InventoryDropdowns />);
    
    // Initially, pantry content should not be visible
    expect(screen.queryByText('My Pantry')).not.toBeInTheDocument();
    
    // Click the pantry button
    fireEvent.click(screen.getByText('🗄️'));
    
    // Now pantry content should be visible
    expect(screen.getByText('My Pantry')).toBeInTheDocument();
    
    // Click the pantry button again to close
    fireEvent.click(screen.getByText('🗄️'));
    
    // Pantry content should not be visible again
    expect(screen.queryByText('My Pantry')).not.toBeInTheDocument();
  });

  it('toggles grocery dropdown when clicking grocery button', () => {
    renderWithProviders(<InventoryDropdowns />);
    
    // Initially, grocery content should not be visible
    expect(screen.queryByText('Shopping List')).not.toBeInTheDocument();
    
    // Click the grocery button
    fireEvent.click(screen.getByText('🛒'));
    
    // Now grocery content should be visible
    expect(screen.getByText('Shopping List')).toBeInTheDocument();
    
    // Click the grocery button again to close
    fireEvent.click(screen.getByText('🛒'));
    
    // Grocery content should not be visible again
    expect(screen.queryByText('Shopping List')).not.toBeInTheDocument();
  });

  it('renders pantry items correctly', () => {
    renderWithProviders(<InventoryDropdowns />);
    
    // Open pantry dropdown
    fireEvent.click(screen.getByText('🗄️'));
    
    // Check if pantry items are rendered
    expect(screen.getByText('Apples')).toBeInTheDocument();
    expect(screen.getByText('Bread')).toBeInTheDocument();
    
    // Check if amounts are correct
    const amountInputs = screen.getAllByRole('spinbutton');
    expect(amountInputs[0].value).toBe('2');
    expect(amountInputs[1].value).toBe('1');
  });

  it('renders grocery items correctly', () => {
    renderWithProviders(<InventoryDropdowns />);
    
    // Open grocery dropdown
    fireEvent.click(screen.getByText('🛒'));
    
    // Check if grocery items are rendered
    expect(screen.getByText('Milk')).toBeInTheDocument();
    expect(screen.getByText('Eggs')).toBeInTheDocument();
    
    // Check if amounts are correct
    const amountInputs = screen.getAllByRole('spinbutton');
    expect(amountInputs[0].value).toBe('3');
    expect(amountInputs[1].value).toBe('2');
  });

  it('dispatches updatePantryAmount action when changing pantry item amount', () => {
    renderWithProviders(<InventoryDropdowns />);
    
    // Open pantry dropdown
    fireEvent.click(screen.getByText('🗄️'));
    
    // Get the amount input for Apples
    const amountInputs = screen.getAllByRole('spinbutton');
    
    // Change the amount
    fireEvent.change(amountInputs[0], { target: { value: '5' } });
    
    // Check if the correct action was dispatched
    expect(store.dispatch).toHaveBeenCalledWith(
      updatePantryAmount({ foodId: 'food1', amount: 5 })
    );
  });

  it('dispatches updateGroceryAmount action when changing grocery item amount', () => {
    renderWithProviders(<InventoryDropdowns />);
    
    // Open grocery dropdown
    fireEvent.click(screen.getByText('🛒'));
    
    // Get the amount input for Milk
    const amountInputs = screen.getAllByRole('spinbutton');
    
    // Change the amount
    fireEvent.change(amountInputs[0], { target: { value: '4' } });
    
    // Check if the correct action was dispatched
    expect(store.dispatch).toHaveBeenCalledWith(
      updateGroceryAmount({ foodId: 'food3', amount: 4 })
    );
  });

  it('dispatches removeFromPantry action when clicking remove button for pantry item', () => {
    renderWithProviders(<InventoryDropdowns />);
    
    // Open pantry dropdown
    fireEvent.click(screen.getByText('🗄️'));
    
    // Click the remove button for Apples
    const removeButton = screen.getByLabelText('Remove Apples');
    fireEvent.click(removeButton);
    
    // Check if the correct action was dispatched
    expect(store.dispatch).toHaveBeenCalledWith(
      removeFromPantry({ foodId: 'food1' })
    );
  });

  it('dispatches removeFromGroceries action when clicking remove button for grocery item', () => {
    renderWithProviders(<InventoryDropdowns />);
    
    // Open grocery dropdown
    fireEvent.click(screen.getByText('🛒'));
    
    // Click the remove button for Milk
    const removeButton = screen.getByLabelText('Remove Milk');
    fireEvent.click(removeButton);
    
    // Check if the correct action was dispatched
    expect(store.dispatch).toHaveBeenCalledWith(
      removeFromGroceries({ foodId: 'food3' })
    );
  });

  it('dispatches clearPantry action when clicking Clear All button in pantry', () => {
    renderWithProviders(<InventoryDropdowns />);
    
    // Open pantry dropdown
    fireEvent.click(screen.getByText('🗄️'));
    
    // Click the Clear All button
    const clearButton = screen.getByText('Clear All');
    fireEvent.click(clearButton);
    
    // Check if the correct action was dispatched
    expect(store.dispatch).toHaveBeenCalledWith(clearPantry());
  });

  it('dispatches clearGroceries action when clicking Clear All button in groceries', () => {
    renderWithProviders(<InventoryDropdowns />);
    
    // Open grocery dropdown
    fireEvent.click(screen.getByText('🛒'));
    
    // Click the Clear All button
    const clearButton = screen.getByText('Clear All');
    fireEvent.click(clearButton);
    
    // Check if the correct action was dispatched
    expect(store.dispatch).toHaveBeenCalledWith(clearGroceries());
  });

  it('shows empty message when pantry is empty', () => {
    store = mockStore({
      inventory: {
        pantry: [],
        groceries: mockGroceryItems
      }
    });
    
    renderWithProviders(<InventoryDropdowns />);
    
    // Open pantry dropdown
    fireEvent.click(screen.getByText('🗄️'));
    
    // Check if empty message is displayed
    expect(screen.getByText('Your pantry is empty')).toBeInTheDocument();
  });

  it('shows empty message when grocery list is empty', () => {
    store = mockStore({
      inventory: {
        pantry: mockPantryItems,
        groceries: []
      }
    });
    
    renderWithProviders(<InventoryDropdowns />);
    
    // Open grocery dropdown
    fireEvent.click(screen.getByText('🛒'));
    
    // Check if empty message is displayed
    expect(screen.getByText('Your shopping list is empty')).toBeInTheDocument();
  });
});